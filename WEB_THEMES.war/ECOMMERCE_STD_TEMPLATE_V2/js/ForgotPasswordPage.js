$('#retrivePassword').submit(function() {
	var isValid = 1;
	var msg = "";
	//var userName = $.trim($("#username").val());
	var emailAddress = $.trim($("#emailAddress").val());
	var buttonVal = $("#submitBtn").html();
	/*if(userName==""){
		msg = msg + "Please Enter User Name</br>";
		isValid = 0;
	}*/
	if(emailAddress==""){
		msg = msg + "Please Enter Email Address</br>";
		isValid = 0;
	}else{
		var emailRegEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if (!emailRegEx.test(emailAddress)){
			msg = msg + "Invalid Email ID</br>";
			isValid = 0;
		}
	}
	if(isValid == 1){
		$("#submitBtn").attr("disabled",true).html("Please wait");
		var str = $(this).serialize();
		$.ajax({
			type: "POST",
			url: "ForgotPasswordUnit.action",
			data: str,
			success: function(message){
				$("#submitBtn").attr("disabled",false).html(buttonVal);
				if(message.indexOf('Account does not exist') != -1){
					showNotificationDiv("error", message);
				}else{
					showNotificationDiv("Success", message);
				}
				//$('#userName').val('');
				$('#emailAddress').val('');
			}
		});
	}else{
		showNotificationDiv("error", msg);
	}
	return false;
});
