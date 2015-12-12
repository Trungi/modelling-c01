var interpolation = new function() {

	// TT
	this.type = "linear";
	this.keyframes = [];
	this.times = [];

	this.lo = function (){
		console.log(this.keyframes);
		return this.keyframes;
	}
	
	this.loadData = function (data, type) {
		this.type = type;
		// loads data
		for (var i in data) {
			this.keyframes[data[i]['value']] = data[i];
			this.times[this.times.length] = data[i]['value'];
		}

		this.times = this.times.sort(function(a, b){return a-b})
	}

	this.getPosition = function (t) {
		// if this is margin
		if (t < this.times[0]) {
			console.log(this.keyframes[this.times[0]]);
			return this.keyframes[this.times[0]];
		}
		
		// else interpolate!
		if (this.type == "nearest") {
			return this.nearestInterpolation(t);
		} else if (this.type == "linear") {
			return this.linearInterpolation(t);
		} else {

		}
	}

	this.nearestInterpolation = function (t) {
		var pk = 0;

		for (id in this.times) {
			var key = this.times[id];
			if (key > t) {
				return this.keyframes[this.times[id-1]];
			}
		}

		return this.keyframes[this.times[this.times.length-1]];
	}

	this.linearInterpolation = function (t) {
		// linear interpolation between two keypoints
		var pk = 0;

		for (id in this.times) {
			var key = this.times[id];

			if (key > t) {
				var a = this.keyframes[pk];
				var b = this.keyframes[key];

				// perform interpolation
				var delta = ((t-pk)/(key-pk));
				var deltaX = (b['recx'] - a['recx'])*delta;
				var deltaY = (b['recy'] - a['recy'])*delta;
				var deltaR = (b['recr'] - a['recr'])*delta;

				return {
					'recx': a['recx'] + deltaX,
					'recy': a['recy'] + deltaY,
					'recr': a['recr'] + deltaR,
				}
			}

			pk = key;
		}

		// if position is not between two this.keyframes, there is no interpolation
		return this.keyframes[pk];
	}

}