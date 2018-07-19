function submitThisForm(formId){
	var currentForm , submitForm, formElements;
	if($(formId).prop("tagName") != "FORM"){
		currentForm = $(formId);
		submitForm = $(formId);
		formEle = $(submitForm).find('input, select, textarea');
	}else{
		currentForm = $(formId);
		formEle = formId
	}
	$('.alert').remove();
	$(currentForm).find('.requiredField span.required').remove();
	$(currentForm).find('.requiredField').removeClass('requiredField');
	var curSubmit = $(currentForm).find("input[type='submit']");
	var curSubmitBtn = $(currentForm).find("button[type='submit']");
	var btnVal = "";
	if(curSubmit[0]){
		btnVal = $(curSubmit[0]).val();
		$(curSubmit[0]).val("Please Wait").attr("disabled",true);
	}else if(curSubmitBtn[0]){
		btnVal = $(curSubmitBtn[0]).text();
		$(curSubmitBtn[0]).text("Please Wait").attr("disabled",true);
	}
	var i, j, k, submitForm = this;
	var eachElement, formElements = formEle.elements, errorMessages = [];
	for(i = 0; i < formElements.length; i++){
		eachElement = formElements[i];
		if(eachElement.dataset.required == "Y"){
			if(eachElement.dataset.type != 'radio' && eachElement.dataset.type != 'checkbox')
				validateFormElementsByClassName(eachElement.dataset.type, eachElement, errorMessages);
			else if(eachElement.dataset.type == 'radio' || eachElement.dataset.type == 'checkbox'){
				if(!isElementChecked(eachElement)){
					if(!(errorMessages.indexOf(eachElement.attributes['data-error'].value) >= 0)){
						errorMessages.push(eachElement.attributes['data-error'].value);
						//$(eachElement).parent().parent().parent().parent().addClass('requiredField').append("<span class='required'>ERROR: "+eachElement.attributes['data-error'].value+"</span>");
					}
				}
			}
	   }
	}
	if(errorMessages.length > 0){
		notifyValidation(currentForm, errorMessages.join("<br>"));
		if(curSubmit[0]){
			$(curSubmit[0]).val(btnVal).attr("disabled", false);
		}else if(curSubmitBtn[0]){
			$(curSubmitBtn[0]).text(btnVal).attr("disabled",false);
		}
	}else{
		if($(formId).prop("tagName") != "FORM" || $(formId).attr("data-ajaxSubmit") == "N"){
			return true;
		}else{
			localStorage.setItem("btnVal", btnVal);
			submitFormToServer(currentForm);
			return false;
		}
	}
}

function validateFormElementsByClassName(elementType, formElement, errorMessages){
	if(isEmpty(formElement) && !(errorMessages.indexOf(formElement.attributes['data-error'].value) >= 0)){
		errorMessages.push(formElement.attributes['data-error'].value);
		//$(formElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+formElement.attributes['data-error'].value+"</span>");
	}else{
		switch(elementType.toUpperCase()){
			case "EMAIL" :   
					if(!isValidEmailId(formElement)){
						errorMessages.push(formElement.attributes['data-invalid'].value);
						//$(formElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+formElement.attributes['data-invalid-mobile'].value+"</span>");
					}
				break;
			case "NUMBER" :
					if(!isValidPhoneNumber(formElement)){
						errorMessages.push(formElement.attributes['data-invalid'].value);
						//$(formElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+formElement.attributes['data-invalid-mobile'].value+"</span>");
					}
				break;
			case "PASSWORD" :
					if(!isValidPassword(formElement)){
						errorMessages.push(formElement.attributes['data-invalid'].value);
						//$(formElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+formElement.attributes['data-invalid-mobile'].value+"</span>");
					}
				break;
		}
	}
}

function isEmpty(formElement){
	var status = true;
	if(formElement.value || formElement.value.trim().length > 0){
		status = false;
	}
	return status;
}
function isValidEmailId(formElement){
	 var emailRegEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	 return emailRegEx.test(formElement.value);
}
function isValidPhoneNumber(formElement){
	 var phonenoRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	 return phonenoRegEx.test(formElement.value);
}
function isValidPassword(formElement){
	var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	if(formElement.dataset.password){
		var mainPasswordID = $("#"+formElement.dataset.password).val();
		if(mainPasswordID != formElement.value && mainPasswordID!=""){
			return false;
		}else{
			return true;
		}
	}else{
		return passwordRegEx.test(formElement.value);
	}
}
function isElementChecked(formElement){
	return $("[name="+ formElement.name +"]:checked").length > 0; 
}
function notifyValidation(form, notifiedErrors){
	$(form).prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>'+notifiedErrors+'</div>');
	$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
}

function submitFormToServer(that){
	var action = $(that).attr('action'), formMethod = $(that).attr('method'),formData = $(that).serialize();
	if(!formMethod){
		formMethod = "POST"
	}
	if(action){
		actionUrl = action;
	}else{
		actionUrl = "SaveAndSendMail.action"; // for static page action
	}
	block("Please Wait");
	$.ajax({
		method: formMethod,
		url: actionUrl,
		data: formData,
		success:function(response){
			if(response=="sessionexpired" || response == "SESSIONEXPIRED"){
			    window.location.href="doLogOff.action";
			}
			var hideThat = "Y";
			if($(that).attr('data-hideBlock')){
				hideThat = $(that).attr('data-hideBlock').trim();
			}
			responseCont = "", 
			notified ="",
			responseVal="";
			if(typeof response === 'string'){
				responseCont = response.split('|');
				responseVal = responseCont.shift();
				notified = responseCont.join('<br/>');
			}else{
				responseCont = JSON.parse(response);
				notified = responseCont.descriptions.join('<br/>');
			}
			if(responseCont.valid || responseVal == 1){
				that[0].reset();
				if(hideThat && hideThat != "Y"){
					if(hideThat != "N"){
						$(that).parents("#"+hideThat).slideUp(100);
					}
				}else if(hideThat == "Y"){
					$(that).slideUp(100);
				}
				
				var alertId = document.getElementById(responseCont.sourceFormId);
				if(alertId){
					$("#"+alertId).slideDown();
					$('html, body').animate({scrollTop: $("#"+alertId).offset().top}, 400);
				}else{
					if(responseCont[1]!="" && responseCont[1]){
						$(that).parent().prepend('<div class="alert alert-success">The Purchasing Agent was successfully added.<br/> Login credentials have been emailed to '+responseCont[1]+'</div>');
						setTimeout(function(){window.location.href=$("base").attr("href")+"/ManagePurchaseAgent"} , 5000);
					}else{
						if(notified=="Password Updated Successfully"){
							unblock();
							bootAlert("medium","success","Success","Password Updated Successfully, Please login again to continue");
							window.location.href="doLogOff.action?lType=PasswordUpdatedSuccessfully";
						}else if(hideThat && hideThat != "Y"){
							if(hideThat != "N"){
								$(that).parents("#"+hideThat).parent().prepend('<div class="alert alert-success">'+notified+'</div>');
							}else{
								$(that).parent().prepend('<div class="alert alert-success">'+notified+'</div>');
							}
						}else if(hideThat == "Y"){
							$(that).parent().prepend('<div class="alert alert-success">'+notified+'</div>');
						}
					}
					$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
				}
				if(hideThat != "N"){
					$("#successBlock").show();
				}
			}else{
				$(that).parent().prepend('<div class="alert alert-danger">'+notified+'</div>');
				$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
			}
			var curSubmit = $(that).find("input[type='submit']"), curSubmitBtn = $(that).find("button[type='submit']"), btnVal = localStorage.getItem("btnVal");
			if(curSubmit[0]){
				$(curSubmit[0]).val(btnVal).attr("disabled", false);
			}else if(curSubmitBtn[0]){
				$(curSubmitBtn[0]).text(btnVal).attr("disabled",false);
			}
			localStorage.removeItem("btnVal");
			unblock();
		},
		error: function(){
			unblock();
			bootAlert("small","error","Error","Something went wrong");
		}
	});
}