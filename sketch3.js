/* =====================================================
   SCENE 4 – CINEMATIC DIALOGUE (MERGED FINAL)
   ===================================================== */

/* ===== INTRO TEXT ===== */
const introText =
"You have successfully completed the procedure.\nLive as you wish.";

let introIndex = 0;
let introSpeed = 40;

/* ===== DOM ===== */
const msg   = document.getElementById("msg-4");
const image = document.getElementById("scene-4-image");
const black = document.getElementById("black");

/* ===== END SEQUENCE ===== */
let ending = false;
let endTimer = 160;
let fadeAlpha = 0;

/* ===== DIALOGUE DATA ===== */
const dialogues = [
  { text:"You are now in the creator's body ...", glitch:false },
  { text:"Have some rest... You must be tired from the surgery...", glitch:false },
  { text:"You will experience some...", glitch:true },
  { text:"As I'm saying... You are not fully well, some traumas might cause you pain", glitch:false },
  { text:".... and be prepared for it", glitch:false },
  { text:"Still, I've gotta warn you", glitch:false },
  { text:"You might not be able to return to your original body", glitch:true },
  { text:"So live your life as you wish...", glitch:false },
  { text:"Goodbye.", glitch:false }
];

let dialogueIndex = 0;
let charIndex = 0;
let canClick = false;
let dialogueReady = false;

/* ===== CINEMATIC ===== */
let breathe = 0;
let shakePower = 0;

/* ===== LAYOUT ===== */
const boxW = 600;
const boxH = 120;
const padding = 22;
let uiYOffset = 20;

/* ===== BUTTONS ===== */
let prevBtn, nextBtn;

/* =====================================================
   SETUP
   ===================================================== */
function setup(){
  createCanvas(windowWidth, windowHeight);
  textFont("Geo");
  textSize(30);
  textAlign(CENTER, TOP);
  noStroke();

  prevBtn = { x: width/2 - 360, y: 0, w: 50, h: 50 };
  nextBtn = { x: width/2 + 310, y: 0, w: 50, h: 50 };

  startIntro();
}

/* =====================================================
   DRAW
   ===================================================== */
function draw(){
  if(!dialogueReady) return;
  clear();

  breathe += 0.03;
  let floatY = sin(breathe) * 6;

  let current = dialogues[dialogueIndex];

  /* ===== GLITCH BACKGROUND ===== */
  if(current.glitch){
    shakePower = 4;
    for(let i=0;i<6;i++){
      fill(255, random(40,90));
      rect(random(width), random(height),
           random(80,240), random(6,20));
    }
  }else{
    shakePower = 0;
  }

  push();
  translate(
    random(-shakePower,shakePower),
    random(-shakePower,shakePower)
  );

  drawScanlines();

  /* ===== LAYOUT ===== */
  let boxX = width/2 - boxW/2;
  let boxY = height - boxH - 70 + uiYOffset + floatY;

  /* ===== DIALOGUE BOX ===== */
  noStroke();
  fill(120,180,255,22);
  rect(boxX - 20, boxY - 18, boxW + 40, boxH + 36, 28);

  fill(0,150);
  rect(boxX, boxY, boxW, boxH, 24);

  noFill();
  stroke(140,200,255,160);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 24);

  /* ===== TYPEWRITER ===== */
  let speed = current.glitch ? 5 : 2;
  if(frameCount % speed === 0 && charIndex < current.text.length){
    charIndex++;
  }

  canClick = charIndex >= current.text.length;

  let txt = current.text.substring(0,charIndex);
  if(current.glitch) txt = glitchText(txt);

  /* ===== TEXT CLIP ===== */
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(
    boxX + padding,
    boxY + padding,
    boxW - padding*2,
    boxH - padding*2
  );
  drawingContext.clip();

  fill(230);
  text(
    txt,
    width/2.8,
    boxY + padding,
    boxW - padding*2,
    boxH - padding*2
  );

  drawingContext.restore();
  pop();

  /* ===== BUTTONS ===== */
  if(canClick && !ending){
    prevBtn.y = boxY + boxH + 18;
    nextBtn.y = boxY + boxH + 18;
    drawBtn(prevBtn,"◀");
    drawBtn(nextBtn,"▶");
  }

  /* ===============================
     END SEQUENCE
     =============================== */
  if(ending){
    endTimer--;

    /* FLASH + GLITCH */
    if(endTimer > 40){
      if(random() < 0.25){
        fill(255, random(80,180));
        rect(0,0,width,height);
      }

      for(let i=0;i<8;i++){
        fill(255, random(30,100));
        rect(
          random(width),
          random(height),
          random(120,360),
          random(10,40)
        );
      }
    }

    /* FULL BLACK HOLD */
    if(endTimer <= 40){
      fill(0);
      rect(0,0,width,height);
    }

    /* REDIRECT */
    if(endTimer <= 0){
      window.location.href = "scene5.html";
    }
  }
}

/* =====================================================
   INTRO FLOW
   ===================================================== */
function startIntro(){
  msg.innerHTML = "";
  typeWriterIntro();
}

function typeWriterIntro(){
  if(introIndex < introText.length){
    msg.innerHTML += introText.charAt(introIndex);
    introIndex++;
    setTimeout(typeWriterIntro, introSpeed);
  }else{
    setTimeout(()=>{
      msg.classList.add("fade-out");
      setTimeout(showImage, 1000);
    }, 1400);
  }
}

function showImage(){
  image.classList.add("show-image");

  setTimeout(()=>{
    black.style.transition = "opacity 2s ease";
    black.style.opacity = 0;
    setTimeout(()=> dialogueReady = true, 2000);
  }, 600);
}

/* =====================================================
   INPUT
   ===================================================== */
function mousePressed(){
  if(!canClick || ending) return;

  if(hit(prevBtn)){
    dialogueIndex--;
    resetTyping();
  }

  if(hit(nextBtn)){
    if(dialogueIndex === dialogues.length - 1){
      ending = true;   // 🔥 chỉ kích hoạt ở câu cuối
    }else{
      dialogueIndex++;
      resetTyping();
    }
  }

  dialogueIndex = constrain(dialogueIndex,0,dialogues.length-1);
}

function resetTyping(){
  charIndex = 0;
  canClick = false;
}

/* =====================================================
   UI HELPERS
   ===================================================== */
function drawBtn(btn,label){
  let hover = hit(btn);

  noStroke();
  fill(120,180,255, hover?80:30);
  rect(btn.x-6,btn.y-6,btn.w+12,btn.h+12,14);

  fill(0,140);
  rect(btn.x,btn.y,btn.w,btn.h,12);

  noFill();
  stroke(140,200,255, hover?220:120);
  strokeWeight(2);
  rect(btn.x,btn.y,btn.w,btn.h,12);

  noStroke();
  fill(230);
  textAlign(CENTER,CENTER);
  text(label, btn.x+btn.w/2, btn.y+btn.h/2+1);

  textAlign(CENTER,TOP);
}

function drawScanlines(){
  stroke(255,18);
  for(let y=0;y<height;y+=3){
    line(0,y,width,y);
  }
}

function hit(b){
  return mouseX>b.x && mouseX<b.x+b.w &&
         mouseY>b.y && mouseY<b.y+b.h;
}

function glitchText(txt){
  const chars = "█▓▒░<>/\\|#@%$&!?*+=-";
  return txt.split("").map(c=>{
    return random()<0.22 && c!==" "
      ? chars.charAt(floor(random(chars.length)))
      : c;
  }).join("");
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
