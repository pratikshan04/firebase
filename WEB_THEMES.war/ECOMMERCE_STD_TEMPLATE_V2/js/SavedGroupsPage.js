var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/BulkAction.js', function(){});
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
	var	callForPriceCounter = 0, pricePresent = 0;
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
							pricePresent++;
							console.log(val.price);
						}else{
							callForPriceCounter++;
							delete jsonObjList[i];
						}
					});
					jsonObjList = jQuery.grep(jsonObjList, function(n, i){return (n !== "" && n != null);});
					unblock();
					if(callForPriceCounter>0 && pricePresent && jsonObjList != []){
						bootAlert("small","info","Info","Call for Price items will be dropped from selection");
	                    $("[data-bb-handler='ok']").click(function () {
	                        BulkAction.processAddToCart(jsonObjList);
	                    });
                    }else if(pricePresent && jsonObjList != []){
                    	BulkAction.processAddToCart(jsonObjList);
                    }else{
						bootAlert("small","error","Error","Cannot add Call for Price item to cart");
                    }
				}
			}
		}
	});
}