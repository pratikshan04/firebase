function disableUser(userID){
	bootbox.confirm({
		size: "small",
		closeButton:false,
		message: "Are you sure you want to disable the user?",
		title: "<span class='text-warning'>Warning &nbsp;&nbsp;<i class='glyphicon glyphicon-alert'></i></span>",
		callback: function(result){
			if(result){
				block("Please Wait");
				$.post('DisableAgentUnit.action?userId='+userID ,function(data,status){
					unblock();
					if(data=="sessionexpired"){
						window.location.href="doLogOff.action";
					}else{
						showNotificationDiv("Success",data);
						$('#status_'+userID).addClass('active text-right').html('Enable');
						$('#status_'+userID).parent().attr("data-original-title","Enable");
						setTimeout(function(){window.location.reload();} ,1000);
					}
				})
			}
		}
	});
}
function enableUser(userID){
	bootbox.confirm({
		size: "small",
		closeButton:false,
		message: "Are you sure you want to enable the user?",
		title: "<span class='text-warning'>Warning &nbsp;&nbsp;<i class='glyphicon glyphicon-alert'></i></span>",
		callback: function(result){
			if(result){
				block("Please Wait");
				$.post('EnableAgentUnit.action?userId='+userID ,function(data,status){
					unblock();
					if(data=="sessionexpired"){
						window.location.href="doLogOff.action";
					}else{
						showNotificationDiv("Success",data);
						setTimeout(function(){window.location.reload();} ,1000);
					}
				});
			}
		}
	});
}
function editUserDetails(userID){
	block('Please Wait');
	$.post('AgentDetailsUnit.action?userId='+userID,function(data,status){
		unblock();
		$('#editUserDetailsBlock').html(data);
		toggleDisplayBlocks('usersListBlock','editUserDetailsBlock');
		$('.selectpicker').selectpicker('refresh');
	});
}
function toggleDisplayBlocks(hideDiv,ShowDiv){
	$('#'+hideDiv).fadeOut();
	$('#'+ShowDiv).fadeIn();
}
var countrySelect = new initCountry({
	country: "US",
	selectorID: "countrySelect",
	defaultSelect: true
});
function RefreshPageForInternationalUser(){
	if($('#chkInternationalUser').is(':checked')){
		$("#locUser").val("Y");
		if($('#getentityAddress').is(':checked')){
			$('#getentityAddress').attr('checked', false);
		}
		$("#getentityAddress").attr("disabled", true);
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
					$("#stateSelect").val(msgArr[3].toUpperCase());
					var i = $("#stateSelect option[value='"+msgArr[3].toUpperCase()+"']").index();
					$("#stateSelect").parent().find(".dropdown-menu.inner li").removeClass("selected");
					$("#stateSelect").parent().find(".dropdown-menu.inner li:eq("+i+")").addClass("selected");
					var stateSelect = $("#stateSelect option:selected").html();
					$("#stateSelect").parent().find("span.filter-option").html(stateSelect);
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
function testCompare(id){
	$("#"+id).attr('onChange','testDelete(this.id);');
	$("#"+id).attr('class','changed');
	if($("#userRole").val()=="generalUser")
	{
		$("#radioGroup").show(200);
		//$(".cimm_siteTableEnclosure").hide(100);
	}else{
		$('input[name="userToAssign"]').removeAttr('checked');
		$("#radioGroup").hide(100);
		//$(".cimm_siteTableEnclosure").show(200);
	}
	if ($("#"+id).is(':radio')) {
		$("#radioGroup").attr("class","changed");
		$('#apaSet').val("Y");
	}
	if($("#isBusyUser").val()==1 && $("#"+id).val()=="generalUser"){
		showNotificationDiv(message, "Privilege cannot be modified as the User is an Authorized Purchasing Agent for other user(s)")
		$("#"+id).attr('onChange','testCompare(this.id);');
		$("#radioGroup").hide(100);
		//$(".cimm_siteTableEnclosure").show(200);
		$("#"+id).attr('class','NotChanged');
		$("#isAPA").attr("checked","checked");
		if($("#isAuthPurchaseAgent").val()=="Y")
		$("#"+id).val("purchaseAgent");
		if($("#isSuperUser").val()=="Y")
			$("#"+id).val("superUser");
	}
	if($("#"+id).is(':checkbox')){
		$("#checkBoxGroup").attr("class","changed");
	}
	
}
function testDelete(id){
	$("#"+id).attr('onChange','testCompare(this.id);');
	$("#"+id).attr('class','NotChanged');

	if($("#userRole").val()=="generalUser")
	{
		$("#radioGroup").show(200);
		//$(".cimm_siteTableEnclosure").hide(200);
	}else{
		$('input[name="userToAssign"]').removeAttr('checked');
		$("#radioGroup").hide(200);
		//$(".cimm_siteTableEnclosure").show(200);
	}
if ($("#"+id).is(':radio')) {
	$('#apaSet').val("Y");
}
}
function hideAutho(){
	if($("#userRole").val()=="generalUser"){
		$("#radioGroup").show(200);
	}else{
		$('input[name="userToAssign"]').removeAttr('checked');
		$("#radioGroup").hide(200);
	}
}
function submitForm(){
	$("#manageForm").submit();
}
$(document).ready(function(){
	if($("#isGeneralUser").val()=="Y"){
		$("#radioGroup").show(200);
	}else{
		$('input[name="userToAssign"]').removeAttr('checked');
		$("#radioGroup").hide(200);
	}
	var isInterUser = $('#isInternationalUser').val();
	/*if(isInterUser=='Y'){
		document.getElementById("chkInternationalUser").checked = true;
		if($('#chkInternationalUser').is(':checked')){
			RefreshPageForInternationalUser();
		}else{
			document.getElementById("chkInternationalUser").checked = true;
			RefreshPageForInternationalUser();
		}
	}*/
	$('#ManagePurchaseAgent').DataTable({
		"order" : [[0, 'desc']],
		"columnDefs": [{ orderable: false, targets: -1 }],
		dom: 'Bfrtip',
		buttons: [
            {
                text: 'Add New User',"className": 'cimm_inlineButton siteBtn',
                action: function ( e, dt, node, config ) {
                	toggleDisplayBlocks('usersListBlock','addNewUserBlock');
                }
            }
        ],
		"language": {
			"search":"_INPUT_",
	        "searchPlaceholder":"Search User",
	        "sLengthMenu" :"Show _MENU_",
	        "emptyTable": "No Users for this Account",
	        "oPaginate" : {
	        	"sPrevious" :"Prev",
	            "sNext" :"Next"
	        }
	    }
	});
	hideAutho();
});	
function updateUser(){
	var status="";
	var changed="";
	var assigned="";
	var apaSet = $('#apaSet').val();
	var isAuthPurc = $('#isAuthPurchaseAgent').val();
	var isSuper =$('#isSuper').val();
	$("#userRole").each(function(){
		if ($(this).attr('class')=="changed"){
			status=status+0;
		}		
	});
	if($("#radioGroup").attr("class")=="changed" || ($("#isChanged").length > 0 && $("#isChanged").val()=="Y")){
		status=status+0;
		$("input[type='radio']:checked").each(function(){
			assigned=$(this).attr("id");
		});
	}else{
		$("input[type='radio']:checked").each(function(){
			assigned=$(this).attr("id");
		});
		if($("#userRole").val() == 'superUser')
		{
			assigned="";
		}
	}
	if($("#checkBoxGroup").attr("class")=="changed"){
		status=status+0;
	}
	if(status.match(/^\d+$/)) {changed="Y";}else{changed="N";}
	if (changed=='Y'){
		$("#updateBtn").val("Please wait");
		$("#updateBtn").attr("disabled","disabled");
		block('Please Wait');
		var str = $('#manageForm').serialize();
		str=str+"&assignedNewId="+assigned;
		$.ajax({
			type: "POST",
			url: "AssignShipToForAgentUnit.action",
			data: str,
			success: function(msg){
				var arrRes = msg.split("|");
				var message = "";
				if (arrRes[0]==1){
					if(arrRes[1]!=null){
						message = message+arrRes[1]+"<br/>";
					}
					if(arrRes[2]!=null){
						message = message+arrRes[2]+"<br/>";
					}
					if(arrRes[3]!=null){
						message = message+arrRes[3]+"<br/>";
					}
					unblock();
					showNotificationDiv("success",message);
					setTimeout(function(){window.location.reload();} , 4000);  
				}else if(arrRes[0]==0){
					if(arrRes[1]!=null){
						message = message+arrRes[1]+"<br/>";
						unblock();
						showNotificationDiv("error",message);
						$("#updateBtn").val("Update");
						$("#updateBtn").removeAttr("disabled");
					}
				}
			}
		});
		return false;
	}else if(changed=='N'){
		showNotificationDiv("error","No Changes Has Been Made");
		return false;

	}
}