var countrySelect = new initCountry({
	country: "US",
	selectorID: "countrySelect",
	defaultSelect: true
});

$(document).ready(function(){
	var isInterUser = $('#isInternationalUser').val();
	if(isInterUser=='Y'){
		document.getElementById("chkInternationalUser").checked = true;
		if($('#chkInternationalUser').is(':checked')){
			RefreshPageForInternationalUser();
		}else{
			document.getElementById("chkInternationalUser").checked = true;
			RefreshPageForInternationalUser();
		}
	}
	/*$("#newPurchaseAgentForm").submit(function(){
		block("Please Wait");
		var str = $(this).serialize();
		$.ajax({
			type: "POST",
			url: "AddNewPurchaseAgentUnit.action?"+str,
			data: "",
			success: function(msg){
				var arr = msg.split('|');
				unBlock();
				if(arr[0]==0){
					message = "The Purchasing Agent was successfully added.<br/> Login credentials have been emailed to "+$("#contactemailAddress").val();
					showNotificationDiv("success",message);
					setTimeout(function(){window.location.href=$("base").attr("href")+"/AgentDetailsUnit.action?userId="+arr[2];} , 5000);   
				}else{
					msg = msg.replace(/\|/g,"<br/>");
					showNotificationDiv("error",msg);
				}
			}
		});
		return false;
	});*/
});
function RefreshPageForInternationalUser(){
	if($('#chkInternationalUser').is(':checked')){
		$("#locUser").val("Y");
		if($('#getentityAddress').is(':checked')){
			$('#getentityAddress').prop('checked', false);
		}
		$("#getentityAddress").prop("disabled", true);
	}else{
		$("#locUser").val("N");
		$("#getentityAddress").removeAttr("disabled");
	}
}
function getEntityAddress(obj){
	if(obj.checked){
		block("Please Wait");
		str = "test=1";
		$.ajax({
			type: "POST",
			url: "autoFillAddressUnit.action",
			data: str,
			success: function(msg){
				msgArr = msg.split("|");
				if(msgArr[0]!=null && msgArr[0]!="null")
					$("#contactAddress1").val(msgArr[0]);
				if(msgArr[1]!=null && msgArr[1]!="null")
					$("#contactAddress2").val(msgArr[1]);
				if(msgArr[2]!=null && msgArr[2]!="null")
					$("#contactCity").val(msgArr[2]);
				if(msgArr[3]!=null && msgArr[3]!="null"){
					$("#stateSelect").val(msgArr[3]);
					var i = $("#stateSelect option[value='"+msgArr[3]+"']").index();
					$("#stateSelect").parent().find(".dropdown-menu.inner li").removeClass("selected");
					$("#stateSelect").parent().find(".dropdown-menu.inner li:eq("+i+")").addClass("selected");
					var stateSelect = $("#stateSelect option:selected").html();
					$("#stateSelect").parent().find("span.filter-option").html(stateSelect);
				}
				if(msgArr[4]!=null && msgArr[4]!="null")
					$("#zip").val(msgArr[4]);
				if(msgArr[5]!=null && msgArr[5]!="null")
					$("#countrySelect").val(msgArr[5]);
				if(msgArr[6]!=null && msgArr[6]!="null")
					$("#contactPhone").val(msgArr[6]);

				/*if($('#isInternationalUser').val()=='Y'){
					initCountry(msgArr[5],'Y','ACNT','Y');
				}else{
					initCountry('USA','N','ACNT','N');
				}*/

				if(msgArr[5]=='US' || msgArr[5]=='USA' ){
					$("#locUser").val("N");
				}else{
					$("#locUser").val("Y");
				}
				if ($(".formatZipCode").length > 0) {
					$(".formatZipCode").val(function(i, val) {
						val = val.replace(/(\d\d\d\d\d)(\d\d\d\d)/, "$1-$2");
						return val;
					});
				}
				unblock();
			}
		});
	}else{
		$("#contactAddress1").val("");
		$("#contactAddress2").val("");
		$("#contactCity").val("");
		$("#stateSelect").val("");
		//$("#countrySelect").val("");
		$("#contactPoBox").val("");
		$("#contactPhone").val("");
		$("#stateSelect").parent().find("span.filter-option").html("Select State");
		$("#zip").val("");
	}
}