$( document ).ready(function() {
	var cfg = {
		fps: 1,
		numOfSec: 10000,
		time: {},
		widthOfTimeline: 460,
		widthOfTimelineCircle: 20,
		activeKeyframeIndex: 0,
	};

	nonDatedata = [
		{"value": 0, "name": "0s", 'recx': 50, 'recy': 50 },
		{"value": cfg.numOfSec, "name": "10s", 'recx': 0, 'recy': 0}
	];
	
	function playAnimation(){
		var secCouner = 0;
		time = setInterval(function(){
			secCouner += 1000/cfg.fps;
			if(secCouner >= cfg.numOfSec) stopPlaying();
			Timeline.redraw('#timelineNonDate', nonDatedata);
		}, 1000/fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
		clearInterval(cfg.time);
	}

	$("#timeline-wrapper").on("click", ".timeline-event", function(evt) {
		$('.timeline-event').attr("class", "timeline-event");
		$(this).attr("class", "timeline-event active-circle");
		cfg.activeKeyframeIndex = Timeline.getIndexOfActiveKeyframe($(this), nonDatedata, cfg);
		Screen.redraw('#screen', nonDatedata[cfg.activeKeyframeIndex]);
	});

	$("#timeline-wrapper").on( "click", ".timeline-line", function(evt) {
		var e = evt.target;
		var dim = e.getBoundingClientRect();
		var x = evt.clientX - dim.left;
		var y = evt.clientY - dim.top;
		nonDatedata.push({"value": ((x*cfg.numOfSec)/cfg.widthOfTimeline), "name": (((x*cfg.numOfSec)/cfg.widthOfTimeline)/10)+"s" , 'recx': 0, 'recy': 0});
		Timeline.redraw('#timelineNonDate', nonDatedata);
	});

	// ulozenie novej pozicie obdlznika pre aktualny frame
	$("#screen").on( "mouseout", ".rec", function(evt) {
		nonDatedata[cfg.activeKeyframeIndex].recx = parseFloat(d3.select(".rec").attr("x"));
		nonDatedata[cfg.activeKeyframeIndex].recy = parseFloat(d3.select(".rec").attr("y"));
	});

	   
	Timeline.redraw('#timelineNonDate', nonDatedata);
	Screen.redraw('#screen', nonDatedata[0]);

	// playAnimation();


});

