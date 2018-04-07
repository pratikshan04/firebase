		function testCompare(id){
			hideNotificationDiv();
			$("#"+id).attr('onChange','testDelete(this.id);');
			$("#"+id).attr('class','changed');
			if($("#userRole").val()=="generalUser")
			{
				$("#radioGroup").show(200);
			}else{
				$('input[name="userToAssign"]').removeAttr('checked');
				$("#radioGroup").hide(200);
			}
			if ($("#"+id).is(':radio')) {
				$("#radioGroup").attr("class","changed");
				$('#apaSet').val("Y");
			}
			if($("#isBusyUser").val()==1 && $("#"+id).val()=="generalUser"){
				showNotificationDiv(message, "Privilege Cannot be Modified as the User is an Authorised Purchase Agent for some users")
				setTimeout(function(){hideNotificationDiv();} , 8000);
				$("#"+id).attr('onChange','testCompare(this.id);');
				$("#radioGroup").hide(200);
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
			}else{
				$('input[name="userToAssign"]').removeAttr('checked');
				$("#radioGroup").hide(200);
			}
		if ($("#"+id).is(':radio')) {
			$('#apaSet').val("Y");
		}
		}
		function hideAutho(){
			if($("#userRole").val()=="generalUser")
			{
			$("#radioGroup").show(200);
			}
			else
			{
			$('input[name="userToAssign"]').removeAttr('checked');
			$("#radioGroup").hide(200);
			}
		
		}
		$(document).ready(function(){
		if($("#isGeneralUser").val()=="Y"){
			$("#radioGroup").show(200);
		}else{
			$('input[name="userToAssign"]').removeAttr('checked');
			$("#radioGroup").hide(200);
		}
		});
function submitForm(){
	$("#manageForm").submit();
}
$(document).ready(function(){
		hideNotificationDiv();
		hideAutho();
		$("#manageForm").submit(function(){
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
			}
			if($("#checkBoxGroup").attr("class")=="changed"){
				status=status+0;
			}
			if(status.match(/^\d+$/)) {changed="Y";}else{changed="N";}
			if (changed=='Y'){
				$("#updateBtn").val("Please wait");
				$("#updateBtn").attr("disabled","disabled");
				block();
				var str = $(this).serialize();
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
							unBlock();
							showNotificationDiv(message,"");
							//$("#message").html(message);
							setTimeout(function(){window.location.reload();} , 5000);  
							//block(); window.location.reload();

						}else if(arrRes[0]==0){
							if(arrRes[1]!=null){
								message = message+arrRes[1]+"<br/>";
								unBlock();
								showNotificationDiv("",message);
								//$("#errorMsg").html(message);
								$("#updateBtn").val("Update");
								$("#updateBtn").removeAttr("disabled");
							}
						}
					}
				});
				return false;


			}else if(changed=='N'){
				showNotificationDiv("","No Changes Has Been Made");
				//$("#errorMsg").html("No Changes Has Been Made");
				setTimeout(function(){hideNotificationDiv();} , 5000);
				return false;

			}
		});
	});	