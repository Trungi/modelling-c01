var Timeline = {
  draw: function(id, events, options){
	cfg = {
	  width: 500,
	  height: 50,
	  radius: 10,
	  lineWidth: 6,
	  color: "#999",
	  background: "#FFF",
	  dateFormat: "%Y/%m/%d %H:%M:%S",
	  horizontalLayout: true,
	  showLabels: false,
	  labelFormat: "%Y/%m/%d %H:%M:%S",
	  addNow: false,
	  seriesColor: d3.scale.category20(),
	  dateDimension: true
	};

	//default configuration overrid
	if(options != undefined){
		for(var i in options){
			cfg[i] = options[i];
		}
	}
	if(cfg.addNow != false){
		events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
	}
	
	var tip = d3.select(id)
		.append('div')
		.style("opacity", 0)
		.style("position", "absolute")
		.style("font-family", "Helvetica Neue")
		.style("font-weight", "300")
		.style("background","rgba(0,0,0,0.5)")
		.style("color", "white")
		.style("padding", "5px 10px 5px 10px")
		.style("-moz-border-radius", "8px 8px")
		.style("border-radius", "8px 8px");
	
	svg = d3.select(id).append('svg').attr("width", cfg.width).attr("height", cfg.height);
	
	//Calculate times in terms of timestamps
	if(!cfg.dateDimension){
		var timestamps = events.map(function(d){console.log(d);return  d.value});//new Date(d.date).getTime()});
		var maxValue = d3.max(timestamps);
		var minValue = d3.min(timestamps);
	}else{
		var timestamps = events.map(function(d){return  Date.parse(d.date);});//new Date(d.date).getTime()});
		var maxValue = d3.max(timestamps);
		var minValue = d3.min(timestamps);
	}
	
	var margin = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
	var step = (cfg.horizontalLayout)?((cfg.width-2*margin)/(maxValue - minValue)):((cfg.height-2*margin)/(maxValue - minValue));
	var series = [];
	if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin=cfg.width/2}else{margin=cfg.height/2}}

	linePrevious = {
	  x1 : null,
	  x2 : null,
	  y1 : null,
	  y2 : null
	}

	svg.append("line")
		.attr("class", "timeline-line")
		  .attr("x1", 20)
		.attr("x2", 480)
		.attr("y1", cfg.height/2)
		.attr("y2", cfg.height/2)
		.style("stroke", "teal")
		.style("stroke-width", cfg.lineWidth);

	svg.selectAll("circle")
		.data(events).enter()
		.append("circle")
		.attr("class", "timeline-event")
		.attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius})
		.style("stroke", cfg.color)
		.style("stroke-width", cfg.lineWidth)
		.style("fill", cfg.background)
		.attr("cy", function(d){
			if(cfg.horizontalLayout){
			  return Math.floor(cfg.height/2)
			}
			var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
			return Math.floor(step*(datum - minValue) + margin)
		})
		.attr("cx", function(d){
			if(cfg.horizontalLayout){
			  var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
			  var x=  Math.floor(step*(datum - minValue) + margin);
			  return x;
			}
			return Math.floor(cfg.width/2)
		}).on("mouseover", function(d){
		  d3.select(this)
		  .style("fill", function(d){if(d.color != undefined){return d.color} return cfg.color}).transition()
		  .duration(100).attr("r",  function(d){if(d.radius != undefined){return Math.floor(d.radius*1.5)} return Math.floor(cfg.radius*1.5)});
		})
		.on("mouseout", function(){
			d3.select(this)
			.style("fill", function(d){if(d.background != undefined){return d.background} return cfg.background}).transition()
			.duration(100).attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius});
			tip.transition()
			.duration(100)
		.style("opacity", 0)});
  },

	redraw: function(id, data, mainCfg){
		$(id).empty();
		this.draw(id, data, {dateDimension:false, color: "teal", width:500, showLabels: false, labelFormat: "%Y"});
	},

	getIndexOfActiveKeyframe: function(cicle, data, mainConf){
		var retIndex = -1;
		var xPos = cicle.attr('cx')*mainConf.numOfSec/mainConf.widthOfTimeline;
		var offset = mainConf.widthOfTimelineCircle*mainConf.numOfSec/mainConf.widthOfTimeline;
		
		console.log(offset);

		$.each(data, function( index, value ) {
			if(value.value < xPos + offset && value.value > xPos - offset){
				retIndex = index;
			}
		});
		
		return retIndex;
	},

	addNewCircle: function (mainCfg, evt){
		var e = evt.target;
		var dim = e.getBoundingClientRect();
		var x = evt.clientX - dim.left;
		var y = evt.clientY - dim.top;
		nonDatedata.push({"value": ((x*mainCfg.numOfSec)/mainCfg.widthOfTimeline), 
			"name": (((x*mainCfg.numOfSec)/mainCfg.widthOfTimeline)/10)+"s", 
			'recx': 0, 'recy': 0});
		this.redraw('#timelineNonDate', nonDatedata, mainCfg);
	},

	activateKeyframe: function (circle, cfg, nonDatedata){
		$('.timeline-event').attr("class", "timeline-event");
		circle.attr("class", "timeline-event active-circle");
		cfg.activeKeyframeIndex = this.getIndexOfActiveKeyframe(circle, nonDatedata, cfg);
	},

	movePlayingLine: function (mainCfg){
		svg.append("line")
			.attr("class", "playing-line")
			.attr("x1", 20)
			.attr("x2", 20)
			.attr("y1", cfg.height/2+10)
			.attr("y2", cfg.height/2-10)
			.style("stroke", "red")
			.style("stroke-width", cfg.lineWidth);

		d3.select('.playing-line')
			.transition()
				.duration(mainCfg.numOfSec)
				.ease("linear")
				.attr("x1", 20 + mainCfg.widthOfTimeline)
				.attr("x2", 20 + mainCfg.widthOfTimeline)
			.remove();
	}
}

