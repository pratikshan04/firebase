function jssorSliderFunction() {
	jQuery("div[id$='_container']").each(function(){
		initJssorSlides(jQuery(this).attr("id"))
		console.log("generated : " + jQuery(this).attr("id"));
	});
}
var refreshBanner = function(bannerId,index){
	console.log("bannerId : " + bannerId + "-" + index);
	jQuery.getJSON("/bannerApi.action?bannerListId="+bannerId+"&reload=false", function(data) {
		if(data.hasOwnProperty('bannerTemplate')){
			var bannerData = "";
			var bannerTemplate = data.bannerTemplate;
			var dynamicProperties = data.dynamicProperties;
			var bannerType = dynamicProperties.bannerType;
			var transistion = "";
			var carouselSetting = "";
			if(typeof dynamicProperties.bannerTransistion!='undefined'){
				transistion = dynamicProperties.bannerTransistion;
			}
			if(typeof dynamicProperties.carouselSetting!='undefined'){
				carouselSetting = dynamicProperties.carouselSetting;
			}
			jQuery("[data-bannerid='"+bannerId+"']").each(function(){
				var bannerData = "";
				var sliderId = jQuery(this).attr("id").replace("_Wrapper","");
				var wrapperId = jQuery(this).attr("id");
				var bannerType = jQuery(this).data("bannertype");
				console.log("Wrapper id :"+sliderId);
				bannerData = data.bannerTemplate.replace("slidercontainer",sliderId);
				jQuery(this).html(bannerData);
				
				if(bannerType=="slider"){
					initJssorSlides(sliderId,transistion);
				}else if(bannerType=="carousel"){
					initCarousel(sliderId,carouselSetting);
				}
			});
		}
	});
};
function initInitalBanner(){
	jQuery("[data-select='bannerBlock']").each(function(i){
		var bannerListId = jQuery(this).data("bannerid");
		if(typeof bannerListId!="undefined" && bannerListId!=""){
			refreshBanner(bannerListId,i);
		}
	});
}
function generateWidget(widgetId){
	jQuery.ajax({
		url: "/generateTemplateWidget.action?widgetId="+widgetId+"&date="+new Date(),
		async: false,
		success: function (data) {
			jQuery("[data-widget='"+widgetId+"']").html(data);
		}
	});
}
function loadWidgets(){
	jQuery("[data-select='widget']").each(function(i){
		var widgetId = jQuery(this).data("widget");
		generateWidget(widgetId);
	});
	homeCarousels();
}
function generateForm(formId){
	jQuery.ajax({
		url: "generateFromCms.action?formId="+formId+"&date="+new Date(),
		async: false,
		success: function (data) {
			jQuery("[data-widget='"+formId+"']").html(data);
		}
	});
}
function loadStaticForms(){
	jQuery("[data-select='form']").each(function(i){
	var formId = jQuery(this).data("widget");
		generateForm(formId);
	});  
}

function homeCarousels(){
	if($('#featuredProductList').length>0){
		  $('#featuredProductList').slick({
			  infinite: true,
			  slidesToShow: 5,
			  slidesToScroll: 1,
			  pauseOnHover:true,
			  responsive: [
			               {
			                 breakpoint: 1024,
			                 settings: {
			                   slidesToShow: 4,
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
		  });
		}

		if($('#featuredBrands').length>0){
			$('#featuredBrands').slick({
				  infinite: true,
				  slidesToShow: 5,
				  slidesToScroll: 1,
				  pauseOnHover:true,
				  responsive: [
				               {
				                 breakpoint: 1024,
				                 settings: {
				                   slidesToShow: 4,
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
			  });
		}
		if($('#featuredManufacturers').length>0){
			$('#featuredManufacturers').slick({
				  infinite: true,
				  slidesToShow: 5,
				  slidesToScroll: 1,
				  pauseOnHover:true,
				  responsive: [
				               {
				                 breakpoint: 1024,
				                 settings: {
				                   slidesToShow: 4,
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
			  });
		}
		if($('#shopByCategory').length>0){
			$('#shopByCategory').slick({
				  infinite: true,
				  slidesToShow: 5,
				  slidesToScroll: 1,
				  pauseOnHover:true,
				  responsive: [
				               {
				                 breakpoint: 1024,
				                 settings: {
				                   slidesToShow: 4,
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
			  });
		}
}