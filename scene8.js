const textEl  = document.getElementById("dialogue-text");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const black   = document.getElementById("black");
const eye     = document.getElementById("eye");
const camera  = document.getElementById("camera");
const canvas  = document.getElementById("halftone");
const ctx     = canvas.getContext("2d");

/* DIALOGUES */
const dialogues = [
  { text:"Being human...." },
  { text:"..nor being a robot." },
  { text:"..." },
  { text:"They said.." },
  { text:"\"Eyes are the window to your true soul\"" },
  { text:"Yet... I can't seem to recognize mine...." },
  { text:"Is there a purpose to live \"life\"?", camera:true },
  { text:"Ask yourself that." },
  { text:"If you can't live to your true own, then leave" },
  { text:"Those traumas don't define who you are..." },
  { text:"even as anyone" },
  { text:"This is not an ending. This is your start", end:true }
];

let index = 0;
let charIndex = 0;
let typing = false;
let ending = false;

/* TYPEWRITER */
function typeWriter(){
  if(!typing) return;

  const d = dialogues[index];

  if(charIndex < d.text.length){
    textEl.innerHTML += d.text.charAt(charIndex++);
    setTimeout(typeWriter, 40);
  } else {
    typing = false;

    if(d.end){
      textEl.classList.add("breathing");
      setTimeout(startFinalEnd, 3500);
    } else {
      showButtons();
    }
  }
}

/* LOAD */
function loadDialogue(){
  textEl.innerHTML = "";
  charIndex = 0;
  typing = true;
  hideButtons();

  const d = dialogues[index];

  if(d.camera){
    fadeToCamera();
  }

  typeWriter();
}

/* CAMERA + HALFTONE */
async function fadeToCamera(){
  black.style.opacity = 1;

  setTimeout(async ()=>{
    eye.style.opacity = 0;

    const stream = await navigator.mediaDevices.getUserMedia({ video:true });
    camera.srcObject = stream;
    camera.style.opacity = 1;

    resizeCanvas();
    renderHalftone();

    black.style.opacity = 0;
  }, 1200);
}

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/* HALFTONE */
function renderHalftone(){
  if(camera.readyState < 2){
    requestAnimationFrame(renderHalftone);
    return;
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const step = 8;
  const sx = canvas.width / camera.videoWidth;
  const sy = canvas.height / camera.videoHeight;

  for(let y=0;y<camera.videoHeight;y+=step){
    for(let x=0;x<camera.videoWidth;x+=step){
      ctx.drawImage(camera,x,y,1,1,0,0,1,1);
      const p = ctx.getImageData(0,0,1,1).data;
      const b = (p[0]+p[1]+p[2])/3;
      const r = (1 - b/255) * step;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x*sx, y*sy, r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  requestAnimationFrame(renderHalftone);
}

/* ENDING */
function startFinalEnd(){
  ending = true;
  hideButtons();

  let t = 200;
  function loop(){
    t--;
    black.style.opacity = t > 60 ? Math.random()*0.4 : 1;
    if(t <= 0){
      window.location.href = "index.html";
      return;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* UI */
function showButtons(){
  prevBtn.classList.add("show");
  nextBtn.classList.add("show");
}
function hideButtons(){
  prevBtn.classList.remove("show");
  nextBtn.classList.remove("show");
}

/* INPUT */
nextBtn.onclick = ()=>{
  if(typing || ending) return;
  if(index < dialogues.length-1){
    index++;
    loadDialogue();
  }
};

prevBtn.onclick = ()=>{
  if(typing || ending) return;
  if(index > 0){
    index--;
    loadDialogue();
  }
};

/* START */
setTimeout(()=>{
  eye.style.opacity = 0;
  loadDialogue();
}, 2200);

window.addEventListener("resize", resizeCanvas);
