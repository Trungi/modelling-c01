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

		this.times = this.times.sort();
	}

	this.getPosition = function (t) {
		if (this.type == "linear" || 1) {
			return this.linearInterpolation(t);
		}
	}

	this.linearInterpolation = function (t) {
		// linear interpolation between two keypoints
		var pk = 0;
		console.log(this.times);

		for (id in this.times) {
			var key = this.times[id];

			console.log(key);
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