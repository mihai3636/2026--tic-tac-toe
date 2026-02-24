"use strict";
console.log("Hello world!");

const inputOneEl = document.getElementById("cell-1");
const gameEl = document.querySelector(".game");
const turnEl = document.querySelector(".turn");

const playerX = {
  id: 1,
  iconChecked: "./assets/icon-x.svg",
  iconHover: "./assets/icon-x-outline.svg",
  mark: "x",
};

const playerO = {
  id: 2,
  iconChecked: "./assets/icon-o.svg",
  iconHover: "./assets/icon-o-outline.svg",
  mark: "o",
};

const score = {
  p1: 0,
  p2: 0,
  ties: 0,

  resetScore: function () {
    this.p1 = 0;
    this.p2 = 0;
    this.ties = 0;
  },
};

const players = [playerX, playerO];
const TURN_X = 0;
const TURN_O = 1;

let turn = TURN_X;
let currentPlayer = players[turn];

console.log(currentPlayer);

gameEl.addEventListener("change", (ev) => {
  console.log(`Clicked on ${ev.target}`);
  ev.target.disabled = true;
  updateImgCheckedUi(ev.target);
  switchPlayer();

  updateImgHoverUi();
  updateTurnUi();
  updateScoreUi();
});

resetUiCheckboxes();

function switchPlayer() {
  turn = (turn + 1) % 2;
  currentPlayer = players[turn];
}

function updateImgCheckedUi(checkboxEl) {
  const imgEl = checkboxEl.closest("label.cell").querySelector("img");
  imgEl.src = currentPlayer.iconChecked;
  imgEl.dataset.checked = currentPlayer.mark;
}

function updateImgHoverUi() {
  const imgElements = document.querySelectorAll(
    ".cell > img:not([data-checked])",
  );

  [...imgElements].forEach((imgEl) => {
    imgEl.src = currentPlayer.iconHover;
  });
}

function resetUiCheckboxes() {
  const inputElements = document.querySelectorAll(`input[type=checkbox]`);
  [...inputElements].forEach((el) => {
    el.checked = false;
  });
}

function updateTurnUi() {
  console.log(turn);
  if (turn === TURN_X) {
    turnEl.classList.add("turn--x");
    turnEl.classList.remove("turn--o");
    return;
  }

  turnEl.classList.add("turn--o");
  turnEl.classList.remove("turn--x");
}

function updateScoreUi() {
  const p1ScoreEl = document.getElementById("p1Score");
  const p2ScoreEl = document.getElementById("p2Score");
  const tiesScoreEl = document.getElementById("ties");

  p1ScoreEl.textContent = score.p1;
  p2ScoreEl.textContent = score.p2;
  tiesScoreEl = score.ties;
}
