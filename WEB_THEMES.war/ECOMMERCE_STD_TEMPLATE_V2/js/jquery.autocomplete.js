/*
 * Autocomplete - jQuery plugin 1.1pre
 *
 * Copyright (c) 2007 Dylan Verheul, Dan G. Switzer, Anjesh Tuladhar, J&#65533;&#65533;rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: Id: jquery.autocomplete.js 5785 2008-07-12 10:37:33Z joern.zaefferer $
 *
 */
var autoCompleteTable  = new Hashtable();
var dataListObj =  new Hashtable();
var autoCompleteVersion = "";
if($("#autoCompleteDesignVersion").length>0){
	autoCompleteVersion = $("#autoCompleteDesignVersion").val().toUpperCase();
}
;(function($) {
	
$.fn.extend({
	autocomplete: function(urlOrData, options) {
		var isUrl = typeof urlOrData == "string";
		options = $.extend({}, $.Autocompleter.defaults, {
			url: isUrl ? urlOrData : null,
			data: isUrl ? null : urlOrData,
			delay: isUrl ? $.Autocompleter.defaults.delay : 10,
			max: options && !options.scroll ? 20 : 150
		}, options);
		
		// if highlight is set to false, replace it with a do-nothing function
		options.highlight = options.highlight || function(value) { return value; };
		
		// if the formatMatch option is not specified, then use formatItem for backwards compatibility
		options.formatMatch = options.formatMatch || options.formatItem;
		
		return this.each(function() {
			new $.Autocompleter(this, options);
		});
	},
	result: function(handler) {
		return this.bind("result", handler);
	},
	search: function(handler) {
		return this.trigger("search", [handler]);
	},
	flushCache: function() {
		return this.trigger("flushCache");
	},
	setOptions: function(options){
		return this.trigger("setOptions", [options]);
	},
	unautocomplete: function() {
		return this.trigger("unautocomplete");
	}
});

$.Autocompleter = function(input, options) {

	var KEY = {
		UP: 38,
		DOWN: 40,
		DEL: 46,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		COMMA: 188,
		PAGEUP: 33,
		PAGEDOWN: 34,
		BACKSPACE: 8
	};

	// Create $ object for input element
	var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);

	var timeout;
	var previousValue = "";
	var cache = $.Autocompleter.Cache(options);
	var hasFocus = 0;
	var lastKeyPressCode;
	var config = {
		mouseDownOnSelect: false
	};
	var select = $.Autocompleter.Select(options, input, selectCurrent, config);
	
	var blockSubmit;
	
	// prevent form submit in opera when selecting with return key
	$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
		if (blockSubmit) {
			blockSubmit = false;
			return false;
		}
	});
	
	// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
	$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
		// track last key pressed
		lastKeyPressCode = event.keyCode;
		switch(event.keyCode) {
		
			case KEY.UP:
				event.preventDefault();
				if ( select.visible() ) {
					select.prev();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.DOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.next();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEUP:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageUp();
				} else {
					onChange(0, true);
				}
				break;
				
			case KEY.PAGEDOWN:
				event.preventDefault();
				if ( select.visible() ) {
					select.pageDown();
				} else {
					onChange(0, true);
				}
				break;
			
			// matches also semicolon
			case options.multiple && $.trim(options.multipleSeparator) == "," && KEY.COMMA:
			case KEY.TAB:
			case KEY.RETURN:
				if( selectCurrent() ) {
					// stop default to prevent a form submit, Opera needs special handling
					event.preventDefault();
					blockSubmit = true;
					return false;
				}
				break;
				
			case KEY.ESC:
				select.hide();
				break;
				
			default:
				clearTimeout(timeout);
				timeout = setTimeout(onChange, options.delay);
				break;
		}
	}).focus(function(){
		// track whether the field has focus, we shouldn't process any
		// results if the field no longer has focus
		hasFocus++;
	}).blur(function() {
		hasFocus = 0;
		if (!config.mouseDownOnSelect) {
			hideResults();
		}
	}).click(function() {
		// show select when clicking in a focused field
		if ( hasFocus++ > 0 && !select.visible() ) {
			onChange(0, true);
		}
	}).bind("search", function() {
		// TODO why not just specifying both arguments?
		var fn = (arguments.length > 1) ? arguments[1] : null;
		function findValueCallback(q, data) {
			var result;
			if( data && data.length ) {
				for (var i=0; i < data.length; i++) {
					if( data[i].result.toLowerCase() == q.toLowerCase() ) {
						result = data[i];
						break;
					}
				}
			}
			if( typeof fn == "function" ) fn(result);
			else $input.trigger("result", result && [result.data, result.value]);
		}
		$.each(trimWords($input.val()), function(i, value) {
			request(value, findValueCallback, findValueCallback);
		});
	}).bind("flushCache", function() {
		cache.flush();
	}).bind("setOptions", function() {
		$.extend(options, arguments[1]);
		// if we've updated the data, repopulate
		if ( "data" in arguments[1] )
			cache.populate();
	}).bind("unautocomplete", function() {
		select.unbind();
		$input.unbind();
		$(input.form).unbind(".autocomplete");
	});
	
	
	function selectCurrent() {
		//consolor.log("Inside Select");
		var selected = select.selected();
		if( !selected )
			return false;
		
		var v = jQuery.trim(selected.value);
		previousValue = v;
		
		if ( options.multiple ) {
			var words = trimWords($input.val());
			if ( words.length > 1 ) {
				v = words.slice(0, words.length - 1).join( options.multipleSeparator ) + options.multipleSeparator + v;
			}
			v += options.multipleSeparator;
		}
		
		$input.val(v);
		hideResultsNow();
		var val = selected.codeId;
			var dataVal = jQuery.trim(selected.value);
		if(selected.category=="brand" || selected.category=="brandFuzzy"){
			dataVal = dataVal.split(" ").join("-");
			window.location.href='/'+val+'/brand/'+dataVal.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
		}else if(selected.category=="category" || selected.category=="catFuzzy"){
			
			dataVal = dataVal.split(" ").join("-");
			window.location.href='/'+val+'/category/'+dataVal.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
		}else if(selected.category=="item"){
			dataVal = dataVal.split(" ").join("-");
			itemDetailPage(val,dataVal);
		}else{
			return false;
		}
		console.log("selected : " + selected.data + " - " + selected.value);
		$input.trigger("result", [selected.data, selected.value]);
		return true;
	}
	
	function itemDetailPage(itemId,displaylabel){
	var result = displaylabel.replace(/ /g, "_");
	console.log(itemId+"/product/n/"+result.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-"));
	 $.ajax({
		   type: "POST",
		   url: "getItemPriceIdByItemIdPage.action",
		   data: "itemID="+itemId,
		   success: function(response){
			   window.location.href = $("base").attr("href")+response+"/product/n/"+result.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
			   
		   }});
	 
	 
	}
	function addtoCartAutoComplete(itemId,displaylabel){
		var result = displaylabel.replace(/ /g, "_");
		console.log(itemId+"/product/n/"+result.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-"));
		 $.ajax({
			   type: "POST",
			   url: "getItemPriceIdByItemIdPage.action",
			   data: "itemID="+itemId,
			   success: function(response){
				   window.location.href = $("base").attr("href")+response+"/product/n/"+result.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
				   
			   }});
		 
		 
	}
	function onChange(crap, skipPrevCheck) {
		if( lastKeyPressCode == KEY.DEL ) {
			select.hide();
			return;
		}
		//var currentValue = $.input.val();
		var currentValue = $('#txtSearch').val();
		if(currentValue != undefined && currentValue!=""){
			currentValue = $.trim(currentValue);
			currentValue = currentValue.replace(/</g, "<&nbsp;");
			currentValue = replaceNonAscii(currentValue);
			//currentValue = escape(currentValue);
			currentValue = currentValue.replace('\u00AE', '&reg;');
			currentValue = currentValue.replace(/#/g, "%23");
			currentValue = currentValue.replace(/&/g, "%26");
			currentValue = currentValue.replace(/;/g, "%3B");
			currentValue = currentValue.replace(/\?/g,"%3F");
			currentValue = currentValue.replace(/=/g,"%3D");
			currentValue = currentValue.replace(/@/g,"%40");
			currentValue = currentValue.replace("*","");
			currentValue = currentValue.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '') ;
		}
		if ( !skipPrevCheck && currentValue == previousValue ){
			return;
		}
		previousValue = currentValue;
		currentValue = lastWord(currentValue);
		if ( currentValue.length >= options.minChars) {
			$input.addClass(options.loadingClass);
			if (!options.matchCase)
				currentValue = currentValue.toLowerCase();
			request(currentValue, receiveData, hideResultsNow);
		}/* else {
			if($("#trendingSearch") && $("#trendingSearch").val() == "Y"){
				loadTrending();
			}
			stopLoading();
			select.hide();
		}*/
	};
	
	function loadTrending(){
		if($(".ac_trending").length < 1){
			$("#search_Form").parent().append("<div class='ac_trending'></div>");
		}
		if($(".ac_trending").html().trim() == ""){
			$(".ac_trending").html("Loading...");
			$.get("TrendingSearchSuggestion.slt", function(data, status){
				var tendData = JSON.parse(data);
				var list = $(".ac_trending");
				list.empty();
				dataListObj =  new Hashtable();
				var max = tendData.data.length;
				var prodWrap = $('<ul/>');
				var li;
				$("<li/>").html('<em class="fa fa-lg fa-line-chart" aria-hidden="true"></em> Popular Searches').addClass("ac_heading").appendTo(prodWrap)[0];
				for (var i=0; i < max; i++) {
					if (!data[i])
						continue;
	
					li = $("<li/>").html('<a href="/searchPage.action?keyWord='+tendData.data[i].searchedKeyword.trim()+'">'+tendData.data[i].searchedKeyword+'</a>').addClass(i%2 == 0 ? "ac_even" : "ac_odd").attr("data-value",tendData.data[i].searchedKeyword).appendTo(prodWrap)[0];
				}
				$(prodWrap).appendTo(list)[0];
			});
		}else{
			$(".ac_trending").show()
		}
	}
	function trimWords(value) {
		if ( !value ) {
			return [""];
		}
		var words = value.split( options.multipleSeparator );
		var result = [];
		$.each(words, function(i, value) {
			if ( $.trim(value) )
				result[i] = $.trim(value);
		});
		return result;
	}
	
	function lastWord(value) {
		if ( !options.multiple )
			return value;
		var words = trimWords(value);
		return words[words.length - 1];
	}
	
	// fills in the input box w/the first match (assumed to be the best match)
	// q: the term entered
	// sValue: the first matching result
	function autoFill(q, sValue){
		// autofill in the complete box w/the first match as long as the user hasn't entered in more data
		// if the last user key pressed was backspace, don't autofill
		if( options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE ) {
			// fill in the value (keep the case the user has typed)
			$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
			// select the portion of the value not typed by the user (so the next character will erase)
			$.Autocompleter.Selection(input, previousValue.length, previousValue.length + sValue.length);
		}
	};

	function hideResults() {
		clearTimeout(timeout);
		timeout = setTimeout(hideResultsNow, 200);
		hideTrendResultsNow();
	};
	function hideTrendResultsNow(){
		$(".ac_trending").fadeOut(300);
	}
	function hideResultsNow() {
		var wasVisible = select.visible();
		select.hide();
		clearTimeout(timeout);
		stopLoading();
		if (options.mustMatch) {
			// call search and run callback
			$input.search(
				function (result){
					// if no value found, clear the input box
					if( !result ) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val( words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : "") );
						}
						else
							$input.val( "" );
					}
				}
			);
		}
		if (wasVisible)
			// position cursor at end of input field
			$.Autocompleter.Selection(input, input.value.length, input.value.length);
	};

	function receiveData(q, data) {
		if ( data && data.length && hasFocus ) {
			stopLoading();
			select.display(data, q);
			autoFill(q, data[0].value);
			select.show();
		} else {
			hideResultsNow();
		}
	};

	function request(term, success, failure) {
		if (!options.matchCase)
			term = term.toLowerCase();
		var data = cache.load(term);
		data = null; // Avoid buggy cache and go to Solr every time 
		// recieve the cached data
		if (data && data.length) {
			success(term, data);
		// if an AJAX url has been supplied, try loading the data now
		} else if( (typeof options.url == "string") && (options.url.length > 0) ){
			
			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});
			
			$.ajax({
				// try to leverage ajaxQueue plugin to abort previous requests
				mode: "abort",
				// limit abortion to this input
				port: "autocomplete" + input.name,
				dataType: options.dataType,
				url: options.url,
				data: $.extend({
					q: lastWord(term),
					limit: options.max
				}, extraParams),
				success: function(data) {
					
					var parsed = options.parse && options.parse(data) || parse(data);
					cache.add(term, parsed);
					success(term, parsed);
				}
			});
		} else {
			// if we have a failure, we need to empty the list -- this prevents the the [TAB] key from selecting the last successful match
			select.emptyList();
			failure(term);
		}
	};
	
	function parse(msg) {
		
		autoCompleteTable  = new Hashtable();
		//console.log(JSON.parse(msg));
		console.log(msg);
		//msg = JSON.parse(msg);
		loadedId = "";
		var parsed = [];
		
		
		 loadsuggestion(parsed,msg);
		// loadUserGroup(parsed,msg);
console.log(parsed);
		return parsed;
	};

	function loadUserGroup(parsed,msg){
		console.log("getting user data");
			var id = "suggestData_";
			 
			var dataList = msg.facet_counts.facet_fields.userId_savedListName;
			var splitData;
			var numFound = dataList.length;
			console.log("User Data ");
			console.log(dataList);
			if(numFound>0){
				
			var dataLength = dataList.length;
			if(dataLength>10)
				dataLength = 10;
				for (var i=0;i< dataLength;i+=2) {
					jsonUserData = {};
					console.log(dataList[i]);
					splitData = dataList[i].split("_");
				
					
					var originalData = splitData[1];
					var valIndex = 0;
					var labelVal =  splitData[1];
					row =  splitData[1].split("/*/");
					
					if(row.length>1){
						valIndex = row.length;
						labelVal = ''+row[valIndex-1] +' in ' + row[0];
					}
					parsed[parsed.length] = {
						data: row,
						value:  splitData[1],
						lable: labelVal,
						dataId: "userData6_"+i,
						originalval:originalData,
						category:"userFuzzy",
						image: imageName,
						result:  splitData[1]
					};
					console.log("Fuzzyyyyy : " +  splitData[1]);
				
						
				}
			
					    
			}
		return parsed;
		
	};
	function loadsuggestion(parsed,msg){
		
		$("#autoSuggestData").html("");
		
		var j = 0;
		var keyList = getKeyList(msg);

		for (j=0;j<keyList.length;j++) {
			   console.log(' name=' + keyList[j] );
			var buildTable = false, itemImage = false;   
			var id = "suggestData_";
			var imageName = "";
			   if(keyList[j]=="category" || keyList[j]=="catFuzzy"){
				   buildTable = true;
				   id = "catData_";
			   }
			   
			    if(keyList[j]=="brand"){
				   buildTable = true;
				   id = "brandData_";
			   }
			    if(keyList[j]=="item"){
			    	itemImage = true;
			    }
			var innerObj = msg.response.docs[keyList[j]];
			if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
				var key = Object.keys(innerObj); 
				var dataObj = innerObj;
				var numFound = dataObj.length;
				var dataList = innerObj;
					if(numFound>0){
						
					var dataLength = numFound;
					if(dataLength>5)
						dataLength = 5;
						for (var i=0;i< dataLength;i++) {
							
							var row = $.trim(dataList[i].displaylabel).replace(/<\/?[^>]+(>|$)/g, "");
							var dataCodeId = dataList[i].codeId;
							if(itemImage){
								imageName = dataList[i].imageName;
							}
							if(buildTable){
								dataCodeId = dataList[i].codeId;
								
								var categoryDesc = "";
								if(typeof dataList[i].categoryDesc!='undefined')
									categoryDesc = dataList[i].categoryDesc;
								
								if(typeof dataList[i].imageName!='undefined')
									imageName = dataList[i].imageName;
								
								var categoryData = dataCodeId + "|" + imageName + "|" + categoryDesc + "|" + dataList[i].displaylabel;
								
								autoCompleteTable.put(id+j+"_"+i,categoryData);
							}
							var dataval = "";
							if (row) {
								var originalData = row;
								var valIndex = 0;
								var labelVal = row[0];
								row = row.split(">");
								labelVal = row[0];
								dataval = row[0];
								if(row.length>1){
									valIndex = row.length;
									labelVal = ''+row[valIndex-1] +' in ' + row[0];
									dataval = row[valIndex-1];
								}
								
								if(keyList[j]=="item"){
									dataval = dataList[i].brand+" "+dataList[i].manfpartnumber;
								}
								
								parsed[parsed.length] = {
									data: row,
									value: dataval,
									lable: labelVal,
									dataId: id+j+"_"+i,
									codeId: dataCodeId,
									originalval:originalData,
									category:keyList[j],
									image: imageName,
									result: row[0]
								};
							}
						}
					}
			}
		
		}
		
	};
	function stopLoading() {
		$input.removeClass(options.loadingClass);
	};

	function getKeyList(msg){
		var objArray = "";
		var sep = "";
			var innerObj = msg.response.docs.category;
			 if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
				 	var key = Object.keys(innerObj); 
					var dataObj = innerObj
					var numFound = innerObj.length;
					
					if(numFound > 0 ){
						objArray = objArray + sep + "category";
						sep = ",";
					}
					innerObj = msg.response.docs.brand;
					if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
						key = Object.keys(innerObj); 
						dataObj = innerObj
						numFound = dataObj.length;
						
						if(numFound > 0 ){
							objArray = objArray + sep + "brand";
							sep = ",";
						}
					}
					
					innerObj = msg.response.docs.item;
					if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
						key = Object.keys(innerObj); 
						dataObj = innerObj
						numFound = dataObj.length;
						
						if(numFound > 0 ){
							objArray = objArray + sep + "item";
							sep = ",";
						}
					}
			 }else{
				 var innerObj = msg.response.docs.brand;
				 if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
					 	var key = Object.keys(innerObj); 
						var dataObj = innerObj
						var numFound = innerObj.length;
						
						if(numFound > 0 ){
							objArray = objArray + sep + "brand";
							sep = ",";
						}
						
						innerObj = msg.response.docs.item;
						if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
							key = Object.keys(innerObj); 
							dataObj = innerObj
							numFound = dataObj.length;
							
							if(numFound > 0 ){
								objArray = objArray + sep + "item";
								sep = ",";
							}
						}
				 }else{
					 var innerObj = msg.response.docs.item;
					 if(typeof innerObj!='undefined' && innerObj!=null  && innerObj!=""){
						 	var key = Object.keys(innerObj); 
							var dataObj = innerObj
							var numFound = innerObj.length;
							
							if(numFound > 0 ){
								objArray = objArray + sep + "item";
								sep = ",";
							}
					 }
				 }
			 }
			return objArray.split(",");
	};
};

$.Autocompleter.defaults = {
	inputClass: "ac_input",
	resultsClass: "ac_results",
	loadingClass: "ac_loading",
	minChars: 1,
	delay: 400,
	matchCase: false,
	matchSubset: true,
	matchContains: false,
	cacheLength: 10,
	max: 100,
	mustMatch: false,
	extraParams: {},
	selectFirst: false,
	formatItem: function(row) { return row[0]; },
	formatMatch: null,
	autoFill: false,
	width: 0,
	multiple: false,
	multipleSeparator: ", ",
	highlight: function(value, term) {
		return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
	},
    scroll: false,
    scrollHeight: 232
};

$.Autocompleter.Cache = function(options) {

	var data = {};
	var length = 0;
	
	function matchSubset(s, sub) {
		if (!options.matchCase) 
			s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (options.matchContains == "word"){
			i = s.toLowerCase().search("\\b" + sub.toLowerCase());
		}
		if (i == -1) return false;
		return i == 0 || options.matchContains;
	};
	
	function add(q, value) {
		if (length > options.cacheLength){
			flush();
		}
		if (!data[q]){ 
			length++;
		}
		data[q] = value;
	}
	
	function populate(){
		if( !options.data ) return false;
		// track the matches
		var stMatchSets = {},
			nullData = 0;

		// no url was specified, we need to adjust the cache length to make sure it fits the local data store
		if( !options.url ) options.cacheLength = 1;
		
		// track all options for minChars = 0
		stMatchSets[""] = [];
		
		// loop through the array and create a lookup structure
		for ( var i = 0, ol = options.data.length; i < ol; i++ ) {
			var rawValue = options.data[i];
			// if rawValue is a string, make an array otherwise just reference the array
			rawValue = (typeof rawValue == "string") ? [rawValue] : rawValue;
			
			var value = options.formatMatch(rawValue, i+1, options.data.length);
			if ( value === false )
				continue;
				
			var firstChar = value.charAt(0).toLowerCase();
			// if no lookup array for this character exists, look it up now
			if( !stMatchSets[firstChar] ) 
				stMatchSets[firstChar] = [];

			// if the match is a string
			var row = {
				value: value,
				data: rawValue,
				result: options.formatResult && options.formatResult(rawValue) || value
			};
			
			// push the current match into the set list
			stMatchSets[firstChar].push(row);

			// keep track of minChars zero items
			if ( nullData++ < options.max ) {
				stMatchSets[""].push(row);
			}
		};

		// add the data items to the cache
		$.each(stMatchSets, function(i, value) {
			// increase the cache size
			options.cacheLength++;
			// add to the cache
			add(i, value);
		});
	}
	
	// populate any existing data
	setTimeout(populate, 25);
	
	function flush(){
		data = {};
		length = 0;
	}
	
	return {
		flush: flush,
		add: add,
		populate: populate,
		load: function(q) {
			if (!options.cacheLength || !length)
				return null;
			/* 
			 * if dealing w/local data and matchContains than we must make sure
			 * to loop through all the data collections looking for matches
			 */
			if( !options.url && options.matchContains ){
				// track all matches
				var csub = [];
				// loop through all the data grids for matches
				for( var k in data ){
					// don't search through the stMatchSets[""] (minChars: 0) cache
					// this prevents duplicates
					if( k.length > 0 ){
						var c = data[k];
						$.each(c, function(i, x) {
							// if we've got a match, add it to the array
							if (matchSubset(x.value, q)) {
								csub.push(x);
							}
						});
					}
				}				
				return csub;
			} else 
			// if the exact item exists, use it
			if (data[q]){
				return data[q];
			} else
			if (options.matchSubset) {
				for (var i = q.length - 1; i >= options.minChars; i--) {
					var c = data[q.substr(0, i)];
					if (c) {
						var csub = [];
						$.each(c, function(i, x) {
							if (matchSubset(x.value, q)) {
								csub[csub.length] = x;
							}
						});
						return csub;
					}
				}
			}
			return null;
		}
	};
};

$.Autocompleter.Select = function (options, input, select, config) {
	var ajaxCall;
	var CLASSES = {
		ACTIVE: "ac_over"
	};
	
	var listItems,
		active = -1,
		data,
		term = "",
		needsInit = true,
		element,
		list;
	
	// Create results
	function init() {
		if (!needsInit)
			return;
		element = $("<div/>")
		.hide()
		.addClass(options.resultsClass)
		.appendTo(".cimm_searchWrapper");
	
		if(autoCompleteVersion == "V2"){
			wrapEl = "<div/>"
		}else{
			wrapEl = "<ul/>"
		}
		list = $(wrapEl).appendTo(element).mouseover( function(event) {
			if(target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI' && !target(event).classList.contains("ac_over") && !target(event).classList.contains("suggest")) {
	            active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
				console.log(active);
			    $(target(event)).addClass(CLASSES.ACTIVE); 
			    console.log("load fly out : " + $(target(event)).attr("id"));
			    if(typeof $(target(event)).attr("id")!='undefined' && $(target(event)).attr("id")!=null  && $(target(event)).attr("id")!=""){
			    	$(this).find("li.suggest").removeClass("hideSuggest");
				    $(this).find("li.suggest").removeClass(CLASSES.ACTIVE);
					 if($("li.suggest").removeClass("hideSuggest")){
				    	$(this).parent(".ac_results").find("ul").addClass("ac_resultCat");
				    }	
				    loadFlyout($(target(event)));
				    console.log(jQuery.data($(target(event)),"ac_data"));
				    $(this).find("li.catheader").removeClass(CLASSES.ACTIVE);
				    
				   	   
				    $('input#q').keyup(function(e){
					    if(e.keyCode == 8 && $(this).val().length == 0){
					    		 $(this).parent(".cimm_searchWrapper").find(".ac_results ul").removeClass("ac_resultCat");
					    }
				    });
			    }
	        }	
		}).click(function(event) {
			if(event.target.nodeName && event.target.nodeName.toUpperCase() == 'LI') {
				$(target(event)).addClass(CLASSES.ACTIVE);
				select();
				// TODO provide option to avoid setting focus again after selection? useful for cleanup-on-focus
				input.focus();
				return false;
			}
		}).mousedown(function() {
			config.mouseDownOnSelect = true;
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});
		
		if( options.width > 0 )
			element.css("width", options.width);
			
		needsInit = false;
	} 
	
	function target(event) {
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// more fun with IE, sometimes event.target is empty, just ignore it then
		if(!element)
			return [];
		return element;
	}

	function moveSelect(step) {
		console.log(active);
		if(active<0)
			active = 0;
		listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
		movePosition(step);
        var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
        //shashi
        console.log(activeItem.html());
        $(".suggest").removeClass("hideSuggest");
        loadFlyout(activeItem);
        if(options.scroll) {
            var offset = 0;
            listItems.slice(0, active).each(function() {
				offset += this.offsetHeight;
			});
            if((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
                list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight());
            } else if(offset < list.scrollTop()) {
                list.scrollTop(offset);
            }
        }
	};
	
	function movePosition(step) {
		active += step;
		if (active < 0) {
			active = listItems.size() - 1;
		} else if (active >= listItems.size()) {
			active = 0;
		}
	}
	
	function limitNumberOfItems(available) {
		return options.max && options.max < available
			? options.max
			: available;
	}
	
	function loadFlyout(obj){
		clearTimeout(ajaxCall);
		var loadData = true;
		if(obj.hasClass("suggest")){
			loadData = false;
		}
		if(obj.hasClass("catheader")){
			$(".suggest").addClass("hideSuggest");
			loadData = false;
		}
		
		if(typeof obj.attr("id")!='undefined' && obj.attr("id").indexOf("suggestData_")==0){
			console.log("Adding class");
			$(".suggest").attr("class","suggest hideSuggest");
			loadData = false;
		}
		
		console.log("loadData : " + loadData);
	if(loadData){
		console.log("inside suggest");
		if(!obj.hasClass("catheader")){
			loadedId = "";
		}
		
		if(loadedId!=obj.attr("id")){
			var contentId = obj.attr("id")+"_suggest";
			if($("#"+contentId).length > 0){
				 jQuery(".suggest").html($("#"+contentId).html());
			}else{
				jQuery(".suggest").html("loading.....");
				ajaxCall = setTimeout(loadFlyoutAjax, 100,obj);
			}
			
			}
	}
		
	}
	
	function categoryBuilder(obj){
		
		var val = autoCompleteTable.get(obj.attr("id"));
		var categoryDetail = val.split("|");
		var catDesc = categoryDetail[2];
		console.log(categoryDetail);
		var dataOriginal = categoryDetail[3];
		var dataArr = dataOriginal.split(">");
		var catPath = "";
		var c = "";
		for(i=0;i<dataArr.length-1;i++){
			catPath = catPath + c + dataArr[i];
			c = " > ";
		}
		console.log("dataOriginal : " + dataOriginal);
		var webThemes = $("#webThemePath").val();
		var catImage = categoryDetail[1].substring(0,4);
		var catBuilder = "";
		catBuilder = catBuilder+'<div class="autocomplete-cat">';
		catBuilder = catBuilder+'<div class="titleImg-container clearAfter">';
		if(catImage === "http"){
			catBuilder = catBuilder+'<img src="'+categoryDetail[1]+'" onerror=\'this.src="'+webThemes+'images/NoImage.png"\' alt="'+obj.data("value")+'" title="'+obj.data("value")+'">';
		}else{
			catBuilder = catBuilder+'<img src="'+assets+'/IMAGES/CATEGORIES/LIST_DISPLAY/'+categoryDetail[1]+'" onerror=\'this.src="'+webThemes+'images/NoImage.png"\' alt="'+obj.data("value")+'" title="'+obj.data("value")+'">';
		}
		catBuilder = catBuilder+'<div class="parent-title">'+catPath+'</div>';
		//catBuilder = catBuilder+'<a class="title" href="productmodel.unilog?id='+escape(categoryDetail[0])+'">'+obj.data("value")+'</a>';
		var finalUrl = escape(categoryDetail[0])+'/category/'+obj.data("value").replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
		catBuilder = catBuilder+'<a class="title" href="'+finalUrl+'">'+obj.data("value")+'</a>';
		catBuilder = catBuilder+'</div>';
		
		return catBuilder;
	}
	function loadFlyoutAjax(obj){
		loadedId=obj.attr("id");
		console.log("calling after 3 sec");
		console.log("object value : " + obj.data("value").replace('&','%26') + " - " + obj.data("reqtype"));
		jQuery(".suggest").html("Loading......");
		var reqId = obj.data("codeid")
		var queryString = "";
		if(obj.data("reqtype")=="BRAND"){
			queryString = "brandId="+reqId;
		}else if(obj.data("reqtype")=="CATNAV"){
			queryString = "codeId="+reqId;
		}
		
		 $.ajax({
			   type: "POST",
			   url: "itemSuggestAutoCompletePage.action",
			   data: 'srchTyp='+obj.data("reqtype")+'&queryString='+obj.data("value").replace('&','%26')+'&'+queryString,
			   success: function(msg){
				   if(obj.data("reqtype")=="CATNAV"){
						var catBuilder =  categoryBuilder(obj);
						var replaced = $.trim(obj.data("value")).split(' ').join('-');
						replaced = replaced.replace(/ /g,"-").toLowerCase().replace(/&#{0,1}[a-z0-9]+;/ig, "").replace(/[^A-Za-z0-9-]*/g, "").replace(/---/g,"-").replace(/--/g,"-");
						msg = catBuilder + msg;
						msg = msg+'</div>';
						jQuery(".suggest").html(msg);
						$('<a class="button" href="/'+reqId+'/category/'+replaced+'">Shop Category</a>').appendTo('.titleImg-container');
				   }else{
					   jQuery(".suggest").html(msg);
				   }
				   $("<div/>").attr("id",loadedId+"_suggest").html(msg).appendTo("#autoSuggestData");
				   
			   }	
			  });
		 
	}
	
	function fillList() {
		list.empty();
		$(".ac_trending").fadeOut(300);
		dataListObj =  new Hashtable();
		var isList =false;
		var max = limitNumberOfItems(data.length);
		var prevCat = "";
		var catWrap = $('<ul/>').addClass('catWrap');
		var prodWrap = $('<ul/>').addClass('prodWrap');
		var mfgWrap = $('<ul/>').addClass('mfgWrap');
		var li, searchBtn
		var count = 0;
		var webThemes = $("#webThemePath").val();
		if(autoCompleteVersion == "V2"){
			li = $("<li />").html('<em>Search for</em><br/> "<strong>'+unescape(term)+'"</strong> <i>in:</i>').appendTo(catWrap)[0];
			searchBtn = $("<a />").attr('href','searchPage.action?keyWord='+term).text('More Results');
		}
		for (var i=0; i < max; i++) {
			var header = "Suggestion";
			if (!data[i])
				continue;
			var reqType = 1;
			
			var formatted = options.formatItem(data[i].data, i+1, max, data[i].value, term);
			
			if ( formatted === false )
				continue;
			
			if(data[i].category=="brand" || data[i].category=="brandFuzzy"){
				header = "Brand";
				reqType = "BRAND";
			}
			
			if(data[i].category=="category" || data[i].category=="catFuzzy"){
				header = "Category";
				reqType = "CATNAV";
				
			}
			
			if(data[i].category=="userFuzzy"){
				header = "User Product Group";
				reqType = 3;
			}
			
			if(prevCat!=data[i].category){
				if(autoCompleteVersion == "V2"){
					if(data[i].category=="brand" || data[i].category=="brandFuzzy"){
						var liCat = $("<li/>").html(header ).addClass("catheader").appendTo(mfgWrap)[0];
						jQuery.data(liCat, "ac_data_cat", data[i]);
					}
				}else{
					var liCat = $("<li/>").html(header ).addClass("catheader").appendTo(list)[0];
					jQuery.data(liCat, "ac_data_cat", data[i]);
				}
			}
			
			
			
			if(autoCompleteVersion=="V2"){
				if(data[i].category=="category" || data[i].category=="catFuzzy"){
					li = $("<li/>").html( options.highlight(data[i].lable, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").attr("id",data[i].dataId).attr("data-value",data[i].value).attr("data-reqtype",reqType).attr("data-codeId",data[i].codeId).attr("data-type",data[i].category).attr("data-original",data[i].originalval).appendTo(catWrap)[0];
				}else if(data[i].category=="brand" || data[i].category=="brandFuzzy"){
					li = $("<li/>").html( options.highlight(data[i].lable, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").attr("id",data[i].dataId).attr("data-value",data[i].value).attr("data-reqtype",reqType).attr("data-codeId",data[i].codeId).attr("data-type",data[i].category).attr("data-original",data[i].originalval).appendTo(mfgWrap)[0];
				}else{
					if(count<4){
						var imageData = '';
						if(data[i].image){
							var catImage = data[i].image.substring(0,4);
							if(catImage === "http"){
								imageData = '<img src="'+data[i].image+'" onerror=\'this.src="'+webThemes+'images/NoImage.png"\' alt="'+data[i].image+'"/>';
							}else{
								imageData = '<img src="'+assets+'/IMAGES/ITEMS/DETAIL_PAGE/'+data[i].image+'" onerror=\'this.src="'+webThemes+'images/NoImage.png"\' alt="'+data[i].image+'"/>';
							}
						}else{
							imageData = '<img src="'+webThemes+'images/NoImage.png" alt="'+data[i].lable+'"/>';
						}
                        
                        li = $("<li/>").html(imageData + '<span>'+options.highlight(data[i].lable, term) +'</span>').addClass(i%2 == 0 ? "ac_even" : "ac_odd").attr("id",data[i].dataId).attr("data-value",data[i].value).attr("data-reqtype",reqType).attr("data-codeId",data[i].codeId).attr("data-type",data[i].category).attr("data-original",data[i].originalval).appendTo(prodWrap)[0];
                        count++;
					}
				}
			}else{
				li = $("<li/>").html( options.highlight(data[i].lable, term) ).addClass(i%2 == 0 ? "ac_even" : "ac_odd").attr("id",data[i].dataId).attr("data-value",data[i].value).attr("data-reqtype",reqType).attr("data-codeId",data[i].codeId).attr("data-type",data[i].category).attr("data-original",data[i].originalval).appendTo(list)[0];
			}
			console.log(li);
			jQuery.data(li, "ac_data", data[i]);
			console.log(jQuery.data(li, "ac_data"));
			jQuery.data(li, "ac_data", data[i]);
			dataListObj.put(data[i].dataId,data[i]);
			isList = true;
			prevCat = data[i].category;
		}
		if(autoCompleteVersion=="V2"){
			var dd = $('<div />').addClass('itemWraper');
			$(prodWrap).appendTo(dd)[0];
			$(mfgWrap).appendTo(dd)[0];
			$(searchBtn).appendTo(dd)[0];
			$(catWrap).appendTo(list)[0];
			$(dd).appendTo(list)[0];
		}else{
			if(isList){
				var li = $("<li/>").attr("class","suggest hideSuggest").html("loading...").appendTo(list)[0];
				//jQuery.data(li, "ac_data", "");
			}
		}
		listItems = list.find("li");
		if ( options.selectFirst ) {
			listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
			active = 0;
		}
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			list.bgiframe();
	}
	
	return {
		display: function(d, q) {
			init();
			data = d;
			term = q;
			fillList();
		},
		next: function() {
			moveSelect(1);
		},
		prev: function() {
			moveSelect(-1);
		},
		pageUp: function() {
			if (active != 0 && active - 8 < 0) {
				moveSelect( -active );
			} else {
				moveSelect(-8);
			}
		},
		pageDown: function() {
			if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
				moveSelect( listItems.size() - 1 - active );
			} else {
				moveSelect(8);
			}
		},
		hide: function() {
			element && element.hide();
			listItems && listItems.removeClass(CLASSES.ACTIVE);
			active = -1;
		},
		visible : function() {
			return element && element.is(":visible");
		},
		current: function() {
			return this.visible() && (listItems.filter("." + CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0]);
		},
		show: function() {
			var offset = $(input).offset();
			element.show();
            if(options.scroll) {
                list.scrollTop(0);
                list.css({
					maxHeight: options.scrollHeight,
					overflow: 'auto'
				});
				
                if($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
					var listHeight = 0;
					listItems.each(function() {
						listHeight += this.offsetHeight;
					});
					var scrollbarsVisible = listHeight > options.scrollHeight;
                    list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight );
					if (!scrollbarsVisible) {
						// IE doesn't recalculate width when scrollbar disappears
						listItems.width( list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")) );
					}
                }
                
            }
		},
		selected: function() {
			var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
			var liii = selected[0];
			return selected && selected.length && dataListObj.get(jQuery(liii).attr("id"));
		},
		emptyList: function (){
			list && list.empty();
		},
		unbind: function() {
			element && element.remove();
		}
	};
};

$.Autocompleter.Selection = function(field, start, end) {
	if( field.createTextRange ){
		var selRange = field.createTextRange();
		selRange.collapse(true);
		selRange.moveStart("character", start);
		selRange.moveEnd("character", end);
		selRange.select();
	} else if( field.setSelectionRange ){
		field.setSelectionRange(start, end);
	} else {
		if( field.selectionStart ){
			field.selectionStart = start;
			field.selectionEnd = end;
		}
	}
	field.focus();
};

})(jQuery);


(function() {

	var matched, browser;

//	Use of jQuery.browser is frowned upon.
//	More details: http://api.jquery.com/jQuery.browser
//	jQuery.uaMatch maintained for back-compat
	jQuery.uaMatch = function( ua ) {
		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};

	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

//	Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;

	jQuery.sub = function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	};

})();