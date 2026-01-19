let dialogueIndex = 0;
let breathe = 0;
let prevBtn, nextBtn;
let uiYOffset = 40;

// typewriter
let charIndex = 0;
let canClick = false;

// delay sau khi image fade
let dialogueReady = false;
let dialogueDelay = 90;

// cinematic
let bgGlitch = false;
let shakePower = 0;

// scene transition
let endScene = false;
let endTimer = 120; // ~2 seconds
let fadeAlpha = 0;

// dialogues
let dialogues = [
  { text: "Your chip memory is now integrated into her brain", glitch:false },
  { text: "HEY!!!", glitch:true },
  { text: "DO NOT MOVE!!!!!!!", glitch:true },
  { text: "Good... The procedure is being continued.", glitch:false },
  { text: "Your only job is....", glitch:false },
  { text: "...", glitch:true },
  { text: "Live as a human, and carry on with the remains...", glitch:false }
];

function setup(){
  createCanvas(windowWidth, windowHeight);
  textFont("Geo");
  textSize(30);
  textAlign(LEFT, TOP);

  prevBtn = { x: width/2 - 360, y: height - 145 + uiYOffset, w: 50, h: 50 };
  nextBtn = { x: width/2 + 310, y: height - 145 + uiYOffset, w: 50, h: 50 };
}

function draw(){
  clear();

  // ===== WAIT IMAGE FADE =====
  if(!dialogueReady){
    dialogueDelay--;
    if(dialogueDelay <= 0) dialogueReady = true;
    return;
  }

  breathe += 0.03;
  let floatY = sin(breathe) * 6;

  let current = dialogues[dialogueIndex];
  bgGlitch = current.glitch;

  // ===== CAMERA SHAKE =====
  let sx = bgGlitch ? random(-shakePower, shakePower) : 0;
  let sy = bgGlitch ? random(-shakePower, shakePower) : 0;
  translate(sx, sy);

  // ===== BACKGROUND GLITCH =====
  if(bgGlitch){
    shakePower = 4;

    for(let i=0;i<6;i++){
      noStroke();
      fill(255, random(30,90));
      rect(random(width), random(height), random(60,220), random(6,22));
    }

    if(random()<0.1){
      fill(255,35);
      rect(0,0,width,height);
    }
  }else{
    shakePower = 0;
  }

  drawScanlines();

  // ===== DIALOGUE BOX =====
  let boxY = height - 140 + floatY + uiYOffset;

  noStroke();
  fill(120,180,255,20);
  rect(width/2 - 320, boxY - 15, 640, 130, 28);

  fill(0,140);
  rect(width/2 - 300, boxY, 600, 110, 24);

  noFill();
  stroke(140,200,255,160);
  strokeWeight(2);
  rect(width/2 - 300, boxY, 600, 110, 24);

  // ===== TYPEWRITER =====
  let fullText = current.text;
  let speed = current.glitch ? 6 : 2;

  if(frameCount % speed === 0 && charIndex < fullText.length){
    charIndex++;
  }

  canClick = charIndex >= fullText.length;

  let visibleText = fullText.substring(0,charIndex);
  if(current.glitch) visibleText = glitchText(visibleText);

  let textX = width/3 + 45.5;
  let textY = height - 125 + floatY + uiYOffset;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(width/2 - 260, textY, 520, 90);
  drawingContext.clip();
  fill(230);
  textAlign(CENTER, TOP);
  text(visibleText, textX, textY, 520, 90);
  drawingContext.restore();

  // ===== BUTTONS (disabled at end) =====
  if(!endScene){
    drawButton(prevBtn,"◀");
    drawButton(nextBtn,"▶");
  }

  // ===== AUTO END SEQUENCE =====
  if(dialogueIndex === dialogues.length-1 && canClick){
    endScene = true;
  }

  if(endScene){
    endTimer--;

    // cinematic flash
    if(random()<0.05){
      fill(255, random(40,90));
      rect(0,0,width,height);
    }

    fadeAlpha = map(endTimer,120,0,0,255,true);
    fill(255, fadeAlpha);
    rect(0,0,width,height);

    if(endTimer <= 0){
      window.location.href = "scene4.html";
    }
  }
}

function mousePressed(){
  if(!canClick || endScene) return;

  if(hit(prevBtn)){
    dialogueIndex--;
    resetTyping();
  }

  if(hit(nextBtn)){
    dialogueIndex++;
    resetTyping();
  }

  dialogueIndex = constrain(dialogueIndex,0,dialogues.length-1);
}

function resetTyping(){
  charIndex = 0;
  canClick = false;
}

function drawButton(btn,label){
  let hover = hit(btn);

  noStroke();
  fill(120,180,255, hover?80:30);
  rect(btn.x-6,btn.y-6,btn.w+12,btn.h+12,14);

  fill(0,140);
  rect(btn.x,btn.y,btn.w,btn.h,12);

  noFill();
  stroke(140,200,255,hover?220:120);
  strokeWeight(2);
  rect(btn.x,btn.y,btn.w,btn.h,12);

  noStroke();
  fill(230);
  textAlign(CENTER,CENTER);
  text(label,btn.x+btn.w/2,btn.y+btn.h/2+1);
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
  let chars="█▓▒░<>/\\|#@%$&!?*+=-";
  return txt.split("").map(c=>{
    return random()<0.25 && c!==" "
      ? chars.charAt(floor(random(chars.length)))
      : c;
  }).join("");
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}
