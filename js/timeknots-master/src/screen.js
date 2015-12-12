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
		d3.select(this)
			.attr("x", (d3.event.x-50))
			.attr("y", (d3.event.y-25));
	},

	redraw: function(id, keyframe){
		$(id).empty();
		this.draw(id, keyframe, {dateDimension:false, color: "teal", width:500, showLabels: false, labelFormat: "%Y"}, mainCfg);
	},

	drawBezier: function(id, keyframe, nextkeyframe) {

	    var svg = d3.select(id);

		svg.append("svg:path")
		.attr("id", "curve")
		.attr("d", "M"+ [keyframe.recx, keyframe.recy].join() + " C" + [keyframe.b1x, keyframe.b1y].join() +
			" " + [keyframe.b2x, keyframe.b2y].join() + " "+ [nextkeyframe.recx, nextkeyframe.recy].join())
		.style('fill', 'none')
		.style('stroke-linecap', 'round')
		.style('stroke', '#000')
		.style('stroke-width', '3px');
	}
}

