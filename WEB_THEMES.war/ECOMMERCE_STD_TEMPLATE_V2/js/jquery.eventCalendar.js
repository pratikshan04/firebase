	$.fn.eventCalendar = function(options) {
		var eventsOpts = $.extend({}, $.fn.eventCalendar.defaults, options);
		var flags = {
			wrap: "",
			directionLeftMove: "300",
			eventsJson: {}
		}
		var upcomingEventsEnabled = "N";
		this.each(function() {
			flags.wrap = $(this);
			var url = window.location.href;
			if (url.indexOf('Event') != -1) {
				flags.wrap.addClass('eventCalendar-wrap').find('.goingEvents').append("<div class='eventsCalendar-list-wrap'><h2>Ongoing Events</h2><span class='eventsCalendar-loading'>loading...</span><div class='eventsCalendar-list-content'><ul class='eventsCalendar-list eventsDetail_Calendar-list'></ul></div></div>");
			} else {
				flags.wrap.addClass('eventCalendar-wrap').find('.goingEvents').append("<div class='eventsCalendar-list-wrap'><h2>Ongoing Events</h2><span class='eventsCalendar-loading'>loading...</span><div class='eventsCalendar-list-content'><ul class='eventsCalendar-list'></ul></div></div>");
			}
			if (eventsOpts.eventsScrollable) {
				flags.wrap.find('.eventsCalendar-list-content').addClass('scrollable');
			}
			setCalendarWidth();
			$(window).resize(function() {
				setCalendarWidth();
			});
			dateSlider("current", getCookie("year"), getCookie("month"));
			getEvents(eventsOpts.eventsLimit, false, false, false, false);
			changeMonth();
			flags.wrap.find('.eventsCalendar-day a').on('click', function(e) {
				e.preventDefault();
				var year = flags.wrap.attr('data-current-year'),
					month = flags.wrap.attr('data-current-month'),
					day = $(this).parent().attr('rel');
				getEvents(false, year, month, day, "day");
			});
			$("#day").on("click",function(e){
				 e.preventDefault();
				 var eventDate = new Date(),
				 date = eventDate.getDate(),
				 year = eventDate.getFullYear(),
				 month = eventDate.getMonth(),
				 day = eventDate.getDate();
				 getEvents(false, year, month, day, "day");
				 $("#monthNameDisplay").html(eventsOpts.monthNames[month] +" "+date+ ", " + year);
			});
			$('#month').on("click",function(e){
				 e.preventDefault();
				 var year = flags.wrap.attr('data-current-year'),
					 month = flags.wrap.attr('data-current-month');
				 getEvents(eventsOpts.eventsLimit, year, month, false, "month");
				 $("#monthNameDisplay").html("Month Of "+ eventsOpts.monthNames[month] + " - " + year);
			});
			flags.wrap.find('.monthTitle').on('click', function(e) {
				e.preventDefault();
				var year = flags.wrap.attr('data-current-year'),
					month = flags.wrap.attr('data-current-month');
				getEvents(eventsOpts.eventsLimit, year, month, false, "month");
			});
			$('.category').on('click', function(e) {
				e.preventDefault();
				var year = flags.wrap.attr('data-current-year'),
					month = flags.wrap.attr('data-current-month');
				eventsOpts.category = $("#eventCat").val();
				flags.wrap.find('.dayWithEvents').removeClass('dayWithEvents');
				getEvents(eventsOpts.eventsLimit, year, month, false, "month");
			});
			$('.eventsCalendar-day').on('click', function(e) {
				e.preventDefault();
				$("ul.calendarFilterHead li").removeClass('active');
				$("#day").parent().addClass('active');
			});
			$('.thiWeekEvents').on('click', function(e) {
				e.preventDefault();
				var eventDate = new Date(),
				date = eventDate.getDate(),
				year = eventDate.getFullYear(),
				month = eventDate.getMonth();
				/*var year = flags.wrap.attr('data-current-year'),
				month = flags.wrap.attr('data-current-month');*/
				getEvents(false, false, false, false, "week");
				$("#monthNameDisplay").html("Current Week Of "+ eventsOpts.monthNames[month] + " - " + year);
			});
		});
		var desc = $(this).parent().find('.eventDesc');
		if (!loading) {
			desc.slideDown();
		}
		flags.wrap.find('.eventsCalendar-list .eventTitle').on('click', function(e) {
			if (!eventsOpts.showDescription) {
				e.preventDefault();
				var desc = $(this).parent().find('.eventDesc');
				var eventUrl = $(this).attr('href');
				var eventId = $(this).attr('id');
				var q = getUrlParams(eventUrl);
				if (loading) {
					setCookie("eventId", eventId);
					setCookie("month", q.month);
					setCookie("year", q.year);
					window.location.href = eventUrl;
				}
				/*flags.wrap.find('.eventDesc').slideUp();
				if (desc.is(':visible')) {
					if (!loading) {
						desc.slideUp();
					}
				} else {
					if (eventsOpts.onlyOneDescription) {
						if (!loading) {
							flags.wrap.find('.eventDesc').slideUp();
						}
					}
					if (!loading && eventId) {
						desc.slideDown();
					}
				}*/
			}
		});

		function sortJson(a, b) {
			return a.date.toLowerCase() > b.date.toLowerCase() ? 1 : -1;
		};

		function dateSlider(show, year, month) {
			if (year < 1000) year += 1900;
			var firstSwitch = 0;
			var secondSwitch = 0;
			var lastOffset = 99;
			for (i = 0; i < 12; i++) {
				var newDate = new Date(Date.UTC(year, i, 0, 0, 0, 0, 0));
				var tz = -1 * newDate.getTimezoneOffset() / 60;
				if (tz > lastOffset) firstSwitch = i - 1;
				else if (tz < lastOffset) secondSwitch = i - 1;
				lastOffset = tz;
			}
			var secondDstDate = FindDstSwitchDate(year, secondSwitch);
			var firstDstDate = FindDstSwitchDate(year, firstSwitch);
			var $eventsCalendarSlider = $("<div class='eventsCalendar-slider col-md-3 col-sm-4 col-xs-12' style='height:222px;'></div>"),
				$eventsCalendarMonthWrap = $("<div class='eventsCalendar-monthWrap'></div>"),
				$eventsCalendarTitle = $("<div class='eventsCalendar-currentTitle'><a href='#' class='monthTitle'></a></div>"),
				$eventsCalendarArrows = $("<a href='#' class='arrow prev'><span>" + eventsOpts.txt_prev + "</span></a><a href='#' class='arrow next'><span>" + eventsOpts.txt_next + "</span></a>");
			$eventsCalendarDaysList = $("<ul class='eventsCalendar-daysList'></ul>"), date = new Date();
			if (!flags.wrap.find('.eventsCalendar-slider').length) {
				flags.wrap.prepend($eventsCalendarSlider);
				$eventsCalendarSlider.append($eventsCalendarMonthWrap);
			} else {
				flags.wrap.find('.eventsCalendar-slider').append($eventsCalendarMonthWrap);
			}
			flags.wrap.find('.eventsCalendar-monthWrap.currentMonth').removeClass('currentMonth').addClass('oldMonth');
			$eventsCalendarMonthWrap.addClass('currentMonth').append($eventsCalendarTitle, $eventsCalendarDaysList);
			if (show === "current") {
				if (getCookie("eventId") != undefined && getCookie("eventId") != "removed" && !loading) {
					date = new Date(getCookie("year"), getCookie("month"), 1, 0, 0, 0);
				}
				day = date.getDate();
				$eventsCalendarSlider.append($eventsCalendarArrows);
			} else {
				date = new Date(flags.wrap.attr('data-current-year'), flags.wrap.attr('data-current-month'), 1, 0, 0, 0);
				day = 0;
				moveOfMonth = 1;
				if (show === "prev") {
					moveOfMonth = -1;
				}
				date.setMonth(date.getMonth() + moveOfMonth);
				var tmpDate = new Date();
				if (date.getMonth() === tmpDate.getMonth()) {
					day = tmpDate.getDate();
				}
			}
			var year = date.getFullYear(),
				month = date.getMonth(),
				monthToShow = month + 1;
			if (show != "current") {
				getEvents(eventsOpts.eventsLimit, year, month, false, show);
			}
			flags.wrap.attr('data-current-month', month).attr('data-current-year', year);
			$eventsCalendarTitle.find('.monthTitle').html(eventsOpts.monthNames[month] + " " + year);
			$("#monthNameDisplay").html("Month Of "+ eventsOpts.monthNames[month] + " - " + year);
			
			var daysOnTheMonth = 32 - new Date(year, month, 32).getDate();
			var daysList = [];
			if (eventsOpts.showDayAsWeeks) {
				$eventsCalendarDaysList.addClass('showAsWeek');
				if (eventsOpts.showDayNameInCalendar) {
					$eventsCalendarDaysList.addClass('showDayNames');
					var i = 0;
					if (eventsOpts.startWeekOnMonday) {
						i = 1;
					}
					for (; i < 7; i++) {
						daysList.push('<li class="eventsCalendar-day-header">' + eventsOpts.dayNames[i] + '</li>');
						if (i === 6 && eventsOpts.startWeekOnMonday) {
							daysList.push('<li class="eventsCalendar-day-header">' + eventsOpts.dayNames[0] + '</li>');
						}
					}
				}
				dt = new Date(year, month, 01);
				var weekDay = dt.getDay();
				if (eventsOpts.startWeekOnMonday) {
					weekDay = dt.getDay() - 1;
				}
				if (weekDay < 0) {
					weekDay = 6;
				}
				for (i = weekDay; i > 0; i--) {
					daysList.push('<li class="eventsCalendar-day empty"></li>');
				}
			}
			for (dayCount = 1; dayCount <= daysOnTheMonth; dayCount++) {
				var dayClass = "";
				var currentyear = new Date();
				if (day > 0 && dayCount === day && currentyear.getFullYear() == year) {
					dayClass = "current";
				}
				daysList.push('<li id="dayList_' + dayCount + '" rel="' + dayCount + '" class="eventsCalendar-day ' + dayClass + '"><a href="#">' + dayCount + '</a></li>');
			}
			$eventsCalendarDaysList.append(daysList.join(''));
			$eventsCalendarSlider.css('height', $eventsCalendarMonthWrap.height() + 'px');
		}

		function num_abbrev_str(num) {
			var len = num.length,
				last_char = num.charAt(len - 1),
				abbrev
			if (len === 2 && num.charAt(0) === '1') {
				abbrev = 'th';
			} else {
				if (last_char === '1') {
					abbrev = 'st';
				} else if (last_char === '2') {
					abbrev = 'nd';
				} else if (last_char === '3') {
					abbrev = 'rd';
				} else {
					abbrev = 'th';
				}
			}
			return num + abbrev;
		}
		Date.prototype.getMonthName = function() {
			var m = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
			return m[this.getMonth()];
		}
		Date.prototype.getDayName = function() {
			var d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			return d[this.getDay()];
		}
		function getEvents(limit, year, month, day, direction) {
			var limit = limit || 0;
			var year = year || '';
			var day = day || '';
			if (typeof month != 'undefined') {
				var month = month;
			} else {
				var month = '';
			}
			flags.wrap.find('.eventsCalendar-loading').fadeIn();
			if (eventsOpts.jsonData) {
				eventsOpts.cacheJson = true;
				flags.eventsJson = eventsOpts.jsonData;
				getEventsData(flags.eventsJson, limit, year, month, day, direction);
			} else if (!eventsOpts.cacheJson || !direction) {
				if ($("#upcomingEvents").length > 0) {
					upcomingEventsEnabled = $("#upcomingEvents").val();
				}
				$.getJSON(eventsOpts.eventsjson + "?limit=" + limit + "&year=" + year + "&month=" + month + "&day=" + day + "&FirstLoadEvent=" + $("#FirstLoadEvent").val() + "&upcomingEvents=" + upcomingEventsEnabled, function(data) {
					flags.eventsJson = data;
					getEventsData(flags.eventsJson, limit, year, month, day, direction);
				});
			} else {
				getEventsData(flags.eventsJson, limit, year, month, day, direction);
			}
			if (day > '') {		
				flags.wrap.find('.eventCalendar-current').removeClass('eventCalendar-current');		
				flags.wrap.find('#dayList_'+day).addClass('eventCalendar-current');		
			}
		}

		function getEventsData(data, limit, year, month, day, direction) {
			directionLeftMove = "-=" + flags.directionLeftMove;
			eventContentHeight = "auto";
			subtitle = flags.wrap.find('.eventsCalendar-list-wrap .eventsCalendar-subtitle')
			if (!direction) {
				subtitle.html(eventsOpts.txt_NextEvents);
				eventContentHeight = "auto";
				directionLeftMove = "-=0";
			} else {
				if (day != '') {} else {}
				if (direction === 'prev') {
					directionLeftMove = "+=" + flags.directionLeftMove;
				} else if (direction === 'day' || direction === 'month' || direction === 'week') {
					directionLeftMove = "+=0";
					eventContentHeight = 0;
				}
			}
			flags.wrap.find('.eventsCalendar-list').animate({
				opacity: eventsOpts.moveOpacity,
				left: directionLeftMove,
				height: eventContentHeight
			}, eventsOpts.moveSpeed, function() {
				flags.wrap.find('.eventsCalendar-list').css({
					'left': 0,
					'height': 'auto'
				}).hide();
				var events = [];
				var weekEvents = [];
				var eventsNonFeature = [];
				var eventToDisplay = getCookie("eventId");
				data = $(data).sort(sortJson);
				if (data.length <= 0) {
					$('.eventsCalendar-loading').hide();
				}
				if (data.length) {
					var eventDescClass = '';
					if (!eventsOpts.showDescription) {
						eventDescClass = 'hidden';
					}
					var eventLinkTarget = "_self";
					if (eventsOpts.openEventInNewWindow) {
						eventLinkTarget = '_target';
					}
					var i = 0;
					var monthSkip = 0;
					var yearSkip = 0;
					var isSkipEvent = 0;
					var isFound = 1;
					eventsOpts.isSkipEvent = 0;
					$.each(data, function(key, event) {
						var eventDate = new Date(parseInt(event.date)),
							eventYear = eventDate.getFullYear(),
							eventMonth = eventDate.getMonth(),
							eventFullMonth = eventDate.getMonthName(),
							eventDay = eventDate.getDate(),
							eventFullDay = eventDate.getDayName(),
							eventWeekNumber = eventDate.getWeek();
						var todayD = new Date();
						var todayMonth = todayD.getMonth();
						var todayYear = todayD.getFullYear();
						var todayWeekNumber = todayD.getWeek();
						var eventdayCheck = eventYear + eventMonth + eventDay;
						var todayCheck = todayMonth + todayYear + todayD.getDate();
						var dMonth = parseInt(flags.wrap.attr('data-current-month'));
						var dYear = parseInt(flags.wrap.attr('data-current-year'));
						var tYear = todayYear;
						var selCheck = dMonth + dYear;
						var curCheck = todayMonth + todayYear;
						var selDate = new Date(dYear + "/" + (Number(dMonth) + 1) + "/1");
						var url = window.location.href;
						if (url.indexOf('Event') != -1) {} else {
							if (eventDate >= todayD && isFound == 1 && selDate <= todayD) {
								if (eventYear > todayYear) todayYear = eventYear;
								if (isFound == 1) {
									monthSkip = eventMonth;
									yearSkip = todayYear;
									isSkipEvent = 1;
								}
								isFound = 0;
							}
						}
					});
					if (isSkipEvent == 1) eventsOpts.isSkipEvent = 1;
					else
						eventsOpts.isSkipEvent = 0;
					var prevPush = false;
					var borderInc = 0;
					var jsonObjForDatatable = [];
					$.each(data, function(key, event) {
						var year = new Date().getYear();
						var addToJsonObject = false;
						if (year < 1000) year += 1900;
						var firstSwitch = 0;
						var secondSwitch = 0;
						var lastOffset = 99;
						for (i = 0; i < 12; i++) {
							var newDate = new Date(Date.UTC(year, i, 0, 0, 0, 0, 0));
							var tz = -1 * newDate.getTimezoneOffset() / 60;
							if (tz > lastOffset) firstSwitch = i - 1;
							else if (tz < lastOffset) secondSwitch = i - 1;
							lastOffset = tz;
						}
						var secondDstDate = new Date(FindDstSwitchDate(year, secondSwitch));
						var firstDstDate = new Date(FindDstSwitchDate(year, firstSwitch));
						var splittedEvent = eventsOpts.category.split(",");
						if (typeof event.timezoneOffset != undefined && event.timezoneOffset != null) {
							timeZone = event.timezoneOffset / 100;
						} else {
							timeZone = "-5";
						}
						for (i = 0; i < splittedEvent.length; i++) {
							if (event.eventCategory === splittedEvent[i] || eventsOpts.category == '') {
								var eventDate = new Date(parseInt(event.date));
								var eventDateForTime = new Date();
								var january = new Date(eventDateForTime.getFullYear(), 0, 1);		
								var januaryOffset = january.getTimezoneOffset();		
								var july = new Date(eventDateForTime.getFullYear(), 6, 1);		
								var julyOffset = july.getTimezoneOffset();		
								var dstObserved = januaryOffset == julyOffset;		
								var dstDiff = Math.abs(januaryOffset - julyOffset);		
								if(dstObserved){		
								  var eventOffset = eventDateForTime.getTimezoneOffset();		
								}else{		
								  var eventOffset = 300;
								}
								
								//var eventOffset = eventDate.getTimezoneOffset();
								var timeDifference = timeZone * 60 + (eventOffset);
								var changedDate = new Date(eventDate.getTime() + Math.abs(timeDifference) * 60 * 1000);//var changedDate = new Date(eventDate.getTime() + timeDifference * 60 * 1000);//var changedDate = new Date(eventDate.getTime());
								eventDate = changedDate;
								eventYear = eventDate.getFullYear(), eventMonth = eventDate.getMonth(), eventFullMonth = eventDate.getMonthName(), eventDay = eventDate.getDate(), eventFullDay = eventDate.getDayName();
								var currentDate = new Date();
								eventDate = changedDate;
								if (isSkipEvent == 1) {
									month = monthSkip;
									year = yearSkip;
								}
								var eventDateEnd = new Date(parseInt(event.end));
								var changedEndDate = new Date(eventDateEnd.getTime() + Math.abs(timeDifference) * 60 * 1000);//var changedEndDate = new Date(eventDateEnd.getTime() + timeDifference * 60 * 1000);
								eventDateEnd = changedEndDate;
								eventYearEnd = eventDateEnd.getFullYear(), eventFullMonthEnd = eventDateEnd.getMonthName(), eventMonthEnd = eventDateEnd.getMonth(), eventFullDayEnd = eventDateEnd.getDayName();
								eventDayEnd = eventDateEnd.getDate();
								if (limit === 0 || limit > i) {
									var eventMonthToShow = eventMonth + 1,
										eventHour = eventDate.getHours(),
										eventMinute = eventDate.getMinutes();
									if (eventMinute <= 9) {
										eventMinute = "0" + eventMinute;
									}
									var eventMonthToShowEnd = eventMonthEnd + 1,
										eventHourEnd = eventDateEnd.getHours(),
										eventMinuteEnd = eventDateEnd.getMinutes();
									if (eventMinuteEnd <= 9) {
										eventMinuteEnd = "0" + eventMinuteEnd;
									}
									var PrevEvent = "";
									if (eventMonth < eventMonthEnd) {
										if (eventMonth == flags.wrap.attr('data-current-month')) {
											var daysOnTheMonth = 32 - new Date(year, month, 32).getDate();
											for (i = eventDay; i <= daysOnTheMonth; i++) {
												if ((month === false || month == eventMonth || month == eventMonthEnd) && (day == '' || day == i)) {
													if (month === false && eventDate < new Date() && !((eventMonth + 1) > new Date().getMonth())) {} else {
														var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
														var currentDispYear = parseInt(flags.wrap.attr('data-current-year'));
														if (isSkipEvent == 1) {
															currentDispMonth = monthSkip;
															currentDispYear = yearSkip;
														}
														currentDispMonth = currentDispMonth + 1;
														eventStringDate = eventFullDay + "., " + eventFullMonth + "/" + eventDay + "/" + eventYear;
														eventStringDateEnd = eventFullDayEnd + "., " + eventFullMonthEnd + "/" + eventDayEnd + "/" + eventYearEnd;
														var Strin1 = "";
														if (eventFullDay == eventFullDayEnd) {
															eventStringDateEnd = '';
														}
														if (event.title == PrevEvent) {} else {
															if (loading) {
																if (event.title.length > 27) event.title = event.title.substring(0, 27) + '...';
															}
															var url = window.location.href;
															if (url.indexOf('Event') != -1) {
																if (event.blockOnlineReg == 'N') {
																	if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if (event.totalSeats == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if ((event.totalSeats - event.bookedSeats) == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	}
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}
															} else {
																var borderStyle = "";
																if (borderInc > 0) borderStyle = "";
																if (event.blockOnlineReg == 'N') {
																	if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if (event.totalSeats == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if ((event.totalSeats - event.bookedSeats) == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	}
																	borderInc++;
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}
															}
															if (eventFullDay == eventFullDayEnd) {
																Strin1 = Strin1.replace('&#8212', '');
															}
															PrevEvent = event.title;
															if (loading) {
																if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
																if (eventsNonFeature.length < counter && event.isFeaturedEvent == "N" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		addToJsonObject = true;
																		eventsNonFeature.push(Strin1);
																	}
																}
															} else {
																var eventToDisplay = getCookie("eventId");
																if (eventToDisplay == event.id) {
																	Strin1 = Strin1.replace('class="eventDesc"', '');
																	Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																	Strin1 = Strin1.replace('<span id="location">', '<span id="location" style="display:none;">')
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																	prevPush = true;
																	setCookie("eventId", "removed");
																} else {
																	var eventToDisplay = getCookie("eventId");
																	if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && eventDate.getMonth() == flags.wrap.attr('data-current-month') && eventYear == flags.wrap.attr('data-current-year')) {
																		if (eventFullDay == eventFullDayEnd) {
																			Strin1 = Strin1.replace('&#8212', '');
																		}
																		$.trim(Strin1);
																		if (Strin1 != ""){
																			events.push(Strin1);
																			addToJsonObject = true;
																		}
																	}
																}
															}
														}
													}
												} else {
													var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
													currentDispMonth = currentDispMonth + 1;
													if (month === false && (eventDateEnd.getMonth() == flags.wrap.attr('data-current-month') || eventDate.getMonth() == flags.wrap.attr('data-current-month')) && eventYear == flags.wrap.attr('data-current-year')) {
														eventStringDate = eventFullDay + "., " + eventFullMonth + " " + eventDay + ", " + eventYear + " at " + formatAMPM(eventDate);
														eventStringDateEnd = eventFullDayEnd + "., " + eventFullMonthEnd + " " + eventDayEnd + "., " + eventYearEnd + " at " + formatAMPM(eventDateEnd);
														var Strin1 = "";
														if (eventFullDay == eventFullDayEnd) {
															eventStringDateEnd = '';
														}
														if (event.title == PrevEvent) {} else {
															if (loading) {
																event.title = event.title.substring(0, 27) + "...";
															}
															if (event.blockOnlineReg == 'N') {
																if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else if (event.totalSeats == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else if ((event.totalSeats - event.bookedSeats) == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}
															} else {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															}
															PrevEvent = event.title;
															if (eventFullDay == eventFullDayEnd) {
																Strin1 = Strin1.replace('&#8212', '');
															}
															if (loading) {
																if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																	$.trim(Strin1);
																	if (Strin1 != ""){
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
															} else {
																if (eventToDisplay == event.id && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																	Strin1 = Strin1.replace('class="eventDesc"', '');
																	Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																	Strin1 = String1.replace('location')
																	$.trim(Strin1);
																	if (Strin1 != ""){
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																	prevPush = true;
																	setCookie("eventId", "removed");
																} else {
																	var eventToDisplay = getCookie("eventId");
																	if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																		if (eventFullDay == eventFullDayEnd) {
																			Strin1 = Strin1.replace('&#8212', '');
																			Strin1 = Strin1.replace()
																		}
																		$.trim(Strin1);
																		if (Strin1 != "") {
																			events.push(Strin1);
																			addToJsonObject = true;
																		}
																	}
																}
															}
														}
													}
												}
											}
										} else {
											for (i = 1; i <= eventDayEnd; i++) {
												if ((month === false || month == eventMonth || month == eventMonthEnd) && (day == '' || day == i)) {
													if (month === false && eventDate < new Date() && !((eventMonth + 1) > new Date().getMonth())) {} else {
														var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
														var currentDispYear = parseInt(flags.wrap.attr('data-current-year'));
														if (isSkipEvent == 1) {
															currentDispMonth = monthSkip;
															currentDispYear = yearSkip;
														}
														currentDispMonth = currentDispMonth + 1;
														eventStringDate = eventFullDay + "., " + eventFullMonth + "/" + eventDay + "/" + eventYear;
														eventStringDateEnd = eventFullDayEnd + "., " + eventFullMonthEnd + "/" + eventDayEnd + "/" + eventYearEnd;
														var Strin1 = "";
														if (eventFullDay == eventFullDayEnd) {
															eventStringDateEnd = '';
														}
														if (event.title == PrevEvent) {} else {
															if (loading) {
																if (event.title.length > 27) event.title = event.title.substring(0, 27) + '...';
															}
															var url = window.location.href;
															if (url.indexOf('Event') != -1) {
																if (event.blockOnlineReg == 'N') {
																	if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if (event.totalSeats == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																		if (event.cost > 0) {
																		}
																	} else if ((event.totalSeats - event.bookedSeats) == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																		if (event.cost > 0) {
																		}
																	} else {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																		if (event.cost > 0) {
																		}
																	}
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	if (event.cost > 0) {
																	}
																}
															} else {
																var borderStyle = "";
																if (borderInc > 0) borderStyle = "";
																if (event.blockOnlineReg == 'N') {
																	if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if (event.totalSeats == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else if ((event.totalSeats - event.bookedSeats) == 0) {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	} else {
																		Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																	}
																	borderInc++;
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}
															}
															if (eventFullDay == eventFullDayEnd) {
																Strin1 = Strin1.replace('&#8212', '');
															}
															PrevEvent = event.title;
															if (loading) {
																if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
																if (eventsNonFeature.length < counter && event.isFeaturedEvent == "N" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																	$.trim(Strin1);
																	if (Strin1 != "") eventsNonFeature.push(Strin1);
																}
															} else {
																var eventToDisplay = getCookie("eventId");
																if (eventToDisplay == event.id) {
																	Strin1 = Strin1.replace('class="eventDesc"', '');
																	Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																	Strin1 = Strin1.replace('<span id="location">', '<span id="location" style="display:none;">')
																	$.trim(Strin1);
																	if (Strin1 != ""){
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																	prevPush = true;
																	setCookie("eventId", "removed");
																} else {
																	var eventToDisplay = getCookie("eventId");
																	if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && eventDateEnd.getMonth() == flags.wrap.attr('data-current-month') && eventYear == flags.wrap.attr('data-current-year')) {
																		if (eventFullDay == eventFullDayEnd) {
																			Strin1 = Strin1.replace('&#8212', '');
																		}
																		$.trim(Strin1);
																		if (Strin1 != "") {
																			events.push(Strin1);
																			addToJsonObject = true;
																		}
																	}
																}
															}
														}
													}
												} else {
													var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
													currentDispMonth = currentDispMonth + 1;
													if (month === false && (eventDateEnd.getMonth() == flags.wrap.attr('data-current-month') || eventDate.getMonth() == flags.wrap.attr('data-current-month')) && eventYear == flags.wrap.attr('data-current-year')) {
														eventStringDate = eventFullDay + "., " + eventFullMonth + " " + eventDay + ", " + eventYear + " at " + formatAMPM(eventDate);
														eventStringDateEnd = eventFullDayEnd + "., " + eventFullMonthEnd + " " + eventDayEnd + "., " + eventYearEnd + " at " + formatAMPM(eventDateEnd);
														var Strin1 = "";
														if (eventFullDay == eventFullDayEnd) {
															eventStringDateEnd = '';
														}
														if (event.title == PrevEvent) {} else {
															if (loading) {
																event.title = event.title.substring(0, 27) + "...";
															}
															if (event.blockOnlineReg == 'N') {
																if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else if (event.totalSeats == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else if ((event.totalSeats - event.bookedSeats) == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}
															} else {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															}
															PrevEvent = event.title;
															if (eventFullDay == eventFullDayEnd) {
																Strin1 = Strin1.replace('&#8212', '');
															}
															if (loading) {
																if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
															} else {
																if (eventToDisplay == event.id && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																	Strin1 = Strin1.replace('class="eventDesc"', '');
																	Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																	Strin1 = String1.replace('location')
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																	prevPush = true;
																	setCookie("eventId", "removed");
																} else {
																	var eventToDisplay = getCookie("eventId");
																	if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																		if (eventFullDay == eventFullDayEnd) {
																			Strin1 = Strin1.replace('&#8212', '');
																			Strin1 = Strin1.replace()
																		}
																		$.trim(Strin1);
																		if (Strin1 != "") {
																			events.push(Strin1);
																			addToJsonObject = true;
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									} else {
										for (i = eventDay; i <= eventDayEnd; i++) {
											if ((month === false || month == eventMonth) && (day == '' || day == i)) {
												if (month === false && eventDate < new Date() && !((eventMonth + 1) > new Date().getMonth())) {} else {
													var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
													var currentDispYear = parseInt(flags.wrap.attr('data-current-year'));
													if (isSkipEvent == 1) {
														currentDispMonth = monthSkip;
														currentDispYear = yearSkip;
													}
													currentDispMonth = currentDispMonth + 1;
													eventStringDate = /*eventFullDay + "., " +*/ eventDay + "/" + eventFullMonth + "/" + eventYear;
													eventStringDateEnd = /*eventFullDayEnd + "., "*/ + eventDayEnd + "/" + eventFullMonthEnd + "/" + eventYearEnd;
													var Strin1 = "";
													if (eventFullDay == eventFullDayEnd) {
														eventStringDateEnd = '';
													}
													if (event.title == PrevEvent) {} else {
														if (loading) {
															if (event.title.length > 27) event.title = event.title.substring(0, 27) + '...';
														}
														var url = window.location.href;
														if (url.indexOf('Event') != -1) {
															if (event.blockOnlineReg == 'N') {
																if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																}else if (event.isAllDayEvent == 1) {
																	 Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">All Day</em></time>';
																} else if (event.totalSeats == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
																} else if ((event.totalSeats - event.bookedSeats) == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																}
																else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																}
															} else {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
															}
														} else {
															var borderStyle = "";
															if (borderInc > 0) borderStyle = "";
															if (event.blockOnlineReg == 'N') {
																if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																} else if (event.totalSeats == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																} else if ((event.totalSeats - event.bookedSeats) == 0) {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																} else {
																	Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
																}
																borderInc++;
															} else {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time>';
															}
														}
														if (eventFullDay == eventFullDayEnd) {
															Strin1 = Strin1.replace('&#8212', '');
														}
														PrevEvent = event.title;
														if (loading) {
															if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																$.trim(Strin1);
																if (Strin1 != "") {
																	events.push(Strin1);
																	addToJsonObject = true;
																}
															}
															if (eventsNonFeature.length < counter && event.isFeaturedEvent == "N" && currentDispMonth == eventFullMonth && eventYear == currentDispYear) {
																$.trim(Strin1);
																if (Strin1 != "") eventsNonFeature.push(Strin1);
															}
														} else {
															var eventToDisplay = getCookie("eventId");
															if (eventToDisplay == event.id) {
																Strin1 = Strin1.replace('class="eventDesc"', '');
																Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																Strin1 = Strin1.replace('<span id="location">', '<span id="location" style="display:none;">')
																$.trim(Strin1);
																if (Strin1 != ""){
																	events.push(Strin1);
																	addToJsonObject = true;
																}
																prevPush = true;
																setCookie("eventId", "removed");
															} else {
																var eventToDisplay = getCookie("eventId");
																if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && eventDateEnd.getMonth() == flags.wrap.attr('data-current-month') && eventYear == flags.wrap.attr('data-current-year')) {
																	if (eventFullDay == eventFullDayEnd) {
																		Strin1 = Strin1.replace('&#8212', '');
																	}
																	$.trim(Strin1);
																	if (Strin1 != ""){
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
															}
														}
													}
												}
											} else {
												var currentDispMonth = parseInt(flags.wrap.attr('data-current-month'));
												currentDispMonth = currentDispMonth + 1;
												if (month === false && eventDateEnd.getMonth() == flags.wrap.attr('data-current-month') && eventYear == flags.wrap.attr('data-current-year')) {
													eventStringDate = eventFullDay + "., " + eventFullMonth + " " + eventDay + ", " + eventYear + " at " + formatAMPM(eventDate);
													eventStringDateEnd = eventFullDayEnd + "., " + eventFullMonthEnd + " " + eventDayEnd + "., " + eventYearEnd + " at " + formatAMPM(eventDateEnd);
													var Strin1 = "";
													if (eventFullDay == eventFullDayEnd) {
														eventStringDateEnd = '';
													}
													if (event.title == PrevEvent) {} else {
														if (loading) {
															event.title = event.title.substring(0, 27) + "...";
														}
														if (event.blockOnlineReg == 'N') {
															if (eventDate < new Date() && upcomingEventsEnabled == "N") {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															}
															else if (event.totalSeats == 0) {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															} else if ((event.totalSeats - event.bookedSeats) == 0) {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															} else {
																Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
															}
														} else {
															Strin1 = '<li id="' + key + '" class="' + event.type + '"><h3 class="eventTitle">' + event.title + '</h3><div class="eventDesc">'+ event.description +'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' &#8212  ' + eventStringDateEnd + ' ' + formatAMPM(eventDate) + '-' +formatAMPM(eventDateEnd) + '</em></time>';
														}
														PrevEvent = event.title;
														if (eventFullDay == eventFullDayEnd) {
															Strin1 = Strin1.replace('&#8212', '');
														}
														if (loading) {
															if (events.length < counter && event.isFeaturedEvent == "Y" && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																$.trim(Strin1);
																if (Strin1 != "") {
																	events.push(Strin1);
																	addToJsonObject = true;
																}
															}
														} else {
															if (eventToDisplay == event.id && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																Strin1 = Strin1.replace('class="eventDesc"', '');
																Strin1 = Strin1.replace('class="eventTitle"', 'class="eventDetail_Title"');
																Strin1 = String1.replace('location')
																$.trim(Strin1);
																if (Strin1 != "") {
																	events.push(Strin1);
																	addToJsonObject = true;
																}
																prevPush = true;
																setCookie("eventId", "removed");
															} else {
																var eventToDisplay = getCookie("eventId");
																if (!prevPush && (eventToDisplay == "removed" || eventToDisplay == undefined) && currentDispMonth == eventFullMonth && eventYear == flags.wrap.attr('data-current-year')) {
																	if (eventFullDay == eventFullDayEnd) {
																		Strin1 = Strin1.replace('&#8212', '');
																		Strin1 = Strin1.replace()
																	}
																	$.trim(Strin1);
																	if (Strin1 != "") {
																		events.push(Strin1);
																		addToJsonObject = true;
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
								for (i = 0; i < splittedEvent.length; i++) {
									if (event.eventCategory === splittedEvent[i] || eventsOpts.category == '') {
										if (eventYear == flags.wrap.attr('data-current-year') && (eventMonth == flags.wrap.attr('data-current-month') || eventMonthEnd == flags.wrap.attr('data-current-month'))) {
											if (eventMonth < eventMonthEnd) {
												if (eventMonth == flags.wrap.attr('data-current-month')) {
													var daysOnTheMonth = 32 - new Date(year, month, 32).getDate();
													for (i = eventDay; i <= daysOnTheMonth; i++) {
														flags.wrap.find('.currentMonth .eventsCalendar-daysList #dayList_' + i).addClass('dayWithEvents');
														$('#dayList_' + i).find('a').data('eveid', event.id).addClass('dayWithEventsAnchor');
													}
												}
												if (eventMonthEnd == flags.wrap.attr('data-current-month')) {
													for (i = 1; i <= eventDayEnd; i++) {
														flags.wrap.find('.currentMonth .eventsCalendar-daysList #dayList_' + i).addClass('dayWithEvents');
														$('#dayList_' + i).find('a').data('eveid', event.id).addClass('dayWithEventsAnchor');;
													}
												}
											} else {
												for (i = eventDay; i <= eventDayEnd; i++) {
													flags.wrap.find('.currentMonth .eventsCalendar-daysList #dayList_' + i).addClass('dayWithEvents');
													$('#dayList_' + i).find('a').data('eveid', event.id).addClass('dayWithEventsAnchor');;
												}
											}
										}
									}
								}
							}
						}
						
						if(direction=="week" && eventDate.getWeek()==currentDate.getWeek()){
							jsonObjForDatatable.push(data[key]);
							weekEvents.push('<li><h3 class="eventTitle">'+event.title+'</h3><div class="eventDesc">'+event.description+'</div><time datetime="' + eventDate + '"><em class="fontProp">Ends ' + eventStringDate + ' ' + eventStringDateEnd + ' '+formatAMPM(eventDateEnd) + '</em></time></li>');
						}
						if(addToJsonObject){
							if(direction!="week" ){
								jsonObjForDatatable.push(data[key]);
							}
							
						}
					});
					if(direction=="week"){
						events=[];
						events = weekEvents
					}
					if (!events.length) {
							events = eventsNonFeature;
					}
                var datatable =$('#events_Table').DataTable();
                datatable.destroy();
                $('#events_Table').empty();
                datatable = $('#events_Table').DataTable( {
                	"aaData": jsonObjForDatatable,
					 "aoColumns": [
					               { "mData":"date"},
					               { "mData": "location" },
					               { "mData": "description" },
					               { "mData": "id" },
					               { "mData": "timezoneOffset" }
					           ],"drawCallback": function ( nRow,settings ) {
					               var api = this.api();
					               var rows = api.rows( {page:'current'} ).nodes();
					               var last=null;
					               var allData = nRow.aoData;
					               api.column(0, {page:'current'} ).data().each( function ( group, i ) {
					            	   var groupDateFull = new Date(parseInt(group));
					            	   groupDate = groupDateFull.getDate();
					            	   var end = "";
					                   if ( last !== groupDate ) {
					                	   var timeZone = "-5",timeZoneOffset = "0";
					                	   $.each(allData,function(key,eachColumnValSeperate){
					                		 	if(parseInt(group)==parseInt(eachColumnValSeperate._aData.date)){
					                		 		timeZone = eachColumnValSeperate._aData.timezoneOffset / 100;
					                		 		timeZoneOffset = parseInt(eachColumnValSeperate._aData.timezoneOffset);
					                		 		end = eachColumnValSeperate._aData.end;
					                		 	}
					                	   });
					                	   var eventDateForTime = new Date();
					                	   var january = new Date(eventDateForTime.getFullYear(), 0, 1);
					                	   var januaryOffset = january.getTimezoneOffset();
					                	   var july = new Date(eventDateForTime.getFullYear(), 6, 1);
					                	   var julyOffset = july.getTimezoneOffset();
					                	   var dstObserved = januaryOffset == julyOffset;
					                	   var dstDiff = Math.abs(januaryOffset - julyOffset);
					                	   if(dstObserved){
					                		   var timezoneOffset = parseInt(eventDateForTime.getTimezoneOffset());
					                	   }else{
					                		   var timezoneOffset = 300;
					                	   }
					                	   var timeDifference = timeZone * 60 + (timezoneOffset);
					                	   var startchangedDate = new Date(parseInt(group) + Math.abs(timeDifference) * 60 * 1000);
					                	   var endchangedDate = new Date(parseInt(end) + Math.abs(timeDifference) * 60 * 1000);
					                	   var sChangedDate = formatDate(new Date(startchangedDate));//$.datepicker.formatDate('DD, MM dd, yy', new Date(startchangedDate));
					                	   var eChangedDate = formatDate(new Date(endchangedDate))//$.datepicker.formatDate('DD, MM dd, yy', new Date(endchangedDate));
					                	   var aa="";
					                	   if(sChangedDate == eChangedDate){
					                		   aa = sChangedDate;
					                	   }else{
					                		   aa = sChangedDate+ '&nbsp; To &nbsp;' +eChangedDate;
					                	   }
					                	   
					                       /*$(rows).eq( i ).before(
					                    	   '<tr class="group"><td colspan="3">'+aa+'</td></tr>'
					                       );*/ // lines to enable date for event
					                       last = groupDate;
					                   }
					               } );
					           },
					           "displayLength": 100,
					          "columnDefs": [
					                          { "title": "", "targets": 0 },
					                          { "title": "Address", "targets": 1 },
					                          { "title": "Register", "targets": 2 },
					                          { "title": " ", "targets":3 },
					                          { "visible": false, "targets": 1 },
					                          { "visible": false, "targets": 2 }
					                        
					                        ],
					           "fnRowCallback":function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
					        	   if(aData.customFieldsList.length!=0){
					        		   aData.customFieldsList.forEach(function(column){
			        				        var columnName = column.eventsCustomFieldList.fieldName;
			        				        aData[columnName] = column.eventsCustomFieldList.fieldValue;
			        				    });
					        	   }
					        	   var noImagePath = "this.src='"+$('#webThemePath').val()+"/images/NoImage.png'";
					        	   // jQuery('td:eq(0)', nRow).html('<img src="'+aData.EVENT_IMAGE_URL+'" onerror="'+noImagePath+'" width="225" alt="event Image"/>');
					        	   /*var timeZone = "",timeZoneOffset = "";
					        	   var eventDateForTime = new Date();
					        	   var january = new Date(eventDateForTime.getFullYear(), 0, 1);
					        	   var januaryOffset = january.getTimezoneOffset();
					        	   var july = new Date(eventDateForTime.getFullYear(), 6, 1);
					        	   var julyOffset = july.getTimezoneOffset();
					        	   var dstObserved = januaryOffset == julyOffset;
					        	   var dstDiff = Math.abs(januaryOffset - julyOffset);
					        	   if(dstObserved){
					        	   var timezoneOffset = parseInt(eventDateForTime.getTimezoneOffset());
					        	   }else{
					        	   var timezoneOffset = 300;
					        	   }
					        	   var timeDifference = timeZone * 60 + (timezoneOffset);
					        	   var startTimeChanged = new Date(parseInt(aData.date) + Math.abs(timeDifference) * 60 * 1000);
					        	   var endTimeChanged = new Date(parseInt(aData.end) + Math.abs(timeDifference) * 60 * 1000);
			                	   
			                	   var startTime = new Date(parseInt(aData.date)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
			                       var endTime = new Date(parseInt(aData.end)).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
			                	   var todayDate = new Date().getTime();
			                	   
			                	   var statrMonthDate = eventsOpts.monthNames[startTimeChanged.getMonth()] +" "+startTimeChanged.getDate(), endMonthDate = eventsOpts.monthNames[endTimeChanged.getMonth()] +" "+endTimeChanged.getDate();
			                	   if(statrMonthDate == endMonthDate){
					        		   jQuery('td:eq(0)', nRow).html("<p>"+eventsOpts.dayFullNames[startTimeChanged.getDay()]+ ", " + statrMonthDate + ", " + startTimeChanged.getFullYear()+"</p>");
					        	   }else{
				                	   jQuery('td:eq(0)', nRow).html("<p>"+eventsOpts.dayFullNames[startTimeChanged.getDay()]+ ", " + statrMonthDate + ", " + startTimeChanged.getFullYear()+ " to " +eventsOpts.dayFullNames[endTimeChanged.getDay()]+ ", " + endMonthDate + ", " + endTimeChanged.getFullYear()+"</p>");
					        	   }
			                	   
			                	   if(aData.isAllDayEvent==1){
					        		   jQuery('td:eq(1)', nRow).html("<p class='allEvent'>All Day</p>");
					        	   }else{
					        		   jQuery('td:eq(1)', nRow).html('<p>'+startTime+" to "+endTime+"</p>");
					        	   }
					        	  */
					        	   
					        	   var res = aData.timezoneOffset.substring(3, 4);
			                	   if(res == 3){
			                		   res = aData.timezoneOffset.substring(0, 3)+".5";
			                	   }else{
			                		   res = aData.timezoneOffset.substring(0, 3)
			                	   }
			                	   var startTime = calcTime(aData.date, res);
			                	   var endTime = calcTime(aData.end, res);
			                	   
			                	   var startTimeChanged = new Date(startTime)
			                	   var endTimeChanged = new Date(endTime)
			                	   
			                	   var statrMonthDate = eventsOpts.monthNames[startTimeChanged.getMonth()] +" "+startTimeChanged.getDate(), endMonthDate = eventsOpts.monthNames[endTimeChanged.getMonth()] +" "+endTimeChanged.getDate();
			                	   if(statrMonthDate == endMonthDate){
					        		   jQuery('td:eq(0)', nRow).html("<p>"+eventsOpts.dayFullNames[startTimeChanged.getDay()]+ ", " + statrMonthDate + ", " + startTimeChanged.getFullYear()+"</p>");
					        	   }else{
				                	   jQuery('td:eq(0)', nRow).html("<p>"+eventsOpts.dayFullNames[startTimeChanged.getDay()]+ ", " + statrMonthDate + ", " + startTimeChanged.getFullYear()+ " to " +eventsOpts.dayFullNames[endTimeChanged.getDay()]+ ", " + endMonthDate + ", " + endTimeChanged.getFullYear()+"</p>");
					        	   }
			                	   
			                	   if(aData.isAllDayEvent==1){
					        		   jQuery('td:eq(1)', nRow).html("<p class='allEvent'>All Day</p>");
					        	   }else{
					        		   startTime = new Date(startTime).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
					        		   endTime = new Date(endTime).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
					        		   jQuery('td:eq(1)', nRow).html('<p>'+ startTime + " to " + endTime +"</p>");
					        	   }
					        	   jQuery('td:eq(0)', nRow).append('<p>'+aData.title+'</p>');//<a href="/'+aData.id+'/EventDetail/'+aData.title+'"></a>
					        	   jQuery('td:eq(0)', nRow).append('<p><strong>Location:</strong> '+aData.location+'</p>');
					        	   jQuery('td:eq(2)', nRow).addClass('calendarDetail').html('<a href="/eventDetailsUnit.action?eventID='+aData.id+'"><em class="fa fa-2x fa-calendar"></em></a>');
					           }
                } );
                flags.wrap.find('.eventsCalendar-loading').hide();
                flags.wrap.find('.eventsCalendar-list').html(events.join(''));
                flags.wrap.find('.eventsCalendar-list').animate({
                    opacity: 1,
                    height: "toggle"
                }, eventsOpts.moveSpeed);
            }
        });
        setCalendarWidth();
    }
function calcTime(timeStamp, offset) {
	var timeDate = parseInt(timeStamp)
    d = new Date(timeDate);
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*offset));
    return nd.toLocaleString();
}

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        var hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    function changeMonth() {
        flags.wrap.find('.arrow').click(function(e) {
        	$("ul.calendarFilterHead li").removeClass('active');
        	$("#month").parent().addClass('active');
            e.preventDefault();
            if ($(this).hasClass('next')) {
                dateSlider("next");
                var lastMonthMove = '-=' + flags.directionLeftMove;
            } else {
                dateSlider("prev");
                var lastMonthMove = '+=' + flags.directionLeftMove;
            }
            flags.wrap.find('.eventsCalendar-monthWrap.oldMonth').animate({
                opacity: eventsOpts.moveOpacity,
                left: lastMonthMove
            }, eventsOpts.moveSpeed, function() {
                flags.wrap.find('.eventsCalendar-monthWrap.oldMonth').remove();
            });
        });
    }

    function showError(msg) {
        flags.wrap.find('.eventsCalendar-list-wrap').html("<span class='eventsCalendar-loading error'>" + msg + " " + eventsOpts.eventsjson + "</span>");
    }

    function setCalendarWidth() {
        flags.directionLeftMove = flags.wrap.width();
        //flags.wrap.find('.eventsCalendar-monthWrap').width(270 + 'px');
       // flags.wrap.find('.eventsCalendar-list-wrap').width(270 + 'px');
    }

    function positionFooterForCalendar() {
        var padding_top = $(".mainEnclosure2").height();
        var window_height = $(".mainEnclosure").height();
        var tempVal = window_height - 193;
        if (tempVal < padding_top) {
            $(".mainEnclosure").css({
                height: padding_top + "px"
            });
        }
    }
};
$.fn.eventCalendar.defaults = {
    eventsjson: 'js/events.json',
    eventsLimit: 4,
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    dayFullNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    txt_noEvents: "There are no events in this period",
    txt_SpecificEvents_prev: "",
    txt_SpecificEvents_after: "events:",
    txt_next: "NEXT",
    txt_prev: "PREVIOUS",
    txt_GoToEventUrl: "See the event",
    showDayAsWeeks: true,
    startWeekOnSunday: true,
    showDayNameInCalendar: true,
    showDescription: false,
    onlyOneDescription: false,
    openEventInNewWindow: false,
    showDayAsWeeks: true,
    eventsScrollable: false,
    moveSpeed: 500,
    moveOpacity: 0.15,
    jsonData: "",
    cacheJson: true,
    category: "",
    isSkipEvent: 0
};
var loading;
var counter;
var showFeatured;
$(document).ready(function() {
    showFeatured = $('#featureEventFlag').val();
    counter = $('#featureEventLimiter').val();
    if (showFeatured == 'Y') {
        loading = true;
    } else {
        loading = false;
    }
});

function FindDstSwitchDate(year, month) {
    var baseDate = new Date(Date.UTC(year, month, 0, 0, 0, 0, 0));
    var changeDay = 0;
    var changeMinute = -1;
    var baseOffset = -1 * baseDate.getTimezoneOffset() / 60;
    var dstDate;
    for (day = 0; day < 50; day++) {
        var tmpDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        var tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
        if (tmpOffset != baseOffset) {
            var minutes = 0;
            changeDay = day;
            tmpDate = new Date(Date.UTC(year, month, day - 1, 0, 0, 0, 0));
            tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
            while (changeMinute == -1) {
                tmpDate = new Date(Date.UTC(year, month, day - 1, 0, minutes, 0, 0));
                tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
                if (tmpOffset != baseOffset) {
                    tmpOffset = new Date(Date.UTC(year, month, day - 1, 0, minutes - 1, 0, 0));
                    changeMinute = minutes;
                    break;
                } else
                    minutes++;
            }
            dstDate = tmpOffset.getMonth() + 1;
            if (dstDate < 10) dstDate = "0" + dstDate;
            dstDate += '/' + tmpOffset.getDate() + '/' + year + ' ';
            tmpDate = new Date(Date.UTC(year, month, day - 1, 0, minutes - 1, 0, 0));
            dstDate += tmpDate.toTimeString().split(' ')[0];
            return dstDate;
        }
    }
}

function testLoad() {
    $(".eventsCalendar-daysList li").each(function() {
        $(this).attr("onclick", "reloadPage()");
    });
}

function reloadPage() {
    location.href = $("base").attr("href") + "calEventsUnit.action";
}

function getUrlParams(url) {
    var params = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
        params[key] = value;
    });
    return params;
}
Date.prototype.getWeek = function() {
	  var target  = new Date(+this);  
	  var dayNr   = (+this.getDay() + 6) % 7;  
	  target.setDate(target.getDate() - dayNr + 3);  
	  var jan4    = new Date(target.getFullYear(), 0, 4);  
	  var dayDiff = (target - jan4) / 86400000;    
	  var weekNr = 1 + Math.ceil(dayDiff / 7);    
	  return weekNr;
    
}
function formatDate(date) {
	var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var week = days[date.getDate()];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return  week+', '+day + ' ' + monthNames[monthIndex] + ' ' + year;
}