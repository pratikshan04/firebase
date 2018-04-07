var webThemes = $("#webThemePath").val();
$(document).ready(function(){
	$('#cartWrap').DataTable({
		"ordering": false,
		searching: false,
		"bLengthChange": false,
		"info": false,
		"sDom": 't<"row"<"col-md-6 col-ms-6 col-sm-12 cartPagination"p><"col-md-6 col-ms-6 col-sm-12 cartTotalBlock">>'
	});
	$('.cartTotalBlock').html($("#copyPrice").html());
});
$('[data-function="saveCartFunction"]').click(function() {
	var toggleListID = "#"+$(this).attr('data-listTarget');
	var itemId = $(this).attr('data-itemId');
	$("#group_id").val(toggleListID);
	$("#hidden_id").val(itemId);
	if($(toggleListID).html()==""){
		if(!$(toggleListID).is(":Visible")){
			jQuery.get("productListIdNamePage.action?productIdList=0&groupType=C",function(data,status){
				$(toggleListID).html(data).toggle();
			});
		}else{
			$(toggleListID).toggle();
		}
	}else{
		$(toggleListID).toggle();
	}
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
		bootAlert("small","error","Error","Cart name already exists<br/>Items will be added to existing saved cart.");
	}
	if(groupId==0)
	{
		if (title == null || title == "") {
			bootAlert("small","error","Error","Please Enter Valid Name.");
			return false;
		}else{
			var characterReg = /^[-_ a-zA-Z0-9]+$/;
			if (characterReg.test(title) == false) {
				bootAlert("small","error","Error","Special characters are not allowed except underscore or hyphen ( _ , - ).");
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
		$(toggleListID).toggle();
		var result = data.split('|');
		//$(toggleListID+"_custPop").html("Cart Saved Successfully - "+ $("#group_name").val()).attr("href","myProductGroupPage.action?savedGroupId="+result[1]).fadeIn();
		$(toggleListID+"_custPop").html("Cart Saved Successfully - "+ groupName).attr("href","/"+result[1]+"/ProductGroup/Cart?savedGroupName="+groupName).fadeIn();
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

function updateCartQty(){
	$("#updateQtyFrm").submit();
}

function deleteItem(path,typ,item){
	if(typ!=null && typ=="0"){
		bootbox.confirm({ 
			size: "medium",
			closeButton:false,
			message: "You want to delete item <b>"+item+"</b> from cart?", 
			callback: function(result){
				processAction(result,path,typ,item);
			}
		});

	}else if(typ!=null && typ=="1"){
		bootbox.confirm({ 
			size: "small",
			closeButton:false,
			message: "You want to delete all the items from cart?", 
			callback: function(result){
				processAction(result,path,typ,item);
			}
		});
	}else{
		bootbox.confirm({ 
			size: "small",
			closeButton:false,
			message: "Delete item from cart?", 
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
	partNum = partNum.replace(/ +/g,"_");
	partNum = partNum.replace(/[#;&,.+*~':"!^$[\]()=>|\/ ]/g, "\\$&");
	var curQty = $("#textQtyCur_"+partNum).val();
	var mpnDisplay = "";
	var mpn="";
	var valu ="";
	var lessThanMinOrder = true;
	if(id != ""){
		$("#refreshCartId").val(id);
		$("#refreshQty").val($("#textQty_"+partNum).val());
		$("#lineItemCommentRef").val($("#lineItemComment_"+id).val());
		if($("#requiredByDateRef").length > 0){
			$("#requiredByDateRef").val($("#reqDate_"+id).val());
		}
	}
	var qtyEntered = parseInt($.trim($("#textQty_"+partNum).val()));
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
					valu = "Item# "+mpn+" is only available in multiples of "+orderQtyInterval+" and Min. Order Quantity is : "+minimumOrderQty;
				}else{
					valu = "Item# "+mpn+" is only available in multiples of "+orderQtyInterval;
				}
			}else{
				if(lessThanMinOrder){
					valu = "Item# "+partNum+" is only available in multiples of "+orderQtyInterval+" and Min. Order Quantity is : "+minimumOrderQty;
				}else{
					valu = "Item# "+partNum+" is only available in multiples of "+orderQtyInterval;
				}
			}
			showNotificationDiv("error", valu);
			$("#updateCartForm")[0].reset();
			return false;
		}
	}else{
		$("#textQty_"+partNum).val(curQty);
		bootAlert("medium","error","Error","Please use Update Cart button to set item quantity to zero.");
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
	var checkout="N";
	if($("#checkoutpriceValue").length>0){
		checkout = $("#checkoutpriceValue").val();
	}
	if(checkout=="Y"){
		bootAlert("small","error","Error","Cannot checkout item(s) with zero price.");
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
									$("#updateCartForm").attr("action","Login");
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
								$("#updateCartForm").attr("action","Login");
							}
						}
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
		$("#sendApproval").val("Please Wait..");
		$("#sendApproval").attr("disabled", "disabled");
		block("Please Wait");
		$.ajax({
			type: "POST",
			url: "sendApprovalSale.action",
			data: str,
			success: function (msg) {
				unblock();
				var arrRes = msg.split("|");
				if ($.trim(arrRes[0]) == "0"){
					bootAlert("small","success","Success",locale("cart.submit.approval"));
					$("[data-bb-handler='ok']").click(function(){
						window.location.href = $("base").attr("href") + "Welcome.action";
					})
				}else{
					var result = "";
					for (i = 0; i < (arrRes.length - 1); i++) {
						result = result + arrRes[i] + "<br />";
					}
					$("#sendApproval").val("Submit Approval");
					$("#sendApproval").removeAttr("disabled");
				}
			}
		});
		return false;
	}
}