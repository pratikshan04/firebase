$(document).ready(function(){
	var idList = document.getElementsByName("itemPriceIdList");
	var itemCnt = idList.length;
	var count=0;
	for(i=0;i<idList.length;i++){
		var id = idList[i].value;
		var itmPrice = $("#priceValueID_"+id).val();
		if(itmPrice!=null && parseFloat(itmPrice) == 0){
			$("#chkSelect_"+id).attr("disabled", true);
			count++;
		}
	}
	if(count>0){
		 $("#chkSelectall").attr("disabled", true);
	}
	if(itemCnt!=null && count!=null && count==itemCnt){
		$("#approveCart, #updateSelectedItems").attr("disabled", true).addClass("btns-disable");
		showNotificationDiv("error","You cannot add any item to cart from your product group. Please call for availability");
	}
});

function checkSelectAll(chk){
	if($(".deviceSelectAllChkBox").is(':checked')){
		$(".deviceSelectAllChkBox").attr("checked",false);
	}
	else{
		$(".deviceSelectAllChkBox").attr("checked",true);
	}
	var checked_status = chk.checked;
	$("input:checkbox[name='idList']").each(function(){
		this.checked = checked_status;
	});
	checkBtns(checked_status);
}
function deviceSelectAll(){
	if($("#chkSelectall").is(':checked')){
		$("#chkSelectall").attr("checked",false);
	}
	else{
		$("#chkSelectall").attr("checked",true);
	}
	var checked_status = $("#chkSelectall").is(':checked');
	$("input:checkbox[name='quotePartNumberSelected']").each(function(){
		this.checked = checked_status;
	});
}
function checkEach(chk){
	var chkName = chk.name;
	var allChecked = $("input:checkbox[name='"+chkName+"']:checked").length === $("input:checkbox[name='"+chkName+"']").length;
	$('#chkSelectall, .deviceSelectAllChkBox').prop('checked', allChecked);
	if($("input:checkbox[name='"+chkName+"']:checked").length > 0){
		checkBtns(true);
	}else{
		checkBtns(false);
	}
}
function checkBtns(status){
	if(status){
		$("#updateSelectedItems").removeClass('slideBtns-hide');
		$("#rejectCart, #approveCart").addClass('slideBtns-hide');
	}else{
		$("#updateSelectedItems").addClass('slideBtns-hide');
		$("#rejectCart, #approveCart").removeClass('slideBtns-hide');
	}
}