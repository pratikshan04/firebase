var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/bootstrap-datepicker.min.js', function(){
	var date = new Date();
	$('#reqDate').datepicker({autoclose: true, startDate : (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()});
});

var billAddressState = $("#billAddressState").val();
var billAddressCountry = $("#billAddressCountry").val();
var shipAddressState = $("#shipAddressState").val();
var shipAddressCountry = $("#shipAddressCountry").val();
if($.trim(billAddressCountry) ==""){
	billAddressCountry = "US";
}
if($.trim(shipAddressCountry) ==""){
	shipAddressCountry = "US";
}
$("#stateSelect").attr('disabled',true);
$("#countrySelect").attr('disabled',true);
var countrySelect = new initCountry({
	country: billAddressCountry,
	selectorID: "countrySelect",
	defaultSelect: true,
	selectState: billAddressState
});
var countrySelectShip = new initCountry({
	country: shipAddressCountry,
	selectorID: "countrySelectShip",
	defaultSelect: true,
	selectState: shipAddressState
});

$(function(){
	$('#step-1 input[type="text"]').each(function(){
        if(this.value==null || this.value.trim()==""){
        	$(this).removeClass( "btns-disable" )
        	$(this).prop('readonly', false);
	    } else{
	    	$(this).addClass("btns-disable" )
        	$(this).prop('readonly', true);
		}
	});
});

function setPoNumberToSession(value){
	var value = $('#poNumberTxt').val();
	console.log("setPoNumberToSession: "+value);
	if($('#poNumber').length>0){
		$('#poNumber').val(value);
	}
	enqueue('sessionValueLink.action?crud=s&keyValue=poNumber&insertValue='+value+'&dt='+new Date())
}

var checkoutWizard = {};
(function() {
	
	checkoutWizard.leaveAStepCallback = function(obj,context){
		var step_num= obj.attr('index');
		return checkoutWizard.validateSteps(step_num,context);
	};
	
	checkoutWizard.showAStepCallback = function(obj){
		var step_num= obj.attr('index');
		if(step_num==3){
			block("Please Wait");
			if($('#wizFinishButtonId').length>0){
				$('#wizFinishButtonId').addClass("buttonDisabled");
				if($('#orderType').val().trim() == "checkoutWithPo"){
					$('#wizFinishButtonId').html("Submit Order");
				}else if($('#orderType').val().trim() == "checkoutWithCreditCard"){
					$('#wizFinishButtonId').html("Continue with Credit Card");
				}
			}
			var str = "";
			var savedGroupId = $('#savedGroupId').val();
			/*var isReOrder = $('#isReOrder').val();
			var poNumber = $('#poNumberTxt').val();
			var defaultShipToId = $('#defaultShipToId').val();
			var defaultBillToId = $('#defaultBillToId').val();
			var shipVia = $('#shipVia').val();
			str = "isReOrder="+isReOrder+"&savedGroupId="+savedGroupId+"&poNumber="+poNumber+"&defaultShipToId="+defaultShipToId+"&defaultBillToId="+defaultBillToId+"&shipVia="+shipVia+"&dt="+new Date();*/
			if(savedGroupId!= "0" && savedGroupId != ""){
				str = "savedGroupId="+savedGroupId+"&";
			}
			var billingInputs = $('#step-1 :input').serialize();
			var shippingInputs = $('#step-2 :input').serialize();
			var orderDetailInputs = $('#step-3 :input').serialize();
			if(billingInputs!=null && $.trim(billingInputs)!=""){
				str += billingInputs;
			}
			if(shippingInputs!=null && $.trim(shippingInputs)!=""){
				str = str +"&"+ shippingInputs;			
			}
			if(orderDetailInputs!=null && $.trim(orderDetailInputs)!=""){
				str = str +"&"+ orderDetailInputs;
			}
			str = str + "&dt="+new Date();
			enqueue("/confirmOrderSale.action?"+str+"&dt="+new Date(),function(data){
				if(data!=null && data!=""){
					/*if($(data).filter(".reviewOrderWrap").length>0){
						$('#confirmOrderPageDiv').html($(data).filter(".reviewOrderWrap").html());
					}
					if($(data).filter("#orderDetailTotalPriceWrap").length>0){
						$('.cimm_salesBottomStrip').html($(data).filter("#orderDetailTotalPriceWrap").html());
					}*/
					$('#confirmOrderPageDiv').html(data);
					var value = $('#poNumberTxt').val();
					console.log("setPoNumberToSession: "+value);
					if($('#poNumber').length>0){
					 $('#poNumber').val(value);
					}
					if($('#wizFinishButtonId').length>0){
						$('#wizFinishButtonId').removeClass("buttonDisabled");
					}
					formatPrice();
					unblock();
				}else{
					bootAlert("small","error","Error","Your cart is empty!");
					window.location.href = '/Cart';
				}
			});
		}
	};
	
	checkoutWizard.validateSteps = function(step,context){
		var isStepValid = true;
		if(step == 1){
			checkoutWizard.hideNotificationDiv(step);
			isStepValid = checkoutWizard.stepOneValidate(step);
		}else if(step==2){
			checkoutWizard.hideNotificationDiv(step);
			if(context.toStep!=1){
				isStepValid = checkoutWizard.stepTwoValidate(step);
			}
		}else if(step==3){
			checkoutWizard.hideNotificationDiv(step);
			if(context.toStep==4){
				isStepValid = checkoutWizard.stepThreeValidate(step);
			}
		}
		return isStepValid; 
	};
	
	checkoutWizard.stepOneValidate = function(step){
		
		var errorMessage = "";
		var validation = true;
		var lineBreak = "<br/>";
		
		if($('#fname').length>0 && (typeof $('#fname').val()=="undefined" || $('#fname').val()==null || $('#fname').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.name") + lineBreak;
			validation = false;
		}
		if($('#billAddress1').length>0 && (typeof $('#billAddress1').val()=="undefined" || $('#billAddress1').val()==null || $('#billAddress1').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.address1") + lineBreak;
			validation = false;
		}
		/*if($('#billAddress2').length>0 && (typeof $('#billAddress2').val()=="undefined" || $('#billAddress2').val()==null || $('#billAddress2').val().trim().length < 1)){
			address2 = $('#billAddress2').val();
		}*/
		if($('#billPhoneNo').length>0 && (typeof $('#billPhoneNo').val()=="undefined" || $('#billPhoneNo').val()==null || $('#billPhoneNo').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.phone") + lineBreak;
			validation = false;
		}else{
			if(!isPhoneNumberValid($('#billPhoneNo').val().trim())){
				errorMessage = errorMessage + locale("checkoutwiz.error.phoneinvalid") + lineBreak;
				validation = false;
			}
		}
		if($('#billEmail').length>0 && (typeof $('#billEmail').val()=="undefined" || $('#billEmail').val()==null || $('#billEmail').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.emailaddress") + lineBreak;
			validation = false;
		}else{
			if(!validateEmail($('#billEmail').val().trim())){
				errorMessage = errorMessage + locale("checkoutwiz.error.emailaddressinvalid") + lineBreak;
				validation = false;
			}
		}
		if($('#billCity').length>0 && (typeof $('#billCity').val()=="undefined" || $('#billCity').val()==null || $('#billCity').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.city") + lineBreak;
			validation = false;
		}
		if($('#stateSelect').length>0 && (typeof $('#stateSelect').val()=="undefined" || $('#stateSelect').val()==null || $('#stateSelect').val().trim().length < 1 || $('#stateSelect').val()=="Select State")){
			errorMessage = errorMessage + locale("checkoutwiz.error.state") + lineBreak;
			validation = false;
		}
		if($('#billZipcode').length>0 && (typeof $('#billZipcode').val()=="undefined" || $('#billZipcode').val()==null || $('#billZipcode').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.zipcode") + lineBreak;
			validation = false;
		}
		if($('#countrySelect').length>0 && (typeof $('#countrySelect').val()=="undefined" || $('#countrySelect').val()==null || $('#countrySelect').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.country") + lineBreak;
			validation = false;
		}
		
		if(!validation){
			checkoutWizard.displayNotification(errorMessage,step);
			return false;
		}else{
			return true;
		}
	};
	
	checkoutWizard.stepTwoValidate = function(step){
		
		var errorMessage = "";
		var validation = true;
		var lineBreak = "<br/>";
		
		if($('#shipCompanyName').length>0 && (typeof $('#shipCompanyName').val()=="undefined" || $('#shipCompanyName').val()==null || $('#shipCompanyName').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.name") + lineBreak;
			validation = false;
		}
		if($('#shipAddress1').length>0 && (typeof $('#shipAddress1').val()=="undefined" || $('#shipAddress1').val()==null || $('#shipAddress1').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.address1") + lineBreak;
			validation = false;
		}
		/*if($('#shipAddress2').length>0 && (typeof $('#shipAddress2').val()=="undefined" || $('#shipAddress2').val()==null || $('#shipAddress2').val().trim().length < 1)){
			address2 = $('#billAddress2').val();
		}*/
		if($('#shipPhoneNo').length>0 && (typeof $('#shipPhoneNo').val()=="undefined" || $('#shipPhoneNo').val()==null || $('#shipPhoneNo').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.phone") + lineBreak;
			validation = false;
		}else{
			if(!isPhoneNumberValid($('#shipPhoneNo').val().trim())){
				errorMessage = errorMessage + locale("checkoutwiz.error.phoneinvalid") + lineBreak;
				validation = false;
			}
		}
		if($('#shipEmail').length>0 && (typeof $('#shipEmail').val()=="undefined" || $('#shipEmail').val()==null || $('#shipEmail').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.emailaddress") + lineBreak;
			validation = false;
		}else{
			if(!validateEmail($('#shipEmail').val().trim())){
				errorMessage = errorMessage + locale("checkoutwiz.error.emailaddressinvalid") + lineBreak;
				validation = false;
			}
		}
		if($('#shipCity').length>0 && (typeof $('#shipCity').val()=="undefined" || $('#shipCity').val()==null || $('#shipCity').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.city") + lineBreak;
			validation = false;
		}
		if($('#stateSelectShip').length>0 && (typeof $('#stateSelectShip').val()=="undefined" || $('#stateSelectShip').val()==null || $('#stateSelectShip').val().trim().length < 1 || $('#stateSelectShip').val()=="Select State")){
			errorMessage = errorMessage + locale("checkoutwiz.error.state") + lineBreak;
			validation = false;
		}
		if($('#shipZipcode').length>0 && (typeof $('#shipZipcode').val()=="undefined" || $('#shipZipcode').val()==null || $('#shipZipcode').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.zipcode") + lineBreak;
			validation = false;
		}
		if($('#countrySelectShip').length>0 && (typeof $('#countrySelectShip').val()=="undefined" || $('#countrySelectShip').val()==null || $('#countrySelectShip').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.country") + lineBreak;
			validation = false;
		}
		
		if(!validation){
			checkoutWizard.displayNotification(errorMessage,step);
			return false;
		}else{
			return true;
		}
	};
	
	checkoutWizard.stepThreeValidate = function(step){
		
		var errorMessage = "";
		var validation = true;
		var lineBreak = "<br/>";
		
		if($('#orderType').length>0 && (typeof $('#orderType').val()=="undefined" || $('#orderType').val()==null || $('#orderType').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.ordertype") + lineBreak;
			validation = false;
		}
		if($('#reqDate').length>0 && (typeof $('#reqDate').val()=="undefined" || $('#reqDate').val()==null || $('#reqDate').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.requireddate") + lineBreak;
			validation = false;
		}
		if($('#orderedBy').length>0 && (typeof $('#orderedBy').val()=="undefined" || $('#orderedBy').val()==null || $('#orderedBy').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.orderby") + lineBreak;
			validation = false;
		}
		if($('#poNumberTxt').length>0 && (typeof $('#poNumberTxt').val()=="undefined" || $('#poNumberTxt').val()==null || $('#poNumberTxt').val().trim().length < 1) && $('#orderType').val() != "checkoutWithCreditCard"){
			errorMessage = errorMessage + locale("checkoutwiz.error.purchaseordernumber") + lineBreak;
			validation = false;
		}
		if($('#shipVia').length>0 && (typeof $('#shipVia').val()=="undefined" || $('#shipVia').val()==null || $('#shipVia').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.shipvia") + lineBreak;
			validation = false;
		}
		/*if($('#orderStatus').length>0 && (typeof $('#orderStatus').val()=="undefined" || $('#orderStatus').val()==null || $('#orderStatus').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.orderstatus") + lineBreak;
			validation = false;
		}*/
		/*if($('#shippingInstruction').length>0 && (typeof $('#shippingInstruction').val()=="undefined" || $('#shippingInstruction').val()==null || $('#shippingInstruction').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.shippinginstruction") + lineBreak;
			validation = false;
		}*/
		/*if($('#orderNotes').length>0 && (typeof $('#orderNotes').val()=="undefined" || $('#orderNotes').val()==null || $('#orderNotes').val().trim().length < 1)){
			errorMessage = errorMessage + locale("checkoutwiz.error.ordernote") + lineBreak;
			validation = false;
		}*/
		
		if(!validation){
			checkoutWizard.displayNotification(errorMessage,step);
			return false;
		}else{
			return true;
		}
	};
	
	checkoutWizard.changeShippingAddress = function(obj){
		var addressBookId = $(obj).val();
		if(typeof addressBookId!="undefined" && addressBookId!=null && addressBookId.trim().length > 0 && shippingListjson!=null && shippingListjson.length > 0){
			for (var i=0; i<shippingListjson.length; i++)
			    if(shippingListjson[i].addressBookId == addressBookId) {
			        console.log(shippingListjson[i].addressBookId+" : "+addressBookId);
			        if($('#shipCompanyName').length>0){
						if(shippingListjson[i].customerName!=null && $.trim(shippingListjson[i].customerName)!=""){
							$('#shipCompanyName').val($.trim(shippingListjson[i].customerName));
						}else{
							$('#shipCompanyName').val("");
						}
					}
					if($('#shipAddress1').length>0){
						if(shippingListjson[i].address1!=null && $.trim(shippingListjson[i].address1)!=""){
							$('#shipAddress1').val($.trim(shippingListjson[i].address1));
						}else{
							$('#shipAddress1').val("");
						}
					}
					if($('#shipAddress2').length>0){
						if(shippingListjson[i].address2!=null && $.trim(shippingListjson[i].address2)!=""){
							$('#shipAddress2').val($.trim(shippingListjson[i].address2));
						}else{
							$('#shipAddress2').val("");
						}
					}
					if($('#shipCity').length>0){
						if(shippingListjson[i].city!=null && $.trim(shippingListjson[i].city)!=""){
							$('#shipCity').val($.trim(shippingListjson[i].city));
						}else{
							$('#shipCity').val("");
						}
					}
					if($('#stateSelectShip').length>0){
						if(shippingListjson[i].state!=null && $.trim(shippingListjson[i].state)!=""){
							$('#stateSelectShip').val($.trim(shippingListjson[i].state));
							$('#stateSelectShip').trigger("chosen:updated");
						}else{
							$('#stateSelectShip').val("");
							$('#stateSelectShip').trigger("chosen:updated");
						}
					}
					if($('#shipZipcode').length>0){
						if(shippingListjson[i].zipCodeStringFormat!=null && $.trim(shippingListjson[i].zipCodeStringFormat)!=""){
							$('#shipZipcode').val($.trim(shippingListjson[i].zipCodeStringFormat));
						}else{
							$('#shipZipcode').val("");
						}
					}
					if($('#countrySelectShip').length>0){
						if(shippingListjson[i].country!=null && $.trim(shippingListjson[i].country)!=""){
							/*var countryToSelect = $.trim(shippingListjson[i].country);
							if($.trim(shippingListjson[i].state)=="US"){
								countryToSelect = "USA";
							}*/
							$('#countrySelectShip').val($.trim(shippingListjson[i].country));
							$('#countrySelectShip').trigger("chosen:updated");
						}else{
							$('#countrySelectShip').val("USA");
							$('#countrySelectShip').trigger("chosen:updated");
						}
					}
					if($('#shipPhoneNo').length>0){
						if(shippingListjson[i].phoneNo!=null && $.trim(shippingListjson[i].phoneNo)!=""){
							$('#shipPhoneNo').val($.trim(shippingListjson[i].phoneNo));
						}else{
							$('#shipPhoneNo').val("");
						}
					}
					if($('#shipEmail').length>0){
						if(shippingListjson[i].emailAddress!=null && $.trim(shippingListjson[i].emailAddress)!=""){
							$('#shipEmail').val($.trim(shippingListjson[i].emailAddress));
						}else{
							$('#shipEmail').val("");
						}
					}
			    }
		}
	};
	
	checkoutWizard.submitCheckoutRequest = function(){
		if(checkoutWizard.stepThreeValidate("3")){
			if($('#orderType').length>0 && typeof $('#orderType').val()!="undefined" && $('#orderType').val()!=null && $('#orderType').val().trim().length > 0){
					if($('#orderType').val().trim() == "checkoutWithPo"){
						var data = $("#quickCartHiddenInfo").serialize();
						block("Please Wait");
						$.ajax({
							type: "POST",
							url: "processCheckout.action",
							data: data,
							success: function(msg){
								window.location.href = 'orderConfirmation.action?salesOrderId='+msg;
							}
						});
						
					}else if($('#orderType').val().trim() == "checkoutWithCreditCard"){
						block("Please Wait");
						setCookie("poNumber",$("#poNumber").val(),10);
						setCookie("orderedBy",$("#orderedBy").val(),10);
						setCookie("reqDate",$("#reqDate").val(),10);
						if($("textarea#shippingInstruction").val()!=null && $("textarea#shippingInstruction").val()!=""){
							setCookie("shippingInstruction",$("textarea#shippingInstruction").val(),10);
						}else{
							setCookie("shippingInstruction","",10);
						}
						setCookie("defaultShipToId",$("#defaultShipToId").val(),10);
						setCookie("shipVia",$("#shipVia").val(),10);
						$("#quickCartHiddenInfo").attr("action", "displayCreditCardSale.action");
						$("#quickCartHiddenInfo").submit();
					}else if($('#orderType').val().trim() == "checkoutWithQuote"){
						bootAlert("small","error","Error","Submit Quote Order");
					}else{
						bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
					}
			}else{
				bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
			}
		}
	};
	
	
	
	checkoutWizard.displayNotification = function(msg,step){
		$("#step-"+step+" #notificationDiv").remove();
		$("#step-"+step).prepend('<div id="notificationDiv"><div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>'+msg+'</div></div>');
		$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
	};
	checkoutWizard.hideNotificationDiv = function(step){
		$("#step-"+step+" #notificationDiv").remove();
	}
	checkoutWizard.orderTypeOnchange = function(obj){
		console.log();
		if($('#wizFinishButtonId').length>0){
			$('#wizFinishButtonId').addClass("buttonDisabled");
			if($(obj).val().trim() == "checkoutWithPo"){
				$('#wizFinishButtonId').html("Submit Order");
				$("#chkMandatory").find("span").remove();
				$("#chkMandatory").append("<span class='text-danger'>*</span>");
			}else if($(obj).val().trim() == "checkoutWithCreditCard"){
				$('#wizFinishButtonId').html("Continue with Credit Card");
				$("#chkMandatory").find("span").remove();
			}
		}
	};
	checkoutWizard.orderTypeOnWizchange = function(obj){
		var paymentType = obj.data().type;
		
		$("#orderType").val(paymentType);
		if($('#wizFinishButtonId').length>0){
			if(paymentType == "checkoutWithPo"){
				$('#wizFinishButtonId').html("Submit Order");
				$("#chkMandatory").find("span").remove();
				$("#chkMandatory").append("<span class='text-danger'>*</span>");
			}else if(paymentType == "checkoutWithCreditCard"){
				$('#wizFinishButtonId').html("Continue with Credit Card");
				$("#chkMandatory").find("span").remove();
				if($("#creditCard").html().trim() == ""){
					var data = $("#quickCartHiddenInfo").serialize();
					block("Please Wait");
					$.ajax({
						type: "POST",
						url: "displayCreditCardSale.action",
						data: data,
						success: function(html){
							$("#creditCard").html($(html).find('#addNewCardForm')[0]);
							unblock();
						}
					});
				}
			}
		}
	};
	checkoutWizard.validatePcardFormWithNewIds = function(){
		var cardHolder = $.trim($("#cardHolderNewID").val());
		var cardAddress = $.trim($("#cardAddressNewID").val());
		var postalCode = $.trim($("#postalCodeNewID").val());
		var nickName = $.trim($("#nickNameNewID").val());
		var email = $.trim($("#emailNewID").val());
		var isValid = 1;
		var error = "";
		if(cardHolder==""){
			error += "Please Enter Card Holder Name.<br/>";
			isValid = 0;
		}
		if(cardAddress==""){
			error += "Please Enter Street Address.<br/>";
			isValid = 0;
		}
		if(postalCode==""){
			error += "Please Enter Postal Code.<br/>";
			isValid = 0;
		}
		if(nickName==""){
			error += "Please Enter Nick Name.";
			isValid = 0;
		}
		if(isValid == 0){
			showNotificationDiv("error",error);
			return false;
		}else{
			block("Please Wait");
			$.ajax({
				type: "POST",
				url: "submitNewCreditCardSale.action?fromPage=payWithNewCC",
				success: function(msg){
					unblock();
					$("#creditCard").html(msg);
				}
			});
		}
	}
	
})();
$.getScript(webThemes+'js/multiTab.min.js', function(){
	$('#wizardCheckout').multiTab({
		wizard:true,
		transitionEffect:'fade',
		disableAllSteps: true,
		accordion:true,
		onLeaveStep:checkoutWizard.leaveAStepCallback,
		onShowStep:checkoutWizard.showAStepCallback,
		FinishLabel:'submit Order',
		hideButtonsOnDisabled:true,
		onFinish:checkoutWizard.submitCheckoutRequest,
		appendFinishButtonTo: '#triggerOrderButtonDiv'
	});
	$('#paymentOptBlock').multiTab({
	   tabHeading: '.multiTabHeading2',
	   contentWrap: '.multiTabContent2',
	   transitionEffect: "fade",
	   onShowStep: checkoutWizard.orderTypeOnWizchange
	});

});

$("#shipVia").change(function(){
	$("#quickCartHiddenInfo input[name='shipVia']").val($(this).val());
});