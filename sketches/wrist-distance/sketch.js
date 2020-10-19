
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio(); ssdsd

  let mySound;
  function preload() {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('song.mp3');
  }
  
  function setup() {
  }
  
  function playSound() {
    // playing a sound file on a user gesture
    // is equivalent to `userStartAudio()`
    mySound.setVolume(bodyDistance)
    mySound.play();
  }
 

var bodyDistance;
var posX = 0;
var posY = 0;
var posX2 = 0;
var posY2 = 0;
var globalDistance = 0;
function setup(){

  createCanvas(400,400);
  ctx.translate(canvas.width,0)
ctx.scale(-1,1)
}
function draw(){

  
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  clear();
  ellipse(posX, posY, 20, 20);
  ellipse(posX2, posY2, 20, 20);
  textSize(32);
  
  
}


const bodies = new BodyStream ({
      posenet: posenet,
      architecture: modelArchitecture.MobileNetV1, 
      detectionType: detectionType.multipleBodies, 
      videoElement: document.getElementById('video'), 
      samplingRate: 250})   
let body;
let body2
let speed;
bodies.addEventListener('bodiesDetected', (e) => {
  body = e.detail.bodies.getBodyAt(0)
  body2 = e.detail.bodies.getBodyAt(1)
  const leftEye = body.getBodyPart(bodyParts.leftEye)
  const rightEye = body.getBodyPart(bodyParts.rightEye)
  const rightEye2 = body2.getBodyPart(bodyParts.rightEye)
  
    const distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.rightEye2, bodyParts.rightEye));
    globalDistance = distance;
    document.getElementById('output').innerText = `Position: ${distance}`
    speed = rightEye.speed.absoluteSpeed
    console.log(distance);
    posX = Math.round(rightEye.position.x)
    posY = Math.round(rightEye.position.y)
<<<<<<< HEAD
    posX2 = Math.round(rightEye2.position.x)
    posY2 = Math.round(rightEye2.position.y)
    //bodyDistance = distance/500;
    /*if(bodyDistance > 1){
      bodyDistance = 1;
    }
    else if(bodyDistance < 0){
      bodyDistance = 0;
    }*/
=======

    bodyVolume = posX/560;
    if(bodyVolume > 1){
      bodyVolume = 1;
    }
    else if(bodyVolume < 0){
      bodyVolume = 0;
    }
playSound();
>>>>>>> d4a6c022b34212459670997b1b63ea5e325585b0
})






// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.translate(canvas.width,0)
ctx.scale(-1,1)

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    //ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right wrist
        //const rightEye2 = body2.getBodyPart(bodyParts.rightEye)
        const rightEye = body.getBodyPart(bodyParts.rightEye)
        const rightEye2 = body2.getBodyPart(bodyParts.rightEye)
        // draw right eye 2
        ctx.beginPath();
        ctx.arc(rightEye2.position.x, rightEye2.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        
        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightEye.position.x, rightEye.position.y, 5, 0, 2 * Math.PI);
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
