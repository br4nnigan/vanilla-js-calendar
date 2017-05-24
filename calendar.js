/* Vanilla JS Calendar */

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function VanillaJsCalendar(options) {

	"use strict";

	var theDate = new Date();
	var targetElem = options.targetElem;

	var currentDate = new DateObject(theDate);
	var events = {};

	var api = {
		goToMonth: goToMonth,
		addEvent: addEvent
	}

	function addEvent(event) {

		events[events.id] = event;
		renderCalendar();
	}

	function renderCalendar(){

		// Custom function to make new elements easier:
		function addElem(elementType, elemClass, appendTarget){
			appendTarget.innerHTML += "<"+elementType+" class="+elemClass+"> </"+elementType+">";
		}

		function getCell(n, className) {
			var cell = document.createElement("li");
				cell.className = "calendar-cell calendar-day " + (className || "");
				cell.innerHTML = n || "&nbsp";
			return cell;
		}

		targetElem.innerHTML = "";

		currentDate = new DateObject(theDate);

		if ( options.dayView ) {
			// Monday, dayView
			addElem("div", "day-view", targetElem);
			var dayView = document.querySelector('.day-view');
			var dayNameElem = document.createElement("div"); // i.e.: Wednesday
			dayNameElem.className = "day-header";
			var dayNameNode = document.createTextNode(currentDate.dayName);
			dayNameElem.appendChild(dayNameNode);
			dayView.appendChild(dayNameElem);
			// 21st, dayNumber
			addElem("time", "day-number", dayView);
			var dayElement = document.querySelector('.day-number');
			var dayNumber = parseInt(currentDate.theDay) < 10 && options.minDigits === 2 ? "0" + currentDate.theDay : dayNumber;
			var dayNumNode = document.createTextNode(dayNumber);
			dayElement.appendChild(dayNumNode);
			dayView.appendChild(dayElement);
		}
		if ( options.monthView ) {
			addElem("div", "month-view", targetElem);
			var monthView = document.querySelector('.month-view');

			var prevMonthSpan = document.createElement("SPAN");
			prevMonthSpan.addEventListener('click', function(){
				goToMonth(-1); // Go To Previous Month
			});
			prevMonthSpan.classList.add('arrow', 'float-left', 'prev-arrow');
			var backArrow = document.createTextNode("<");
			prevMonthSpan.appendChild(backArrow);

			var nextMonthSpan = document.createElement("SPAN");
			nextMonthSpan.addEventListener('click', function(){
				goToMonth(1); // Go To Next Month
			});
			nextMonthSpan.classList.add('arrow', 'float-right', 'next-arrow');
			var nextArrow = document.createTextNode(">");
			nextMonthSpan.appendChild(nextArrow);

			var monthSpan = document.createElement("SPAN");
			monthSpan.className = "month-header";
			var monthOf = document.createTextNode(
				currentDate.theMonth
			);

			monthSpan.appendChild(prevMonthSpan);
			monthSpan.appendChild(monthOf);
			monthSpan.appendChild(nextMonthSpan);
			monthView.appendChild(monthSpan);


			for(var i=0; i < dayNamesShort.length; i++){
				var dayOfWeek = document.createElement('div');
				dayOfWeek.className = "day-of-week";
				var charOfDay = document.createTextNode(dayNamesShort[i]);
				dayOfWeek.appendChild(charOfDay);
				monthView.appendChild(dayOfWeek);
			}

			// targetElem.appendChild(document.createElement("ul"));
			var calendarList = document.createElement("ul");
			for(i = 0; i < currentDate.daysInMonth; i++){
				var calendarCell = document.createElement("li");
				var calCellTime = document.createElement("time");
				calendarList.appendChild(calendarCell);
				calendarCell.id = 'day_'+(i+1);

				var dayDataDate = new Date(theDate.getFullYear(), theDate.getMonth(), (i+1));
				calCellTime.setAttribute('datetime', dayDataDate.toISOString());
				calCellTime.setAttribute('data-dayofweek', dayNames[dayDataDate.getDay()]);

				calendarCell.className = "calendar-cell calendar-day calendar-day--this-month";
				if(i === currentDate.theDay-1){
					calendarCell.classList.add("today");
				}

				var dayNumber = (i < 9) && options.minDigits === 2 ? "0" + (i + 1) : i + 1;
				var dayOfMonth = document.createTextNode(dayNumber);
				console.log('test', dayOfMonth);
				calCellTime.appendChild(dayOfMonth);
				calendarCell.appendChild(calCellTime);
				monthView.appendChild(calendarList);

				onDayCreate(dayDataDate, calendarCell);

			} // daysInMonth for loop ends


			function onDayCreate(dayDataDate, calendarCell) {

				// add events
				for (var id in events) {
					if (events.hasOwnProperty(id)) {

						var event = events[id];
						var dayHasEvent = false;

						if ( event.startDate.toString() == dayDataDate.toString() ) {

							dayHasEvent = true;
							calendarCell.classList.add("event--start");
							calendarCell.setAttribute("data-event-start", event.id);
						}
						if ( event.endDate && event.endDate.toString() == dayDataDate.toString() ) {

							dayHasEvent = true;
							calendarCell.classList.add("event--end");
							calendarCell.setAttribute("data-event-end", event.id);
						}
						if ( event.endDate && event.startDate.getTime() < dayDataDate.getTime() && event.endDate.getTime() > dayDataDate.getTime() ) {

							dayHasEvent = true;
							calendarCell.classList.add("event--mid");
							calendarCell.setAttribute("data-event-mid", event.id);
						}

						if ( dayHasEvent ) {
							calendarCell.classList.add("event--mid");
							if ( typeof event.onClick == "function" ) {
								calendarCell.addEventListener("click", function () {
									event.onClick(event);
								});
							}
						}
					}
				}
			}


		}

		document.addEventListener("keydown", function onDocumentKeyDown(event) {
			switch (event.keyCode) {
				case 37: //Left key
					goToMonth(-1);
					break;
				case 39: //Right key
					goToMonth(1);
					break;
			}
		}, true);


		var daysInLastMonth = new Date(theDate.getFullYear(), theDate.getMonth(), 0).getDate();
		var daysThisMonth = monthView.querySelectorAll('.calendar-day--this-month');

		var firstDay = daysThisMonth[0];
		var lastDay = daysThisMonth[daysThisMonth.length - 1];


		// full previous months days
		var daysToFill = {
			"Monday": 1,
			"Tuesday": 2,
			"Wednesday": 3,
			"Thursday": 4,
			"Friday": 5,
			"Saturday": 6
		}
		for (var i = 0, day; i < daysToFill[currentDate.firstDayOfMonth]; i++) {

			day = options.showAllDates ? daysInLastMonth + i - daysToFill[currentDate.firstDayOfMonth] + 1 : null;
			firstDay.parentNode.insertBefore(getCell(day, "calendar-day--prev-month"), firstDay);
		}
		// full next months days
		var daysToFill = {
			"Sunday": 6,
			"Monday": 5,
			"Tuesday": 4,
			"Wednesday": 3,
			"Thursday": 2,
			"Friday": 1
		}
		for (var i = 0, day; i < daysToFill[currentDate.lastDayOfMonth]; i++) {
			day = options.showAllDates ? i + 1 : null;
			lastDay.parentNode.appendChild(getCell(day, "calendar-day--next-month"));
		}


		var dayHeader = document.querySelector('.day-header');
		var dayNumNode = document.querySelector('.day-number');
		var updateDay = function(){
			var thisCellTime = this.querySelector('time');
			if ( dayHeader ) {
				dayHeader.textContent = thisCellTime.getAttribute('data-dayofweek');
			}
			if ( dayNumNode ) {
				dayNumNode.textContent = this.textContent;
			}
		}

		var calCells = document.getElementsByClassName('calendar-cell');
		for(i = 0; i < calCells.length; i++){
			calCells[i].addEventListener('click', updateDay, false);
		}

		if ( typeof options.onRender == "function" ) {
			options.onRender(targetElem, currentDate);
		}

	} // renderCalener function ends

	function goToMonth(direction, date) {
		if (typeof direction == "number"){
			theDate = new Date(theDate.getFullYear(), theDate.getMonth() + direction, 1);
		} else if ( date ) {
			theDate = new DateObject(date);
		}
		return renderCalendar();
	}

	if ( targetElem ) {
		return renderCalendar(), api;
	}
};
function DateObject(theDate) {
		this.date = theDate;
		this.theDay = theDate.getDate();
		this.dayName = dayNames[theDate.getDay()];
		this.theMonth = monthNames[theDate.getMonth()];
		this.theYear = theDate.getFullYear();
		this.daysInMonth = new Date(theDate.getFullYear(), theDate.getMonth()+1, 0).getDate();
		this.firstDayOfMonth = dayNames[new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay()];
		this.lastDayOfMonth = dayNames[new Date(theDate.getFullYear(), theDate.getMonth(), this.daysInMonth).getDay()];
};
if ( typeof module != "undefined" ) {
	module.exports = { VanillaJsCalendar: VanillaJsCalendar, DateObject: DateObject };
}

