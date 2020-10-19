let osc, playing, freq, amp;

function setup() {
  osc = new p5.Oscillator('sine');
}

function draw() {
  freq = globalDistance;
  amp = 10;

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
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



const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})
    
let body

bodies.addEventListener('bodiesDetected', (e) => {
    
    body = e.detail.bodies.getBodyAt(0)
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftEye, bodyParts.rightEye))
    globalDistance = distance;
    document.getElementById('output').innerText = `Distance between Eyes: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftEye, bodyParts.rightEye)

    console.log(distance);
    
    
    if (distance < 100) playOscillator();
    
    
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
        const leftEye = body.getBodyPart(bodyParts.leftEye)
        const rightEye = body.getBodyPart(bodyParts.rightEye)



        // draw left Eye
        ctx.beginPath();
        ctx.arc(leftEye.position.x, leftEye.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right Eye
        ctx.beginPath();
        ctx.arc(rightEye.position.x, rightEye.position.y, 10, 0, 2 * Math.PI);
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