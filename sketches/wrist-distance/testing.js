
const synth = new Tone.Synth().toDestination();
const osc = new Tone.Oscillator().toDestination();
var flag = 0;
var globalSpeed;
var globalDistance = 0;
var freezeState = 0;
let decreaseStretch;
let maxDistance = 480;
var globalDistance = 0;
let maxFreq = 1000;
let frequency = easeInOutElastic(globalDistance/maxDistance) * maxFreq;

function easeInOutElastic(x){
    const c5 = (2 * Math.PI) / 4.5;
    
    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

console.log(frequency);

class Rubberband  {
    constructor(freezeState, minDistance,globalSpeed){
    this.freezeState = freezeState
    this.minDistance = minDistance
    this.globalSpeed = globalSpeed
    }

    stretch(){
    osc.frequency.value = frequency;
    //Initiating a note if you put your wrists together and there's no band
    const leftWrist = body.getBodyPart(bodyParts.leftWrist);
    const leftWristY = Math.round(leftWrist.position.y);

        if(globalDistance < 110 && flag <= 0){
            osc.start();
        }
        if (leftWristY <= 190){
            flag = 1;
            freezeState = globalDistance;
        }
        if(flag == 1){
            osc.frequency.value = freezeState;
        }
        if(flag == 1 && globalDistance < 110){
            flag = 0;
            osc.start()
        }
    }
}

const rubberband = new Rubberband(freezeState,100,globalSpeed)
const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 67.5})
    
let body

/*if(globalDistance < 500){
newRubberband();
}
function newRubberband() {
  
  const rubberBand2 = new Rubberband(450,100,globalSpeed)
}*/


bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0)
    const rightWrist = body.getBodyPart(bodyParts.rightWrist)
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
    globalDistance = distance;
    document.getElementById('output').innerText = `Distance between Eyes: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist)
    speed = rightWrist.speed.absoluteSpeed;
    globalSpeed = speed;
    //rightWristY = rightWrist.position.y;
    
    //trying to figure out a way to see if the current Y position of the wrist went up compared to the previous Y position of the wrist in the last 10 ms?
    
    /*wristY = Math.round(rightWrist.position.y);
    wristUp = wristY - 100;*/

    
    rubberband.stretch();
    
})



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
        const leftWrist = body.getBodyPart(bodyParts.leftWrist)
        const rightWrist = body.getBodyPart(bodyParts.rightWrist)



        // draw left Eye
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right Eye
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()
    }
    requestAnimationFrame(drawCameraIntoCanvas)
}

/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();