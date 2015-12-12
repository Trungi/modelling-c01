var backend = new function() {
	// HELPERS
	this.keys = new function(obj)
	{
		var keys = [];

		for(var key in obj)
		{
			if(obj.hasOwnProperty(key))
			{
				keys.push(key);
			}
		}

		return keys;
	}

	// TT
	this.keyframes = [];

	this.getKeyframes = function (){
		console.log(this.keyframes);
		return this.keyframes;
	}
	
	this.resetKeyframes = function () {
		this.keyframes = [{
			'x': 0,
			'y': 0,
			'r': 0,
		}];
	}

	this.addKeyFrame = function (x, y, r, t) {
		this.keyframes[t] = {
			'x': x,
			'y': y,
			'r': r,
		};
	}

	this.deleteKeyFrame = function (t) {
		delete this.keyframes[t];
	}

	this.getPosition = function (t) {
		// linear interpolation between two keypoints
		pk = 0;

		sorted = keys(this.keyframes).sort();
		for (id in sorted) {
			key = sorted[id];

			if (key > t) {
				var a = this.keyframes[pk];
				var b = this.keyframes[key];

				// perform interpolation
				delta = ((t-pk)/(key-pk));
				deltaX = (b['x'] - a['x'])*delta;
				deltaY = (b['y'] - a['y'])*delta;
				deltaR = (b['r'] - a['r'])*delta;

				return {
					'x': a['x'] + deltaX,
					'y': a['y'] + deltaY,
					'r': a['r'] + deltaR,
				}
			}

			pk = key;
		}

		// if position is not between two this.keyframes, there is no interpolation
		return this.keyframes[pk];
	}

	// Initialization
	this.resetKeyframes();

	// TEST SCRIPT
	// addKeyFrame(1, 1, 1, 0.5);
	// addKeyFrame(1, 1, 1, 1);
	// console.log(this.keyframes);

	// console.log(getPosition(0.3));

}