var Screen = {
  draw: function(id, frame, options){
	    var cfg = {
	      width: 500,
	      height: 400,
	    };

	    var svg = d3.select(id)
			.append('svg')
			.style("border", '2px solid teal')
			.attr("width", cfg.width)
			.attr("height", cfg.height);

	    rec = svg.append("svg:rect")
			.attr("class", "rec")
			.attr("x", frame.recx)
			.attr("y", frame.recy)
			.attr("width", mainCfg.recWidth)
			.attr("height", mainCfg.recHeight)
			.attr("transform", "rotate("+ frame.recr + " " + frame.recx + " " + frame.recy + ")")
			.style('stroke','teal')
			.style('stroke-width','6')
			.style('fill','white')
			.call(d3.behavior.drag().on("drag", this.move));
	},

	move: function(){
		if (event.shiftKey) {
			// rotacia
			nonDatedata[mainCfg.activeKeyframeIndex].recr = (d3.event.y + d3.event.x) % 359;
			Screen.redrawKeyframe();
		} else {
			// posuvanie
			nonDatedata[mainCfg.activeKeyframeIndex].recx = d3.event.x - mainCfg.recWidth*1.5;
			nonDatedata[mainCfg.activeKeyframeIndex].recy = d3.event.y;
			Screen.redrawKeyframe();
		}
	},

	moveBezierCircle1: function (){
		nonDatedata[mainCfg.activeKeyframeIndex].b1x = d3.event.x - mainCfg.recWidth*1.5;
		nonDatedata[mainCfg.activeKeyframeIndex].b1y = d3.event.y;
		Screen.redrawKeyframe();
	},

	moveBezierCircle2: function (){
		nonDatedata[mainCfg.activeKeyframeIndex].b2x = d3.event.x - mainCfg.recWidth*1.5;
		nonDatedata[mainCfg.activeKeyframeIndex].b2y = d3.event.y;
		Screen.redrawKeyframe();
	},

	redraw: function(id, frame){
		$(id).empty();
		this.draw(id, frame, {dateDimension:false, color: "teal", width:500, showLabels: false, labelFormat: "%Y"});
	},

	redrawKeyframe: function(){
		$(mainCfg.screenId).empty();
		var frame = nonDatedata[mainCfg.activeKeyframeIndex];
		this.draw(mainCfg.screenId, frame, {dateDimension:false, color: "teal", width:500, showLabels: false, labelFormat: "%Y"});

		if(mainCfg.interpoltaionMethod == 'bezier' 
			&& mainCfg.activeKeyframeIndex != 1){
			
			var svg = d3.select(mainCfg.screenId+' svg');

			bezierCircle1 = svg.append("svg:circle")
				.attr("class", "bezierCircle1")
				.attr("r", 5)
				.style("stroke", cfg.color)
				.style("stroke-width", cfg.lineWidth)
				.style("fill", cfg.background)
				.attr("cx",frame.b1x)
				.attr("cy", frame.b1y)
				.call(d3.behavior.drag().on("drag", this.moveBezierCircle1));

			bezierCircle2 = svg.append("svg:circle")
				.attr("class", "bezierCircle2")
				.attr("r", 5)
				.style("stroke", cfg.color)
				.style("stroke-width", cfg.lineWidth)
				.style("fill", cfg.background)
				.attr("cx",frame.b2x)
				.attr("cy", frame.b2y)
				.call(d3.behavior.drag().on("drag", this.moveBezierCircle2));

			this.drawBezier(svg, frame, nonDatedata[this.getNextKeyframe(mainCfg.activeKeyframeIndex)]);
		}
	},

	getNextKeyframe: function(keyframeIndex){
		if (keyframeIndex == 0){
			if(nonDatedata.length == 2){
				return 1;
			} else {
				return 2;
			}
		} else if (keyframeIndex == 1){
			return -1;
		} else {
			if(nonDatedata.length == keyframeIndex +1){
				return 1;
			} else {
				return keyframeIndex + 1;
			}
		}
	},

	drawBezier: function(svg, keyframe, nextkeyframe) {
		svg.append("svg:path")
			.attr("id", "curve")
			.attr("d", "M"+ [keyframe.recx, keyframe.recy].join() + " C" + [keyframe.b1x, keyframe.b1y].join() +
				" " + [keyframe.b2x, keyframe.b2y].join() + " "+ [nextkeyframe.recx, nextkeyframe.recy].join())
			.style('fill', 'none')
			.style('stroke-linecap', 'round')
			.style('stroke', '#000')
			.style('stroke-width', '3px');

		rec = svg.append("svg:rect")
			.attr("class", "nextRec")
			.attr("x", nextkeyframe.recx)
			.attr("y", nextkeyframe.recy)
			.attr("width", mainCfg.recWidth/4)
			.attr("height", mainCfg.recHeight/4)
			.attr("transform", "rotate("+ nextkeyframe.recr + " " + nextkeyframe.recx + " " + nextkeyframe.recy + ")")
			.style('stroke','teal')
			.style('stroke-width','3')
			.style('fill','white');
	}
}

