$('#retrivePassword').submit(function() {
	var isValid = 1;
	var msg = "";
	//var userName = $.trim($("#username").val());
	var emailAddress = $.trim($("#emailAddress").val());
	
	/*if(userName==""){
		msg = msg + "Please Enter User Name</br>";
		isValid = 0;
	}*/
	if(emailAddress==""){
		msg = msg + locale("register1A.error.emailAddress") + "</br>";
		isValid = 0;
	}else{
		var emailRegEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (!emailRegEx.test(emailAddress)){
			msg = msg + locale("form.user.address.emailId.invalid") +"</br>";
			isValid = 0;
		}
	}
	if(isValid == 1){
		$("#submitBtn").attr("disabled",true).html("Espere por favor");
		if($("#retrivePassword").attr("data-recaptcha") == "Y" && $("#isWebview").val() != "WEBVIEW") {
			if ($(this).find('[name="g-recaptcha-response"]').length === 0) {
				var hiddenInputs = '<input type="hidden" name="action" value="validate_captcha">' +
				'<input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response" value="" />';
				$(this).append(hiddenInputs);
			}
			getRecaptchaToken(this, function() {
				var str = $("#retrivePassword").serialize();
				submitRetrievePassword(str);
			});
		}else {
			var str = $("#retrivePassword").serialize();
			submitRetrievePassword(str);
		}
		
	}else{
		showNotificationDiv("error", msg);
	}
	return false;
});

function submitRetrievePassword(str) {
	var buttonVal = $("#submitBtn").html();
	$.ajax({
		type: "POST",
		url: "ForgotPasswordUnit.action",
		data: str,
		success: function(message){
			$("#submitBtn").attr("disabled",false).html(buttonVal);
			if(message.indexOf('La cuenta no existe') != -1 || message.indexOf('Account does not exist') != -1 || message.indexOf('Failed to send password') != -1 || message.indexOf('Our systems have detected') != -1 || message.indexOf('Nuestros sistemas han detectado') != -1){
				showNotificationDiv("error", message);
			}else{
				showNotificationDiv("Success", message);
			}
			//$('#userName').val('');
			$('#emailAddress').val('');
		}
	});
}