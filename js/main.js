$( document ).ready(function() {
	mainCfg = {
		fps: 20,
		numOfSec: 10000,
		time: {},
		widthOfTimeline: 480,
		widthOfTimelineCircle: 20,
		interpoltaionMethod: 'linear',
		activeKeyframeIndex: 0,
		screen: {
			width: 500,
			height: 400,
			id: '#screen',
			recWidth: 100,
			recHeight: 50,
		},
		timeline: {
			width: 500,
			height: 50,
			radius: 10,
			lineWidth: 6,
			color: "teal",
			background: "#FFF",
			dateFormat: "%Y/%m/%d %H:%M:%S",
			horizontalLayout: true,
			showLabels: false,
			labelFormat: "%Y",
			addNow: false,
			seriesColor: d3.scale.category20(),
			id: '#timelineNonDate',
			dateDimension: false
		}
	};

	keyframes = [
		{"value": (20*mainCfg.numOfSec)/mainCfg.widthOfTimeline, "name": "0s", 'recx': 0, 'recy': 0, 'recr': 0, 'b1x': 200, 'b1y': 200, 'b2x': 300, 'b2y': 300 },
		{"value": mainCfg.numOfSec, "name": "10s", 'recx': 0, 'recy': 0, 'recr': 0}
	];
	
	function playAnimation(){
		var secCounter = 0;
		Timeline.movePlayingLine();
		$('#play-animation-btn').prop('disabled', true);

		mainCfg.fps = $("#fps-input").val();

		interpolation.loadData(keyframes, mainCfg.interpoltaionMethod);

		mainCfg.time = setInterval(function(){
			secCounter += 1000/mainCfg.fps;
			if(secCounter >= mainCfg.numOfSec) {
				stopPlaying();
			} else {
				// get square
				position = interpolation.getPosition(secCounter);
				Screen.redraw(position);
			}
		}, 1000/mainCfg.fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
		clearInterval(mainCfg.time);
		$('#play-animation-btn').prop('disabled', false);
		Screen.redrawKeyframe();
	}

	$("#timeline-wrapper").on("click", ".timeline-circle", function(evt) {
		Timeline.activateKeyframe($(this), keyframes);
		Screen.redrawKeyframe();
	});

	$("#timeline-wrapper").on("click", ".timeline-line", function(evt) {
		Timeline.addNewCircle(evt);
		Screen.redrawKeyframe();
	});

	$('#play-animation-btn').click(function(){
		playAnimation();
	});
	   
	Timeline.redraw(keyframes);
	Screen.redrawKeyframe();

	$('#remove-keyframe-btn').click(function(){
		if(mainCfg.activeKeyframeIndex != 0 && mainCfg.activeKeyframeIndex != 1){
			keyframes.splice(mainCfg.activeKeyframeIndex, 1);
			mainCfg.activeKeyframeIndex = 0;
			Timeline.redraw(keyframes);
			Screen.redrawKeyframe();
		}
	});

	$("#interpolation input[type='radio']").change(function(e){
		mainCfg.interpoltaionMethod = $("#interpolation input[type='radio']:checked").val();
		Screen.redrawKeyframe();

	});
});

