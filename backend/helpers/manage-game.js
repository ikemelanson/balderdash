const { roomExists } = require("./storage");

async function createGame() {
  const letters = [
    "B",
    "C",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "V",
    "W",
    "X",
    "Z",
  ];

  let gameCode;

  do {
    gameCode = "";
    for (let count = 0; count < 4; count++) {
      gameCode += letters[Math.floor(Math.random() * letters.length)];
    }
  } while (await roomExists(gameCode));

  return gameCode;
}

module.exports = {
  createGame,
};
