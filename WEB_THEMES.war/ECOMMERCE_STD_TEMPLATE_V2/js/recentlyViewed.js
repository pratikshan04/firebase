(function($) {
	var defaults = {
			itemId : 0,
			itemPriceId : 0,
			productName : "",
			imageName : "",
			manufacturerPartNumber : "",
			partNumber : "",
			altPartNumber2 : "",
			manufacturerName : "",
			minOrderQty: "",
			orderInterval:""
        };
        var slickInitializer = {
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                    }
                }
            ]
        };
	$.fn.recentlyViewed = function( itemDetails ) {
        var singleItem = $.extend( {}, defaults, itemDetails );
        var show = true, recentItemsAsStr = "", recentItemArray = [], itemArrayStr = "", recentItemMap = {}, recentItemsList = [];
        return this.each( function() {
			if(singleItem.itemId != 0){
				show = false;
				recentItemArray = getRecentItemsFrmStorage();
				if(recentItemArray.length > 0){
					recentItemMap = recentItemAsMap(recentItemArray);
					var flag = false;
					$.each( recentItemMap, function( key, value ) {
						var partNumber = jQuery("#multipleUOMSelect").data("partnumber");
						if(partNumber == value.partNumber){
							flag = true;
						}
					});
					if (flag == false) {
                        var recentItemCount = recentItemArray.length;
                        while (recentItemCount > 10) {
                            recentItemArray.shift();
                            recentItemCount--;
                        }
                        if(!isItemExistsInRecents(singleItem)){
                            recentItemArray.push(singleItem);
                            addRecentItemToStorage(recentItemArray);
                        }else{
                            reArrangeRecentItems(singleItem,recentItemArray);
                            recentItemArray.push(singleItem);
                            addRecentItemToStorage(recentItemArray);
                        }
                        show = true;
				    }else{
                        if(!isItemExistsInRecents(singleItem)){
                            recentItemArray.push(singleItem);
                            addRecentItemToStorage(recentItemArray);
                        }
                    }
			}else{
				recentItemArray.push(singleItem);
				addRecentItemToStorage(recentItemArray);
			}
		}
        if(show){
            recentItemArray = getRecentItemsFrmStorage();
            recentItemMap = recentItemAsMap(recentItemArray);
            recentItemMap = removeCurrentItemFrmRecents(recentItemMap, singleItem.itemId);
            recentItemsAsStr = JSON.stringify(recentItemMap);
            recentItemsAsStr = encodeURIComponent(recentItemsAsStr);
            var requestBody ="jsonObj="+recentItemsAsStr;
            $.post("recentlyViewedPage.action", requestBody, function(data,status,xhr){
                if($.trim(data).length>1){
                    $("#recentlyViewedContent").show();
                    $("#recentlyViewedContent").html(data);
                    $("#recentitembox").show();
                    $('#recentlyViewedContent').slick(slickInitializer);
                }else{
                	$("#recentlyViewedContent").parent().hide();
                }
            });
        }else{
        	$("#recentlyViewedContent").parent().hide();
        }
		});
    };
        
    function recentItemAsMap(recentItems){
        var recentItemsMap = {}, recentItemsCount = recentItems.length, i = 0; key = 1;
        for(i = 0; i < recentItemsCount; i++){			
            recentItemsMap[key++] = recentItems[i];
        }
        return recentItemsMap;
    }
    function addRecentItemToStorage(recentItemArray){
        var itemArrayStr = JSON.stringify(recentItemArray);
        if(typeof(Storage)){
            localStorage.setItem("recentItemsList",itemArrayStr);
        }
    }
    function removeCurrentItemFrmRecents(recentItemMap, itemId){
        for(var key in recentItemMap){
            var currentObj = recentItemMap[key];
            if(currentObj.itemId === itemId){
                delete recentItemMap[key];
            }
        }
        return recentItemMap;
    }
    function getRecentItemsFrmStorage(){
        var recentItemArray = [], recentItemsList= [];
        recentItemsList = localStorage.getItem("recentItemsList");
        if(recentItemsList && recentItemsList != "undefined"){
            recentItemArray = jQuery.parseJSON(recentItemsList);
        }
        return recentItemArray;
    }
    function isItemExistsInRecents(currentItem){
        var status = false, i = 0, size = 0, eachItem = {};
        var recentItemList = getRecentItemsFrmStorage();
        size = recentItemList.length;
        for(i = 0; i < size; i++){
            eachItem = recentItemList[i];
            if(currentItem.itemId == eachItem.itemId){
                status = true;
                break;
            }
        }
        return status;
    }
    function reArrangeRecentItems(currentItem,recentItemList){
        var i = 0; size = recentItemList.length;
        for(i = 0; i < size; i++){
            eachItem = recentItemList[i];
            if(currentItem.itemId == eachItem.itemId){
                recentItemList.splice(i,1);
                break;
            }
        }
    }
}(jQuery));

$(document).ready(function(){
	var ulLength = $('ul#recentlyViewedContent li' ).size();
	if( ulLength < 1 ) {
		$(".recentlyhide").hide();
	}else{
		$(".recentlyhide").show();
	}
});

$(function(){
	var timerForRecentItems = setTimeout(function(){
		var enableRecentlyViewed = $("#enableRecentlyViewed").val();
		var startRecent = $("#startRecent").val();
		if(enableRecentlyViewed=="Y" && startRecent=="Y"){
			LoadRecentViewedItem();
			clearInterval(timerForRecentItems);
		}
},50);	
});