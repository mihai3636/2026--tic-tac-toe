export function computeWinner(board) {
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
        tie: false,
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
        tie: false,
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
      tie: false,
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
      tie: false,
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
