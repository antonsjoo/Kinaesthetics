
const pingPong = new Tone.PingPongDelay("32n", 0.5).toDestination();

const synth = new Tone.MonoSynth({
	oscillator: {
		type: "sine"
	},
	envelope: {
        attack: 0.1,
       // release: 0.1,
        //sustain: 0.1
	}
}).toDestination();

const brokenSynth = new Tone.MonoSynth({
	oscillator: {
		type: "sine"
	},
	envelope: {
        attack: 0.1,
       // release: 0.1,
        //sustain: 0.1
	}
}).connect(pingPong);

//const filter = new Tone.Filter(globalDistance, "lowpass").toDestination();
const autoFilter = new Tone.AutoFilter('10n').toDestination().stop();
const indicatorSynth = new Tone.Noise().connect(autoFilter).stop();
autoFilter.stop();
indicatorSynth.stop();
//const LFO = new Tone.LFO('4n', 400, 4000).connect(filter).start();


const now = Tone.now()

var flag = 0;
var globalSpeed;
var globalDistance = 0;
var freezeState;
let noteArray = ['B#5', 'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5', 'E#5', 'E5', 'D#5', 'D5', 'C#5', 'C5', 'B#4', 'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E#4', 'E4', 'D#4', 'D4', 'C#4', 'C4'];
let breakingArray = ["A4","D#4","A5","D#5"];
var minDistance = 60;
var maxDistance = 480;
var breakingSpeed = 550;
var breakingDistance = maxDistance + 30;
var distRange = maxDistance - minDistance;
var distStep = distRange / noteArray.length;
var broken = false;
let decreaseStretch;
let indicator;
let counter = 0;

class Rubberband {
    constructor(freezeState, minDistance,globalSpeed) {
        this.freezeState = freezeState;
        this.minDistance = minDistance;
        this.globalSpeed = globalSpeed;
    }



    stretch() {
      autoFilter.stop();
      indicatorSynth.stop();

      //filter.frequency.value = 0;

        const leftWrist = body.getBodyPart(bodyParts.leftWrist);
        const leftWristY = Math.round(leftWrist.position.y);

        // reset
        if (globalDistance < minDistance - 10) {
            broken = false;
        }
////  nneeww  coommmenntt
        // tone selection

        // broken cord
        if ((globalDistance > breakingDistance) && !broken) {
            for(let times = 0; times < 3; times++) {
                for(let i = 0; i < breakingArray.length; i++) {
                    brokenSynth.triggerAttackRelease(breakingArray[i], '16n');   
                    for(let j = 0; j < 500; j++) {
                        console.log('Wasting time');
                    }
                }
            }     
            broken = true;
            counter = 0;
        } else {
            if(!broken) {
                for(let i = 0; i < noteArray.length; i++) {
                    if(globalDistance < (minDistance + (distStep * i))) {
                        synth.triggerAttackRelease(noteArray[i], '28n');

                        if (leftWristY <= 190){
                            flag = 1;
                            freezeState = noteArray[i];
                        }
                        if(flag == 1){
                            synth.triggerAttackRelease(freezeState);
                        }
                        if(flag == 1 && globalDistance < (minDistance + (distStep * i))){
                        flag = 0;
                        broken = true
                        }

                        //Creating states for the "warming up" of the note:

                        //indicate that the breaking limit is close:
                        if(counter <= 1 && globalDistance >= 150){
                          autoFilter.start();
                          indicatorSynth.start();
                          //autoFilter.frequency.value = 600;
                          synth.triggerAttackRelease(noteArray[i], '28n')
                          console.log("S1");
                          counter = 1;
                          console.log(counter);
                        }
                        //If the breaking limit is exceeded the note will break and go back to the start:
                        if (counter == 1 && globalDistance >= 180){
                          for(let i = 0; i < breakingArray.length; i++) {
                            brokenSynth.triggerAttackRelease(breakingArray[i], '16n');   
                            for(let j = 0; j < 500; j++) {
                                console.log('Wasting time');
                            }
                          }
                          counter = 0;
                          console.log(counter);
                          broken = true;
                        }

                        //If you let the note rest through decreasing the distance a bit it becomes more stretchable (moves to state 2)
                        if(counter == 1 && globalDistance < 140){
                          counter = 2;
                          console.log(counter);
                          autoFilter.stop();
                          indicatorSynth.stop();
                        }

                        if(counter <= 3 && globalDistance >= 200){
                          autoFilter.start();
                          indicatorSynth.start();
                          //autoFilter.frequency.value = 600;
                          synth.triggerAttackRelease(noteArray[i], '28n')
                          console.log("S2");
                          counter = 3;
                          console.log(counter);
                        }
                        if(counter == 3 && globalDistance >= 230){
                          for(let i = 0; i < breakingArray.length; i++) {
                            brokenSynth.triggerAttackRelease(breakingArray[i], '16n');   
                            for(let j = 0; j < 500; j++) {
                                console.log('Wasting time');
                            }
                          }
                          counter = 0;
                          console.log(counter);
                          autoFilter.stop();
                          indicatorSynth.stop();
                        }
                        if(counter == 3 && globalDistance < 190){
                          counter = 4;
                          console.log(counter);
                        }

                        if(counter <= 5 && globalDistance >= 250){
                          autoFilter.start();
                          indicatorSynth.start();
                          //autoFilter.frequency.value = 600;
                          synth.triggerAttackRelease(noteArray[i], '28n')
                          console.log("S3");
                          counter = 5;
                          console.log(counter);
                        }
                        if (counter == 5 && globalDistance >= 280){
                          for(let i = 0; i < breakingArray.length; i++) {
                            brokenSynth.triggerAttackRelease(breakingArray[i], '16n');   
                            for(let j = 0; j < 500; j++) {
                                console.log('Wasting time');
                            }
                          }
                          counter = 0;
                          console.log(counter);
                        }

                        if(counter == 5 && globalDistance < 240){
                          counter = 6;
                          console.log(counter);
                          autoFilter.stop();
                          indicatorSynth.stop();
                        }                        

                        break;
                    }
                }
            }
        }  
    }

}
const rubberband = new Rubberband(freezeState, 100, globalSpeed);
const bodies = new BodyStream ({
    posenet: posenet,
    architecture: modelArchitecture.MobileNetV1, 
    detectionType: detectionType.singleBody, 
    videoElement: document.getElementById('video'), 
    samplingRate: 67.5})
    
let body;

/*if(globalDistance < 500){
newRubberband();
}
function newRubberband() {
  
  const rubberBand2 = new Rubberband(450,100,globalSpeed)
}*/


bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0);
    const rightWrist = body.getBodyPart(bodyParts.rightWrist);
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist));
    globalDistance = distance;
    document.getElementById('output').innerText = `Distance between Eyes: ${distance}`;
    body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist);
    speed = rightWrist.speed.absoluteSpeed;
    globalSpeed = speed;

    
    rubberband.stretch();  
});



// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// draw the video, nose and Eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right Eye
        const leftWrist = body.getBodyPart(bodyParts.leftWrist);
        const rightWrist = body.getBodyPart(bodyParts.rightWrist);



        // draw left Eye
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // draw right Eye
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();


        ctx.beginPath();
        ctx.moveTo(leftWrist.position.x,leftWrist.position.y);
        ctx.lineTo(rightWrist.position.x,rightWrist.position.y, 150);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
    requestAnimationFrame(drawCameraIntoCanvas);
}

/* ----- run ------ */

// start body detecting 
bodies.start();
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();