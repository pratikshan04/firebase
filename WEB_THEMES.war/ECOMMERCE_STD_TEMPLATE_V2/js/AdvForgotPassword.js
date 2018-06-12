function forgotPasswordAdvanced(){
	var isValid = 1;
	var msg = "";
	var password = $.trim($("#password").val());
	var confirmPassword = $.trim($("#confirmPassword").val());
	if(password==""){
		msg = msg + "Password Cannot Be Empty</br>";
		isValid = 0;
	}else{
		var passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
		if (!passwordRegEx.test(password)){
			msg = msg + "Invalid Password, Minimum 8 character required with at least one Number, one lower case and one upper case letter</br>";
			isValid = 0;
		}
	}
	if(confirmPassword==""){
		msg = msg + "Confirm Password Cannot Be Empty</br>";
		isValid = 0;
	}else if(password != confirmPassword){
		msg = msg + "Password Mismatch</br>";
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
						title: "<span class='text-success'>Password change Confirmation &nbsp;&nbsp;<em class='glyphicon glyphicon-ok'></em></span>",
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
						showNotificationDiv("error", ms);
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