$( document ).ready(function() {
	var cfg = {
		fps: 20,
		numOfSec: 10000,
		time: {},
		widthOfTimeline: 460,
		widthOfScreen: 500,
		recWidth: 100,
		recHeight: 50,
		widthOfTimelineCircle: 20,
		activeKeyframeIndex: 0,
	};

	nonDatedata = [
		{"value": (20*cfg.numOfSec)/cfg.widthOfTimeline, "name": "0s", 'recx': 50, 'recy': 50, 'recr': 0, 'b1x': 200, 'b1y': 200, 'b2x': 300, 'b2y': 300 },
		{"value": cfg.numOfSec, "name": "10s", 'recx': (cfg.widthOfScreen/2 - cfg.recWidth/2), 'recy': (cfg.widthOfScreen/2 - cfg.recHeight/2), 'recr': 200}
	];
	
	function playAnimation(){
		var secCounter = 0;
		Timeline.movePlayingLine(cfg);

		cfg.fps = $("#fps-input").val();

		var type = $("#interpolation input[type='radio']:checked").val();
		interpolation.loadData(nonDatedata, type);

		cfg.time = setInterval(function(){
			secCounter += 1000/cfg.fps;
			if(secCounter >= cfg.numOfSec) stopPlaying();

			// get square
			position = interpolation.getPosition(secCounter);
			console.log(position);
			Screen.redraw('#screen', position, cfg);
		}, 1000/cfg.fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
		clearInterval(cfg.time);
	}

	$("#timeline-wrapper").on("click", ".timeline-event", function(evt) {
		Timeline.activateKeyframe($(this), cfg, nonDatedata);
		Screen.redraw('#screen', nonDatedata[cfg.activeKeyframeIndex], cfg);
	});

	$("#timeline-wrapper").on("click", ".timeline-line", function(evt) {
		Timeline.addNewCircle(cfg, evt);
	});

	// ulozenie novej pozicie obdlznika pre aktualny frame
	$("#screen").on( "mouseout", ".rec", function(evt) {
		nonDatedata[cfg.activeKeyframeIndex].recx = parseFloat(d3.select(".rec").attr("x"));
		nonDatedata[cfg.activeKeyframeIndex].recy = parseFloat(d3.select(".rec").attr("y"));
	});

	$('#play-animation-btn').click(function(){
		playAnimation();
	});
	   
	Timeline.redraw('#timelineNonDate', nonDatedata);
	Screen.redraw('#screen', nonDatedata[0], cfg);


	// interpolation.loadData(nonDatedata);

});

