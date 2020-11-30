var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
function jssorSliderFunction() {
	jQuery("div[id$='_container']").each(function(){
		initJssorSlides(jQuery(this).attr("id"))
	});
}
var refreshBanner = function(bannerId,index){
	jQuery.getJSON("/bannerApi.action?bannerListId="+bannerId+"&reload=false", function(data) {
		if(data && data.hasOwnProperty('bannerTemplate')){
			var bannerData = "";
			var bannerTemplate = data.bannerTemplate;
			var dynamicProperties = data.dynamicProperties;
			var bannerType = dynamicProperties.bannerType;
			var transistion = "";
			var transistionDelay = "";
			var transistionAutoPlay = "";
			var carouselSetting = "";
			if(typeof dynamicProperties.bannerTransistion!='undefined'){
				transistion = dynamicProperties.bannerTransistion;
			}
			if(typeof dynamicProperties.bannerTransistionDelay!='undefined'){
				transistionDelay = dynamicProperties.bannerTransistionDelay;
			}
			if(typeof dynamicProperties.bannerTransistionAutoPlay!='undefined'){
				transistionAutoPlay = dynamicProperties.bannerTransistionAutoPlay;
			}
			if(typeof dynamicProperties.carouselSetting!='undefined'){
				carouselSetting = dynamicProperties.carouselSetting;
			}
			jQuery("[data-bannerid='"+bannerId+"']").each(function(){
				var bannerData = "";
				var sliderId = jQuery(this).attr("id").replace("_Wrapper","");
				var wrapperId = jQuery(this).attr("id");
				var bannerType = jQuery(this).data("bannertype");
				bannerData = data.bannerTemplate.replace("slidercontainer",sliderId);
				jQuery(this).html(bannerData);
				
				if(bannerType=="slider"){
					initJssorSlides(sliderId, transistion, transistionDelay,transistionAutoPlay);
				}else if(bannerType=="carousel"){
					initCarousel(sliderId,carouselSetting);
				}
			});
		}
	});
};
function initInitalBanner(){
	jQuery("[data-select='bannerBlock']").each(function(i){
		$(this).parents('.container-fluid').css({'padding':'0px'});
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
			var df = jQuery("[data-widget='"+formId+"']").find('.datePicker').attr('data-format');
			initDatePicker(df);
			removeCaption();
			refreshjcaptcha();
			$('.cimm_formContent li').removeAttr('title');
			$('.col').removeAttr('title');
			$("[data-widget='"+formId+"']").find('form').attr({'action':'SaveAndSendMail.action', 'onsubmit':'submitThisForm(this); return false;'});
			$("[data-widget='"+formId+"']").find('[type="submit"]').attr('disabled', false).removeClass('btns-disable');
			if($('#recaptchaStaticPages').val() == "Y") { 
				if($("[data-widget='"+formId+"']").find('form').attr('data-recaptcha') && $('#g-recaptcha-uni').length == 0 && $("#isWebview").val() != "WEBVIEW" ){
				    renderRecaptcha();
				}
				if($("[data-widget='"+formId+"']").find('form').attr('data-recaptcha')){
					$("[data-widget='"+formId+"']").find('div[data-type="captcha"]').remove();
					$("[data-widget='"+formId+"']").find('form').append('<input type="hidden" name="recaptcha_staticPage" value="Y" />');
				}
			}else {
				$("[data-widget='"+formId+"']").find('form').removeAttr('data-recaptcha');
			}
		}
	});
}
function loadStaticForms(){
	jQuery("[data-select='form']").each(function(i){
	var formId = jQuery(this).data("widget");
		generateForm(formId);
	});  
}
function initDatePicker(dateFormat){
	$.getScript(cdnPluginJsPath+'/bootstrap-datepicker.min.js', function(){
		$('.datePicker').datepicker({
			format: dateFormat,
			autoclose: true,
			startDate: '0',
		});
	});
}
function removeCaption(){
	var userLogin = $("#userLogin").val();
	if (userLogin=="true" ) {
	    $('[name="jcaptcha"]').parent().remove();
	}
}