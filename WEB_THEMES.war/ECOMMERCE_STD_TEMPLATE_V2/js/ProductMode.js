var refreshVersion =  $("#refreshVersion").val();
var webThemes = $("#webThemePath").val();
var cdnSiteJsPath = $("#cdnSiteJsPath").val();
var cdnModuleJsPath = $("#cdnModuleJsPath").val();
var cdnPluginJsPath = $("#cdnPluginJsPath").val();
var currentLayout  = "";if($("#layoutName").length > 0){ currentLayout  = $("#layoutName").val(); }
if( $.trim(currentLayout) != "ProductDetailPage"){
	$.getScript(cdnPluginJsPath+'/multiTab.min.js?'+refreshVersion, function(){
		$('#searchResultsStatic').multiTab({
			   tabHeading: '.multiTabHeading',
			   contentWrap: '.multiTabContent',
			   transitionEffect: "fade",
			   accordion: false,
			   showAllTab: false
		});
	});
}
var ProductMode = {};
(function() {
	//------------------------------------------------- Product Mode Filters Start
	ProductMode.removeKeyword = function(index){
		var keyText = jQuery("#keyWordTxtTrail").text();
		var attrList = jQuery("#attrFilterList").text();
		if(jQuery.trim(attrList)!="" ){
			jQuery("#multiFilterAttrList").val(attrList);
		}
		if(jQuery.trim(keyText)!="") {
			var keyArr = keyText.split("|");
			if(keyArr.length>0){
				keyArr.splice(index,1);
				jQuery("#keyWordTxtMulti").val( keyArr.join("|"));
				if(keyArr.length<1)
					keyText = "";
			}else{
				keyText = "";
			}
			jQuery("#multiFilterAttributeForm").submit();
		}
	};
	//function removeKeyword(index){}
	ProductMode.buildSearchTrail = function(id){
		jQuery("#mulitFilterTrailDetailPage").html("");
		if(jQuery("#mulitFilterTrailDetailPage").length>0){
			var buildString = "";
			var keyText = jQuery("#keyWordTxtTrail").text();
			var attrList = "";
			if(id){
				attrList = $("#attrFilterContent_"+id).parent().find('#attrFilterList').text();
			}else{
				attrList = jQuery("#attrFilterList").text();
			}

			if(jQuery.trim(attrList)!=""){
				buildString = '<ol>';
			}
			if(jQuery.trim(attrList)!=""){
				var attrArr = attrList.split("~");
				console.log("Inside build");
				for(i=0;i<attrArr.length;i++){
					var valArr = attrArr[i].split(":");
					console.log("val arr : "+valArr);
					console.log(valArr[0].replace("attr_",""));

					var valListArr = valArr[1].split("|");
					buildString = buildString + '<li>';
					buildString = buildString + '<span class="Refine-label">';
					var dispVal = valArr[0].replace("attr_","");
					buildString= buildString + '<strong>'+dispVal+': </strong>';
					buildString = buildString + '</span>';

					var c = "";
					for(j=0;j<valListArr.length;j++){
						var attrValueTxt = valListArr[j].substring(1, valListArr[j].length-1);
						if(dispVal.toUpperCase()=="COLOR"){
							var splitAttrValue = attrValueTxt.split("`");
							attrValueTxt = splitAttrValue[0];
						}
						buildString = buildString + c + '<span class="refine-value">'+attrValueTxt+'<a class="removeFilter" href="javascript:void(0);" data-priceId="'+id+'" onclick="ProductMode.removeMultiAttr(this)" title="Remove This Item"><div style="display:none">'+valArr[0]+'</div><span style="display:none;">'+valListArr[j]+'</span> [<em class="fa fa-times"></em>]</a></span>';
						c = " ";
					}
					buildString = buildString + '</li>'; // For Filter results
				}
				console.log("build finished + " + buildString);
			}	

			if(jQuery.trim(attrList)!="" || jQuery.trim(keyText)!=""){
				buildString = buildString+'</ol>';
				jQuery("#mulitFilterTrailDetailPage").html(buildString);
			}
			$('.productSearch').val("");
		}
	};
	//function buildSearchTrail(){}
	
	ProductMode.removeMultiAttr = function(id){
		var priceId = $(id).attr('data-priceId');
		var key = jQuery(id).find("div").html();
		var val = unescape(jQuery(id).find("span").text());
		if(key=="BRAND")
			key = "brand";
		if(key=="CATEGORY")
			key = "category";

		if(priceId){
			attrList = $("#attrFilterContent_"+priceId).parent().find('#attrFilterList').text();
		}else{
			attrList = jQuery("#attrFilterList").text();
		}
		if(jQuery.trim(attrList)=="") {
			if(priceId){
				$("#attrFilterContent_"+priceId).parent().find('.multiSelectForm [name="attrFilterList"]').val(key+":"+val);
			}else{
				jQuery("#multiFilterAttrList").val(key+":"+val);
			}
			jQuery("#multiFilterAttrList").val(key+":"+val);
			console.log("woops empty attr : " + jQuery("#multiFilterAttrList").val());
		}else{
			var attrArr = attrList.split("~");
			var buildAttr = "";
			var c = "";
			var isBuild = false;
			for(i=0;i<attrArr.length;i++){
				if(buildAttr==""){ c = ""; }
				var valArr = attrArr[i].split(":");
				if(valArr[0] == key){
					var valListArr = valArr[1].split("|");
					if(valListArr.length>1){
						var k = "";
						var newVal = valArr[0]+":";
						for(j=0;j<valListArr.length;j++){
							if(valListArr[j]!=val){
								newVal = newVal + k + valListArr[j];
								k = "|";
							}
						} 
						buildAttr = buildAttr + c + newVal;
						isBuild = true;
					}else{
						isBuild = true;
					}
				}else{
					buildAttr = buildAttr + c + attrArr[i];
				}
				c = "~";
			}
			// buildAttr = Encoder.htmlEncode(buildAttr).replace(/\&quot;/g,'"');
			if(priceId){
				$("#attrFilterContent_"+priceId).parent().find('.multiSelectForm [name="attrFilterList"]').val(buildAttr);
			}else{
				jQuery("#multiFilterAttrList").val(buildAttr);
			}
			console.log("the Filtered list to append and buid : " + jQuery("#attrFilterList").text());
		}
		var navigationType = jQuery("#navigationType").val();
		var srchKeyword = jQuery("#srchKeyword").val();
		var srchTyp = jQuery("#srchTyp").val();
		if(priceId){
			$("#attrFilterContent_"+priceId).parent().find('.multiSelectForm').submit();
		}else{
			jQuery("#multiFilterAttributeForm").submit();
		}
	};
	//function removeMultiAttr(id){}

	ProductMode.removeAllMultiAttr = function(){
		try{
			if(jQuery("#multiFilterAttrList").val()!=null && jQuery("#multiFilterAttrList").val()!=""){
				jQuery("#multiFilterAttrList").val("");
				jQuery("#multiFilterAttributeForm").submit();
			}else if(jQuery('.activeFilterForm [name="attrFilterList"]').val()!=null && jQuery('.activeFilterForm [name="attrFilterList"]').val()!=""){
				jQuery('.activeFilterForm [name="attrFilterList"]').val("");
				jQuery(".activeFilterForm").submit();
			}else{
				bootAlert("small","error","Error","Filter is not applied");
				return false;
			}
		}catch(e){
			console.log(e);
		}
	};
	//function removeAllMultiAttr(){}
	ProductMode.appendSearchByCheckBox = function(id){
		$("[name='keyWord']").each(function(){
			$(this).val(Encoder.htmlEncode($(this).val()).replace(/\&quot;/g,'"'));
		});
		var chks = jQuery("input:checkbox[name='"+id+"']:checked");
		var key = "";
		var val = ""
			var c = "";
		if(chks.length>0){
			chks.each(function(){
				var tId = jQuery(this).attr("id");
				key = jQuery(this).parent().find("#"+tId+"_div").text();
				val = val+ c + '"'+unescape(jQuery(this).parent().find("#"+tId+"_span").text())+'"';
				c = "|";
			});
			ProductMode.appendSearch(key,val,chks)

		}else{
			bootAlert("small","error","Error","Please select an attribute to filter");
		}
	};
	//function appendSearchByCheckBox(id){}

	ProductMode.appendSearch = function(key,val,chksEl){
		if(typeof val!='undefined' && val!=null && val!=""){
			val = val.replace(/\+/g," ");
		}
		$("[name='keyWord']").each(function(){
			$(this).val(Encoder.htmlEncode($(this).val()).replace(/\&quot;/g,'"'));
		});
		if(key=="Brands")
			key = "brand";
		if(key=="Category")
			key = "category";
		key = "attr_"+key;
		var attrList = "";
		if($(chksEl).parents('.sessionDesp').find('#attrFilterList').length > 0){
			attrList = $(chksEl).parents('.sessionDesp').find('#attrFilterList').text();
		}else{
			attrList = jQuery("#attrFilterList").text();
		}
		var keyText = jQuery("#keyWordTxtTrail").text();
		if(jQuery.trim(keyText)!="") {
			jQuery("#keyWordTxtMulti").val(keyText);
		}
		if(jQuery.trim(attrList)=="") {
			if($(chksEl).parents('.sessionDesp').find('.multiSelectForm').length > 0){
				$(chksEl).parents('.sessionDesp').find('.multiSelectForm [name="attrFilterList"]').val(key+":"+val);
			}else{
				jQuery("#multiFilterAttrList").val(key+":"+val);
			}
			//console.log("woops empty attr : " + jQuery("#multiFilterAttrList").val());
		}else{
			var attrArr = attrList.split("~");
			var buildAttr = "";
			var c = "";
			var isBuild = false;
			for(i=0;i<attrArr.length;i++){
				var valArr = attrArr[i].split(":");
				if(valArr[0] == key){
					buildAttr = buildAttr + c + attrArr[i] +"|"+val;
					isBuild = true;
				}else{
					buildAttr = buildAttr + c + attrArr[i];
				}
				c = "~";
			}

			if(!isBuild)
				buildAttr = buildAttr + "~" + key+":"+val;
			//buildAttr = Encoder.htmlEncode(buildAttr).replace(/\"/g,'"');
			if($(chksEl).parents('.sessionDesp').find('.multiSelectForm').length > 0){
				$(chksEl).parents('.sessionDesp').find('.multiSelectForm [name="attrFilterList"]').val(buildAttr);
			}else{
				jQuery("#multiFilterAttrList").val(buildAttr);
			}
			console.log("the Filtered list to append and buid : " + jQuery("#attrFilterList").text());
		}
		if($(chksEl).parents('.sessionDesp').find('.multiSelectForm').length > 0){
			$(chksEl).parents('.sessionDesp').find('.multiSelectForm').submit();
		}else{
			jQuery("#multiFilterAttributeForm").submit();
		}
	};
	 //function appendSearch(key,val){}

	ProductMode.submitProductModeFilterForm = function(itemPriceId){
		$('.itemDetailInfoList a').removeClass('active');
		if($("#productModeItemContent_"+itemPriceId).html().trim()==""){
			$(".multiSelectForm").removeClass('activeFilterForm');
			$(".productModeItemContent").html("");
			$('.cimm_attrFilterContent').html('');
			var formId = "multiFilterAttributeForm";
			$(".productModeItemContent").html("");
			$(".productModeItemsDiv").hide();
			if(itemPriceId!=null && $.trim(itemPriceId)!=""){
				formId = formId+$.trim(itemPriceId);
				$("#"+formId).submit();
			}
			$('.itemDetailInfoList_'+itemPriceId).addClass('active');
			$('#multiFilterAttributeForm'+itemPriceId).addClass('activeFilterForm');
		}else{
			if($("#productModeItemsDiv_"+itemPriceId).is(':visible')){
				$(".productModeItemsDiv").slideUp();
				$("#attrFilterContent_"+itemPriceId).hide();
			}else{
				$('.itemDetailInfoList_'+itemPriceId).addClass('active');
				$(".productModeItemsDiv").slideDown();
				$("#attrFilterContent_"+itemPriceId).show();
			}
		}
	}
	//function submitProductModeFilterForm(itemPriceId){}
	//------------------------------------------------- Product Mode Filters END
	//--------------------------------- ProductModer Detail Page datatable price Load Start
	/*ProductMode.loadPriceInDataTable = function(){
		try{
			var oTable = $('#childItemTable').DataTable({
				"pageLength":5,
				dom: '<"tableScroll" t>ip',
				"language": {
					"search":"_INPUT_",
					"searchPlaceholder":"Search",
					"sLengthMenu" :"Show _MENU_",
					"oPaginate" : {
						"sPrevious" :"Prev",
						"sNext" :"Next"
					}
				},
				"ordering": false,searching: false,"bLengthChange": false,
				"fnRowCallback":function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					var erpType = $('#erpType').val().toUpperCase();
					if(typeof jQuery(nRow).attr("data-priceloading")!="undefined" && jQuery(nRow).attr("data-priceloading")=="N" && erpType!=null && $.trim(erpType)!="DEFAULTS"){
						var url = "getPriceDetailPage.action?productIdList="+jQuery(nRow).attr("data-partnumber");
						jQuery.getJSON(url, function (json) {
							if(typeof json[0]!='undefined' && json[0]!=null){
								var partNumber = json[0].partNumber.replace('\s+','_');
								//--------------------Quantity Break Check Start
								var quantityBreakFlag = "N";
								var quantityBreakFlagHiddenInput = jQuery('<input type="hidden" id="quantityBreakFlag_'+partNumber+'" value="N"/>');
								if(json[0]!=null && json[0].quantityBreakFlag!=null && json[0].quantityBreakFlag!="" && json[0].quantityBreakFlag){
									quantityBreakFlag = "Y";
									quantityBreakFlagHiddenInput = jQuery('<input type="hidden" id="quantityBreakFlag_'+partNumber+'" value="Y"/>');
									if(json[0]!=null && json[0].quantityBreakList!=null && json[0].quantityBreakList.length>0!=""){
										var quantityBreakPricingDetails = "";
										for(var z=0; z<json[0].quantityBreakList.length; z++){
											if(parseFloat(json[0].quantityBreakList[z].qty)>0){
												quantityBreakPricingDetails = quantityBreakPricingDetails+ json[0].quantityBreakList[z].qty +"|"+ json[0].quantityBreakList[z].price +"~";
											}
										}
										$("#quantityBreakPricingDetails_"+partNumber).html(quantityBreakPricingDetails);
									}
								}
								//--------------------Quantity Break Check End 
								//--------------------Pricing and Uom Start
								var pricePrecision = $("#pricePrecision").val();
								var finalPrice = 0;
								if($("#userLogin").val() == 'true' || $("enableAnonymousCheckout").val()=='Y'){
									if(typeof json[0].extendedPrice!='undefined' && json[0].extendedPrice!=null  && json[0].extendedPrice!="" && !isNaN(parseInt(json[0].extendedPrice))){
										finalPrice = Number(json[0].extendedPrice).toFixed(pricePrecision);
										if(finalPrice>0){
											jQuery("[id=priceSpan_" + partNumber+ "]").html("$"+finalPrice);
											jQuery("[id=priceValue_" + partNumber+ "]").val(finalPrice);
											jQuery("[data-partnumber='"+minorderquantity+"']").attr("data-addtocartflag","Y");
											jQuery("[id=priceValue_" + partNumber+ "]").each(function(i) {
												$(this).val(Number(finalPrice).toFixed(pricePrecision));
											});
											$("[id=unitPriceValue_" + partNumber+ "]").each(function(i) {
												$(this).val(Number(finalPrice).toFixed(pricePrecision));
											});
											if(typeof json[0].uom!="undefined" && json[0].uom!=null && json[0].uom!=""){
												jQuery('#uomValue_'+partNumber).val(json[0].uom);
												jQuery('#uomSpan_'+partNumber).html(json[0].uom);
											}else{
												jQuery('#uomSpan_'+partNumber).html(" - ");
											}
											jQuery("[id=enableCart_" + partNumber+ "]").addClass('addToCart').removeClass('btns-disable');
										}else{
											jQuery("[id=priceSpan_" + partNumber+ "]").html("<span class='priceSpanFa'>Call for Price</span>");
											jQuery('#uomSpan_'+partNumber).html(" - ");
										}
									}else{
										jQuery("[id=priceSpan_" + partNumber+ "]").html("<span class='priceSpanFa'>Call for Price</span>");
										jQuery('#uomSpan_'+partNumber).html(" - ");
									}
									jQuery('#uomSpan_'+partNumber).append(quantityBreakFlagHiddenInput);
								}else{
									jQuery("[id=priceSpan_" + partNumber+ "]").html("<span class='priceSpanFa' data-toggle='modal' data-target='#loginModal'>Login for Price</span>");
									jQuery('#uomSpan_'+partNumber).html(" - ");
								}
								//--------------------Pricing and Uom End
								//-------------------- Branch Availability Start
								var HomeId = $("#HomeTer").val();
								var totalbranchStock = 0;
								var homeBranchStock = 0;
								if(typeof json[0].branchAvail!='undefined' && json[0].branchAvail!=null  && json[0].branchAvail!=""){
									var branchText = "<table id='allBranch"+partNumber+"' cellpadding='0' cellspacing='0' width='100%' border='0' class='cimm_siteTable'><thead>"+"<tr><th>"+locale('product.label.branchName')+"</th><th class='center'>"+locale('product.label.available')+"</th></tr>"+"</thead><tbody>";
									if(json[0].branchAvail.length>0){
										for (i = 0; i < json[0].branchAvail.length; i++) {
											var branchName = json[0].branchAvail[i].branchName;;
											var branchId = json[0].branchAvail[i].branchID;
											var branchAvailability = json[0].branchAvail[i].branchAvailability;
											branchText = branchText+'<tr class="alignLeft"><td>'+ branchName+'</td>';
											if(parseInt(branchAvailability)>0){
												branchText = branchText+'<td><span id="branchUOM">'+ branchAvailability + '</span></td>';
											}else{
												branchText = branchText+'<td><span class="required">Call for Availability</span></td>';
											}
											branchText = branchText + "</tr>";
											totalbranchStock = totalbranchStock + parseInt(branchAvailability);
											if(HomeId==branchId){
												homeBranchStock = homeBranchStock+parseInt(branchAvailability);
											}
										}
									}
									branchText = branchText + "</tbody></table>";
									$('#allBranch'+partNumber).html(branchText);
								}
								//-------------------- Branch Availability End
								//-------------------- Availability Display Start
								if(totalbranchStock<1 && json[0]!=null && typeof json[0].branchTotalQty!='undefined' && json[0].branchTotalQty!=null  && json[0].branchTotalQty!="" && parseInt(json[0].branchTotalQty)>0){
									totalbranchStock = parseInt(json[0].branchTotalQty);
								}else if(totalbranchStock<1 && json[0]!=null && typeof json[0].qty!='undefined' && json[0].qty!=null  && json[0].qty!="" && parseInt(json[0].qty)>0){
									totalbranchStock = parseInt(json[0].qty);
								}
								
								if(totalbranchStock>0){
									if($("#userLogin").val() == 'true'){
										jQuery('#productModeAvail_'+partNumber).html('<span class="availSpanFa">Available</span><br/><span class="priceSpanFa"><a href="javascript:void(0);" onClick="openAllBranchPop('+partNumber+')">Branch Availability</a></span>');//totalbranchStock
									}else{
										jQuery('#productModeAvail_'+partNumber).html('<span class="availSpanFa">Available</span>');
									}
								}else{
									jQuery('#productModeAvail_'+partNumber).html("<span class='priceSpanFa'>Call for Availability</span>");
								}
								//-------------------- Availability Display End
								//--------------------Uom List Start
								var enableMultipleUomDisplay = "Y";
								if($('#enableMultipleUomDisplay').length>0 && $('#enableMultipleUomDisplay').val()!='undefined' && $('#enableMultipleUomDisplay').val()!=null && $('#enableMultipleUomDisplay').val()!=""){
									enableMultipleUomDisplay = $('#enableMultipleUomDisplay').val();
								}
								if(enableMultipleUomDisplay =="Y" && json[0]!=null && json[0].uomList!=null && json[0].uomList!="" && json[0].uomList.length>1 && quantityBreakFlag!="Y"){
									var uomList = json[0].uomList;
									var itemId = $('#tempItemId_'+partNumber).val();
									var uomSelect = jQuery('<select id="multipleUom_'+partNumber+'" data-partnumber="'+partNumber+'"data-itemId="'+itemId+'" onchange="multipleUomOnChange(this)" class="multipleUom" >');
									for(var j=0; j<uomList.length; j++){
										uomSelect.append($('<option>', {value: uomList[j].uom+"~"+uomList[j].uomQty, text : uomList[j].uom+"("+uomList[j].uomQty+")"}));
									}
									jQuery('#uomSpan_'+partNumber).html(uomSelect);
								}
								//-------------------- Uom List End
							}
						}); 
						jQuery(nRow).attr("data-priceloading","Y");
					}else{
						disableCustomCheckbox();
					}
				}
			});
			//priceLoadMainFunction(); -- Commented on 30th May 2016 while integrating with ERP check and enable this line
			checkItem();
			//--------------------------------- load item Spec &  Linked item Detail in productMode End
			$('#childItemTable tbody').on('click', 'td.details-control', function () {
				var tr = $(this).closest('tr');
				var row = oTable.row(tr);
				$(".focusLinkedItemTabs").hide();
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
					$("#linkedItemContentDiv_"+$(this).attr('id')).hide();
					$("#linkedItemAvailable_"+$(this).attr('id')).hide();
					$('td.details-control i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
				}else if(typeof $(tr).attr("data-detailsload")!="undefined" && $(tr).attr("data-detailsload")=="Y"){
					$("[data-rowid='identification']").each(function(i){
						var trHide = $(this).closest('tr');
						var rowHide = oTable.row(trHide);
						if (rowHide.child.isShown()) {
							rowHide.child.hide();
							trHide.removeClass('shown'); 
						}
					});
					$("#linkedItemContentDiv_"+$(this).attr('id')).show();
					$("#linkedItemAvailable_"+$(this).attr('id')).show();
					$('td.details-control i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
					$(this).closest('tr').find('i').toggleClass('fa-minus-circle');
					row.child.show();
					tr.addClass('shown');
					$("html, body").animate({scrollTop: $(tr).offset().top }, 1000);
				}else{
					block('Please Wait');
					$("[data-rowid='identification']").each(function(i){
						var trHide = $(this).closest('tr');
						var rowHide = oTable.row(trHide);
						if (rowHide.child.isShown()) {
							rowHide.child.hide();
							trHide.removeClass('shown');
						}
					});
					var itemPriceId = $(this).attr('id');
					var linkedItemExistFlag = false;
					var domTabsExistFlag = false;
					//$(".focusItemTabs").hide();
					$('td.details-control i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
					$(this).closest('tr').find('i').toggleClass('fa-minus-circle');
					$(tr).attr("data-detailsload","Y");
					$.ajax({
						type: "POST",url: "/itemDetailSolrPage.action?reqType=ItemDetail&codeId="+$(this).attr('id')+'&dt='+new Date(),
						success: function(msg){
							var addonDetails = "";
							//console.log("Msg: "+msg);
							if(msg != ""){
								if($(msg).filter("#productAccordionWrapDetailPageContent").length>0){
									addonDetails = $(msg).filter("#productAccordionWrapDetailPageContent").html();
									if(addonDetails!=null && addonDetails!=""){
										domTabsExistFlag = true;
									}
								}
								if($(msg).filter("#linkedItemSectionContent").length>0 && $(".productAccordionWrap").length>0){
									var linkedItemContent =  $.trim($(msg).filter("#linkedItemSectionContent").html())
									if(linkedItemContent!=null && linkedItemContent!=""){
										$(".productAccordionWrap").html(linkedItemContent);
										linkedItemExistFlag = true;
									}
								}
							}

							if(domTabsExistFlag){
								row.child(addonDetails).show();
								if(linkedItemExistFlag && $("#addOrRemoveCustomerPartNumberContent").length>0){
									$("#addOrRemoveCustomerPartNumberContent").show();
								}
							}else{
								row.child("No Details Available").show();
							}

							tr.addClass('shown');
							ProductMode.customDomTabLoad();// For Dom tab

							if(linkedItemExistFlag){
								$("#linkedItemContentDiv_"+itemPriceId).show();
								$("#linkedItemAvailable_"+itemPriceId).show();
							}

							$("html, body").animate({scrollTop: $(tr).offset().top }, 1000);
							setTimeout(unblock(), 100);
						}
					});
				}
			});
			////--------------------------------- load item Spec &  Linked item Detail in productMode End
			
		}catch(e){
			console.log(e);
		}
	};*/
	//function loadPriceInDataTable() {}

	ProductMode.showlinkedItemSection = function(id){
		$("html, body").animate({ scrollTop: $('#linkedItemContentDiv_'+id).offset().top }, 1000);
	}
	//function showlinkedItemSection(id){}
	//--------------------------------- ProductModer Detail Page datatable price End
	//------------- custom Dom tab script
	ProductMode.customDomTabLoad = function(){
		$('#multiTab').multiTab({
			   tabHeading: '.multiTabHeading',
			   contentWrap: '.multiTabContent',
			   transitionEffect: "fade"
		});
	};
	//function customDomTabLoad(){}
	//------------- custom Dom tab script
	ProductMode.checkCookieToCheck = function (){
		checkCookie = localStorage.getItem("selectedItemsToGroup");
		if(checkCookie!=null  && checkCookie!="[]"){
			var obj = JSON.parse(checkCookie);
			var objth = obj.length;
			for(var i=0; i<=objth; i++){
				var mm = obj[0].itemId;
				$('#selectItemCheckbox_'+mm).attr('checked',true)
			}
		}
		if(checkCookie != "[]" && checkCookie != null){
			$(".cimm_addcartSlider").addClass("cimm_addcartSliderShow");
		}else{
			$(".cimm_addcartSlider").removeClass("cimm_addcartSliderShow");
		}
	}
})(); //----------------------------------------------------------------  Product Mode Object

$(function(){
	initSubmitForm();
});

function initSubmitForm(){
	if ($("#layoutName").val() == "ProductDetailPage") {
		priceLoading.productModeCustomFunc();
	}
	$(".multiSelectForm").submit(function(){
		var str = $(this).serialize();
		var itemPriceId = "";
		if(this.id!=null && this.id!=""){
			var thisFormId = this.id;
			itemPriceId = thisFormId.replace("multiFilterAttributeForm", "");
			itemPriceId = $.trim(itemPriceId);
		}
		block('Please Wait');
		$.ajax({
			type: "POST",
			url: "getProductModeFilterPage.action",
			data: str,
			success: function(msg){
				if(msg!=null && msg!=""){
					//console.log("here");
					if(itemPriceId!=null && itemPriceId!=""){
						if($(msg).filter("#pModeItemContent").length>0){
							$("#productModeItemContent_"+itemPriceId).html($(msg).filter("#pModeItemContent").html());
							//$(".right_attribute").hide();
							$("#productModeItemsDiv_"+itemPriceId).show()
						}
						if($(msg).filter("#allBranchAvailabilityDIV").length>0){
							$("#productModeAllBranchAvailabilityDiv_"+itemPriceId).html($(msg).filter("#allBranchAvailabilityDIV").html());
						}
						if($(msg).filter("#attrContent").length>0){
							$("#attrFilterContent_"+itemPriceId).html($(msg).filter("#attrContent").html());
						}
					}else{
						if($(msg).filter("#attrContent").length>0){
							$("#attrFilterContent").html($(msg).filter("#attrContent").html());
						}

						if($(msg).filter("#pModeItemContent").length>0){
							$("#productModeItemContent").html($(msg).filter("#pModeItemContent").html());
						}
					}
					ProductMode.buildSearchTrail(itemPriceId);
					hideBulkAction();
					priceLoading.beginProductModePriceLoading(itemPriceId);
					//ProductMode.loadPriceInDataTable();
					//priceLoading.productModeCustomFunc();
					ProductMode.checkCookieToCheck();
					hideForDevice();
					filterScroll();
					$('.selectpicker').selectpicker('refresh');
					if($("#productModeItemContent_"+itemPriceId).find(".cimm_multiAddcart").length>0 && ($("#layoutName").val() == "ProductList" || $("#layoutName").val() == "SubCategoryPage")){
						$("#productModeItemContent_"+itemPriceId).find(".cimm_multiAddcart").remove();
					}
				}
				unblock();
				if($("#mulitFilterTrailDetailPage").html()!=""){
					$(".right_attribute").show();
				}else{
					$(".right_attribute").hide();
				}
			}
		});
		return false;
	});
}

function disableCustomCheckbox(){
	$("input[type=checkbox]").each(function () {
	    var checkedValue = $(this).attr("disabled");
	    if (checkedValue == "disabled") {
	    	$(this).parent().addClass("btns-disable");
	    }
	});
}

function openAllBranchPop(id){
	$('#modalBodyContent_'+id).fadeIn();
}

function multipleUomOnChange(obj){
	var pricePrecision = $("#pricePrecision").val();
	var partNumber = obj.dataset.partnumber.replace(/\s+/g,'_');
	var itemId= obj.dataset.itemid
	var quantityBreakFlag = $('#quantityBreakFlag_'+partNumber).val();
	var unitPrice = $('#unitPriceValue_'+partNumber).val();
	var selectedOption = obj.selectedOptions[0].value;
	var selectedUom = "";
	var priceForUom = 0.0;
	if(selectedOption!=null){
		var selectArray = selectedOption.split("~");
		if(selectArray!=null && selectArray.length>0){
			selectedUom = selectArray[0];
			uomQty = selectArray[1];
			if(typeof quantityBreakFlag!='undefined' && quantityBreakFlag!=null && quantityBreakFlag=="Y"){
			}else{
				priceForUom = parseFloat(unitPrice)*parseFloat(uomQty);
			}
		}
		if(parseFloat(priceForUom)>0){
			if($('#tdPrice_'+partNumber).length>0){
				//$('#tdPrice_'+partNumber).html("$"+Number(priceForUom).toFixed(pricePrecision)+" / "+selectedUom+" ("+uomQty+")");
				$('#tdPrice_'+partNumber).html("$"+Number(priceForUom).toFixed(pricePrecision));
			}
			if($('#span_'+partNumber).length>0){
				$('#span_'+partNumber).html("$"+Number(priceForUom).toFixed(pricePrecision)+"<span class='cimm_uom'> / "+selectedUom+"</span>");
				//$('#itemTxtQty'+itemId).val(uomQty);
			}
			$('#priceValue_'+partNumber).val(priceForUom);
		}
		$('#uomValue_'+partNumber).val(selectedUom);
	}
}