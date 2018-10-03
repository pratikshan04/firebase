(function($) {
    $.fn.addToCart = function( options ) {
        var settings = $.extend({
			flyToCart:"Y",
			combinCart:"N",
			disappearCartPop:"N",
			qtyIntervalRefrence:"Y",
			animateBoxId:"box",
			CartBox:"addToCartFiller",
			checkCartItemsURL:"checkCartItemsPage.action",
			addToCartURL:"addToCartPage.action",
			blockPageID:"overlay",
			pricePrecision:2,
			quickCartView:"N",
			isProductLevel:"Y",
			productLevelClass:"filterSelClass",
			quickCartViewId:"cartQuickView",
        	cartCountRefreshId:"cartCountrefresh",
        	cartTotalRefreshId:"cartTotal",
        	pickupSupport:"N",
        	multipleAddtoCart:false,
        	functionalBlock:{
        					uomValuePrefix:"uomValue_",
							minOrderQtyPrefix:"MinOrderQty_",
							qtyPrefix:"itemTxtQty_",
							qtyIntervalPrefix:"OrderQtyInterval_",
							partNumberPrefix:"itmId_",
							itemTitlePrefix:"itemTitle",
							itemShortDescPrefix:"itemShortDesc",
							salesPriceQtyPrefix:"priceSaleQty_",
							priceValuePrefix:"priceValue_",
							salesQtyPrefix:"salesQty",
							itemImagePrefix:"imageName",
							quantityBreakFlagPrefix:"quantityBreakFlag_",
							quantityBreakSpanPrefix:"quantityBreakPricingDetails_"
			},
			designsBlock:{	
							priceClass:"ATCprice",
							quantityClass:"ATCQuantity",
							imageClass:"ATCimageName",
							itemNameClass:"ATCProductHeading",
							partNumberClass:"ATCPartNumber",
							UPC:"ATCUPC",
							itemShortDescClass:"ATCShortDesc",
							cartCountClass:"ATCCartCount"
			}			
		}, options);
        return this.each( function() {
        	if(settings.isProductLevel=="Y" && $("."+settings.isProductLevel)){
        		$("."+settings.isProductLevel).each(function(){
        			var selVal = $(this).attr("id");
        			var selValData = selData[selVal];
        			var selValId = selValData[jQuery(this).val()];
        			if(selValId.length != 1) {
        				bootAlert("small","error","Error","Please Select All Attribute");
        				return false;
        			}
        		});
        	}
        	if($('#'+settings.blockPageID)){
        		$('#'+settings.blockPageID).show();
        	}
        	var id = $(this).attr("data-itemId");
			var itemPriceId = $(this).attr("data-itemPriceId");
			$("#hidden_id").val(id);
			var qty = $.trim(parseInt($("#"+settings.functionalBlock.qtyPrefix+id).val()));
			var regex = new RegExp('/', 'g');
			var partNumber = $("#"+settings.functionalBlock.partNumberPrefix+id).val();
			partNumber = partNumber.replace(regex, '\\/');
			var minOrderQty = 1;
			var quantityInterval = 1;
			var uom = $("#"+settings.functionalBlock.uomValuePrefix+partNumber).val();
			if(settings.qtyIntervalRefrence=="Y"){
				minOrderQty = parseInt($("#"+settings.functionalBlock.minOrderQtyPrefix+partNumber).val());
				quantityInterval = parseInt($("#"+settings.functionalBlock.qtyIntervalPrefix+partNumber).val());
			}
			if(qty=="NaN")
			{
				bootAlert("small","error","Error","Invalid Qty.");
				$("#itemTxtQty"+id).val(minOrderQty);
				$("[data-cloneqty='cloneQty']").val(minOrderQty);
				if($('#'+settings.blockPageID)){
	        		$('#'+settings.blockPageID).hide();	
	        	}
				unblock();
				return false;
			}else{
				if(qty<1){
					bootAlert("small","error","Error","Quantity Cannot be less than or equal to 0");
					if($('#'+settings.blockPageID)){
		        		$('#'+settings.blockPageID).hide();	
		        	}
					unblock();
					return false;
				}
			}
			if(qty<minOrderQty){
				bootAlert("small","error","Error","Min Order Quantity is "+minOrderQty);
				$("#"+settings.functionalBlock.qtyPrefix+id).val(minOrderQty);
				if($('#'+settings.blockPageID)){
	        		$('#'+settings.blockPageID).hide();	
	        	}
				unblock();
				return false;
			}else if(qty>minOrderQty){
				var qtyDiff = qty-minOrderQty;
				if(qtyDiff%quantityInterval!=0){
					bootAlert("small","error","Error","Quantity Interval is "+quantityInterval +" Minimum Order Qty is:"+minOrderQty);
					if($('#'+settings.blockPageID)){
		        		$('#'+settings.blockPageID).hide();	
		        	}
					unblock();
					return false;
				}
			}
			enqueue(settings.checkCartItemsURL+'?productIdList='+id+'&qty='+qty+'&itemPriceId='+itemPriceId+'&partNumber='+partNumber+'&uom='+uom+'&dt='+new Date(),checkForDuplicateItems);
			function checkForDuplicateItems(s){
				var result = s.split("|");
				var requestURL = "?uom="+uom+'&productIdList='+id+'&qty='+qty+'&itemPriceId='+result[1]+'&partNumber='+result[4]+'&minOrdQty='+minOrderQty+'&ordQtyInter='+quantityInterval+'&dt='+new Date();
				if(result[0]==-1){
					if(settings.combinCart=='N'){
						var checkCart = bootbox.dialog({
							closeButton: false,
							title: 'Alert',
							message: 'This product currently exist in your cart.<br/> To create two separate line items of the same SKU select "separate".<br/> To combine into one line item select "combine".',
							buttons: {
								noclose: {
									label: "Separate",
									className: 'btn-warning',
									callback: function(){
										enqueue(settings.addToCartURL+requestURL, processAddToCart);
									}
								},
								ok: {
									label: "Combine",
									className: 'btn-info',
									callback: function(){
										enqueue(settings.addToCartURL+requestURL+'&update=update', processAddToCart);
									}
								},
								cancel: {
									label: "Cancel",
									className: 'btn-danger',
									callback: function(){
										if($('#'+settings.blockPageID)){
											$('#'+settings.blockPageID).show();	
										}
										if($('#'+settings.blockPageID)){
											$('#'+settings.blockPageID).hide();	
										}
										checkCart.modal('hide');
										return false;
									}
								}
							}
						});
					}else{
						enqueue(settings.addToCartURL+requestURL+'&update=update', processAddToCart);
					}
				}else{
					enqueue(settings.addToCartURL+requestURL, processAddToCart); 
				}
			}
			function processAddToCart(s){
				if(settings.flyToCart=="Y"){
					var cart = $("#"+settings.cartCountRefreshId);
					var imgtodrag = $("#"+settings.functionalBlock.itemImagePrefix+id);
					if (imgtodrag.length){
						var imgclone = imgtodrag.clone().offset({
			                'top': imgtodrag.offset().top,
			                'left': imgtodrag.offset().left
						}).css({
							'opacity': '0.5',
		                    'position': 'absolute',
		                    'height': '150px',
		                    'width': '150px',
		                    'z-index': '100'
						}).appendTo($("#"+settings.cartCountRefreshId)).animate({
							'top': cart.offset().top + 10,
		                    'left': cart.offset().left + 10,
		                    'width': 75,
		                    'height': 75
						}, 2000);
					imgclone.animate({
		                'width': 0,
		                    'height': 0
		            }, function () {
		                $(this).detach();
		            });
					} 
						
				}
				var result = s.split("|");
				var cartHtml = "";
				if(result[0]==-1){
					bootAlert("small","error","Error",result[2]);
				}else{
					pricePrecision = 2;
					if($("#pricePrecision")){
				    	pricePrecision = parseInt($("#pricePrecision").val());
				    }
					
					if(settings.quickCartView=="Y"){
						if($('#'+settings.blockPageID)){
			        		$('#'+settings.blockPageID).hide();	
			        	}
						$("#"+settings.quickCartViewId).click();
					}else{
						if($('#'+settings.blockPageID)){
			        		$('#'+settings.blockPageID).hide();	
			        	}
						//window.location="/Cart";
						cartHtml = buildCartNew(result[0],result[1],result[5]);
						$("#addedContent").html(cartHtml);
						$('#'+settings.animateBoxId).animate({'top': '50%','left':'50%'},50);
						if(settings.disappearCartPop=="Y"){
							startTimer();
						}
						if($('#'+settings.blockPageID)){
							$("#cartPopModel").modal();
			        	}
						

					}
					if($(".cartCountDisplayLi").hasClass("ItemsInCart")){
						$("#"+settings.cartCountRefreshId).each(function(){
							$(this).html(result[0]+' '+locale("header.label.items"));
							if($('#countInCart').length>0){
					    		$('#countInCart').val(result[0]);
					    	}
							//$(".cartCountrefresh").html(result[0]);
						});
					}else{
						//$(".cartCountDisplayLi").addClass("ItemsInCart");
						//$(".cartCountDisplayLi").html('<a href="/'+locale("website.url.ShoppingCart")+'"><i class="fa fa-shopping-cart"></i><span id="cartCountrefresh" class="cartCountrefresh"> '+result[0]+' '+locale("header.label.items")+'</span></a>')
						$(".cartCountrefresh").html(result[0]+' '+locale("header.label.items"));
						if($('#countInCart').length>0){
				    		$('#countInCart').val(result[0]);
				    	}
					}
					
					/*if($(".cartTotalDisplayLi").hasClass("ItemsInCart")){
						$("#"+settings.cartTotalRefreshId).each(function(){
							$(this).html(Number(result[4]).toFixed(pricePrecision));
						});
					}else{
						$(".cartTotalDisplayLi").addClass("ItemsInCart");
						$(".cartTotalDisplayLi").html('<a href="/'+locale("website.url.ShoppingCart")+'">'+locale("product.label.orderTotal")+': $<span id="cartTotal" class="cartTotal">'+Number(result[4]).toFixed(pricePrecision)+'</span></a>')
					}*/
				}
			}
			
			function buildCartNew(cartCount,status,itemCount){
				var shortDesc = $.trim($("#"+settings.functionalBlock.itemShortDescPrefix+id).text());
				var iChars = "/!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_ /g";
				partNumber= partNumber.replace(iChars,"\\$1");
				var price = document.getElementById(settings.functionalBlock.priceValuePrefix+partNumber).value;
				var salesPriceQty = $("#"+settings.functionalBlock.salesPriceQtyPrefix+partNumber).val();
				var quantityBreakFlag = "N";
				//var salesQty = $("#"+settings.functionalBlock.salesQtyPrefix+id).val();
				
				if($("#quantityBreakFlag_"+partNumber).length>0){
					quantityBreakFlag = $("#quantityBreakFlag_"+partNumber).val();
				}
				
				price = price.replace(",","");
				if(quantityBreakFlag=="Y" && $("#quantityBreakPricingDetails_"+partNumber).length>0){
					var quantityBreak = $("#quantityBreakPricingDetails_"+partNumber).html();
					var qBreakArray = quantityBreak.split("~");
					if(qBreakArray!=null && qBreakArray.length>0){
						for(var q=0; q<qBreakArray.length; q++){
							var qtyBreakNpriceArr = qBreakArray[q].split("|");
							if(qtyBreakNpriceArr!=null && qtyBreakNpriceArr.length>0){
								if(parseFloat(qtyBreakNpriceArr[0])>0 && parseFloat(qty)>=parseFloat(qtyBreakNpriceArr[0])){
									price = qtyBreakNpriceArr[1].replace(",","");
								}
							}
						}
					}
				}
				
				var tempPrice = 0;
				if(salesPriceQty>0){
					tempPrice = price/salesPriceQty;
				}else{
					tempPrice = price;
				}
				/*if(shortDesc.length>97){
					shortDesc=shortDesc.substring(0,97)+"...";
				}*/
				var displayPrice = (tempPrice) * parseInt(qty);
				if(displayPrice==0){
					displayPrice="Call for Price";
				}else{
					if(pricePrecision=="4"){
						displayPrice = displayPrice.toFixed(4);
					}else{
						displayPrice = displayPrice.toFixed(2);	
					}
					displayPrice = "$"+ displayPrice;
				}
				if($("#enablePiwik").val() == 'Y'){
					var categoryNameFrPiwik = $("#CategoryName_"+partNumber).val();
					piwik.addEcommerceItemPiwik(partNumber, shortDesc, "", parseFloat(displayPrice),itemCount);
				}
				
				$("."+settings.designsBlock.imageClass).attr("src",$("#"+settings.functionalBlock.itemImagePrefix+id).attr("src"));
				$("."+settings.designsBlock.imageClass).height("100%");
				$("."+settings.designsBlock.imageClass).width("100%");
				$("."+settings.designsBlock.itemNameClass).html($("#"+settings.functionalBlock.itemTitlePrefix+id).text());
				$("."+settings.designsBlock.partNumberClass).html(partNumber);
				$("."+settings.designsBlock.quantityClass).html(qty);
				$("."+settings.designsBlock.itemShortDescClass).html(shortDesc);
				$("."+settings.designsBlock.priceClass).html(displayPrice);
				$("."+settings.designsBlock.cartCountClass).html(cartCount);
				$(".ATCMPartNumber").html($("#MPNValue_"+partNumber).val());
				
				if($(".productLeadTime_"+partNumber).is(":visible")){
					$(".ATCavailableorLeadTime").html("Lead Time: ");
					var leadTime = "";
					$(".leadTime_"+partNumber).each(function(){
						leadTime = $(this).text();
					});
					$(".ATCLeadTime").html(leadTime);
					$(".ATCLeadTime").parent().show();
				}
				if($(".Avail_"+partNumber).is(":visible")){
					$(".ATCavailableorLeadTime").html("Availability: ");
					var avail = "";
					$(".Avail_"+partNumber).each(function(){
						avail = $(this).text();
					});
					$(".ATCLeadTime").html(avail);
					$(".ATCLeadTime").parent().show();
				}
				var cartHtml = $("#"+settings.CartBox).html();
				return cartHtml;
			}
		});
    };
    
    $.fn.sendNotificationOnCallForPrice = function( options ) {
    	var settings = $.extend({
			sendNotificationURL:"sendCallForPriceNotificationLink.action",
			blockPageID:"overlay",
			loggedInUserName:"loggedInUserName",
			siteDisplayName: "siteDisplayName",
        	functionalBlock:{
        					partNumberNotificationPrefix:"itmId_"
			}			
		}, options);
        return this.each( function() {
        	var regex = new RegExp('/', 'g');
        	var id = $(this).attr("data-itemId");
			var itemPriceId = $(this).attr("data-itemPriceId");
			var partNumber = $("#"+settings.functionalBlock.partNumberNotificationPrefix+id).val();
			partNumber = partNumber.replace(regex, '\\/');
			/*if($('#'+settings.blockPageID)){
        		$('#'+settings.blockPageID).show();
        	}*/
			jAlert("Please contact "+$('#'+settings.siteDisplayName).val()+" on this item","Alert");
			enqueue(settings.sendNotificationURL+'?partNumber='+partNumber+'&userName='+$('#'+settings.loggedInUserName).val()+'&dt='+new Date(),function(){
				/*if($('#'+settings.blockPageID)){
	        		$('#'+settings.blockPageID).hide();	
	        	}*/
				unblock();
				return false;
			});
		});
    };
    
}(jQuery));
