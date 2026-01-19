/* ===============================
   SCENE 6 – RIP MEMORY + MIRROR
   =============================== */

const noiseCanvas = document.getElementById("noise");
const nctx = noiseCanvas.getContext("2d");

const mirror = document.getElementById("mirror");
const mctx = mirror.getContext("2d");

const video = document.getElementById("webcam");
const black = document.getElementById("black");
const text = document.getElementById("final-text");

noiseCanvas.width = mirror.width = window.innerWidth;
noiseCanvas.height = mirror.height = window.innerHeight;

let frame = 0;
let glitchPower = 0;

/* ===============================
   WEBCAM
   =============================== */
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    console.log("Webcam access denied");
  });

/* ===============================
   DRAW LOOP
   =============================== */
function draw() {
  frame++;

  /* ===== GLITCH POWER ===== */
  if (glitchPower < 12) glitchPower += 0.03;

  /* ===============================
     NOISE (WHITE → RED)
     =============================== */
  let img = nctx.createImageData(noiseCanvas.width, noiseCanvas.height);
  let data = img.data;

  let redAmount = Math.min(frame / 200, 1);

  for (let i = 0; i < data.length; i += 4) {
    let v = Math.random() * 255;

    data[i]     = v + redAmount * 120; // R
    data[i + 1] = v * (1 - redAmount); // G
    data[i + 2] = v * (1 - redAmount); // B
    data[i + 3] = 255;
  }

  nctx.putImageData(img, 0, 0);

  /* ===============================
     MIRROR FACE
     =============================== */
  mctx.clearRect(0, 0, mirror.width, mirror.height);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {

    mctx.save();

    let w = mirror.width;
    let h = mirror.height;

    let gx = Math.sin(frame * 0.12) * glitchPower * 8;
    let gy = Math.cos(frame * 0.15) * glitchPower * 6;

    // mirror flip
    mctx.translate(w, 0);
    mctx.scale(-1, 1);

    // base face
    mctx.globalAlpha = 0.35;
    mctx.drawImage(video, gx, gy, w, h);

    // red corruption
    mctx.globalCompositeOperation = "screen";
    mctx.fillStyle = "rgba(255,0,0,0.18)";
    mctx.fillRect(0, 0, w, h);

    // glitch slices
    for (let i = 0; i < 8; i++) {
      let y = Math.random() * h;
      let sliceH = Math.random() * 50 + 10;
      let offset = (Math.random() - 0.5) * glitchPower * 30;

      mctx.drawImage(
        mirror,
        0, y, w, sliceH,
        offset, y, w, sliceH
      );
    }

    mctx.restore();
  }

  /* ===============================
     FADE BLACK
     =============================== */
  if (frame > 240) {
    black.style.opacity = (frame - 240) / 120;
  }

  /* ===============================
     TEXT APPEAR
     =============================== */
  if (frame > 320) {
    text.classList.add("show");
  }

  /* ===============================
     HIDE MIRROR
     =============================== */
  if (frame > 300) {
    mirror.style.opacity = 0.08;
  }

  if (frame > 360) {
    mirror.style.display = "none";
  }

  requestAnimationFrame(draw);
}

/* ===============================
   START
   =============================== */
draw();
