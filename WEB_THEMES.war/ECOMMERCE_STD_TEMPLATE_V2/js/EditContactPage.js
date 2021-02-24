var billAddressState = $("#billAddressState").val();
var billAddressCountry = $("#billAddressCountry").val();
if(!billAddressCountry){
	billAddressCountry = "US";
}
var countrySelectShip = new initCountry({
	country: billAddressCountry,
	selectorID: "countrySelectShip",
	defaultSelect: true,
	selectState: billAddressState
});
$("#editContactAddressForm").submit(function(){
	if($("#billAddressEmail").val() != $("#email").val()){
		$("#email").val($("#billAddressEmail").val());
	}
});
var currentAddress = {};
$(document).ready(function(){
	if ($("#email").val() != "") {
		$("#email").attr('readonly', true);
	}
});

function getCurrentContactAddress(){
	currentAddress['firstName'] = $("#firstName").val();
	currentAddress['lastName'] = $("#lastName").val();
	currentAddress['address1'] = $("#address1").val();
	currentAddress['address2'] = $("#address2").val();
	currentAddress['city'] = $("#city").val();
	currentAddress['countrySelectShip'] = $("#countrySelectShip").val();
	currentAddress['stateSelectShip'] = $("#stateSelectShip").val();
	currentAddress['zip'] = $("#zip").val();
	currentAddress['billPhone'] = $("#billPhone").val();
	currentAddress['email'] = $("#email").val();
}

function setCurrentContactAddress(){
	currentAddress['firstName']? $("#firstName").val(currentAddress['firstName']) : $("#firstName").val('');
	currentAddress['lastName']? $("#lastName").val(currentAddress['lastName']) : $("#lastName").val('');
	currentAddress['address1']? $("#address1").val(currentAddress['address1']) : $("#address1").val('');
	currentAddress['address2']? $("#address2").val(currentAddress['address2']) : $("#address2").val('');
	currentAddress['city']? $("#city").val(currentAddress['city']) : $("#city").val('');
	currentAddress['zip']? $("#zip").val(currentAddress['zip']) : $("#zip").val('');
	currentAddress['billPhone']? $("#billPhone").val(currentAddress['billPhone']) : $("#billPhone").val('');
	currentAddress['email']? $("#email").val(currentAddress['email']) : $("#email").val('');
	
	if(currentAddress['countrySelectShip']){
		$("#countrySelectShip option[value='"+currentAddress['countrySelectShip']+"']").attr('selected','selected');
	}else{
		$('#countrySelectShip').val("US");
	}
	
	if(currentAddress['stateSelectShip']){
		var stateId = document.getElementById('countrySelectShip');
		var country = currentAddress['countrySelectShip'] ? currentAddress['countrySelectShip'] : 'US' ;
		populateStatesOnchange(country, stateId, currentAddress['stateSelectShip'], true);
		$("#stateSelectShip option[value='"+currentAddress['stateSelectShip']+"']").attr('selected','selected');
	}else{
		$('#stateSelectShip').val("");
	}
	
	$('#countrySelectShip, #stateSelectShip').selectpicker('refresh');
}
function getContactEntityAddress(obj){
	if(obj.checked){
		var objLenth = $.map(currentAddress, function(n, i) { return i; }).length;
		if(objLenth==0){
			getCurrentContactAddress();
		}
		$("#useEntityAddress").val("Yes");
		block("Espere por favor");
		str = "test=1";
		$.ajax({
			type: "POST",
			url: "autoFillAddressUnit.action",
			data: str,
			success: function(msg){
				msgArr = msg.split("|");
				msgArr[0] ? $("#address1").val(msgArr[0]) : $("#address1").val('');
				msgArr[1] ? $("#address2").val(msgArr[1]) : $("#address2").val('');;
				msgArr[2] ? $("#city").val(msgArr[2]) : $("#city").val('');
				msgArr[4] ? $("#zip").val(msgArr[4]) : $("#zip").val('');
				msgArr[6] ? $("#billPhone").val(msgArr[6]) : $("#billPhone").val('');
				(msgArr[5]=='US' || msgArr[5]=='USA' ) ? $("#locUser").val("N") : $("#locUser").val("Y");
				
				if(msgArr[5]!=null && msgArr[5]!="null" && msgArr[5].trim() != ""){
					$("#countrySelectShip option[value='"+msgArr[5]+"']").attr('selected','selected');
				}else{
					$('#countrySelectShip').val("US");
				}
				
				if(msgArr[3]!=null && msgArr[3]!="null"){
					var stateId = document.getElementById('countrySelectShip');
					var country = msgArr[5] ? msgArr[5] : 'US';
					populateStatesOnchange(country, stateId, msgArr[3], true);
					$("#stateSelectShip option[value='"+msgArr[3]+"']").attr('selected','selected');
				}else{
					$('#stateSelectShip').val("");
				}
				
				$('#countrySelectShip, #stateSelectShip').selectpicker('refresh');
				unblock();
			}
		});
	}else{
		setCurrentContactAddress();
		$("#useEntityAddress").val("No");
	}
}
