var table = $('#OrdersHistoryTable').DataTable({
	"language": {
		"url": "https://cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json",
		"search":"_INPUT_",
		"searchPlaceholder":"Search Orders History",
		"oPaginate" : {
			"sPrevious" :"Prev",
			"sNext" :"Next"
		}
	},
	'aoColumnDefs': [{ targets: -1, orderable: false }]
});

var poList = table.column(1).data().unique();

$('#orderPoSearchBtn').on('click', function () {
	unusualCode = 0;
	var searchTerm = $('#orderPoSearch').val().toLowerCase(), unusualCodeErrorStr = $("#dataErrors").attr('data-unusualError');
	if(validateStr(searchTerm)){
		unusualCode++;
	}

	if(unusualCode > 0){
		bootAlert("medium", "error", "Error", unusualCodeErrorStr);
		return false;
	}else{
		$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
			//search only in column 1 and 2
			if (~data[0].toLowerCase().indexOf(searchTerm)) return true;
			if (~data[2].toLowerCase().indexOf(searchTerm)) return true;
			return false;
		})
		table.draw(); 
		$.fn.dataTable.ext.search.pop();
	}
});
$('#resetBtn').click( function() {
	window.location.href= '/OrderHistory';
});

var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
$.getScript(cdnPluginJsPath+'/bootstrap-datepicker.min.js', function(){
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
	
	var todayDate = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
	var oneMonthDate = oneMonthAgo.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
	
	if($startDate!="")
		$('#startDate').val($startDate);
	else
		$('#startDate').val(oneMonthDate);
	if($endDate!="")
		$('#endDate').val($endDate);
	else
		$('#endDate').val(todayDate);
	
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
	var value = jQuery.trim($(data).attr("data-value"));
	var submitForm = true;
	var searchAndDefaultValueSame = false;
	
	$("#searchBy").val("byOrder");
	if (value == "BillTo") {
		$("#entityIDType").val("Bill");
	} else {
		$("#entityIDType").val("Ship");
	}

	/*if (dataId == "searchbutton") {
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
	}*/
	if (submitForm) {
		block('Espere por favor');
		$("#OrdersHistoryDetails").submit();
	}else{
		$('#orderHistorySearchBox').val(searchBtnVal);
	}
}

$('#orderPoSearch').keypress(function(e) {
	if (e.keyCode == 13) {
		$('#orderPoSearchBtn').click();
	}
});
