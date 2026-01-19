/* ===============================
   DOM
   =============================== */
const textEl  = document.getElementById("dialogue-text");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const black   = document.getElementById("black");
const slides  = document.querySelectorAll(".slide");

/* ===============================
   END SEQUENCE (UNIFIED)
   =============================== */
let ending = false;
let endTimer = 160;

/* ===============================
   SLIDES
   =============================== */
const slideImages = [
  "gd-1.png",
  "gd-4.png",
  "gd-5.png",
  "gd-6.png",
  "eye-openclose.gif"
];

let slideIndex = 0;
let active = 0;

/* ===============================
   DIALOGUES
   =============================== */
const dialogues = [
  { text:"I hate this body...", glitch:true },
  { text:"Why do the memories kept coming back...." },
  { text:"I didn't choose this life" },
  { text:"I have never chosen one..." },
  { text:"They hurted me....", slide:true },
  { text:"Yet.. I still longed for their affection...", slide:true },
  { text:"", glitch:true, end:true }
];

let index = 0;
let charIndex = 0;
let typing = true;

/* ===============================
   TYPEWRITER
   =============================== */
function typeWriter(){
  if(!typing) return;

  const d = dialogues[index];
  const speed = d.glitch ? 22 : 40;

  if(charIndex < d.text.length){
    textEl.innerHTML += d.text.charAt(charIndex++);
    setTimeout(typeWriter, speed);
  }else{
    typing = false;
    showButtons();
  }
}

/* ===============================
   LOAD DIALOGUE
   =============================== */
function loadDialogue(){
  textEl.innerHTML = "";
  charIndex = 0;
  typing = true;
  hideButtons();

  const d = dialogues[index];

  textEl.classList.toggle("glitch-text", !!d.glitch);
  slides.forEach(s => s.classList.toggle("glitch", !!d.glitch));

  if(d.slide){
    changeSlide();
  }

  if(d.end){
    ending = true;
    requestAnimationFrame(endLoop);
    return;
  }

  typeWriter();
}

/* ===============================
   SLIDE CHANGE
   =============================== */
function changeSlide(){
  active = 1 - active;
  slideIndex = (slideIndex + 1) % slideImages.length;

  slides[active].style.backgroundImage =
    `url("${slideImages[slideIndex]}")`;

  slides.forEach(s => s.classList.remove("active"));
  slides[active].classList.add("active");

  black.style.opacity = 0.4;
  setTimeout(()=> black.style.opacity = 0, 120);
}

/* ===============================
   BUTTON VISIBILITY
   =============================== */
function showButtons(){
  prevBtn.classList.add("show");
  nextBtn.classList.add("show");
}

function hideButtons(){
  prevBtn.classList.remove("show");
  nextBtn.classList.remove("show");
}

/* ===============================
   END LOOP (scene3-style)
   =============================== */
function endLoop(){
  if(!ending) return;

  endTimer--;

  /* FLASH + GLITCH */
  if(endTimer > 40){
    if(Math.random() < 0.3){
      black.style.opacity = Math.random();
    }
    slides.forEach(s => s.classList.add("glitch"));
  }

  /* FULL BLACK HOLD */
  if(endTimer <= 40){
    black.style.opacity = 1;
  }

  /* REDIRECT */
  if(endTimer <= 0){
    window.location.href = "scene8.html";
    return;
  }

  requestAnimationFrame(endLoop);
}

/* ===============================
   INPUT
   =============================== */
nextBtn.onclick = ()=>{
  if(typing || ending) return;
  if(index < dialogues.length - 1){
    index++;
    loadDialogue();
  }
};

prevBtn.onclick = ()=>{
  if(typing || ending) return;
  if(index > 0){
    index--;
    black.style.opacity = 0;
    loadDialogue();
  }
};

/* ===============================
   START
   =============================== */
slides[0].style.backgroundImage = `url("${slideImages[0]}")`;
slides[0].classList.add("active");
loadDialogue();
