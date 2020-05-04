var table = $('#openOrderTable').DataTable({
	"language": {
		"search":"_INPUT_",
		"searchPlaceholder":"Search Orders History",
		"sLengthMenu" :"Show _MENU_",
		"oPaginate" : {
			"sPrevious" :"Prev",
			"sNext" :"Next"
		}
	}
});
$(function() {
	$('#searchbutton').click(function() {
		$("#searchbutton").val("Please wait...");
		$("#searchbutton").attr("disabled","disabled");
		$("#searchbutton1").attr("disabled","disabled");
		$('#OrdersHistoryDetails').submit();
	});
});

var poList = table.column(1).data().unique();

$('#orderPoSearchBtn').on('click', function () {
	var searchTerm = $('#orderPoSearch').val().toLowerCase();
	$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
		//search only in column 1 and 2
		if (~data[0].toLowerCase().indexOf(searchTerm)) return true;
		if (~data[2].toLowerCase().indexOf(searchTerm)) return true;
		return false;
	})
	table.draw(); 
	$.fn.dataTable.ext.search.pop();
});
$('#resetBtn').click( function() {
	window.location.href= '/OrderHistory';
});

var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/bootstrap-datepicker.min.js', function(){
	var today = new Date();
	var month = today.getMonth() - 1,
		year = today.getFullYear(),
		$startDate = $("#startDateVal").val(),
		$endDate = $("#endDateVal").val();
	if (month < 0) {
		month = 11;
		year -= 1;
	}
	var oneMonthAgo = new Date(year, month, today.getDate());
	if($startDate!="")
		$('#startDate').val($startDate);
	else
		$('#startDate').val(jQuery.datepicker.formatDate('mm/dd/yy', oneMonthAgo));
	if($endDate!="")
		$('#endDate').val($endDate);
	else
		$('#endDate').val(jQuery.datepicker.formatDate('mm/dd/yy', today));
	
	$('#startDate').datepicker({
		autoclose: true
	}).on('changeDate', function(ev){
		var date = new Date(ev.date);
		$('#endDate').datepicker({autoclose: true, startDate : (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()});
	});
	$('#endDate').datepicker();
});
function processForm(data) {
	var theDate = new Date();
	var dataId = jQuery.trim($(data).attr("data-id"));
	var hasPassCode = jQuery.trim($(data).attr("data-hasPassCode"));
	var value = jQuery.trim($(data).attr("data-value"));
	var searchBtnVal = jQuery.trim($('#orderHistorySearchBox').val());
	var defaultValue = jQuery.trim(locale('product.label.EnterOrderPOOrPartNo'));
	var submitForm = true;
	var searchAndDefaultValueSame = false;
	 if (searchBtnVal == defaultValue) {
			searchAndDefaultValueSame = true;
			$('#orderHistorySearchBox').val("");
	}
	
	if (hasPassCode == 'Y') {
		ARPasswordPrompt("bill");
		submitForm = false;
	}  else {
		$("#searchBy").val("byOrder");
		if (value == "BillTo") {
			$("#entityIDType").val("Bill");
		} else {
			$("#entityIDType").val("Ship");
		}
		if(dataId=="No"){
			
		}else if (dataId == "searchbutton") {
			$("#orderNumber").val($("#orderHistorySearchBox").val());
			if ($('#startDate').val() == "" || $('#endDate').val() == "") {
				bootAlert("small","error","Error","Please Choose Start Date and End Date");
				$("[data-bb-handler='ok']").click(function(){
					submitForm = false;
				});
				
			} else {
				$("#searchBy").val("byOrder");
			}
		} else if (dataId == "yearToDate") {
			$('#startDate').val("01/01/" + theDate.getFullYear());
			$('#endDate').val(theDate.getMonth() + 1 + "/" + theDate.getDate() + "/"+ theDate.getFullYear());
			$("#searchBy").val("byOrder");
		} else if (dataId == "searchByItem") {
			$("#searchBy").val("byItem");
		} else if (dataId == "customerPoNumber") {
			if(searchAndDefaultValueSame){
				bootAlert("small","error","Error","Please enter Search Keyword");
				$("[data-bb-handler='ok']").click(function(){
					submitForm = false;
				});
			}else{
				$("#customerPoNumber").val($("#orderHistorySearchBox").val());
			}
		} else if (dataId == "partNumberToERP") {
			$("#searchBy").val("partNumber");
			if(searchAndDefaultValueSame){
				bootAlert("small","error","Error","Please enter Search Keyword");
				$("[data-bb-handler='ok']").click(function(){
					submitForm = false;
				});
			}else{
				$("#partNumberToERP").val($("#orderHistorySearchBox").val());
			}
		} else if (dataId == "orderNumber") {
			if(searchAndDefaultValueSame){
				bootAlert("small","error","Error","Please enter Search Keyword");
				$("[data-bb-handler='ok']").click(function(){
					submitForm = false;
				});
			}else{
				$("#orderNumber").val($("#orderHistorySearchBox").val());
			}
		} else if (dataId == "printInvoices") {
			$("#searchBy").val("printInvoices");
			if ($('#startDate').val() == "" && $('#endDate').val() == "") {
				$('#startDate').val("01/01/" + theDate.getFullYear());
				$('#endDate').val(theDate.getMonth() + 1 + "/" + theDate.getDate() + "/"+ theDate.getFullYear());
			}
		}
		if (submitForm) {
			block('Please Wait');
			$("#OrdersHistoryDetails").submit();
		}else{
			$('#orderHistorySearchBox').val(searchBtnVal);
		}
	}
}
function ARPasswordPrompt(ARShipPasswordType){
	$('#ARShipPasswordType').val(ARShipPasswordType);
	if(ARShipPasswordType == "bill"){
		$("#header").html("This Bill-To Account Requires a Separate Password for Order History.");
	}
	$.blockUI({
		message: $('#ARPasswordPrompt'),
		css: {
			width: '450px',
			height: '224px',
			top:  ($(window).height() - 384) /2 + 'px', 
			left: ($(window).width() - 408) /2 + 'px',
			backgroundColor: '#fff'
		}
	});
}
$('#orderPoSearch').keypress(function(e) {
	if (e.keyCode == 13) {
		$('#orderPoSearchBtn').click();
	}
});
