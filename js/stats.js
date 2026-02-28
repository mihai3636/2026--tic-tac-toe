const turnEl = document.querySelector(".turn");
const mainEl = document.querySelector("main");

export const TURN_X = 0;
export const TURN_O = 1;

export function updateTurnUi(turn) {
  if (turn === TURN_X) {
    turnEl.classList.add("turn--x");
    turnEl.classList.remove("turn--o");
    return;
  }

  turnEl.classList.add("turn--o");
  turnEl.classList.remove("turn--x");
}

export function updateScoreUi(players, ties) {
  const scoreXEl = document.getElementById("scoreX");
  const scoreOEl = document.getElementById("scoreO");
  const tiesScoreEl = document.getElementById("ties");

  scoreXEl.textContent = players.find((p) => p.mark === "x").score;
  scoreOEl.textContent = players.find((p) => p.mark === "o").score;
  tiesScoreEl.textContent = ties;
}

export function updateGameStatusUi(status) {
  mainEl.dataset.state = `game-${status}`;
}

export function initPlayerScoreLabelsUi({ playerX, playerO }) {
  const labelPlayerX = document.getElementById("playerLabelX");
  const labelPlayerO = document.getElementById("playerLabelO");

  labelPlayerX.textContent = `P${playerX.id}`;
  labelPlayerO.textContent = `P${playerO.id}`;
}
