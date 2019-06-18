import "./styles.css";

var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var s = 4;
//ctx is how you draw on the canvas

var mouse = { x: 0, y: 0, down: false };
var noGo = false;
var stringLength = 16 * 4 * 2;
var stringMinSpeed = 0.5;
var stringMaxSpeed = 1.5;
var stringsCount = 16; //16 / 2;
var strings = [];
for (var j = 0; j < stringsCount; j++) {
  var string = [];
  //make a string
  for (var i = 0; i < stringLength; i++) {
    string.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: 0,
      vy: 0
    });
  }
  //add it to the list of strings
  strings.push(string);
}
var gameSize = 800;
var lastMove = 0;
canvas.width = gameSize;
canvas.height = gameSize;

var timer = 0;
function drawString(stringArray, stringSpeed) {
  var startHue = timer;
  var hueChange = 1;

  for (var i = 1; i < stringArray.length; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "hsl(" + (startHue + i * hueChange) + ",50%,50%)";
    ctx.moveTo(stringArray[i - 1].x, stringArray[i - 1].y);
    var k = 0.5; //(1-stringSpeed);
    var k1 = 1 - k;
    var p = 0 + 1 / stringSpeed; //(1 - stringSpeed) * 1;
    var mid = {
      x: (stringArray[i].x + stringArray[i - 1].x) / 2,
      y: (stringArray[i].y + stringArray[i - 1].y) / 2
    };
    ctx.quadraticCurveTo(
      (stringArray[i].x +
        stringArray[i].vx * k1 +
        stringArray[i - 1].x -
        stringArray[i - 1].vx * k) *
        p *
        0.5 -
        mid.x * (p - 1),
      (stringArray[i].y +
        stringArray[i].vy * k1 +
        stringArray[i - 1].y -
        stringArray[i - 1].vy * k) *
        p *
        0.5 -
        mid.y * (p - 1),
      stringArray[i].x,
      stringArray[i].y
    );
    ctx.stroke();
    // ctx.lineTo(stringArray[i].x, stringArray[i].y);
  }
}
function moveString(stringArray, stringSpeed) {
  stringArray[0].x = mouse.x;
  stringArray[0].y = mouse.y;
  var dis = 0;
  for (var i = 1; i < stringArray.length; i++) {
    var stringS = stringSpeed;
    stringArray[i].vx = stringArray[i].vx * (1 - stringS);
    stringArray[i].vy = stringArray[i].vy * (1 - stringS);
    var m = 1 / 3;
    var len =
      ((stringArray[i - 1].x - stringArray[i].x) ** 2 +
        (stringArray[i - 1].y - stringArray[i].y) ** 2) **
      0.5;
    stringArray[i].vx +=
      (((stringArray[i - 1].x - stringArray[i].x) * stringS) / (len + 0.1)) *
      (-dis + len) *
      m;
    stringArray[i].vy +=
      (((stringArray[i - 1].y - stringArray[i].y) * stringS) / (len + 0.1)) *
      (-dis + len) *
      m;
    // stringArray[i].x += stringArray[i].vx;
    // stringArray[i].y += stringArray[i].vy;
  }
  // for (var i = stringArray.length-1; i >0; i--) {

  //   stringArray[i].x += stringArray[i].vx;
  //   stringArray[i].y += stringArray[i].vy;
  //   stringArray[i].vx = (stringArray[i - 1].x - stringArray[i].x) * stringSpeed;
  //   stringArray[i].vy = (stringArray[i - 1].y - stringArray[i].y) * stringSpeed;

  // }
  for (var i = 1; i < stringArray.length; i++) {
    stringArray[i].x += stringArray[i].vx;
    stringArray[i].y += stringArray[i].vy;
  }
}
var targetPos = { x: 0, y: 0 };
function render() {
  timer++;
  //clear the old drawing
  var lk = 0.1;

  targetPos.x =
    targetPos.x * (1 - lk) +
    lk *
      (Math.sin((timer / 60) * 1) * 800 +
        canvas.width / 2 / s +
        Math.sin((timer / 60) * 12) * 100);

  //  Math.sin((timer / 60) * 1) * 300 + 400 + Math.sin((timer / 60) * 12) * 100;
  targetPos.y =
    targetPos.y * (1 - lk) +
    lk *
      (Math.cos((timer / 10) * 1) * 200 +
        canvas.height / 2 / s +
        Math.cos((timer / 40) * 7) * 100);
  if (new Date().getTime() - lastMove > 2000) {
    mouse.x = targetPos.x * s;
    mouse.y = targetPos.y * s;
  }
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = s;
  for (var i = 0; i < strings.length; i++) {
    var spd =
      stringMinSpeed + (i / stringsCount) * (stringMaxSpeed - stringMinSpeed);
    drawString(strings[i], spd);
    // moveString(strings[i], spd);
  }
  if (!noGo) {
    window.setTimeout(render, 10);
  }
}
window.setInterval(function() {
  for (var i = 0; i < strings.length; i++) {
    var spd =
      stringMinSpeed + (i / stringsCount) * (stringMaxSpeed - stringMinSpeed);
    // drawString(strings[i].slice(0, 2), spd);
    moveString(strings[i], spd);
  }
}, 5);
render();
window.addEventListener("mousemove", function(event) {
  mouse.x = event.clientX * s;
  mouse.y = event.clientY * s;
  lastMove = new Date().getTime();
});
window.addEventListener("keyup", function(event) {
  if (event.keyCode == 32) {
    noGo = !noGo;
  }
});
function resizeH() {
  canvas.width = window.innerWidth * s;
  canvas.height = window.innerHeight * s;
}
window.addEventListener("resize", resizeH);
resizeH();
