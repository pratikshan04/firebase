var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
$.getScript(cdnPluginJsPath+'/bootstrap-datepicker.min.js', function(){
	var date = new Date();
	var currentMonth = date.getMonth();
	var currentDate = date.getDate();
	var currentYear = date.getFullYear();
	 var today = new Date();
	 var dd = ('0' + today.getDate()).slice(-2);
	 var mm = ('0' + (today.getMonth()+1)).slice(-2);
	 var yyyy = today.getFullYear();
	 today.setDate(today.getDate()-30);
	 var dd1 = today.getDate();
	 var mm1 = today.getMonth()+1;
	 var yyyy1 = today.getFullYear();
	 $("#reqDate").attr("value",mm+'/'+dd+'/'+yyyy);
	 //$('#reqDate').datepicker('setStartDate', new Date(currentYear, currentMonth, currentDate));
	 $('#reqDate').datepicker({autoclose: true, startDate : (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()});
	 $("#startDate").attr("value",mm1+'/'+dd1+'/'+yyyy1);
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
	if(rowCount>4){
		$('#reqForQuoteTableId tr:nth-last-child(2)').remove();
		index = index-1;
		$("#addNewRowCount").val(index);
	}else{
		bootAlert("small","error","Error","Cannot remove default rows");
	}
	if(index<4 && $('#removeRowBtn').is(":visible")){
		$('#removeRowBtn').hide();
	}
	return false;
}
/*** Request for Quote Validation ***/
function validateRFQ(){
	var pn = $("input[name='PARTNUMARR']");
	var brandName = $("input[name='BRANDNAMEARR']");
	var shortDesc = $("input[name='DESCARR']");
	var pn = $("input[name='PARTNUMARR']");
	var cpn = $("input[name='CPN']");
	var ITEMQTYARR = $("input[name='ITEMQTYARR']");
	var emailMsg = 0, count = 0, qtyCount = 0, unusualCode = 0;
	var emailVal = "";
	var orderBy = "";
	var rfnpName = $("#rfnpName").val(),
	rfnpName2 = $("#rfnpName2").val(),
	checkValidState = $("#checkValidState").val(),
	rfnpPhone = $("#rfnpPhone").val(),
	rfnpEmail = $("#rfnpEmail").val(),
	comments = $('#comments').val(),
	unusualCodeErrorStr = $("#dataErrors").attr('data-unusualError');

	if($.trim(rfnpName)==""){
		emailVal = emailVal + "Please Enter First Name.<br/>";
		emailMsg = 1;
	}else{
		orderBy = $.trim(rfnpName)+" ";
	}
	if($.trim(rfnpName2)==""){
		emailVal = emailVal + "Please Enter Last Name.<br/>";
		emailMsg = 1;
	}else{
		orderBy = orderBy+$.trim(rfnpName2);
	}
	if(checkValidState){
		if($.trim($("#rfnpCity").val())==""){
			emailVal = emailVal + "Please Enter Shipto City<br/>";
			emailMsg = 1;
		}
		if($.trim($("#rfnpState").val())==""){
			emailVal = emailVal + "Please Enter Shipto State<br/>";
			emailMsg = 1;
		}
	}
	if($.trim(rfnpPhone)==""){
		emailVal = emailVal + "Please Enter Phone Number.<br/>";
		emailMsg = 1;
	}else{
		if(isPhoneNumberValid($.trim(rfnpPhone)) == false){
			emailVal = emailVal + "Please Enter Valid Phone Number<br/>";
			emailMsg = 1;
		}
	}
	if($.trim(rfnpEmail)==""){
		emailVal = emailVal + "Please Enter Contact Email Address.<br />";
		emailMsg = 1;
	}else{
		var email = $.trim(rfnpEmail.toLowerCase());
		var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
		if (reg.test(email)){}
		else{
			emailVal = emailVal + "Please Enter Valid Email Address.<br />";
			emailMsg = 1;
		}
	}

	for(i=0;i<=pn.length-1;i++){
		var checkResult = 0, itemQtyVal = ITEMQTYARR[i].value, pnVal = pn[i].value, shortDescVal = shortDesc[i].value, brandNameVal = brandName[i].value;
		if(parseFloat(itemQtyVal) == 0 || $.trim(itemQtyVal)==""){
			qtyCount++
		}
		if($.trim(pnVal)=="" || $.trim(parseFloat(itemQtyVal)) <= 0 || $.trim(shortDescVal)==""){
			count++;
		}
		if(validateStr(pnVal) || validateStr(itemQtyVal) || validateStr(shortDescVal)){
			unusualCode++;
		}
	}
	
	if(validateStr(comments) || validateStr(rfnpName) || validateStr(rfnpName2) || validateStr(rfnpPhone) || validateStr(rfnpEmail) ){
		unusualCode++;
	}

	if(pn.length == count){
		emailVal = emailVal+"Please Enter Atleast One Product Information To Submit.";
		emailMsg = 1;
	}
	if(pn.length == qtyCount){
		emailVal = emailVal + "Quantity Cannot be less than or equal to 0<br/>";
		emailMsg = 1;
	}
	if(emailMsg>0){
		showNotificationDiv("error", emailVal);
	}else if(unusualCode > 0){
		bootAlert("medium", "error", "Error", unusualCodeErrorStr);
	}else{
		$('#orderedBy').val(orderBy);
		block("Please Wait");
		var str = $("#rfqForm").serialize();
		$.ajax({
			type: "POST",
			url: "RFQStandardSale.action",
			data: str,
			success: function(msg){
				unblock();
				var res = msg.split("|");
				if(msg=="sessionexpired"){
					window.location.href="doLogOff.action";
				}else if(res[0]=="0"){
					bootAlert('small','success','Success',res[1]);
					$("#reqForQuoteTableId").find('input[type=text]').val('');
				}else{
					bootAlert('small','error','Error',res[1]);
				}
				$("[data-bb-handler='ok']").click(function(){
					window.location.reload();
				})
			}
		});
	}
	return false;
}