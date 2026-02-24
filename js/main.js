"use strict";
console.log("Hello world!");

const inputOneEl = document.getElementById("cell-1");
const gameEl = document.querySelector(".game");

console.log(gameEl);

const playerX = {
  id: 1,
  iconChecked: "../assets/icon-x.svg",
  iconHover: "../assets/icon-x-outline.svg",
  mark: "x",
};

const playerO = {
  id: 2,
  iconChecked: "../assets/icon-o.svg",
  iconHover: "../assets/icon-o-outline.svg",
  mark: "o",
};

const players = [playerX, playerO];
const TURN_X = 0;
const TURN_O = 1;

let turn = TURN_X;
let currentPlayer = players[turn];

console.log(currentPlayer);

gameEl.addEventListener("change", (ev) => {
  console.log(ev.target.checked);
  console.log(ev.target);
  console.log(ev.currentTarget);
});

function switchPlayer() {
  turn = (turn + 1) % 2;
  currentPlayer = players[turn];
}
