import { computeWinner } from "./utilsBoard.js";

export const GOAL_MAX = "MAX";
export const GOAL_MIN = "MIN";
const MARK_X = "x";
const MARK_O = "o";

export function computeNextBestMove(board, goal, currentMark, globalMark) {
  if (isLeafNode(board)) {
    return {
      value: estimateScore(board, globalMark),
      i: null,
      j: null,
    };
  }

  let result = [];
  for (let [movX, movY] of getAvailableMoves(board)) {
    result.push({
      value: computeNextBestMove(
        getNewBoardWithMovement(board, currentMark, movX, movY),
        getOppositeGoal(goal),
        getOppositeMark(currentMark),
        globalMark,
      ).value,
      i: movX,
      j: movY,
    });
  }

  if (goal === GOAL_MAX) {
    return result.reduce(function (prev, current) {
      if (current.value > prev.value) return current;
      return prev;
    }, result[0]);
  }

  return result.reduce(function (prev, current) {
    if (current.value < prev.value) return current;
    return prev;
  }, result[0]);
}

function estimateScore(board, playerMark) {
  let winner = computeWinner(board);

  if (!winner) return 0;
  if (winner.tie) return 0;
  if (winner.mark === playerMark) return 1;

  return -1;
}

function isLeafNode(board) {
  let winner = computeWinner(board);
  if (winner) return true;

  return false;
}

function getAvailableMoves(board) {
  let result = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j]) continue;
      result.push([i, j]);
    }
  }

  return result;
}

function getNewBoardWithMovement(board, mark, i, j) {
  const newBoard = board.map((row) => [...row]);
  newBoard[i][j] = mark;

  return newBoard;
}

function getOppositeGoal(goal) {
  if (goal === GOAL_MAX) return GOAL_MIN;
  return GOAL_MAX;
}

function getOppositeMark(mark) {
  if (mark === MARK_X) return MARK_O;
  return MARK_X;
}
