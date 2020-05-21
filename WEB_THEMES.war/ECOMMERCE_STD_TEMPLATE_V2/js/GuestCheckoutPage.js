var webThemes = $("#webThemePath").val();
/*jQuery.getScript(webThemes+'js/guestCheckoutWizard.js', function(){});*/
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
	if($('#countrySelect').length> 0){
		var countrySelect = new initCountry({
			country: billAddressCountry,
			selectorID: "countrySelect",
			defaultSelect: true
		});
	}
	if($('#countrySelectShip').length> 0){
		var countrySelectShip = new initCountry({
			country: shipAddressCountry,
			selectorID: "countrySelectShip",
			defaultSelect: true
		});
	}
	
	var guestCheckoutWizard = {};
	(function() {
		
		guestCheckoutWizard.runScript = function(e) {
			if (e.keyCode == 13) {
				$('#guestCheckoutContinue').click();
				return false;
			}
		}
		
		guestCheckoutWizard.checkUserNameExist = function(){
			block('Please Wait');
			var validation = true;
			var errorMessage = "";
			hideNotificationDiv();
			if($('#auEmail').length>0 && (typeof $('#auEmail').val()=="undefined" || $('#auEmail').val()==null || $('#auEmail').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddress");
				validation = false;
				unblock();
			}else{
				if(!validateEmail($('#auEmail').val().trim())){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid");
					validation = false;
					unblock();
				}
			}
			
			if(validation){
				var str = $("#guestCheckoutInitiate").serialize();
				enqueue("/checkUserExistInDataBaseRoll.action?"+str+"&dt="+new Date(),function(data){
					if(data!=null && $.trim(data)!=""){
						unblock();
						if($.trim(data)=="Y" || $.trim(data)=="N"){
							block('Please Wait');
							$("#guestCheckoutInitiate").attr("action","guestCheckoutSale.action");
							$("#guestCheckoutInitiate").submit();
							return true;
						}else if($.trim(data)=="AR"){
							errorMessage = errorMessage + locale("guestcheckoutwiz.error.registeredaccountmessage");
							guestCheckoutWizard.displayNotification(errorMessage);
							return false;
						}else{
							errorMessage = data;
							guestCheckoutWizard.displayNotification(errorMessage);
							return false;
						}
					}else{
						return false;
					}
				});
			}else{
				guestCheckoutWizard.displayNotification(errorMessage);
				return false;
				unblock();
			}
			
		};
		
		guestCheckoutWizard.checkUserNameExistOnBlur = function(obj){
			var validation = true;
			var errorMessage = "";
			var auEmailCurrent = "";
			var auEmailPrevious = "";
			
			hideNotificationDiv();
			
			if($(obj).length>0 && typeof $(obj).val()!="undefined" && $(obj).val()!=null && $(obj).val().trim().length > 0){
				auEmailCurrent = $(obj).val().trim();
				if(!validateEmail(auEmailCurrent)){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid");
					guestCheckoutWizard.displayNotification(errorMessage);
					validation = false;
				}
			}
			
			if($('#auEmailPrevious').length>0 && typeof $('#auEmailPrevious').val()!="undefined" && $('#auEmailPrevious').val()!=null && $('#auEmailPrevious').val().trim().length > 0){
				auEmailPrevious = $('#auEmailPrevious').val().trim();
			}
			
			if(validation && auEmailPrevious!=auEmailCurrent){
				block('Please Wait');
				$('#auEmailPrevious').val(auEmailCurrent);
				enqueue("/checkUserExistInDataBaseRoll.action?auEmail="+$(obj).val()+"&dt="+new Date(),function(data){
					unblock();
					if(data!=null && $.trim(data)!=""){
						if($.trim(data)=="AR"){
							errorMessage = errorMessage + locale("guestcheckoutwiz.error.registeredaccountmessage");
							guestCheckoutWizard.displayNotification(errorMessage);
							$('#userAccountExist').val("Y");
						}else{
							$('#userAccountExist').val("N");
						}
					}
				});
			}
		};
		
		guestCheckoutWizard.leaveAStepCallback = function(obj,context){
			var step_num= obj.attr('rel');
			return guestCheckoutWizard.validateSteps(step_num,context);
		};
		
		guestCheckoutWizard.showAStepCallback = function(obj){
			var step_num= obj.attr('rel');
			if(step_num==1){
				hideNotificationDiv();
				$('#guestBillAddress').show();
				$('#guestShipAddress').hide();
				$('#guestOrderDetails').hide();
				$('#guestOrderItemDetails').hide();
				triggerText();
			}else if(step_num==2){
				hideNotificationDiv();
				$('#guestShipAddress').show();
				$('#guestOrderDetails').hide();
				$('#guestOrderItemDetails').hide();
				triggerText();
			}else if(step_num==3){
				hideNotificationDiv();
				$('#guestOrderDetails').show();
				$('#guestOrderItemDetails').hide();
				if($('#guestRegistrationFlag').val()!="Y"){
					block('Please Wait');
					guestCheckoutWizard.guestUserRegistrationAndSetSession();
				}
				guestCheckoutWizard.setOrderDetailsFromBillingAddress();
				triggerText();
			}else if(step_num==4){
				$('#guestOrderItemDetails').show();
				var str = "";
				var poNumber = $('#poNumberTxt').val();
				/*var billingInputs = $('#step-1 :input').serialize();
				var shippingInputs = $('#step-2 :input').serialize();*/
				var orderDetailInputs = $('#step-3 :input').serialize();
				
				/*if(billingInputs!=null && $.trim(billingInputs)!=""){
					str = billingInputs +"&";
				}
				if(shippingInputs!=null && $.trim(shippingInputs)!=""){
					str = str + shippingInputs +"&";			
				}*/
				if(orderDetailInputs!=null && $.trim(orderDetailInputs)!=""){
					str = str + orderDetailInputs;
				}
				str = str + "&dt="+new Date();
				block('Please Wait');
				enqueue("/guestConfirmOrderSale.action?"+str+"&dt="+new Date(),function(data){
					if(data!=null && data!=""){
						$('#confirmOrderPageDiv').html(data);
						var value = $('#poNumberTxt').val();
						if($('#poNumber').length>0){
						 $('#poNumber').val(value);
						}
						unblock();
					}else{
						unblock();
						bootAlert("small","error","Error","Your cart is empty!");
						$("[data-bb-handler='ok']").click(function(){
							window.location.href = '/Cart';
						});
						
					}
				});
			}
		};
		
		guestCheckoutWizard.validateSteps = function(step,context){
			var isStepValid = true;
			if(step == 1){
				hideNotificationDiv();
				isStepValid = guestCheckoutWizard.stepOneValidate();
			}else if(step==2){
				hideNotificationDiv();
				if(context.toStep!=1){
					isStepValid = guestCheckoutWizard.stepTwoValidate();
				}
			}else if(step==3){
				if(context.toStep!=2 || context.toStep!=2){
					hideNotificationDiv();
					isStepValid = guestCheckoutWizard.stepThreeValidate();
				}
			}
			return isStepValid; 
		};
		
		guestCheckoutWizard.stepOneValidate = function(){
			var errorMessage = "";
			var validation = true;
			var lineBreak = "<br/>";
			
			if($('#auEmail').length>0 && (typeof $('#auEmail').val()=="undefined" || $('#auEmail').val()==null || $('#auEmail').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddress") + lineBreak;
				validation = false;
			}else{
				if(!validateEmail($('#auEmail').val().trim())){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid") + lineBreak;
					validation = false;
				}else{
					if($('#userAccountExist').val()=="Y"){
						errorMessage = errorMessage + locale("guestcheckoutwiz.error.registeredaccountmessage") + lineBreak;
						guestCheckoutWizard.displayNotification(errorMessage);
						$('#userAccountExist').val("Y");
						validation = false;
					}
				}
			}
			if($('#auBillPhoneNo').length>0 && (typeof $('#auBillPhoneNo').val()=="undefined" || $('#auBillPhoneNo').val()==null || $('#auBillPhoneNo').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.phone") + lineBreak;
				validation = false;
			}else{
				if(!isPhoneNumberValid($('#auBillPhoneNo').val().trim())){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.phoneinvalid") + lineBreak;
					validation = false;
				}
			}
			if($('#auBillFirstName').length>0 && (typeof $('#auBillFirstName').val()=="undefined" || $('#auBillFirstName').val()==null || $('#auBillFirstName').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.firstname") + lineBreak;
				validation = false;
			}
			if($('#auBillLastName').length>0 && (typeof $('#auBillLastName').val()=="undefined" || $('#auBillLastName').val()==null || $('#auBillLastName').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.lastname") + lineBreak;
				validation = false;
			}
			if($('#auBillAddress1').length>0 && (typeof $('#auBillAddress1').val()=="undefined" || $('#auBillAddress1').val()==null || $('#auBillAddress1').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.address1") + lineBreak;
				validation = false;
			}
			/*if($('#auBillAddress2').length>0 && (typeof $('#auBillAddress2').val()=="undefined" || $('#auBillAddress2').val()==null || $('#auBillAddress2').val().trim().length < 1)){
				address2 = $('#auBillAddress2').val();
			}*/
			if($('#auBillCity').length>0 && (typeof $('#auBillCity').val()=="undefined" || $('#auBillCity').val()==null || $('#auBillCity').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.city") + lineBreak;
				validation = false;
			}
			if($('#stateSelect').length>0 && (typeof $('#stateSelect').val()=="undefined" || $('#stateSelect').val()==null || $('#stateSelect').val().trim().length < 1 || $('#stateSelect').val()=="Select State" || $('#stateSelect').val().trim() == "")){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.state") + lineBreak;
				validation = false;
			}else{
				$('#stateSelect').trigger("chosen:updated");
			}
			if($('#auBillZipCode').length>0 && (typeof $('#auBillZipCode').val()=="undefined" || $('#auBillZipCode').val()==null || $('#auBillZipCode').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.zipcode") + lineBreak;
				validation = false;
			}
			if($('#countrySelect').length>0 && (typeof $('#countrySelect').val()=="undefined" || $('#countrySelect').val()==null || $('#countrySelect').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.country") + lineBreak;
				validation = false;
			}else{
				$('#countrySelect').trigger("chosen:updated");
			}
			
			if(!validation){
				guestCheckoutWizard.displayNotification(errorMessage);
				return false;
			}else{
				guestCheckoutWizard.sameAsBillingAddress();
				return true;
			}
		};
		
		guestCheckoutWizard.stepTwoValidate = function(){
			
			var errorMessage = "";
			var validation = true;
			var lineBreak = "<br/>";
			
			if($('#auShipFirstName').length>0 && (typeof $('#auShipFirstName').val()=="undefined" || $('#auShipFirstName').val()==null || $('#auShipFirstName').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.firstname") + lineBreak;
				validation = false;
			}
			if($('#auShipLastName').length>0 && (typeof $('#auShipLastName').val()=="undefined" || $('#auShipLastName').val()==null || $('#auShipLastName').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.lastname") + lineBreak;
				validation = false;
			}
			if($('#auShipAddress1').length>0 && (typeof $('#auShipAddress1').val()=="undefined" || $('#auShipAddress1').val()==null || $('#auShipAddress1').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.address1") + lineBreak;
				validation = false;
			}
			/*if($('#auShipAddress2').length>0 && (typeof $('#auShipAddress2').val()=="undefined" || $('#auShipAddress2').val()==null || $('#auShipAddress2').val().trim().length < 1)){
				address2 = $('#auShipAddress2').val();
			}*/
			if($('#auShipCity').length>0 && (typeof $('#auShipCity').val()=="undefined" || $('#auShipCity').val()==null || $('#auShipCity').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.city") + lineBreak;
				validation = false;
			}
			if($('#stateSelectShip').length>0 && (typeof $('#stateSelectShip').val()=="undefined" || $('#stateSelectShip').val()==null || $('#stateSelectShip').val().trim().length < 1 || $('#stateSelectShip').val()=="Select State")){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.state") + lineBreak;
				validation = false;
			}else{
				$('#stateSelectShip').trigger("chosen:updated");
			}
			if($('#auShipZipCode').length>0 && (typeof $('#auShipZipCode').val()=="undefined" || $('#auShipZipCode').val()==null || $('#auShipZipCode').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.zipcode") + lineBreak;
				validation = false;
			}
			if($('#countrySelectShip').length>0 && (typeof $('#countrySelectShip').val()=="undefined" || $('#countrySelectShip').val()==null || $('#countrySelectShip').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.country") + lineBreak;
				validation = false;
			}else{
				$('#countrySelectShip').trigger("chosen:updated");
			}
			if($('#auShipPhoneNo').length>0 && (typeof $('#auShipPhoneNo').val()=="undefined" || $('#auShipPhoneNo').val()==null || $('#auShipPhoneNo').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.phone") + lineBreak;
				validation = false;
			}else{
				if(!isPhoneNumberValid($('#auShipPhoneNo').val().trim())){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.phoneinvalid") + lineBreak;
					validation = false;
				}
			}
			/*if($('#auShipEmail').length>0 && (typeof $('#auShipEmail').val()=="undefined" || $('#auShipEmail').val()==null || $('#auShipEmail').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddress") + lineBreak;
				validation = false;
			}else{
				if(!validateEmail($('#auShipEmail').val().trim())){
					errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid") + lineBreak;
					validation = false;
				}
			}*/
			if(!validation){
				guestCheckoutWizard.displayNotification(errorMessage);
				return false;
			}else{
				return true;
			}
		};
		
		guestCheckoutWizard.stepThreeValidate = function(){
			
			var errorMessage = "";
			var validation = true;
			var lineBreak = "<br/>";
			
			if($('#orderedBy').length>0 && (typeof $('#orderedBy').val()=="undefined" || $('#orderedBy').val()==null || $('#orderedBy').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.orderby") + lineBreak;
				validation = false;
			}
			if($('#poNumberTxt').length>0 && (typeof $('#poNumberTxt').val()=="undefined" || $('#poNumberTxt').val()==null || $('#poNumberTxt').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.purchaseordernumber") + lineBreak;
				validation = false;
			}
			if($('#reqDate').length>0 && (typeof $('#reqDate').val()=="undefined" || $('#reqDate').val()==null || $('#reqDate').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.requireddate") + lineBreak;
				validation = false;
			}
			if($('#selectedShipViaWL').length>0 && (typeof $('#selectedShipViaWL').val()=="undefined" || $('#selectedShipViaWL').val()==null || $('#selectedShipViaWL').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.shipvia") + lineBreak;
				validation = false;
			}
			/*if($('#shippingInstruction').length>0 && (typeof $('#shippingInstruction').val()=="undefined" || $('#shippingInstruction').val()==null || $('#shippingInstruction').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.shippinginstruction") + lineBreak;
				validation = false;
			}*/
			/*if($('#orderNotes').length>0 && (typeof $('#orderNotes').val()=="undefined" || $('#orderNotes').val()==null || $('#orderNotes').val().trim().length < 1)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.ordernote") + lineBreak;
				validation = false;
			}*/
			
			//Card Details Validation
			var cardHolder = $.trim($("#cardHolderNewID").val());
			var cardAddress = $.trim($("#cardAddressNewID").val());
			var postalCode = $.trim($("#postalCodeNewID").val());
			var nickName = $.trim($("#nickNameNewID").val());
			var email = $.trim($("#emailNewID").val());
			var isValid = 1;
			if(nickName==""){
				errorMessage = errorMessage +"Please Enter Nick Name." + lineBreak;
				validation = false;
			}
			if(cardHolder==""){
				errorMessage = errorMessage +"Please Enter Card Holder Name." + lineBreak;
				validation = false;
			}
			if(cardAddress==""){
				errorMessage = errorMessage +"Please Enter Street Address." + lineBreak;
				validation = false;
			}
			if(postalCode==""){
				errorMessage = errorMessage +"Please Enter Postal Code." + lineBreak;
				validation = false;
			}
			//Card Details Validation
			
			if($('#orderedBy').length>0 && typeof $('#orderedBy').val()!="undefined" && $('#guestRegistrationFlag').val()!=null && $('#guestRegistrationFlag').val().trim()=="N"){
				errorMessage = errorMessage + $('#guestRegistrationErrorMessage').val() + lineBreak;
				validation = false;
			}
			
			if(!validation){
				guestCheckoutWizard.displayNotification(errorMessage);
				return false;
			}else{
				return true;
			}
		};
		
		guestCheckoutWizard.submitCheckoutRequest = function(){
			/*if($('#orderType').length>0 && typeof $('#orderType').val()!="undefined" && $('#orderType').val()!=null && $('#orderType').val().trim().length > 0){
					if($('#orderType').val().trim() == "checkoutWithPo"){
						var data = $("#quickCartHiddenInfo").serialize();
						$.ajax({
							type: "POST",
							url: "processCheckout.action",
							data: data,
							success: function(msg){
								window.location.href = 'orderConfirmation.action?salesOrderId='+msg;
							}
						});
						
					}else if($('#orderType').val().trim() == "checkoutWithCreditCard"){
						//bootAlert("small","error","Error","Submit Credit Card Order");
						
					}else if($('#orderType').val().trim() == "checkoutWithQuote"){
						bootAlert("small","error","Error","Submit Quote Order");
					}else{
						bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
					}
			}else{
				bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
			}*/
			block('Please Wait');
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
			//$("#quickCartHiddenInfo").attr("action", "displayCreditCardSale.action");
			$("#quickCartHiddenInfo").attr("action", "submitNewCreditCardSale.action");
			$("#quickCartHiddenInfo").submit();
		};
		
		
		guestCheckoutWizard.displayNotification = function(msg){
			if(msg!=null && $.trim(msg)!=""){
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
			}
		};
		
		
		guestCheckoutWizard.sameAsBillingAddress = function(){
			if($("#auChkSameAsBilling").is(':checked')){
				guestCheckoutWizard.copyBillingAddressToShippingAddressField();
			}else{
				guestCheckoutWizard.emptyBillingAddressFromShippingAddressField();
			}
		};
		
		guestCheckoutWizard.copyBillingAddressToShippingAddressField = function(){
			if($('#auBillFirstName').length>0 && $('#auShipFirstName').length>0){
				$('#auShipFirstName').val($('#auBillFirstName').val());
			}
			if($('#auBillLastName').length>0 && $('#auShipLastName').length>0){
				$('#auShipLastName').val($('#auBillLastName').val());
			}
			if($('#auBillAddress1').length>0 && $('#auShipAddress1').length>0){
				$('#auShipAddress1').val($('#auBillAddress1').val());
			}
			if($('#auBillAddress2').length>0 && $('#auShipAddress2').length>0){
				$('#auShipAddress2').val($('#auBillAddress2').val());
			}
			if($('#auBillCity').length>0 && $('#auShipCity').length>0){
				$('#auShipCity').val($('#auBillCity').val());
			}
			if($('#stateSelect').length>0 && $('#stateSelectShip').length>0){
				$('#stateSelectShip').val($('#stateSelect').val());
				$('#stateSelectShip').trigger("chosen:updated");
			}
			if($('#auBillZipCode').length>0 && $('#auShipZipCode').length>0){
				$('#auShipZipCode').val($('#auBillZipCode').val());
			}
			if($('#countrySelect').length>0 && $('#countrySelectShip').length>0){
				$('#countrySelectShip').val($('#countrySelect').val());
				$('#countrySelectShip').trigger("chosen:updated");
			}
			if($('#auBillPhoneNo').length>0 && $('#auShipPhoneNo').length>0){
				$('#auShipPhoneNo').val($('#auBillPhoneNo').val());
			}
			if($('#auEmail').length>0 && $('#auShipEmail').length>0){
				$('#auShipEmail').val($('#auEmail').val());
			}
		};
		
		guestCheckoutWizard.emptyBillingAddressFromShippingAddressField = function(){
				
				if($('#auShipFirstName').length>0){
					$('#auShipFirstName').val("");
				}
				if($('#auShipLastName').length>0){
					$('#auShipLastName').val("");
				}
				if($('#auShipAddress1').length>0){
					$('#auShipAddress1').val("");
				}
				if($('#auShipAddress2').length>0){
					$('#auShipAddress2').val("");
				}
				if($('#auShipCity').length>0){
					$('#auShipCity').val("");
				}
				if($('#stateSelectShip').length>0){
					$('#stateSelectShip').val("");
					$('#stateSelectShip').trigger("chosen:updated");
				}
				if($('#auShipZipCode').length>0){
					$('#auShipZipCode').val("");
				}
				if($('#countrySelectShip').length>0){
					$('#countrySelectShip').val("");
					$('#countrySelectShip').trigger("chosen:updated");
				}
				if($('#auShipPhoneNo').length>0){
					$('#auShipPhoneNo').val("");
				}
				if($('#auShipEmail').length>0){
					$('#auShipEmail').val("");
				}
		};
		
		guestCheckoutWizard.setOrderDetailsFromBillingAddress = function(){
			var orderdBy = "";
			
			if($('#auBillFirstName').length>0 && $('#auShipFirstName').length>0){
				orderdBy = $('#auBillFirstName').val();
			}
			if($('#auBillLastName').length>0 && $('#auShipLastName').length>0){
				if($.trim(orderdBy).length>0){
					orderdBy = orderdBy+" "+$('#auBillLastName').val();
				}else{
					orderdBy = $('#auBillLastName').val();
				}
			}
			if($('#orderedBy').length>0 && typeof $('#orderedBy').val()!="undefined" && $('#orderedBy').val()!=null && $.trim(orderdBy).length>0){
				$('#orderedBy').val(orderdBy);
			}
			guestUserLoadShipMethodFromSession();
		};
		
		
		guestCheckoutWizard.guestUserRegistrationAndSetSession = function(){
			var str = "";
			var billingInputs = $('#step-1 :input').serialize();
			var shippingInputs = $('#step-2 :input').serialize();
			var orderDetailInputs = $('#step-3 :input').serialize();
			if(billingInputs!=null && $.trim(billingInputs)!=""){
				str = billingInputs +"&";
			}
			if(shippingInputs!=null && $.trim(shippingInputs)!=""){
				str = str + shippingInputs +"&";			
			}
			if(orderDetailInputs!=null && $.trim(orderDetailInputs)!=""){
				str = str + orderDetailInputs;
			}
			str = str + "&dt="+new Date();
			jQuery.ajax({
				type: "POST",
				url: "guestUserRegistrationRoll.action",
				data: str,
				success: function(msg){
						unblock();
						$("#wizFinishButtonId").text("Proceed to Checkout");
						var resultArr = msg.split("|");
						var ms = "";
						if(resultArr[0]=="5"){
							$("#guestRegistrationFlag").val("Y");
							$("#wizFinishButtonId").removeAttr("disabled");
							$(".buttonNext").removeClass("buttonDisabled");
							return false;
						}else{
							$(".buttonNext").addClass( "buttonDisabled" );
							//ms = msg.replace(/\|/g,"\n");
							ms = msg.replace(/\|/g,"<br/>");
							console.log(ms);
							$("#guestRegistrationFlag").val("N");
							$("#guestRegistrationErrorMessage").val(ms);
							guestCheckoutWizard.displayNotification(ms);
							return false;
						}
						return false;
				}
		});
		};
	})();

	function guestUserLoadShipMethodFromSession(){
		enqueue('getSessionShipMethodUnit.action?dt='+new Date(),function(data){
			if(data!=null){
				var updateDropDown = false;
				//console.log(data);
				data = $.parseJSON(data);
				//console.log(data.length);
				if(data!=null && data.length>0){
					$.each(data, function(i, value) {
						if(value!=null && value.shipViaID!=null && value.shipViaID!=""){
							if(!updateDropDown){
								$("#selectedShipViaWL").find('option').remove();
								$("#selectedShipViaWL").append('<option value=" ">-Select-</option>');
							}
							updateDropDown = true;
							$("#selectedShipViaWL").append('<option value="'+value.shipViaID+'">'+value.shipViaID+'</option>');
						}
					});
				}
				if(updateDropDown){
					$('.appendChosen').trigger('chosen:updated');
				}
			}
		});
	}
	
	$.getScript(webThemes+'js/multiTab.min.js', function(){
		$('#wizardGuestCheckout').multiTab({
			wizard:true,
			transitionEffect:'fade',
			disableAllSteps: true,
			accordion:true,
			onLeaveStep:guestCheckoutWizard.leaveAStepCallback,
			onShowStep:guestCheckoutWizard.showAStepCallback,
			FinishLabel:'submit Order',
			hideButtonsOnDisabled:true,
			onFinish:guestCheckoutWizard.submitCheckoutRequest
		});
	});