let song, fft;
let isLoaded = false;
let isPlaying = false;

function preload() {
    // 1. CHECK FILENAME: Ensure your file on GitHub is exactly "phonk.mp3"
    // If it is "Phonk.mp3", change the line below to match!
    song = loadSound('phonk.mp3', 
        () => { isLoaded = true; console.log("Music Ready!"); },
        (err) => { console.error("Check your filename on GitHub!", err); }
    );
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT(0.8, 128);
}

function draw() {
    background(0, 0, 15, 40);

    // If music isn't loaded yet, don't try to animate
    if (!isLoaded) return;

    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass");

    if (isPlaying) {
        translate(width / 2, height / 2);
        
        // Simple pulsing core to test if it's working
        let s = map(bass, 0, 255, 100, 300);
        stroke(0, 255, 255);
        strokeWeight(5);
        noFill();
        ellipse(0, 0, s, s);
        
        // Character bounce
        push();
        let bounce = map(bass, 150, 255, 1, 1.3);
        scale(bounce);
        line(0, -50, 0, 50); // Body
        ellipse(0, -70, 30, 30); // Head
        pop();
    }
}

function mousePressed() {
    // Only play if the file is finished loading
    if (isLoaded) {
        if (!isPlaying) {
            song.play();
            isPlaying = true;
            // This hides the "TAP TO START" text from your HTML
            let overlay = document.getElementById('overlay');
            if(overlay) overlay.style.display = 'none';
        } else {
            song.pause();
            isPlaying = false;
        }
    } else {
        alert("Music is still loading... wait 5 seconds and try again.");
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
