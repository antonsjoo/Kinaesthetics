const synth = new Tone.Synth().toDestination();
const osc = new Tone.Oscillator().toDestination();
var flag = 0;
var globalSpeed;
var globalDistance = 0;
var freezeState;

class Rubberband {
    constructor(freezeState, minDistance,globalSpeed){
        this.freezeState = freezeState;
        this.minDistance = minDistance;
        this.globalSpeed = globalSpeed;
    }

    stretch() {
        osc.frequency.value = globalDistance;
        //Initiating a note if you put your wrists together and there's no band
        if(globalDistance < 110 && flag <= 0){
            osc.start();
        }
        if(globalDistance >= this.freezeState){
            flag = 1;
        }
        if(flag == 1){
            osc.frequency.value = this.freezeState;
        }
        if(flag == 1 && globalDistance < 110){
            flag = 0;
            osc.start();
        }
        
        if(speed > breakingPoint) {
            console.log('Oh crap! It snapped!!');
        }
    }

    spawn(){
       /* if(globalDistance >= this.freezeState){
         osc.start();
         osc.frequency.value = 0;
        }
        if(globalDistance < 110 && flag <= 0){
            osc.start();
            osc.frequency.value = globalDistance;
        }
        */

        osc.start()
        osc.frequency.value = globalDistance;
    }
}

const rubberband = new Rubberband(360,100,globalSpeed);
const bodies = new BodyStream ({
    posenet: posenet,
    architecture: modelArchitecture.ResNet50, 
    detectionType: detectionType.singleBody,
    outputStride: 16, 
    videoElement: document.getElementById('video'), 
    samplingRate: 67.5});
    
let body;

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
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right Eye
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()


        ctx.beginPath();
        ctx.moveTo(leftWrist.position.x,leftWrist.position.y);
        ctx.lineTo(rightWrist.position.x,rightWrist.position.y, 150);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'white'
        ctx.stroke();
    }
    requestAnimationFrame(drawCameraIntoCanvas)
}

/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();