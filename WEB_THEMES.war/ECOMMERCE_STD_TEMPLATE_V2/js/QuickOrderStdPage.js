var webThemes = $("#webThemePath").val();
$.getScript(webThemes+'js/multiTab.min.js', function(){
	$('#quickOrderTab').multiTab({
		transitionEffect:"fade"
	});
});
$.getScript(webThemes+'js/handsontable.full.js', function(){
	QuickOrder.initHandsontable();
});
$(document).ready(function() {
	$( "#cimm_customFileUpload > input" ).change(function() {
		var fileName = $(this)[0].files[0];
		if (fileName) {
			fileName = fileName.name
			$('#cimm_customFileUpload > span').text(fileName);
		}
	});
	var options = {
		beforeSend: function(){block("Please Wait");},
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
						//item ["searchTyp"] = "1";
				        jsonObjQuick.push(item);
				        //console.log(innerObj[0]["keyword"]+" - "+innerObj[0]["qty"]+" - "+innerObj[0]["searchTyp"]);
					});
					//var json = JSON.stringify(jsonObjQuick);
					var radioValue = $("input[name='QuickOrderFileUpload']:checked").val();
		            if(radioValue){
		                radioValue;
		            }
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
					bootAlert("small","error","Error","File Upload Failed");
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

var itemList = localStorage.getItem("itemList");
if(itemList != null){
	var IDs = [];
	var itemObj = JSON.parse(itemList);
	for(i = 0; i < itemObj.length; i++){
		var keyWord = itemObj[i].keyword;
		var qty = itemObj[i].qty;
		IDs.push([keyWord,qty]);
	}
	var data = IDs;
	localStorage.removeItem("itemList");
}else{
	var data = [[]];
}

var QuickOrder = {};
(function() {
	
	QuickOrder.isTDEmpty = function (td){
        if (td.text().trim() == '' || td.text().trim() == '▼') {
            return true;
        }            
        return false;
    };
    
    QuickOrder.isTDValueNumber = function (td){
    	var numbers = /^[0-9]+$/; 
    	if (td.text().trim().match(numbers) && td.text().trim() != '0' && td.text().trim().length < 5) {
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
    		//console.log(key +" : "+ value)
    		console.log(value.keyword +" : "+ value.qty)
			/*var innerObjDup = $(this);
			if(newObj[innerObjDup[0]["keyword"]] === undefined){
		        newObj[innerObjDup[0]["keyword"]] = 0;
		    }
			newObj[innerObjDup[0]["keyword"]] += parseInt(innerObjDup[0]["qty"]);*/
    		if(newObj[value.keyword] === undefined){
		        newObj[value.keyword] = 0;
		    }
			newObj[value.keyword] += parseInt(value.qty);
		});
    	  	
    	for(key in newObj){
    		var item = {}
			item ["keyword"] = key;
			item ["qty"] = newObj[key];
			//item ["searchTyp"] = "1";
			jsonObjArray.push(item);
    	}
    	//var json = JSON.stringify(jsonObjArray);
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
    	//var json = JSON.stringify(collection);
		return collection;
    };
	
    QuickOrder.resetInputModes = function(){
    	$('#copyPasteText').val("");
    	$('#datafile').val("");
		$('#cimm_customFileUpload > span').text("Choose File");
    };
    
    QuickOrder.updateCartCount = function (){
    	var cartCount = $('#cartCountQuickorder').val();
    	var cartCountString = "0";
    	if(QuickOrder.isInt(cartCount)){
    		cartCountString = cartCount;
    	}else{
    		cartCountString = "0";
    	}
    	$('.cartCountrefresh').html(cartCountString);
    };
    
    QuickOrder.initHandsontable = function(){
    	$('#example1').html("");
    	var example1 = document.getElementById('example1'),limit = $("#quickOrderRecordLimit").val();
    	var hot;
    	if(hot){
    		hot.clear();
    		hot.destroy();
    	}
    	hot = new Handsontable(example1, {
    		data:data,
    		colWidths: ['65%','35%'],
            stretchH: 'all',
    		minRows: 10,
    		minCols: 2,
    		maxRows: limit,
    		maxCols: 2,
    		colHeaders: ['Keyword', 'Quantity'],
    		columnSorting : true,
    		contextMenu: ['row_above', 'row_below','remove_row','undo','redo'],
    		minSpareRows: 1,
    		autoWrapRow:true,
    		rowHeaders:true,
    		columns: [{
                type: 'autocomplete',
                /*  type: 'autocomplete',
                 source: array1 */
                source: function(query, process) {
    	            	//console.log(query.length);
    					if(query.length>2){
    	                    jQuery.ajax({
                            url: '/AutoComplete.slt',
                            dataType: 'text',
                            data: {
                                q: query,
                                reqFrom: 'QuickOrder'
                            },
                            success: function(response) {
                                //console.log("response", response);
                                array = response;
                                array = array.replace("[", "");
                                array = array.replace("]", "");
                                array = array.split(",");
                                process(array);
                            }
                        });
                	}
                   
                },
            },{
    			type: 'numeric',
    		}],
    		enterBeginsEditing :false,
    		enterMoves: function () {
    			var maxCol = hot.getCellMeta(0, 0).columns.length-1
    			if(hot.getSelected()[1] >= maxCol) {
    				return {row: 1, col: -maxCol}
    			}else {
    				return {row: 0, col: 1}
    			}
    		}
    	});
    };
    
	QuickOrder.validateOrderPad = function(){
		var isAllRowEmpty = true;
		var isInvalidQty = false;
		var validationMessage = "";
		var qtyValidate = "";
		var separatorQty = "";
		var quickOrderRecordLimit;
		if($('#quickOrderRecordLimit').val() !="" && QuickOrder.isInt($('#quickOrderRecordLimit').val())){
			quickOrderRecordLimit = parseInt($('#quickOrderRecordLimit').val());
		}
		
		var countOfRowsWithData = 0;
		$("#example1 table tbody tr").each(function() {
			var trIsEmpty = true;
			var tr = $(this);
			tr.find("td:first").each(function() {
			   td = $(this);
			   if(!$(td).hasClass('listbox')){
				   if(QuickOrder.isTDEmpty(td)){
				  	  td.addClass('tdValidate');
				   }else{
					  ++countOfRowsWithData;
				  	  isAllRowEmpty = false;
				   	  tr.find("td:eq(1)").each(function() {
				   		  tdQty = $(this);
				   		  if(!QuickOrder.isTDValueNumber(tdQty)){
							  isInvalidQty = true;
							  tdQty.removeClass("htInvalid"); 
							  tdQty.addClass('tdValidate');
				   			  var qtyValmessage = "Enter Valid Quantity to row# : "+(tr.index()+1);
				   			  qtyValidate = qtyValidate+separatorQty+qtyValmessage;
				   			  separatorQty = "\n";
						  }
					  });
				   }
			   }
			});
		});
		if(!isAllRowEmpty){
			if(isInvalidQty){
				bootAlert("small","error","Error",qtyValidate);
			}else if(countOfRowsWithData > quickOrderRecordLimit){
				bootAlert("small","error","Error",locale("quickOrder.message.maxrecountsItemsCanBeUploaded")+quickOrderRecordLimit);
			}else{ 
				block("Please Wait");
				$("#orderPadCopy").html("");
				var row = "<table>";
				for(var i=0;i< data.length;i++){
					if(data[i][1]!=null && data[i][0]!=null){
						   row = row + ("<tr><td name='keyword'>"+data[i][0]+"</td><td name='qty'>"+data[i][1]+"</td></tr>");
					}
				}
				row = row +"</table>";
				$("#orderPadCopy").append(row);
				var jsonObjQuick = null;
				jsonObjQuick = [];
				$('#orderPadCopy table tbody tr').each(function(){
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
				console.log(jsonObjQuick);
				//var json = JSON.stringify(jsonObjQuick);
				
				var radioValue = $("input[name='QuickOrderPad']:checked").val();
	            if(radioValue){
	                radioValue;
	            }
	            if(radioValue!=null && radioValue=="Combine"){
					jsonObjQuick = QuickOrder.findDuplicateAndAddvalues(jsonObjQuick)
				}else if(radioValue!=null && radioValue=="Separate"){
					
				}else if(radioValue!=null && radioValue=="Remove"){
					jsonObjQuick = QuickOrder.findDuplicateAndRemove(jsonObjQuick);
				}

	            if(navigator.onLine){
	               QuickOrder.processQuickCart(jsonObjQuick, radioValue);
	               data = [[]];
	               QuickOrder.initHandsontable();
				}else{
					bootAlert("small","error","Error",locale("internert.connectivity.error"));
					return false;
				}
	           //QuickOrder.resetInputModes();
			}
		}else{
			bootAlert("small","error","Error","Please enter at least one Part#/UPC");
		}
	};

	QuickOrder.quickOrderCopyPaste = function(){
		var invalidQtyFlag = false;
		var invalidKeyWordFlag = false;
		var rowNumber = 1;
		var rowNumberString = "";
		var stringSeparator = "";
		var submitFlag = false;
		var validationMessage = "";
		var jsonObjQuick = null;
		jsonObjQuick = [];
		if(jQuery('#copyPasteText').length>0 && jQuery('#copyPasteText').val()!=null && jQuery('#copyPasteText').val().trim()!=""){
			block("Please Wait");
			var  copyText = jQuery('#copyPasteText').val();
			var lines = copyText.split("\n");
			var quickOrderRecordLimit = 50;
			if($('#quickOrderRecordLimit').lengt>0 && $('#quickOrderRecordLimit').val()!=null && $('#quickOrderRecordLimit').val()!="" && QuickOrder.isInt($('#quickOrderRecordLimit').val())){
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
							bootAlert("small","error","Error","Entered text is not in expected format. \nPlease copy the text with below pattern. \nQuantity [TAB or COMMA] Part#");
							submitFlag = false;
							break;
						}
					}
					rowNumber = rowNumber+1;
					stringSeparator = "\n";
				}
			}else{
				unblock();
				if(lines.length>quickOrderRecordLimit){
					bootAlert("small","error","Error",locale("quickOrder.message.maxrecountsItemsCanBeUploaded")+quickOrderRecordLimit);
				}
			}
			
		}else{
			bootAlert("small","error","Error","Please enter valid values");
			submitFlag = false;
		}
		if(invalidQtyFlag){
			unblock();
			setTimeout(function(){
				bootAlert("small","error","Error","Enter Valid Keyword to row# : \n"+rowNumberString);
			}, 500);
			submitFlag = false;
			return false;
		}
		if(invalidKeyWordFlag){
			unblock();
			setTimeout(function(){
				bootAlert("small","error","Error","Enter Valid Keyword to row# : \n"+rowNumberString);
			}, 500);
			submitFlag = false;
			return false;
		}
		
		if(submitFlag){
			//var json = JSON.stringify(jsonObjQuick);
			var radioValue = $("input[name='QuickOrderCopyPaste']:checked").val();
            if(radioValue){
                radioValue;
            }
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
					bootAlert("small","error","Error","Please upload .xlsx file.");
					return false;
				}else{
					return true;
				}
			}else{
				bootAlert("small","error","Error","Please choose a .xlsx file to upload.");
				$("[data-bb-handler='ok']").click(function(){
					$('#datafile').click();
				});
				return false;
			}
		}else{
			bootAlert("small","error","Error","Problem while uploading the file");
			return false;
		}
	};
	
	QuickOrder.processQuickCart = function(object, isSeparate){
		var myObject = new Object();
		if(typeof object!=null){
			myObject.itemDataList = object;
		}
		$("#searchResults").html("");
		var jsonData = JSON.stringify(myObject);
		$.ajax({
	        url: "/QuickOrderPadPage.action?processType="+isSeparate+"&date="+new Date(),
	        type:"post",
	        data: {
	        	jsonString: jsonData
	        },
	        success: function(response){
	        	if(response=="sessionexpired"){
					window.location.href="doLogOff.action";
				}
				$("#searchResults").html(response);
				$("#searchResults").show();
				var multiSliderCount = $('#multiResultSliderCount').val();
				if($('#itemsInCartSlider').length>0){
					$('#itemsInCartSlider').slick({
						  infinite: false,
						  slidesToShow: 4,
						  slidesToScroll: 4,
						  pauseOnHover:true,
						  responsive: [{
					                 breakpoint: 1024,
					                 settings: {
					                   slidesToShow: 3,
					                   slidesToScroll: 3,
					                 }
					               },
					               {
					                 breakpoint: 600,
					                 settings: {
					                   slidesToShow: 2,
					                   slidesToScroll: 2,
					                 }
					               },
					               {
					                 breakpoint: 480,
					                 settings: {
					                   slidesToShow: 1,
					                   slidesToScroll:1
					                 }
					               }
					             ]
					});
				}
				if($('#restrictedItemsSlider').length>0){
					$('#restrictedItemsSlider').slick({
						  infinite: false,
						  slidesToShow: 4,
						  slidesToScroll: 4,
						  pauseOnHover:true,
						  responsive: [{
					                 breakpoint: 1024,
					                 settings: {
					                   slidesToShow: 3,
					                   slidesToScroll: 3,
					                 }
					               },
					               {
					                 breakpoint: 600,
					                 settings: {
					                   slidesToShow: 2,
					                   slidesToScroll: 2,
					                 }
					               },
					               {
					                 breakpoint: 480,
					                 settings: {
					                   slidesToShow: 1,
					                   slidesToScroll:1
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
								  slidesToShow: 4,
								  slidesToScroll: 4,
								  pauseOnHover:true,
								  responsive: [{
							                 breakpoint: 1024,
							                 settings: {
							                   slidesToShow: 3,
							                   slidesToScroll: 3,
							                 }
							               },
							               {
							                 breakpoint: 600,
							                 settings: {
							                   slidesToShow: 2,
							                   slidesToScroll: 2,
							                 }
							               },
							               {
							                 breakpoint: 480,
							                 settings: {
							                   slidesToShow: 1,
							                   slidesToScroll:1
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
								    if (currentSlide + slick.options.slidesToShow > slick.slideCount) {
								    	$('.slick-next').hide();
								    }else{
								    	$('.slick-next').show();
								    }
							});
							$('#multipleResultSlider_'+i).find('.slick-prev').hide();
						}
					}
				}
				QuickOrder.updateCartCount();
				$('#bulkAction').selectpicker('refresh');
				unblock();
				triggerToolTip();
	        },
	        error:function(xhr, ajaxOptions, thrownError){bootAlert("small","error","Error",xhr.responseText); ShowMessage("??? ?? ?????? ??????? ????","fail");}
	    });
	};
	
})();

var limit = 50;
if($("#quickOrderRecordLimit").length>0){
	limit = parseInt($('#quickOrderRecordLimit').val());
}
var textarea = document.getElementById("copyPasteText");
var spaces = textarea.getAttribute("cols");
textarea.onkeyup = function() {
   var lines = textarea.value.split("\n");
    
   for (var i = 0; i < lines.length; i++) {
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
    if(lines.length>limit){
        textarea.style.color = 'red';
        if($("#copyPasteInstruction").length>0){
        	$("#copyPasteInstruction").css("font-weight", "bold")
        	$("#copyPasteInstruction").css("text-decoration", "underline")
        	bootAlert("medium","error","Error",'Max. '+limit+' items are allowed. Rest of the items will be omitted');
        }
        setTimeout(function(){
            textarea.style.color = '';
            $("#copyPasteInstruction").css("font-weight", "")
            $("#copyPasteInstruction").css("text-decoration", "")
        },2000);
    }    
   textarea.value = lines.slice(0, limit).join("\n");
};