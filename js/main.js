"use strict";

import {
  initModalWinner,
  initModalTie,
  initModalRestart,
  updateModalWinnerUi,
  updateModalTiesUi,
} from "./modals.js";
import {
  updateTurnUi,
  updateScoreUi,
  updateGameStatusUi,
  initPlayerScoreLabelsUi,
  TURN_X,
  TURN_O,
} from "./stats.js";
import { initMenu } from "./menu.js";

import {
  initBoard,
  updateCheckedBoardUi,
  updateWinnerBoardUi,
  updateHoverBoardUi,
} from "./board.js";

import { computeWinner } from "./utilsBoard.js";

import { computeNextBestMove, GOAL_MAX, GOAL_MIN } from "./bot.js";

const mainEl = document.querySelector("main");

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

const players = [playerX, playerO];

let turn = TURN_X;
let currentPlayer = players[turn];

const GAME_MODE_CPU = "GAME_MODE_CPU";
const GAME_MODE_PLAYER = "GAME_MODE_PLAYER";
let gameMode = null;

initBoard({
  onCellClicked: function (ev) {
    const cellEl = ev.target.closest(".cell");
    if (!cellEl) return;

    const i = Number(cellEl.dataset.i);
    const j = Number(cellEl.dataset.j);

    placeMovementAndCheckWinner(i, j, currentPlayer.mark);
    render();

    if (gameMode === GAME_MODE_CPU && !winner) {
      playCpuMove();
    }
  },
});

initMenu({
  onNewGamePlayer: function () {
    initPlayerIds();
    gameStatus = GAME_STATUS_ACTIVE;
    gameMode = GAME_MODE_PLAYER;

    render();
  },
  onNewGameCpu: function () {
    initPlayerIds();
    gameStatus = GAME_STATUS_ACTIVE;
    gameMode = GAME_MODE_CPU;

    render();

    if (currentPlayer.id === 2) {
      playCpuMove();
    }
  },
});

initModalWinner({
  onQuit: function () {
    resetState();
    render();
  },

  onNextRound: function () {
    resetBoardState();
    render();

    if (gameMode === GAME_MODE_CPU && currentPlayer.id === 2) {
      playCpuMove();
    }
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
    if (gameMode === GAME_MODE_CPU && currentPlayer.id === 2) {
      playCpuMove();
    }
  },
});

initModalRestart(function () {
  resetState();
  render();
});

render();

function render() {
  updateGameStatusUi(gameStatus);
  if (gameStatus === GAME_STATUS_MENU) {
    return;
  }
  initPlayerScoreLabelsUi({ playerX, playerO });

  updateCheckedBoardUi({ board, playerX, playerO });
  if (winner && winner.tie) {
    updateModalTiesUi();
  }

  if (winner && winner.mark) {
    updateWinnerBoardUi(winner);
    updateModalWinnerUi({ players, winner });
  }

  if (!firstRender) {
    switchPlayer();
  } else {
    firstRender = false;
  }

  updateHoverBoardUi({ board, currentPlayer });
  updateTurnUi(turn);
  updateScoreUi(players, ties);
}

function updateWinnerStats() {
  if (winner.tie) {
    ties++;
    return;
  }

  let playerWinner = players.find((p) => p.mark === winner.mark);
  playerWinner.score++;
}

function switchPlayer() {
  turn = (turn + 1) % 2;
  currentPlayer = players[turn];
}

function initPlayerIds() {
  const playerOneSelectedMark = getPlayerOneSelectedMark();

  players.find((p) => p.mark === playerOneSelectedMark).id = 1;
  players.find((p) => p.mark !== playerOneSelectedMark).id = 2;
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

function placeMovementAndCheckWinner(row, col, mark) {
  board[row][col] = mark;
  winner = computeWinner(board);

  if (!winner) return;
  updateWinnerStats();
}

function playCpuMove() {
  let movement = computeNextBestMove(
    board,
    GOAL_MAX,
    currentPlayer.mark,
    currentPlayer.mark,
  );

  if (movement.i === null || movement.j === null) return;
  placeMovementAndCheckWinner(movement.i, movement.j, currentPlayer.mark);
  render();
}
