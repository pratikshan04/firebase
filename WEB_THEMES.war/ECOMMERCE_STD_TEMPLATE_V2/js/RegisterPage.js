var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/multiTab.min.js', function(){
	$('#cimm_regBlock').multiTab();
});

if(document.getElementById("countryName2A")){
	var countryName2A = new initCountry({
		country: "US",
		selectorID: "countryName2A",
		defaultSelect: true
	});
}
if(document.getElementById("countryName2B")){
	var countryName2AB = new initCountry({
		country: "USA",
		selectorID: "countryName2B",
		defaultSelect: true
	});
}

var userLogin = $("#userLogin").val();
var path = window.location.hostname;
if(userLogin!=null && userLogin == "true"){
	window.location.href="/products";
}
function changeForm(id){
	$('.alert').remove();
	$("#formWraper").find("form").hide();
	var formId = id.value;
	$(formId).show();
}
function RefreshPageForInternationalUser2AB(){
	if($('#chkInternationalUser2AB').is(':checked')){
		$("#locUser2AB").val("Y");
		countryName2AB = new initCountry({
			country: "USA, CA",
			selectorID: "countryName2AB",
			defaultSelect: true
		});
	}else{
		countryName2AB = new initCountry({
			country: "USA",
			selectorID: "countryName2AB",
			defaultSelect: true
		});
		$("#locUser2AB").val("N");
	}
}