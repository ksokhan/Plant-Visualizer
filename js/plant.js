function plant(el, data) {
	e = this;
	e.size = { width: 700, height: 700};
	e.origin = (e.size.width / 2) + "," + e.size.height / 2; // position on bottom center

	e.create = function(el, data) {
		e.pCanvas = Raphael(el, e.size.width, e.size.height);
		e.draw(data, 0);
		//setTimeout(e.animate, 2000);
		e.animate();
		e.attach_events();
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
			e.paths.push(
				e.pCanvas
					.path("M" + e.origin + "l-" + 2 * lineLength  + ",-" + 0)
					.animate({ transform: "r" + (90 + (360 / Object.keys(data.properties).length) * index) + "," + e.origin }, 2000)
					.data({ rotation: 360 / Object.keys(data.properties).length * index })
			);
			index++;
		}
		e.paths.attr({ stroke: "#fff", 'stroke-width': 5, 'stroke-linecap': 'round'});
	};

	e.animate = function() {
		e.paths.forEach(function(a) {
			var rand = Math.random() - 0.5;
	        a.animate({ transform: 'r' + (90 + a.data('rotation') + 20 * rand) + ' ,' + e.origin }, 2000, ">", function () {
	            this.animate({ transform: 'r' + (90 + this.data('rotation')) + ',' + e.origin }, 2000, "<", function() {  });
	        });
	    });
	    setTimeout(e.animate, 4010);
    }

	e.attach_events = function() {
		e.paths.forEach(function(a) {
			a.mouseover(function() {
				this.animate({ 'stroke-width': 10 }, 100, "<");
			}).mouseout(function() {
				this.animate({ 'stroke-width': 5 }, 100, ">");
			});
		})
	};

	// init
	e.create(el, data);
}


var plant1 = new plant('plant1', {
		name: "Konstantin's Tomato Plant",
		properties: {
			water: {units: "ml"},
			sunlight: { units: "hours" } ,
			height: { units: "mm" },
			thickness: { },
			leaf: { },
			asd: { min: 1, max: 2.0 },
			asdasd: { min: 1, max: 2.0 }
		},
		ranges: {
			water: { min: 10, max: 120},
			sunlight: { min: 2, max: 6 },
			height: { min: 10 , max: 1.2},
			thickness: { min: 0.1, max: 2.4 },
			leaf: { min: 1, max: 2.0 },
			asd: { min: 1, max: 2.0 },
			leasdasdaf: { min: 1, max: 2.0 }
		},
		log:
		[
			{
				water: { value: 100 },
				sunlight: { value: 2 },
				height: { value: 1 },
				thickness: { value: 1.0 },
				asd: { value: 1.5 },
				leasdasdaf: { value: 1.5 },
				leaf: { value: 1.5 }
			}
		]
	});

