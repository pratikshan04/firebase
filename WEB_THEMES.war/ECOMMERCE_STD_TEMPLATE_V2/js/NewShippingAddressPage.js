var countrySelectShip = new initCountry({
	country: "GT",
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