$( document ).ready(function() {
	var fps = 1;
	var numOfSec = 3000;
	var time;

	var nonDatedata = [
		{"value": 50, "name": "Player 1" },
		{"value": 249, "name": "Player 2" },
		{"value": 297, "name": "Player 3" },
		{"value": 388, "name": "Player 4" },
		{"value": 397, "name": "Player 5" },
		{"value": 418, "name": "Player 6" }
	];
	
	function playAnimation(){
		var secCouner = 0;
		time = setInterval(function(){
			secCouner += 1000/fps;
			if(secCouner >= numOfSec) stopPlaying();
			redrawTimeline();
		}, 1000/fps);
	}
	
	function stopPlaying() {
		console.log("stop playing !");
    	clearInterval(time);
    }

    function redrawTimeline(){
		$('#timelineNonDate').empty();

		TimeKnots.draw("#timelineNonDate", nonDatedata, {dateDimension:false, color: "teal", width:500, showLabels: true, labelFormat: "%Y"});
    }

    $("#timeline-wrapper").on( "click", ".timeline-event", function() {
 		console.log("click na keyframe");
 		console.log($(this));
 		backend.addKeyFrame(10,10,10,10);
	});

	$("#timeline-wrapper").on( "click", ".timeline-line", function() {
 		console.log("click na line");
 		console.log($(this));
	});

    playAnimation();
});

