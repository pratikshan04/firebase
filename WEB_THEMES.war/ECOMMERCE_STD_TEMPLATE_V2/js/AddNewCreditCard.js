$(document).ready(function(){
	$('#cardInfo').DataTable({"bDestroy": true});
});
function validatePcardFormWithNewIds(){
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
		return true;
	}
}