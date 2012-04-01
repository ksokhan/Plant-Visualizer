// green : 77d977
//
windowstate = "running";

function plant(el, data) {
	e = this;
	e.arm = [];
	e.armData = [];
	e.size = { width: 210, height: 210};
	e.origin = (e.size.width / 2) + "," + e.size.height / 2; // position on bottom center

	e.create = function(el, data) {
		e.pCanvas = Raphael(el, e.size.width, e.size.height);
		e.draw(data, 0);
		//e.animate();
		e.attach_events();
	};

	e.calculateValues = function (min, max, val) {
		var cVals = {};
		cVals.max  = /*(typeof max != "undefined" && max != 0) ? max :*/ 100;
		cVals.val = val / max * 100;
		cVals.min = min / max * 100;

		return cVals;
	};

	/**
	 * Draws the plant on screen
	 * @param  {object} data is the object containing the plant's info
	 * @param  {integer} date is an integer for how far back into the history to load. 0 is the latest one.
	 * @return {n/a}
	 */
	e.draw = function(data, date) {

		var index = 0; //init counter variable
		var avg = 0;

		for (key in data.log[date]) {

			var vals = e.calculateValues(data.ranges[key].min, data.ranges[key].max, data.log[date][key].value);

			avg += vals.val;

			// create new set for holding all arms combined
			e.arms = e.pCanvas.set();
			//e.hovers = e.pCan

			// hold each arm
			e.arm[index] = e.pCanvas.set();

			e.arm[index].push(
				e.pCanvas.path("M" + e.origin + "l-" + vals.val  + ",-" + 0).attr({ stroke: "#333", 'stroke-width': 2, 'stroke-linecap': 'round'}),
				e.pCanvas.path("M" + (e.size.width / 2 - vals.min) + "," + (e.size.height/2 - 1) + "l0," + "2"  ).attr({ stroke: "red", 'stroke-width': 6, 'stroke-linecap': 'round'}),
				e.pCanvas.rect(e.size.width / 2 - vals.val, e.size.height / 2 - 10, vals.val, 20).attr({ fill: "#f00", 'stroke-width': 0, 'stroke-opacity': 0, 'fill-opacity': 0})
					.data({
						rotation: 360 / Object.keys(data.properties).length * index,
						value: data.log[date][key].value,
						min: data.ranges[key].min,
						name: data.properties[key].name,
						units: data.properties[key].units
					})
			)
			e.arms.push(e.arm[index]);
			e.arm[index].animate({ transform: "r" + (90 + (360 / Object.keys(data.properties).length) * index) + "," + e.origin }, 2000);

			index++;
		}

		// draw averages for min/max
		e.averages = e.pCanvas.set()

		avg /= Object.keys(data.properties).length;

		e.averages.push(
			e.pCanvas.circle(e.size.width / 2, e.size.height / 2, avg).attr({ stroke: "#7bcbed", fill: '#e6f5fc', 'opacity': 1 }),
			e.pCanvas.circle(e.size.width / 2, e.size.height / 2, 30).attr({ stroke: "#ee9c91", fill: '#fde3df', 'opacity': 1, }),
			e.pCanvas.circle(e.size.width / 2, e.size.height / 2, 100).attr({ stroke: "#ee9c91", 'stroke-width': 1 })
		).toBack();

	};

	e.animate = function() {
		if (windowstate != "paused")
		{
			for(var i = 0, a = e.arm.length; i < a; i++) {
				var rand = Math.random() - 0.5;
				var offset = e.arm[i].data['rotation'];
		        e.arm[i].animate({ transform: 'r' + (90 + offset + 20 * rand) + ' ,' + e.origin }, 2000, "linear", function() {
					this.animate({ transform: 'r' + (90 + this.data['rotation']) + ',' + e.origin }, 2000, "linear", function() {  });
		     	});
		    };
		}

	    setTimeout(this.animate, 4001);
    }

	e.attach_events = function() {
		for (var i=0; i < e.arm.length; i++ ) {
			e.arm[i].mouseover(function() {
				this.prev.prev.attr({ 'stroke': '#f20', 'stroke-width': 4 });
				var txt = '<strong>' + this.data('name') + '</strong> <br>' + this.data('value') + this.data('units') + "<br> (minimum " + this.data('min') + this.data('units') + ")";
				$('#tooltip').html(txt);


			}).mouseout(function() {
				this.prev.prev.attr({ 'stroke': '#333', 'stroke-width': 2 });
				$('#tooltip').html('');
			});
		}

	};

	// init
	e.create(el, data);
}

// stop animations if window lost focus
$(window).blur(function() {
	windowstate = "paused";
}).focus(function() {
	windowstate = "running";
}).mousemove(function(e) {
	$('#tooltip').css({'left': e.pageX + 30, 'top': e.pageY });
});



var plant1 = new plant('plant1', {
	name: "Tomato Plant",
	properties: {
		water: {units: "ml", name: "watering"},
		sunlight: { units: "hours", name: "time in sunlight" } ,
		height: { units: "mm", name: "height" },
		thickness: { units: "mm", name: "stalk thickness" },
		leaf: { units: "mm", name: "leaf size" }
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 12 },
		height: { min: 10 , max: 1.2},
		thickness: { min: 0.1, max: 2.4 },
		leaf: { min: 1, max: 2.0 }
	},
	log:
	[
		{
			water: { value: 100 },
			sunlight: { value: 2 },
			height: { value: 1 },
			thickness: { value: 1.0 },
			leaf: { value: 1.5 }
		}
	]
});

var plant2 = new plant('plant2', {
	name: "Tomato Plant",
	properties: {
		water: {units: "ml", name: "watering"},
		sunlight: { units: "hours", name: "time in sunlight" } ,
		height: { units: "mm", name: "height" },
		thickness: { units: "mm", name: "stalk thickness" },
		leaf: { units: "mm", name: "leaf size" },
		flowers: { units: ' flowers', name: 'number of flowers' }
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 12 },
		height: { min: 80 , max: 4},
		thickness: { min: 0.5, max: 10.4 },
		leaf: { min: 10, max: 70 },
		flowers: { min: 10, max: 100 }
	},
	log:
	[
		{
			water: { value: 100 },
			sunlight: { value: 6 },
			height: { value: 1 },
			thickness: { value: 1.0 },
			leaf: { value: 40 },
			flowers: { value: 10 }
		}
	]
});

var plant3 = new plant('plant3', {
	name: "Tomato Plant",
	properties: {
		water: {units: "ml", name: "watering"},
		sunlight: { units: "hours", name: "time in sunlight" } ,
		height: { units: "mm", name: "height" },
		thickness: { units: "mm", name: "stalk thickness" },
		leaf: { units: "mm", name: "leaf size" }
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 6 },
		height: { min: 80 , max: 400},
		thickness: { min: 0.5, max: 10.4 },
		leaf: { min: 10, max: 70 }
	},
	log:
	[
		{
			water: { value: 120 },
			sunlight: { value: 3 },
			height: { value: 300 },
			thickness: { value: 6 },
			leaf: { value: 40 }
		}
	]
});

var plant4 = new plant('plant4', {
	name: "Tomato Plant",
	properties: {
		water: {units: "ml", name: "watering"},
		sunlight: { units: "hours", name: "time in sunlight" } ,
		height: { units: "mm", name: "height" },
		thickness: { units: "mm", name: "stalk thickness" },
		leaf: { units: "mm", name: "leaf size" },
		stalks: { units: ' stalks', name: 'number of stalks' }
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 12 },
		height: { min: 8 , max: 40},
		thickness: { min: 0.5, max: 10.4 },
		leaf: { min: 10, max: 70 },
		stalks: { min: 3, max: 20 }
	},
	log:
	[
		{
			water: { value: 100 },
			sunlight: { value: 6 },
			height: { value: 15 },
			thickness: { value: 5 },
			leaf: { value: 50 },
			stalks: { value: 7 }
		}
	]
});

var plant5 = new plant('plant5', {
	name: "Tomato Plant",
	properties: {
		water: {units: "ml", name: "watering"},
		sunlight: { units: "hours", name: "time in sunlight" } ,
		height: { units: "mm", name: "height" },
		thickness: { units: "mm", name: "stalk thickness" },
		leaf: { units: "mm", name: "leaf size" }
	},
	ranges: {
		water: { min: 10, max: 120},
		sunlight: { min: 2, max: 12 },
		height: { min: 10 , max: 1.2},
		thickness: { min: 0.1, max: 2.4 },
		leaf: { min: 1, max: 2.0 }
	},
	log:
	[
		{
			water: { value: 100 },
			sunlight: { value: 2 },
			height: { value: 1 },
			thickness: { value: 1.0 },
			leaf: { value: 1.5 }
		}
	]
});