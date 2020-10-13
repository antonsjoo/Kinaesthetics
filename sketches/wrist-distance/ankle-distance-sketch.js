// @ts-nocheck


/* ----- setup ------ */

// sets up a bodystream with configuration object


let monoSynth;

function setup() {
  let cnv = createCanvas(100, 100);
  cnv.mousePressed(playSynth);
  background(220);
  textAlign(CENTER);
  text('tap to play', width/2, height/2);

  monoSynth = new p5.MonoSynth();
}

function playSynth() {
  userStartAudio();

  let note = random(['Fb4', 'G4']);
  // note velocity (volume, from 0 to 1)
  let velocity = random();
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;

  monoSynth.play(note, velocity, time, dur);
}





const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.singleBody, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})
    
let body

bodies.addEventListener('bodiesDetected', (e) => {
    body = e.detail.bodies.getBodyAt(0)
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftAnkle, bodyParts.rightAnkle))
    document.getElementById('output').innerText = `Distance between wrists: ${distance}`
    body.getDistanceBetweenBodyParts(bodyParts.leftAnkle, bodyParts.rightAnkle)

    if(bodies.distance > ){


        console.log("works");
                }
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
        const leftAnkle = body.getBodyPart(bodyParts.leftAnkle)
        const rightAnkle = body.getBodyPart(bodyParts.rightAnkle)

        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftAnkle.position.x, leftAnkle.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightAnkle.position.x, rightAnkle.position.y, 10, 0, 2 * Math.PI);
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