$(document).ready(function() {
		setTimeout(function(){
			var LocationList = $("ul.store-list li").length;
			var Location = getCookie('Location');
			if(Location!="" && Location != undefined){
				for(i=0; i < LocationList; i++ ){
					var branchLocatList = $("ul.store-list li");
					var branchLocat = $(branchLocatList[i]).find(".store .Title b").html();
					if(branchLocat == Location){
						$(branchLocatList[i]).find("div.Title").trigger('click');
						$(branchLocatList[i]).find("a.store").trigger('click');
						setCookie("Location","");
					}
				}
			}
		}, 1000);
		$('#list li a div').live('click', function(e) {
			var $clicked = $(e.target);
			var id = $($clicked).attr("id");
			if(id == "viweAll"){
				$("#map_canvas").css({"opacity":"0","z-index":"-1"});
				$("#googleMap").css({"opacity":"1","z-index":"1"});
				$("#list li").removeClass("crselected1");
				$("#list li:first-child").addClass("crselected1");
				$(".storeDetailview").hide();
				$('#directions-panel').hide();
				test(data,dataFrom,sheetUrl,mapCenterCord,zoomValue);
			}else{
				$("#googleMap").css({"opacity":"0","z-index":"-1"});
				$("#map_canvas").css({"opacity":"1","z-index":"1"});
				$("#list li:first-child").removeClass("crselected1");
				$(".storeDetailview").show();
				$('#directions-panel').hide();
			}
		});
		
		 var totalLocations = $("#totalLocations").val();
		 if(totalLocations < 1){
			$(".locationDataWrap, .storelocator-panel").css("display","none");
			$('.cimm_locateHead').show();
		}
		$("#findNowButton").click(function () {
			var selectedMiles = jQuery("#selectedMiles").val();
			var selectedZipCode = jQuery("#selectedZipCode").val();
			if(typeof selectedZipCode!='undefined' && selectedZipCode!=null && selectedZipCode!=""){
				location.href="/Locations/"+selectedMiles+"/"+selectedZipCode;
			}else{
				bootAlert("small","error","Error","Please enter Zip Code to find location.");
			}
		});
	});

jQuery("#searchTextField").keyup(function (e) {
	if(e.keyCode == 13){
		jQuery('#getDiections').click();
	}
});

function test(data,dataFrom,sheetUrl,mapCenterCord,zoomValue){
	data = eval(data);
	init(data,dataFrom,sheetUrl,mapCenterCord,zoomValue);
}