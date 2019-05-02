$(document).ready(function(){
	jQuery('#example').DataTable({
	    "order": [[ 0, "asc" ]],
	    pageLength : 5,
	    lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]]
	});
});
function useThisAddress(obj){
	jQuery("#shipId").val(obj.dataset.addressbookid);
	jQuery("#bcId").val(obj.dataset.buyingcompanyid);
	jQuery("#entityId").val(obj.dataset.entityid);
	jQuery("#custName").val(obj.dataset.customername);
	jQuery("#homeBranchZipCode").val(obj.dataset.zipcode);
}
function submitShippingAddress(obj){
	jQuery("#shipId").val(obj.dataset.addressbookid);
	jQuery("#bcId").val(obj.dataset.buyingcompanyid);
	jQuery("#entityId").val(obj.dataset.entityid);
	jQuery("#custName").val(obj.dataset.customername);
	jQuery("#homeBranchZipCode").val(obj.dataset.zipcode);
	console.log(jQuery("#shipId").val()+" : "+jQuery("#bcId").val()+" : "+jQuery("#custName").val());
	if($("input[name=useThisAddress]:checked").length>0){
		console.log("Radio On");
		var noEmailTxt = locale('checkemailaddress.status.noemailaddress');
		var value = getCookie("afterLoginUrl");
		var itemId=getCookie('itemId');
		var itemPriceID=getCookie('itemPriceId');
		var str=jQuery("#selectShipAddress").serialize();
		console.log("str : "+str);
		setCookie("afterLoginUrl", '');
		block("Please Wait");
		setCookie("afterLoginUrl", '');
		jQuery.ajax({
			type: "POST",
			url: "assignShipEntity.action",
			data: str,
			success: function(msg){
				unblock();
				setCookie("isShipToSelected", true);
				if(msg==noEmailTxt){
					setCookie("validEmailAddress", false);
				}else{
					setCookie("validEmailAddress", true);
				}
				if(itemId!="" && itemId!=null && typeof itemId != 'undefined'){
					addToCart(itemId,itemPriceID);
				}
				if(value!="" && value!=null && typeof value != 'undefined'){
					window.location.href=value;
				}else if(isURL("$!session.getAttribute('redirectURL')")){
					window.location.href="$!session.getAttribute('redirectURL')";
				}else{
					window.location.href = locale('website.url.ProductCategory');
				}
				
			}
		});
	}else{
		console.log("Radio Off");
		bootAlert("small","error","Error","Please select at least one ship address.");
	}
}
function isURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
}
