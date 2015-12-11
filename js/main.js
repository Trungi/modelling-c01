$( document ).ready(function() {
	var fps = 1;
	var numOfSec = 10000;
	var time;
	var widthOfTimeline = 500;
	var widthOfTimelineCircle = 20;


	var nonDatedata = [
		{"value": 0, "name": "0s" },
		{"value": numOfSec, "name": "10s" }
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

    $("#timeline-wrapper").on( "click", ".timeline-event", function(evt) {
 		console.log("click na keyframe");
 		console.log($(this));
 		
 		// backend.addKeyFrame(10,10,10,10);
	});

	$("#timeline-wrapper").on( "click", ".timeline-line", function(evt) {
 		console.log("click na line");
 		console.log($(this));

 		var e = evt.target;
        var dim = e.getBoundingClientRect();
        var x = evt.clientX - dim.left;
        var y = evt.clientY - dim.top;
        console.log("x: "+x);
        console.log("x: "+((x*numOfSec)/widthOfTimeline)+" y:"+y);
        nonDatedata.push({"value": ((x*numOfSec)/widthOfTimeline), "name": (x/numOfSec/10)+"s" });
        redrawTimeline();
	});

    playAnimation();
});

