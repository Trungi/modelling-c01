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

	drawBezier: function() {

	}
}

