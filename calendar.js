document.addEventListener("DOMContentLoaded", function () {

	var Masonry = require("./modules/Masonry.js");
	var VanillaJsCalendar = require("./modules/VanillaJsCalendar.js");

	(function initialize() {

		initMasonry();
		initCalendar();
	})();


	function initMasonry() {

		Array.prototype.map.call(document.querySelectorAll(".masonry"), function (element) {
			return new Masonry({
				items: element.querySelectorAll(".masonry__item")
			});
		});
	}

	function initCalendar() {

		Array.prototype.map.call(document.querySelectorAll(".calendar--swiper"), function (element) {
			var calendar = new VanillaJsCalendar({
				targetElem: element,
				monthView: true,
				showAllDates: true,
				onRender: onCalendarRender
			});
		});
	}

	function onCalendarRender(targetElem, theDate) {

		var year = document.querySelector(".calendar .event--year");
		if ( year ) {
			year.textContent = theDate.getFullYear();
		}
		var monthHeader = targetElem.querySelector(".month-header");
		if ( monthHeader ) {
			monthHeader.classList.add("event--month");
		}
		var arrows = targetElem.querySelectorAll(".arrow");
		Array.prototype.map.call(arrows, function (element, i) {
			element.classList.add( "button" );
			element.classList.add( "icon" );
			element.classList.add( "inverted" );
			element.classList.add( i == 0 ? "prev" : "next" );
			element.innerHTML = "";
		});

	}

});
