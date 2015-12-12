$( document ).ready(function() {
	var cfg = {
		fps: 20,
		numOfSec: 10000,
		time: {},
		widthOfTimeline: 460,
		widthOfTimelineCircle: 20,
		activeKeyframeIndex: 0,
	};

	nonDatedata = [
		{"value": 0, "name": "0s", 'recx': 50, 'recy': 50, 'recr': 0 },
		{"value": cfg.numOfSec, "name": "10s", 'recx': 200, 'recy': 200, 'recr': 200}
	];
	
	function playAnimation(){
		var secCounter = 0;
		Timeline.movePlayingLine(cfg);
		var type = $("#interpolation input[type='radio']:checked").val();
		interpolation.loadData(nonDatedata, type);

		time = setInterval(function(){
			secCounter += 1000/cfg.fps;
			if(secCounter >= cfg.numOfSec) stopPlaying();

			// get square
			position = interpolation.getPosition(secCounter);
			console.log(position);
			Screen.redraw('#screen', position);
		}, 1000/cfg.fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
		clearInterval(cfg.time);
	}

	$("#timeline-wrapper").on("click", ".timeline-event", function(evt) {
		Timeline.activateKeyframe($(this), cfg, nonDatedata);
		Screen.redraw('#screen', nonDatedata[cfg.activeKeyframeIndex]);
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
	Screen.redraw('#screen', nonDatedata[0]);


});

