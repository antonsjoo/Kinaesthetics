let osc, playing, freq, amp;

function setup() {
  osc = new p5.Oscillator('sine');
}

function draw() {
  freq = globalDistance;
  amp = 10;
 console.log(globalDistance);
  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0);
    osc.amp(amp, 0);
  }
}



function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  if (globalDistance > 400) {
      playing = false;
      osc.stop();
  }
  //Initiating a note
  if (globalDistance < 100){
    if(!playing){
        osc.start();
        playing = true;
    }
  }
}



function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  playing = false;
}


var globalDistance = 0;

function logMe(){
  console.log(globalDistance);
}

logMe();

const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})
    
let body
let speed

bodies.addEventListener('bodiesDetected', (e) => {
    
    body = e.detail.bodies.getBodyAt(0)
    const leftWrist = body.getBodyPart(bodyParts.leftWrist);
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
    globalDistance = distance;
    document.getElementById('output').innerText = `Distance between wrists: ${distance}`
    speed = Math.round(leftWrist.speed.absoluteSpeed)   
    document.getElementById('speed').innerText = `Speed of left wrist: ${speed}`
    
    //Make the note snap if you go too fast when stretching it
    if (speed > distance){
        playing = false;
        osc.stop();
    } else {
        playOscillator();
    }
    
    
})



// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    
    
    if (body) {
        ctx.clearRect(0, 0, video.width, video.height)

        //ctx.drawImage(video, 0, 0, video.width, video.height);
        // draw circle for left and right wrist
        const leftWrist = body.getBodyPart(bodyParts.leftWrist)
        const rightWrist = body.getBodyPart(bodyParts.rightWrist)

        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'black'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'black'
        ctx.fill()
    }
    requestAnimationFrame(drawCameraIntoCanvas)
}

/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();


