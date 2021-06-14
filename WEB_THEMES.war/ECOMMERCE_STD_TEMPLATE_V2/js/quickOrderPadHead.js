var QuickOrder = {};
(function() {
	 QuickOrder.isTDValEmpty = function (td){
    	var tds = $(td).find('input').val();
        if (tds.trim() == '') {
            return true;
        }            
        return false;
    };
    QuickOrder.isTDValNumber = function (td){
    	var numbers = /^[0-9]+$/;
    	var td = $(td).find('input').val();
    	if (td.trim().match(numbers) && td.trim() != '0' && td.trim().length < 5) {
            return true;
        }            
        return false;
    };
    
    QuickOrder.isInt = function(value) {
    	  return !isNaN(value) && 
    	         parseInt(Number(value)) == value && 
    	         !isNaN(parseInt(value, 10));
    };
    
    QuickOrder.findDuplicateAndAddvalues = function (data){
    	var jsonObjArray = null;
    	jsonObjArray = [];
    	var newObj = {};
    	$(data).each(function(key,value){
    		console.log(value.keyword +" : "+ value.qty)
    		if(newObj[value.keyword] === undefined){
		        newObj[value.keyword] = 0;
		    }
			newObj[value.keyword] += parseInt(value.qty);
		});
    	  	
    	for(key in newObj){
    		var item = {}
			item ["keyword"] = key;
			item ["qty"] = newObj[key];
			jsonObjArray.push(item);
    	}
		return jsonObjArray;
    };
    
    QuickOrder.findDuplicateAndRemove = function (data){
    	var json_all = data;
    	var arr = [], //to collect id values 
        collection = []; //collect unique object
	    $.each(json_all, function (index, data) {
	        if ($.inArray(data.keyword, arr) == -1) { //check if id value not exits than add it
	            arr.push(data.keyword);//push id value in arr
	            collection.push(data); //put object in collection to access it's all values
	        }
	    });
		return collection;
    };
	
    QuickOrder.resetInputModes = function(){
    	$('#headerCopyPasteText').val("");
    	$('#datafile').val("");
		$('#cimm_customFileUpload > span').text(locale('product.label.chooseFile'));
		$("#overlay,.quickCartContainer").hide();
		$("#quickOrderPadDrop").removeClass("active");
    };
    
    QuickOrder.updateCartCount = function (){
    	var cartCount = $('#cartCountQuickorder').val();
    	var cartTotal = $('#cartCountTotal').val();
    	var total ="";
    	var cartCountString = "0";
    	if(QuickOrder.isInt(cartCount)){
    		cartCountString = cartCount;
    		total = cartTotal;
    	}else{
    		cartCountString = "0";
    		total = "";
    	}
    	$('.cartCountrefresh').html(cartCountString);
    	$('.cartTotal').html(total);
    	if($('#countInCart').length>0){
    		$('#countInCart').val(cartCountString);
    	}
    };
    
    QuickOrder.resetTable = function(){
    	$("#speedEntry table tbody tr").each(function() {
    		$(this).find('input').val("");
    		$(this).find('input').removeClass('tdValidate');
    		$('#overlay,.quickCartContainer').hide();
    		$("#quickOrderPadDrop").removeClass("active");
    	});
    };
    
    QuickOrder.showMoreOrderPad = function(){
	    var data = $("#speedEntry table tbody tr");
		$("#orderPadCopyHead").html("");
		var row = "<table>";
		for(var i=0;i< data.length;i++){
			if(data[i].children[1].children[0].value !=null && data[i].children[0].children[0].value !=null){
				   row = row + ("<tr><td name='keyword'>"+data[i].children[0].children[0].value+"</td><td name='qty'>"+data[i].children[1].children[0].value+"</td></tr>");
			}
		}
		row = row +"</table>";
		$("#orderPadCopyHead").append(row);
		$("#quickOrderPadDrop").slideUp();
		$("#speedEntry table tbody tr td input").val('');
		var jsonObjQuick = null;
		jsonObjQuick = [];
		var linkToPage = true;
		$('#orderPadCopyHead table tbody tr').each(function(){
			var partNum = $(this).find('td[name=keyword]').html();
			var qty = $(this).find('td[name=qty]').html();
			if(partNum != undefined && qty!= undefined && partNum!= "" && qty!= ""){
				var item = {}
				item ["keyword"] = partNum;
				item ["qty"] = qty;
				item ["searchTyp"] = "1";
		        jsonObjQuick.push(item);
			}
			if(partNum == "" && qty!= ""){
				bootAlert("small","error","Error","Please enter missing Keyword value");
				linkToPage = false;
				return false;
			}
			if(partNum != "" && qty == ""){
				bootAlert("small","error","Error","Please enter missing Qty. value");
				linkToPage = false;
				return false;
			}
		});
		
		if(linkToPage){
			localStorage.setItem("itemList", JSON.stringify(jsonObjQuick));
			window.location.href = locale("website.url.QuickOrder");
		}
    };
	
    QuickOrder.headValidateOrderPad = function(){
    	var isAllRowEmpty = true;
    	var isInvalidQty = false;
    	var validationMessage = "";
    	var qtyValidate = "";
    	var separatorQty = "";
    	var countOfRowsWithData = 0;
    	$("#speedEntry table tbody tr").each(function() {
    		var trIsEmpty = true;
    		var tr = $(this);
    		tr.find("td:first").each(function() {
    		   td = $(this);
    		   if(QuickOrder.isTDValEmpty(td)){
    		  	  td.find('input').addClass('tdValidate');
    		   }else{
    			  ++countOfRowsWithData;
    		  	  isAllRowEmpty = false;
    		   	  tr.find("td:eq(1)").each(function() {
    		   		  tdQty = $(this);
    		   		  if(!QuickOrder.isTDValNumber(tdQty)){
    					  isInvalidQty = true;
    					  tdQty.removeClass("htInvalid"); 
    					  tdQty.find('input').addClass('tdValidate');
    		   			  var qtyValmessage = "Enter Valid Quantity to row# : "+(tr.index()+1);
    		   			  qtyValidate = qtyValidate+separatorQty+qtyValmessage;
    		   			  separatorQty = "<br/>";
    				  }
    			  });
    		   }
    		});
    	});
    	if(!isAllRowEmpty){
    		if(isInvalidQty){
    			bootAlert("small","error","Error",qtyValidate);
    		}else if(countOfRowsWithData > quickOrderRecordLimit){
    			bootAlert("small","error","Error",locale("quickOrder.message.maxrecountsItemsCanBeUploaded")+quickOrderRecordLimit);
    		}else{ 
    			block("Espere por favor");
    			var data = $("#speedEntry table tbody tr");
    			$("#orderPadCopyHead").html("");
    			var row = "<table>";
    			for(var i=0;i< data.length;i++){
    				if(data[i].children[1].children[0].value !=null && data[i].children[0].children[0].value !=null){
    					   row = row + ("<tr><td name='keyword'>"+data[i].children[0].children[0].value+"</td><td name='qty'>"+data[i].children[1].children[0].value+"</td></tr>");
    				}
    			}
    			row = row +"</table>";
    			$("#orderPadCopyHead").append(row);
    			var jsonObjQuick = null;
    			jsonObjQuick = [];
    			$('#orderPadCopyHead table tbody tr').each(function(){
    				var partNum = $(this).find('td[name=keyword]').html();
    				var qty = $(this).find('td[name=qty]').html();
    				
    				if(partNum != undefined && qty!= undefined && partNum!= "" && qty!= ""){
    					var item = {}
    					item ["keyword"] = partNum;
    					item ["qty"] = qty;
    					item ["searchTyp"] = "1";
    			        jsonObjQuick.push(item);
    				}
    			});
    			var radioValue = $("input[name='QuickOrderPadHead']:checked").val();
                //if(radioValue){
                //    radioValue;
                //}
                if(radioValue!=null && radioValue=="Combine"){
    				jsonObjQuick = QuickOrder.findDuplicateAndAddvalues(jsonObjQuick)
    			}else if(radioValue!=null && radioValue=="Separate"){
    				
    			}else if(radioValue!=null && radioValue=="Remove"){
    				jsonObjQuick = QuickOrder.findDuplicateAndRemove(jsonObjQuick);
    			}

                if(navigator.onLine){
                   QuickOrder.processQuickCart(jsonObjQuick, radioValue);
     	           QuickOrder.resetTable();
    			}else{
    				bootAlert("small","error","Error",locale("internert.connectivity.error"));
    				return false;
    			}
    		}
    	}else{
    		bootAlert("small","error","Error", locale('label.quickOrder.validCodigoUpc'));
    	}
    };

	QuickOrder.quickOrderHeaderCopyPaste = function(){
		var invalidQtyFlag = false;
		var invalidKeyWordFlag = false;
		var rowNumber = 1;
		var rowNumberString = "";
		var stringSeparator = "";
		var submitFlag = false;
		var validationMessage = "";
		var jsonObjQuick = null;
		jsonObjQuick = [];
		if(jQuery('#headerCopyPasteText').length>0 && jQuery('#headerCopyPasteText').val()!=null && jQuery('#headerCopyPasteText').val().trim()!=""){
			block("Espere por favor");
			var  copyText = jQuery('#headerCopyPasteText').val();
			var lines = copyText.split("\n");
			var quickOrderRecordLimit = 50;
			if($('#quickOrderRecordLimit').length>0 && $('#quickOrderRecordLimit').val()!=null && $('#quickOrderRecordLimit').val()!="" && QuickOrder.isInt($('#quickOrderRecordLimit').val())){
				quickOrderRecordLimit = parseInt($('#quickOrderRecordLimit').val());
			}
			if(lines!=null && lines.length>0 && lines.length<=quickOrderRecordLimit){
				for(var ln=0; ln<lines.length; ln++){
					if(lines[ln]!=null && lines[ln]!=""){
						if(lines[ln].indexOf(",") > -1){
							var valuesComaSeparate = lines[ln].split(",");
							if(valuesComaSeparate!=null && valuesComaSeparate.length>0){
								if(valuesComaSeparate[1]==null || valuesComaSeparate[1]==""){
									valuesComaSeparate[1] = "1";
								}
								var qtyInput = valuesComaSeparate[1];
								var keywordInput = valuesComaSeparate[0];
								var keywordInputTrim = jQuery.trim(keywordInput);
								if(keywordInputTrim != "" && keywordInput!=null){
									if(QuickOrder.isInt(qtyInput)){
										var item = {}
										item ["keyword"] = valuesComaSeparate[0];
										item ["qty"] = qtyInput;
										/*item ["searchTyp"] = "1";*/
								        jsonObjQuick.push(item);
										submitFlag = true;
									}else{
										invalidQtyFlag = true;
										rowNumberString = rowNumberString+stringSeparator+rowNumber;
									}
								}else{
									invalidKeyWordFlag = true;
									rowNumberString = rowNumberString+stringSeparator+rowNumber;
								}
							}
							
						}else if(lines[ln].indexOf("\t") > -1){
							block("Espere por favor");
							var valuesTabSeparate = lines[ln].split("\t");
							if(valuesTabSeparate!=null && valuesTabSeparate.length>0){
								if(valuesTabSeparate[1]==null || valuesTabSeparate[1]==""){
									valuesTabSeparate[1] = "1";
								}
								var qtyInput = valuesTabSeparate[1];
								var keywordInput = valuesTabSeparate[0];
								if(keywordInput!="" & keywordInput!=null){
									if(QuickOrder.isInt(qtyInput)){
										var item = {}
										item ["keyword"] = valuesTabSeparate[0];
										item ["qty"] = qtyInput;
										/*item ["searchTyp"] = "1";*/
								        jsonObjQuick.push(item);
										submitFlag = true;
									}else{
										invalidQtyFlag = true;
										rowNumberString = rowNumberString+stringSeparator+rowNumber;
									}
								}else{
									invalidKeyWordFlag = true;
									rowNumberString = rowNumberString+stringSeparator+rowNumber;
								}
							}
						}else{
							unblock();
							bootAlert("small","error","Error", locale('label.quickOrder.validCopyPattern'));
							submitFlag = false;
							break;
						}
					}
					rowNumber = rowNumber+1;
					stringSeparator = "<br/>";
				}
			}else{
				unblock();
				if(lines.length>quickOrderRecordLimit){
					bootAlert("small","error","Error",locale("quickOrder.message.maxrecountsItemsCanBeUploaded")+quickOrderRecordLimit);
				}
			}
			
		}else{
			bootAlert("small","error","Error",locale('label.quickOrder.enterValues'));
			submitFlag = false;
		}
		if(invalidQtyFlag){
			unblock();
			setTimeout(function(){
				bootAlert("small","error","Error","Enter Valid Quantity to row# : <br/>"+rowNumberString);
			}, 500);
			submitFlag = false;
			return false;
		}
		if(invalidKeyWordFlag){
			unblock();
			setTimeout(function(){
				bootAlert("small","error","Error","Enter Valid Keyword to row# : <br/>"+rowNumberString);
			}, 500);
			submitFlag = false;
			return false;
		}
		
		if(submitFlag){
			//var json = JSON.stringify(jsonObjQuick);
			var radioValue = $("input[name='QuickOrderHeaderCopyPaste']:checked").val();
            //if(radioValue){
            //    radioValue;
            //}
            if(radioValue!=null && radioValue=="Combine"){
				jsonObjQuick = QuickOrder.findDuplicateAndAddvalues(jsonObjQuick)
			}else if(radioValue!=null && radioValue=="Separate"){
				
			}else if(radioValue!=null && radioValue=="Remove"){
				jsonObjQuick = QuickOrder.findDuplicateAndRemove(jsonObjQuick);
			}
            
            if(navigator.onLine){
            	QuickOrder.processQuickCart(jsonObjQuick, radioValue);
    			QuickOrder.resetInputModes();
			}else{
				bootAlert("small","error","Error",locale("internert.connectivity.error"));
				return false;
			}
		}
	};
	
	QuickOrder.validateFileUpload = function(){
		if($('#datafile').length>0){
			var fileExt =  $('#datafile').val();
			if(fileExt != null && $.trim(fileExt)!=''){
				fileExt = fileExt.substring($('#datafile').val().lastIndexOf(".")+1);
				if(fileExt != "xlsx"){
					bootAlert("small","error","Error", locale('label.quickOrder.xlsx'));
					return false;
				}else{
					return true;
				}
			}else{
				bootAlert("small","error","Error", locale('label.quickOrder.chooseXlsx'));
				$('#datafile').click();
				return false;
			}
		}else{
			bootAlert("small","error","Error",locale('label.quickOrder.problemWhileUpload'));
			return false;
		}
	};
	
	QuickOrder.processQuickCart = function(object, isSeparate){
		var myObject = new Object();
		if(typeof object!=null){
			myObject.itemDataList = object;
		}
		//block("Espere por favor");
		$('#generalModel .modal-body').html("");
		var jsonData = JSON.stringify(myObject);
		$.ajax({
	        url: "/QuickOrderPadPage.action",
	        type:"post",
	        data: {
	        	jsonString: jsonData,
	        	processType: isSeparate
	        },
	        success: function(response){
	        	$('#generalModel .modal-body').html(response);
	        	$('#generalModel').modal();
	        	setTimeout(function(){
	        		QuickOrder.initSlick();
	        	},500);
				QuickOrder.updateCartCount();
				unblock();
				$('#bulkAction').selectpicker('refresh');
	        },
	        error:function(xhr, ajaxOptions, thrownError){bootAlert("small","error","Error",xhr.responseText); ShowMessage("??? ?? ?????? ??????? ????","fail");}
	    });
	};
	QuickOrder.initSlick = function(){
		var multiSliderCount = $('#multiResultSliderCount').val();
		if($('#itemsInCartSlider').length>0){
			$('#itemsInCartSlider').slick({
				  infinite: false,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  pauseOnHover:true,
				  responsive: [
				               {
				                 breakpoint: 1024,
				                 settings: {
				                   slidesToShow: 3,
				                 }
				               },{
									breakpoint: 600,
									settings: {
										slidesToShow: 3,
									}
								},{
									breakpoint: 500,
									settings: {
										slidesToShow: 2,
									}
								},
								{
									breakpoint: 400,
									settings: {
										slidesToShow: 1,
									}
								}
				             ]
			  });
		}
		if($('#restrictedItemsSlider').length>0){
			$('#restrictedItemsSlider').slick({
				  infinite: false,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  pauseOnHover:true,
				  responsive: [
				               {
				                 breakpoint: 1024,
				                 settings: {
				                   slidesToShow: 3,
				                 }
				               },
				               {
				                 breakpoint: 600,
				                 settings: {
				                   slidesToShow: 2,
				                 }
				               },
				               {
				                 breakpoint: 480,
				                 settings: {
				                   slidesToShow: 1,
				                 }
				               }
				             ]
			  });
		}
		if(multiSliderCount!=null){
			for(var i=0; i<=multiSliderCount; i++){
				if($('#multipleResultSlider_'+i).length>0){
					$('#multipleResultSlider_'+i).slick({
						  infinite: false,
						  slidesToShow: 3,
						  slidesToScroll: 3,
						  pauseOnHover:true,
						  responsive: [
						               {
						                 breakpoint: 1024,
						                 settings: {
						                   slidesToShow: 3,
						                 }
						               },
						               {
						                 breakpoint: 600,
						                 settings: {
						                   slidesToShow: 2,
						                 }
						               },
						               {
						                 breakpoint: 480,
						                 settings: {
						                   slidesToShow: 1,
						                 }
						               }
						             ]
					});
					$('#multipleResultSlider_'+i).on('afterChange', function(event, slick, currentSlide) {
						  //console.log(currentSlide+ ""+ slick.slideCount);
						    if (currentSlide === 0) {
						      $('.slick-prev').hide();
						    }
						    else {
						    	$('.slick-prev').show();
						    }
						    if (currentSlide + slick.options.slidesToShow >= slick.slideCount) {
						    	$('.slick-next').hide();
						    }else{
						    	$('.slick-next').show();
						    }
					});
					$('#multipleResultSlider_'+i).find('.slick-prev').hide();
				}
			}
		}
	};
})();
$(function(){
	var options = {
		beforeSend: function(){block("Espere por favor");},
		uploadProgress: function(event, position, total, percentComplete){},
		success: function(){},
		complete: function(response){
			if(response!=null){
				unblock();
				if((response.responseText).toLowerCase().indexOf("|") >= 0){
					var errorMessage = response.responseText;
					var errorArray = errorMessage.split("|");
					if(errorArray!=null && errorArray.length>0){
						errorMessage = errorArray[1];
						unblock();
						bootAlert("small","error","Error",errorMessage);
					}
				}else{
					var jsonObject = JSON.parse(response.responseText);
					var jsonObjQuick = null;
					jsonObjQuick = [];
					$(jsonObject).each(function(){
						var innerObj = $(this);
						var item = {}
						item ["keyword"] = innerObj[0]["keyword"];
						item ["qty"] = innerObj[0]["qty"];
				        jsonObjQuick.push(item);
					});
					var radioValue = $("input[name='QuickOrderHeaderFileUpload']:checked").val();
		            //if(radioValue){
		            //    radioValue;
		            //}
					if(radioValue!=null && radioValue=="Combine"){
						jsonObjQuick = QuickOrder.findDuplicateAndAddvalues(jsonObjQuick)
					}else if(radioValue!=null && radioValue=="Separate"){
						
					}else if(radioValue!=null && radioValue=="Remove"){
						jsonObjQuick = QuickOrder.findDuplicateAndRemove(jsonObjQuick);
					}
					
					if(navigator.onLine){
						QuickOrder.processQuickCart(jsonObjQuick, radioValue);
						QuickOrder.resetInputModes();
					}else{
						bootAlert("small","error","Error",locale("internert.connectivity.error"));
						return false;
					}
				}
			}
		},
		error: function(response){
			unblock();
			if(navigator.onLine){
				var msg = response.responseText;
				var msgSplit = msg.split("|");
				if(msgSplit!=null && msgSplit.length>0){
					 //bootAlert("small","error","Error",msgSplit[1]); //to Avoid dupliacte alert
				}else{
					bootAlert("small","error","Error", locale('label.quickOrder.fileUploadFail'));
				}
				return false;
			}else{
				bootAlert("small","error","Error",locale("internert.connectivity.error"));
				return false;
			}
		   
		}
	};
	$("#uploadForm").ajaxForm(options);
});

var limit = 50; // <---max no of lines you want in textarea
if($("#quickOrderRecordLimit").length>0){
	limit = $("#quickOrderRecordLimit").val();
}

var Headtextarea = document.getElementById("headerCopyPasteText");
if(Headtextarea!= null){
	var spaces = Headtextarea.getAttribute("cols");
	Headtextarea.onkeyup = function() {
	   var lines = Headtextarea.value.split("\n");
	    
	   for (var i = 0; i < lines.length; i++) 
	   {
	         if (lines[i].length <= spaces) continue;
	         var j = 0;
	         
	        var space = spaces;
	        
	        while (j++ <= spaces) 
	        {
	           if (lines[i].charAt(j) === " ") space = j;  
	        }
	    lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
	    lines[i] = lines[i].substring(0, space);
	  }
	    if(lines.length>limit)
	    {
	        Headtextarea.style.color = 'red';
	        if($("#copyPasteInstruction").length>0){
	        	$("#copyPasteInstruction").html('<b class="text-danger">Max. '+limit+" "+ locale("label.QuickOrder.maxCopyItem") +'</b>');
	        }
	        setTimeout(function(){
	            Headtextarea.style.color = '';
	            $("#copyPasteInstruction").html("");
	        },2000);
	    }    
	   Headtextarea.value = lines.slice(0, limit).join("\n");
	};
}

QuickOrder.validateHeadFileUpload = function(){
	if($('#headerDataFile').length>0){
		var fileExt =  $('#headerDataFile').val();
		if(fileExt != null && $.trim(fileExt)!=''){
			fileExt = fileExt.substring($('#headerDataFile').val().lastIndexOf(".")+1);
			if(fileExt != "xlsx"){
				bootAlert("small","error","Error",locale('label.quickOrder.xlsx'));
				return false;
			}else{
				return true;
			}
		}else{
			bootAlert("small","error","Error",locale('label.quickOrder.chooseXlsx'));
			$('#headerDataFile').click();
			return false;
		}
	}else{
		bootAlert("small","error","Error",locale('label.quickOrder.problemWhileUpload'));
		return false;
	}
};