var billAddressState = $("#billAddressState").val();
var billAddressCountry = $("#billAddressCountry").val();
if(!billAddressCountry){
	billAddressCountry = "US";
}
var countrySelectShip = new initCountry({
	country: billAddressCountry,
	selectorID: "countrySelectShip",
	defaultSelect: true,
	selectState: billAddressState
});
$("#editContactAddressForm").submit(function(){
	if($("#billAddressEmail").val() != $("#email").val()){
		$("#email").val($("#billAddressEmail").val());
	}
});
function getContactEntityAddress(obj){
	if(obj.checked){
		$("#useEntityAddress").val("Yes");
		block("Please Wait");
		str = "test=1";
		$.ajax({
			type: "POST",
			url: "autoFillAddressUnit.action",
			data: str,
			success: function(msg){
				msgArr = msg.split("|");
				if(msgArr[0]!=null && msgArr[0]!="null")
					$("#address1").val(msgArr[0]);
				if(msgArr[1]!=null && msgArr[1]!="null")
					$("#address2").val(msgArr[1]);
				if(msgArr[2]!=null && msgArr[2]!="null")
					$("#city").val(msgArr[2]);
				if(msgArr[3]!=null && msgArr[3]!="null"){
					$("#stateSelectShip").val(msgArr[3].toUpperCase());
					var i = $("#stateSelectShip option[value='"+msgArr[3].toUpperCase()+"']").index();
					$("#stateSelectShip").parent().find(".dropdown-menu.inner li").removeClass("selected");
					$("#stateSelectShip").parent().find(".dropdown-menu.inner li:eq("+i+")").addClass("selected");
					var stateSelect = $("#stateSelectShip option:selected").html();
					$("#stateSelectShip").parent().find("span.filter-option").html(stateSelect);
				}
				if(msgArr[4]!=null && msgArr[4]!="null")
					$("#zip").val(msgArr[4]);
				if(msgArr[5]!=null && msgArr[5]!="null" && msgArr[5].trim() != ""){
				     $("#countrySelect").val(msgArr[5]);
				     var i = $("#countrySelect option[value='"+msgArr[5]+"']").index();
				     $("#countrySelect").parent().find(".dropdown-menu.inner li").removeClass("selected");
				     $("#countrySelect").parent().find(".dropdown-menu.inner li:eq("+i+")").addClass("selected");
				     var stateSelect = $("#countrySelect option:selected").html();
				     $("#countrySelect").parent().find("span.filter-option").html(stateSelect);
				    }else{
				     $("#countrySelect").val("US");
				     var i = $("#countrySelect option[value='US']").index();
				     $("#countrySelect").parent().find(".dropdown-menu.inner li").removeClass("selected");
				     $("#countrySelect").parent().find(".dropdown-menu.inner li:eq("+i+")").addClass("selected");
				     var stateSelect = $("#countrySelect option:selected").html();
				     $("#countrySelect").parent().find("span.filter-option").html(stateSelect);
				    }
				if(msgArr[6]!=null && msgArr[6]!="null")
					$("#billPhone").val(msgArr[6]);
				/*if($('#isInternationalUser').val()=='Y'){
					initCountry($('#countryCode').val(),'N','ADDRESS','Y');
				}else{
					initCountry($('#countryCode').val(),'N','ADDRESS','N');
				}*/
				if(msgArr[5]=='US' || msgArr[5]=='USA' ){
					$("#locUser").val("N");
				}else{
					$("#locUser").val("Y");
				}
				unblock();
			}
		});
	}else{
		$("#address1").val("");
		$("#address2").val("");
		$("#city").val("");
		$("#stateSelectShip").val("");
		$("#stateSelectShip").parent().find("span.filter-option").html("Select State");
		//$("#countrySelectShip").val("");
		$("#zip").val("");
		$("#billPhone").val("");
		$("#useEntityAddress").val("No");
	}
}
$(document).ready(function(){
	if ($("#email").val() != "") {
		$("#email").attr('readonly', true);
	}
});