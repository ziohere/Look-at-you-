let dialogueIndex = 0;
let breathe = 0;
let prevBtn, nextBtn;
let uiYOffset = 40;

let charIndex = 0;
let typingSpeed = 1;
let endSequence = false;

let glitchTimer = 0;
let glitchActive = false;
let lockedEnding = false;
let endingText = "";

let showChoices = false;

let goToNextScene = false;
let sceneTimer = 0;

let dialogues = [
  "Wake up...",
  "Get your hands on, we need to do this perfectly.",
  "Remember, every move counts.",
  "Are you ready?",
  "Let's begin."
];

function setup(){
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textFont("Geo");
  textSize(30);

  prevBtn = { x: width/2 - 360, y: height - 145 + uiYOffset, w: 50, h: 50 };
  nextBtn = { x: width/2 + 310, y: height - 145 + uiYOffset, w: 50, h: 50 };
}

function draw(){
  clear();
  breathe += 0.03;
  let floatY = sin(breathe) * 6;
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

  let fullText = lockedEnding ? endingText : dialogues[dialogueIndex];

  if(frameCount % 2 === 0 && charIndex < fullText.length){
    charIndex += typingSpeed;
  }

  let visibleText = fullText.substring(0, charIndex);

  if(glitchActive){
    visibleText = glitchText(visibleText);
    glitchTimer--;
    if(glitchTimer <= 0) glitchActive = false;
  }

  let textW = 520;
  let textH = 90;
  let textX = width/3 + 45.5;
  let textY = height - 125 + floatY + uiYOffset;

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(width/2 - 260, textY, textW, textH);
  drawingContext.clip();
  fill(230);
  textAlign(CENTER, TOP);
  text(visibleText, textX, textY, textW, textH);
  drawingContext.restore();

  if(!lockedEnding){
    drawButton(prevBtn, "◀");
    drawButton(nextBtn, "▶");
  }

  if(dialogueIndex === dialogues.length-1 && charIndex >= fullText.length){
    showChoices = true;
  }

  if(showChoices && !lockedEnding){
    drawChoice(width/2 - 120, height - 55, "YES");
    drawChoice(width/2 + 20, height - 55, "NO");
  }

  if(endSequence){
    let flashes = noise(frameCount*0.1)*120;
    fill(255, flashes);
    rect(0,0,width,height);
    if(random() < 0.08){
      fill(0,160);
      rect(0,0,width,height);
    }
  }

  // ⏳ scene transition timer (always runs when enabled)
  if(goToNextScene){
    sceneTimer--;
    if(sceneTimer <= 0){
      window.location.href = "scene3.html";
    }
  }
}

function mousePressed(){
  if(lockedEnding) return;

  if(hit(prevBtn)){
    dialogueIndex--;
    charIndex = 0;
  }

  if(hit(nextBtn)){
    dialogueIndex++;
    charIndex = 0;
  }

  if(showChoices){
    // YES
    if(mouseX > width/2 - 120 && mouseX < width/2 - 20 &&
       mouseY > height - 80 && mouseY < height - 32){

      endingText = "here it comes..";
      lockedEnding = true;
      glitchActive = false;
      charIndex = 0;
      endSequence = true;

      goToNextScene = true;
      sceneTimer = 120;   // ~2 seconds
    }

    // NO (death)
    if(mouseX > width/2 + 20 && mouseX < width/2 + 120 &&
       mouseY > height - 80 && mouseY < height - 32){

      endingText = "The operation failed.\nYou are dead.";
      lockedEnding = true;
      glitchActive = true;
      glitchTimer = 180;
      charIndex = 0;
      endSequence = true;
    }
  }

  dialogueIndex = constrain(dialogueIndex, 0, dialogues.length-1);
}

function drawButton(btn,label){
  let hover = hit(btn);
  fill(120,180,255, hover?80:30);
  rect(btn.x-6,btn.y-6,btn.w+12,btn.h+12,14);
  fill(0,140);
  rect(btn.x,btn.y,btn.w,btn.h,12);
  noFill(); stroke(140,200,255,hover?220:150); strokeWeight(2);
  rect(btn.x,btn.y,btn.w,btn.h,12);
  noStroke(); fill(230);
  textAlign(CENTER,CENTER);
  text(label, btn.x+btn.w/2, btn.y+btn.h/2+1);
}

function drawChoice(x,y,label){
  fill(120,180,255,40);
  rect(x-4,y-4,100,48,14);
  fill(0,160);
  rect(x,y,100,48,12);
  noFill(); stroke(140,200,255,180); strokeWeight(2);
  rect(x,y,100,48,12);
  noStroke(); fill(230);
  textAlign(CENTER,CENTER);
  text(label,x+50,y+25);
}

function hit(b){
  return mouseX>b.x && mouseX<b.x+b.w && mouseY>b.y && mouseY<b.y+b.h;
}

function glitchText(txt){
  let chars = "█▓▒░<>/\\|#@%$&!?*+=-";
  let out="";
  for(let i=0;i<txt.length;i++){
    if(random()<0.25 && txt[i]!=" ") out+=chars.charAt(floor(random(chars.length)));
    else out+=txt[i];
  }
  return out;
}
