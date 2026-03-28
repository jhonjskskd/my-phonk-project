let song, fft;
let particles = [];
let isPlaying = false;

function preload() {
    // Looks for your phonk.mp3 in the same folder
    song = loadSound('phonk.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT(0.8, 128); // 0.8 smoothing for fluid movement
    
    // Initialize drift particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    // Dark background with trail effect for "motion blur"
    background(0, 0, 10, 35);

    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass");
    let mid = fft.getEnergy("mid");
    let treble = fft.getEnergy("treble");

    // 1. BACKGROUND DRIFT (Moves faster with music)
    for (let p of particles) {
        p.update(treble);
        p.show();
    }

    // 2. SCREEN SHAKE (Heavy Bass Drop)
    if (bass > 215) {
        translate(random(-8, 8), random(-8, 8));
    }

    translate(width / 2, height / 2);

    // 3. THE DANCING CHARACTER
    // Bounce scale maps the Bass to size
    let bounce = map(bass, 120, 255, 0.85, 1.4);
    push();
    scale(bounce);
    
    // Character Styling (Neon Magenta)
    stroke(255, 0, 255, 220);
    strokeWeight(6);
    noFill();

    // Head (Bobs to the melody)
    let headBob = map(mid, 0, 255, -5, 15);
    ellipse(0, -70 + headBob, 45, 45);

    // Body (Solid trunk)
    line(0, -45 + headBob, 0, 70);

    // Arms (Swing smoothly to the rhythm)
    let armSwing = sin(frameCount * 0.15) * 50;
    line(0, -20, -60, armSwing);
    line(0, -20, 60, -armSwing);
    
    // Legs (V-shape stance)
    line(0, 70, -30, 130);
    line(0, 70, 30, 130);
    pop();

    // 4. VHS GLITCH (Occasional line flashes)
    if (random(1) > 0.97 || bass > 235) {
        stroke(255, 100);
        strokeWeight(1);
        line(-width, random(-height, height), width, random(-height, height));
    }
}

// Particle Class for the Speeding/Drift effect
class Particle {
    constructor() {
        this.x = random(-width, width);
        this.y = random(-height, height);
        this.z = random(width);
    }
    update(treble) {
        let speed = map(treble, 0, 255, 2, 25);
        this.z -= speed;
        if (this.z < 1) {
            this.z = width;
            this.x = random(-width, width);
            this.y = random(-height, height);
        }
    }
    show() {
        fill(0, 255, 255, 180); // Cyan particles
        noStroke();
        let sx = map(this.x / this.z, 0, 1, 0, width);
        let sy = map(this.y / this.z, 0, 1, 0, height);
        let r = map(this.z, 0, width, 6, 0);
        ellipse(sx, sy, r, r);
    }
}

// Control function to start the vibe
function mousePressed() {
    if (!isPlaying) {
        song.play();
        let overlay = document.getElementById('overlay');
        overlay.classList.add('hidden'); // Hide the "Tap to Start" text
        isPlaying = true;
    } else {
        song.pause();
        isPlaying = false;
    }
}

// Keeps it perfect on mobile/desktop screen resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

