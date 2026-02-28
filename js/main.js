"use strict";

import { initModalWinner, initModalTie, initModalRestart } from "./modals.js";
import { updateTurnUi, updateScoreUi, TURN_X, TURN_O } from "./stats.js";
import { initMenu } from "./menu.js";

const mainEl = document.querySelector("main");
const gameEl = document.querySelector(".game");

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

const GAME_STATUS_MENU = "menu";
const GAME_STATUS_ACTIVE = "active";
let gameStatus = GAME_STATUS_MENU;

let ties = 0;
let firstRender = true;

let winner = null;

const board = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];
const boardUi = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];

const players = [playerX, playerO];

let turn = TURN_X;
let currentPlayer = players[turn];

initMenu(function () {
  initPlayerIds();
  gameStatus = GAME_STATUS_ACTIVE;

  render();
});

initModalWinner({
  onQuit: function () {
    resetState();
    render();
  },

  onNextRound: function () {
    resetBoardState();
    render();
  },
});

initModalTie({
  onQuit: function () {
    resetState();
    render();
  },

  onNextRound: function () {
    resetBoardState();
    render();
  },
});

initModalRestart(function () {
  resetState();
  render();
});

initBoardUi();
render();

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
}

function render() {
  updateGameStatusUi();
  if (gameStatus === GAME_STATUS_MENU) {
    return;
  }
  initPlayerScoreLabelsUi();

  updateCheckedBoardUi();
  if (winner && winner.tie) {
    updateModalTiesUi();
  }

  if (winner && winner.mark) {
    updateWinnerBoardUi();
    updateModalWinnerUi();
  }

  if (!firstRender) {
    switchPlayer();
  } else {
    firstRender = false;
  }

  updateHoverBoardUi();
  updateTurnUi(turn);
  updateScoreUi(players, ties);
}

function updateGameStatusUi() {
  mainEl.dataset.state = `game-${gameStatus}`;
}

function updateWinnerBoardUi() {
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

  const modalWinnerEl = document.getElementById("modalWinner");
  const modalWinnerTitleEl = document.getElementById("modalWinnerTitle");

  const winnerPlayer = players.find((p) => p.mark === winner.mark);

  modalWinnerEl.classList.add(`modal--wins-${winner.mark}`);
  modalWinnerTitleEl.textContent = `PLAYER ${winnerPlayer.id} WINS!`;

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
      if (!board[i][j]) {
        let cellEl = boardUi[i][j].closest(".cell");
        cellEl.classList.remove("cell--winner-x");
        cellEl.classList.remove("cell--winner-o");
        cellEl.disabled = false;

        continue;
      }

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

function initPlayerIds() {
  const playerOneSelectedMark = getPlayerOneSelectedMark();

  players.find((p) => p.mark === playerOneSelectedMark).id = 1;
  players.find((p) => p.mark !== playerOneSelectedMark).id = 2;
}

function initPlayerScoreLabelsUi() {
  const labelPlayerX = document.getElementById("playerLabelX");
  const labelPlayerO = document.getElementById("playerLabelO");

  labelPlayerX.textContent = `P${playerX.id}`;
  labelPlayerO.textContent = `P${playerO.id}`;
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

function resetState() {
  gameStatus = GAME_STATUS_MENU;
  resetScoreState();
  resetBoardState();
}

function resetScoreState() {
  playerX.score = 0;
  playerO.score = 0;
  ties = 0;
}

function resetBoardState() {
  board.forEach((arr) => arr.forEach((val, index) => (arr[index] = null)));
  winner = null;

  turn = -1;
  switchPlayer();
  firstRender = true;
}

function getPlayerOneSelectedMark() {
  const selectedRadio = document.querySelector(
    'input[name="playerMark"]:checked',
  );
  if (!selectedRadio) {
    return;
  }

  return selectedRadio.value;
}
