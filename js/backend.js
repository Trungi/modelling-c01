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

	
	this.resetKeyframes = function () {
		keyframes = [{
			'x': 0,
			'y': 0,
			'r': 0,
		}];
	}

	this.addKeyFrame = function (x, y, r, t) {
		keyframes[t] = {
			'x': x,
			'y': y,
			'r': r,
		};
	}

	this.deleteKeyFrame = function (t) {
		delete keyframes[t];
	}

	this.getPosition = function (t) {
		// linear interpolation between two keypoints
		pk = 0;

		sorted = keys(keyframes).sort();
		for (id in sorted) {
			key = sorted[id];

			if (key > t) {
				var a = keyframes[pk];
				var b = keyframes[key];

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

		// if position is not between two keyframes, there is no interpolation
		return keyframes[pk];
	}

	// Initialization
	this.resetKeyframes();

	// TEST SCRIPT
	// addKeyFrame(1, 1, 1, 0.5);
	// addKeyFrame(1, 1, 1, 1);
	// console.log(keyframes);

	// console.log(getPosition(0.3));

}