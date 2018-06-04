var curLat = "";
var curLong = "";
if (!!navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        curLat = position.coords.latitude;
        curLong = position.coords.longitude;
    });
}
var siteDisplayName = $("#siteDisplayName").val();
var Latitude = new Array();
var Longitude = new Array();
var BranchName = new Array();
var BranchId = new Array();
var BranchCode = new Array();
var Locality = new Array();
var Street = new Array();
var Phone = new Array();
var FaxNum = new Array();
var WorkHour = new Array();
var Note = new Array();
var GMarkers = new Array();
var Email = new Array();
var City = new Array();
var State = new Array();
var Zip = new Array();
var Country = new Array();
var distance = new Array();
var WarehouseImage = new Array();
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var marker1;
var Selected = -1;

var defaultLat="";
var defaultLong="";
var defaultZoomVal="";
var defaultNearestVal="";

function init(data, dataFrom, sheetUrl, centre_cord, zoomVal, nearestLocationVal) {
    if (dataFrom == "DATABASE" || dataFrom == "database") {
        for (var i = 0; i < data.length; i++) {
            Latitude[i] = data[i].latitude;
            Longitude[i] = data[i].longitude;
            BranchName[i] = data[i].branchName;
            Locality[i] = data[i].locality;
            BranchId[i] = data[i].branchId;
            BranchCode[i] = data[i].branchCode;
            Street[i] = data[i].street;
            Phone[i] = data[i].phone;
            if(distance[i]==null || distance[i]==undefined || distance[i]==""){
            	distance[i] = findDistance(curLat, curLong, data[i].latitude, data[i].longitude);
            }
            FaxNum[i] = data[i].faxNum;
            WorkHour[i] = data[i].workHour;
            Note[i] = data[i].note;
            Email[i] = data[i].email;
            City[i] = data[i].city;
            State[i] = data[i].state;
            Zip[i] = data[i].zip;
            Country[i] = data[i].country;
            WarehouseImage[i] = data[i].warehouseImage;
        }
        var coordinates = centre_cord.split(',');
        defaultLat = parseFloat(coordinates[0]);
        defaultLong = parseFloat(coordinates[1]);
        defaultZoomVal = zoomVal;
        defaultNearestVal = nearestLocationVal;
        initialize(defaultLat, defaultLong, defaultZoomVal, defaultNearestVal);
        //localStorage.clear();
    } else {
        localStorage.clear();
        var url_parameter = document.location.search.split(/\?url=/)[1];
        var url = url_parameter || sheetUrl;
        var googleSpreadsheet = new GoogleSpreadsheet();
        googleSpreadsheet.url(url);
        googleSpreadsheet.load(function(result) {
            var columnSize = 7;
            var j = 0;
            for (var i = columnSize; i < result['data'].length; i++, j++) {
                BranchName[j] = result['data'][i];
                i++;
                Street[j] = result['data'][i];
                i++;
                Locality[j] = result['data'][i];
                i++;
                Phone[j] = result['data'][i];
                i++;
                FaxNum[j] = result['data'][i];
                i++;
                Latitude[j] = result['data'][i];
                i++;
                Longitude[j] = result['data'][i];
                i++;
                WorkHour[j] = result['data'][i];
                i++;
                Note[i] = result['data'][i];
                i++;
                Email[i] = result['data'][i];
                i++;
                City[i] = result['data'][i];
                i++;
                State[i] = result['data'][i];
                i++;
                Zip[i] = result['data'][i];
                i++;
                Country[i] = result['data'][i];
                i++;
                WarehouseImage[i] = result['data'][i];
                i++;
            }
            initialize("", "", "8", "");
        });
    }
    $("#totalLocations").val(data.length);
}

function loadAllMap(){
	window.location.reload();
}

function GetDirections() {
    var start = document.getElementById("searchTextField").value;
    var end = document.getElementById("directions-to").value;
    var desLocation = new google.maps.LatLng(document.getElementById("directions-to").name.split("/")[0], document.getElementById("directions-to").name.split("/")[1]);
    if (start != '') {
        var request = {
            origin: start,
            destination: desLocation,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
                directionsDisplay.setPanel(document.getElementById('ren'));
            }
        });
        var viweall = $(".cimm_icon").attr('id');
        if (viweall != "viweAll") {
            $("#googleMap").css({ "opacity": "1","z-index": "1"});
            $("#map_canvas").css({"opacity": "0","z-index": "-1"});
        }
    }
}

function initialize(lattitude, longitude, zoomVal, nearestLocationVal) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapProp = {
        /*center : new google.maps.LatLng(43.162336, -80.250366),*/
        center: new google.maps.LatLng(lattitude, longitude),
        zoom: parseInt(zoomVal),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    if (true) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currLat = position.coords.latitude;
            currLong = position.coords.longitude;
        });
    }
    directionsDisplay.setMap(map);
    document.getElementById("list").innerHTML = "";
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    for (var i = 0; i < Latitude.length; i++) {
        // Infowindow design
        var InfoOuterMostDiv = document.createElement("div");
        InfoOuterMostDiv.setAttribute("class", "croutermost");
        var InfoStore = document.createElement("div");
        InfoStore.setAttribute("class", "InfoStore");
        InfoOuterMostDiv.appendChild(InfoStore);

        var InfoTitle = document.createElement("div");
        InfoTitle.setAttribute("class", "Title");
        var boldTitle = document.createElement("b");
        boldTitle.innerHTML = BranchName[i];
        InfoTitle.appendChild(boldTitle);
        InfoStore.appendChild(InfoTitle);

        var InfoStreet = document.createElement("div");
        InfoStreet.setAttribute("class", "Street");
        InfoStreet.innerHTML = Street[i];
        InfoStore.appendChild(InfoStreet);

        var InfoLocality = document.createElement("div");
        InfoLocality.setAttribute("class", "Locality");
        InfoLocality.innerHTML = Locality[i];
        InfoStore.appendChild(InfoLocality);

        var InfophoneDiv = document.createElement("div");
        InfophoneDiv.setAttribute("class", 'Phone');
        InfophoneDiv.innerHTML = 'Phone: ' + Phone[i];
        InfoStore.appendChild(InfophoneDiv);

        var InfofaxDiv = document.createElement("div");
        InfofaxDiv.setAttribute("class", 'FaxNum');
        InfofaxDiv.innerHTML = 'Fax: ' + FaxNum[i];
        InfoStore.appendChild(InfofaxDiv);


        var InfofaxDiv = document.createElement("div");
        InfofaxDiv.setAttribute("class", 'Email');
        InfofaxDiv.innerHTML = 'Email: ' + Email[i];
        InfoStore.appendChild(InfofaxDiv);

        var ZoomHere = document.createElement("a");
        ZoomHere.innerHTML = 'Zoom here ';
        ZoomHere.setAttribute("id", i);
        ZoomHere.setAttribute("class", "crzoomhere");
        InfoStore.appendChild(ZoomHere);

        var ZoomHereCallBack = function() {
            map.setZoom(11);
            map.panTo(GMarkers[this.id].getPosition());
        };
        $(ZoomHere).click(ZoomHereCallBack);

        var Directions = document.createElement("a");
        Directions.innerHTML = 'Map and Driving Directions';
        Directions.setAttribute("id", BranchName[i]);
        Directions.setAttribute("name", i);
        Directions.setAttribute("class", "crdirections");
        Directions.setAttribute("street", Street[i]);
        Directions.setAttribute("state", Locality[i]);
        //InfoStore.appendChild(Directions);
       
        // create marker
        //var iconBase = '/WEB_THEMES/'+siteName+'/images/';
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(Latitude[i],
                Longitude[i]),
            info: InfoOuterMostDiv,
            id: i,
            map: map,
            animation: google.maps.Animation.DROP,
            //icon: iconBase + 'custom-marker-store.png'
        });
        marker.setMap(map);
        GMarkers[i] = marker; // Storing
        var outerUL = document.getElementById("list");
        var addressLI = document.createElement('li');
        addressLI.setAttribute("id", i);
        outerUL.appendChild(addressLI);
        var addressLIEventFunction = function() {
            if (Selected != -1) {
                infowindow.close();
                document.getElementById(Selected).setAttribute("class", 'store');
            }
            Selected = this.id;
            document.getElementById(Selected).setAttribute("class", 'crselected1');
            infowindow.setContent(GMarkers[this.id].info);
        };
        
        $(addressLI).click(addressLIEventFunction);
        var outerDiv = document.createElement("div");
        outerDiv.setAttribute("data-toggle", 'collapse');
        outerDiv.setAttribute("class", "clearAfter");
        outerDiv.setAttribute("data-target", '#locDetails' + "_" + BranchId[i]);
        outerDiv.setAttribute("data-locName", BranchName[i]);
        outerDiv.setAttribute("onclick", "loadLocationDetails(this); newmap(this);");
        addressLI.appendChild(outerDiv);

        var listBlock = document.createElement("ul");
        listBlock.setAttribute("id", "locDetails" + "_" + BranchId[i]);
        listBlock.setAttribute("class", "locationDetailList collapse");
        addressLI.appendChild(listBlock);

        var iconBlock = document.createElement("span");
        iconBlock.setAttribute("class", "iconToggle");
        iconBlock.innerHTML = '<i class="fa fa-caret-right"></i>';
        outerDiv.appendChild(iconBlock);
        
        var titleBold = document.createElement("span");
        titleBold.setAttribute("class", "productTitle pull-left");
        titleBold.innerHTML = BranchName[i];
        outerDiv.appendChild(titleBold);

       /* var distanceBlock = document.createElement("span");
        distanceBlock.setAttribute("class", "locDistance pull-right");
        distanceBlock.innerHTML = distance[i];
        outerDiv.appendChild(distanceBlock);*/

        var streetDiv = document.createElement("li");
        streetDiv.setAttribute("class", 'Street');
        streetDiv.innerHTML = Street[i];
        listBlock.appendChild(streetDiv);

        var localityDiv = document.createElement("li");
        localityDiv.setAttribute("class", 'Locality');
        localityDiv.innerHTML = Locality[i];
        listBlock.appendChild(localityDiv);

        var phoneDiv = document.createElement("li");
        phoneDiv.setAttribute("class", 'Phone'); //phoneDiv.setAttribute("class", 'Phone');
        phoneDiv.innerHTML = '<a class="primaryColor" href="tel:' + Phone[i] + '">' + Phone[i] + '</a>'; //'P: ' ;
        listBlock.appendChild(phoneDiv);

        if(FaxNum[i]!= null && FaxNum[i]!="") {
            var faxDiv = document.createElement("li");
            faxDiv.setAttribute("class", 'Fax');
            faxDiv.innerHTML = '<b>Fax:</b> <a href="tel:' + FaxNum[i] + '">' + FaxNum[i] + '</a>';
            listBlock.appendChild(faxDiv);
        }

        if(Email[i]!= null && Email[i]!=""){
	        var emailDiv = document.createElement("li");
	        faxDiv.setAttribute("class", 'Email');
	        faxDiv.innerHTML = '<b>Email: </b><a href="mailto:' + Email[i] + '">' + Email[i] + '</a>';
	        listBlock.appendChild(emailDiv);
        }

        if(Note[i]!= null && Note[i]!=""){
	        var noteDiv = document.createElement("li");
	        noteDiv.setAttribute("class", 'Note');
	        noteDiv.innerHTML = '<b>Note: </b>'+Note[i];
	        listBlock.appendChild(noteDiv);
        }

        if(WorkHour[i]!= null && WorkHour[i]!="") {
            var workhourDiv = document.createElement("li");
            workhourDiv.setAttribute("class", 'Workhours');
            workhourDiv.innerHTML = 'Office Hours: '+WorkHour[i];
            listBlock.appendChild(workhourDiv);
        }

        if(Latitude[i]!= null && Latitude[i]!=""){
	        var latDiv = document.createElement("li");
	        latDiv.setAttribute("class", 'Lat hideMe');
	        latDiv.innerHTML = Latitude[i];
	        listBlock.appendChild(latDiv);
        }
        if(Longitude[i]!= null && Longitude[i]!=""){
	        var lonDiv = document.createElement("li");
	        lonDiv.setAttribute("class", 'Lon hideMe');
	        lonDiv.innerHTML = Longitude[i];
            listBlock.appendChild(lonDiv);
        }
        
        var directionBlock = document.createElement("li");
        directionBlock.setAttribute("class", "directionBtn marginY-2");
        var Directions = document.createElement("a");
        Directions.innerHTML = 'Map and Driving Directions';
        Directions.setAttribute("id", BranchName[i]);
        Directions.setAttribute("name", i);
        Directions.setAttribute("class", "crdirections blockElement");
        Directions.setAttribute("street", Street[i]);
        Directions.setAttribute("state", Locality[i]);
        Directions.setAttribute('Lat',Latitude[i]);
        Directions.setAttribute('Long',Longitude[i]);
        Directions.setAttribute("onclick", "directionsEventFunction(this);");
        directionBlock.appendChild(Directions);
        listBlock.appendChild(directionBlock);
        
        var wimageDiv = document.createElement("li");
        wimageDiv.setAttribute("class", 'Wimage hideMe');
        if (WarehouseImage[i] != null && WarehouseImage[i] != undefined) {
            wimageDiv.innerHTML = WarehouseImage[i];
        }
        if (Longitude[i] != null)
            listBlock.appendChild(wimageDiv);

        var infowindow = new google.maps.InfoWindow({});
        var infowindow1;
        if (BranchName[i] == nearestLocationVal && localStorage.getItem("showNearestLoc")) {
            var locId = i;
            if (marker.id == locId) {
                infowindow1 = new google.maps.InfoWindow({});
                infowindow1.setContent(marker.info);
                infowindow1.open(map, marker);
                if (Selected != -1) {
                    document.getElementById(Selected).setAttribute("class", 'store');
                }
                Selected = marker.id;
                var first = marker.info.firstChild;
                $(first).find("a").first().attr("class", 'crselected1');
                $(first).addClass("active");
                map.setZoom(8);
                map.panTo(GMarkers[locId].getPosition());
            }
            localStorage.removeItem("nearestLocationVal");
            localStorage.removeItem("showNearestLoc");
        }
        google.maps.event
            .addListener(
                marker,
                'click',
                function() {
                    infowindow.setContent(this.info);
                    infowindow.open(map, this);
                    if (Selected != -1) {
                        if (typeof infowindow1 != 'undefined')
                            infowindow1.close();
                        document.getElementById(Selected).setAttribute("class", 'store');
                    }
                    Selected = this.id;
                    document.getElementById(Selected).setAttribute("class", 'crselected1');
                });
    }
    if (Latitude.length > 1) {
        var allLocation = "<li><a class='store'><div class='productTitle Title' id='viweAll'>All Locations</div></a></li>";
        $("ul.store-list").prepend(allLocation);
    }
    var input = document.getElementById('searchTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);

    marker1 = new google.maps.Marker({
        map: map
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        marker1.setVisible(false);
        input.className = '';
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // Inform the user that the place was not found and return.
            input.className = 'notfound';
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };
        marker1.setIcon(image);
        marker1.setPosition(place.geometry.location);
        marker1.setVisible(true);
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        var viweall = $(".cimm_icon").attr('id');
        if (viweall != "viweAll") {
            $("#googleMap").css({
                "opacity": "1",
                "z-index": "1"
            });
            $("#map_canvas").css({
                "opacity": "0",
                "z-index": "-1"
            });
        }
    });
}

function closeDirections() {
    document.getElementById("directions-panel").setAttribute("class", 'crpanel');
    document.getElementById("directions-panel").style.display = "none";
    document.getElementById("list").setAttribute("class", 'store-list');
    document.getElementById("list").style.display = "block";
    directionsDisplay.set('directions', null);
    marker1.setVisible(false);
    document.getElementById('searchTextField').value = '';
    var viweall = $(".cimm_icon").attr('id');
    if (viweall != "viweAll") {
        $("#googleMap").css({
            "opacity": "0",
            "z-index": "-1"
        });
        $("#map_canvas").css({
            "opacity": "1",
            "z-index": "1"
        });
        $('.storeDetailview').show();
    }
}
var Lat = "";
var Lon = "";
var latlng2 = "";

function newmap(obj) {
	if($(obj).find('.iconToggle i').hasClass('fa-caret-right')){
		jQuery(obj).find('.iconToggle i').removeClass('fa-caret-right').addClass('fa-caret-down');
	}else{
		jQuery(obj).find('.iconToggle i').removeClass('fa-caret-down').addClass('fa-caret-right');
	}
    var inFoBlockId = $(obj).attr('data-target');
    Lat = $(inFoBlockId).find('.Lat').text();
    Lon = $(inFoBlockId).find('.Lon').text();
    latlng2 = new google.maps.LatLng(Lat, Lon);
    initialize2(latlng2, obj);
}
var mapCanvas = "";
var state = '';
var street = '';

function initialize2(latlng2, obj) {
    var myOptions = {
        zoom: 17,
        center: latlng2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    mapCanvas = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var marker = new google.maps.Marker({
        position: latlng2,
        map: mapCanvas,
        animation: google.maps.Animation.DROP,
        info: obj
    });
    var infowindow = new google.maps.InfoWindow({});
    infowindow.setContent(obj);
    var title = $(obj).attr('data-locName');
    var infoBlockId = $(obj).attr('data-target');
    var locList = $(infoBlockId).html();
    var ZoomHere = "<a href='javascript:void(0);' onclick='ZoomHereCallBack();'>Zoom here</a>";
    var currentStore = "<p class='mBottom-1'><b>" + siteDisplayName+" - "+ title + "</b></p><ul>"+locList+"<li>"+ZoomHere+"</li></ul>";
    $(ZoomHere).click(ZoomHereCallBack);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(currentStore);
        infowindow.open(map, this);
    });
}

function ZoomHereCallBack() {
    mapCanvas.setZoom(17);
    mapCanvas.panTo(latlng2);
}

function directionsEventFunction(idVal) {
    function getBrowser() {
        var userAgent = navigator.userAgent.toLowerCase();
        $.browser.chrome = /chrome/.test(userAgent);
        $.browser.safari = /webkit/.test(userAgent);
        $.browser.opera = /opera/.test(userAgent);
        $.browser.msie = /msie/.test(userAgent) && !/opera/.test(userAgent);
        $.browser.mozilla = /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent) || /firefox/.test(userAgent);

        if ($.browser.chrome) return "chrome";
        if ($.browser.mozilla) return "mozilla";
        if ($.browser.opera) return "opera";
        if ($.browser.safari) return "safari";
        if ($.browser.msie) return "ie";
        else {
            return null
        }
    };
    var isMobile = window.matchMedia("only screen and (max-width: 1024px)");
    if (isMobile.matches) {
        var fulladdress;
        var locIn = $(idVal).parent().parent().find('.locationHead').text();
        fulladdress = locIn + " " + street + " " + state;

        var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
        var isIpad = /ipad/i.test(navigator.userAgent.toLowerCase());
        var isAIphone = /iphone/i.test(navigator.userAgent.toLowerCase());
        var isMobileWeb = /webview/i.test(navigator.userAgent.toLowerCase());
        if (isIpad || isAIphone) {
            var ua = navigator.userAgent;
            var matches = [];
            matches = ua.match(/^.*(iPhone|iPad).*(OS\s[0-9]).*(CriOS|Version)\/[.0-9]*\sMobile.*$/i);
            if (matches[1]) {
                if (matches[3] === 'CriOS') {
                    window.open("https://maps.apple.com/maps?q="+Lat+","+Lon, "_blank");
                } else {
                    window.location.assign("https://maps.apple.com/maps?q="+Lat+","+Lon);
                }
            }
        }
        if (isAndroid) {
        	 window.location.assign("https://www.google.co.in/maps/place/"+Lat+","+Lon);
        }
		if (isMobileWeb) {
			try{
				Android.navigatetomap(Lon,Lat);
			}catch(e){
				console.log(e);
				var msg = {"Maps":Lon+' '+Lat};
				window.webkit.messageHandlers.callbackHandler.postMessage(msg);
			}
		}
    } else {
        $('.storeDetailview').hide();
        var fromName = $(idVal).attr('id');
        document.getElementById("directions-panel").style.display = "block";
        document.getElementById("directions-panel").setAttribute("class", "crpanel");
        Lat = $(idVal).attr('Lat');
        Lon = $(idVal).attr('Long');
        document.getElementById("directions-to").value = fromName;
        document.getElementById("directions-to").name = Lat + "/" + Lon;
    }
}
function loadLocationDetails(obj){
	if(!$(obj).hasClass("active")){
		var title = $(obj).attr('data-locName');
		var locDistance = $(obj).find('.locDistance').text();
		var infoBlockId = $(obj).attr('data-target');
		var street="";fax="";phone="";locality="";email="";note="";workhours="";btn1="";btn2="";
		if($(infoBlockId).find('.Street').html()!=undefined){
			street = $(infoBlockId).find('.Street').text();
		}
		if($(infoBlockId).find('.Locality').html()!=undefined){
			locality = $(infoBlockId).find('.Locality').text();
		}
		if($(infoBlockId).find('.Phone').html()!=undefined){
			phone = $(infoBlockId).find('.Phone').html();
		}
		if($(infoBlockId).find('.Fax').html()!=undefined){
			fax = $(infoBlockId).find('.Fax').html();
		}
		if($(infoBlockId).find('.Email').html()!=undefined){
			email = $(infoBlockId).find('.Email').html();
		}
		if($(infoBlockId).find('.Note').html()!=undefined){
			note = $(infoBlockId).find('.Note').text();
		}
		if($(infoBlockId).find('.Workhours').html()!=undefined){
			workhours = $(infoBlockId).find('.Workhours').html();
		}
		if($(infoBlockId).find('.directionBtn').html()!=undefined){
			btn2 = $(infoBlockId).find('.directionBtn').html();
		}
		$(obj).find(".Title").addClass("active");
		var currentStore = "<div class='locDetailWrap marginY-4'><div><strong class='productTitle'>"+title+"</strong><span class='pull-right'>"+locDistance+"</span></div><ul><li>"+street+"</li><li>"+locality+"</li><li class='primaryColor'>"+phone+"</li><li class='lineHeight1'>"+fax+"</li><li class='lineHeight1'>"+email+"</li></ul><ul><li>"+workhours+"</li><li class='marginY-2'>"+btn2+"</li></ul></div>"; 
		$("#currentStore").html(currentStore);
		$("#currentStoreNote").html(note);
		var noImagePath = $('#webThemePath').val()+"/images/NoImage.png'";
		var wImage = $(obj).parent().find(".Wimage").text();
		if(wImage != "undefined" && wImage !="")
			$("#storeImage").html("<div class='cimm_slideItemImg'><a><img src='"+wImage+"' alt='"+title+"'></a></div>");
		else
			$("#storeImage").html("<div class='cimm_slideItemImg'><a><img src='"+noImagePath+"' alt='Warehouse Image Not Available'></a></div>");
	}
	$("#googleMap").css('z-index','-1');
	$("#googleMap").css('opacity','0');
	$("#map_canvas").css('z-index','1');
	$("#map_canvas").css('opacity','1');
	$(".storeDetailview").show();
	$('#directions-panel').hide();
}
function findDistance(lat1,lon1,lat2,lon2) {
	var R = 3959; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a =  Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	var distance = (d/0.639209).toFixed(2);
	return (distance+" miles");
}
function deg2rad(deg) {
	return deg * (Math.PI/180)
}