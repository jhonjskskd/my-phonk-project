let song, fft;
let isLoaded = false;
let particles = [];

function preload() {
  // FIXED PATH: This looks inside your "PhonkProject" folder
  // If you move the file to the main folder later, just remove "PhonkProject/"
  song = loadSound('PhonkProject/phonk.mp3', 
    () => { isLoaded = true; },
    (err) => { console.error("Could not find phonk.mp3 in PhonkProject folder"); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.9, 128); // High smoothing for fluid anime-style motion
  
  // Create Starfield for the "Speeding" texture
  for (let i = 0; i < 150; i++) {
    particles.push(new Star());
  }
}

function draw() {
  // Dark Navy/Black background with "Ghosting" effect
  background(5, 0, 15, 40);

  if (!isLoaded) {
    fill(0, 255, 255);
    textAlign(CENTER);
    textSize(20);
    text("LOADING PHONK VIBE...", width/2, height/2);
    return;
  }

  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // 1. THE "DRIFT" BACKGROUND (Reacts to High-hats/Treble)
  for (let s of particles) {
    s.update(treble);
    s.show();
  }

  // 2. THE BASS SHAKE (Rhymes with the Kick Drum)
  if (bass > 210) {
    translate(random(-12, 12), random(-12, 12));
  }

  translate(width / 2, height / 2);

  // 3. THE ANIME DANCER (Shadow Silhouette)
  let bounce = map(bass, 100, 255, 0.9, 1.7); // Bounces to bass
  let tilt = map(mid, 0, 255, -0.1, 0.1); // Tilts to melody
  
  push();
  rotate(tilt);
  scale(bounce);
  
  // Neon "Outer Glow" Texture
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = color(180, 0, 255); // Purple Glow
  
  stroke(0, 255, 255); // Cyan Core
  strokeWeight(4);
  noFill();
  
  // DRAWING THE CHARACTER
  // Head (Bobs with the beat)
  let bob = sin(frameCount * 0.15) * 10;
  ellipse(0, -90 + bob, 50, 60); 
  
  // Mask/Eyes (Anime style)
  line(-15, -95 + bob, -5, -85 + bob);
  line(15, -95 + bob, 5, -85 + bob);

  // Body & Shoulders
  beginShape();
  vertex(-40, -40);
  vertex(40, -40);
  vertex(20, 80);
  vertex(-20, 80);
  endShape(CLOSE);

  // Arms (Swinging to the cowbell/treble)
  let armSwing = map(treble, 0, 255, 0, 100);
  line(-35, -30, -70 - armSwing/2, 20 + armSwing); // Left
  line(35, -30, 70 + armSwing/2, 20 + armSwing);  // Right
  pop();

  // 4. CRT SCANLINE TEXTURE
  stroke(255, 10);
  strokeWeight(1);
  for (let i = -height; i < height; i += 8) {
    line(-width, i, width, i);
  }
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
  }
  update(treble) {
    let speed = map(treble, 0, 255, 2, 35);
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
