var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'/js/BulkAction.js', function(){});
$(document).ready(function(){
	$('#groupCart').DataTable({
		"sPaginationType":"simple_numbers",
		"order" : [[0, 'desc']],
		"columnDefs": [{ orderable: false, targets: -1 }],
		"language": {
			"search":"_INPUT_",
	        "searchPlaceholder":"Search List",
	        "sLengthMenu" :"Show _MENU_",
	        "oPaginate" : {
	        	"sPrevious" :"Prev",
	            "sNext" :"Next"
	        }
	    }
	});
});
function addAllItemsToCart(linkUrl){
	block("Please Wait");
	jQuery.ajax({
		type: "POST",
		url: linkUrl+"&toCart=ALL",
		success: function(dataObj){
			if(typeof dataObj!="undefined" && dataObj!=""){
				var jsonObjList = [];
				jsonObjList = JSON.parse(dataObj);
				if(jsonObjList.length>0){
					jQuery.each(jsonObjList, function(i, val) {
						if(val!=null && val.price > 0){
							console.log(val.price);
						}else{
							delete jsonObjList[i];
						}
					});
					jsonObjList = jQuery.grep(jsonObjList, function(n, i){return (n !== "" && n != null);});
					unblock();
					BulkAction.processAddToCart(jsonObjList);
				}
			}
		}
	});
}