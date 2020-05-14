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
	if($('#poNumber').length>0){
		$('#poNumber').val(value);
	}
	enqueue('sessionValueLink.action?crud=s&keyValue=poNumber&insertValue='+value+'&dt='+new Date())
}

var checkoutWizard = {};
(function() {
	
	var checkOutStep = 3;
	
	checkoutWizard.leaveAStepCallback = function(obj,context){
		var step_num= obj.attr('index');
		return (context.fromStep < context.toStep) ? submitThisForm("#step-"+step_num) : true;
	};
	
	checkoutWizard.showAStepCallback = function(obj){
		var step_num= obj.attr('index');
		if(step_num==checkOutStep){
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
			
			var shippingSelect;
			var disabledSelect = $('#step-2 select:disabled, #step-1 select:disabled');
			$(disabledSelect).attr('disabled', false);
			var shippingSelect = $(disabledSelect).serialize();
			$(disabledSelect).attr('disabled', true);
			
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
			if(shippingSelect){
				str = str +"&"+ shippingSelect;
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
					$('#confirmOrderPageDiv').html(data)
					var value = $('#poNumberTxt').val();
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
	
	checkoutWizard.changeShippingAddress = function(obj){
		var addressBookId = $(obj).val();
		if(typeof addressBookId!="undefined" && addressBookId!=null && addressBookId.trim().length > 0 && shippingListjson!=null && shippingListjson.length > 0){
			for (var i=0; i<shippingListjson.length; i++){
			    if(shippingListjson[i].addressBookId == addressBookId) {
					(shippingListjson[i].customerName && $.trim(shippingListjson[i].customerName)) ? $('#shipCompanyName').val($.trim(shippingListjson[i].customerName)) : $('#shipCompanyName').val("");
					(shippingListjson[i].address1 && $.trim(shippingListjson[i].address1)) ? $('#shipAddress1').val($.trim(shippingListjson[i].address1)) : $('#shipAddress1').val("");
					(shippingListjson[i].address2 && $.trim(shippingListjson[i].address2)) ? $('#shipAddress2').val($.trim(shippingListjson[i].address2)) : $('#shipAddress2').val("");
					(shippingListjson[i].city && $.trim(shippingListjson[i].city)) ? $('#shipCity').val($.trim(shippingListjson[i].city)) : $('#shipCity').val("");
					(shippingListjson[i].zipCodeStringFormat && $.trim(shippingListjson[i].zipCodeStringFormat)) ? $('#shipZipcode').val($.trim(shippingListjson[i].zipCodeStringFormat)) : $('#shipZipcode').val("");
					(shippingListjson[i].phoneNo && $.trim(shippingListjson[i].phoneNo)) ? $('#shipPhoneNo').val($.trim(shippingListjson[i].phoneNo)) : $('#shipPhoneNo').val("");
					(shippingListjson[i].emailAddress && $.trim(shippingListjson[i].emailAddress)) ? $('#shipEmail').val($.trim(shippingListjson[i].emailAddress)) : $('#shipEmail').val("");
					
					(shippingListjson[i].country && $.trim(shippingListjson[i].country)) ? (
						$("#countrySelectShip option[value='"+shippingListjson[i].country+"']").attr('selected','selected')
					) : (
						$('#countrySelectShip').val("US")
					);
					(shippingListjson[i].state && $.trim(shippingListjson[i].state)) ? (
						stateId = document.getElementById('countrySelectShip'),
						populateStatesOnchange(!shippingListjson[i].country ? "US" : shippingListjson[i].country, stateId, shippingListjson[i].state, true),
						$("#stateSelectShip option[value='"+shippingListjson[i].state+"']").attr('selected','selected')
					) : (
						$('#stateSelectShip').val("")
					);
					$('#countrySelectShip, #stateSelectShip').selectpicker('refresh');
			    }
			}
		}
	};
	checkoutWizard.insertDataToHiddenInfo = function(){
		$('#quickCartHiddenInfo [name="reqDate"]').val($('#reqDate').val());
		$('#quickCartHiddenInfo [name="shippingInstruction"]').val($('#shippingInstruction').val());
		$('#quickCartHiddenInfo [name="orderNotes"]').val($('#orderNotes').val());
		$("#quickCartHiddenInfo input[name='shipVia']").val($("#shipVia").val());
		$("#quickCartHiddenInfo input[name='orderedBy']").val($("#orderedBy").val());
	};
	checkoutWizard.submitCheckoutRequest = function(){
		if(submitThisForm("#step-"+checkOutStep)){
			if($('#orderType').length>0 && typeof $('#orderType').val()!="undefined" && $('#orderType').val()!=null && $('#orderType').val().trim().length > 0){
				checkoutWizard.insertDataToHiddenInfo();
					if($('#orderType').val().trim() == "checkoutWithPo"){
						/*var data = $("#quickCartHiddenInfo").serialize();
						block("Please Wait");
						$.ajax({
							type: "POST",
							url: "processCheckout.action",
							data: data,
							success: function(msg){
								window.location.href = 'orderConfirmation.action?salesOrderId='+msg;
							}
						});*/
						block("Please Wait");
						$("#quickCartHiddenInfo").attr("action","processOrder.action");
	    				$("#quickCartHiddenInfo").submit();
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
	
	checkoutWizard.orderTypeOnchange = function(obj){
		if($('#wizFinishButtonId').length>0){
			$('#wizFinishButtonId').addClass("buttonDisabled");
			if($(obj).val().trim() == "checkoutWithPo"){
				$('#wizFinishButtonId').html("Submit Order");
				$("#poNumberTxt").attr("data-required", "Y");
			}else if($(obj).val().trim() == "checkoutWithCreditCard"){
				$('#wizFinishButtonId').html("Continue with Credit Card");
				$("#poNumberTxt").attr("data-required", "N");
			}
		}
	};
	checkoutWizard.orderTypeOnWizchange = function(obj){
		var paymentType = obj.data().type;
		$("#orderType").val(paymentType);
		if($('#wizFinishButtonId').length>0){
			if(paymentType == "checkoutWithPo"){
				$('#wizFinishButtonId').html("Submit Order");
				$("#poNumberTxt").attr("data-required", "Y");
			}else if(paymentType == "checkoutWithCreditCard"){
				$('#wizFinishButtonId').html("Continue with Credit Card");
				$("#poNumberTxt").attr("data-required", "N");
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