function submitThisForm(formId){
	unusualCode = 0;
	var currentFormId = formId.id;
	var currentForm , submitForm, formElements, unusualCodeErrorStr = $("#dataErrors").attr('data-unusualError');
	if($(formId).prop("tagName") != "FORM"){
		currentForm = $(formId);
		submitForm = $(formId);
		formElements = $(submitForm).find('input, select, textarea');
	}else{
		currentForm = $(formId);
		formElements = formId.elements;
	}
	$('.alert').remove();
	$(currentForm).find('.requiredField span.required').remove();
	$(currentForm).find('.requiredField').removeClass('requiredField');
	var curSubmit = $(currentForm).find("input[type='submit']");
	var curSubmitBtn = $(currentForm).find("button[type='submit']");
	var btnVal = "";
	if(curSubmit[0]){
		btnVal = $(curSubmit[0]).val();
		$(curSubmit[0]).val("Espere por favor").attr("disabled",true);
	}else if(curSubmitBtn[0]){
		btnVal = $(curSubmitBtn[0]).text();
		$(curSubmitBtn[0]).text("Espere por favor").attr("disabled",true);
	}
	var i, j, k, submitForm = this;
	var eachElement, errorMessages = [];
	for(i = 0; i < formElements.length; i++){
		eachElement = formElements[i];
		if(validateStr(eachElement.value)){
			unusualCode++;
		}
		try{
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
		}catch(e){
			console.log(e);
		}
	}
	
	var enablePasswordPolicy = "N";
	if($('#enableEcomPasswordPolicy').length > 0){ enablePasswordPolicy = $('#enableEcomPasswordPolicy').val();}
	if(currentFormId=="changePassword" && enablePasswordPolicy =="Y"){
		var validateMessage = changePasswordPolicy(currentForm);
		var pwdValidation= validateMessage.split("|")
		if(pwdValidation[0]=="false"){
			errorMessages.push(pwdValidation[1]);
		}
	}
	if(errorMessages.length > 0){
		notifyValidation(currentForm, errorMessages.join("<br>"));
		enabeSubmitBtn(curSubmit, curSubmitBtn, btnVal);
		return false;
	}else if(unusualCode > 0){
		bootAlert("medium", "error", "Error", unusualCodeErrorStr);
		enabeSubmitBtn(curSubmit, curSubmitBtn, btnVal);
		return false;
	}else{
		if($(formId).prop("tagName") != "FORM" || $(formId).attr("data-ajaxSubmit") == "N"){
			return true;
		}else{
			localStorage.setItem("btnVal", btnVal);
			var hiddenInputs = '';
			if($(currentForm).attr("data-recaptcha") == "Y" && $("#isWebview").val() != "WEBVIEW") {
				if ($(currentForm).find('[name="action"]').length === 0) {
					hiddenInputs = '<input type="hidden" name="action" value="validate_captcha">';
					$(currentForm).append(hiddenInputs);
				}
				if ($(currentForm).find('[name="g-recaptcha-response"]').length === 0) {
					hiddenInputs = '<input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response" value="" />';
					$(currentForm).append(hiddenInputs);
				}
				getRecaptchaToken(currentForm, function() {
					submitFormToServer(currentForm);
					return false;
				});
			} else {
				submitFormToServer(currentForm);
				return false;
			}
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
			var enablePasswordPolicy = "N";
			if($('#enableEcomPasswordPolicy').length > 0){ enablePasswordPolicy = $('#enableEcomPasswordPolicy').val();}
			if(enablePasswordPolicy =="Y"){
				validatePasswordPolicy(elementType, formElement, errorMessages,currentFormId);
			}else{
				if(!isValidPassword(formElement)){
					errorMessages.push(formElement.attributes['data-invalid'].value);
					//$(formElement).parent().addClass('requiredField').append("<span class='required'>ERROR: "+formElement.attributes['data-invalid-mobile'].value+"</span>");
				}
			}
			break;
		}
	}
}
function isEmpty(formElement){
	var status = true;
	if(formElement.value.trim() || formElement.value.trim().length > 0){
		status = false;
	}
	return status;
}
function isValidEmailId(formElement){
	var emailRegEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	//var emailRegEx = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
	return emailRegEx.test(formElement.value);
}
function isValidPhoneNumber(formElement){
	var phonenoRegEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	return phonenoRegEx.test(formElement.value);
}
function isValidPassword(formElement){
	//var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
	var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
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
	return $("[name='"+ formElement.name +"']:checked").length > 0; 
}
function notifyValidation(form, notifiedErrors){
	$(form).prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">&times;</a>'+notifiedErrors+'</div>');
	var headerHeight = 0;
	if ($("#enableStickyHeader").val() == "Y") {
		headerHeight = $('#normalHead').height();
	}
	$('html, body').animate({ scrollTop: $(".alert").offset().top - headerHeight }, 400);
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
	block("Espere por favor");
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
			if(notified == "Request Sent Successfully." || notified == "Request Sent Successfully"){
				notified = 'Solicitud enviada con éxito'
			}else if(notified == " User Already registered in this email. Please use different email."){
				notified = 'Usuario ya registrado en este correo electrónico. Utilice un correo electrónico diferente.'
			}else if(notified == "Processing is successful"){
				notified = 'El procesamiento es exitoso'
			}else if(notified == 'Old Password and New password are similar'){
				notified = 'La contraseña anterior y la contraseña nueva son similares'
			}else if(notified == 'Invalid Old Password' || notified == 'Invalid Old Password.'){
				notified = 'Contraseña anterior no válida'
			}else{
				notified = notified
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
							$("[data-bb-handler='ok']").click(function(){
								window.location.href="doLogOff.action?lType=PasswordUpdatedSuccessfully";
							});
						}else if(hideThat && hideThat != "Y"){
							if(hideThat != "N"){
								$(that).parents("#"+hideThat).parent().prepend('<div class="alert alert-success">'+notified+'</div>');
							}else{
								$(that).parent().prepend('<div class="alert alert-success">'+notified+'<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">&times;</a></div>');
							}
						}else if(hideThat == "Y"){
							$(that).parent().prepend('<div class="alert alert-success">'+notified+'</div>');
						}
					}
					var headerHeight = 0;
					if ($("#enableStickyHeader").val() == "Y") {
						headerHeight = $('#normalHead').height();
					}
					$('html, body').animate({ scrollTop: $(".alert").offset().top - headerHeight }, 400);
				}
				if(hideThat != "N"){
					$("#successBlock").show();
				}
			}else{
				$(that).parent().prepend('<div class="alert alert-danger">'+notified+'</div>');
				$('html, body').animate({scrollTop: $(".alert").offset().top}, 400);
			}
			var curSubmit = $(that).find("input[type='submit']"), curSubmitBtn = $(that).find("button[type='submit']"), btnVal = localStorage.getItem("btnVal");
			enabeSubmitBtn(curSubmit, curSubmitBtn, btnVal);
			localStorage.removeItem("btnVal");
			unblock();
		},
		error: function(){
			unblock();
			var curSubmit = $(that).find("input[type='submit']"), curSubmitBtn = $(that).find("button[type='submit']"), btnVal = localStorage.getItem("btnVal");
			enabeSubmitBtn(curSubmit, curSubmitBtn, btnVal);
			localStorage.removeItem("btnVal");
			bootAlert("small","error","Error","Something went wrong");
		}
	});
}
function enabeSubmitBtn(curSubmit, curSubmitBtn, btnVal){
	if(curSubmit[0]){
		$(curSubmit[0]).val(btnVal).attr("disabled", false);
	}else if(curSubmitBtn[0]){
		$(curSubmitBtn[0]).text(btnVal).attr("disabled",false);
	}
}
function validatePasswordPolicy(elementType, formElement, errorMessages,formId){
	var formDetails = {
	"form2A":{password:"password2A",confirmpassword:"confirmPassword2A",firstName:"firstName2A",lastName:"lastName2A"},
	"form1B":{password:"newPassword1A",confirmpassword:"currentPassword1A",firstName:"currentFirstName1A",lastName:"currentLastName1A"},
	"changePassword":{password:"newPassword",confirmpassword:"confirmPassword",firstName:"userFirstNameCP",lastName:"userLastNameCP",userName:"userNameCP"}
	};
	var value = formElement.value;
	var currerntElementId = formElement.id;
	currentFormDetails = formDetails[formId];
	//console.log("currentFormDetails",currentFormDetails);
	
	var validationJSON = $("#passwordPolicyJSON").val();
	validationJSON = JSON.parse(validationJSON);
	//console.log("formElement",formElement);
	//console.log("final validation json",validationJSON);
	
	var passwordText = "";
	/*code to compare confirm password with password entered start*/
	if(currentFormDetails.confirmpassword == currerntElementId){
		passwordText = "Confirm Password";
		if(value != $("#"+currentFormDetails.password).val()){
			errorMessages.push(formElement.attributes['data-invalid'].value);
			return false;
		}
	}
	
	/*code to compare confirm password with password entered end*/
	if(currentFormDetails.password == currerntElementId){
		passwordText = "Password";
	}
	return validatePasswordPolicyFields(value,validationJSON,passwordText,errorMessages);
}

function validatePasswordPolicyFields(value,validationJSON,passwordText,errorMessages){
	var minLengthMatched = true;
	var maxLengthMatched = true;
	var lowerCaseError = false;
	var upperCaseError = false;
	var numberError = false;
	var splCharError = false;
	var firstNameError = false;
	var lastNameError = false;
	var userNameError = false;
	var spaceError = false;
	if(value == ""){
		errorMessages.push(passwordText+" is empty");
		return false;
	}
	if(passwordText != "Confirm Password"){
		if( value.length >= Number(validationJSON.minLength)){
			minLengthMatched = true;
		}else{
			minLengthMatched = false;
			errorMessages.push(passwordText+" should be at least "+validationJSON.minLength+" characters");
		}
	
		if(value.length <= Number(validationJSON.maxLength)){
			maxLengthMatched = true;
		}else{
			maxLengthMatched = false;
			errorMessages.push(passwordText+" cannot be more than "+validationJSON.maxLength+" characters");
		}
	
		if(validationJSON.lowerCaseAlpha){
			var lowerCaseExists = (/[a-z]/.test(value));
			if(!lowerCaseExists){
				errorMessages.push(passwordText+" should have at least one lowercase character (a-z).");
				lowerCaseError = true;
			}
		}else{
			var lowerCaseExists = (/[a-z]/.test(value));
			if(lowerCaseExists){
				errorMessages.push(passwordText+" should not have lowercase character (a-z).");
				lowerCaseError = true;
			}
		}
	
		if(validationJSON.upperCaseAlpha){
			var upperCaseExists = (/[A-Z]/.test(value));
			if(!upperCaseExists){
				errorMessages.push(passwordText+" should have at least one uppercase character (A-Z).");
				upperCaseError = true;
			}
		}else{
			var upperCaseExists = (/[[A-Z]/.test(value));
			if(upperCaseExists){
				errorMessages.push(passwordText+" should not have uppercase character (a-z).");
				upperCaseError = true;
			}
		}
	
		if(validationJSON.number){
			var numberExists = (/[0-9]/.test(value));
			if(!numberExists){
				errorMessages.push(passwordText+" should have at least one number(0-9).");
				numberError = true;
			}
		}else{
			var numberExists = (/[0-9]/.test(value));
			if(numberExists){
				errorMessages.push(passwordText+" should not have number(0-9).");
				numberError = true;
			}
		}
	
		if(validationJSON.splChar){
			var format = /[ !@#$%^&*()_+-=\\[\\]{};':"\\|,.<>\/?]/;
			var splCharExists = (format.test(value));
			if(!splCharExists){
				errorMessages.push(passwordText+" should have at least one special character(Like !@#$%^&*()..).");
				splCharError = true;
			}
		}else{
			var format = /[ !@#$%^&*()_+-=\\[\\]{};':"\\|,.<>\/?]/;
			var splCharExists = (format.test(value));
			if(splCharExists){
				errorMessages.push(passwordText+" should not have special character(Like !@#$%^&*()..).");
				splCharError = true;
			}
		}
		if(validationJSON.space){
			var spaceExists = false;
			if(value.indexOf(' ') > -1){
				var spaceExists = true;
				spaceError = true;
				errorMessages.push(passwordText+" cannot have spaces.");
			}
		}
	}
	if(!maxLengthMatched){
		errorMessages = [];
		errorMessages.push(passwordText+" cannot be more than "+validationJSON.maxLength+" characters");
	}
	if(minLengthMatched && maxLengthMatched && !lowerCaseError && !upperCaseError && !numberError && !splCharError && !spaceError ){
		return true;
	}else{
		return false;
	}
}