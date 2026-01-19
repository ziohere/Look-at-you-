/* ===============================
   SCENE 6 – KEEP
   =============================== */

const textEl = document.getElementById("dialogue-text");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const rightImg = document.getElementById("img-right");
const black = document.getElementById("black");

/* ===============================
   DIALOGUE DATA
   =============================== */
const dialogues = [
  { text: "Are they.... me?", glitch:false },
  { text: "Why do I look so...", glitch:false },
  { text: "Nevermind...", glitch:false },
  { text: "Is this...", glitch:true, zoom:true },
  { text: "My home?", glitch:true },
  { text: "No...", glitch:true },
  { text: "This can't be...", glitch:true },
  { text: "I have to leave...", glitch:true },
  { text: "I have to find a way out...", glitch:true },
  { text: "I can't keep living like this...", glitch:true, scream:true },
  { text: "*Open your eyes*", glitch:false },
  { text: "Wake up...", glitch:false },
 
  
];

let index = 0;
let charIndex = 0;
let typing = true;

/* ===============================
   TYPEWRITER
   =============================== */
function typeWriter() {
  if (!typing) return;

  let d = dialogues[index];
  let speed = d.glitch ? 25 : 40;

  if (charIndex < d.text.length) {
    textEl.innerHTML += d.text.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    typing = false;
  }
}

/* ===============================
   LOAD DIALOGUE
   =============================== */
function loadDialogue() {
  textEl.innerHTML = "";
  charIndex = 0;
  typing = true;

  let d = dialogues[index];

  textEl.classList.toggle("glitch", d.glitch);

  if (d.zoom) {
    rightImg.classList.add("zoom");
  }

  if (d.scream) {
    intenseGlitch();
  }

  typeWriter();
}

/* ===============================
   INTENSE GLITCH
   =============================== */
function intenseGlitch() {
  let count = 0;
  let interval = setInterval(() => {
    black.style.opacity = Math.random() * 0.8;
    rightImg.style.transform =
      `translateY(-50%) scale(${1.4 + Math.random()*0.12})`;

    count++;
    if (count > 16) {
      clearInterval(interval);
      black.style.opacity = 1;
    }
  }, 60);
}

/* ===============================
   INPUT
   =============================== */
nextBtn.onclick = () => {
  if (typing) return;

  if (index < dialogues.length - 1) {
    index++;
    loadDialogue();
  } else {
    // ===== TRANSITION TO SCENE 7 =====
    startScene7Transition();
  }
};


prevBtn.onclick = () => {
  if (typing) return;
  if (index > 0) {
    index--;
    rightImg.classList.remove("zoom");
    black.style.opacity = 0;
    loadDialogue();
  }
};

/* ===============================
   START
   =============================== */
loadDialogue();
function startScene7Transition(){
  let flashes = 0;

  let glitchInterval = setInterval(()=>{
    black.style.opacity = Math.random();
    flashes++;

    if(flashes > 18){
      clearInterval(glitchInterval);
      black.style.opacity = 1;

      setTimeout(()=>{
        window.location.href = "scene7.html";
      }, 1200);
    }
  }, 80);
}
