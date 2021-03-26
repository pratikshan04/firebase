var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
jQuery.getScript(cdnSiteJsPath+'/BulkAction.js', function(){});
$(document).ready(function(){
	$('#cartWrap').DataTable({
		"language": {
			"url": "https://cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
		},
		"ordering": false,
		searching: false,
		"bLengthChange": false,
		"info": false,
		"sDom": 't<"row"<"col-md-6 col-ms-6 col-sm-12 cartPagination"p><"col-md-6 col-ms-6 col-sm-12 cartTotalBlock">>'
	});
	$('.cartTotalBlock').html($("#copyPrice").html());
	jQuery.ajax({ 
		type: "POST",
		url: "/SalesPromotionSynchService.slt?loadKieModule=true",
		data:"",
		success: function(msg){
			console.log(msg);
		}
	});
});
$('[data-function="saveCartFunction"]').click(function() {
	var toggleListID = "#"+$(this).attr('data-listTarget');
	var itemId = $(this).attr('data-itemId');
	$("#group_id").val(toggleListID);
	$("#hidden_id").val(itemId);
	$(toggleListID).html('<li class="text-center"><em class="fa fa-spin fa-spinner"></em></li>');
	$(toggleListID).show();
	jQuery.get("productListIdNamePage.action?productIdList=0&groupType=C",function(data,status){
		$(toggleListID).find("li").remove();
		$(toggleListID).html(data);
	});
});
function submitSaveCart(title,groupId,obj,isReorder){
	var groupName = "";
	if($(obj).attr("data-groupName")!="" && $(obj).attr("data-groupName")!=undefined){
		groupName = $(obj).attr("data-groupName");
	}else{
		groupName = title;
	}
	var toggleListID = $("#group_id").val();
	title = $.trim(title);
	if(localStorage!=null && localStorage.getItem(title)!=null && localStorage.getItem(title)=="Y"){
		bootAlert("small","error","Error",locale('label.cartItems.exists'));
	}
	if(groupId==0)
	{
		if (title == null || title == "") {
			bootAlert("small","error","Error",locale('label.valid.name'));
			return false;
		}else{
			var characterReg = /^[-_ a-zA-Z0-9]+$/;
			if (characterReg.test(title) == false) {
				bootAlert("small","error","Error", locale('label.error.specialcharnotallowed'));
				return false;
			}else{
				$("#group_name").val(title);
				title=title.replace(/#/g, "%23");
				title=title.replace(/&/g, "%26");
				title=title.replace(/;/g, "%3B");
				title = title.replace(/\//g,"%2F");
				title = title.replace(/\?/g,"%3F");
				title = title.replace(/=/g,"%3D");
				title = title.replace(/@/g,"%40");
			}
		}
	}
	jQuery.get('saveCartPage.action?listId='+groupId+'&listName='+title+'&isReOrder='+isReorder,function(data,status){
		$(toggleListID).hide();
		var result = data.split('|');
		//$(toggleListID+"_custPop").html("Cart Saved Successfully - "+ $("#group_name").val()).attr("href","myProductGroupPage.action?savedGroupId="+result[1]).fadeIn();
		$(toggleListID+"_custPop").html("Carrito guardado correctamente - "+ groupName).attr("href","/"+result[1]+"/ProductGroup/Cart?savedGroupName="+groupName).fadeIn();
		setTimeout(function(){$(toggleListID+"_custPop").removeAttr("href").html("").fadeOut();}, 5000);
	});
}
function updateShoppingCart(){
	var str = $("#updateCartForm").serialize();
	var isUpdate = false;
	$.ajax({
		type: "POST",
		url: "checkMinOrderQtyPage.action",
		data: str,
		success: function(msg){
			var result = $.trim(msg);
			if(result==""){
				$("#updateCartForm").attr("id","updateQtyFrm");
				$("#updateQtyFrm").action="updateShoppingCartPage.action";
				updateCartQty();
			}else{

				var valu = msg.replace(/\|/g,"<br/>");
				$("#notificationDiv").show();
				$("#message").hide();
				$("#errorMsg").html(valu);
				$("html, body").animate({ scrollTop: 0 }, "fast");
				if($("#notificationDivCart").length > 0){
					$("#errorMsgCart").html("");
					$("#notificationDivCart").hide();
					$("#errorMsgCart").hide();
				}
				if($("#groupSelectedShipMethod").length > 0) {
					$('select[name^="selectedShipMethod"] option[value="'+$("#groupSelectedShipMethod").val()+'"]').attr("selected","selected");
				}
				$("#updateCartForm")[0].reset();
			}
		}
	});
	return false;
}

function sortByManuPartNo(){
	$("#sortByForm").submit();
}

function updateCartQty(){
	$("#updateQtyFrm").submit();
}

function deleteItem(path,typ,item){
	if(typ!=null && typ=="0"){
		bootbox.confirm({ 
			size: "medium",
			closeButton:false,
			message: locale(label.cart.itemDelete) +item, 
			buttons: {
				cancel: {
					label: 'Cancelar'
				},
				confirm: {
					label: 'Ok'
				}
			},
			callback: function(result){
				processAction(result,path,typ,item);
			}
		});

	}else if(typ!=null && typ=="1"){
		bootbox.confirm({ 
			size: "small",
			closeButton:false,
			message: locale(label.cart.itemAllDelete), 
			buttons: {
				cancel: {
					label: 'Cancelar'
				},
				confirm: {
					label: 'Ok'
				}
			},
			callback: function(result){
				processAction(result,path,typ,item);
			}
		});
	}else{
		bootbox.confirm({ 
			size: "small",
			closeButton:false,
			message: locale('label.cart.itemDelete'), 
			buttons: {
				cancel: {
					label: 'Cancelar'
				},
				confirm: {
					label: 'Ok'
				}
			},
			callback: function(result){
				processAction(result,path,typ,item);
			}
		});
	}
}
function processAction(r,path,typ,item){
	if(r==true && typ!=null && typ=="0"){
		var localStore = getCookie("itemlevelshipviaselected");
		if(typeof localStore!="undefined" && localStore!=null && localStore!="" ){
			shipDescObj = jQuery.parseJSON(localStore);
			for (var key in shipDescObj) {
				if(key = item){
					delete shipDescObj[key];
				}
			}
			setCookie('itemlevelshipviaselected', JSON.stringify(shipDescObj),14);
		}
		window.location.href = path;
	}else if(r==true && typ!=null && typ=="1"){
		deleteCookie("itemlevelshipviaselected");
		window.location.href = path;
	}else if(r==true){
		var localStore = getCookie("itemlevelshipviaselected");
		if(typeof localStore!="undefined" && localStore!=null && localStore!="" ){
			shipDescObj = jQuery.parseJSON(localStore);
			for (var key in shipDescObj) {
				if(key = item){
					delete shipDescObj[key];
				}
			} 
			setCookie('itemlevelshipviaselected', JSON.stringify(shipDescObj),14);
		}
		window.location.href = path;
	}else{
		return false;
	}
}
function refreshShoppingCart(id,partNum){
	var originalPartNumber = partNum;
	//partNum = partNum.replace(/ +/g,"_");
	partNum = partNum.replace(/[#;&,.+*~':"!^$[\]()=>|\/ ]/g, "\\$&");
	var curQty = $("#textQty_"+partNum).val();
	var mpnDisplay = "";
	var mpn="";
	var valu ="";
	var lessThanMinOrder = true;
	if(id != ""){
		$("#refreshCartId").val(id);
		$("#refreshQty").val($("#textQty_"+partNum).val());
		//$("#refreshQty").val($.trim($("[data-cartitemid='"+id+"']").val()));
		$("#lineItemCommentRef").val($("#lineItemComment_"+id).val());
		if($("#requiredByDateRef").length > 0){
			$("#requiredByDateRef").val($("#reqDate_"+id).val());
		}
	}
	var qtyEntered = parseInt($.trim($("#textQty_"+partNum).val()));
	//var qtyEntered = parseInt($.trim($("[data-cartitemid='"+id+"']").val()));
	if($("#mpn_"+partNum).length > 0 && $("#mpnDisplay"+partNum).length > 0){
		mpn = $("#mpn_"+partNum).val();
		mpnDisplay = $("#mpnDisplay"+partNum).val();
	}
	if(qtyEntered!=null){
		var isAddToCart = false;
		var minimumOrderQty = parseInt($.trim($("#MinOrderQty_"+partNum).val()));
		var orderQtyInterval = parseInt($.trim($("#OrderQtyInterval_"+partNum).val()));
		if(qtyEntered == minimumOrderQty || qtyEntered == 0){
			isAddToCart = true;
			lessThanMinOrder = false;
		}else if(qtyEntered > minimumOrderQty){
			lessThanMinOrder = false;
			var qtyDiff = qtyEntered - minimumOrderQty;
			if(qtyDiff%orderQtyInterval==0){//if(qtyDiff%minimumOrderQty==0){
				isAddToCart = true;
			}
		}
		if(isAddToCart){
			var str = $("#refreshForm").serialize();
			$.ajax({
				type: "POST",
				url: "refreshShoppingCartPage.action",
				data: str,
				success: function(msg){
					var result = $.trim(msg);
					if(result=="success"){
						window.location.reload();
					}
				}
			});
			return false;
		}else{
			if(mpnDisplay!=null && mpnDisplay=="Y"){
				if(lessThanMinOrder){
					valu = locale('product.label.mpn') +mpn+ locale('label.cart.multipleAvail') +orderQtyInterval+ locale('label.cart.minorderqty')+" : "+minimumOrderQty;
				}else{
					valu = locale('product.label.mpn') +mpn+ locale('label.cart.multipleAvail') +orderQtyInterval;
				}
			}else{
				if(lessThanMinOrder){
					valu = locale('product.label.partNumber') +originalPartNumber+ locale('label.cart.multipleAvail') +orderQtyInterval+ locale('label.cart.minorderqty')+" : "+minimumOrderQty;
				}else{
					valu = locale('product.label.partNumber') +originalPartNumber+ locale('label.cart.multipleAvail') +orderQtyInterval;
				}
			}
			showNotificationDiv("error", valu);
			$("#updateCartForm")[0].reset();
			return false;
		}
	}else{
		$("#textQty_"+partNum).val(curQty);
		bootAlert("medium","error","Error",locale('label.cartUpdate.toZero'));
	}
}

function changeCartSortBy(){
	$("#updateCartForm").attr("action","shoppingCartPage.action");
	$("#updateCartForm").submit();
	return true;
}
function expressCheckout(){
	var str = $("#updateCartForm").serialize();
	var isUpdate = false;
	$.ajax({
		type: "POST",
		url: "checkMinOrderQtyPage.action",
		data: str,
		success: function(msg){
			var result = $.trim(msg);
			if(result==""){
				if($("#selectedShipVia").length > 0){
					var selectedShipVia = $("#selectedShipVia").val();
					if(selectedShipVia==""){
						bootAlert("small","error","Error","Please Select Shipping Method.");
					}else{
						var selectedShipVia = $("#selectedShipVia").val();
						if(selectedShipVia!=""){
							var shipvia = selectedShipVia.split("|");
							$("#shipVia").val(shipvia[1]);
						}
						$("#updateCartForm").attr("action","expressCheckoutSale.action");
						$("#updateCartForm").submit();
					}
				}else{
					$("#updateCartForm").attr("action","expressCheckoutSale.action");
					$("#updateCartForm").submit();
				}
			}else{

				var valu = msg.replace(/\|/g,"<br/>");
				$("#notificationDiv").show();
				$("#message").hide();
				$("#errorMsg").html(valu);
				$("html, body").animate({ scrollTop: 0 }, "fast");
				if($("#notificationDivCart").length > 0){
					$("#errorMsgCart").html("");
					$("#notificationDivCart").hide();
					$("#errorMsgCart").hide();
				}
				if($("#groupSelectedShipMethod").length > 0) {
					$('select[name^="selectedShipMethod"] option[value="'+$("#groupSelectedShipMethod").val()+'"]').attr("selected","selected");
				}
				$("#updateCartForm")[0].reset();
			}
		}
	});
	return false;
}
function standardCheckout(){
	block("Espere por favor");
	var checkout="N";
	if($("#checkoutpriceValue").length>0){
		checkout = $("#checkoutpriceValue").val();
	}
	if(checkout=="Y"){
		unblock();
		bootAlert("small","error","Error",locale('label.cannot.CheckOutZero'));
		return false;
		
	}else{
		var userLogin = $("#userLogin").val();
		var str = $("#updateCartForm").serialize();
		var isUpdate = false;
	
		var punchoutUser = 0;
		if($("#punchoutUser").length > 0){
			punchoutUser = $("#punchoutUser").val();
		}
		var itemAvailabilityStatus = "Y";
		if($("#itemAvailabilityStatus").length > 0){
			itemAvailabilityStatus = $("#itemAvailabilityStatus").val();
		}
		console.log(punchoutUser);
		$.ajax({
			type: "POST",
			url: "checkMinOrderQtyPage.action",
			data: str,
			success: function(msg){
				var result = $.trim(msg);
				if(result==""){
					if($("#selectedShipVia").length > 0){
						var selectedShipVia = $("#selectedShipVia").val();
						if(selectedShipVia==""){
							unblock();
							bootAlert("small","error","Please Select Shipping Method.");
						}else{
							var selectedShipVia = $("#selectedShipVia").val();
							if(selectedShipVia!=""){
								var shipvia = selectedShipVia.split("|");
								$("#shipVia").val(shipvia[1]);
							}
							if(punchoutUser>0){
								$("#updateCartForm").attr("action","punchoutListDisplay.action");
							}else{
								/*if(typeof userLogin!="undefined" && userLogin=="false" && $('#enableAnonymousCheckout').length>0 && $('#enableAnonymousCheckout').val()=="Y"){
									$("#updateCartForm").attr("action","Login");
								}else{
									$("#updateCartForm").attr("action","checkout.action");
								}*/
								if(typeof userLogin!="undefined" && userLogin=="true"){
									$("#updateCartForm").attr("action","checkout.action");
								}else{
									$("#updateCartForm").attr("action","Login?type=au");
								}
							}
							$("#updateCartForm").submit();
						}
					}else{
						if(punchoutUser>0){
							$("#updateCartForm").attr("action","punchoutListDisplay.action");
						}else{
							if(typeof userLogin!="undefined" && userLogin=="true"){
								$("#updateCartForm").attr("action","checkout.action");
							}else{
								$("#updateCartForm").attr("action","Login?type=au");
							}
						}
						$("#updateCartForm").submit();
					}
				}else{
					unblock();
					var valu = msg.replace(/\|/g,"<br/>");
					$("#notificationDiv").show();
					$("#message").hide();
					$("#errorMsg").html(valu);
					$("html, body").animate({ scrollTop: 0 }, "fast");
					if($("#notificationDivCart").length > 0){
						$("#errorMsgCart").html("");
						$("#notificationDivCart").hide();
						$("#errorMsgCart").hide();
					}
					if($("#groupSelectedShipMethod").length > 0) {
						$('select[name^="selectedShipMethod"] option[value="'+$("#groupSelectedShipMethod").val()+'"]').attr("selected","selected");
					}
					$("#updateCartForm")[0].reset();
				}
			}
		});
		return false;
	}
}
function sendApproval() {
	var appAssignSt = $('#approveAssignStat').val();
	var goStat = "";
	var str = "";
	var neAssigID = "";
	if (appAssignSt == "N" && typeof appAssignSt != "undefined") {
		var iz_checked = "";
		$("input[type='radio']").each(function(){
			if ($(this).is(':checked')) {
				iz_checked = iz_checked + 0;
				neAssigID = $(this).attr("id");
			}
		});
		if(iz_checked.match(/^\d+$/)){
			str = $("#updateCartForm").serialize() + "&approveSenderid=" + neAssigID;
			goStat = "Y";
		}else{
			bootAlert("small","error","Error",locale("cart.submit.assignapproveralertmessage"));
			goStat = "N";
			return false;
		}
	}else if(typeof appAssignSt == "undefined" || appAssignSt == "Y"){
		str = $("#updateCartForm").serialize();
		goStat = "Y";
	}
	if (goStat == "Y"){
		$('#pageLeaveVal').val("0");
		$("#sendApproval").val("Espere por favor..");
		$("#sendApproval").attr("disabled", "disabled");
		block("Espere por favor");
		$.ajax({
			type: "POST",
			url: "sendApprovalSale.action",
			data: str,
			success: function (msg) {
				unblock();
				var arrRes = msg.split("|");
				if ($.trim(arrRes[0]) == "0"){
					bootAlert("small","success",locale('label.alert.success'),locale("cart.submit.approval"));
					$("[data-bb-handler='ok']").click(function(){
						window.location.href = $("base").attr("href") + "Welcome.action";
					})
				}else{
					var result = "";
					for (i = 0; i < (arrRes.length - 1); i++) {
						
						result = result + arrRes[i] + "<br />";
					}
					bootAlert("small","error","Error",arrRes[1]);
					$("#sendApproval").val("Submit Approval");
					$("#sendApproval").removeAttr("disabled");
				}
			}
		});
		return false;
	}
}

(function(){
	var myCart = {
			storeName : "selectedItemsToGroup",
			removeSelectedApi : "removeItemsPage.action",
			shipAddressesHolder : "shipAddressListAsJson",
			wareHousesHolder : "wareHousesAsJson",
			quickAddApi : "quickAddPage.action",
			wareHousesModelId : "#changeWareHouseModel",
			shipAddressModelId : "#changeShippingModal",
			cartPageLocationHolder : "selectedShipDetails",
			popUpPageShipLocationHolder  : "selectedShipDetailsPopUp",
			popUpWareHouseLocationHolder : "selectedWareHouseDetailsPopUp",
			description : []
	};
	function processQuickAdd(){
		var formData = $("#quickAddForm").serialize();
		$.post(myCart.quickAddApi,formData, function(data,status,xhr){
			data = JSON.parse(data);
			if(data.valid){
				bootAlert("medium","success","success",data.descriptions.join("<br>"));
				$("[data-bb-handler='ok']").click(function(){
					window.location.reload();
				});
			}else{
				bootAlert("medium","error","error",data.descriptions.join("<br>"));
			}
		});
	}
	
	function validateQuickAdd(){
		myCart.description = [];
		var isValid = true;
		var partNumber = $("#quickAddForm #partNumber").val();
		var qty = $("#quickAddForm #qty").val();
		if(!partNumber){
			myCart.description.push("Part Number is Required");
			isValid = false;
		}
		if(!qty.match(/^[0-9]+$/)){
			myCart.description.push("Quantity is Required")
			isValid = false;
		}
		return isValid;
	}
	
	function validateCartItem(item){
		var status = true, description = "";
		if(item.qty <= 0) {
			status = false;
			description = "Quantity cannot be less than or Equal to Zero";
		}
		else if(item.qty < item.minOrderQty){
			status = false;
			description = "Quantity cannot be less than Minimum Order Quantity(" + item.minOrderQty +")";
		}
		else if(item.qty % item.qtyInterval != 0) {
			description = "Item Can only Ordered in multiples of " + item.qtyInterval;
			status = false;
		}
		return {
			"valid" : status,
			"description" : description 
		};
	}

	function Item(qty, attributes){
		this.itemId = attributes.itemid;
		this.cartItemId = attributes.cartitemid;
		this.partNumber = attributes.partnumber;
		this.qty = qty;
		this.minOrderQty = attributes.minorderqty;
		this.MinimumOrderQuantity = attributes.minorderqty;
		this.qtyInterval = attributes.qtyinterval;
		this.uom = attributes.uom;
		this.itemPriceId = attributes.itempriceid;
		this.value = attributes.value;
	}
	
	function extractItemDetails(element){
		var qty = 0;
		var attributes = element.dataset;
		if(element.type != "TEXT" || element.type != "text"){
			qty = $("input[type=text][data-cartitemid="+attributes.cartitemid+"]").val();
		}else{
			qty = element.value;
		}
		return new Item(qty, attributes);
	}
	
	function clearItemExistence(items, newItem){
		var i = 0, size = items.length, status = false, currentItem;
		for(i = 0; i < size; i++){
			currentItem = items[i];
			if(currentItem.cartItemId == newItem.cartItemId){
				status = true;
				break;
			}
		}
		if(status){
			items.splice(i, 1);
			setItemsToLocalStorage(myCart.storeName, items);
		}
	}
	
	function persistItem(storageName, item){
		var items;
		if(Storage){
			var items = getItemsFromLocalStorage(storageName);
			if(items == null || items.length <= 0){
				items = [];
				items.push(item);
				setItemsToLocalStorage(storageName, items);
			}else{
				clearItemExistence(items, item);
				items.push(item);
				setItemsToLocalStorage(storageName, items);
			}
		}
	}
	function setItemsToLocalStorage(storageName, items){
		if(Storage){
			localStorage.setItem(storageName, JSON.stringify(items));
		}
	}
	
	function getItemsFromLocalStorage(storageName){
		if(Storage){
			return JSON.parse(localStorage.getItem(storageName));
		}
	}
	
	function callRemoveSelctedApi(items){
		$.post(myCart.removeSelectedApi,{"items" : JSON.stringify(items) },function(data,status,xhr){
			data = JSON.parse(data);
			if(data.valid){
				bootAlert("medium","success","success",data.descriptions.join("<br>"));
				$("[data-bb-handler='ok']").click(function(){
					window.location.reload();
				});
			}else{
				bootAlert("medium","error","error",data.descriptions.join("<br>"));
			}
		});
	}
	
	function callAddSelectedApi(items){
		var myObject = new Object();
		myObject.itemDataList = items;
		var dataStr = 'groupType=P&jsonData=' + JSON.stringify(myObject);
		block("Espere por favor");
		$.ajax({
			type: "POST",
			url: "productListIdNamePage.action",
			data: dataStr,
			success: function(msg){
				unblock();
				$('#generalModel .modal-body').html(msg);
				$('#generalModel').modal();
				triggerToolTip();
			}
		});
	}
	function checkBoxEventHander(element){
		var status, item = extractItemDetails(element);
		if(element.type == "TEXT" || element.type == "text" || element.checked){
			status = validateCartItem(item);
			if(status.valid){
				persistItem(myCart.storeName, item);
			}else{
				if(element.type == "TEXT" || element.type == "text"){
					element.value = item.value != 0 ? item.value : item.minOrderQty;
				}
				bootAlert("medium","warning","Advertencia",status.description);
			}
		}else{
			clearItemExistence(getItemsFromLocalStorage(myCart.storeName), item);
		}
		if(element.type == "CheckBox" || element.type.toUpperCase() == "CHECKBOX"){
			updateSelectAllCheckBox(element);
		}
	}
	
	$(".cartElement").on('change',function(src){
		checkBoxEventHander(src.target);
	});
	
	$(".removeSelected").on('click', function(){
		var selectedItems = getItemsFromLocalStorage(myCart.storeName);
		if(selectedItems && selectedItems.length > 0){
			callRemoveSelctedApi(selectedItems);
		}else {
			bootAlert("medium","warning","Advertencia",locale('label.cart.notSelected'));
		}
	});
	$(".addSelected").on('click', function(){
		var selectedItems = getItemsFromLocalStorage(myCart.storeName);
		if(selectedItems && selectedItems.length > 0){
			callAddSelectedApi(selectedItems);
		}else {
			bootAlert("medium","warning","Advertencia",locale('label.cart.notSelected'));
		}
	});
	
	$("#quickAdd").on('click', function(){
		if(validateQuickAdd()){
			processQuickAdd();
		}else{
			bootAlert("medium","warning","Advertencia",quickAdd.description.join("<br/>"));
			return false;
		}
	});
	
	$(".selectAllCheckbox").on('change', function(event){
		var srcObj = event.target;
		var currentStatus = srcObj.checked;
		$("input:checkbox[name='idList']").each(function(){
			this.checked = currentStatus;
			checkBoxEventHander(this);
		});
	});
	
	function updateSelectAllCheckBox(element){
		var fieldName = element.name;
		var status = $("input:checkbox[name='"+fieldName+"']:checked").length === $("input:checkbox[name='"+fieldName+"']").length;
		$('#chkSelectall').prop('checked', status);
	}
	
	function chooseChangeType(shipType, identifier, container){
		switch(shipType.toUpperCase()){
		case "PICKUP" : 
			changeLocation(myCart.wareHousesHolder, identifier, "wareHouseCode", container);
			 $("#pickUpWareHouseCode").val(identifier);
			 $("#changeLocation").attr("data-target", myCart.wareHousesModelId);
			break;
		case "SHIP" : 
			changeLocation(myCart.shipAddressesHolder, identifier, "addressBookId", container);
			$("#shipAddressBookId").val(identifier);
			$("#selectedShipTo").val(identifier);
			 $("#changeLocation").attr("data-target", myCart.shipAddressModelId);
			break;
		}
	}
	
	function changeLocation(srcLocation, curIdentifier, fieldName, container){
		var i, j, update = false, eachContainer, curLocation, locations = $("#"+ srcLocation).val();
		locations = JSON.parse(locations);
		for(i = 0; i < locations.length; i++){
			curLocation = locations[i];
			if(curLocation[fieldName] == curIdentifier){
				for(j = 0; j < container.length; j++){
					eachContainer = container[j];
					populateLocationDetails(curLocation, eachContainer);
					if(!update && $("#layoutName").val() == "CheckOutPage"){
						updateCheckoutInfo(curLocation);
						update = true;
					}
				}
				break;
			}
		}
	}
	function updateCheckoutInfo(curLocation){
		$("#address1Dest").text(location.address1);
		$("#address2Dest").text(location.address2);
		$("#cityDest").text(location.city);
		$("#stateDest").text(location.state);
		$("#zipCodeDest").text((location.zipCode) ? location.zipCode : location.zip);
		$("#countryDest").text(location.country);
	}
	function populateLocationDetails(location, container){
		$("#"+ container + " .address1Holder").text(location.address1);
		$("#"+ container + " .address2Holder").text(location.address2);
		$("#"+ container + " .cityHolder").text(location.city);
		$("#"+ container + " .stateHolder").text(location.state);
		$("#"+ container + " .zipHolder").text((location.zipCode) ? location.zipCode : location.zip);
		$("#"+ container + " .countryHolder").text(location.country);
	}
	
	function getRequireDetails(calcTax, calcFreight){
		var data = {};
		data.shipAddressBookId = $("#selectedShipTo").val();
		data.shipViaCode = $("#shipViaSrc").val();
		data.calculateTax = calcTax;
		data.calculateFreight = calcFreight;
		data.savedGroupId = $("#savedGroupId").val();
		data.orderTax = $("#orderTax").val();
		return data;
	}
	
	function calculateTaxAndFreight(calcTax, calcFreight){
		block();
		var data = getRequireDetails(calcTax, calcFreight);
		$.get("calculateTaxAndFreightSale.action", data, function(response){
			unblock();
			if(response){
				response = JSON.parse(response);
				if(calcTax){
					$("#orderTaxLab").html("&nbsp;&nbsp;&nbsp;$" + response["orderTax"].toFixed(2));
					$("#orderTax").val(response["orderTax"]);
				}
				if(calcFreight){
					$(".shippingCost").show();
					$("#shippingCostLab").html("&nbsp;&nbsp;&nbsp;$" + response["totalCartFrieghtCharges"].toFixed(2));
					$("#totalCartFrieghtCharges").val(response["totalCartFrieghtCharges"]);
				}
				$("#orderSubTotalLab").html("&nbsp;&nbsp;&nbsp;$" + response["subTotal"].toFixed(2));
				$("#grandTotalLab").html("&nbsp;&nbsp;&nbsp;$" + response["grandTotal"].toFixed(2));
			}
		}).fail(function(response){
			unblock();
		});
	}
	
	function switchOptionsByDeliveryType(deliveryType){
		if(deliveryType && deliveryType.toUpperCase() !== "SHIP"){
			$("#shipViaSrc option[value='WC']").attr("selected", true);
			$("#shipViaSrcWrapper").hide();
			//$("#collectAccDetails").hide();
			$("#shipmentTypeWrapper").hide();
		}else{
			$("#shipViaSrcWrapper").show();
			//$("#collectAccDetails").show();
			$("#shipmentTypeWrapper").show();
			$("#shipViaSrc option:selected").attr("selected", false);
			$("#shipViaSrc option[value='WC']").hide();
		}
	}
	
	$("#shipViaSrc").on('change', function(){
		var field = $("#shipViaSrc").val();
		if(field && field.length > 0 && field.toUpperCase() != "WC"){
			calculateTaxAndFreight(false, true);
		}
	});
	
	$(".shipType").on('change', function(src) {
		var shipType = this.value, identifier;
		changeLocationDesc = "";
		$("#selectedShipType").val(shipType);
	    var checked = $(this).is(':checked');
	    $(".shipType").prop('checked',false);
	    if(checked) {
	        $(this).prop('checked',true);
	    }
	    var deliveryType = $("[name=shipType]:checked").val();
		switchOptionsByDeliveryType(deliveryType);
	    if(shipType == "pickup"){
	    	changeLocationDesc = "change pick up location";
	    	identifier = $("#pickUpWareHouseCode").val();
	    	chooseChangeType(shipType, identifier, [myCart.cartPageLocationHolder]);
	    }
	    else if(shipType == "ship"){
	    	changeLocationDesc = "change shipping location";
	    	identifier = $("#shipAddressBookId").val();
	    	chooseChangeType(shipType, identifier, [myCart.cartPageLocationHolder]);
	    }
	    $("#changeLocation").text(changeLocationDesc);
	});
	
	$(".selectShipLocation").on('change', function(){
		if($("#layoutName").val() == "CheckOutPage"){
			var isShipAddrChanged = $("#isShipAddrChanged").val();
			if(isShipAddrChanged == "unchanged"){
				isShipAddrChanged  = "changed";
			}else if(isShipAddrChanged == "changed"){
				isShipAddrChanged  = "unchanged";
			}
			$("#isShipAddrChanged").val(isShipAddrChanged);
		}
	});
	
	$(".updateLocataion").on('click', function(){
		var identifier, deliveryType = $("#selectedShipType").val();
		if(deliveryType.toUpperCase() === "SHIP"){
			identifier = $("[name=selectShipLocation]:checked").val();
			chooseChangeType(deliveryType, identifier, [myCart.cartPageLocationHolder, myCart.popUpPageShipLocationHolder]);
			
		}else if(deliveryType.toUpperCase() === "PICKUP"){
			identifier = $("[name=selectWareHouseLocation]:checked").val();
			chooseChangeType(deliveryType, identifier, [myCart.cartPageLocationHolder, myCart.popUpWareHouseLocationHolder]);
		}
		$("button[type=button][data-dismiss=modal]").click();
		if($("#layoutName").val() == "CheckOutPage"){
			var calcFreight = false;
			if($("#shipViaSrc").val().length > 0){
				calcFreight = true;
			}
			calculateTaxAndFreight(true, calcFreight);
		}
	});
	
	setItemsToLocalStorage(myCart.storeName, []);
})();
function editevent(partNum){
	var itempartnumber=partNum
	$('.editpricesales_'+itempartnumber).css('display','block');
    $('#editunitprice_'+itempartnumber).css('display' , 'none');
	
}
function editPrice(productListId){
	$('.editpricesales_'+productListId).removeClass('hideMe');
	$('#editunitprice_'+productListId).addClass('hideMe');	
}

function cancelUpdatePrice(productListId){
    $('#editunitprice_'+productListId).removeClass('hideMe');
    $('.editpricesales_'+productListId).addClass('hideMe');
}

function updatePrice(productListId, partNum){
	var unitPrice = $('#unitPrice_'+productListId).val();
	var updatedUnitPrice = $('#updatedUnitPrice_'+productListId).val();
	var uom = $('#uom_'+productListId).val();
	var getPriceFrom = 'SALESREP';
	var itemQty = document.getElementById("textQty_"+partNum).value;
	if(updatedUnitPrice <= 0){
		bootAlert("small","error","Error",locale('label.cart.priceZero'));
	}else if(isNaN(updatedUnitPrice)){
		bootAlert("small","error","Error",locale('label.cart.PriceString'));
		$('#updatedUnitPrice_'+productListId).val(unitPrice);
	    editPrice(partNum);
    }else if(unitPrice != updatedUnitPrice){
		var cartId = productListId;
		if(productListId != ""){
			$("#refreshCartId").val(productListId);
			if(typeof cartId!="undefined" && cartId!=null && cartId!=""){
				$("#refreshQty").val($(".textQty_"+cartId).val());
			}
			else{$("#refreshQty").val($("#textQty_"+partNum).val());}
			
			$("#lineItemCommentRef").val($("#lineItemComment_"+productListId).val());
			if($("#requiredByDateRef").length > 0){
				$("#requiredByDateRef").val($("#reqDate_"+productListId).val());
			}
		}
		
		var str = "&updateId="+productListId+"&unitPrice="+unitPrice+"&updatedUnitPrice="+updatedUnitPrice+"&uom="+uom+"&getPriceFrom="+getPriceFrom+"&itemQty="+itemQty;
		block("Espere por favor");
		$.ajax({
			type: "POST",
			url:"updateCustomerPricePage.action",
			data: str,
			success: function(response){
				unblock();
				if(response){
					bootAlert("small","success",locale('label.alert.success'),locale('label.update.cart'));
					window.location.href = "shoppingCartPage.action";
				}else{
					bootAlert("small","error","Error",locale('label.update.reject'));
				}
			}
		});
	}else{
		unblock();
		cancelUpdatePrice(productListId);
	}
}