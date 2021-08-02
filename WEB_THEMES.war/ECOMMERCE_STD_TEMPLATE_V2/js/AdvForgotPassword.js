function forgotPasswordAdvanced(){
	var isValid = 1;
	var msg = "";
	var password = $.trim($("#password").val());
	var confirmPassword = $.trim($("#confirmPassword").val());
	if(password==""){
		msg = msg + locale("form.user.password.password") + "</br>";
		isValid = 0;
	}else{
		var enablePasswordPolicy = "N";
		if($('#enableEcomPasswordPolicy').length > 0){ enablePasswordPolicy = $('#enableEcomPasswordPolicy').val();}
		if(enablePasswordPolicy == "Y"){
			var validatePassword = validatePasswordPolicyFP(password,"Password");
			var validateConfirmPassword = validatePasswordPolicyFP(confirmPassword,"Confirm Password");
			var validateMessage = changePasswordPolicy($('#advancePassword'));
			var pwdValidation= validateMessage.split("|")
			if(!validatePassword || !validateConfirmPassword){
				isValid = 2;
			}else if($.trim($("#password").val()) != $.trim($("#confirmPassword").val())){
				errorMessages.push("Password mismatch");
				isValid = 2;
			}else if(pwdValidation[0]=="false"){
				isValid = 2;
				errorMessages.push(pwdValidation[1]);
			}else{
				isValid = 1;
			}
		}else{
			//var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
			var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%(/)[\]{}^&*_<>?"':;+-|])(?=.{8,})/;
			if (!passwordRegEx.test(password)){
				msg = msg + locale('form.user.password.invalid') + "</br>";
				isValid = 0;
			}
		}
	}
	if(confirmPassword==""){
		msg = msg + "Confirmar contrase&ntilde;a no puede estar vac&iacute;a</br>";
		isValid = 0;
	}else if(password != confirmPassword){
		msg = msg + "Contrase&ntilde;a no coincide</br>";
		isValid = 0;
	}
	
	if(isValid == 1){
		var str = $('#advancePassword').serialize();
		$.ajax({
			type: "POST",url: "RetrieveAdvanceForgotPasswordUnit.action",data: str,
			success: function(msg){
				if(msg.indexOf("Successfull")>0){
					$("#password").val("");
					$("#confirmPassword").val("");
					bootbox.confirm({
						size: "small",
						closeButton:false,
						message: msg,
						title: "<span class='text-success'>Confirmaci&oacute;n de cambio de contrase&ntilde;a &nbsp;&nbsp;<em class='glyphicon glyphicon-ok'></em></span>",
						buttons: {
							cancel: {
								label: 'Cancelar'
							},
							confirm: {
								label: 'Ok'
							}
						},
						callback: function(result){
							//if if(msg.indexOf("cpol") add in code if required
							if(result){
								window.location.href='/Login';
							}else{
								window.location.href='/Login';
							}
						}
					});
				}else{
					var ms = msg.replace(/\|/g,"<br/>");
					if(ms!=null && $.trim(ms).length>0){
						showNotificationDiv("success", ms);
						$("#password").val("");
						$("#confirmPassword").val("");
					}
				}
			}
		});
	}else{
		showNotificationDiv("error", msg);
	}
	return false;
}