/* sketch.js */
let song, fft;
let isLoaded = false;

function preload() {
    // This looks for the phonk.mp3 file in your main GitHub folder
    song = loadSound('phonk.mp3', 
        () => { 
            isLoaded = true; 
            console.log("Audio successfully synchronized."); 
        },
        (err) => { 
            console.error("Loading failed. Check if the file is named phonk.mp3 on GitHub."); 
        }
    );
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Smooths the movement so the anime character doesn't jitter
    fft = new p5.FFT(0.8, 128); 
}

function draw() {
    // Deep dark background with motion blur for that "drift" look
    background(5, 0, 15, 45);

    if (!isLoaded) {
        fill(0, 255, 255);
        textAlign(CENTER);
        textSize(16);
        text("SYSTEM: DOWNLOADING VIBE...", width / 2, height / 2);
        return;
    }

    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass");
    let treble = fft.getEnergy("treble");

    // Move to the center of the screen
    translate(width / 2, height / 2);

    // 1. THE DANCER MOTION
    // Character grows and shrinks based on the bass kick
    let bounce = map(bass, 100, 255, 0.8, 1.5);
    scale(bounce);
    
    // Neon Glow Effect
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = color(0, 255, 255);
    stroke(0, 255, 255);
    strokeWeight(4);
    noFill();

    // Head
    ellipse(0, -80, 50, 60);
    
    // Body (Reacts to high frequencies)
    let bodyWarp = map(treble, 0, 255, -15, 15);
    beginShape();
    vertex(-30 + bodyWarp, -50);
    vertex(30 + bodyWarp, -50);
    vertex(20, 70);
    vertex(-20, 70);
    endShape(CLOSE);

    // Arms
    line(-25 + bodyWarp, -20, -70, 20);
    line(25 + bodyWarp, -20, 70, 20);
}

function mousePressed() {
    // Browsers require a "user gesture" (a tap) to start audio
    if (isLoaded) {
        userStartAudio(); 
        
        if (song.isPlaying()) {
            song.pause();
        } else {
            song.play();
            // Hides the "PHONK PROJECT" text once music starts
            let overlay = document.getElementById('overlay');
            if (overlay) overlay.style.display = 'none';
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
      this.x = random(-width, width);
      this.y = random(-height, height);
    }
  }
  show() {
    fill(255, 200);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, 5, 0);
    ellipse(sx, sy, r, r);
  }
}

function mousePressed() {
  if (isLoaded) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
      let overlay = document.getElementById('overlay');
      if (overlay) overlay.style.display = 'none';
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
    }
  }
  show() {
    fill(255, 180);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, 6, 0);
    ellipse(sx, sy, r, r);
  }
}

function mousePressed() {
  if (isLoaded) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
      // Auto-hide the "TAP" message from index.html
      let overlay = document.getElementById('overlay');
      if (overlay) overlay.style.display = 'none';
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
