$(document).ready(function(){
	$('#openOrderTable').DataTable({
		"language": {
			"search":"_INPUT_",
			"searchPlaceholder":"Search Open Orders",
			"sLengthMenu" :"Show _MENU_",
			"oPaginate" : {
				"sPrevious" :"Prev",
				"sNext" :"Next"
			}
		},
		"order": [[ 0, "desc" ]]
	});
});