var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
$.getScript(cdnPluginJsPath+'/jquery.eventCalendar.js', function(){
	$("#eventCalendarInline").eventCalendar({
		eventsjson:'calendarEventUnit.action',
		cacheJson:false
	});
	$("#FirstLoadEvent").val("N");
});
$("ul.calendarFilterHead li label").click(function (e) {
    e.preventDefault();
	var allHash = $(this).parent().parent('.calendarFilterHead').find('li');
	$(allHash).removeClass('active');
	$(this).parent().addClass('active');
});