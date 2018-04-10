function jssorSliderFunction() {
    jQuery("div[id$='_container']").each(function() {
        // jQuery(this).html(jQuery("#slidercontainer").html());
        initJssorSlides(jQuery(this).attr("id"))
        console.log("generated : " + jQuery(this).attr("id"));
    });
}
var refreshBanner = function(bannerId, index) {
    console.log("bannerId : " + bannerId + "-" + index);
    jQuery.getJSON("/bannerApi.action?bannerListId=" + bannerId + "&reload=false", function(data) {
        if (data.hasOwnProperty('bannerTemplate')) {
            var bannerData = "";
            var bannerTemplate = data.bannerTemplate;
            var dynamicProperties = data.dynamicProperties;
            var bannerType = dynamicProperties.bannerType;
            var transistion = "";
            var carouselSetting = "";

            if (typeof dynamicProperties.bannerTransistion != 'undefined') {
                transistion = dynamicProperties.bannerTransistion;
            }

            if (typeof dynamicProperties.carouselSetting != 'undefined') {
                carouselSetting = dynamicProperties.carouselSetting;
            }
            jQuery("[data-bannerid='" + bannerId + "']").each(function() {
                var bannerData = "";
                var sliderId = jQuery(this).attr("id").replace("_Wrapper", "");
                var wrapperId = jQuery(this).attr("id");
                var bannerType = jQuery(this).data("bannertype");
                console.log("Wrapper id :" + sliderId);

                bannerData = data.bannerTemplate.replace("slidercontainer", sliderId);
                jQuery(this).html(bannerData);

                if (bannerType == "slider") {
                    initJssorSlides(sliderId, transistion);
                } else if (bannerType == "carousel") {
                    initCarousel(sliderId, carouselSetting);
                }
            });
        }
    });
};

function initInitalBanner() {
    jQuery("[data-select='bannerBlock']").each(function(i) {
        var bannerListId = jQuery(this).data("bannerid");
        if (typeof bannerListId != "undefined" && bannerListId != "") {
            refreshBanner(bannerListId, i);
        }
    });
}

function generateWidget(widgetId) {
    jQuery.ajax({
        url: "/generateTemplateWidget.action?widgetId=" + widgetId + "&date=" + new Date(),
        async: false,
        success: function(data) {
            jQuery("[data-widget='" + widgetId + "']").html(data);
        }
    });
}

function loadWidgets() {
    jQuery("[data-select='widget']").each(function(i) {
        var widgetId = jQuery(this).data("widget");
        generateWidget(widgetId);
    });
}

function generateForm(formId) {
    jQuery.ajax({
        url: "generateFromCms.action?formId=" + formId + "&date=" + new Date(),
        async: false,
        success: function(data) {
            jQuery("[data-widget='" + formId + "']").html(data);
        }
    });
}

function loadStaticForms() {
    jQuery("[data-select='form']").each(function(i) {
        var formId = jQuery(this).data("widget");
        generateForm(formId);
    });
}

$(document).ready(function(){
	$("#success_story-slider").slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover:true,
		arrows: false,
		autoplay: false,
		dots: true,
		infinite: true,
		fade: true,
		cssEase: 'linear'
	});
	

    $('#probwesolve').on('afterChange init', function(event, slick, direction){
        
        slick.$slides.removeClass('center_prevdiv').removeClass('center_nextdiv');
        for (var i = 0; i < slick.$slides.length; i++)
        {
            var $slide = $(slick.$slides[i]);
            if ($slide.hasClass('slick-current')) {
                $slide.prev().addClass('center_prevdiv');
                $slide.next().addClass('center_nextdiv');
                break;
            }
        }
      }
    ).on('beforeChange', function(event, slick) {
        slick.$slides.removeClass('center_prevdiv').removeClass('center_nextdiv');
    }).slick({
		centerMode: true,
    	centerPadding: '240px',
    	slidesToShow: 1,
    	autoplay: true,
    	asNavFor: '#probwesolve_cont'
    });
    
    $('#probwesolve_cont').slick({
    	infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover:true,
		autoplay: true,
		arrows: false,
		infinite: true,
		cssEase: 'linear',
		asNavFor: '#probwesolve'
    });
});