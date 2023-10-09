const { createClient } = require("redis");
const client = createClient();
const { GameRoom, RoundState, Player } = require("./define-obj");
const { json } = require("express");

async function initialize() {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
}

function poundName(name) {
  return name.replace(/\s/g, "#");
}

function dePoundName(name) {
  return name.replace(/#/g, " ");
}

async function roomExists(room) {
  return await client.sIsMember("active-rooms", room);
}

async function setNewRoom(room) {
  await client.sAdd("active-rooms", room);

  const gameRoom = new GameRoom();
  await client.json.set("game-rooms", `.${room}`, gameRoom);
  // let asdf = await client.json.get("game-rooms", { path: `.${room}` });
  //   console.log(asdf);
}

async function nameExists(req) {
  const keys = await client.json.objKeys("game-rooms", `.${req.room}.players`);
  return keys.includes(poundName(req.name));
}

async function addPlayer(req) {
  const numCurrentPlayers = await client.json.objLen(
    "game-rooms",
    `.${req.requestedRoom}.players`
  );

  // const currentPlayerOne = await client.json.get(
  //   "game-rooms",
  //   `.${req.requestedRoom}.playerOne`
  // );
  // // TESETETSTESTESTTETSSTESETSETSETSESTESTESE
  // const isPlayerOne =
  //   currentPlayerOne == poundName(req.playerName) || !numCurrentPlayers;

  const isPlayerOne = !numCurrentPlayers;

  const player = new Player();
  await client.json.set(
    "game-rooms",
    `.${req.requestedRoom}.players.${poundName(req.playerName)}`,
    player
  );

  // await client.json.arrAppend(
  //   "game-rooms",
  //   `.${req.requestedRoom}.playerList`,
  //   `${req.playerName}`
  // );

  if (isPlayerOne) {
    await client.json.set(
      "game-rooms",
      `.${req.requestedRoom}.playerOne`,
      `${req.playerName}`
    );
  }

  return { isPlayerOne: isPlayerOne };
}

async function removePlayer(req) {
  await client.json.del(
    "game-rooms",
    `.${req.gameRoom}.players.${poundName(req.playerName)}`
  );

  if (req.isPlayerOne) {
    const listCurrentPlayers = await client.json.objKeys(
      "game-rooms",
      `.${req.gameRoom}.players`
    );

    var newPlayerOne = listCurrentPlayers[0] || null;
    newPlayerOne = newPlayerOne ? dePoundName(newPlayerOne) : newPlayerOne;

    await client.json.set(
      "game-rooms",
      `.${req.gameRoom}.playerOne`,
      `${req.newPlayerOne}`
    );
    return { newPlayerOne: newPlayerOne };
  }
  return { newPlayerOne: null };
}

module.exports = {
  initialize,
  roomExists,
  setNewRoom,
  nameExists,
  addPlayer,
  removePlayer,
};
