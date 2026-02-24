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

const winner = {
  cells: [],
  mark: null,
};

const board = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
const boardUi = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
initBoardUi();

const players = [playerX, playerO];
const TURN_X = 0;
const TURN_O = 1;

let turn = TURN_X;
let currentPlayer = players[turn];

gameEl.addEventListener("click", (ev) => {
  const cellEl = ev.target.closest(".cell");
  if (!cellEl) return;

  cellEl.disabled = true;

  const i = Number(cellEl.dataset.i);
  const j = Number(cellEl.dataset.j);

  board[i][j] = currentPlayer.mark;

  console.log(`Winner is: `, computeWinner());

  render();
});

function render() {
  updateCheckedBoardUi();
  switchPlayer();

  updateHoverBoardUi();
  updateTurnUi();
  updateScoreUi();
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

  p1ScoreEl.textContent = score.p1;
  p2ScoreEl.textContent = score.p2;
  tiesScoreEl.textContent = score.ties;
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

  return null;
}
