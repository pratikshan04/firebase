var BulkAction = {};
(function () {
	var regex = new RegExp('/', 'g');
	BulkAction.addToCart = function (obj, type) {
		var checkboxes = $(".selectedItems:checked");
		if (checkboxes.length > 0) {
			var myObject = new Object();
			var jsonObj = [];
			for (var i = 0; i < checkboxes.length; i++) {
				var ErrorMsg = "";
				var eachObj = checkboxes[i];
				var item = {};
				var itemID = $(eachObj).data("itemid");
				var itemPriceID = $(eachObj).data("itempriceid");
				var partNumber = $(eachObj).data("partnumber");
				var minOrderQty = (parseInt($("#MinOrderQty_" + partNumber).val())) != "NaN" || parseInt($("#MinOrderQty_" + partNumber).val()) != 0 ? parseInt($("#MinOrderQty_" + partNumber).val()) : 1;
				var quantityInterval = (parseInt($("#OrderQtyInterval_" + partNumber).val())) != "NaN" || parseInt($("#OrderQtyInterval_" + partNumber).val()) != 0 ? parseInt($("#OrderQtyInterval_" + partNumber).val()) : 1;
				var qty = $.trim(parseInt($("#itemTxtQty" + itemID).val()));
				var addItem = true;
				if (typeof (partNumber) == "string") {
					partNumber = partNumber.replace(regex, '\\/');
				}
				item["partNumber"] = $(eachObj).data("partnumber");
				item["itemId"] = $(eachObj).data("itemid");
				item["itemPriceId"] = $(eachObj).data("itempriceid");
				item["orderInterval"] = quantityInterval;
				item["MinimumOrderQuantity"] = minOrderQty;
				item["uom"] = $("#uomValue_" + partNumber).val();
				item["unitPrice"] = $("#priceValue_" + partNumber).val();
				item["price"] = $("#priceValue_" + partNumber).val();
				item["availQty"] = $("#itemTxtSXAvail" + partNumber).val();


				if (qty == "NaN") {
					ErrorMsg = ErrorMsg + "Invalid Qty. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					$("#itemTxtQty" + itemID).val(minOrderQty);
					addItem = false;
				} else if (qty < 1) {
					ErrorMsg = "Quantity Cannot be less than or equal to 0. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					addItem = false;
				}
				if (qty < minOrderQty) {
					ErrorMsg = "Min Order Quantity is " + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					addItem = false;
				} else if (qty > minOrderQty) {
					var qtyDiff = qty - minOrderQty;
					if (qtyDiff % quantityInterval != 0) {
						ErrorMsg = "Quantity Interval is " + quantityInterval + " Minimum Order Qty is:" + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
						addItem = false;
					}
				}
				if (!addItem) {
					var confirmMin = BulkAction.confirmMinOrder(ErrorMsg);
					if (confirmMin) {
						item["qty"] = minOrderQty;
						$("#itemTxtQty" + itemID).val(minOrderQty);
						jsonObj.push(item);
						$(eachObj).attr('checked', false);
					} else {
						$(eachObj).attr('checked', false);
					}
				} else {
					item["qty"] = qty;
					jsonObj.push(item);

				}
			}
			if (jsonObj.length > 0) {
				BulkAction.processAddToCart(jsonObj); // //block();
			} else {
				bootAlert("small", "error", "Error", locale("label.error.noItemProcess"));
				BulkAction.refreshBulkSelect();
			}
		} else {
			bootAlert("small", "error", "Error", "No Items Selected.");
			BulkAction.refreshBulkSelect();
		}


	};
	BulkAction.confirmMinOrder = function (ErrorMsg) {
		return confirm(ErrorMsg + '. To Continue with Min Order Qty click "Ok".To cancel this item click "Cancel"');
	};
	BulkAction.refreshBulkSelect = function () {
		$("#bulkAction, #bulkActionSelect").val(''); $('#bulkAction, #bulkActionSelect').selectpicker('refresh');
	};
	BulkAction.loadMyProductGroupData = function () {
		var dataFromCookie = "";
		var jsonObj = [];
		if (typeof (Storage) !== "undefined") {
			//dataFromCookie = localStorage.getItem("selectedItemsAOP");
			dataFromCookie = localStorage.getItem("selectedItemsToGroup");
		} else {
			//dataFromCookie = getCookie("selectedItemsAOP");
			dataFromCookie = getCookie("selectedItemsToGroup");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		if (jsonObj.length > 0) {
			var myObject = new Object();
			myObject.itemDataList = jsonObj;
			var dataStr = 'groupType=P&jsonData=' + JSON.stringify(myObject);
			block("Espere por favor");
			$.ajax({
				type: "POST",
				url: "productListIdNamePage.action",
				data: dataStr,
				success: function (msg) {
					unblock();
					/*$("#productGroupPopup").html(msg);
					$("#productGroupPopup").show();
					$("#searchResultsWrap").hide();*/
					$('#generalModel .modal-body').html(msg);
					$('#generalModel').modal();
					triggerToolTip();
				}
			});
		} else {
			bootAlert("small", "error", "Error", "No Items Selected.");
			BulkAction.refreshBulkSelect();
		}
	};
	BulkAction.processMyProductGroup = function () {
		var checkbox = $(".existingPgListWrap ul li input[type='checkbox']");
		if (checkbox.is(":checked")) {
			var dataFromCookie = "";
			var jsonObj = [];
			if (typeof (Storage) !== "undefined") {
				//dataFromCookie = localStorage.getItem("selectedItemsAOP");
				dataFromCookie = localStorage.getItem("selectedItemsToGroup");
			} else {
				//dataFromCookie = getCookie("selectedItemsAOP");
				dataFromCookie = getCookie("selectedItemsToGroup");
			}
			if (dataFromCookie != null) {
				jsonObj = JSON.parse(dataFromCookie);
			}
			if (jsonObj.length > 0) {
				var allCheckBoxlength = 0;
				$(".multipleProuctGroupCheckbox").each(function () {
					allCheckBoxlength++;
					if ($(this).is(":checked")) {
						var myObject = new Object();
						myObject.groupName = $(this).data("listname");
						myObject.productListId = $(this).data("listid");
						myObject.itemDataList = jsonObj;
						BulkAction.submitMultipleProductGroup(myObject);
					}
					if (allCheckBoxlength == $(".multipleProuctGroupCheckbox").length) {
						if (typeof (Storage) !== "undefined") {
							localStorage.removeItem("selectedItemsAOP");
							localStorage.removeItem("selectedItemsToGroup");
						} else {
							setCookie("selectedItemsAOP", "", -1);
							setCookie("selectedItemsToGroup", "", -1);
						}
						$.each(jsonObj, function (key, value) {
							$.each( $("[id='selectItemCheckbox_"+value.itemId+"']"), function( key, value ) { $(this).prop('checked', false); });
							$.each( $("[id='itemTxtQty"+value.itemId+"']"), function( key, value ) { $(this).prop('disabled', false); });
							if ($('#multipleUom_' + value.partNumber).length > 0) {
								$('#multipleUom_' + value.partNumber).attr('disabled', false);
							}
						});
						$("[data-selectall='CheckBox']").each(function (i) {
							this.checked = false;
						});
					}
				});
				$("#addToCartHeaderContent").html("<h4>Added Successfully To:</h4>");
				$("#multipleProductGroupContent").html('<div class="addNewPgResponse"><ul class="msg"></ul></div>');
				if (typeof (Storage) !== "undefined") {
					localStorage.removeItem("selectedItemsAOP");
					localStorage.removeItem("selectedItemsToGroup");
				} else {
					setCookie("selectedItemsAOP", "", -1);
					setCookie("selectedItemsToGroup", "", -1);
				}
				$.each(jsonObj, function (key, value) {
					$("#selectItemCheckbox_" + value.itemId).attr('checked', false);
					$('#itemTxtQty' + value.itemId).attr("disabled", false);
					if ($('#multipleUom_' + value.partNumber).length > 0) {
						$('#multipleUom_' + value.partNumber).attr('disabled', false);
					}
				});
				$("[data-selectall='CheckBox']").each(function (i) {
					this.checked = false;
				});
			} else {
				bootAlert("small", "error", "Error", "No Items Selected.");
				BulkAction.refreshBulkSelect();
			}
		} else {
			bootAlert("small", "error", "Error", "No Group Selected.");
		}
	};
	BulkAction.submitMultipleProductGroup = function (myObject) {
		var dataStr = 'srchTyp=multiple&jsonData=' + JSON.stringify(myObject);
		return $.ajax({
			type: "POST",
			url: "insertProductListItemPage.action",
			data: dataStr,
			success: function (msg) {
				var result = msg.split("|");
				console.log(result);
				$(".addNewPgResponse ul").append('<li class="hintCorrect"><a class="orangeClr" href="/myProductGroupPage.action?savedGroupId=' + result[1] + '">' + myObject.groupName + '</a></li>');
			}
		});
	};
	BulkAction.addNewProductGroup = function () {
		var groupName = $("#newProductGroupName").val();
		groupName = groupName.trim();
		if (groupName == null || groupName == "") {
			bootAlert("small", "error", "Error", "Please Enter " + locale("product.listOrgroup.name") + " Name");
			return false;
		} else {
			var characterReg = /^[a-zA-Z0-9_-\s]*$/;
			if (characterReg.test(groupName) == false) {
				bootAlert("medium", "error", "Error", "Special characters are not allowed except underscore or hyphen ( _ , - ).");
				return false;
			} else {
				groupName = jQuery.trim(groupName)
				var fullCount = 0;
				$("[data-listname]").each(function () {
					//console.log($(this).attr('data-listname'));
					var headerValue = $(this).attr('data-listname');
					headerValue = jQuery.trim(headerValue);
					if (headerValue.toLowerCase().localeCompare(groupName.toLowerCase()) == 0) {
						fullCount++;
						//$("html, body").animate({scrollTop: $(this).offset().top }, 1000);
						return false;
					}
				});
				if (fullCount > 0) {
					bootAlert("medium", "error", "Error", "Name Already Exist, Please Enter Different Name / Select From Existing List");
				} else {
					var scrubbedName = "";
					if (typeof (groupName) == "string") {
						scrubbedName = groupName.replace(regex, '\\/');
					} else {
						scrubbedName = groupName;
					}
					var newNameHTML = '<li><label for="Pgroup_' + scrubbedName + '" class="customCheckBox"><input type="checkbox" id="Pgroup_' + scrubbedName + '" class="multipleProuctGroupCheckbox" data-listid="0" data-listname="' + groupName + '" checked="true"/><span></span>' + groupName + '</label></li>';
					$(".existingPgListWrap > ul").append(newNameHTML);
					$("#newProductGroupName").val("");
				}

			}
		}
	};
	BulkAction.processAddToCart = function (obj) {
		if (typeof obj[0].requestType == "undefined" || obj[0].requestType == "") {
			if($("#layoutName").val() != "SavedGroupsPage"){
				block('Espere por favor');
			}
		} else {
			if ($("#multipleItemCart_" + obj[0].itemId).length > 0) {
				$("#multipleItemCart_" + obj[0].itemId).find(".mulAddtoCartStatus").html("Cargando...");
			} else if ($("#multipleItemCart_" + obj[0].itemIndex + "_" + obj[0].itemId).length > 0) {
				$("#multipleItemCart_" + obj[0].itemIndex + "_" + obj[0].itemId).find(".mulAddtoCartStatus").html("Cargando...");
			}

		}
		var myObject = new Object();
		myObject.itemDataList = obj;
		var dataStr = 'jsonData=' + JSON.stringify(myObject);
		$.ajax({
			type: "POST",
			url: "addToCartV2Page.action",
			data: dataStr,
			success: function (msg) {

				if (typeof (Storage) !== "undefined") {
					localStorage.removeItem("selectedItemsAOP");
					localStorage.removeItem("selectedItemsToGroup");
					localStorage.removeItem("selectedGroupItems");
				} else {
					setCookie("selectedItemsAOP", "", -1);
				}
				unblock();
				if (typeof obj[0].requestType == "undefined" || obj[0].requestType == "") {
					/*$("#multipleAddToCartResult").html(msg);
					$("#multipleAddToCartResult").show();*/
					$('#generalModel .modal-body').html(msg);
					$('#generalModel').modal();
					triggerToolTip();
					$.each(obj, function (i, value) {
						$("#selectItemCheckbox_" + obj[i].itemId).prop('checked', false);
						$('#itemTxtQty' + obj[i].itemId).attr("disabled", false);
						if ($('#multipleUom_' + obj[i].partNumber).length > 0) {
							$('#multipleUom_' + obj[i].partNumber).attr('disabled', false);
						}
					});
					$("[data-selectall='CheckBox']").each(function (i) {
						this.checked = false;
					});
					$(".quantity").each(function (i) {
						this.disabled = false;
					});
				} else {
					if ($("#multipleItemCart_" + obj[0].itemId).length > 0) {
						$("#multipleItemCart_" + obj[0].itemId).html(msg);
					} else if ($("#multipleItemCart_" + obj[0].itemIndex + "_" + obj[0].itemId).length > 0) {
						$("#multipleItemCart_" + obj[0].itemIndex + "_" + obj[0].itemId).html(msg);
					}

				}

			}
		});

	};
	BulkAction.processSeperateOrCombine = function (eachObj) {
		var itemId = $(eachObj).data("itemid");
		var itemData = $("#dataForCOS_" + itemId);
		var requestType = "";
		var item = {};
		item["itemIndex"] = $(itemData).data("itemindex");
		item["partNumber"] = $(itemData).data("partnumber");
		item["itemId"] = $(eachObj).data("itemid");
		item["itemPriceId"] = $(itemData).data("itempriceid");
		item["orderInterval"] = $(itemData).data("orderinterval");
		item["MinimumOrderQuantity"] = $(itemData).data("minorderqty");
		if ($(itemData).data("uom").indexOf("$") == -1) {
			item["uom"] = $(itemData).data("uom");
		} else {
			item["uom"] = "";
		}
		item["unitPrice"] = $(itemData).data("price");
		item["price"] = $(itemData).data("price");
		item["availQty"] = $(itemData).data("availqty");
		item["qty"] = $(itemData).data("qty");
		if ($(eachObj).data("requsetype") != "undefined") {
			requestType = $(eachObj).data("requestype");
		}
		if (requestType != "") {
			var jsonObj = [];
			item["requestType"] = $(eachObj).data("requestype");
			jsonObj.push(item);
			BulkAction.processAddToCart(jsonObj);
		} else {
			bootAlert("small", "error", "Error", "Something went wrong, Please Try Again.");
		}
	};
	BulkAction.cancelAddToCart = function (itemID, itemIndex) {
		$("#selectItemCheckbox_" + itemID).attr('checked', false);
		$('#itemTxtQty' + itemID).attr("disabled", false);
		$("#multipleItemCart_" + itemIndex + "_" + itemID).remove();
		var dataFromCookie = "";
		var jsonObj = [];
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedItemsAOP");
			dataFromCookie = localStorage.getItem("selectedItemsToGroup");
		} else {
			dataFromCookie = getCookie("selectedItemsAOP");
			dataFromCookie = localStorage.getItem("selectedItemsToGroup");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		if (jsonObj.length > 0) {
			jQuery.each(jsonObj, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObj[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObj[i];
					setVal = true;
				}
				if (setVal) {
					jsonObj = jQuery.grep(jsonObj, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
						localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObj));
					} else {
						setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
						setCookie("selectedItemsToGroup", JSON.stringify(jsonObj), 30);
					}
				}
			});
		}
	};
	BulkAction.enableCheckBoxOnLoad = function () {
		var dataFromCookie = null;
		var productGroupDataFromCookie = null;
		var groupListDataFromCookie = null;
		var jsonObj = [];
		var jsonObjPGroup = [];
		var jsonObjGList = [];
		if (typeof (Storage) !== "undefined") {
			if ($('#layoutName').val() != "ProductGroupPage" && $('#layoutName').val() != "SavedCartPage") {
				dataFromCookie = localStorage.getItem("selectedItemsAOP");
				productGroupDataFromCookie = localStorage.getItem("selectedItemsToGroup");
			} else {
				groupListDataFromCookie = localStorage.getItem("selectedGroupItems");
			}
		} else {
			if ($('#layoutName').val() != "ProductGroupPage" && $('#layoutName').val() != "SavedCartPage") {
				dataFromCookie = getCookie("selectedItemsAOP");
				productGroupDataFromCookie = getCookie("selectedItemsToGroup");
			} else {
				groupListDataFromCookie = localStorage.getItem("selectedGroupItems");
			}
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		if (productGroupDataFromCookie != null) {
			jsonObjPGroup = JSON.parse(productGroupDataFromCookie);
		}
		if (groupListDataFromCookie != null) {
			jsonObjGList = JSON.parse(groupListDataFromCookie);
		}
		if (jsonObj != null) {
			jQuery.each(jsonObj, function (i, val) {
				if (val != null) {
					$("#selectItemCheckbox_" + val.itemId).prop("checked", true);
					$("#itemTxtQty" + val.itemId).prop("disabled", true);
				}
			});
		}
		if (jsonObjPGroup != null) {
			jQuery.each(jsonObjPGroup, function (i, val) {
				if (val != null) {
					$("#selectItemCheckbox_" + val.itemId).attr("checked", true);
					$("#itemTxtQty" + val.itemId).prop("disabled", true);
				}
			});
		}
		if (jsonObjGList != null) {
			jQuery.each(jsonObjGList, function (i, val) {
				if (val != null) {
					$("#selectItemCheckbox_" + val.itemId).attr("checked", true);
					$("#itemTxtQty" + val.itemId).prop("disabled", true);
				}
			});
		}
	};
	BulkAction.addToCartCookie = function () {
		var dataFromCookie = "";
		var jsonObj = [];
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedItemsAOP");
		} else {
			dataFromCookie = getCookie("selectedItemsAOP");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
			if (jsonObj.length > 0) {
				BulkAction.processAddToCart(jsonObj);
			} else {
				if (BulkAction.getListOfCheckBox() > 0) {
					bootAlert("small", "error", "Error", locale('label.quickOrder.cannotAbleToAdd'));
					BulkAction.refreshBulkSelect();
				} else {
					bootAlert("small", "error", "Error", locale("label.error.noItemProcess"));
					BulkAction.refreshBulkSelect();
				}
			}
		} else {
			if (BulkAction.getListOfCheckBox() > 0) {
				bootAlert("small", "error", "Error", locale('label.quickOrder.cannotAbleToAdd'));
				BulkAction.refreshBulkSelect();
			} else {
				bootAlert("small", "error", "Error", locale("label.error.noItemProcess"));
				BulkAction.refreshBulkSelect();
			}
		}
	};
	BulkAction.getListOfCheckBox = function () {
		var count = 0;
		$("input:checkbox[class=selectedItems]").each(function () {
			if ($(this).is(":checked")) {
				count++;
			}
		});
		return count;
	};
	BulkAction.addItemsToCookie = function (eachObj) {
		var dataFromCookie = "";
		var productGroupDataFromCookie = "";
		var ErrorMsg = "";
		var jsonObj = [];
		var jsonObjPGroup = [];
		var addItem = true;
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedItemsAOP");
			productGroupDataFromCookie = localStorage.getItem("selectedItemsToGroup");
		} else {
			dataFromCookie = getCookie("selectedItemsAOP");
			productGroupDataFromCookie = getCookie("selectedItemsToGroup");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		if (productGroupDataFromCookie != null) {
			jsonObjPGroup = JSON.parse(productGroupDataFromCookie);
		}
		var itemID = $(eachObj).data("itemid");
		if ($(eachObj).is(":checked")) {

			$('#itemTxtQty' + itemID).attr("disabled", true);

			if ($('.cimm_multiAddcart').length > 0) {
				$('.cimm_multiAddcart.cimm_multiAddcartQC').show();
			}

			var item = {};
			var itemPriceID = $(eachObj).data("itempriceid");
			var partNumber = $(eachObj).data("partnumber");
			if (typeof (partNumber) == "string") {
				partNumber = partNumber.replace(regex, '\\/');
			}
			var price = parseFloat($("#priceValue_" + partNumber).val());
			var availQty = parseInt($("#itemTxtSXAvail" + partNumber).val());
			var qty = $.trim(parseInt($("#itemTxtQty" + itemID).val()));
			var minOrderQty = (parseInt($("#MinOrderQty_" + partNumber).val())) != "NaN" || parseInt($("#MinOrderQty_" + partNumber).val()) != 0 ? parseInt($("#MinOrderQty_" + partNumber).val()) : 1;
			var quantityInterval = (parseInt($("#OrderQtyInterval_" + partNumber).val())) != "NaN" || parseInt($("#OrderQtyInterval_" + partNumber).val()) != 0 ? parseInt($("#OrderQtyInterval_" + partNumber).val()) : 1;
			if (qty == "NaN") {
				ErrorMsg = ErrorMsg + "Invalid Qty. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				$("#itemTxtQty" + itemID).val(minOrderQty);
				addItem = false;
			} else if (qty < 1) {
				ErrorMsg = "Quantity Cannot be less than or equal to 0. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			}
			if (qty < minOrderQty) {
				ErrorMsg = "Min Order Quantity is " + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			} else if (qty > minOrderQty) {
				var qtyDiff = qty - minOrderQty;
				if (qtyDiff % quantityInterval != 0) {
					ErrorMsg = "Quantity Interval is " + quantityInterval + " Minimum Order Qty is:" + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					addItem = false;
				}
			}

			if ($('#multipleUom_' + partNumber).length > 0) {
				$('#multipleUom_' + partNumber).attr('disabled', true);
			}
			item["partNumber"] = $(eachObj).data("partnumber");
			item["itemId"] = itemID;
			item["itemPriceId"] = itemPriceID;
			item["uom"] = $("#uomValue_" + partNumber).val();
			item["qty"] = qty;
			item["orderInterval"] = quantityInterval;
			item["MinimumOrderQuantity"] = minOrderQty;
			item["price"] = price;
			item["availQty"] = availQty;
			var forCartFlag = false;
			if ($(eachObj).data("addtocartflag") == "Y") {
				forCartFlag = true;
			}

			if (addItem) {

				if (forCartFlag) {
					jsonObj.push(item);
				}
				jsonObjPGroup.push(item);

				if (typeof (Storage) !== "undefined") {

					if (forCartFlag) {
						localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
					}
					localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));

				} else {

					if (forCartFlag) {
						setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
					}
					setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);

				}
			} else {
				var confirmMin = BulkAction.confirmMinOrder(ErrorMsg);
				if (confirmMin) {
					item["qty"] = minOrderQty;
					$("#itemTxtQty" + itemID).val(minOrderQty);

					if (forCartFlag) {
						jsonObj.push(item);
					}
					jsonObjPGroup.push(item);

					if (typeof (Storage) !== "undefined") {

						if (forCartFlag) {
							localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
						}
						localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));

					} else {

						if (forCartFlag) {
							setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
						}
						setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);


					}
				} else {
					$(eachObj).attr('checked', false);
				}
			}

		} else {
			$('#itemTxtQty' + itemID).attr("disabled", false);
			jQuery.each(jsonObj, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObj[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObj[i];
					setVal = true;
					if ($('#multipleUom_' + val.partNumber).length > 0) {
						$('#multipleUom_' + val.partNumber).attr('disabled', false);
					}
				}
				if (setVal) {
					jsonObj = jQuery.grep(jsonObj, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
					} else {
						setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
					}
				}
			});

			jQuery.each(jsonObjPGroup, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObjPGroup[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObjPGroup[i];
					setVal = true;
				}
				if (setVal) {
					jsonObjPGroup = jQuery.grep(jsonObjPGroup, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));
					} else {
						setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);

					}
				}
			});
		}
		checkCookie = localStorage.getItem("selectedItemsToGroup");
		if (checkCookie != "[]" && checkCookie != null) {
			$(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
		} else {
			$(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
		}
	};
	BulkAction.removeAllSussessfullItem = function (eachObj) {
		//Slide off All Successfull Items and uncheck checkbox
	};
	BulkAction.checkMinorderAndOrderInterval = function (obj) {
		$("#Update_" + $(obj).data("itemidrefrence")).prop('disabled', true);
		$("#Update_" + $(obj).data("itemidrefrence")).addClass("btns-disable");
		var addItem = true;
		var qty = $.trim(parseInt($(obj).val()));
		var minOrderQty = (parseInt($(obj).data("minorderqty"))) != "NaN" || parseInt($(obj).data("minorderqty")) != 0 ? parseInt($(obj).data("minorderqty")) : 1;
		var quantityInterval = (parseInt($(obj).data("orderinterval"))) != "NaN" || parseInt($(obj).data("orderinterval")) != 0 ? parseInt($(obj).data("orderinterval")) : 1;
		if (qty == "NaN") {
			ErrorMsg = "Invalid Qty";
			//$(obj).val(minOrderQty);
			addItem = false;
		} else if (qty < 1) {
			ErrorMsg = "Quantity Cannot be less than " + minOrderQty;
			addItem = false;
		} else if (qty < minOrderQty) {
			ErrorMsg = "Min Order Quantity is " + minOrderQty;
			addItem = false;
		} else if (qty > minOrderQty) {
			var qtyDiff = qty - minOrderQty;
			if (qtyDiff % quantityInterval != 0) {
				ErrorMsg = "Quantity Interval is " + quantityInterval + " Minimum Order Qty is " + minOrderQty;
				addItem = false;
			}
		}
		if (addItem) {
			$("#dataForCOS_" + $(obj).data("itemidrefrence")).data("qty", qty);
			$("#errorPtag_" + $(obj).data("itemidrefrence")).html("");
			$("#errorPtag_" + $(obj).data("itemidrefrence")).hide();
			$("#Update_" + $(obj).data("itemidrefrence")).prop('disabled', false);
			$("#Update_" + $(obj).data("itemidrefrence")).removeClass("btns-disable");
		} else {
			$("#errorPtag_" + $(obj).data("itemidrefrence")).show();
			$("#errorPtag_" + $(obj).data("itemidrefrence")).html(ErrorMsg);
		}
	};
	BulkAction.directCheckout = function () {
		if (validateShipFields()) {
			jConfirm("Additional Freight May Apply", 'Please Confirm', function (r) {
				if (r) {
					//block();
					var query = $("#checkoutForm").serialize() + "&AjaxRequest=Y";
					jQuery.ajax({
						type: "POST",
						url: "confirmOrderSale.action",
						data: query,
						success: function (nextStepResponse) {
							//unblock();
							$("#reviewOrderContainer").hide();
							$("#reviewOrderContainer").html(nextStepResponse);
							CheckoutValidate("12");
						}
					});
				}
			});
		}
	};
	BulkAction.saveUserInfoAndGotoCart = function () {
		var query = $("#checkoutForm").serialize() + "&AjaxRequest=Y";
		jQuery.ajax({
			type: "POST",
			url: "confirmOrderSale.action",
			data: query,
			success: function (nextStepResponse) {
				location.href = "/Cart";
			}
		});

	};
	BulkAction.removeSliderAfterAddToCart = function () {
		$('#generalModel').modal('hide');
		$(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
	};
	BulkAction.addGroupItemsToCartCookie = function () {
		var dataFromCookie = "";
		var jsonObj = [];
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedGroupItems");
		} else {
			dataFromCookie = getCookie("selectedGroupItems");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
			if (jsonObj.length > 0) {
				BulkAction.processAddToCart(jsonObj);
			} else {
				if (BulkAction.getListOfCheckBox() > 0) {
					bootAlert("small", "error", "Error", locale('label.quickOrder.cannotAbleToAdd'));
					BulkAction.refreshBulkSelect();
				} else {
					bootAlert("small", "error", "Error", locale("label.error.noItemProcess"));
					BulkAction.refreshBulkSelect();
				}
			}
		} else {
			if (BulkAction.getListOfCheckBox() > 0) {locale
				bootAlert("small", "error", "Error", locale('label.quickOrder.cannotAbleToAdd'));
			} else {
				bootAlert("small", "error", "Error", locale("label.error.noItemProcess"));
			}
		}
		BulkAction.refreshBulkSelect();
		var cartObj = jQuery.parseJSON(dataFromCookie)
		for (var i = 0, len = cartObj.length; i < len; ++i) {
			var cartItem = cartObj[i];
			$("#itemTxtQty" + cartItem.itemId).attr("readonly", false);
		}
	};
	BulkAction.addGroupItemsToCookie = function (eachObj) {
		var dataFromCookie = "";
		var productGroupDataFromCookie = "";
		var ErrorMsg = "";
		var jsonObj = [];
		var jsonObjPGroup = [];
		var addItem = true;
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedGroupItems");
		} else {
			dataFromCookie = getCookie("selectedGroupItems");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		var itemID = $(eachObj).data("itemid");
		if ($(eachObj).is(":checked")) {

			if ($('.cimm_multiAddcart').length > 0) {
				$('.cimm_multiAddcart.cimm_multiAddcartQC').show();
			}
			if ($('#itemTxtQty' + itemID).length > 0) {
				$('#itemTxtQty' + itemID).attr("readonly", true);
			}
			var item = {};
			var itemPriceID = $(eachObj).data("itempriceid");
			var partNumber = $(eachObj).data("partnumber");
			if (typeof (partNumber) == "string") {
				partNumber = partNumber.replace(regex, '\\/');
			}
			var price = parseFloat($("#priceValue_" + partNumber).val());
			var availQty = parseInt($("#itemTxtSXAvail" + partNumber).val());
			var qty = $.trim(parseInt($("#itemTxtQty" + itemID).val()));
			var minOrderQty = (parseInt($("#MinOrderQty_" + partNumber).val())) != "NaN" || parseInt($("#MinOrderQty_" + partNumber).val()) != 0 ? parseInt($("#MinOrderQty_" + partNumber).val()) : 1;
			var quantityInterval = (parseInt($("#OrderQtyInterval_" + partNumber).val())) != "NaN" || parseInt($("#OrderQtyInterval_" + partNumber).val()) != 0 ? parseInt($("#OrderQtyInterval_" + partNumber).val()) : 1;
			if (qty == "NaN") {
				ErrorMsg = ErrorMsg + "Invalid Qty. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				$("#itemTxtQty" + itemID).val(minOrderQty);
				addItem = false;
			} else if (qty < 1) {
				ErrorMsg = "Quantity Cannot be less than or equal to 0. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			}			

			if (qty < parseInt(minOrderQty)) {
				ErrorMsg = "Min Order Quantity is " + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			} else if (qty > parseInt(minOrderQty)) {
				var qtyDiff = qty - minOrderQty;
				if (qtyDiff % quantityInterval != 0) {
					ErrorMsg = "Quantity Interval is " + quantityInterval + " Minimum Order Qty is:" + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					addItem = false;
				}
			}
			item["partNumber"] = $(eachObj).data("partnumber");
			item["itemId"] = itemID;
			item["itemPriceId"] = itemPriceID;
			item["uom"] = $("#uomValue_" + partNumber).val();
			item["qty"] = qty;
			item["orderInterval"] = quantityInterval;
			item["MinimumOrderQuantity"] = minOrderQty;
			item["price"] = price;
			item["availQty"] = availQty;


			var forCartFlag = false;
			if ($(eachObj).data("addtocartflag") == "Y") {
				forCartFlag = true;
			}
			if (addItem) {
				if (forCartFlag) {
					jsonObj.push(item);
				}
				jsonObjPGroup.push(item);

				if (typeof (Storage) !== "undefined") {

					if (forCartFlag) {
						localStorage.setItem("selectedGroupItems", JSON.stringify(jsonObj));
					}
				} else {
					if (forCartFlag) {
						setCookie("selectedGroupItems", JSON.stringify(jsonObj), 30);
					}
				}
			} else {
				var confirmMin = BulkAction.confirmMinOrder(ErrorMsg);
				if (confirmMin) {
					item["qty"] = minOrderQty;
					$("#itemTxtQty" + itemID).val(minOrderQty);

					if (forCartFlag) {
						jsonObj.push(item);
					}
					jsonObjPGroup.push(item);

					if (typeof (Storage) !== "undefined") {

						if (forCartFlag) {
							localStorage.setItem("selectedGroupItems", JSON.stringify(jsonObj));
						}
					} else {
						if (forCartFlag) {
							setCookie("selectedGroupItems", JSON.stringify(jsonObj), 30);
						}
					}

					$(eachObj).attr('checked', false);
					if ($('#itemTxtQty' + itemID).length > 0) {
						$('#itemTxtQty' + itemID).attr("readonly", false);
					}
				} else {
					$(eachObj).attr('checked', false);
					if ($('#itemTxtQty' + itemID).length > 0) {
						$('#itemTxtQty' + itemID).attr("readonly", false);
					}
				}
			}
		} else {
			jQuery.each(jsonObj, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObj[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObj[i];
					setVal = true;
				}
				if (setVal) {
					jsonObj = jQuery.grep(jsonObj, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedGroupItems", JSON.stringify(jsonObj));
					} else {
						setCookie("selectedGroupItems", JSON.stringify(jsonObj), 30);
					}
				}
				if (val != null && $('#itemTxtQty' + itemID).length > 0) {
					$('#itemTxtQty' + val.itemId).attr("readonly", false);
				}
			});
			if ($('#itemTxtQty' + itemID).length > 0) {
				$('#itemTxtQty' + itemID).attr("readonly", false);
			}
		}
		eachCheckBox(eachObj);
	};

	BulkAction.addItemsToCookieV2 = function (eachObj) {
		var dataFromCookie = "";
		var productGroupDataFromCookie = "";
		var ErrorMsg = "";
		var jsonObj = [];
		var jsonObjPGroup = [];
		var addItem = true;
		if (typeof (Storage) !== "undefined") {
			dataFromCookie = localStorage.getItem("selectedItemsAOP");
			productGroupDataFromCookie = localStorage.getItem("selectedItemsToGroup");
		} else {
			dataFromCookie = getCookie("selectedItemsAOP");
			productGroupDataFromCookie = getCookie("selectedItemsToGroup");
		}
		if (dataFromCookie != null) {
			jsonObj = JSON.parse(dataFromCookie);
		}
		if (productGroupDataFromCookie != null) {
			jsonObjPGroup = JSON.parse(productGroupDataFromCookie);
		}
		var itemID = $(eachObj).data("itemid");
		var eachParentObj = $(eachObj).parents('li');
		var qtyBox = eachParentObj.find('#itemTxtQty' + itemID);

		if ($(eachObj).is(":checked")) {

			qtyBox.attr("disabled", true);

			if ($('.cimm_multiAddcart').length > 0) {
				$('.cimm_multiAddcart.cimm_multiAddcartQC').show();
			}

			var item = {};
			var itemPriceID = $(eachObj).data("itempriceid");
			var partNumber = $(eachObj).data("partnumber");
			if (typeof (partNumber) == "string") {
				partNumber = partNumber.replace(regex, '\\/');
			}
			var price = parseFloat($("#priceValue_" + partNumber).val());
			var availQty = parseInt($("#itemTxtSXAvail" + partNumber).val());
			var qty = $.trim(parseInt(qtyBox.val()));
			var minOrderQty = (parseInt($("#MinOrderQty_" + partNumber).val())) != "NaN" || parseInt($("#MinOrderQty_" + partNumber).val()) != 0 ? parseInt($("#MinOrderQty_" + partNumber).val()) : 1;
			var quantityInterval = (parseInt($("#OrderQtyInterval_" + partNumber).val())) != "NaN" || parseInt($("#OrderQtyInterval_" + partNumber).val()) != 0 ? parseInt($("#OrderQtyInterval_" + partNumber).val()) : 1;
			if (qty == "NaN") {
				ErrorMsg = ErrorMsg + "Invalid Qty. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				qtyBox.val(minOrderQty);
				addItem = false;
			} else if (qty < 1) {
				ErrorMsg = "Quantity Cannot be less than or equal to 0. For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			}
			if (qty < minOrderQty) {
				ErrorMsg = "Min Order Quantity is " + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
				addItem = false;
			} else if (qty > minOrderQty) {
				var qtyDiff = qty - minOrderQty;
				if (qtyDiff % quantityInterval != 0) {
					ErrorMsg = "Quantity Interval is " + quantityInterval + " Minimum Order Qty is:" + minOrderQty + ". For " + locale("product.label.partNumber") + ": " + $(eachObj).data("partnumber");
					addItem = false;
				}
			}

			if ($('#multipleUom_' + partNumber).length > 0) {
				$('#multipleUom_' + partNumber).attr('disabled', true);
			}
			item["partNumber"] = $(eachObj).data("partnumber");
			item["itemId"] = itemID;
			item["itemPriceId"] = itemPriceID;
			item["uom"] = $("#uomValue_" + partNumber).val();
			item["qty"] = qty;
			item["orderInterval"] = quantityInterval;
			item["MinimumOrderQuantity"] = minOrderQty;
			item["price"] = price;
			item["availQty"] = availQty;
			var forCartFlag = false;
			if ($(eachObj).data("addtocartflag") == "Y") {
				forCartFlag = true;
			}

			if (addItem) {

				if (forCartFlag) {
					jsonObj.push(item);
				}
				jsonObjPGroup.push(item);

				if (typeof (Storage) !== "undefined") {

					if (forCartFlag) {
						localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
					}
					localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));

				} else {

					if (forCartFlag) {
						setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
					}
					setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);

				}
			} else {
				var confirmMin = BulkAction.confirmMinOrder(ErrorMsg);
				if (confirmMin) {
					item["qty"] = minOrderQty;
					qtyBox.val(minOrderQty);

					if (forCartFlag) {
						jsonObj.push(item);
					}
					jsonObjPGroup.push(item);

					if (typeof (Storage) !== "undefined") {

						if (forCartFlag) {
							localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
						}
						localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));

					} else {

						if (forCartFlag) {
							setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
						}
						setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);


					}
				} else {
					$(eachObj).attr('checked', false);
				}
			}

		} else {
			qtyBox.attr("disabled", false);
			jQuery.each(jsonObj, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObj[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObj[i];
					setVal = true;
					if ($('#multipleUom_' + val.partNumber).length > 0) {
						$('#multipleUom_' + val.partNumber).attr('disabled', false);
					}
				}
				if (setVal) {
					jsonObj = jQuery.grep(jsonObj, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedItemsAOP", JSON.stringify(jsonObj));
					} else {
						setCookie("selectedItemsAOP", JSON.stringify(jsonObj), 30);
					}
				}
			});

			jQuery.each(jsonObjPGroup, function (i, val) {
				var setVal = false;
				if (val == null) {
					delete jsonObjPGroup[i];
					setVal = true;
				}
				if (val != null && val.itemId == itemID) {
					delete jsonObjPGroup[i];
					setVal = true;
				}
				if (setVal) {
					jsonObjPGroup = jQuery.grep(jsonObjPGroup, function (n, i) { return (n !== "" && n != null); });
					if (typeof (Storage) !== "undefined") {
						localStorage.setItem("selectedItemsToGroup", JSON.stringify(jsonObjPGroup));
					} else {
						setCookie("selectedItemsToGroup", JSON.stringify(jsonObjPGroup), 30);

					}
				}
			});
		}
		checkCookie = localStorage.getItem("selectedItemsToGroup");
		if (checkCookie != "[]" && checkCookie != null) {
			$(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
		} else {
			$(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
		}
	};

})();