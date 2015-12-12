var interpolation = new function() {

	// TT
	this.type = "linear";
	this.keyframes = [];
	this.times = [];

	this.lo = function (){
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
			return this.keyframes[this.times[0]];
		}

		// else interpolate!
		if (this.type == "nearest") {
			return this.nearestInterpolation(t);
		} else if (this.type == "linear") {
			return this.linearInterpolation(t);
		} else {
			return this.bezierInterpolation(t);
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

	this.bezierInterpolation = function (t) {
		// bezier interpolation between two keypoints
		var pk = 0;

		for (id in this.times) {
			if (this.times[id] < t) {
				var from = this.keyframes[this.times[id]];
				var to = this.keyframes[this.times[Number(id) + 1]];

				var bezierT = (t - from['value'])/(to['value'] - from['value']);
				
				var x = bezier(bezierT, from['recx'], from['b1x'], from['b2x'], to['recx']);
				var y = bezier(bezierT, from['recy'], from['b1y'], from['b2y'], to['recy']);
				var deltaR = (to['recr'] - from['recr'])*bezierT;

				return {
					'recx': x,
					'recy': y,
					'recr': from['recr'] + deltaR,
				}				
			}
		}

		return this.keyframes[this.keyframes.length-1];
	}
}