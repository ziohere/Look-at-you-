/* =====================================================
   SCENE 5 – MEMORY DIALOGUE (SKETCH 3 STYLE)
   ===================================================== */

/* ===== DIALOGUE DATA ===== */
const dialogues = [
  { text:"W-Wha----", glitch:true },
  { text:"Why the hell am I here?", glitch:false },
  { text:"Is this....", glitch:false },
  { text:"My family photos?", glitch:false },
  { text:"Do I even have a \"family\"?", glitch:true },
  { text:"The pictures are all distorted? What should I do?.....", glitch:false }
];

let dialogueIndex = 0;
let charIndex = 0;
let canClick = false;
let showChoices = false;

/* ===== CINEMATIC ===== */
let breathe = 0;
let shakePower = 0;

/* ===== LAYOUT ===== */
const boxW = 640;
const boxH = 130;
const padding = 26;

/* ===== BUTTONS ===== */
let prevBtn, nextBtn;
let choiceA, choiceB;

let cnv;

/* =====================================================
   SETUP
   ===================================================== */
function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("scene5");
  cnv.style("position","absolute");
  cnv.style("z-index","5");

  textFont("Geo");
  textSize(30);
  textAlign(CENTER, TOP);
  noStroke();

  prevBtn = { x: width/2 - 380, y: 0, w: 50, h: 50 };
  nextBtn = { x: width/2 + 330, y: 0, w: 50, h: 50 };

  let btnY = height - 90;
  choiceA = { x: width/2 - 240, y: btnY, w: 200, h: 52, label:"RIP THE PICTURES" };
  choiceB = { x: width/2 + 40,  y: btnY, w: 200, h: 52, label:"KEEP IT STILL" };
}

/* =====================================================
   DRAW
   ===================================================== */
function draw(){
  clear();

  breathe += 0.03;
  let floatY = sin(breathe) * 5;

  let current = dialogues[dialogueIndex];

  /* ===== GLITCH BACKGROUND ===== */
  if(current.glitch){
    shakePower = 3;
    for(let i=0;i<5;i++){
      fill(255, random(30,90));
      rect(random(width), random(height),
           random(80,200), random(6,18));
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

  /* ===== DIALOGUE BOX ===== */
  let boxX = width/2 - boxW/2;
  let boxY = height - boxH - 110 + floatY;

  // glow
  fill(120,180,255,22);
  rect(boxX - 18, boxY - 16, boxW + 36, boxH + 32, 28);

  // body
  fill(0,150);
  rect(boxX, boxY, boxW, boxH, 24);

  // border
  noFill();
  stroke(140,200,255,160);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 24);
  noStroke();

  /* ===== TYPEWRITER ===== */
  let speed = current.glitch ? 4 : 2;
  if(frameCount % speed === 0 && charIndex < current.text.length){
    charIndex++;
  }

  canClick = charIndex >= current.text.length;

  let txt = current.text.substring(0,charIndex);
  if(current.glitch) txt = glitchText(txt);

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

  /* ===== PREV / NEXT ===== */
  if(canClick && !showChoices){
    prevBtn.y = boxY + boxH + 18;
    nextBtn.y = boxY + boxH + 18;
    drawBtn(prevBtn,"◀");
    drawBtn(nextBtn,"▶");
  }

  /* ===== CHOICES ===== */
  if(showChoices){
    drawChoice(choiceA);
    drawChoice(choiceB);
  }
}

/* =====================================================
   INPUT
   ===================================================== */
function mousePressed(){

  if(!canClick) return;

  if(!showChoices){

    if(hit(prevBtn)){
      dialogueIndex--;
      resetTyping();
    }

    if(hit(nextBtn)){
      dialogueIndex++;
      resetTyping();

      if(dialogueIndex >= dialogues.length){
        dialogueIndex = dialogues.length - 1;
        showChoices = true;
      }
    }

    dialogueIndex = constrain(dialogueIndex,0,dialogues.length-1);
    return;
  }

  /* ===== CHOICES ===== */
  if(showChoices){
    if(hit(choiceA)){
      window.location.href = "scene6_rip.html";
    }

    if(hit(choiceB)){
      window.location.href = "scene6_keep.html";
    }
  }
}

/* =====================================================
   HELPERS
   ===================================================== */
function resetTyping(){
  charIndex = 0;
  canClick = false;
}

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

function drawChoice(btn){
  let hover = hit(btn);

  fill(120,180,255, hover?90:40);
  rect(btn.x-6, btn.y-6, btn.w+12, btn.h+12, 16);

  fill(0,150);
  rect(btn.x, btn.y, btn.w, btn.h, 14);

  noFill();
  stroke(140,200,255, hover?230:140);
  strokeWeight(2);
  rect(btn.x, btn.y, btn.w, btn.h, 14);
  noStroke();

  fill(230);
  textAlign(CENTER,CENTER);
  text(btn.label, btn.x + btn.w/2, btn.y + btn.h/2 + 1);
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
  resizeCanvas(windowWidth, windowHeight);
}
const systemText = document.getElementById("system-text");
const img = document.getElementById("scene-5-image");

/* SYSTEM STABLE */
setTimeout(() => {
  systemText.style.opacity = 1;
}, 400);

/* FADE OUT TEXT → SHOW IMAGE */
setTimeout(() => {
  systemText.style.opacity = 0;
}, 2000);

setTimeout(() => {
  img.style.opacity = 1;
}, 2600);
