var webThemes = $("#webThemePath").val();
jQuery.getScript(webThemes+'js/BulkAction.js', function(){
	BulkAction.enableCheckBoxOnLoad();
});
function validateSearchWithInMulti(a){
	var s = jQuery('#keyWordTxt').val();
	if(s == "" || s=="Search Within" || s=="Search%20With%20In" || s==a){
		bootAlert("medium","error","Error","Enter a keyword to Search Within the list.");
		return false;
	}else{
		var attrList = jQuery("#attrFilterList").text();
		var keyText = jQuery("#keyWordTxtTrail").text();
		if(jQuery.trim(keyText)!=""){
			keyText = keyText + "|" + s;
			jQuery("#keyWordTxtMulti").val(keyText);
		}else{
			jQuery("#keyWordTxtMulti").val(s);
		}
		if(jQuery.trim(attrList)!="" ){
			jQuery("#multiFilterAttrList").val(attrList);
		}
		jQuery("#multiFilterAttr").submit();
	}
}
function removeKeyword(index){
	var keyText = jQuery("#keyWordTxtTrail").text();
	var attrList = jQuery("#attrFilterList").text();
	if(jQuery.trim(attrList)!="" )
	{
		jQuery("#multiFilterAttrList").val(attrList);
	}
	if(jQuery.trim(keyText)!="")
	{
		var keyArr = keyText.split("|");
		if(keyArr.length>0)
		{
			keyArr.splice(index,1);
			jQuery("#keyWordTxtMulti").val( keyArr.join("|"));
			if(keyArr.length<1)
				keyText = "";
		}
		else
		{
			keyText = "";
		}
		var navigationType = jQuery("#navigationType").val();
		var srchKeyword = jQuery("#srchKeyword").val();
		var srchTyp = jQuery("#srchTyp").val();
		if(jQuery.trim(attrList)=="" && jQuery.trim(keyText)=="" && srchTyp=="CATNAV")
			jQuery("#categoryForm").submit();
		else if(jQuery.trim(attrList)=="" && jQuery.trim(keyText)=="" && srchKeyword=="" && navigationType=="SEARCH")
			window.location.href="locale('website.url.ProductCategory')";
		else
			jQuery("#multiFilterAttr").submit();
	}
}
function buildSearchTrail(){
	jQuery("#mulitFilterTrail").html("");
	var buildString = "";
	var keyText = jQuery("#keyWordTxtTrail").text();
	var attrList = jQuery("#attrFilterList").text();
	if(jQuery.trim(attrList)!="" || jQuery.trim(keyText)!=""){
		buildString = '<ol>';
	}
	if(jQuery.trim(keyText)!=""){
		var keyArr = keyText.split("|");
		if(keyArr.length>0){
			buildString = buildString + '<li>';
			buildString = buildString + '<span class="Refine-label">';
			buildString= buildString + " Keyword: ";
			buildString = buildString + '</span>';
			var c = "";
			for(j=0;j<keyArr.length;j++){
				var dispVal = keyArr[j];
				if(dispVal.toUpperCase()=="CATEGORY")
					dispVal = "Category";
				if(dispVal.toUpperCase()=="MANUFACTURERNAME")
					dispVal = "Manufacturer";
				buildString = buildString + c + '<span class="Refine-value">'+keyArr[j]+'<a class="removeFilter pullRight" href="javascript:void(0);" onclick="removeKeyword('+j+')" title="Remove This Item"> <i class="fa fa-times"></i></a></span>';
				c = " ";
			}
			buildString = buildString + '</li>';
		}
	}
	if(jQuery.trim(attrList)!=""){
		var attrArr = attrList.split("~");
		for(i=0;i<attrArr.length;i++){
			var valArr = attrArr[i].split(":");
			var valListArr = valArr[1].split("|");
			buildString = buildString + '<li>';
			buildString = buildString + '<span class="Refine-label clearAfter">';
			var dispVal = valArr[0].replace("attr_","");
			if(dispVal.toUpperCase()=="CATEGORY")
				dispVal = "Category";
			if(dispVal.toUpperCase()=="MANUFACTURERNAME")
				dispVal = "Manufacturer";
			buildString= buildString + dispVal;
			buildString = buildString + '</span>';
			var c = "";
			for(j=0;j<valListArr.length;j++){
				buildString = buildString + c + '<span class="Refine-value clearAfter">'+valListArr[j].substring(1, valListArr[j].length-1)+'<a class="removeFilter pullRight" href="javascript:void(0);" onclick="removeMultiAttr(this)" title="Remove This Item"><div style="display:none">'+valArr[0]+'</div><span style="display:none;">'+valListArr[j]+'</span> <i class="fa fa-times"></i></a></span>';
				c = " ";
			}
			buildString = buildString + '</li>';
		}
	}
	if(jQuery.trim(attrList)!="" || jQuery.trim(keyText)!=""){
		buildString = buildString+'</ol>';
		jQuery("#mulitFilterTrail").html(buildString);
	}
	$('.productSearch').val("");
}
function removeMultiAttr(id){
	var key = jQuery(id).find("div").text();
	var originalVal = jQuery(id).find("span").text();
	var val=Encoder.htmlEncode(jQuery(id).find("span").text());
	val=val.replace(/\&quot;/g,'"');
	if(key=="BRAND")
		key = "brand";
	if(key=="CATEGORY")
		key = "category";
	if(key=="MANUFACTURER")
		key = "manufacturerName";
	var attrList = jQuery("#attrFilterList").text();
	var keyText = jQuery("#keyWordTxtTrail").text();
	if(jQuery.trim(keyText)!=""){
		jQuery("#keyWordTxtMulti").val(keyText);
	}
	if(jQuery.trim(attrList)==""){
		jQuery("#multiFilterAttrList").val(key+":"+val);
	}else{
		var attrArr = attrList.split("~");
		var buildAttr = "";
		var c = "";
		var isBuild = false;
		for(i=0;i<attrArr.length;i++){
			if(buildAttr=="")c = "";
			var valArr = attrArr[i].split(":");
			if(valArr[0] == key){
				var valListArr = valArr[1].split("|");
				if(valListArr.length>1){
					var k = "";
					var newVal = valArr[0]+":";
					for(j=0;j<valListArr.length;j++){
						var checkattr = valListArr[j]!=val;
						if(checkattr){
							checkattr = valListArr[j]!=originalVal;
						}
						if(checkattr){
							newVal = newVal + k + valListArr[j];
							k = "|";
						}
					} 
					buildAttr = buildAttr + c + newVal;
					isBuild = true;
				}else{
					isBuild = true;
				}
			}else{
				buildAttr = buildAttr + c + attrArr[i];
			}
			c = "~";
		}
		jQuery("#multiFilterAttrList").val(buildAttr);
	}
	var navigationType = jQuery("#navigationType").val();
	var srchKeyword = jQuery("#srchKeyword").val();
	var srchTyp = jQuery("#srchTyp").val();
	if(jQuery.trim(buildAttr)=="" && jQuery.trim(keyText)=="" && srchTyp=="CATNAV" && navigationType=="NAVIGATION")
		jQuery("#categoryForm").submit();
	else if(jQuery.trim(buildAttr)=="" && jQuery.trim(keyText)=="" && srchKeyword=="" && navigationType=="SEARCH")
		window.location.href="locale('website.url.ProductCategory')";
	else
		jQuery("#multiFilterAttr").submit();
}
function filterForAllSelectedAttributes(){
	var key = "";
	var val = ""
	var c = "|";
	var map = {};
	$('.cimm_filterAttributes input:checked').each(function() {
		var tId = jQuery(this).attr("id");
		key = jQuery("#"+tId+"_div").text();
		if(map[key]){
			var val = map[key];
			val = val+ c + '"'+unescape(jQuery("#"+tId+"_span").text())+'"';
			map[key] = val;
		}else{
			val = '"'+unescape(jQuery("#"+tId+"_span").text())+'"';
			map[key] = val
		}
	});
	buildMultiFilterAttributes(map);
}

function buildMultiFilterAttributes(map){
		var attrFilterFrmMap = "";
		var tildSplit = "";		
		for (key in map){
			var actualkey = key;
			if(key=="Brands"){
				key = "brand";
	        }
	     	if(key=="Category"){
	     		key = "category";
	     	}
	     	if(key=="Manufacturer"){
	     		key = "manufacturerName";
	     	}		
	     	key = "attr_"+key;
	     	var concatTxt = key+":"+map[actualkey];
	     	attrFilterFrmMap = attrFilterFrmMap + tildSplit + concatTxt;
	     	tildSplit = "~";
	    }
		var attrList = jQuery("#attrFilterList").text();
     	var keyText = jQuery("#keyWordTxtTrail").text();
     	if(jQuery.trim(keyText)!=""){
			jQuery("#keyWordTxtMulti").val(keyText);
		}
     	if(jQuery.trim(attrList)==""){
			jQuery("#multiFilterAttrList").val(attrFilterFrmMap);
		}else{
			var attrArr = attrList.split("~");
			var buildAttr = "";
			var c = "";
			var isBuild = false;
			for(i=0;i<attrArr.length;i++)
			{
				var valArr = attrArr[i].split(":");

				if(valArr[0] == key)
				{
					buildAttr = buildAttr + c + attrArr[i] +"|"+val;
					isBuild = true;
				}else{
					buildAttr = buildAttr + c + attrArr[i];
				}

				c = "~";
			}
			if(!isBuild){
				buildAttr = buildAttr + "~" + attrFilterFrmMap;
			}
			jQuery("#multiFilterAttrList").val(buildAttr);
		}
     	console.log(jQuery("#multiFilterAttrList").val());
     	jQuery("#multiFilterAttr").submit();	
	}
function appendSearchByCheckBox(id){
	var chks = jQuery("input:checkbox[name='"+id+"']:checked");
	var key = "";
	var val = ""
		var c = "";
	if(chks.length>0){
		chks.each(function(){
			var tId = jQuery(this).attr("id");
			key = jQuery("#"+tId+"_div").text();
			val = val+ c + '"'+unescape(jQuery("#"+tId+"_span").text())+'"';
			c = "|";
		});
		appendSearch(key,val)
	}else{
		bootAlert("small","error","Error","Please select an attribute to filter.");
	}
}
function appendSearch(key,val){
	val = val.replace(/\+/g," ");
	if(key=="Brands")
		key = "brand";
	if(key=="Category")
		key = "category";
	if(key=="Manufacturer")
		key = "manufacturerName";
	key = "attr_"+key;
	var attrList = jQuery("#attrFilterList").text();
	var keyText = jQuery("#keyWordTxtTrail").text();
	if(jQuery.trim(keyText)!=""){
		jQuery("#keyWordTxtMulti").val(keyText);
	}
	if(jQuery.trim(attrList)==""){
		jQuery("#multiFilterAttrList").val(key+":"+val);
	}else{
		var attrArr = attrList.split("~");
		var buildAttr = "";
		var c = "";
		var isBuild = false;
		for(i=0;i<attrArr.length;i++){
			var valArr = attrArr[i].split(":");
			if(valArr[0] == key){
				buildAttr = buildAttr + c + attrArr[i] +"|"+val;
				isBuild = true;
			}else{
				buildAttr = buildAttr + c + attrArr[i];
			}
			c = "~";
		}
		if(!isBuild)
			buildAttr = buildAttr + "~" + key+":"+val;
	jQuery("#multiFilterAttrList").val(buildAttr);
	}
	jQuery("#multiFilterAttr").submit();
}
function changeListtoGrid(){
	var width = $(window).width();
	if(width <= 980){
		$("[data-getchangemode='getchangemode']").removeClass('listView').addClass('gridView'); 
		setCookie('pagemode', 'gridView');
		$("#listView").show();
		$("#gridView").hide();
		$('.productModeItemsDiv').hide();
	}
}
function changemode(){
	var checkmode = $("[data-getchangemode='getchangemode']").attr('class');
	if(checkmode == "listView"){
		$("[data-getchangemode='getchangemode']").each(function(){
			$(this).removeClass('listView').addClass('gridView');
			$(".listViewIcon").attr("onclick","changemode()");
			$(".gridViewIcon").removeAttr("onclick");
			$(".gridViewIcon").addClass('active');
			$(".listViewIcon").removeClass('active');	
		});		
		setCookie('pagemode', 'gridView');
	}
	if(checkmode == "gridView"){
		$("[data-getchangemode='getchangemode']").each(function(){
			$(this).removeClass('gridView').addClass('listView');
			$(".listViewIcon").removeAttr("onclick");
			$(".gridViewIcon").attr("onclick","changemode()");				
			$(".listViewIcon").addClass('active');
			$(".gridViewIcon").removeClass('active');
		});		
		setCookie('pagemode', 'listView');
	}
	$('.productModeItemsDiv').hide();
}
function previouslyPurchased(){
	var isPreviouslyPurchased = "";
	var url = window.location.href;
	if($('input[name="previouslyPurchased"]:checked').length > 0){
		isPreviouslyPurchased = "Y";
		url = removeParam("isPreviouslyPurchased", url)
		if(url.indexOf("?") !== -1){	
	    	url = url + '&isPreviouslyPurchased='+isPreviouslyPurchased;
		}
		else{
			url = url + '?isPreviouslyPurchased='+isPreviouslyPurchased;
		}
		window.location.href = url;
		setCookie('isPreviouslyPurchased','Y',14);
	}else{
		url = removeParam("isPreviouslyPurchased", url)
		window.location.href = url;
	}
}
function clearanceItems(){
	var isClearanceItems = "";
	var url = window.location.href;
	if($('input[name="clearanceItems"]:checked').length > 0){
		isClearanceItems = "Y";
		url = removeParam("clearanceItems", url)
		if(url.indexOf("?") !== -1){	
	    	url = url + '&clearanceItems='+isClearanceItems;
		}
		else{
			url = url + '?clearanceItems='+isClearanceItems;
		}
		window.location.href = url;
		setCookie('clearanceItems','Y',14);
	}else{
		url = removeParam("clearanceItems", url)
		window.location.href = url;
	}
}
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    setCookie(key,"",-1);
    return rtn;
}

function sortByRationalValue(a, b) {
    return a.rationalValue - b.rationalValue;
}

function returnObjectFromMeasurements(element, text){
	try{
		var obj = {},
		range = text.replace(/["'ÃƒÂ¢Ã‚â‚¬Ã‚ï¿½?]/g, '').split('-'),rational;
		var isEval = true;
		if (range.length > 1) {
			try{
				eval(range[1]);
			}catch (e){
				isEval = false;
			}
			if(isEval){
				rational = eval(range[0]) + eval(range[1]);
			}else{
				rational = eval(range[0]);
			}
		}else{
			try{
				eval(range[0]);
			}catch(e){
				isEval = false;
			}
			if(isEval)
				rational = eval(range[0]);
		}
		obj.rationalValue = rational;
		obj.element = element;
	}catch(e){
		console.log(e);
	}
	return obj;
}
buildSearchTrail();
checkItem();
$(document).ready(function(){
	var url = window.location.href;
	if(url.indexOf("isPreviouslyPurchased=Y") !== -1){
		$('#previouslyPurchased').attr('checked', true);
	} 
	else{
		$('#previouslyPurchased').attr('checked',false);
	}
	$(".sortByNumbers").each(function(index, element) {
	    var els = new Array();
	    var counter = 0;
	    var children = jQuery(element).children();
	    jQuery(children).each(function(index, ele) {
	        els[index] = returnObjectFromMeasurements(ele, $(ele).find("i").text());
	    });
	    els.sort(sortByRationalValue);
	    var elements = new Array();
	    jQuery.each(els, function(index, value) {
	        elements[index] = value.element;
	    });
	    jQuery(this).html(elements);
	});
	var viewMode = getCookie("pagemode");
	if(viewMode == "listView"){
		/*$("#listView").hide();
		$("#gridView").show();*/
		$(".listViewIcon").removeAttr("onclick");
		$(".gridViewIcon").attr("onclick","changemode()");
		$(".listViewIcon").addClass('active');
		$(".gridViewIcon").removeClass('active');
	}else{
		/*$("#listView").show();
		$("#gridView").hide();*/
		$(".gridViewIcon").removeAttr("onclick");
		$(".listViewIcon").attr("onclick","changemode()");
		$(".gridViewIcon").addClass('active');
		$(".listViewIcon").removeClass('active');
	}
	if(viewMode == null){
		/*$("#listView").show();
		$("#gridView").hide();*/
		$(".listViewIcon").removeAttr("onclick");
		$(".gridViewIcon").attr("onclick","changemode()");	
		$(".listViewIcon").addClass('active');
		$(".gridViewIcon").removeClass('active');
	}else{
		var checkmode1 = $("[data-getchangemode='getchangemode']").attr('class');
		$("[data-getchangemode='getchangemode']").each(function(){
			$(this).removeClass(checkmode1).addClass(viewMode);
		});
	}
	ProductMode.loadPriceInDataTable();
	//disableCustomCheckbox();
	priceLoadMainFunction();
	changeListtoGrid();
	chkLeftMenu();
	setTimeout(function(){
		$("#filterBar .chosen-container .chosen-single span").attr('onchange','changeAdvSearchLeftMenu()');
	},3500);
});
$(window).resize(function(){
	changeListtoGrid();
	chkLeftMenu();
});
function validateSearchWithIn(){
	var s = $('#keyWordTxt').val();
	if(s == "" || s=="Search Within" || s=="Search%20With%20In" || s.indexOf("Search Within") > -1){
		bootAlert("small","error","Error","Enter a keyword to Search Within the list.");
		return false;
	}else{
		$('#keyWord').val($.trim(s));
		$('#keyWordTxt').val($.trim(replaceNonAscii(s)));
		$('#searchForm').submit();
	}
}
function chkLeftMenu(){
	var width = $(window).innerWidth();
	var leftMenu = '';
	if(width > 980){
		if($("#leftMenu").html().trim() == ""){
			leftMenu = $(".cimm_leftMenuEnclosure").detach();
			leftMenu.appendTo("#leftMenu");
		}
		$("#slideLeft").removeClass("active");
	}else{
		if($("#slideLeft").html().trim() == ""){
			leftMenu = $(".cimm_leftMenuEnclosure").detach();
			leftMenu.appendTo("#slideLeft");
		}
	}
}
function closeLeftSlide(){
	$("#slideLeft").removeClass("active");
	$("html").removeClass("poppupEnabled");
}
$('[data-function="slideLeft"]').click(function(){
	$("#slideLeft").addClass("active");
	$("html").addClass("poppupEnabled");
});