var priceLoading = {};
function priceLoadMainFunction() {
	var loadPrice = true;
	if(($("#enablePriceBeforeLogin").length>0 && $("#enablePriceBeforeLogin").val()!="Y" 
	&& $("#userLogin").length>0 && $("#userLogin").val()=="false") 
	|| ($('#erpType').length>0 && $('#erpType').val().toUpperCase()=="DEFAULTS")) { 
		loadPrice = false;
	}
	if(loadPrice){
		priceLoading.beginPriceLoading();
	}else{
		if($('#erpType').length>0 && $('#erpType').val().toUpperCase()!="DEFAULTS"){ cleanLoading(); }
	}	
}
(function() {
var markUpPrefixes = {
USER_HOME_BRANCH : "warehousecode",
DEFAULT_BRANCH : "defaultWareHouse",
LAYOUT_NAME : "layoutName",
ERP_TYPE : "erpType",
PRICE_PRECISION : "pricePrecision",
PART_NUMBER : "idListPrice",
PRICE_LOADING_API : "getPriceDetailPage.action",
ITEM_ID : "tempItemId_",
ITEM_QTY : "itemTxtQty",
ITEM_EXT_PRICE_SPAN : "spanEx_",
ALL_BRANCH_AVAILABILITY : "#allBranchHTML",
QTY_BREAK_TABLE_ID : "qtyBreakTable_"
};
function populatePrice(product,priceset,unitprice,price1) {
	price = priceset, partNumber = product.partNumber, qty = 1, priceLabel = "", suggestPrice=price1, minimumPrice=unitprice;
	if (price > 0) {
		priceLabel = preparePriceLabelStr(price, product, suggestPrice, minimumPrice);
		populatePriceLable(product, priceLabel, price);
		enableAddToCart(product.partNumber);
	} else {
		populateCallForPrice(product.partNumber, price);
	}
	populateMinOrderAndOrderInterval(product);
}
function populateMinOrderAndOrderInterval(product) {
	var minOrder = 1, orderInterval = 1;
	if (product.minimumOrderQuantity > 0) {
		minOrder = product.minimumOrderQuantity;
		if (document.getElementById('MinOrderQty_' + product.partNumber)) {
			document.getElementById('MinOrderQty_' + product.partNumber).value = minOrder;
		}
	}
	if (product.orderQuantityInterval > 0) {
		orderInterval = product.orderQuantityInterval;
		if (document.getElementById('OrderQtyInterval_' + product.partNumber)) {
			document.getElementById('OrderQtyInterval_' + product.partNumber).value = orderInterval;
		}
	}
}
function populatePriceLable(product, priceLabel, price) {
	var qty = 1, i = 0; if (product.qty > 0) { qty = product.qty; }
	$.each( $("[id='span_"+product.partNumber+"']"), function( key, value ) { this.innerHTML = priceLabel[0]; });
	$.each( $("[id='spanLinkItem_"+product.partNumber+"']"), function( key, value ) { this.innerHTML = priceLabel; });
	$.each( $("[id='priceValue_"+product.partNumber+"']"), function( key, value ) { this.value = price; });
	$.each( $("[id='spanSuggest_"+product.partNumber+"']"), function( key, value ) { this.innerHTML = priceLabel[1]; });
	$.each( $("[id='spanMinimun_"+product.partNumber+"']"), function( key, value ) { this.innerHTML = priceLabel[2]; });
}
function preparePriceLabelStr(price, product, suggestPrice, minimumPrice) {
	var uom = "", pricePrecision = getPricePrecision();
	var pricestr = "Q" + Number(price).toFixed(pricePrecision);
	var suggestStr = "Q" + Number(suggestPrice).toFixed(pricePrecision);
	var minimumStr = "Q" + Number(minimumPrice).toFixed(pricePrecision);

	var layoutName = getLayoutName();
	if (product.uom && product.uom.length > 0) {
		uom = product.uom;
		if (layoutName === "ProductDetailPage") {
			pricestr = pricestr + " / <em id='prodUOM'>" + product.uom.toUpperCase() + "</em>&nbsp;&nbsp;"
			suggestStr = suggestStr + " / <em id='prodUOM'>" + product.uom.toUpperCase() + "</em>&nbsp;&nbsp;"
			minimumStr = minimumStr + " / <em id='prodUOM'>" + product.uom.toUpperCase() + "</em>&nbsp;&nbsp;"
		} else {
			pricestr = pricestr + " / <em>" + product.uom.toUpperCase()	+ "</em>";
			suggestStr = suggestStr + " / <em>" + product.uom.toUpperCase()	+ "</em>";
			minimumStr = minimumStr + " / <em>" + product.uom.toUpperCase()	+ "</em>";
		}
		if (document.getElementById('uomValue_' + product.partNumber) && (document.getElementById('uomValue_' + product.partNumber).value=="" || document.getElementById('uomValue_' + product.partNumber).value=="undefined")) {
			document.getElementById('uomValue_' + product.partNumber).value = uom;
		}
		if (document.getElementById('uomSpan_' + product.partNumber) && document.getElementById('uomSpan_' + product.partNumber) != null && document.getElementById('uomSpan_' + product.partNumber) != undefined) {
			document.getElementById('uomSpan_' + product.partNumber).innerHTML = uom;
			pricestr = "Q" + Number(price).toFixed(pricePrecision);
			suggestStr = "Q" + Number(suggestPrice).toFixed(pricePrecision);
			minimumStr = "Q" + Number(minimumPrice).toFixed(pricePrecision);
		}
	}
	return [pricestr, suggestStr, minimumStr];
}
function populateCallForPrice(partNumber, price) {
	var itemHolder, callForPriceStr;
	callForPriceStr = "<span class='priceSpan'>"+locale('product.label.callforprice')+"</span>&nbsp;";
	itemHolder = document.getElementById("span_" + partNumber);
	if (itemHolder) {
		itemHolder.innerHTML = callForPriceStr;
	}
	itemHolder = document.getElementById("spanEx_" + partNumber);
	if (itemHolder) {
		itemHolder.innerHTML = callForPriceStr;
	}
	itemHolder = document.getElementById("priceValue_" + partNumber);
	if (itemHolder) {
		itemHolder.value = price;
	}
	itemHolder = document.getElementById("unitPriceValue_" + partNumber);
	if (itemHolder) {
		itemHolder.value = price;
	}
	disableAddToCart(partNumber);
}
function populateAvailability(product) {
	var availability = product.branchTotalQty;
	if (availability && availability > 0) {
		populateAvailabilityLabel(product.partNumber, availability);
	} else {
		populateCallForAvailability(product.partNumber);
	}
}
function populateAllBranchTotal(partNumber, availability) {
	if (availability && availability > 0) {
		populateAvailabilityLabel(partNumber, availability);
	} else {
		populateCallForAvailability(partNumber);
	}
}
function populateAvailabilityLabel(partNumber, availability) {
	//var availabilityStr = "<span class='cimm_color5'>In Stock</span>";
	var availabilityStr = "";
	var itemHolder = document.getElementsByClassName("Avail_"+partNumber);
	var itemHolderlist = document.getElementsByClassName("Available_"+ partNumber);
	var i = 0, eachItem;
	if (itemHolder && itemHolder.length > 0) {
		for (i = 0; i < itemHolder.length; i++) {
			eachItem = itemHolder[0];
			eachItem.innerHTML = availabilityStr;
		}
	}
	if (document.getElementById('itemTxtSXAvail' + partNumber)) {
		document.getElementById('itemTxtSXAvail' + partNumber).value = availability;
	}
	if (itemHolderlist && itemHolderlist.length > 0) {
		for (i = 0; i < itemHolderlist.length; i++) {
			eachItem = itemHolderlist[0];
			eachItem.innerHTML = availabilityStr;
		}
	}
}
function populateCallForAvailability(partNumber) {
	var availabilityStr = "<span class='cimm_color5'>"+locale('product.label.outOfStock')+"</span>";
	if (document.getElementById('itemTxtSXAvail' + partNumber)) {
		document.getElementById('itemTxtSXAvail' + partNumber).value = 0;
	}
	var availabilityElements = document.getElementsByClassName('Avail_'+partNumber);
	if(availabilityElements.length<1){
		availabilityElements = document.getElementById('Avail_'+partNumber);
	}
	if(availabilityElements!=null){
		for (var i = 0; i < availabilityElements.length; i++) {
			var eachElement = availabilityElements[i];
			eachElement.innerHTML = availabilityStr;
		}
	}
}
function populateAllBranchAvailability(product) {
	var branchName, branchAvailability, newBranch;
	branchName = createTableCell(product.branchName);
	branchAvailability = createTableCell(product.branchAvailability);
	newBranch = createTableRow(branchName, branchAvailability);
	appendToAllBranchAvailability(newBranch, product.partNumber);
}
function appendNewBranch(product, branch) {
	$(document.getElementById(markUpPrefixes.ALL_BRANCH_AVAILABILITY + product.partNumber)).append(branch);
}
function createTableRow(branchName, branchAvailability) {
	return "<tr>" + branchName + branchAvailability + "</tr>";
}
function createTableCell(branchData) {
	return "<td class = 'center'> " + branchData + "</td>";
}
function appendToAllBranchAvailability(newBranch, partNumber) {
	if (document.getElementById("allBranchHTML" + partNumber)) {
		var currentTable = document.getElementById("allBranchHTML"+ partNumber);
		var noRecoredRow = document.getElementById("allBranchHTML_NoRec_"+ partNumber);
		if(typeof(noRecoredRow) != "undefined" && noRecoredRow!=null){
			$(noRecoredRow).remove();
		}
		$(currentTable).append(newBranch);
	}
}
function enableAddToCart(partNumber) {
	if (document.getElementById('enableCart_' + partNumber) && document.getElementById('enableCart_' + partNumber).classList) {
		document.getElementById('enableCart_' + partNumber).classList.remove('btns-disable');
		document.getElementById('enableCart_' + partNumber).classList.add('addToCart');
	} else {
		$(document.getElementById("enableCart_" + partNumber)).removeClass('btns-disable');
		$(document.getElementById("enableCart_" + partNumber)).addClass('addToCart');
	}
	$('[data-caddcartbtn="cloneAddtoCartbtn"]').removeClass('btns-disable');
	if (document.querySelector("[data-partnumber='" + partNumber + "']") && document.querySelector("[data-partnumber='" + partNumber + "']").classList) {
		document.querySelector("[data-partnumber='" + partNumber + "']").removeAttribute('disabled');
		document.querySelector("[data-partnumber='" + partNumber + "']").classList.remove('btns-disable');
		var productModeItem = document.querySelector("[data-partnumber='"+ partNumber + "']");
		var itemId = productModeItem.getAttribute('data-itemid');
		if (document.getElementById('selectItemCheckbox_' + itemId)) {
			document.getElementById('selectItemCheckbox_' + itemId).setAttribute('data-addtocartflag', 'Y');
			$('#selectItemCheckbox_' + itemId).parent().removeClass('btns-disable');
		}
	} else {
		$(document.getElementById("[data-partnumber='" + partNumber + "']")).removeAttr('disabled');
		$(document.getElementById("enableCart_" + partNumber)).removeClass('btns-disable');
	}
}
function disableAddToCart(partNumber) {
	if (document.getElementById('enableCart_' + partNumber)	&& document.getElementById('enableCart_' + partNumber).classList) {
		document.getElementById('enableCart_' + partNumber).classList.remove('addToCart');
		document.getElementById('enableCart_' + partNumber).classList.add('btns-disable');
	} else {
		$(document.getElementById("enableCart_" + partNumber)).removeClass('addToCart');
		$(document.getElementById("enableCart_" + partNumber)).addClass('btns-disable');
	}
	if (document.querySelector("[data-partnumber='" + partNumber + "']")) {
		document.querySelector("[data-partnumber='" + partNumber + "']").setAttribute('disabled', 'disabled');
	}
}
function getProductIdentifier() {
	var i, partNumbers = [], partNumberWithUom, uom, partNumber, minOrderQty;
	var partNumberFields = $("input:hidden[name='"+ markUpPrefixes.PART_NUMBER + "']");
	if (partNumberFields && partNumberFields.length > 0) {
		for (i = 0; i < partNumberFields.length; i++) {
			partNumber = partNumberFields[i].value;
			if (document.getElementById('uomValue_' + partNumber)) { uom = document.getElementById('uomValue_' + partNumber).value; }
			if (document.getElementById('MinOrderQty_' + partNumber)) { minOrderQty = document.getElementById('MinOrderQty_' + partNumber).value;
			}else{ minOrderQty=1; }
			partNumberWithUom = "";
			uom="U";
			if (uom) { partNumberWithUom = partNumber + ":" + uom+ ":" +minOrderQty;
			} else { partNumberWithUom = partNumber + ":" + ""+ ":" +minOrderQty; }
			partNumbers.push(partNumberWithUom);
		}
		partNumbers = partNumbers.join(",");
	}
	return partNumbers;
}
function requestPriceLoadingAPI(partNumbers) {
	$.ajax({
		url : markUpPrefixes.PRICE_LOADING_API, type : "POST",
		data : { "productIdList" : partNumbers, "loadAllBranchAvailability" : "Y", "LABAvailability" : "Y" },
		success : function(responseData) {
			if (responseData && responseData !=  '$renderContent') {
				var productDataList = JSON.parse(responseData);
				processPriceLoadingResponse(productDataList);
			} else {
				onPriceLoadingAPIFailure();
				priceLoading.productModeCustomFunc();
				cleanLoadingV2();
			}
		},
		error : function(xhr, status, error) { onPriceLoadingAPIFailure(); priceLoading.productModeCustomFunc(); }
	});
}
function processPriceLoadingResponse(products) {
	var layoutName = getLayoutName();
	var warehouseCode = $('#wareHouseCode').val();
	var totalAvailability=0.0;
	var priceDispalyed=false;
	for (var i = 0; i < products.length; i++) {
		product = products[i];
		if(product.partNumber!=null && product.partNumber!="undefined"){ partNumber = product.partNumber;
		}else{ partNumber = product.erpPartNumber; }
		wareHouseList = product.branchAvail;
		if(wareHouseList.length>0){
			for (var j = 0; j < wareHouseList.length; j++) {
				wareHouseDetails = wareHouseList[j].uomList;
				wareHouseDetails.partNumber = partNumber;
				if (wareHouseDetails[j].branchAvailability !== undefined) { totalAvailability += parseInt(wareHouseDetails[j].branchAvailability); }
				if (wareHouseDetails[j]!= undefined && wareHouseDetails[j].customerPrice != undefined && wareHouseDetails[j].customerPrice > 0 && !priceDispalyed) {
					wareHouseDetails.partNumber = partNumber;
					populatePrice(product,wareHouseDetails[j].customerPrice,wareHouseDetails[j].unitPrice,wareHouseDetails[j].price);
						priceDispalyed = true;
				}
				populateAllBranchAvailability(wareHouseDetails);
			}
		}else{
			if (product.cimm2BCentralPricingWarehouse != undefined && product.cimm2BCentralPricingWarehouse.customerPrice != undefined && product.cimm2BCentralPricingWarehouse.customerPrice > 0 && !priceDispalyed) {
				product.cimm2BCentralPricingWarehouse.partNumber=partNumber;
				populatePrice(product.cimm2BCentralPricingWarehouse);
				priceDispalyed = true;
			}
		}
		if(!priceDispalyed){
			populateCallForPrice(partNumber, 0);
			priceDispalyed = true;
		}
		populateAllBranchTotal(partNumber, totalAvailability); //console.log("total Availability for " + partNumber + " is : " + totalAvailability);
		branchList = [];
		totalAvailability = 0;
		priceDispalyed = false;
		qtyBreakDisplayed = false;
	}
	priceLoading.productModeCustomFunc();
	cleanLoadingV2();
}
function onPriceLoadingAPIFailure() {
	var callForPriceStr = "<span class='cimm_color5'>"+ "Available for Purchase" + "</span>";
	$("input:hidden[name='idListPrice']").each(function(i) {
		var partNumber = $(this).val();
		if (document.getElementById("priceValue_"+ partNumber) && document.getElementById("priceValue_"+ partNumber).value <= 0) {
			if(document.querySelector("[data-select='addtoCartbtn_"+ partNumber + "']")){
				document.querySelector("[data-select='addtoCartbtn_"+ partNumber + "']").innerHTML = '<a href="javascript:void(0);" class="btn btn-addtocart btns-disable">Add to Cart</a>';
			}
		}
		populateCallForPrice(partNumber, 0);
		populateCallForAvailability(partNumber);
		disableAddToCart(partNumber);
	});
}
function getUserHomeBranch() { var userHomeBranch = document.getElementById(markUpPrefixes.USER_HOME_BRANCH).value; return userHomeBranch; }
function getDefaultWareHouse() { var defaultBranch = document.getElementById(markUpPrefixes.DEFAULT_BRANCH).value; return defaultBranch; }
function getLayoutName() { var layoutName = document.getElementById(markUpPrefixes.LAYOUT_NAME).value; return layoutName; }
function getPricePrecision() { var pricePrecision = 2; if (document.getElementById(markUpPrefixes.PRICE_PRECISION)) { pricePrecision = document.getElementById(markUpPrefixes.PRICE_PRECISION).value; } return pricePrecision;}
function getErpType() { var erpType = document.getElementById(markUpPrefixes.ERP_TYPE).value;if(erpType && erpType.toUpperCase()=="DEFAULTS"){ priceLoading.productModeCustomFunc(); erpType = false; }return erpType;}
function validateErpType() { if (getErpType()) { return true; } else { return false; } }
priceLoading.beginProductModePriceLoading = function(itemPriceId) {
	if (validateErpType()) {
		var partNumbers = getProductIdentifier(itemPriceId); //console.log(partNumbers);
		if (partNumbers.length > 0) { requestPriceLoadingAPI(partNumbers.toString());
		} else { cleanLoading(); }
	}
};
priceLoading.beginPriceLoading = function() {
	if (validateErpType()) {
		var partNumbers = getProductIdentifier();
		if (partNumbers.length > 0) { requestPriceLoadingAPI(partNumbers);
		} else { console.info("No Part Number are available");
		}
	} else {
		console.info("ERP Type is not available"); //priceLoading.productModeCustomFunc();
	}
};
priceLoading.productModeCustomFunc = function() {
	var oTable = $('#childItemTable').DataTable({
		"destroy": true,
		"sPaginationType" : "full_numbers",
		"bSort" : false,
		"bLengthChange" : false,
		"pageLength" : 5,
		"sDom" : 'T<"tabHeader"l><"tablesWrap"t><"tabFooter"<"row" <"col-sm-6"i><"col-sm-6"p>>>',
		"dom" : '<"top"i>rt<"bottom"flp><"clear">',
		"language" : {
			"url": "https://cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
			"search" : "_INPUT_",
			"searchPlaceholder" : "Buscar",
			"sLengthMenu" : "Show _MENU_",
			"oPaginate" : {
				"sPrevious" : "Prev",
				"sNext" : "Next"
			}
		},
		"aaSorting" : [ [ 0, 'desc' ] ],
		"pagingType" : "simple_numbers",
		"bJQueryUI" : true,
		"bAutoWidth" : false,
		"columnDefs" : [ {
			orderable : false,
			targets : -1
		} ]
	});
	$('#childItemTable tbody').on('click','td.details-control',function() {
		var tr = $(this).closest('tr');
		var row = oTable.row(tr);
		$(".focusLinkedItemTabs").hide();
		if (row.child.isShown()) {
			row.child.hide();
			tr.removeClass('shown');
			$("#linkedItemContentDiv_" + $(this).attr('id')).hide();
			$("#linkedItemAvailable_" + $(this).attr('id')).hide();
			$('td.details-control em').removeClass('fa-minus-circle').addClass('fa-plus-circle');
		} else if (typeof $(tr).attr("data-detailsload") != "undefined" && $(tr).attr("data-detailsload") == "Y") {
			$("[data-rowid='identification']").each(
					function(i) {
						var trHide = $(this).closest('tr');
						var rowHide = oTable.row(trHide);
						if (rowHide.child.isShown()) {
							rowHide.child.hide();
							trHide.removeClass('shown');
						}
					});
			$("#linkedItemContentDiv_" + $(this).attr('id')).show();
			$("#linkedItemAvailable_" + $(this).attr('id')).show();
			$('td.details-control em').removeClass('fa-minus-circle').addClass('fa-plus-circle');
			$(this).find('em').removeClass('fa-plus-circle').addClass('fa-minus-circle');
			row.child.show();
			tr.addClass('shown');
			$("html, body").animate({
				scrollTop : $(tr).offset().top
			}, 1000);
		} else {
			$("[data-rowid='identification']").each(function(i) {
				var trHide = $(this).closest('tr');
				var rowHide = oTable.row(trHide);
				if (rowHide.child.isShown()) {
					rowHide.child.hide();
					trHide.removeClass('shown');
				}
			});
			block("Espere por favor");
			var itemPriceId = $(this).attr('id');
			var linkedItemExistFlag = false;
			var domTabsExistFlag = false; //$(".focusItemTabs").hide();
			$('td.details-control em').removeClass('fa-minus-circle').addClass('fa-plus-circle');
			$(this).find('em').removeClass('fa-plus-circle').addClass('fa-minus-circle');
			$(tr).attr("data-detailsload", "Y");
			$.ajax({
				type : "POST",
				url : "/itemDetailSolrPage.action?reqType=ItemDetail&codeId="+ $(this).attr('id')+ '&dt=' + new Date(),
				success : function(msg) {
					unblock();
					var addonDetails = "";//console.log("Msg: "+msg);
					if (msg != "") {
						if ($(msg).filter("#productAccordionWrapDetailPageContent").length > 0) {
							addonDetails = $(msg).filter("#productAccordionWrapDetailPageContent").html();
							if (addonDetails != null
									&& addonDetails != "") {
								domTabsExistFlag = true;
							}
						}
						if ($(msg).filter("#linkedItemSectionContent").length > 0 && $(".productAccordionWrap").length > 0) {
							var linkedItemContent = $.trim($(msg).filter("#linkedItemSectionContent").html())
							if (linkedItemContent != null && linkedItemContent != "") {
								$(".productAccordionWrap").html(linkedItemContent);
								linkedItemExistFlag = true;
							}
						}
					}
					if (domTabsExistFlag) {
						row.child(addonDetails).show();
						if (linkedItemExistFlag && $("#addOrRemoveCustomerPartNumberContent").length > 0) {
							$("#addOrRemoveCustomerPartNumberContent").show();
						}
					} else {
						row.child("No Details Available").show();
					}
					tr.addClass('shown');
					ProductMode.customDomTabLoad();// For Dom tab
					if (linkedItemExistFlag) {
						$("#linkedItemContentDiv_"+ itemPriceId).show();
						$("#linkedItemAvailable_"+ itemPriceId).show();
					}
					$("html, body").animate({scrollTop : $(tr).offset().top}, 1000);
					setTimeout($.unblockUI, 100);
				}
			});
		}
	});
};
})();