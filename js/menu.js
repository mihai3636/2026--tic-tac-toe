const btnNewGamePlayerEl = document.getElementById("btnNewGamePlayer");
const btnNewGameCpuEl = document.getElementById("btnNewGameCpu");

export function initMenu({ onNewGamePlayer, onNewGameCpu }) {
  btnNewGamePlayerEl.addEventListener("click", (ev) => {
    onNewGamePlayer();
  });

  btnNewGameCpuEl.addEventListener("click", (ev) => {
    onNewGameCpu();
  });
}
