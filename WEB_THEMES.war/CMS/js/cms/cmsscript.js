function generateWidget(widgetId){
	//console.log("Loading widget ID :"+widgetId);
	jQuery.ajax({
        url: "generateWidgetCms.action?widgetId="+widgetId+"&date="+new Date(),
		async: false,
        success: function (data) {
        	var widgetName = jQuery("[data-widget-id='"+widgetId+"']").attr("data-widget-name");
        	jQuery("[data-widget='"+widgetId+"']").next(".widgetEditOverlay").remove();
        	jQuery("[data-widget='"+widgetId+"']").html("");
        	jQuery("[data-widget='"+widgetId+"']").html(data).append('<div class="widgetEditOverlay"><h3>'+widgetName+'</h3><a class="iframe btn widgetEditBtn" href="editWidgetDataCms.action?widgetId='+widgetId+'" onclick="editWidgetIframeWindow();"><i class="fa fa-pencil-alt mRight-2" aria-hidden="true"></i> Edit</a></div>');
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
	        	//window.parent.buildWidgetList();
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

function validateSearchCMSForm(){
	var s = $('#queryTxtBox').val();
	if(s==null || $.trim(s) == ""){
		alert("Enter Search Keyword.");
		$('#queryTxtBox').focus();
		return false;
	}else{
		return true;
	}
}
function paginationScriptCms(n_pages,page_link,iindex,pgno){
    var n_links = 1, returnString = '<div class="pagebarUTH">',n_index = (iindex/pgno)+1;
    var start=1;
   /*  if(iindex == 1){
    	returnString+='<a href="javascript:void(0);" class="btns-disable"><i class="fa fa-angle-double-left fa-lg fontIconArrow"></i></a><a href="'+page_link+(iindex-pgno)+'"><i class="fa fa-angle-left fa-lg fontIconArrow"></i></a>';
	}else if(iindex < 1) {
    	returnString += '<a href="javascript:void(0);" class="btns-disable"><i class="fa fa-angle-double-left fa-lg fontIconArrow"></i></a><a href="javascript:void(0);" class="btns-disable"><i class="fa fa-angle-left fa-lg fontIconArrow"></i></a>';
	}else {
    	returnString+='<a href="'+page_link+'0"><i class="fa fa-angle-double-left fa-lg fontIconArrow"></i></a><a href="'+page_link+(iindex-pgno)+'"><i class="fa fa-angle-left fa-lg"></i></a>';
	} */
	if(iindex > 0) {
		returnString+='<a href="'+page_link+'0"><i class="fa fa-angle-double-left fa-lg fontIconArrow"></i></a><a href="'+page_link+(iindex-pgno)+'"><i class="fa fa-angle-left fa-lg"></i></a>';
	}
	
	if(n_links){
		var n_firstLink,n_lastLink;
		if(n_index >= n_pages){
			n_firstLink = start;
			n_lastLink = n_pages;
		} else if(n_index<=0) {
			n_firstLink = start;
			n_lastLink = 1;
        } else {
			n_firstLink = start;
			if(n_links>n_pages)
				n_lastLink = n_pages;
			else
				n_lastLink = n_firstLink + n_links-1;
    	}
    	var currentPage = iindex + 1;
	    returnString += '<span class="this-page">'+ currentPage +'</span>';
	}

    if((n_lastLink) != n_pages){
    	returnString+= ' of <span>'+n_pages+'<span> <a href="'+page_link+(iindex+pgno)+'"><i class="fa fa-angle-right fa-lg"></i></a>';
    	returnString+= '<a href="'+page_link+((n_pages-1)*pgno)+'"><i class="fa fa-angle-double-right fa-lg"></i></a>';
    } else{
    	returnString+= ' of <span>'+n_pages+'</span>';
    }
	returnString+='  </div>';
	return returnString;
}
function convertHtmlEntities(){
	var content = jQuery("#gm-canvas").html();
	content = content.replace(/™/g, "&trade;");
	content = content.replace(/¡/,"&iexcl;");
	content = content.replace(/¢/,"&cent;");
	content = content.replace(/£/,"&pound;");
	content = content.replace(/¤/,"&curren;");
	content = content.replace(/¥/,"&yen;");
	content = content.replace(/¦/,"&brvbar;");
	content = content.replace(/§/,"&sect;");
	content = content.replace(/¨/,"&uml;");
	content = content.replace(/©/,"&copy;");
	content = content.replace(/ª/,"&ordf;");
	content = content.replace(/«/,"&laquo;");
	content = content.replace(/¬/,"&not;");
	content = content.replace(/®/,"&reg;");
	content = content.replace(/¯/,"&macr;");
	content = content.replace(/°/,"&deg;");
	content = content.replace(/±/,"&plusmn;");
	content = content.replace(/²/,"&sup2;");
	content = content.replace(/³/,"&sup3;");
	content = content.replace(/´/,"&acute;");
	content = content.replace(/µ/,"&micro;");
	content = content.replace(/¶/,"&para;");
	content = content.replace(/·/,"&middot;");
	content = content.replace(/¸/,"&cedil;");
	content = content.replace(/¹/,"&sup1;");
	content = content.replace(/º/,"&ordm;");
	content = content.replace(/»/,"&raquo;");
	content = content.replace(/¼/,"&frac14;");
	content = content.replace(/½/,"&frac12;");
	content = content.replace(/¾/,"&frac34;");
	content = content.replace(/¿/,"&iquest;");
	content = content.replace(/×/,"&times;");
	content = content.replace(/÷/,"&divide;");
	content = content.replace(/À/,"&Agrave;");
	content = content.replace(/Á/,"&Aacute;");
	content = content.replace(/Â/,"&Acirc;");
	content = content.replace(/Ã/,"&Atilde;");
	content = content.replace(/Ä/,"&Auml;");
	content = content.replace(/Å/,"&Aring;");
	content = content.replace(/Æ/,"&AElig;");
	content = content.replace(/Ç/,"&Ccedil;");
	content = content.replace(/È/,"&Egrave;");
	content = content.replace(/É/,"&Eacute;");
	content = content.replace(/Ê/,"&Ecirc;");
	content = content.replace(/Ë/,"&Euml;");
	content = content.replace(/Ì/,"&Igrave;");
	content = content.replace(/Í/,"&Iacute;");
	content = content.replace(/Î/,"&Icirc;");
	content = content.replace(/Ï/,"&Iuml;");
	content = content.replace(/Ð/,"&ETH;");
	content = content.replace(/Ñ/,"&Ntilde;");
	content = content.replace(/Ò/,"&Ograve;");
	content = content.replace(/Ó/,"&Oacute;");
	content = content.replace(/Ô/,"&Ocirc;");
	content = content.replace(/Õ/,"&Otilde;");
	content = content.replace(/Ö/,"&Ouml;");
	content = content.replace(/Ø/,"&Oslash;");
	content = content.replace(/Ù/,"&Ugrave;");
	content = content.replace(/Ú/,"&Uacute;");
	content = content.replace(/Û/,"&Ucirc;");
	content = content.replace(/Ü/,"&Uuml;");
	content = content.replace(/Ý/,"&Yacute;");
	content = content.replace(/Þ/,"&THORN;");
	content = content.replace(/ß/,"&szlig;");
	content = content.replace(/à/,"&agrave;");
	content = content.replace(/á/,"&aacute;");
	content = content.replace(/â/,"&acirc;");
	content = content.replace(/ã/,"&atilde;");
	content = content.replace(/ä/,"&auml;");
	content = content.replace(/å/,"&aring;");
	content = content.replace(/æ/,"&aelig;");
	content = content.replace(/ç/,"&ccedil;");
	content = content.replace(/è/,"&egrave;");
	content = content.replace(/é/,"&eacute;");
	content = content.replace(/ê/,"&ecirc;");
	content = content.replace(/ë/,"&euml;");
	content = content.replace(/ì/,"&igrave;");
	content = content.replace(/í/,"&iacute;");
	content = content.replace(/î/,"&icirc;");
	content = content.replace(/ï/,"&iuml;");
	content = content.replace(/ð/,"&eth;");
	content = content.replace(/ñ/,"&ntilde;");
	content = content.replace(/ò/,"&ograve;");
	content = content.replace(/ó/,"&oacute;");
	content = content.replace(/ô/,"&ocirc;");
	content = content.replace(/õ/,"&otilde;");
	content = content.replace(/ö/,"&ouml;");
	content = content.replace(/ø/,"&oslash;");
	content = content.replace(/ù/,"&ugrave;");
	content = content.replace(/ú/,"&uacute;");
	content = content.replace(/û/,"&ucirc;");
	content = content.replace(/ü/,"&uuml;");
	content = content.replace(/ý/,"&yacute;");
	content = content.replace(/þ/,"&thorn;");
	content = content.replace(/ÿ/,"&yuml;");
	return content;
}