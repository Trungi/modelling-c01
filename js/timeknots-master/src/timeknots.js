var Timeline = {
	draw: function(keyframes){
	
		svg = d3.select(mainCfg.timeline.id).append('svg').attr("width", mainCfg.timeline.width).attr("height", mainCfg.timeline.height);
		
		//Calculate times in terms of timestamps
		if(!mainCfg.timeline.dateDimension){
			var timestamps = keyframes.map(function(d){console.log(d);return  d.value});//new Date(d.date).getTime()});
			var maxValue = d3.max(timestamps);
			var minValue = d3.min(timestamps);
		}else{
			var timestamps = keyframes.map(function(d){return  Date.parse(d.date);});//new Date(d.date).getTime()});
			var maxValue = d3.max(timestamps);
			var minValue = d3.min(timestamps);
		}
		
		var margin = (d3.max(keyframes.map(function(d){return d.radius})) || mainCfg.timeline.radius)*1.5+mainCfg.timeline.lineWidth;
		var step = (mainCfg.timeline.horizontalLayout)?((mainCfg.timeline.width-2*margin)/(maxValue - minValue)):((mainCfg.timeline.height-2*margin)/(maxValue - minValue));
		var series = [];
		if(maxValue == minValue){step = 0;if(mainCfg.timeline.horizontalLayout){margin=mainCfg.timeline.width/2}else{margin=mainCfg.timeline.height/2}}


		svg.append("line")
			.attr("class", "timeline-line")
			  .attr("x1",  mainCfg.timeline.radius)
			.attr("x2",  mainCfg.timeline.width -  mainCfg.timeline.radius)
			.attr("y1", mainCfg.timeline.height/2)
			.attr("y2", mainCfg.timeline.height/2)
			.style("stroke", mainCfg.timeline.color)
			.style("stroke-width", mainCfg.timeline.lineWidth);

		svg.selectAll("circle")
			.data(keyframes).enter()
			.append("circle")
			.attr("class", "timeline-circle")
			.attr("r", mainCfg.timeline.radius)
			.style("stroke", mainCfg.timeline.color)
			.style("stroke-width", mainCfg.timeline.lineWidth)
			.style("fill", mainCfg.timeline.background)
			.attr("cy", Math.floor(mainCfg.timeline.height/2))
			.attr("cx", function(d){
				var datum = (mainCfg.timeline.dateDimension)?new Date(d.date).getTime():d.value;
				var x=  Math.floor(step*(datum - minValue) + margin);
				return x;
			}).on("mouseover", function(){
			  d3.select(this)
			  .style("fill", mainCfg.timeline.color).transition()
			  .duration(100).attr("r",  mainCfg.timeline.radius*1.5);
			})
			.on("mouseout", function(){
				d3.select(this)
				.style("fill", mainCfg.timeline.background).transition()
				.duration(100).attr("r", mainCfg.timeline.radius);
			});
	},

	redraw: function(keyframes){
		$(mainCfg.timeline.id).empty();
		this.draw(keyframes);
		this.drawActiveKeyframe(keyframes);
	},

	drawActiveKeyframe: function (keyframes){
		var activeKeyframe = keyframes[mainCfg.activeKeyframeIndex];
		var offset = mainCfg.widthOfTimelineCircle*mainCfg.numOfSec/mainCfg.widthOfTimeline;
		$('.timeline-circle').each(function() {
			var xPos = $(this).attr('cx')*mainCfg.numOfSec/mainCfg.widthOfTimeline;
			if(xPos < activeKeyframe.value + offset && xPos > activeKeyframe.value - offset){
				$(this).attr("class", "timeline-circle active-circle");
			}
		});
	},

	addNewCircle: function (evt){
		var e = evt.target;
		var dim = e.getBoundingClientRect();
		var x = evt.clientX - dim.left;
		var y = evt.clientY - dim.top;
		var indexOfItem = keyframes.push({"value": ((x*mainCfg.numOfSec)/mainCfg.widthOfTimeline),
			"name": (((x*mainCfg.numOfSec)/mainCfg.widthOfTimeline)/10)+"s", 
			'recx': 0, 'recy': 0, 'recr': 0,
			'b1x': 200, 'b1y': 200, 'b2x': 300, 
			'b2y': 300}) -1;
		mainCfg.activeKeyframeIndex = indexOfItem;
		this.redraw(keyframes);
	},

	activateKeyframe: function (circle, keyframes){
		mainCfg.activeKeyframeIndex = this.getIndexOfActiveKeyframe(circle, keyframes);
		this.redraw(keyframes);
	},

	getIndexOfActiveKeyframe: function(circle, keyframes){
		var retIndex = -1;
		var xPos = circle.attr('cx')*mainCfg.numOfSec/mainCfg.widthOfTimeline;
		var offset = mainCfg.widthOfTimelineCircle*mainCfg.numOfSec/mainCfg.widthOfTimeline;
		
		$.each(keyframes, function( index, value ) {
			if(value.value < xPos + offset && value.value > xPos - offset){
				retIndex = index;
			}
		});
		console.log(retIndex);
		return retIndex;
	},

	movePlayingLine: function (){
		svg.append("line")
			.attr("class", "playing-line")
			.attr("x1", mainCfg.timeline.radius)
			.attr("x2", mainCfg.timeline.radius)
			.attr("y1", mainCfg.timeline.height/2+10)
			.attr("y2", mainCfg.timeline.height/2-10)
			.style("stroke", "red")
			.style("stroke-width", mainCfg.timeline.lineWidth);

		d3.select('.playing-line')
			.transition()
				.duration(mainCfg.numOfSec)
				.ease("linear")
				.attr("x1", mainCfg.timeline.radius + mainCfg.widthOfTimeline)
				.attr("x2", mainCfg.timeline.radius + mainCfg.widthOfTimeline)
			.remove();
	}
}

