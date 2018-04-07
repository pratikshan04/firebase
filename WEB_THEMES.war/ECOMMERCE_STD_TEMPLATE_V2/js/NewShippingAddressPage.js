var countrySelectShip = new initCountry({
	country: "US",
	selectorID: "countrySelectShip",
	defaultSelect: true
});

function makeDefaultAddress(){
	if($('#makeDefault').is(':checked')){
		$("#makeAsDefault").val("Yes");
	}else{
		$("#makeAsDefault").val("No");
	}
}