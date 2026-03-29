/* sketch.js - DEBUG VERSION */
let song, fft;
let status = "Initializing...";
let isError = false;

function preload() {
  status = "Searching for phonk.mp3...";
  // Check: Is it phonk.mp3 or phonk.MP3? It must be exact.
  song = loadSound('phonk.mp3', 
    () => { status = "Success! Tap to start."; },
    (err) => { 
      status = "ERROR: Cannot find phonk.mp3 on the server."; 
      isError = true;
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.8, 128);
}

function draw() {
  background(0);

  // Status Display
  textAlign(CENTER);
  textSize(20);
  if (isError) {
    fill(255, 0, 0); // Red for error
  } else {
    fill(0, 255, 255); // Cyan for loading
  }
  text(status, width/2, height/2 + 100);

  if (status === "Success! Tap to start.") {
    let bass = fft.getEnergy("bass");
    translate(width/2, height/2);
    let bounce = map(bass, 100, 255, 1, 1.3);
    scale(bounce);
    stroke(0, 255, 255);
    strokeWeight(4);
    noFill();
    ellipse(0, -80, 50, 60); // Simple head for testing
    rect(-25, -50, 50, 100, 10); // Simple body
  }
}

function mousePressed() {
  // Try to force audio start
  userStartAudio().then(() => {
    if (song && song.isLoaded() && !song.isPlaying()) {
      song.play();
      let overlay = document.getElementById('overlay');
      if (overlay) overlay.style.display = 'none';
      status = "DRIFTING...";
    }
  });
}
