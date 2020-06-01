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
//$("#stateSelect").attr('disabled',true);
//$("#countrySelect").attr('disabled',true);
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
	var checkOutStep = 3;
	guestCheckoutWizard.checkUserNameExist = function(){
		var validation = true;
		var errorMessage = "";
		$('.alert').remove();
		if($('#auEmail').length>0 && (typeof $('#auEmail').val()=="undefined" || $('#auEmail').val()==null || $('#auEmail').val().trim().length < 1)){
			errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddress");
			validation = false;
		}else{
			if(!validateEmail($('#auEmail').val().trim())){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid");
				validation = false;
			}
		}
		if(validation){
			block('Please Wait');
			var str = $("#guestCheckoutInitiate").serialize();
			enqueue("/checkUserExistInDataBaseRoll.action?"+str+"&dt="+new Date(),function(data){
				unblock();
				if(data!=null && $.trim(data)!=""){
					if($.trim(data)=="Y" || $.trim(data)=="N"){
						block('Please Wait');
						$("#guestCheckoutInitiate").attr("action","guestCheckoutSale.action");
						$("#guestCheckoutInitiate").submit();
						return true;
					}else if($.trim(data)=="AR"){
						errorMessage = errorMessage + locale("guestcheckoutwiz.error.registeredaccountmessage");
						guestCheckoutWizard.displayNotification('#guestCheckoutInitiate', errorMessage);
						return false;
					}else{
						guestCheckoutWizard.displayNotification('#guestCheckoutInitiate', data);
						return false;
					}
				}else{
					return false;
				}
			});
		}else{
			guestCheckoutWizard.displayNotification('#guestCheckoutInitiate', errorMessage);
			unblock();
			return false;
		}
		
	};
	
	guestCheckoutWizard.checkUserNameExistOnBlur = function(obj){
		var validation = true;
		var errorMessage = "";
		var auEmailCurrent = "";
		var auEmailPrevious = "";
		$('.alert').remove();
		if($(obj).length>0 && typeof $(obj).val()!="undefined" && $(obj).val()!=null && $(obj).val().trim().length > 0){
			auEmailCurrent = $(obj).val().trim();
			if(!validateEmail(auEmailCurrent)){
				errorMessage = errorMessage + locale("guestcheckoutwiz.error.emailaddressinvalid");
				guestCheckoutWizard.displayNotification('#step-1', errorMessage);
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
						guestCheckoutWizard.displayNotification('#step-1', errorMessage);
						$('#userAccountExist').val("Y");
					}else{
						$('#userAccountExist').val("N");
					}
				}
			});
		}
	};
	guestCheckoutWizard.leaveAStepCallback = function(obj,context){
		//var step_num= obj.attr('rel');
		//return guestCheckoutWizard.validateSteps(step_num,context);
		var step_num= obj.attr('index');
		var valid = (context.fromStep < context.toStep) ? submitThisForm("#step-"+step_num) : true;
		if(step_num == '1' && valid){
			guestCheckoutWizard.sameAsBillingAddress();
		}
		return valid;
	};
	
	guestCheckoutWizard.showAStepCallback = function(obj){
		var step_num= obj.attr('index');
		if(step_num==checkOutStep){
			$('.alert').remove();
			guestCheckoutWizard.setOrderDetailsFromBillingAddress();
			var str = "";
			var poNumber = $('#poNumberTxt').val();
			var billingInputs = $('#step-1 :input').serialize();
			var shippingInputs = $('#step-2 :input').serialize();
			var orderDetailInputs = $('#step-3 :input').serialize();
			var shippingSelect;
			var disabledSelect = $('#step-2 select:disabled, #step-1 select:disabled');
			$(disabledSelect).attr('disabled', false);
			var shippingSelect = $(disabledSelect).serialize();
			
			if(billingInputs!=null && $.trim(billingInputs)!=""){
				str = billingInputs +"&";
			}
			if(shippingInputs!=null && $.trim(shippingInputs)!=""){
				str = str + shippingInputs +"&";			
			}
			if(orderDetailInputs!=null && $.trim(orderDetailInputs)!=""){
				str = str + orderDetailInputs;
			}
			if(shippingSelect){
				str = str +"&"+ shippingSelect;
			}
			
			str = str + "&dt="+new Date();
			block('Please Wait');
			enqueue("/guestConfirmOrderSale.action?"+str+"&dt="+new Date(),function(data){
				if(data!=null && data!=""){
					$('#confirmOrderPageDiv').html(data)
					var value = $('#poNumberTxt').val();
					if($('#poNumber').length>0){
						$('#poNumber').val(value);
					}
					if($('#wizFinishButtonId').length>0){
						$('#wizFinishButtonId').removeClass("buttonDisabled");
					}
					$(".buttonNext").removeClass("buttonDisabled");
					var data = $("#quickCartHiddenInfo").serialize();
					$.ajax({
						type: "POST",
						url: "displayCreditCardSale.action",
						data: data,
						success: function(html){
							$("#creditCard").html($(html).find('#addNewCardForm')[0]);
							unblock();
						}
					});
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
	
	guestCheckoutWizard.setOrderDetailsFromBillingAddress = function(){
		var orderdBy = "";
		var firstName = ($('#auBillFirstName').length > 0) ? $('#auBillFirstName').val() : '';
		var lastName = ($('#auBillLastName').length > 0) ? $('#auBillLastName').val() : '';
		if($('#orderedBy').length > 0){
			$('#orderedBy').val(firstName + ' ' + lastName);
		}
		//guestUserLoadShipMethodFromSession();
	};
	
	guestCheckoutWizard.validatePcardFormWithNewIds = function(){
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
	
	guestCheckoutWizard.submitCheckoutRequest = function(){
		if(submitThisForm("#step-"+checkOutStep)){
			if($('#orderType').length>0 && $('#orderType').val().trim().length > 0){
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
					$("#quickCartHiddenInfo").attr("action", "displayCreditCardSale.action");
					//$("#quickCartHiddenInfo").attr("action", "submitNewCreditCardSale.action");
					$("#quickCartHiddenInfo").submit();
				}else{
					bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
				}
			}else{
				bootAlert("small","error","Error","Cannot proceed, please contact our customer support");
			}
		}
	};
	
	
	guestCheckoutWizard.displayNotification = function(form, msg){
		$(form).prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">&times;</a>'+msg+'</div>');
		var headerHeight = 0;
		if ($("#enableStickyHeader").val() == "Y") {
			headerHeight = $('#normalHead').height();
		}
		$('html, body').animate({ scrollTop: $(".alert").offset().top - headerHeight }, 400);
	};
	
	guestCheckoutWizard.sameAsBillingAddress = function(){
		var isChecked = $("#auChkSameAsBilling").is(':checked');
		var countrySelect = $('#countrySelect').val();
		var stateSelectShip = $('#stateSelect').val();
		(isChecked && $('#auShipFirstName').length>0) ? $('#auShipFirstName').val($('#auBillFirstName').val()) : $('#auShipFirstName').val('');
		(isChecked && $('#auShipLastName').length>0) ? $('#auShipLastName').val($('#auBillFirstName').val()) : $('#auShipLastName').val('');
		(isChecked && $('#auShipAddress1').length>0) ? $('#auShipAddress1').val($('#auBillAddress1').val()) : $('#auShipAddress1').val('');
		(isChecked && $('#auShipAddress2').length>0) ? $('#auShipAddress2').val($('#auBillAddress2').val()) : $('#auShipAddress2').val('');
		(isChecked && $('#auShipCity').length>0) ? $('#auShipCity').val($('#auBillCity').val()) : $('#auShipCity').val('');
		(isChecked && $('#auShipZipCode').length>0) ? $('#auShipZipCode').val($('#auBillZipCode').val()) : $('#auShipZipCode').val('');
		(isChecked && $('#auShipPhoneNo').length>0) ? $('#auShipPhoneNo').val($('#auBillPhoneNo').val()) : $('#auShipPhoneNo').val('');
		(isChecked && $('#auShipEmail').length>0) ? $('#auShipEmail').val($('#auEmail').val()) : $('#auShipEmail').val('');
		(isChecked && $('#auShipAddress2').length>0) ? $('#auShipAddress2').val($('#auBillAddress2').val()) : $('#auShipAddress2').val('');
		(isChecked && $('#auShipCity').length>0) ? $('#auShipCity').val($('#auBillCity').val()) : $('#auShipCity').val('');
		
		($.trim(countrySelect) != "") ? (
			$("#countrySelectShip option[value='"+countrySelect+"']").attr('selected','selected')
		) : (
			$('#countrySelectShip').val("US")
		);
		($.trim(stateSelectShip) != "") ? (
			stateId = document.getElementById('countrySelectShip'),
			populateStatesOnchange(!countrySelect ? "US" : countrySelect, stateId, stateSelectShip, true),
			$("#stateSelectShip option[value='"+stateSelectShip+"']").attr('selected','selected')
		) : (
			$('#stateSelectShip').val("")
		);
		$('#countrySelectShip, #stateSelectShip').selectpicker('refresh');
	};
	
	/* Unable to find the flag so commenting the below validation
	if($('#orderedBy').length>0 && typeof $('#orderedBy').val()!="undefined" && $('#guestRegistrationFlag').val()!=null && $('#guestRegistrationFlag').val().trim()=="N"){
		errorMessage = errorMessage + $('#guestRegistrationErrorMessage').val() + lineBreak;
		validation = false;
	}*/

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

/*function guestUserLoadShipMethodFromSession(){
	enqueue('getSessionShipMethodUnit.action?dt='+new Date(),function(data){
		if(data){
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
}*/
	
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