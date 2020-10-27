let osc, playing, freq, amp;

function easeOutElastic(x){
  const c4 = (2 * Math.PI) / 3;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

function setup() {
  osc = new p5.Oscillator('sine');
}

function draw() {
  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }
  let globalDistance;
  let maxDistance = 480;
  let maxFreq = 1000;
  let normalizedDistance = globalDistance/maxDistance;
  let easedDistance = easeOutElastic(normalizedDistance);
  amp = 10;
  let freq = easedDistance * maxFreq;

/*if(freq > 1){
  freq = 1;
} else if(freq < 0){
  freq = 0;
}*/

  function playOsc(){
    osc.start()
  }
  
  playOsc();
  
  console.log(freq);

  osc.frequency.value = freq;
}



/*function playOscillator() {
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

function logMe(){
  console.log(globalDistance);
}

logMe();*/

const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 67.5})
    
let body

bodies.addEventListener('bodiesDetected', (e) => {
    
    body = e.detail.bodies.getBodyAt(0)
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
    globalDistance = distance;
    document.getElementById('output').innerText = `Distance between wrists: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist)
  
    /*if (distance < 100) playOscillator();*/
    
    
})



// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right wrist
        const leftWrist = body.getBodyPart(bodyParts.leftWrist)
        const rightWrist = body.getBodyPart(bodyParts.rightWrist)



        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 5, 0, 2 * Math.PI);
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