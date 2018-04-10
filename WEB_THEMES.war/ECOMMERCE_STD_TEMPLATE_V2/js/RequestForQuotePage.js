var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/bootstrap-datepicker.min.js', function(){
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
	 $('#reqDate').datepicker('setStartDate', new Date(currentYear, currentMonth, currentDate));
	 $("#startDate").attr("value",mm1+'/'+dd1+'/'+yyyy1);
});

$(function () {
	$('form').submit(function(){
		$('input[type=submit]').val("Please Wait...");
		$('input[type=submit]').attr('disabled', 'disabled');
	});
});

function addRow(){		
	var index = parseInt($("#addNewRowCount").val());		
	var newRow = "<tr>";
	newRow = newRow + "<td align='left' valign='top' data-th='$!locale.get('product.label.partNumber')'>";
	newRow = newRow + "<input type='text' id='PN"+index+"' value='' name='PARTNUMARR' class='input-part form-control' />";
	newRow = newRow + "</td>";
	newRow = newRow + "<td align='left' valign='top' data-th='$locale.get('product.label.manufacturerPartNumber')'>";
	newRow = newRow + "<input type='text' id='MPN"+index+"' value='' name='PARTNUMARR' class='input-part form-control' />";
	newRow = newRow + "</td>";
	newRow = newRow + "<td align='left' valign='top' data-th='$locale.get('product.label.brandMnfrName')'>";
	newRow = newRow + "<input type='text' id='BN"+index+"' value='' name='BRANDNAMEARR' class='input-brand form-control' />";
	newRow = newRow + "</td>";
	newRow = newRow + "<td align='left' valign='top' data-th='$locale.get('product.label.qty')'>";
	newRow = newRow + "<input type='text' id='QTY"+index+"' size='5' maxlength='6' onkeypress='return IsNumeric(event)' onpaste='return false' ondrop = 'return false'  value='' name='ITEMQTYARR' class='quantity form-control' />";
	newRow = newRow + "</td>";
	newRow = newRow + "<td align='left' valign='top' data-th='$locale.get('product.label.shortDescription')'>";
	newRow = newRow + "<input type='text' id='DESC"+index+"' value='' name='DESCARR' class='input-part form-control' />";
	newRow = newRow + "</td>";
	newRow = newRow + "</tr>";
	$("#idOfRowToInsertBefore").before(newRow);
	index++;
	if(index>=4 && $('#removeRowBtn').is(":hidden")){
		$('#removeRowBtn').show();
	}
	$("#addNewRowCount").val(index);
	return false;
}

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
	var emailMsg = 0;
	var emailVal = "";
	var count=0;
	var orderBy = "";

	if($.trim($("#rfnpName").val())==""){
		emailVal = emailVal + "Please Enter First Name.<br/>";
		emailMsg = 1;
	}else{
		orderBy = $.trim($("#rfnpName").val())+" ";
	}
	if($.trim($("#rfnpName2").val())==""){
		emailVal = emailVal + "Please Enter Last Name.<br/>";
		emailMsg = 1;
	}else{
		orderBy = orderBy+$.trim($("#rfnpName2").val());
	}
	if($("#checkValidState").val()>0){
		if($.trim($("#rfnpCity").val())==""){
			emailVal = emailVal + "Please Enter Shipto City<br/>";
			emailMsg = 1;
		}
		if($.trim($("#rfnpState").val())==""){
			emailVal = emailVal + "Please Enter Shipto State<br/>";
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
			var email = $.trim($("#rfnpEmail").val());
			var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
			if (reg.test(email)){}
			else{
				emailVal = emailVal + "Please Enter Valid Email Address.<br />";
				emailMsg = 1;
			}
		}
	}

	for(i=0;i<=pn.length-1;i++){
		var checkResult = 0;
		if($.trim(pn[i].value)=="" && $.trim(brandName[i].value) =="" && $.trim(shortDesc[i].value)==""){
			count++;
		}else{
			if(ITEMQTYARR[i].value==""){
				ITEMQTYARR[i].value=1;
			}
		}
	}

	if(pn.length==count){
		emailVal = emailVal+"Please Enter Atleast One Product Information To Submit.";
		emailMsg = 1;		
	}
	if(emailMsg>0){
		showNotificationDiv("error", emailVal);
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