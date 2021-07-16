(function(){
	var obj;
	function extendDefaults(source, tableID, extendSettings) {
		var property;
		for (property in extendSettings){
			if (extendSettings.hasOwnProperty(property)) {
				source[property] = extendSettings[property];
			}
		}
		pagenationCall(source, tableID);
		navObj = source;
	}
	function pagenationCall(obj, tableID){
		var nextAndPrev = 0;
		var linkHolderWrap = [];
		var totalPages =  Math.ceil(obj.totalRecords / obj.perPage);
		var pageableCounter = obj.displyLinks;
		if(totalPages < obj.displyLinks){
			pageableCounter = totalPages;
		}
		var paginatSet = Math.ceil(totalPages / obj.displyLinks), k=0, j=0;
		if(!$("#"+tableID+"_Wrapper").html()){
			$('#'+tableID).wrap("<div id='"+tableID+"_Wrapper'></div>");
		}
		var linkHolder = [];
		while (j < totalPages) {
			j++;
			if(k === 5) {
				linkHolderWrap.push(linkHolder);
				linkHolder = [];
				k = 0 ;
			}
			var active ="";
			if(k == 0){
				active = "active";
			}
			linkHolder.push("<a aria-controls='"+tableID+"' data-index='"+j+"' title='Ir a la pagina "+ j +"' class="+active+">"+ j +"</a>");
			k++;
		}
		(k > 0) ? linkHolderWrap.push(linkHolder) : "";
		
		if($("#"+tableID+"_Wrapper .pageSortWrap").html() == "" || $("#"+tableID+"_Wrapper .pageSortWrap").html() == undefined){
            $("#"+tableID+"_Wrapper").prepend("<div class='pageSortWrap'></div>");
        }
        if($("#"+tableID+"_Wrapper .paginatListWrap").html() == "" || $("#"+tableID+"_Wrapper .paginatListWrap").html() == undefined){
            $("<div class='paginatListWrap'></div>").appendTo("#"+tableID+"_Wrapper");
        }
		$("#"+tableID+"_paginat").remove();
		if(!$('#'+tableID+"_sortWrap")[0]){
			var sortList = "<span id='"+tableID+"_sortWrap' class='uni_sort'><span> Mostrar </span><select id='"+tableID+"_sort'><option value='10'>10</option><option value='20'>20</option><option value='30'>30</option><option value='40'>40</option></select></span>";
			$("#"+tableID+"_Wrapper .pageSortWrap").prepend(sortList);
		}
		var paginatList = "<span id='"+tableID+"_paginat' class='uni_paginate'>";
		
		if(totalPages > obj.displyLinks){
			paginatList += "<a href='javascript:void(0);' class='prev disable' data-prev=''><i class='fa fa-play fa-rotate-180' aria-hidden='true'></i> </a>";
		}
		if(linkHolderWrap.length > 0){
			paginatList += "<span>"+linkHolderWrap[0].join("")+"</span>";
		}
		if(totalPages > obj.displyLinks){
			paginatList += "<a href='javascript:void(0);' class='next active' data-next='1' data-index='6'> <i class='fa fa-play' aria-hidden='true'></i></a>";
		}
		
		paginatList += "</span>";
		
		$(paginatList).appendTo("#"+tableID+"_Wrapper .paginatListWrap")
		$("#"+tableID+"_paginat .next").click(function(){
			var nextSet = $(this).attr("data-next");
			if(nextSet){
				nextSet = parseInt(nextSet);
				$(this).parent().find('.prev').attr('data-prev', nextSet-1).addClass('active').removeClass('disable');
				if(linkHolderWrap.length >  nextSet+1){
					$(this).parent().find('.next').attr('data-next', nextSet+1).addClass('active').removeClass('disable');
				}else{
					$(this).parent().find('.next').attr('data-next', '').addClass('disable').removeClass('active');
				}
				$(this).parent().find('span').html(linkHolderWrap[nextSet].join(""));
				nextAndPrev = (obj.displyLinks * (nextSet)) + 1;
				$(this).attr("data-index", nextAndPrev);
			}
			navigation(this, tableID, "");
		});
		$("#"+tableID+"_paginat .prev").click(function(){
			var prevSet = $(this).attr("data-prev");
			if(prevSet){
				prevSet = parseInt(prevSet);
				$(this).parent().find('.next').attr('data-next', prevSet+1).addClass('active').removeClass('disable');
				if(prevSet != 0){
					$(this).parent().find('.prev').attr('data-prev', prevSet-1).addClass('active').removeClass('disable');
				}else{
					$(this).parent().find('.prev').attr('data-prev', '').addClass('disable').removeClass('active');
				}
				$(this).parent().find('span').html(linkHolderWrap[prevSet].join(""));
				nextAndPrev = (obj.displyLinks * (prevSet)) + 1;
				$(this).attr("data-index", nextAndPrev);
			}
			navigation(this, tableID, "");
		});
		$('#'+tableID+'_sort').change(function(){
			var perPageSort = parseInt($(this).val());
			//reInitiate(tableID, perPageSort);
			obj['perPage'] = perPageSort;
            pagenationCall(obj, tableID);
			navigation("", tableID, "");
		});

		$("#"+tableID+"_paginat").on('click', 'span a',function(){
			if(!$(this).hasClass('active')){
				navigation(this, tableID, "");
				$('#'+tableID+'_paginat span a').removeClass('active');
				$(this).addClass('active');
			}
		});
	}
	function reInitiate(tableID, sort, url, totalRecords){
		if(totalRecords){
			navObj.totalRecords = totalRecords;
		}
		
		new initTable(tableID, {
			actionUrl: navObj.actionUrl,
			totalRecords: totalRecords,
			perPage: sort,
			startIndex: navObj.startIndex,
			displyLinks: navObj.displyLinks,
			customerNumber: navObj.customerNumber,
			requestType: navObj.requestType
		});
	}
	
	function navigation(ele, tableID, searchParams){
		if(!$(".uniTableBlock").html()){
			$("<div class='uniTableBlock' style='position: absolute;z-index: 10;top: 0;right: 0;bottom: 0;left: 0;overflow: auto;text-align: center;padding: 10px 10px 0;background: rgba(0,0,0,0.4);cursor: wait;'><div style='width: 100%;padding: 2px;color: #5b5c5e;background: #fff;max-width: 300px;display: inline-block;position: relative;vertical-align: middle;cursor: auto;top: 50%;margin-top: -30px;font-size: 30px;border-radius: 5px;'>Espere por favor...</div></div>").appendTo("#"+tableID+"_Wrapper");
		}
		$("#"+tableID+"_Wrapper").css("position","relative")
		var  queryParams = "";
		var perPage = parseInt($("#"+tableID+"_sort").val());
		var actionUrl = navObj.actionUrl;var startingIndex = 0,  pageIndex = 0;
		if(ele){
			startingIndex = parseInt($(ele).attr("data-index"));
			//pageIndex = (startingIndex * perPage) - perPage;
			pageIndex = startingIndex;
		}
		if(!perPage){
			perPage = navObj.perPage;
		}
		//queryParams += "&customerNumber=" + navObj.customerNumber;
		queryParams += "&pageNo=" + pageIndex;
		queryParams += "&pageNumber=" + pageIndex;
		queryParams += "&pageSize=" + perPage;
		queryParams += "&requestType="+ navObj.requestType;
		queryParams += "&tableID=" + tableID;
		if(searchParams){
			queryParams += "&" + searchParams;
		}else{
			var formSerialize = "";
			if($("#"+tableID).attr("data-formID")){
				serached = $("#"+tableID).attr("data-formID");
				formSerialize = $("#"+serached).serialize();
				queryParams += "&" + formSerialize;
			}
		}
		pageChange(actionUrl, queryParams, tableID);
	}
	function pageChange(url, queryParams, tableID){
		localStorage.setItem("tableName", tableID);
		var totalpageCounts = navObj.totalRecords;
		$.ajax({
		type: "POST",
		url: url,
		data: queryParams,
		success: function(response){
			// if($(response).find("#totalpageCounts") != ""){
			// 	var totalpageCounts = parseInt($(response).find("#totalpageCounts").val());
			// }
			//console.log(totalpageCounts);
			var tableName = localStorage.getItem("tableName");
			var tbodyData = $(response).find('#'+tableName +' tbody').html();
			$("#"+tableName+" tbody").html(tbodyData);
			$(".uniTableBlock").remove();
			$("#"+tableName+"_Wrapper").removeAttr("style");
			if((totalpageCounts != "" || totalpageCounts == 0) && navObj.totalRecords != totalpageCounts){
				reInitiate(tableID, navObj.perPage, url, totalpageCounts);
			}
			localStorage.removeItem("tableName");
		}
	});
	}
	this.initTable = function(){
		var settings = {
			actionUrl: "",
			totalRecords: "",
			perPage: 10,
			startIndex: 0,
			displyLinks: 5,
			customerNumber: "",
			requestType: ""
		};
		
		if (arguments[1] && typeof arguments[1] === "object") {
			this.options = extendDefaults(settings, arguments[0],arguments[1]);
		}
	};
	
	this.initTable.prototype.search = function(obj){
		if(obj.dataset.search){
			var searchAction = obj.dataset.search;
			navObj.actionUrl = searchAction;
		}
		var tableID = obj.dataset.table;
		var formid = obj.attributes['form'].value;
		var searchValueEncode= $("#" + obj.attributes.form.value).find('input[type=text]').val();
		if(searchValueEncode!="" && searchValueEncode!="undefined" && searchValueEncode!=null)
		{
			var str=escape(searchValueEncode);
			$('input[name=searchString]').val(str);
		}
		var searchParams = $("#" + obj.attributes.form.value).serialize();
		var data = $("#openTable").val();
		$("#"+tableID).attr("data-formID", obj.attributes.form.value);
		$("#"+formid).find('[data-reset]').attr("data-searchactive", "Y");
		if(searchParams.split("&")[searchParams.split("&").length - 1] == "searchString=" && data!= "openOrderPage"){
			jAlert('Please enter a value to search','Alert');
			}
			else{
		navigation("", tableID, searchParams);
			}
		
	};
	
	this.initTable.prototype.resetSearch = function(obj){
		if(obj.dataset.searchactive == "Y"){
			var formReset = obj.attributes['form'].value;
			document.getElementById(formReset).reset();
			$('input[name=searchString]').val('');
			var clearAction = "";
			if(obj.dataset.reset){
				obj.dataset.searchactive = "N";
				clearAction = obj.dataset.reset;
				navObj.actionUrl = clearAction;
			}
			var tableID = obj.dataset.table;
			$("#"+tableID+"_favorites").attr("checked", false);
			navigation("", tableID, "");
		}else{
			jAlert('Please search to reset results', 'Alert');
		}
	};
	
	this.initTable.prototype.favorites = function(obj){
		var actionUrl = "";
		var favCustToggle = "";
		var tableID = obj.dataset.table
		if(obj.checked){
			favCustToggle = obj.dataset.favsearch;
			actionUrl = obj.dataset.checked;
		}else{
			favCustToggle = obj.dataset.custsearch;
			actionUrl = obj.dataset.unchecked
		}
		if(obj.dataset.form){
			if(obj.dataset.form == "customerListPopForm"){
				navObj.requestType = "popup";
			}else{
				navObj.requestType = "page";
			}
			$("#"+obj.dataset.form)[0].reset();
			$("#"+obj.dataset.form).find("a").attr("data-search", favCustToggle);
		}
		navObj.actionUrl = actionUrl;
		navigation("", tableID, "");
	}
}());