let song, fft;
let isLoaded = false;
let particles = [];

function preload() {
  // Now that phonk.mp3 is in your main GitHub folder, this will connect!
  song = loadSound('phonk.mp3', 
    () => { isLoaded = true; },
    (err) => { console.error("Audio failed. Check if filename is lowercase!"); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.85, 128); // Smooth movement for anime style
  
  // Create drifting "Speed Lines" in the background
  for (let i = 0; i < 100; i++) {
    particles.push(new DriftParticle());
  }
}

function draw() {
  // Deep dark background with motion trails
  background(5, 0, 15, 45);

  if (!isLoaded) {
    fill(0, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("SYSTEM: SYNCHRONIZING VIBE...", width/2, height/2);
    return;
  }

  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // 1. BACKGROUND DRIFT (Reacts to the speed of the song)
  for (let p of particles) {
    p.update(treble);
    p.show();
  }

  // 2. THE BASS SHAKE (Camera shakes on heavy kicks)
  if (bass > 220) {
    translate(random(-10, 10), random(-10, 10));
  } else {
    translate(width / 2, height / 2);
  }

  // 3. THE ANIME DANCER
  let bounce = map(bass, 120, 255, 0.85, 1.6);
  push();
  scale(bounce);
  
  // High-End Glow Texture
  drawingContext.shadowBlur = 35;
  drawingContext.shadowColor = color(0, 255, 255);
  
  stroke(0, 255, 255); // Neon Cyan
  strokeWeight(5);
  noFill();

  // Head (Bobs to the melody)
  let bob = sin(frameCount * 0.15) * 15;
  ellipse(0, -90 + bob, 50, 65);

  // Mask Eyes (Glowing Slits)
  line(-15, -100 + bob, -5, -90 + bob);
  line(15, -100 + bob, 5, -90 + bob);

  // Body Trunk (Warps with the rhythm)
  let warp = map(mid, 0, 255, -20, 20);
  beginShape();
  vertex(-45 + warp, -45);
  vertex(45 + warp, -45);
  vertex(25, 100);
  vertex(-25, 100);
  endShape(CLOSE);

  // Dancing Arms (Swing to high frequencies/cowbells)
  let armSwing = map(treble, 0, 255, 0, 100);
  line(-35, -30, -80 - armSwing/2, 30 + armSwing);
  line(35, -30, 80 + armSwing/2, 30 - armSwing);
  pop();

  // 4. CRT SCANLINE EFFECT
  stroke(255, 10);
  strokeWeight(1);
  for (let i = -height; i < height; i += 10) {
    line(-width, i, width, i);
  }
}

// Particle Class for the highway drift look
class DriftParticle {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
  }
  update(treble) {
    let speed = map(treble, 0, 255, 2, 30);
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
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
