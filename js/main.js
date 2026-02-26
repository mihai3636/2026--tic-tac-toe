"use strict";
console.log("Hello world!");

const mainEl = document.querySelector("main");
const gameEl = document.querySelector(".game");
const turnEl = document.querySelector(".turn");

const btnRestartEl = document.getElementById("btnRestart");
const btnRestartCancel = document.getElementById("btnRestartCancel");

const playerX = {
  id: 1,
  iconChecked: "./assets/icon-x.svg",
  iconHover: "./assets/icon-x-outline.svg",
  mark: "x",
  score: 0,
};

const playerO = {
  id: 2,
  iconChecked: "./assets/icon-o.svg",
  iconHover: "./assets/icon-o-outline.svg",
  mark: "o",
  score: 0,
};

let ties = 0;

let winner = null;

const board = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
const boardUi = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
initBoardUi();

const players = [playerX, playerO];
const TURN_X = 0;
const TURN_O = 1;

let turn = TURN_X;
let currentPlayer = players[turn];

btnRestartEl.addEventListener("click", (ev) => {
  showRestartUi();
});

btnRestartCancel.addEventListener("click", (ev) => {
  hideModalsUi();
});

gameEl.addEventListener("click", (ev) => {
  const cellEl = ev.target.closest(".cell");
  if (!cellEl) return;

  cellEl.disabled = true;

  const i = Number(cellEl.dataset.i);
  const j = Number(cellEl.dataset.j);

  board[i][j] = currentPlayer.mark;

  winner = computeWinner();
  updateWinnerStats();

  render();
});

function updateWinnerStats() {
  if (!winner) return;

  if (winner.tie) {
    ties++;
    return;
  }

  let playerWinner = players.find((p) => p.mark === winner.mark);
  playerWinner.score++;

  console.log(`Player winner is: `, playerWinner);
}

function render() {
  updateCheckedBoardUi();
  if (winner && winner.tie) {
    updateModalTiesUi();
  }

  if (winner) {
    updateWinnerBoardUi();
    updateModalWinnerUi();
  }

  switchPlayer();
  updateHoverBoardUi();
  updateTurnUi();
  updateScoreUi();
}

function updateWinnerBoardUi() {
  console.log(`Found winner: `, winner);
  console.log(winner.cells);
  console.log(winner.mark);
  console.log(`It was a tie: ${winner.tie}`);

  let imgPath =
    winner.mark === "x"
      ? "./assets/icon-x-winner.svg"
      : "./assets/icon-o-winner.svg";

  for (let [i, j] of winner.cells) {
    let cellEl = document.querySelector(`button[data-i='${i}'][data-j='${j}']`);
    cellEl.querySelector("img").src = imgPath;
    cellEl.classList.add(`cell--winner-${winner.mark}`);
  }
}

function updateModalWinnerUi() {
  mainEl.classList.add("modal--on");
  mainEl.classList.add("modal--winner");

  document
    .getElementById("modalWinner")
    .classList.add(`modal--wins-${winner.mark}`);

  document.querySelector("img.modal__content__img").src =
    `./assets/icon-${winner.mark}.svg`;
}

function updateModalTiesUi() {
  mainEl.classList.add("modal--on");
  mainEl.classList.add("modal--equal");
}

function initBoardUi() {
  const cellEls = document.querySelectorAll(".cell");
  [...cellEls].forEach((el) => {
    boardUi[el.dataset.i][el.dataset.j] = el.querySelector("img");
  });
}

function switchPlayer() {
  turn = (turn + 1) % 2;
  currentPlayer = players[turn];
}

function updateCheckedBoardUi() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) continue;

      if (board[i][j] === playerX.mark) {
        boardUi[i][j].src = playerX.iconChecked;
        continue;
      }
      if (board[i][j] === playerO.mark) {
        boardUi[i][j].src = playerO.iconChecked;
      }
    }
  }
}

function updateHoverBoardUi() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j]) continue;

      boardUi[i][j].src = currentPlayer.iconHover;
    }
  }
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

  p1ScoreEl.textContent = players.find((p) => p.id === 1).score;
  p2ScoreEl.textContent = players.find((p) => p.id === 2).score;
  tiesScoreEl.textContent = ties;
}

function showRestartUi() {
  mainEl.classList.add("modal--on");
  mainEl.classList.add("modal--restart");
}

function hideModalsUi() {
  let classes = [...mainEl.classList];
  classes.forEach((className) => {
    if (className.startsWith("modal--")) {
      mainEl.classList.remove(className);
    }
  });
}

function computeWinner() {
  for (let i = 0; i < board.length; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return {
        cells: [
          [i, 0],
          [i, 1],
          [i, 2],
        ],
        mark: board[i][0],
      };
    }

    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return {
        cells: [
          [0, i],
          [1, i],
          [2, i],
        ],
        mark: board[0][i],
      };
    }
  }

  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return {
      cells: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      mark: board[0][0],
    };
  }

  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return {
      cells: [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
      mark: board[0][2],
    };
  }

  if (board.every((arr) => arr.every((item) => item))) {
    return {
      cells: [],
      mark: null,
      tie: true,
    };
  }

  return null;
}
