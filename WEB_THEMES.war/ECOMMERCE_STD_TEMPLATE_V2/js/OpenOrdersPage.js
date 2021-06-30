$(document).ready(function(){
	$('#openOrderTable').DataTable({
		"language": {
			"url": "https://cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
			"search":"_INPUT_",
			"searchPlaceholder":"Buscar",
			"sLengthMenu" :"Show _MENU_",
			"oPaginate" : {
				"sPrevious" :"Prev",
				"sNext" :"Next"
			}
		},
		'aoColumnDefs': [{ targets: -1, orderable: false }],
		"order": [[ 0, "desc" ]]
	});

	$("#myInput").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$("#openTable tbody tr").filter(function() {
		  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	  });
});