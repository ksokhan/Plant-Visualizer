function plant(el, data) {
	e = this;
	e.size = { width: 700, height: 700};
	e.origin = (e.size.width / 2) + "," + e.size.height / 2; // position on bottom center

	e.create = function(el, data) {
		this.pCanvas = Raphael(el, e.size.width, e.size.height);
		this.draw(data, 0);
		this.attach_events();
	};

	/**
	 * Draws the plant on screen
	 * @param  {object} data is the object containing the plant's info
	 * @param  {integer} date is an integer for how far back into the history to load. 0 is the latest one.
	 * @return {n/a}
	 */
	e.draw = function(data, date) {
		// create new set for holding our paths
		e.paths = e.pCanvas.set();

		var index = 0;
		for (key in data.log[date]) {
			var max = data.ranges[key].max || 1;
			var lineLength = data.log[date][key].value / max * 100;
			e.paths.push( e.pCanvas.path("M" + e.origin + "l-" + 2 * lineLength  + ",-" + 0).transform("r" + (90 + 20 * index) + "," + e.origin) ) ;

			index++;
		}
		e.paths.attr({ stroke: "#fff", 'stroke-width': 3, 'stroke-linecap': 'round'});
	};


	e.attach_events = function() {
		e.paths.forEach(function(a) {
			a.mouseover(function() {
				this.animate({ 'stroke-width': 8 }, 100, "<");
			}).mouseout(function() {
				this.animate({ 'stroke-width': 3 }, 100, ">");
			});
		})
	};

	// init
	e.create(el, data);
}

var plant1 = new plant('plant1', {
	name: "Konstantin's Tomato Plant",
	units: {
		water: "ml",
		sunlight: "hours" ,
		height: "mm"
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 6 },
		height: { value: 10 , max: 1.2}
	},
	log:
	[
		{
			water: { value: 100 },
			sunlight: { value: 2 },
			height: { value: 1 }
		}
	]
});

