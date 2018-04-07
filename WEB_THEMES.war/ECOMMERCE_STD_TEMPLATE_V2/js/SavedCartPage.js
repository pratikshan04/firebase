/*jQuery.getScript('/WEB_THEMES/ECOMMERCE_STD_TEMPLATE_V2/js/BulkAction.js', function(){
	BulkAction.enableCheckBoxOnLoad();
	var allChecked = $("input:checkbox[name='idList']:checked").length === $("input:checkbox[name='idList']").length;
	$('#chkSelectall').prop('checked', allChecked);
});*/
function deviceSelectAll(){
	if($("#chkSelectall").is(':checked')){
		$("#chkSelectall").attr("checked",false);
	}
	else{
		$("#chkSelectall").attr("checked",true);
	}
	var checked_status = $("#chkSelectall").is(':checked');
	$("input:checkbox[name='idList']").each(function(){
		this.checked = checked_status;
		BulkAction.addGroupItemsToCookie(this);
	});
}
function hideAndShowViews(){
	var chks = $("select[name='views']").val();
	if(chks=='expand'){
		$(".hideForCollapse").show();
	}else if(chks=='collapse'){
		$(".hideForCollapse").hide();
	}
}
function clearProductSearch(){
	$("#searchkeyWord").val("");
	$("#productSearchForm").submit();
}
function sortByManuPartNo(){
	$("#sortByForm").submit();
}
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
		BulkAction.addGroupItemsToCookie(this);
	});
}
function bulkActions(that) {
	var selectedVal = $(that).val();
	var val;
	if(selectedVal == "deleteOption") {
		val =  changeAction(4, that);
	}else if(selectedVal == "updateOption") {
		val =  updateMyProductGroup();
	}else if(selectedVal == "addSelectedOption") {
		var checkedCount = 0;
		var unCheckedCount = 0;
		$("input:checkbox[name='idList']:checked").each(function() {
			checkedCount = checkedCount + 1;
			var addtocartflag = jQuery(this).data("addtocartflag");
			if(jQuery(this).data("addtocartflag")=="N"){
				jQuery("#"+this.id).click();
                this.checked = false;
                $('#chkSelectall').attr('checked', false);
                unCheckedCount= unCheckedCount+1;
			}
		});
		var diffrence = checkedCount - unCheckedCount;
		if(checkedCount>0){
			if(diffrence>0){
				if(unCheckedCount>0 && checkedCount>unCheckedCount){
					bootAlert("small","info","Info","Call for Price items will be dropped from selection");
				}
				BulkAction.addGroupItemsToCartCookie();
				//val = changeAction(2);
			}else{
				bootAlert("small","error","Error","Cannot add Call for Price item to cart");
				$(that).val("");
			}
		}else{
			bootAlert("small","error","Error","Please select at least one item to add cart");
			$(that).val("");
		}
	}
	if(val){
		block("Please Wait");
		$("#productGroupForm").attr("method","post");
		$("#productGroupForm").submit();
	}else{
		
	}
}
function disbleItemWithZeroPrice(){
	try{
		var idList = document.getElementsByName("idListItem");
		var itemCnt = idList.length;
		var count=0;
		for(i=0;i<idList.length;i++){
			var id = idList[i].value;
			var itmPrice = $("#priceValue_"+id).val();
			if(itmPrice!=null && itmPrice > 0){
				$("#chkSelect1"+id).data("addtocartflag","Y");	
			}else{
				$("#chkSelect1"+id).data("addtocartflag","N");
				count++;
			}
		}
		if(count>0){
			//$("#chkSelectall").attr("disabled", true);
		}	
		if(itemCnt!=null && count!=null && count==itemCnt){
			$("#addSelectedItemstoCart, #updateSelectedItems, #deleteSelectedItems").attr("disabled", true);
			$("#addSelectedItemstoCart, #updateSelectedItems, #deleteSelectedItems").addClass("btns-disable");
			document.getElementById('addSelectedItemstoCart').title = 'Disabled';
			document.getElementById('updateSelectedItems').title = 'Disabled';
			document.getElementById('deleteSelectedItems').title = 'Disabled';
			$("#addSelectedItemstoCart").css('color', '#EEE');
			$("#updateSelectedItems").css('color', '#EEE');
			$("#deleteSelectedItems").css('color', '#EEE');
			bootAlert("small","error","Error","You cannot add any item to cart from your Saved Cart \n Please call for availability");
		}
	}catch(e){
			console.log(e);
	}
}
function checkEachBox(chkName){
	var allChecked = $("input:checkbox[name='"+chkName+"']:checked").length === $("input:checkbox[name='"+chkName+"']").length;
	$('#chkSelectall').prop('checked', allChecked);
}
$('#sharePop').on('show.bs.modal', function (e) {
	$("#popkeyword").val("");
	$("#pLoginErr").html("");
})
$(document).ready(function(){
	//priceLoadMainFunction();
	/*disbleItemWithZeroPrice();*/
	BulkAction.enableCheckBoxOnLoad();
	var allChecked = $("input:checkbox[name='idList']:checked").length === $("input:checkbox[name='idList']").length;
	$('#chkSelectall').prop('checked', allChecked);
});