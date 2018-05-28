function generateWidget(widgetId){
	//console.log("Loading widget ID :"+widgetId);
	jQuery.ajax({
        url: "generateWidgetCms.action?widgetId="+widgetId+"&date="+new Date(),
		async: false,
        success: function (data) {
        	jQuery("[data-widget='"+widgetId+"']").html(data);
        }
    });
}

function generateWidgetList(){
	jQuery.ajax({
		url: "/widgetListCms.action?pageSize=300&requestType=ajax&date="+new Date(),
		 async: false,
		success: function (data) {
        	jQuery("#widgetContainer").html(data);
		}
	});
}

function widgetPreview(widgetId){
	jQuery.ajax({
        url: "generateWidgetCms.action?widgetId="+widgetId+"&date="+new Date(),
		async: false,
        success: function (data) {
        	jQuery("#previewContainer").html(data);
        	homeCarousels();
        }
    });
}

function deleteWidget(widgetId,widgetName){
	var r = confirm("Are you sure you want to delete - "+widgetName);
	if (r == true) {
		jQuery.ajax({
	        url: "updateWidgetCms.action?widget.id="+widgetId+"&type=delete&date="+new Date(),
			async: true,
	        success: function (data) {
	        	alert(widgetName + " - has been deleted successfully.");
	        	window.parent.generateWidgetList();
	        	window.parent.buildWidgetList();
	        	window.location.href="widgetListCms.action";
	        }
	    });
	} 
}



function generateForm(formId){
	
	jQuery.ajax({
        url: "generateFromCms.action?formId="+formId+"&date="+new Date(),
		async: false,
        success: function (data) {
        	jQuery("[data-widget='"+formId+"']").html(data);
        	jQuery("[data-widget='"+formId+"']").find('input, textarea, button, select').attr('disabled','disabled');
        }
    });
}

function generateFormList(){
	jQuery.ajax({
		 url: "/formListCms.action?pageSize=300&requestType=ajax&date="+new Date(),
		async: false,
        success: function (data) {
        	console.log("Loading form");
        jQuery("#formContainer").html(data);
        }
    });
}

function formPreview(formId){
	jQuery.ajax({
        url: "generateFromCms.action?formId="+formId+"&date="+new Date(),
		async: false,
        success: function (data) {
        	jQuery("#previewContainer").html(data);
        }
    });
}

function deleteForm(formId,formName){
	var r = confirm("Are you sure you want to delete - "+formName);
	if (r == true) {
		jQuery.ajax({
	        url: "addUpdateFormDataCms.action?formData.id="+formId+"&type=delete&date="+new Date(),
			async: true,
	        success: function (data) {
	        	alert(formName + " - has been deleted successfully.");
	        	//window.parent.buildFormList();
	        	window.parent.generateFormList();
	        	window.location.href="formListCms.action";
	        }
	    });
	} 
}