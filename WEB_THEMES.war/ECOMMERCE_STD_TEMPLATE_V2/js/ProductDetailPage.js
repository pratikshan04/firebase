var webThemes = $("#webThemePath").val();
jQuery.getScript(webThemes+'js/jquery.raty.min.js', function(){
	$('#ProdRating').raty({
		path:webThemes+'images/',	
		readOnly:true,
		half:true,
		score: $('#overAllRate').val(),
		hints:["Poor","Fair","Average","Good","Excellent"],
		});
	$('#rateit').raty({
		path: webThemes+'images/', 
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
			path:webThemes+'images/',
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
$.getScript(webThemes+'js/multiTab.min.js', function(){
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
	filterScroll();
	priceLoadMainFunction();
	ProductMode.buildSearchTrail();
	disableCustomCheckbox();
	ProductMode.checkCookieToCheck();
	checkItem();
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
			slidesToShow: 3,
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
		$($clicked).parent('.selectOptions').find(".cimm_drop > em").toggleClass("fa-angle-down fa-angle-right");
    }else{
		$(".selectOptions").find('ul.scroll').slideUp();
		$('.selectOptions').find(".cimm_drop > em").addClass("fa-angle-down");
      }
});
var custflag = 0;
$(document).delegate('[data-function="customerPartNumber"]', 'click',function(){
	var toggleListID = "#"+$(this).attr('data-listTarget');
	var itemId = $(this).attr('data-itemId');
	var partNum = $("#itmId_"+itemId).val();
	$(toggleListID).html('<li class="alignCenter"><em class="fa fa-spin fa-spinner"></em></li>');
	jQuery.get('customerPartNumbersPage.action?itemPriceId='+itemId+'&partNumber='+partNum,function(data,status){
		$(toggleListID).find("li").remove();
		$(toggleListID).html(data);
	});
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
			}else{
				$("[name='customPartNumList']").each(function(){
					if($(this).val().toLowerCase() == newCustPartNum.toLowerCase()){
						bootAlert("small","error","Error","Customer Part Number already exists.");
						request = false;
					}
				});
				if(performAction.id == "add"){
					if(request) {
						block("Please wait");
						jQuery.get('addCustomerPartNumberPage.action?keyWord='+newCustPartNum+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val(),function(e,status){
							unblock();
							var msg = e.substring(0,e.indexOf("|"));
							var cpn = e.substring(e.indexOf("|")+1);
							if(cpn != "" && cpn !="Error occured while process your request"){
								$("#custMainBlock").show();
								$("#custPartBlock").html("");
								$("#custPartBlock").html(cpn);
								$("#customerPartNumSubmit ul").html('<li class="text-success">'+msg+'</li>');
							}else {
								$("#custMainBlock").hide();
								$("#customerPartNumSubmit ul").html('<li class="text-danger">'+cpn+'</li>');
							}
							setTimeout(function(){$("#customerPartNumSubmit").hide();$(".dropdown-backdrop").remove();$("#customerPartNumSubmit").parent().removeClass('open');}, 3000);
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
							block("Please wait");
							var cpnVal = $(performAction).parent().parent().find('input:checkbox:checked').val();
							var cpnId = $(performAction).parent().parent().find('input:checkbox:checked').attr('id');
							jQuery.get('updateCustomerPartNumberPage.action?newCpn='+newCustPartNum+"&oldCpn="+cpnVal+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val()+"&vpsid="+cpnId,function(e,status){
								unblock();
								var msg = e.substring(0,e.indexOf("|"));
								var cpn = e.substring(e.indexOf("|")+1);
								if(cpn != "" && cpn !="Error occured while process your request"){
									$("#custMainBlock").show();
									$("#custPartBlock").html("");
									$("#custPartBlock").html(cpn);
									$("#customerPartNumSubmit ul").html('<li class="text-success">Customer Part Number Updated Successfully</li>');
								}else {
									$("#custMainBlock").hide();
									$("#customerPartNumSubmit ul").html('<li class="text-danger">'+cpn+'</li>');
								}
								setTimeout(function(){$("#customerPartNumSubmit").hide();$(".dropdown-backdrop").remove();$("#customerPartNumSubmit").parent().removeClass('open');}, 3000);
							});
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
	}else{
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
			block("Please wait");
			jQuery.get('removeCustomerPartNumberPage.action?vpsid='+cPartList+"&itemPriceId="+$("#hidden_ItemID").val()+"&partNumber="+$("#hidden_PartNum").val()+"&custPnum="+cPartNums,function(e,status){
				unblock();
				var msg = e.substring(0,e.indexOf("|"));
				var cpn = e.substring(e.indexOf("|")+1);
				if(cpn != "" && cpn !="Error occured while process your request"){
					$("#custMainBlock").show();
					$("#custPartBlock").html("");
					$("#custPartBlock").html(cpn);
					$("#customerPartNumSubmit ul").html('<li class="text-success">'+msg+'</li>');
				}else if(cpn == "" && msg == "Customer Part Number Removed Successfully"){
					$("#custMainBlock").hide();
					$("#customerPartNumSubmit ul").html('<li class="text-success">'+msg+'</li>');
				}else {
					$("#custMainBlock").hide();
					$("#customerPartNumSubmit ul").html('<li class="text-danger">'+cpn+'</li>');
				}
				setTimeout(function(){$("#customerPartNumSubmit").hide();$(".dropdown-backdrop").remove();$("#customerPartNumSubmit").parent().removeClass('open');}, 3000);
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
/********* V5 **********/
var collection = $(".filterSelClass");
if(collection){
	collection.each(function() {
		try{
			var obj = jQuery(this);
			var selValData = selData[obj.attr("data-id")];
			jQuery.each(selValData, function(key, val) {
				for(i=0;i<val.length;i++){
					var find = '&nbsp;';
					var re = new RegExp(find, 'g');
					var re1 = new RegExp(" ", 'g');
					if(itemIdFilter == val[i]){
						var j=0;
						jQuery(obj).children('option').each( function() {
							var test = jQuery(this);
							var val1 = test.val().replace(re,"");
							var val2 = key.replace(re," ");
							val1 = val1.replace(/\s/g, "");
							var val2 = val2.replace(/\s/g,"");
							if(String(val1.toLowerCase()) === String(val2.toLowerCase())) {
								obj.prop('selectedIndex', j)
							}
							j++;
						});
						break;
					}
				}
			});
		}catch(e){
			console.log(e);
		}
	});
}
function changeSelection(obj){
	try{
		var find = '&nbsp;';
		var re = new RegExp(find, 'g');
		var re1 = new RegExp(" ", 'g');
		var c = "";
		var selVal = jQuery(obj).attr("data-id");
		 var count = 1;
		 var selectedItem = false;
		 var isError = false;
		 var selectedItemId = 0;
		 var selValData = selData[selVal.replace(/\//g,"_")];
		 var selectedVal = jQuery(obj).attr("id");
		 var selValId = selValData[Encoder.htmlEncode(jQuery("#"+selectedVal+" option:selected").val())];

		if(selValId.length == 1){
			block('Please Wait');
			window.location.href = "/"+itemMapFilter[selValId[0]]+"/product/"+$("#selItem_"+selValId[0]).val();
		}else{
			var errorId = "";
			var collection = $("select.filterSelClass");
			collection.each(function() {
				var obj = jQuery(this);
				var changeItem = true;
				var selValDataSub = selData[obj.attr("id")];
				if(selVal!=obj.attr("id")){
					var selectedOptionVal = obj.val();
					jQuery.each(selValDataSub, function(key, val) {
						selectedItem = false;
						console.log(selectedOptionVal + " - " + key+"-");
						var val1 = selectedOptionVal.replace(re,"");
						var val2 = key.replace(re," ");
						val1 = val1.replace(/\s/g, "");
						val2 = val2.replace(re1,"");
						if(String(val1.toLowerCase()) === String(val2.toLowerCase())){
							selectedItem = true;
						}
						for(j=0;j<selValId.length;j++){
							for(i=0;i<val.length;i++){
								if(selValId[j] == val[i]){
								console.log("itemId : " + selValId[j]);
									if(selectedItem){
										selectedItemId = selValId[j];
										changeItem =false;
									}
								}
							}
						}
					});
					console.log(changeItem);
					if(changeItem ==true){
						obj.empty().append('<option value="">---Select---</option>');;
						isError = true;
						errorId = errorId + c + obj.attr("id");
						jQuery.each(selValDataSub, function(key, val) {
							for(j=0;j<selValId.length;j++){
								for(i=0;i<val.length;i++){
									if(selValId[j] == val[i]){
										obj.append($("<option></option>").attr("value",key).text(key)); 
									}
								}
							}
						});
						c = ",";
						$('.filterSelClass').selectpicker('refresh');
					}
				}
			});
			if(isError)
				alert("Please select value for "+errorId);
			else
				window.location.href = "/"+itemMapFilter[selValId[0]]+"/product/"+$("#selItem_"+selValId[0]).val();
				console.log("selected : " + selectedItemId);
		}
	}catch(e){
		console.log(e);
	}
}
var currentItemId = '['+$("#currentSelectedItemId").val()+']';
$('.filterSelClass option[id="'+currentItemId+'"]').attr("selected", "selected");

/********* V5 **********/