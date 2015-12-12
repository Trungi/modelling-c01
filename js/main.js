$( document ).ready(function() {
	mainCfg = {
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
		Timeline.movePlayingLine();
		$('#play-animation-btn').prop('disabled', true);

		mainCfg.fps = $("#fps-input").val();

		var type = $("#interpolation input[type='radio']:checked").val();
		interpolation.loadData(nonDatedata, type);

		mainCfg.time = setInterval(function(){
			secCounter += 1000/mainCfg.fps;
			if(secCounter >= mainCfg.numOfSec) stopPlaying();

			// get square
			position = interpolation.getPosition(secCounter);
			console.log(position);
			Screen.redraw('#screen', position, mainCfg);
		}, 1000/mainCfg.fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
		clearInterval(mainCfg.time);
		$('#play-animation-btn').prop('disabled', false);
		Screen.redraw('#screen', nonDatedata[mainCfg.activeKeyframeIndex]);
	}

	$("#timeline-wrapper").on("click", ".timeline-event", function(evt) {
		Timeline.activateKeyframe($(this), nonDatedata);
		Screen.redraw('#screen', nonDatedata[mainCfg.activeKeyframeIndex]);
	});

	$("#timeline-wrapper").on("click", ".timeline-line", function(evt) {
		Timeline.addNewCircle(evt);
		Screen.redraw('#screen', nonDatedata[mainCfg.activeKeyframeIndex]);
	});

	// ulozenie novej pozicie obdlznika pre aktualny frame
	$("#screen").on( "mouseout", ".rec", function(evt) {
		nonDatedata[mainCfg.activeKeyframeIndex].recx = parseFloat(d3.select(".rec").attr("x"));
		nonDatedata[mainCfg.activeKeyframeIndex].recy = parseFloat(d3.select(".rec").attr("y"));
	});

	$('#play-animation-btn').click(function(){
		playAnimation();
	});
	   
	Timeline.redraw('#timelineNonDate', nonDatedata);
	Screen.redraw('#screen', nonDatedata[mainCfg.activeKeyframeIndex]);

	$('#remove-keyframe-btn').click(function(){
		if(mainCfg.activeKeyframeIndex != 0 && mainCfg.activeKeyframeIndex != 1){
			nonDatedata.pop(mainCfg.activeKeyframeIndex);
			mainCfg.activeKeyframeIndex = 0;
			Timeline.redraw('#timelineNonDate', nonDatedata);
			Screen.redraw('#screen', nonDatedata[mainCfg.activeKeyframeIndex], mainCfg);
		}
	});
});

