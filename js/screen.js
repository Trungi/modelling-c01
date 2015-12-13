var Screen = {

	draw: function(frame){

		var svg = d3.select(mainCfg.screen.id)
			.append('svg')
			.style("border", '2px solid teal')
			.attr("width", mainCfg.screen.width)
			.attr("height", mainCfg.screen.height);

	    rec = svg.append("svg:rect")
			.attr("class", "rec")
			.attr("x", frame.recx)
			.attr("y", frame.recy)
			.attr("width", mainCfg.screen.recWidth)
			.attr("height", mainCfg.screen.recHeight)
			.attr("transform", "rotate("+ frame.recr + " " + frame.recx + " " + frame.recy + ")")
			.style('stroke','teal')
			.style('stroke-width','6')
			.style('fill','white')
			.call(d3.behavior.drag().on("drag", this.moveRectange));
	},

	moveRectange: function(){
		if (event.shiftKey) {
			// rotacia
			keyframes[mainCfg.activeKeyframeIndex].recr = (d3.event.y + d3.event.x) % 359;
			Screen.redrawKeyframe();
		} else {
			// posuvanie
			keyframes[mainCfg.activeKeyframeIndex].recx = d3.event.x - mainCfg.screen.recWidth*1.5;
			keyframes[mainCfg.activeKeyframeIndex].recy = d3.event.y;
			Screen.redrawKeyframe();
		}
	},

	redraw: function(frame){
		$(mainCfg.screen.id).empty();
		this.draw(frame);
	},

	redrawKeyframe: function(){
		$(mainCfg.screen.id).empty();
		var frame = keyframes[mainCfg.activeKeyframeIndex];
		this.redraw(frame);

		if(mainCfg.interpoltaionMethod == 'bezier' 
			&& mainCfg.activeKeyframeIndex != 1){
			
			var svg = d3.select(mainCfg.screen.id+' svg');

			bezierCircle1 = svg.append("svg:circle")
				.attr("class", "bezierCircle1")
				.attr("r", 5)
				.style("stroke", mainCfg.timeline.color)
				.style("stroke-width", mainCfg.timeline.lineWidth)
				.style("fill", mainCfg.timeline.background)
				.attr("cx",frame.b1x)
				.attr("cy", frame.b1y)
				.call(d3.behavior.drag().on("drag", this.moveBezierCircle1));

			bezierCircle2 = svg.append("svg:circle")
				.attr("class", "bezierCircle2")
				.attr("r", 5)
				.style("stroke", mainCfg.timeline.color)
				.style("stroke-width", mainCfg.timeline.lineWidth)
				.style("fill", mainCfg.timeline.background)
				.attr("cx",frame.b2x)
				.attr("cy", frame.b2y)
				.call(d3.behavior.drag().on("drag", this.moveBezierCircle2));

			this.drawBezier(svg, frame, keyframes[this.getNextKeyframeId(mainCfg.activeKeyframeIndex)]);
		}
	},

	moveBezierCircle1: function (){
		keyframes[mainCfg.activeKeyframeIndex].b1x = d3.event.x - mainCfg.screen.recWidth*1.5;
		keyframes[mainCfg.activeKeyframeIndex].b1y = d3.event.y;
		Screen.redrawKeyframe();
	},

	moveBezierCircle2: function (){
		keyframes[mainCfg.activeKeyframeIndex].b2x = d3.event.x - mainCfg.screen.recWidth*1.5;
		keyframes[mainCfg.activeKeyframeIndex].b2y = d3.event.y;
		Screen.redrawKeyframe();
	},

	getNextKeyframeId: function(keyframeIndex){
		var minBiggerValue = mainCfg.numOfSec;
		var minBiggerValueKeyframeIndex = 1;
		$.each(keyframes, function(index, keyframe) {
			console.log(keyframe);
			console.log(index);
			
			if(keyframes[keyframeIndex].value < keyframe.value && minBiggerValue > keyframe.value) {
				minBiggerValue = keyframe.value;
				minBiggerValueKeyframeIndex = index;
			}
		});
		return minBiggerValueKeyframeIndex;
	},

	drawBezier: function(svg, keyframe, nextkeyframe) {
		svg.append("svg:path")
			.attr("id", "curve")
			.attr("d", "M" + [keyframe.recx, keyframe.recy].join() + " C" + [keyframe.b1x, keyframe.b1y].join() +
				" " + [keyframe.b2x, keyframe.b2y].join() + " "+ [nextkeyframe.recx, nextkeyframe.recy].join())
			.style('fill', 'none')
			.style('stroke-linecap', 'round')
			.style('stroke', '#000')
			.style('stroke-width', '3px');

		rec = svg.append("svg:rect")
			.attr("class", "nextRec")
			.attr("x", nextkeyframe.recx)
			.attr("y", nextkeyframe.recy)
			.attr("width", mainCfg.screen.recWidth/4)
			.attr("height", mainCfg.screen.recHeight/4)
			.attr("transform", "rotate("+ nextkeyframe.recr + " " + nextkeyframe.recx + " " + nextkeyframe.recy + ")")
			.style('stroke','teal')
			.style('stroke-width','3')
			.style('fill','white');
	}
}

