var addressType = $("#addressType").val();
if(addressType=='bill'){
	$(document).ready(function(){
		if($("#email").val()!=""){
			$("#email").attr('readonly', true);
		}
	});
}else if(addressType=='ship'){
	function makeDefaultAddress(){
		if($('#makeDefault').is(':checked')){
			$("#makeAsDefault").val("Yes");
		}else{
			$("#makeAsDefault").val("No");
		}
	}
}

var shippingStateId = $("#shippingStateId").val();
var contryCd = $('#countryCode').val();
if(!contryCd){
	contryCd = "US";
}
var countrySelectShip = new initCountry({
	country: contryCd,
	selectorID: "countrySelectShip",
	defaultSelect: true,
	selectState: shippingStateId
});