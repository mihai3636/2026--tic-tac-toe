const gameEl = document.querySelector(".game");
const boardUi = [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)];

initBoardUi();

export function initBoard({ onCellClicked }) {
  gameEl.addEventListener("click", (ev) => {
    onCellClicked(ev);
  });
}

export function updateCheckedBoardUi({ board, playerX, playerO }) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cellEl = boardUi[i][j].closest(".cell");

      if (!board[i][j]) {
        cellEl.classList.remove("cell--winner-x");
        cellEl.classList.remove("cell--winner-o");
        cellEl.disabled = false;

        continue;
      }

      cellEl.disabled = true;
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

export function updateWinnerBoardUi(winner) {
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

export function updateHoverBoardUi({ board, currentPlayer }) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j]) continue;

      boardUi[i][j].src = currentPlayer.iconHover;
    }
  }
}

function initBoardUi() {
  const cellEls = document.querySelectorAll(".cell");
  [...cellEls].forEach((el) => {
    boardUi[el.dataset.i][el.dataset.j] = el.querySelector("img");
  });
}
