const mainEl = document.querySelector("main");

const btnWinnerQuit = document.getElementById("btnWinnerQuit");
const btnWinnerNextRound = document.getElementById("btnWinnerNextRound");

const btnTieQuit = document.getElementById("btnTieQuit");
const btnTieNextRound = document.getElementById("btnTieNextRound");

const btnRestartEl = document.getElementById("btnRestart");
const btnRestartCancel = document.getElementById("btnRestartCancel");
const btnRestartYes = document.getElementById("btnRestartYes");

export function initModalWinner({ onNextRound, onQuit }) {
  btnWinnerQuit.addEventListener("click", (ev) => {
    onQuit();

    hideModalsUi();
    clearWinnerModalUi();
  });

  btnWinnerNextRound.addEventListener("click", (ev) => {
    onNextRound();

    hideModalsUi();
    clearWinnerModalUi();
  });
}

export function initModalTie({ onNextRound, onQuit }) {
  btnTieQuit.addEventListener("click", (ev) => {
    onQuit();
    hideModalsUi();
  });

  btnTieNextRound.addEventListener("click", (ev) => {
    onNextRound();
    hideModalsUi();
  });
}

export function initModalRestart(onRestart) {
  btnRestartEl.addEventListener("click", (ev) => {
    showRestartUi();
  });

  btnRestartCancel.addEventListener("click", (ev) => {
    hideModalsUi();
  });

  btnRestartYes.addEventListener("click", (ev) => {
    onRestart();
    hideModalsUi();
  });
}

export function updateModalWinnerUi({ players, winner }) {
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

export function updateModalTiesUi() {
  mainEl.classList.add("modal--on");
  mainEl.classList.add("modal--equal");
}

function hideModalsUi() {
  let classes = [...mainEl.classList];
  classes.forEach((className) => {
    if (className.startsWith("modal--")) {
      mainEl.classList.remove(className);
    }
  });
}

function clearWinnerModalUi() {
  let modalEl = document.getElementById("modalWinner");
  modalEl.classList.remove("modal--wins-x");
  modalEl.classList.remove("modal--wins-o");
}

function showRestartUi() {
  mainEl.classList.add("modal--on");
  mainEl.classList.add("modal--restart");
}
