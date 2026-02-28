const btnNewGamePlayerEl = document.getElementById("btnNewGamePlayer");

export function initMenu(onNewGamePlayer) {
  btnNewGamePlayerEl.addEventListener("click", (ev) => {
    onNewGamePlayer();
  });
}
