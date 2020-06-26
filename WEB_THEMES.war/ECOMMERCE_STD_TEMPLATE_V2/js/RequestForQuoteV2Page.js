var webThemes = $("#webThemePath").val();
var wasMetaKeyPressed = false;
$.getScript(webThemes+'js/bootstrap-datepicker.min.js', function(){
	var savedOverrideShip = $('#savedOverrideShip').val();
	var savedState = $('#savedState').val(); 
	var date = new Date();
	var today = new Date();
	var savedDate = new Date();
	if($('#savedReqDate').length > 0 && $.trim($('#savedReqDate').val()).length>0){
		var savedDateString = $('#savedReqDate').val();
		var savedDateArray = savedDateString.split("/");
		savedDate.setFullYear(savedDateArray[2]);
		savedDate.setMonth(savedDateArray[0]-1);
		savedDate.setDate(savedDateArray[1]);
	}
	if(today >= savedDate){
		today.setDate(today.getDate() + 1);//Set's current date to following day
	}else{
		today.setFullYear(savedDate.getFullYear());
		today.setMonth(savedDate.getMonth());
		today.setDate(savedDate.getDate());
	}
	var dd = ('0' + today.getDate()).slice(-2);
	var mm = ('0' + (today.getMonth()+1)).slice(-2);
	var yyyy = today.getFullYear();
	$("#reqDate").attr("value",mm+'/'+dd+'/'+yyyy);
	$('#reqDate').datepicker({autoclose: true, startDate : (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()});
	if(savedOverrideShip=="Y"){
		$("#overrideShip").prop("checked",true);
		$("#overrideShip").val("Y");
		$('.shipToElementRow').each(function(){ if($(this).hasClass('hide')){ $(this).removeClass('hide');} });
		$('#shipToAddress').attr('disabled',true);
		$('#shipToAddress').attr('readonly', true);
		$('#shipToAddress').trigger("chosen:updated");
		$("#shipEntityId").val('');
		$("#defaultShipToId").val("0");
		$("#selectedBranch").val("");
		if(document.getElementById("shipCountry") && savedState.length >0){ 
			var countryName2A = new initCountry({ country: "US", selectorID: "shipCountry", defaultSelect: true }); 
			$("#shipState").val(savedState);
			$('#shipState').trigger("chosen:updated");
		}
		$('.selectpicker').selectpicker('refresh');
	}
	formatNumbers();
});
$(function () {
$('form').submit(function(){
	$('input[type=submit]').val("Please Wait...");
	$('input[type=submit]').attr('disabled', 'disabled');
});
});
function removeRow(){
	var index = $("#addNewRowCount").val();
	var rowCount = $('#reqForQuoteTableId tbody tr').length;
	var numberOfRecords = 10;
	if($("#numberOfRecords").length>0 && $("#numberOfRecords").val().length>0 && parseInt($("#numberOfRecords").val())>0){
		numberOfRecords = parseInt($("#numberOfRecords").val());
	}
	numberOfRecords = numberOfRecords+1;
	if(rowCount>numberOfRecords){
		$('#reqForQuoteTableId tr:nth-last-child(2)').remove();
		index = index-1;
		$("#addNewRowCount").val(index);
	}else{
		bootAlert("small","error","Error","Cannot remove default rows");
	}
	if(index < numberOfRecords && $('#removeRowBtn').is(":visible")){
		$('#removeRowBtn').hide();
	}
	return false;
}
function validateRFQV2(actinType){
	if($('#notificationDiv').length >0 ){ $('#notificationDiv').html(""); }
	var ITEMQTYARR = $("input[name='ITEMQTYARR']");
	var pn = $("input[name='PARTNUMARR']");
	var cpn = $("input[name='CPN']");
	var mpn = $("input[name='MPN']");
	var shortDesc = $("input[name='DESCARR']");
	var uom = $("input[name='UOM']");
	var linecomment = $("input[name='LINEITEMCMTARR']");
	var emailMsg = 0;
	var emailVal = "";
	var count=0;
	var orderBy = "";
	var overrideShip = $("#overrideShip").val();

	if($.trim($("#rfnpName").val())==""){
		emailVal = emailVal + "Please Enter Name.<br/>";
		emailMsg = 1;
	}else{
		orderBy = $.trim($("#rfnpName").val());
	}
	if(overrideShip=="Y"){
		if($("#shipAddress1").length>0 && $.trim($("#shipAddress1").val())<=0){
			emailVal = emailVal + "Please Enter Address1<br/>";
			emailMsg = 1;
		}else{
			$("#address1").val($("#shipAddress1").val());
		}
		
		$("#address2").val($("#shipAddress2").val());
		
		if($("#shipCity").length>0 && $.trim($("#shipCity").val())<=0){
			emailVal = emailVal + "Please Enter City<br/>";
			emailMsg = 1;
		}else{
			$("#city").val($("#shipCity").val());
		}
		
		if($("#shipState").length>0 && $.trim($("#shipState").val())<=0){
			emailVal = emailVal + "Please Select State<br/>";
			emailMsg = 1;
		}else{
			$("#state").val($("#shipState").val());
		}
		
		if($("#shipZipcode").length>0 && $.trim($("#shipZipcode").val())<=0){
			emailVal = emailVal + "Please Enter Zip Code<br/>";
			emailMsg = 1;
		}else{
			$("#zipCode").val($("#shipZipcode").val());
		}
		
		if($("#shipCountry").length>0 && $.trim($("#shipCountry").val())<=0){
			emailVal = emailVal + "Please Select Country<br/>";
			emailMsg = 1;
		}else{
			$("#country").val($("#shipCountry").val());
		}
		if($('#ecommShipToId').length>0 && $('#ecommShipToId').val().length>0){
			$("#selectedBranch").val($('#ecommShipToId').val()); 
		}
	}else{
		if($("#shipToAddress").length>0 && $.trim($("#shipToAddress").val())<=0){
			emailVal = emailVal + "Please Select/Enter Ship To Address<br/>";
			emailMsg = 1;
		}
	}
	if($.trim($("#rfnpPhone").val())==""){
		emailVal = emailVal + "Please Enter Phone Number.<br/>";
		emailMsg = 1;
	}else{
		if(isPhoneNumberValid($.trim($("#rfnpPhone").val()))==false){
			emailVal = emailVal + "Please Enter Valid Phone Number<br/>";
			emailMsg = 1;
		}
	}
	if($("#rfnpEmail").val()!=undefined){
		if($.trim($("#rfnpEmail").val())==""){
			emailVal = emailVal + "Please Enter Contact Email Address.<br />";
			emailMsg = 1;
		}else{
			var email = $.trim($("#rfnpEmail").val().toLowerCase());
			var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
			if (reg.test(email)){}
			else{
				emailVal = emailVal + "Please Enter Valid Email Address.<br />";
				emailMsg = 1;
			}
		}
	}
	var eitherOfOneFlag = false;
	var qtyFlag = false;
	var desFlag = false;
	var uomFlag = false;
	var eitherOfOneErrorLineNumber = "";
	var eitherOfOneLineNumberSep = "";
	var qtyErrorLineNumber = "";
	var qtyErrorLineNumberSep = "";
	var descErrorLineNumber = "";
	var descErrorLineNumberSep = "";
	var uomErrorLineNumber = "";
	var uomErrorLineNumberSep = "";
	
	for(i=0;i<=pn.length-1;i++){
		var checkResult = 0;
		if($.trim(pn[i].value)=="" && $.trim(cpn[i].value) =="" && $.trim(mpn[i].value)=="" && $.trim(shortDesc[i].value)==""){
			count++;
		}else{
			if(ITEMQTYARR[i].value==""){
				//ITEMQTYARR[i].value=1;
				var lineNo = i+1;
				qtyErrorLineNumber = qtyErrorLineNumber+qtyErrorLineNumberSep+lineNo;
				qtyErrorLineNumberSep = ", ";
				qtyFlag = true;
			}
			/*if($.trim(pn[i].value)=="" && $.trim(cpn[i].value) =="" && $.trim(mpn[i].value)==""){
				var lineNo = i+1;
				eitherOfOneErrorLineNumber = eitherOfOneErrorLineNumber+eitherOfOneLineNumberSep+lineNo;
				eitherOfOneLineNumberSep = ", ";
				eitherOfOneFlag = true;
			}*/
			if($.trim(shortDesc[i].value)==""){
				var lineNo = i+1;
				descErrorLineNumber = descErrorLineNumber+descErrorLineNumberSep+lineNo;
				descErrorLineNumberSep = ", ";
				desFlag = true;
			}
			if($.trim(uom[i].value)==""){
				var lineNo = i+1;
				uomErrorLineNumber = uomErrorLineNumber+uomErrorLineNumberSep+lineNo;
				uomErrorLineNumberSep = ", ";
				uomFlag = true;
			}
		}
	}
	var eitherOfOneError = "Please Enter Either Part# or Customer Part # or Manufacturer Part # for Item(s) from Line# "+eitherOfOneErrorLineNumber+".<br />";
	var quantityError = "Please Enter Quantity for Item(s) from Line# "+qtyErrorLineNumber+".<br />";
	var descriptionError = "Please Enter Description for Item(s) from Line# "+descErrorLineNumber+".<br />";
	var uomError = "Please Enter Unit of Measure for Item(s) from Line# "+uomErrorLineNumber+".<br />";

	if(pn.length==count){
		$("html, body").animate({scrollTop : $('#notificationDiv').offset().top - 150}, 1000);
		emailVal = emailVal+"Please Enter At Least One Product Information.";
		emailMsg = 1;		
	}else{
		if(qtyFlag){
			emailVal = emailVal+quantityError;
			emailMsg = 1;
		}
		if(eitherOfOneFlag){
			emailVal = emailVal+eitherOfOneError;
			emailMsg = 1;
		}
		if(desFlag){
			emailVal = emailVal+descriptionError;
			emailMsg = 1;
		}
		if(uomFlag){
			emailVal = emailVal+uomError;
			emailMsg = 1;
		}
	}
	if(emailMsg>0){
		showNotificationDiv("error", emailVal);
		$("html, body").animate({scrollTop : $('#notificationDiv').offset().top - 150}, 1000);
	}else{
		var actionUrl = "RFQStandardV2Sale.action";
		if(actinType === "save"){
			actionUrl = "saveRequestForQuoteV2Sale.action";
		}
		$('#orderedBy').val(orderBy);
		block("Please Wait");
		var str = $("#rfqFormV2").serialize();
		$.ajax({
			type: "POST",
			url: actionUrl,
			data: str,
			success: function(msg){
				unblock();
				$("html, body").animate({scrollTop : $('#notificationDiv').offset().top - 150}, 1000);
				var res = msg.split("|");
				if(res[0]=="0"){
					bootAlert('small','success','Success',res[1]);
					//if(actinType != "save"){
						$("[data-bb-handler='ok']").click(function(){
							$("#reqForQuoteTableId").find('input[type=text]').val('');
							if($('select[name="UOMDD"]').length>0){
								$('select[name="UOMDD"]').remove();
							}
							block("Please Wait");
							window.location.reload();
						})
					//}
				}else{
					if(res[1]!=null && res[1].length > 40){
						bootAlert('medium','error','Error',res[1]);
					}else{
						bootAlert('small','error','Error',res[1]);
					}
					
				}
			}
		});
	}
	return false;
}
$('#shipToAddress').change(function() {
	var defaultShipToId = $(this).val();
	var address1 = $(this).find(':selected').data("address1");
	var address2 = $(this).find(':selected').data("address2");
	var city = $(this).find(':selected').data("city");
	var state = $(this).find(':selected').data("state");
	var country = $(this).find(':selected').data("country");
	var zipCode = $(this).find(':selected').data("zipcode");
	var selectedBranch = $(this).find(':selected').data("selectedbranch");
	var shiptoid = $(this).find(':selected').data("shiptoid");
	$("#shipEntityId").val(shiptoid);
	$("#defaultShipToId").val(defaultShipToId);
	$("#address1").val(address1);
	$("#address2").val(address2);
	$("#city").val(city);
	$("#state").val(state);
	$("#country").val(country);
	$("#zipCode").val(zipCode);
	$("#selectedBranch").val(selectedBranch);
	$('#shipToAddress').trigger("chosen:updated");
	return false;
});
function loadthisUom(_this){
	var idx = $(_this).data('rowindex');
	var uom = $(_this).val();
	$('#UOM'+idx).val(uom);
	return false;
}
//----------Custom Autocomplete for RFQ
function highlightText(value, term) {
	return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
}
function loadSuggestedList(object, rowIndex, searchType, liIdx, searchTerm){
	var pnSpan = document.createElement("span");
    pnSpan.setAttribute("class", "partnumspan");
    pnSpan.innerHTML="<b>Part#:</b> "+highlightText(object.partNumber, searchTerm) ;
    
    var mpnSpan = document.createElement("span");
	mpnSpan.setAttribute("class", "mfrpartnumspan");
	mpnSpan.innerHTML="<b>MPN:</b> "+highlightText(object.manufacturerPartNumber, searchTerm);
	
	var descSpan = document.createElement("span");
    descSpan.setAttribute("class", "itemdescspan");
    descSpan.innerHTML="<b>Description:</b> "+highlightText(object.shortDesc, searchTerm);
    
    var cpnSpan = document.createElement("span");
    if(searchType=="CPN" && typeof object.customerPartNumber!='undefined' && object.customerPartNumber!=null && $.trim(object.customerPartNumber)!=""){
        cpnSpan.setAttribute("class", "custpartnumspan");
        cpnSpan.innerHTML="<b>CPN:</b> "+highlightText(object.customerPartNumber, searchTerm);
    }

    var InfoLi = document.createElement("li");
	if(parseInt(liIdx)==0){
		InfoLi.setAttribute("class", "lirow active");
	}else{
		InfoLi.setAttribute("class", "lirow");
	}
	InfoLi.setAttribute("data-liindex", liIdx);
	InfoLi.setAttribute("data-rowindex", rowIndex);
	if(typeof object.partNumber!='undefined' && object.partNumber!=null && $.trim(object.partNumber)!=""){
		InfoLi.setAttribute("data-pn", object.partNumber);
	}
    if(typeof object.manufacturerPartNumber!='undefined' && object.manufacturerPartNumber!=null && $.trim(object.manufacturerPartNumber)!=""){
    	InfoLi.setAttribute("data-mpn", object.manufacturerPartNumber);
    }
    if(searchType=="CPN" && typeof object.customerPartNumber!='undefined' && object.customerPartNumber!=null && $.trim(object.customerPartNumber)!=""){
    	InfoLi.setAttribute("data-cpn", object.customerPartNumber);
    }
    if(typeof object.uom!='undefined' && object.uom!=null && $.trim(object.uom)!=""){
    	InfoLi.setAttribute("data-uom", object.uom);
    }
    if(typeof object.shortDesc!='undefined' && object.shortDesc!=null && $.trim(object.shortDesc)!=""){
    	InfoLi.setAttribute("data-desc", object.shortDesc);
    }
    InfoLi.setAttribute("data-searchtype", searchType);
    InfoLi.setAttribute("onclick", "loadThisItemDetail(this);");
    InfoLi.appendChild(pnSpan);
    if(searchType=="CPN"){
    	InfoLi.appendChild(cpnSpan);
    }else{
    	InfoLi.appendChild(mpnSpan);
    }
    InfoLi.appendChild(descSpan);
    return InfoLi;
}
function loadThisItemDetail(_this){
	var rowIndex = $(_this).data("rowindex");
	var searchType = $(_this).data("searchtype");
	resetRowElement(searchType, rowIndex);
	$('#auto'+rowIndex).attr("data-autofilled","Y");
	var pn = $(_this).data("pn");
	var mpn = $(_this).data("mpn");
	var cpn = $(_this).data("cpn");
	var desc = $(_this).data("desc");
	var uom = $(_this).data("uom");
	//var qty = $('#QTY'+rowIndex).val();
	
	if(typeof pn == 'undefined' || pn == null || $.trim(pn) == ""){ $('#PN'+rowIndex).val(""); }else{ $('#PN'+rowIndex).val(pn); $('#UOM'+rowIndex).attr('data-upmpn', pn); }
	//if(typeof qty == 'undefined' || qty == null || $.trim(qty) == ""){ $('#QTY'+rowIndex).val(1);}
	if(typeof mpn == 'undefined' || mpn == null || $.trim(mpn) == ""){ $('#MPN'+rowIndex).val(""); }else{ $('#MPN'+rowIndex).val(mpn); }
	if(typeof cpn == 'undefined' || cpn == null || $.trim(cpn) == ""){ $('#CPN'+rowIndex).val(""); }else{ $('#CPN'+rowIndex).val(cpn); }
	if(typeof desc == 'undefined' || desc == null || $.trim(desc) == ""){ $('#DESC'+rowIndex).val(""); }else{ desc = desc.replace(/"/g,''); $('#DESC'+rowIndex).val(desc); }
	if(typeof uom == 'undefined' || uom == null || $.trim(uom) == ""){ $('#UOM'+rowIndex).val(""); }else{
		$('#UOM'+rowIndex).val(uom);
		if($.trim(pn).length>0){ priceLoading.requestMultipleUomLoadingAPI($.trim(pn), rowIndex, uom); }
	}
	$('.autosuggestspan').each(function(){ $( this ).text(""); $( this ).html(""); });
	fieldLockDown(rowIndex);
	return false;
}
function fieldLockDown(rowIndex){
	var pn = $('#PN'+rowIndex).val();
	var mpn = $('#MPN'+rowIndex).val();
	var cpn = $('#CPN'+rowIndex).val();
	var desc = $('#DESC'+rowIndex).val();
	var uomEl = $('#UOM'+rowIndex);
	var lockDesc = false, lockUom = false, lockPn = false ,lockCpn = false ,lockMpn = false;
	if($.trim(pn).length>0 || $.trim(cpn).length>0 || $.trim(mpn).length>0){
		var lockDesc = true, lockPn = true, lockCpn = true, lockMpn = true;
		/*if($.trim(pn).length>0){ lockPn = true; }
		if($.trim(cpn).length>0){ lockCpn = true; }
		if($.trim(mpn).length>0){ lockMpn = true; }
		if($.trim(desc).length>0){ lockDesc = true; }
		*/
		if($.trim($(uomEl).val()).length>0 && $(uomEl).attr('type')=="text"){ lockUom = true; }
	}
	if(lockPn){ $('#PN'+rowIndex).attr('readonly', true); }
	if(lockCpn){ $('#CPN'+rowIndex).attr('readonly', true); }
	if(lockMpn){ $('#MPN'+rowIndex).attr('readonly', true); }
	if(lockDesc){ $('#DESC'+rowIndex).attr('readonly', true); }
	if(lockUom){ $('#UOM'+rowIndex).attr('readonly', true); }
}
function resetRowElement(type, rowIndex){
	$('.autosuggestspan').each(function(){ $( this ).text(""); $( this ).html(""); });
	if(type!='PN'){ $('#PN'+rowIndex).val(''); $('#PN'+rowIndex).attr('readonly', false); }
	if(type!='CPN'){ $('#CPN'+rowIndex).val(''); $('#CPN'+rowIndex).attr('readonly', false); }
	if(type!='MPN'){ $('#MPN'+rowIndex).val(''); $('#MPN'+rowIndex).attr('readonly', false); }
	$('#DESC'+rowIndex).val('');
	$('#UOM'+rowIndex).val('');
	$('#UOM'+rowIndex).attr("type", "text");
	if($('#UOMDD'+rowIndex).length>0){
		$('#UOMDD'+rowIndex).remove();
	}
}
function keyStrock(keyCode, rowIndex){
	var KEY = { UP: 38, DOWN: 40, DEL: 46, TAB: 9, RETURN: 13, ESC: 27, COMMA: 188, PAGEUP: 33, PAGEDOWN: 34, BACKSPACE: 8 };
	switch(keyCode) {
		case KEY.UP: event.preventDefault(); focusOnAutoSuggest(rowIndex, keyCode); return false; break;
		case KEY.DOWN: event.preventDefault(); focusOnAutoSuggest(rowIndex, keyCode); return false; break;
		case KEY.PAGEUP: event.preventDefault(); return false; break;	
		case KEY.PAGEDOWN: event.preventDefault(); return false; break;
		case KEY.COMMA: event.preventDefault(); return false; break;
		case KEY.TAB: event.preventDefault(); return false; break;
		case KEY.RETURN: event.preventDefault(); return false; break;	
		case KEY.ESC: event.preventDefault(); return false; break;	
		default: return true; break;
	}
}
function focusOnAutoSuggest(rowIndex, keyCode){
	var liSize = $("#auto"+rowIndex+" ul.rowul li").size();
	var el = "";
	var liIdx = -1;
	if(parseInt(liSize) > 0){
		if(parseInt(keyCode) == 40){
			if($("#auto"+rowIndex+" ul.rowul li.active").length != 0) {
				var storeTarget	= $("#auto"+rowIndex+" ul.rowul").find("li.active").next();
				$("#auto"+rowIndex+" ul.rowul li.active").removeClass("active");
				storeTarget.focus().addClass("active");
				storeTarget.focus();
			}else {
				$("#auto"+rowIndex+" ul.rowul").find("li:first").focus().addClass("active");
			}
		}else if(parseInt(keyCode) == 38){
			if($("#auto"+rowIndex+" ul.rowul li.active").length != 0) {
				var storeTarget	= $("#auto"+rowIndex+" ul.rowul").find("li.active").prev();
				$("#auto"+rowIndex+" ul.rowul li.active").removeClass("active");
				storeTarget.focus().addClass("active");
			}else {
				$("#auto"+rowIndex+" ul.rowul").find("li:last").focus().addClass("active");
			}
		}
		liIdx = $("#auto"+rowIndex+" ul.rowul li.active").attr('data-liindex');
		el = $("#auto"+rowIndex+" ul.rowul li.active");
		if(liIdx > -1){
			var selected = liIdx;
			var elHeight = $(el).height() + 11;
		    var scrollTop =$("#auto"+rowIndex+" ul.rowul").scrollTop();
		    var viewport = scrollTop + $("#auto"+rowIndex+" ul.rowul").height();
		    var elOffset = elHeight * selected;
		    if (elOffset < scrollTop || (elOffset + elHeight) > viewport){
		    	$("#auto"+rowIndex+" ul.rowul").scrollTop(elOffset);
		    }
		}
		return ;
	}
}
function autoCompleteCall(_this){
	if(event.ctrlKey === true || event.metaKey === true || wasMetaKeyPressed === true ){
		if((event.ctrlKey === true || event.metaKey === true) && (event.keyCode == 65 || event.keyCode == 67)){
			wasMetaKeyPressed = true;
		}else{
			wasMetaKeyPressed = false;
		}
	}else{
		var rowIndex = $(_this).closest('tr').attr('data-rowindex');
		var continueFlag = keyStrock(event.keyCode, rowIndex);
		var query = $(_this).val();
		$('#auto'+rowIndex).attr("data-autofilled", "N");
		$('#DESC'+rowIndex).attr('readonly', false);
		$('#UOM'+rowIndex).attr('readonly', false);
		if(continueFlag && query.length>=2){
			var searchType = $(_this).data("searchtype");
			$('.autosuggestspan').each(function(){ $( this ).text(""); $( this ).html(""); });
			$.ajax({
			    url: '/AutoComplete.slt',
			    dataType: 'text',
			    data: { q: $.trim(query),  reqFrom: 'RFQ', searchType: searchType, overrideResultCount:"10" },
			    success: function(response) {
			    	var jsonObject = JSON.parse(response)
			    	var autoCompleteFlag = false;
			    	var InfoOuterMostUl = document.createElement("ul");
			    	
					if(typeof jsonObject!='undefined' && jsonObject!=null && jsonObject!=""){
			    		var responseObject = null;
			    		if(searchType=="CPN" && typeof jsonObject.CPNArray!='undefined' && jsonObject.CPNArray!=null && jsonObject.CPNArray!="" && jsonObject.CPNArray.length>0){
			    			responseObject = jsonObject.CPNArray;
			    		}else if(searchType=="MPN" && typeof jsonObject.MPNArray!='undefined' && jsonObject.MPNArray!=null && jsonObject.MPNArray!="" && jsonObject.MPNArray.length>0){
			    			responseObject = jsonObject.MPNArray;
			    		}else if(searchType=="PN" && typeof jsonObject.PNArray!='undefined' && jsonObject.PNArray!=null && jsonObject.PNArray!="" && jsonObject.PNArray.length>0){
			    			responseObject = jsonObject.PNArray;
			    		}
			    		if(responseObject!=null && responseObject.length>0){ 
			    			InfoOuterMostUl.setAttribute("class", "rowul");
				    		for(var i=0; i< responseObject.length; i++){
				    			InfoOuterMostUl.appendChild(loadSuggestedList(responseObject[i], rowIndex, searchType, i, $.trim(query)));
				    			autoCompleteFlag = true;
				    		}
				    	}else{
				    		autoCompleteFlag = false;
				    	}
			    	}else{
			    		autoCompleteFlag = false;
			    	}
					var autofilled = $('#auto'+rowIndex).attr('data-autofilled');
			    	if(autoCompleteFlag && autofilled != "Y"){
			    		$('#auto'+rowIndex).html(InfoOuterMostUl);
			    	}else{
			    		$('.autosuggestspan').each(function(){ $( this ).text(""); $( this ).html(""); });
			    	}
			    	return false;
			    }
		    });
		}
	}
}
$('html').click(function() {
	var liCount = $('.autosuggestspan ul.rowul li.lirow').length;
	if(liCount > 0){ $('.autosuggestspan').each(function(){ $( this ).text(""); $( this ).html(""); }); }
});
$('.autosuggestspan ul.rowul li.lirow').click(function(event){ event.stopPropagation(); });
$('#rfqFormV2 input').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        var rowIndex = $(this).closest('tr').attr('data-rowindex');
        console.log('Enter: '+rowIndex);
        var liSize = $("#auto"+rowIndex+" ul.rowul li").size();
    	if(parseInt(liSize) > 0){
    		$('#auto'+rowIndex).attr("data-autofilled","Y");
    		$("#auto"+rowIndex+" ul.rowul li.active").click();
    	}
        return false;
    }
});
//----------Custom Autocomplete for RFQ
function saveRfqLineItem(_this){
	var linecmt = $('#LINEITEMCMTARR'+rowIndex).val();
	var shipinst = $('#shippingInstruction').val();
	var reqDate = $('#reqDate').val();
	
	$.ajax({
		type: "POST",
		url: "saveRequestForQuoteV2Sale.action",
		data: { 
			si: 'Y', idx: rowIndex, qty: $.trim(qty), pn: $.trim(pn), cpn: $.trim(cpn), mpn: $.trim(mpn),uom: $.trim(uom), 
			desc: $.trim(desc), linecmt: $.trim(linecmt), shipinst:$.trim(shipinst), reqDate:$.trim(reqDate)
		},
		success: function(msg){
			unblock();
			var res = msg.split("|");
			if(res[0]=="0"){
				bootAlert('medium','success','Success',res[1]);
			}else{
				bootAlert('small','error','Error',res[1]);
			}
		}
	});
}
function deleteRfqCartV2(){
var rfqId = $('#rfqId').val();
$.ajax({
	type: "POST",
	url: "deleteRfqCartV2Sale.action",
	data: {rfqId: rfqId },
	success: function(msg){
		unblock();
		var res = msg.split("|");
		if(res[0]=="0"){
			bootAlert('small','success','Success',res[1]);
			$("#reqForQuoteTableId").find('input[type=text]').val('');
			$("[data-bb-handler='ok']").click(function(){
				block("Please Wait");
				window.location.reload();
			})
		}else{
			bootAlert('small','error','Error',res[1]);
		}
		return false;
	}
});
}
/*function dataChanged(_this){
//var rowIndex = $(_this).closest('tr').attr('data-rowindex');
$(_this).closest('tr').attr('data-rowdatachanged','Y')
}*/
$(document).ready(function(){
	$('#shipToAddress').trigger("chosen:updated");
	var pn = $("input[name='PARTNUMARR']");
	var uom = $("input[name='UOM']");
	//Enable Below for Muliple Uom From ERP
	/*for(i=0;i<=pn.length-1;i++){
		if($.trim(pn[i].value)!="" && $.trim(pn[i].value).length>0){
			priceLoading.requestMultipleUomLoadingAPI($.trim(pn[i].value), i, $.trim(uom[i].value));
		}
	}*/
	//$(".rfqAutoComplete").keydown(function(){ //keyup });
});
function shipToLocationNotAvailable(obj){
	if(obj.checked){
		block("Please Wait");
		$("#overrideShip").val("Y");
		$('.shipToElementRow').each(function(){ if($(this).hasClass('hide')){ $(this).removeClass('hide'); $(this).find('input[type=text]').val(''); } });
		if(document.getElementById("shipCountry")){ 
			var countryName2A = new initCountry({ country: "US", selectorID: "shipCountry", defaultSelect: true }); $('#shipState').trigger("chosen:updated");
		}
		$('#shipToAddress').attr('disabled',true);
		$('#shipToAddress').attr('readonly', true);
		$('#shipToAddress').trigger("chosen:updated");
		$('.selectpicker').selectpicker('refresh');
		$("#shipEntityId").val('');
		$("#defaultShipToId").val("0");
		$("#address1").val('');
		$("#address2").val('');
		$("#city").val('');
		$("#state").val('');
		$("#country").val('');
		$("#zipCode").val('');
		$("#selectedBranch").val("");
		unblock();
	}else{
		block("Please Wait");
		$("#overrideShip").val("N");
		$('.shipToElementRow').each(function(){ $(this).addClass('hide'); $(this).find('input[type=text]').val(''); });
		$('#shipToAddress').attr('disabled', false);
		$('#shipToAddress').attr('readonly', false);
		$('#shipToAddress').trigger("chosen:updated");
		var _thisObj = $('#shipToAddress');
		var defaultShipToId = $(_thisObj).val();
		var address1 = $(_thisObj).find(':selected').data("address1");
		var address2 = $(_thisObj).find(':selected').data("address2");
		var city = $(_thisObj).find(':selected').data("city");
		var state = $(_thisObj).find(':selected').data("state");
		var country = $(_thisObj).find(':selected').data("country");
		var zipCode = $(_thisObj).find(':selected').data("zipcode");
		var selectedBranch = $(_thisObj).find(':selected').data("selectedbranch");
		var shiptoid = $(_thisObj).find(':selected').data("shiptoid");
		$("#shipEntityId").val(shiptoid);
		$("#defaultShipToId").val(defaultShipToId);
		$("#address1").val(address1);
		$("#address2").val(address2);
		$("#city").val(city);
		$("#state").val(state);
		$("#country").val(country);
		$("#zipCode").val(zipCode);
		$("#selectedBranch").val(selectedBranch);
		$('#shipToAddress').trigger("chosen:updated");
		$('.selectpicker').selectpicker('refresh');
		unblock();
	}
	return false;
}
function clearRow(_this){
	block("Please Wait");
	$(_this).closest('tr').find('select[name="UOMDD"]').remove();
	var rowIndex = $(_this).closest('tr').attr('data-rowindex');
	var uomEl = $('#UOM'+rowIndex);
	$('#PN'+rowIndex).attr('readonly', false);
	$('#CPN'+rowIndex).attr('readonly', false);
	$('#MPN'+rowIndex).attr('readonly', false); 
	$('#DESC'+rowIndex).attr('readonly', false);
	if($(uomEl).attr('type')=="hidden"){ $(uomEl).attr("type", "text"); }
	$(uomEl).attr("readonly", false); 
	$(_this).closest('tr').find('input[type=text]').val('');
	unblock();
}