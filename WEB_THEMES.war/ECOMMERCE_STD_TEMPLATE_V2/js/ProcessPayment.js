var paymentProcessor = {};
(function () {
    paymentProcessor.customerPaymentId = "";
	paymentProcessor.currentRequest = false;
	paymentProcessor.addNewRequest = false;
    paymentProcessor.loadCardOrContinueCheckout = function () {
        jQuery.ajax({
            type: "POST", url: "checkCustomerProfileIdSale.action", data: "", async: false,
            success: function (customerProfileId) {
                jQuery("#customerProfileId").val(customerProfileId);
				var fromPage=jQuery(".fromPage").val();
                //if (customerProfileId > 0) {
                    jQuery.ajax({
                        type: "POST",
                        url: "authorizeGetCustomerProfileSale.action?frPage="+fromPage,
                        data: "customerProfileId=" + customerProfileId,
                        async: false,
                        success: function (msg){
							if($(msg).find("#creditCardCount").val()=="" ||$(msg).find("#creditCardCount").val()=="0"){
								$("#cardDetailsNew").html(msg);
								$(".addNewCardBtn").show();
								$("#creditCardForm").show();
								var radioStatus = $("input[type=radio][name='radioBtn']:checked").val();
								if(radioStatus!="on"){
									$('input:radio[name=radioBtn]').attr('checked', true);
								}
							}else if($(msg).find("#creditCardCount").val()==1 && paymentProcessor.currentRequest){
								paymentProcessor.customerPaymentId = $(msg).find("#r_1").val().replace('[', '').replace(']', '');
                                paymentProcessor.placeOrder();
							}else {
								$("#cardDetailsNew").html(msg);
								//$("#addNewCardRadioBtn").attr('checked');
							}
                        }
                    });
                //}
            }
        });
    }
    paymentProcessor.deleteCard = function (obj) {
		var paymentAccId = $(obj).attr("data-index").replace('[', '').replace(']', '');
		var cardNumber = $(obj).data('cardnumber');
			jConfirm('', 'Are you sure you want to Delete the card number ending with '+cardNumber, function(r) {     
				if(r==true)
				{
					var paymentAccId = $(obj).attr("data-index").replace('[', '').replace(']', '');
					var customerProfId = jQuery("#customerProfileId").val();
					var str = "customerProfileId=" + customerProfId + "&customerPaymentId=" + paymentAccId;
					var fromPage=jQuery(".fromPage").val();
					jQuery.ajax({
						type: "POST", url: "deleteCustomerPaymentProfileSale.action", data: str, async: false,
						success: function (msg) {
							if (msg == "Deleted") {
								paymentProcessor.displayAlert("Credit Card deleted Successfully");
								paymentProcessor.loadCardOrContinueCheckout();
							}
						}
					});
				}
				else
				{
					
				}
			});

        
    };
    paymentProcessor.validateStringForProcess = function (jQObject) {
        if (jQObject.length > 0 && (typeof jQObject.val() == "undefined" || jQObject.val() == null || jQObject.val().trim().length < 1)) {
            return jQObject.data("errormsg") + "\n";
        } else {
            return "";
        }
    };
    paymentProcessor.displayAlert = function (errorMsg) {
        unBlock();
        bootAlert("small","error","Error",errorMsg);
    };
    paymentProcessor.useOpaqueDataNoSaveCard = function (responseData) {
        if (this.validateStringForProcess($('#transAmount')) == "") {
            var transAmount = $("#transAmount").val();
            transAmount = Number(transAmount).toFixed("2");
            transAmount = parseFloat(transAmount);
            if (transAmount > 0) {
                var str = "dataDescriptor=" + responseData.dataDescriptor + "&dataValue=" + responseData.dataValue + "&amount=" + transAmount;
                enqueue("/authorizeCreditCardSale.action?" + str + "&dt=" + new Date(), function (data) {
                    if (data != null && data != "") {
                        var jsponData = JSON.parse(data);
                        if (typeof jsponData != "undefined" && jsponData != null && jsponData != "") {
                            var transactionId = jsponData.transactionId;
                            $("#ccResponseCode").val(jsponData.authorizationCode);
                            $("#ccAddVrfyCode").val(jsponData.avsResultCode);
                            $("#ccCvv2VrfyCode").val(jsponData.cvvResultCode);
                            $("#ccTransactionId").val(transactionId);
                            $("#ccToken").val(jsponData.transactionHash);
                            $("#ccAmount").val(transAmount);
                            $("#ccAuthMemo").val("This transaction has been approved");
                            $("#ccAuthType").val("A");
                            $("#ccpaymentStatus").val(jsponData.paymentStatus);
                            $("#ccdescription").val(jsponData.description);
                            if (transactionId != null && transactionId != "" && transactionId.length > 0 && jsponData.paymentStatus == "APPROVED") {
                                $('#submitCheckOutForm').submit();
                            } else {
                                paymentProcessor.displayAlert("Error while processing your transaction \n Please contact our customer service");
								location.reload();
                            }
                        }
                    } else {
                        paymentProcessor.displayAlert("Error while processing your request \n Please contact our customer service");
                    }
                }
                );
            } else {
                this.displayAlert("Unable to get transaction amount");
            }
        }
    };
    paymentProcessor.contiToCheckout = function (response) {
        if (response.messages.resultCode === 'Error') {
            for (var i = 0; i < response.messages.message.length; i++) {
                paymentProcessor.displayAlert(response.messages.message[i].text);
            }
        } else {
            paymentProcessor.useOpaqueDataNoSaveCard(response.opaqueData)
        }
    };
    paymentProcessor.getCustomerProfile = function () {
        var customerProfId = jQuery("#customerProfileId").val();
        $("#cardDetailsNew").hide();
        jQuery.ajax({
            type: "POST", url: "authorizeGetCustomerProfileSale.action", data: "customerProfileId=" + customerProfId, async: false,
            success: function (msg) {
                $("#cardDetailsNew").html(msg);
                $("#creditCardForm")[0].reset();
                if (this.selectedCard == "") {

                } else {

                }
            }
        });
    };
    paymentProcessor.selectCardOnRadio = function (customerObj) {
        if (typeof customerObj == "String") {
            this.customerPaymentId = customerObj;
        } else {
            this.customerPaymentId = $(customerObj).val().replace('[', '').replace(']', '');
			var id=$(customerObj).attr('id');
			var cvvId=id.split("_");
			$("#cvv_"+cvvId[1]).show();
			$("#cvvWrap_"+cvvId[1]).show();
			$('.hideMe').not('#cvv_'+cvvId[1]+','+'#cvvWrap_'+cvvId[1]).hide();
			//$('.hideMe').not('#cvvWrap_'+cvvId[1]).hide();
		}

    }

    paymentProcessor.placeOrder = function () {
        if (typeof $('#transAmount').val() != "undefined" && $('#transAmount').val() != null && $('#transAmount').val().trim().length > 0) {
            var transAmount = $("#transAmount").val();
            transAmount = Number(transAmount).toFixed("2");
			var cvv = "";
            transAmount = parseFloat(transAmount);
			if(typeof $('#CARD_CODE_ID').val() != "undefined" && $('#CARD_CODE_ID').val() != null && $('#CARD_CODE_ID').val()!=""){
				 cvv = $("#CARD_CODE_ID").val();
			}else{
				var id= $("input[type='radio']:checked").attr('id');
				var cvvId=id.split("_");
				if($("#cvv_"+cvvId[1]).val()>0){
					cvv=$("#cvv_"+cvvId[1]).val();
				}
			}
			var frPage = $(".fromPage").val();
			if(frPage=="AccountPage"){
				this.loadCardOrContinueCheckout();
			}else if (this.customerProfileId == "") {
                this.displayAlert("Please select Credit Card to proceed");
            } else {

                if (transAmount > 0 && this.customerPaymentId != "") {
                    var customerPaymentId = this.customerPaymentId;
                    var customerProfileId = $("#customerProfileId").val();
                    var str = "customerProfileId=" + customerProfileId + "&customerPaymentId=" + customerPaymentId + "&amount=" + transAmount + "&cvv="+cvv;
                    enqueue("/AuthorizeCustomerProfileSale.action?" + str, function (data) {
                        if (data != null && data != "") {
							paymentProcessor.customerPaymentId = "";
                            var jsponData = JSON.parse(data);
                            if (typeof jsponData != "undefined" && jsponData != null && jsponData != "") {
                                var transactionId = jsponData.transactionId;
								 var paymentStatus = jsponData.paymentStatus;
                                if (transactionId != null && transactionId != "" && transactionId.length > 0 && paymentStatus == "APPROVED") {
                                    var description = jsponData.description;
                                    $("#ccResponseCode").val(jsponData.authorizationCode);
                                    $("#ccAddVrfyCode").val(jsponData.avsResultCode);
                                    $("#ccCvv2VrfyCode").val(jsponData.cvvResultCode);
                                    $("#ccTransactionId").val(jsponData.transactionId);
                                    $("#ccToken").val(jsponData.transactionHash);
                                    $("#ccAmount").val(transAmount);
                                    $("#ccAuthMemo").val("This transaction has been approved");
                                    $("#ccAuthType").val("A");
                                    $("#ccpaymentStatus").val(paymentStatus);
                                    $("#ccdescription").val(description);
                                    $('#submitCheckOutForm').submit();
									block();
                                } else {
                                    paymentProcessor.displayAlert("Please check the payment information provided and try again");
                                }
                            }
                        } else {
                            paymentProcessor.displayAlert("Error while processing your request \n Please contact our customer service");
                        }
                    }
                    );
                } else {
                    paymentProcessor.displayAlert("Unable to get transaction amount");
                }
            }

        }
    };
    paymentProcessor.useOpaqueDataCreate = function (responseData) {
        var str = "dataDescriptor=" + responseData.dataDescriptor + "&dataValue=" + responseData.dataValue;
        jQuery.ajax({
            type: "POST", url: "createCustomerPaymentProfileSale.action?" + str, data: "", async: false,
            success: function (customerPaymentId) {
				if(customerPaymentId=="Recreate"){
					
				}else if(customerPaymentId.includes("already added")){
					paymentProcessor.displayAlert(customerPaymentId);
				}else if (customerPaymentId > 0) {
                    paymentProcessor.displayAlert("Credit Card information added Successfully");
					paymentProcessor.customerPaymentId = customerPaymentId;
                    paymentProcessor.placeOrder();
                } else {
                    paymentProcessor.displayAlert("Cannot add more than 10 credit Cards");
                }
            }
        });
    };
    paymentProcessor.responseHandlerPayment = function (response) {
        if (response.messages.resultCode === 'Error') {
            for (var i = 0; i < response.messages.message.length; i++) {
                paymentProcessor.displayAlert(response.messages.message[i].text)
            }
        } else {
            unBlock();
            paymentProcessor.useOpaqueDataCreate(response.opaqueData)
        }
    };
    paymentProcessor.useOpaqueDataSaveCardFirstTime = function (responseData) {
		paymentProcessor.currentRequest = true;
        var str = "dataDescriptor=" + responseData.dataDescriptor + "&dataValue=" + responseData.dataValue;
        jQuery.ajax({
            type: "POST", url: "authorizeCreditCardSaveSale.action?" + str, data: "", async: false,
            success: function (msg) {
                var custProfId = jQuery.trim(msg).split("|");
                customerProfId = custProfId[0];
				jQuery("#customerProfileId").val(customerProfId);
                if (customerProfId > 0) {
                    paymentProcessor.displayAlert("Credit Card information added Successfully");
                    jQuery.ajax({
                        type: "POST", url: "authorizeGetCustomerProfileSale.action", data: "customerProfileId=" + customerProfId, async: false,
                        success: function (msg) {
							var frPage = $(".fromPage").val();
							if(frPage=="AccountPage"){
								$("#cardDetailsNew").html(msg);
							}else if ($(msg).find("#creditCardCount").val()==1) {
                                this.customerPaymentId = msg.split("|")[1];
                                this.placeOrder();
                            } else {
                                $("#cardDetailsNew").html(msg);
                            }
                        }
                    });
                }
            }
        });
    }
    paymentProcessor.responseHandlerPaymentProfile = function (response) {
        if (response.messages.resultCode === 'Error') {
            for (var i = 0; i < response.messages.message.length; i++) {
                paymentProcessor.displayAlert(response.messages.message[i].text);
            }
        } else {
            unBlock();
            paymentProcessor.useOpaqueDataSaveCardFirstTime(response.opaqueData)
        }
    };

    paymentProcessor.startProcessingCard = function (obj) {
		var customerPaymentId = jQuery("#customerPaymentId").val();
		var frPage = $(".fromPage").val();
		if($(".addNewCardRadioBtn").is(":checked")){
			paymentProcessor.addNewRequest = true;
		}else if(!$(".addedCardDetails").is(":checked") && frPage!="AccountPage"){
			paymentProcessor.displayAlert('Please select the Credit Card / Click on "Use new Credit Card" to proceed.');
		}
		if($(".addedCardDetails").is(":checked")){
			paymentProcessor.addNewRequest=false;
		}
		if(paymentProcessor.addNewRequest || frPage=="AccountPage"){
			block();
            var errorMessage = "";
            var crdExpDate = "";
            var crdNumberlength = 0;
            var crdNumber = "";
            errorMessage += this.validateStringForProcess($('#FULL_NAME'));
            errorMessage += this.validateStringForProcess($('#CARDNUMBER_ID'));
            errorMessage += this.validateStringForProcess($('#EXPIRY_MONTH_ID'));
            errorMessage += this.validateStringForProcess($('#EXPIRY_YEAR_ID'));
            errorMessage += this.validateStringForProcess($('#CARD_CODE_ID'));
            errorMessage += this.validateStringForProcess($('#ZIP_CODE'));
			var cvvCode = document.getElementById('CARD_CODE_ID').value;
            if (errorMessage == "") {
				var secureData = {}, authData = {}, cardData = {};
                cardData.fullName = document.getElementById('FULL_NAME').value;
                cardData.cardNumber = document.getElementById('CARDNUMBER_ID').value;
                cardData.month = document.getElementById('EXPIRY_MONTH_ID').value;
                cardData.year = document.getElementById('EXPIRY_YEAR_ID').value;
                cardData.cardCode = document.getElementById('CARD_CODE_ID').value;
                cardData.zipCode = document.getElementById('ZIP_CODE').value;
                secureData.cardData = cardData;
                authData.clientKey = $('#hostKey').val();
                authData.apiLoginID = $('#paymentGateWayHostID').val();
                //authData.apiLoginID = '9vdXt7Vx42C94GDM';
                secureData.authData = authData;
				if ($("#saveCard").is(":checked") || frPage=="AccountPage") {
                    var custId = $("#customerProfileId").val();
                    if (custId > 0) {
                        Accept.dispatchData(secureData, this.responseHandlerPayment);
                    } else {
                        Accept.dispatchData(secureData, this.responseHandlerPaymentProfile);
                    }
                }else {
                    Accept.dispatchData(secureData, this.contiToCheckout);
                }

            } else {
                this.displayAlert(errorMessage);
            }
		}else if(this.validateStringForProcess($("input[type='radio']:checked"))=="" && customerPaymentId != "" ){
			var selectedCardValue = $("input[type='radio']:checked").val();
			if(selectedCardValue!=""){
				this.placeOrder();
			}else{
				this.displayAlert("Please Select Atleast one card /Add New Credit Card");
			}
			
		}else if (this.customerPaymentId != "" ||( this.validateStringForProcess($("#creditCardCount"))=="" && $("#creditCardCount").val()=="0")) {
            
        } else {
            this.displayAlert("Please Select Atleast one card /Add New Credit Card");
        }


    };
  paymentProcessor.unHighLight = function () {
	  $("input[name='radio']:checked").parent().parent().css('background', 'none');
	  $("input[name='radio']:checked").prop("checked",false);
	   $("#saveBtn").show();
	  
	};
	
	paymentProcessor.addNewCreditCard = function(){
		var errorMessage = "";
            var crdExpDate = "";
            var crdNumberlength = 0;
            var crdNumber = "";
            errorMessage += this.validateStringForProcess($('#FULL_NAME'));
            errorMessage += this.validateStringForProcess($('#CARDNUMBER_ID'));
            errorMessage += this.validateStringForProcess($('#EXPIRY_MONTH_ID'));
            errorMessage += this.validateStringForProcess($('#EXPIRY_YEAR_ID'));
            errorMessage += this.validateStringForProcess($('#CARD_CODE_ID'));
            errorMessage += this.validateStringForProcess($('#ZIP_CODE'));
            if (errorMessage == "") {
				var secureData = {}, authData = {}, cardData = {};
                cardData.fullName = document.getElementById('FULL_NAME').value;
                cardData.cardNumber = document.getElementById('CARDNUMBER_ID').value;
                cardData.month = document.getElementById('EXPIRY_MONTH_ID').value;
                cardData.year = document.getElementById('EXPIRY_YEAR_ID').value;
                cardData.cardCode = document.getElementById('CARD_CODE_ID').value;
                cardData.zipCode = document.getElementById('ZIP_CODE').value;
                secureData.cardData = cardData;
                authData.clientKey = $('#hostKey').val();
                authData.apiLoginID = $('#paymentGateWayHostID').val();
                //authData.apiLoginID = '9vdXt7Vx42C94GDM';
                secureData.authData = authData;
                    var custId = $("#customerProfileId").val();
                    if (custId > 0) {
                        Accept.dispatchData(secureData, this.responseHandlerAddCreditCard);
                    } else {
                        Accept.dispatchData(secureData, this.responseHandlerAddCreditCard);
                    }

            } else {
                this.displayAlert(errorMessage);
            }
		
	};
	paymentProcessor.responseHandlerAddCreditCard = function (response) {
        if (response.messages.resultCode === 'Error') {
            for (var i = 0; i < response.messages.message.length; i++) {
                paymentProcessor.displayAlert(response.messages.message[i].text)
            }
        } else {
            unBlock();
            paymentProcessor.useOpaqueDataCreate(response.opaqueData)
        }
    };
	paymentProcessor.userNewCreditCardUI = function(){
		$('#creditCardForm').toggle();
		$('#addNewCreditCardButton').toggle();
		$('#cancelCreditCardButton').toggle();
		this.addNewRequest=true; 
		this.unHighLight();
		$(".addNewCardRadioBtn").attr("checked","checked");
	};
	
})();