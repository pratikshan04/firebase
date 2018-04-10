var webThemes = $("#webThemePath").val();
jQuery.getScript(webThemes+'js/jquery.raty.min.js', function(){
	$('#ProdRating').raty({
		path:webThemes+'/images/',	
		readOnly:true,
		half:true,
		score: $('#overAllRate').val(),
		hints:["Poor","Fair","Average","Good","Excellent"],
		});
	$('#rateit').raty({
		path: webThemes+'/images/', 
		cancel    : true,
		cancelOn  : 'cancel-on.png',
		cancelOff : 'cancel-off.png',
		half:true,
		hints		: [null, null, null, null, null],
		target:"#rateit2",
		targetType:'number',
		targetKeep   : true,
		cancelHint  : 'Remove Rating!',
		click       : function(score, evt) {
			if(score==""||score==null)
			$('input[name="rating"]').val("");
			else
			$('input[name="rating"]').val(score);
		}
   });
	$('input[name="voteit3"]').each(function(){
		var input = $(this).attr("id"); 
		var val = parseFloat($(this).val());
		$('.voteit'+input).raty({
			readOnly:true,
			path:webThemes+'/images/',
			half:true,
			hints:[null,null,null,null,null],
			score: val
		});
	});
});
jQuery.getScript(webThemes+'js/jquery.elevatezoom.js', function(){
	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		jQuery(".initZoom").elevateZoom({
			gallery:'gallery',
			galleryActiveClass: 'active',
			cursor: "crosshair",
			imageCrossfade: true,
			easing : true,
			scrollZoom : true,
			zoomWindowWidth: 300,
            zoomWindowHeight: 300,
            borderSize: 1,
			borderColour: "#e7e7e7"
		});
	}
});
jQuery.getScript(webThemes+'js/jquery.prettyPhoto.js', function(){
	$("a[rel^='prettyPhoto']").prettyPhoto({
		allow_resize: true,
		social_tools: false
	});
});
jQuery.getScript(webThemes+'js/jquery.timeago.js', function(){
	$("abbr.timeago").timeago();
});
$.getScript(webThemes+'/js/multiTab.min.js', function(){
	$('#multiTabOne').multiTab({
		   tabHeading: '.multiTabHeading',
		   contentWrap: '.multiTabContent',
		   transitionEffect: "fade",
		   accordion: true,
		   showAllTab: true
	});
});
jQuery.getScript(webThemes+'js/BulkAction.js', function(){
	BulkAction.enableCheckBoxOnLoad();
});
$("#reviewbox").on("click",function(){
	$('#reviewwritebox').fadeIn();
});
var imageId = $('#detailImageId').val();
jQuery("#"+imageId).bind("click", function(e) {  
	e.preventDefault();
	return false;
});
$('.thumblist li img').on('click' , function(){
	var origImg = $(this).parent().attr("data-image");
	var thumblistImg = $(this).parent().attr("data-zoom-image");
	$('.imgEnlargeIcon').attr('href' , thumblistImg);
	$("#"+imageId).attr('src', origImg);
});

$(document).ready(function(){
	priceLoadMainFunction();
	filterScroll();
	ProductMode.buildSearchTrail();
	disableCustomCheckbox();
	ProductMode.checkCookieToCheck();
	ProductMode.loadPriceInDataTable();
	if($('.verticalThumblist .thumblist').length > 0){
		$('.verticalThumblist .thumblist').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			vertical: true,
			responsive: [
		           {
		             breakpoint: 993,
		             settings: {
		            	vertical: false,
		             }
		           }
		         ]
		});
	}else{
		$('.thumblist').slick({
			infinite: true,
			slidesToShow: 6,
			slidesToScroll: 1,
		});
	}
	$('#customerAlsoBought').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
		           {
		             breakpoint: 768,
		             settings: {
		               slidesToShow: 3,
		             }
		           },
		           {
		             breakpoint: 480,
		             settings: {
		               slidesToShow: 2,
		             }
		           }
		         ]
		});
	$('.allBranchWrap .cimm_siteTableEnclosure').slimScroll({
		color: '#565F65',
		size: '7px',
		height: '233px',
		alwaysVisible: true,
		opacity:'0.8'
	});
	
	setTimeout(function(){
		$('#customerAlsoViewedContent').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			vertical: true,
			verticalSwiping: true,
			responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 4,
								vertical: false,
								verticalSwiping: false,
							}
						},
						{
							breakpoint: 600,
							settings: {
								slidesToShow: 3,
								vertical: false,
								verticalSwiping: false,
							}
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 2,
								vertical: false,
								verticalSwiping: false,
							}
						}
					]
		});
		var liHeight = $("#customerAlsoViewedContent li.slick-slide").innerHeight();
		var liHeightWrap = liHeight*3;
		$("#customerAlsoViewedContent .slick-list.draggable").height(liHeightWrap-10);
	}, 4000);
	$(".customDropdown dt a").click(function() {
        $(".customDropdown dd ul").toggle();
    });
    $(".customDropdown dd ul li a").click(function() {
        var text = $(this).html();
        $("#multipleAddApplyBtn").data("perform",$(this).data("perform"));
        $(".customDropdown dt a").html(text);
        $(".customDropdown dd ul").hide();
    });
    function getSelectedValue(id) {
        return $("#" + id).find("dt a span.value").html();
    }
    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (! $clicked.parents().hasClass("customDropdown"))
            $(".customDropdown dd ul").hide();
    });
    //getCpnFromErp();
});
$(document).bind('click', function(e) {
	var $clicked = $(e.target);
    if ($clicked.hasClass("select_attributeList")){
		$($clicked).parent('.selectOptions').find('ul.scroll').slideToggle();
		$($clicked).parent('.selectOptions').find(".cimm_drop > i").toggleClass("fa-angle-down fa-angle-right");
    }else{
		$(".selectOptions").find('ul.scroll').slideUp();
		$('.selectOptions').find(".cimm_drop > i").addClass("fa-angle-down");
      }
});

var custflag = 0;
$('[data-function="customerPartNumber"]').click(function() {
	var toggleListID = "#"+$(this).attr('data-listTarget');
	var itemId = $(this).attr('data-itemId');
	var partNum = $("#itmId_"+itemId).val();
	if($(toggleListID).find('li').length<=1){
		if($(toggleListID).find('li').length<=0){
			$("#customerPartNumSubmit").find("ul").append("<ul id=ulgCust_"+itemId+"><li class='alignCenter'><i class='fa fa-spin fa-spinner'></i></li></ul>");
		}
		jQuery.get('customerPartNumbersPage.action?itemPriceId='+itemId+'&partNumber='+partNum,function(data,status){
			$("#customerPartNumSubmit").find('li').remove();
			$(toggleListID).html(data);
			$("#customerPartNumSubmit").show();
			custflag = 1;
		});
	}
});

function manageCustomerPartNumber(performAction){
	var cPartList = "";
	var cPartNums = "";
	var request = true;
	var newCustPartNum = $.trim($("#newCustomerPartNumber").val());
	var toggleListID = '#'+$(performAction).parent().parent().attr('id');
	var cPartNumbervalue=$.trim(newCustPartNum).length;
	var characterReg = /^[-_ a-zA-Z0-9]+$/;
	if(performAction.id != "remove"){
		if(newCustPartNum == "" || newCustPartNum == "Enter New Customer Part Number"  || cPartNumbervalue == 0){
			bootAlert("small","error","Error","Please Enter Valid Customer Part Number.");
			$("#newCustomerPartNumber").focus();
			request = false;
		}else{
			if(!characterReg.test(newCustPartNum)){
				bootAlert("medium","error","Error","Please Enter Valid Customer Part Number with no special character except underscore or hyphen ( _ , - ).");
				return false;
			}
			else{
				$("[name='customPartNumList']").each(function(){
					if($(this).val().toLowerCase() == newCustPartNum.toLowerCase()){
						bootAlert("small","error","Error","Customer Part Number already exists.");
						request = false;
					}
				});
				if(performAction.id == "add"){
					if(request) {
						jQuery.get('addCustomerPartNumberPage.action?keyWord='+newCustPartNum+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val(),function(e,status){
							var msg = e.substring(0,e.indexOf("|"));
							var cpn = e.substring(e.indexOf("|")+1);
							if(cpn != "" && cpn !="Error occured while process your request"){
								$("#custMainBlock").show();
								$("#custPartBlock").html("");
								$("#custPartBlock").html(cpn);
							}else {
								$("#custMainBlock").hide();
							}
							$("#newCustomerPartNumber").val(locale('customerPartNumber.label.enterNewCustomerpartNumber'));
							$(toggleListID).find('li').remove();
							$("#customerPartNumSubmit").find('li').remove();
							$("#customerPartNumSubmit").hide();
						});
					}else{
						return false;
					}
				}else if(performAction.id == "update"){
					if(request) {
						var checkedCPN = 0;
						$("input:checkbox[name='customPartNumList']:checked").each(function() {
							checkedCPN = checkedCPN + 1;
						});
						if(checkedCPN!=0){
							var cpnCheck = $("input:checkbox[name='customPartNumList']:checked").length;
							if(cpnCheck < 0){
								bootAlert("medium","error","Error","Please update the selected customer part number.");
								request = false;
							}else{
									var cpnVal = $(performAction).parent().parent().find('input:checkbox:checked').val();
									var cpnId = $(performAction).parent().parent().find('input:checkbox:checked').attr('id');
									jQuery.get('updateCustomerPartNumberPage.action?newCpn='+newCustPartNum+"&oldCpn="+cpnVal+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val()+"&vpsid="+cpnId,function(e,status){
										var msg = e.substring(0,e.indexOf("|"));
										var cpn = e.substring(e.indexOf("|")+1);
										if(cpn != "" && cpn !="Error occured while process your request"){
											$("#custMainBlock").show();
											$("#custPartBlock").html("");
											$("#custPartBlock").html(cpn);
										}else {
											$("#custMainBlock").hide();
										}
										$("#newCustomerPartNumber").val(locale('customerPartNumber.label.enterNewCustomerpartNumber'));
										$(toggleListID).find('li').remove();
										$("#customerPartNumSubmit").find('li').remove();
										$("#customerPartNumSubmit").hide();
									});
								}
						}else{
							bootAlert("medium","error","Error","Please select atleast one customer part# to update.");
							request = false;
						}
					}else{
						return false;
					}
				}
			}
		}
	}
	else{
		$("[name='customPartNumList']").each(function(){
			if($(this).is(':checked')){
				if(cPartList == ""){
					cPartList =  this.id;
					cPartNums = $("#"+this.id).val();
				}else{
					cPartList =  cPartList + ","+ this.id;
					cPartNums = cPartNums + ","+ $("#"+this.id).val();
				}
			}
		});
		if(cPartList == ""){
			bootAlert("small","error","Error","Please Select Customer Part Number.");
		}else {
			jQuery.get('removeCustomerPartNumberPage.action?vpsid='+cPartList+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val()+"&custPnum="+cPartNums,function(e,status){
				var msg = e.substring(0,e.indexOf("|"));
				var cpn = e.substring(e.indexOf("|")+1);
				if(cpn != "" && cpn !="Error occured while process your request"){
					$("#custMainBlock").show();
					$("#custPartBlock").html("");
					$("#custPartBlock").html(cpn);
				}else {
					$("#custMainBlock").hide();
				}
				$("#newCustomerPartNumber").val(locale('customerPartNumber.label.enterNewCustomerpartNumber'));
				$(toggleListID).find('li').remove();
				$("#customerPartNumSubmit").find('li').remove();
				$("#customerPartNumSubmit").hide();
			});
		}
	}
}	

function runScriptAddCustPnum(e) {
	if (e.keyCode == 13) {
		$('#add').click();
		return false;
	}
}
function runScriptUpdateCustPnum(e) {
	if (e.keyCode == 13) {
		$('#update').click();
		return false;
	}
}

function qtyUpdate(id,action)
{
	var qtyValue = parseInt($(id).val());
	if(action == "decr"){
		if(qtyValue == 1)
			return false;
		else
			$(id).val(qtyValue-1);
	}
	else
		$(id).val(qtyValue+1);
}

/*** Share Page Scripts Start ***/

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var pagePath = $(location).attr('href');
$("#fbLike").attr("data-href",pagePath);
var srcUrl = pagePath;
var imgUrl =$('.imgForSend img').attr('src');
var pinDesc =$('.cimm_prodDetailTitle').text();
var completeUrl='//gb.pinterest.com/pin/create/button/?url='+srcUrl+'&media='+imgUrl+'&description='+pinDesc; 
$('#pinInt').attr("href",completeUrl);
$("#fbShare").attr("data-href",pagePath);
$("#TweetShare").attr("data-url",pagePath);
$("#gPlus").attr("data-href",pagePath);
$("#linkedInShare").attr("data-url",pagePath);
$(document).bind('click', function(e) {
	var $clicked = $(e.target);
	if ($clicked.parent().attr("id")== "sharePageTrigger")
		$('.sharePageWrap').addClass('sharePageWrapTog');
	else
		$('.sharePageWrap').removeClass('sharePageWrapTog');
});

/*** Share Page Scripts Ends ***/

/*** Review Submit Function **/
function submitReview(){
	var comments = $.trim($('#comments').val());
	var count =comments.length;
	$("#itemIdRev").val($("#itemIdTemp").val());
	var rate = $.trim($('#rating').val());
	var title = $.trim($('#title').val());
	var result="";
	if(rate==""||rate==null){
		result = result + "<p> Rating is required </p>";
	}
	if(title==""||title==null){
		result = result + "<p> Title is required </p>";
	}
	if(count<=10){
		if(comments==""||comments==null){
			result = result + "<p> Review Comment is required </p>";
		}else{
			result = result + "<p>  Atleast 10 Characters in Review Field  </p>";
		}
	}
	if (result == "") {
		var str = $("#reviewForm").serialize();
		var isUpdate = false;
		$.ajax({
			type: "POST",
			url: "addReviewPage.action",
			data: str,
			success: function(msg){
					var result = $.trim(msg);
					var arrRes = result.split("|");
					if($.trim(arrRes[0])=="0"){
						bootAlert('small','success','Success','Review Added Successfully.');
						window.location.reload();
					}else{
						bootAlert('small','error','Error',"Review Adding Failed");
						$("#savebtn").val("Submit Review");
						$("#savebtn").removeAttr("disabled");
					}
			}
		});
	}else{
		bootAlert('small','error','Error',result);
		//jAlert(result, 'Required Field.');
	}
	return false;
}

function populateBarnchavailabilities(products){
	for (var i = 0; i < products.length; i++) {
		product = products[i];	
		wareHouseList = product.branchAvail;
		if(wareHouseList.length>0){
		for (var j = 0; j < wareHouseList.length; j++) {
			wareHouseDetails = wareHouseList[j];
			populateAllBranchAvailability(wareHouseDetails);
			}
		}
	}
}

function getAllBranchAvailability(obj){
	var partNumbers = [];
	var partNumber = $(obj).attr('data-partnumbver') + "::"+$(obj).attr('data-qty');
	if(partNumber != undefined){
		block("Please wait...");
		$.ajax({
			url : 'getPriceDetailPage.action',
			type : "POST",
			data : {
				"productIdList" : partNumber,
				"LABAvailability" : "Y"
			},
			success : function(responseData) {
				if (responseData && responseData !=  '$renderContent') {
					var productDataList = JSON.parse(responseData);
					populateBarnchavailabilities(productDataList);
				} else {
				}
			},
			error : function(xhr, status, error) {
				
			}
		});
	}
}

function populateAllBranchAvailability(product) {
	var branchName, branchAvailability, newBranch;
	branchName = createTableCell(product.branchName);
	branchAvailability = createTableCell(product.branchAvailability);
	newBranch = createTableRow(branchName, branchAvailability);
	appendToAllBranchAvailability(newBranch, product.partNumber);
	unblock();
	$("#modalBodyContent").modal('show');
}

function appendNewBranch(product, branch) {
	//$(markUpPrefixes.ALL_BRANCH_AVAILABILITY + product.partNumber).append(branch);
	$(
			document.getElementById(markUpPrefixes.ALL_BRANCH_AVAILABILITY
					+ product.partNumber)).append(branch);
}

function createTableRow(branchName, branchAvailability) {
	return "<tr>" + branchName + branchAvailability + "</tr>";
}

function createTableCell(branchData) {
	return "<td class = 'center'> " + branchData + "</td>";
}

function appendToAllBranchAvailability(newBranch, partNumber) {
	if (document.getElementById("allBranchHTML")) {
		var currentTable = document.getElementById("allBranchHTML");
		$(currentTable).append(newBranch);
	}
}