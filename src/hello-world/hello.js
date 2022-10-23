let circle = document.querySelector(".circle");
let line = document.querySelector(".line");
let moveBy = 25;
let nIntervId;
let lIntervId;
let rIntervId;
circle.position;
window.addEventListener("load", () => {
  circle.style.position = "relative";
  circle.style.left = "750px";
  circle.style.top = "750px";
});
window.addEventListener("load", () => {
  line.style.position = "relative";
  line.style.left = "925px";
  line.style.top = "-30px";
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      clearInterval(nIntervId);
      nIntervId = null;
      clearInterval(rIntervId);
      rIntervId = null;
      if (!lIntervId) {
        lIntervId = setInterval(moveleft, 15);
      }
      break;
    case "ArrowRight":
      clearInterval(nIntervId);
      nIntervId = null;
      clearInterval(lIntervId);
      lIntervId = null;
      if (!rIntervId) {
        rIntervId = setInterval(moveright, 15);
      }
      break;
    case "ArrowUp":
      clearInterval(lIntervId);
      lIntervId = null;
      clearInterval(rIntervId);
      rIntervId = null;
      if (!nIntervId) {
        nIntervId = setInterval(moveup, 15);
      }
      break;
  }
});
function moveup() {
  circle.style.top = parseInt(circle.style.top) - 1 + "px";
  if (circle.style.top <= "0px") {
    clearInterval(nIntervId);
    nIntervId = null;
  }
}
function moveleft() {
  circle.style.left = parseInt(circle.style.left) - 1 + "px";
  if (circle.style.left <= "0px") {
    clearInterval(lIntervId);
    lIntervId = null;
  }
}
function moveright() {
  circle.style.left = parseInt(circle.style.left) + 1 + "px";
  if (circle.style.left >= "900px") {
    clearInterval(rIntervId);
    rIntervId = null;
  }
}
