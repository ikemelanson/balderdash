const manageGame = require("./helpers/manage-game");
const manageStorage = require("./helpers/storage");

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true })); // if passing data in url
const cors = require("cors");

// const corsOrigins = [
//   "http://localhost:8000",
//   "http://localhost:8080",
//   "^((25[0-5]|(2[0-4]|1d|[1-9]|)d).?\b){4}$",
//   "http://192.168.86.22:3000",
// ];
const corsOrigins = "*";
app.use(
  cors({
    origin: corsOrigins,
  })
);
// const http = require("http").createServer(app);
const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const io = require("socket.io")(server, {
  cors: {
    origins: corsOrigins,
  },
});

manageStorage.initialize();
const port = 3000;

app.get("/", async (req, res) => {
  // let storage = await Storage.getItem("game-rooms");
  // Storage.setItem("game-rooms[asdf]", "testest");
  // let storage = await Storage.getItem("game-rooms.asdf");
  let storage = await manageStorage.roomExists("asdf");
  res.json({ storage });
});

app.get("/create-game", async (req, res) => {
  let gameRoom = await manageGame.createGame();
  await manageStorage.setNewRoom(gameRoom);
  res.json({ gameRoom });
});

app.get("/active-rooms", async (req, res) => {
  let activeRooms = await manageStorage.getActiveRooms(Storage);

  res.json({ activeRooms });
});

app.get("/is-active-room/:room", async (req, res) => {
  const room = req.params.room;
  const roomIsActive = await manageStorage.roomExists(room);
  res.json({ roomIsActive });
});

app.get("/name-exists/:room/:name", async (req, res) => {
  const request = req.params;
  const nameExists = await manageStorage.nameExists(request);
  res.json({ nameExists });
});

io.on("connection", (socket) => {
  // console.log("a user connected");

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("add-player", async (req, callback) => {
    const ack = await manageStorage.addPlayer(req);
    callback(ack);
    io.to(req.requestedRoom).emit("player-joined", {
      name: req.playerName,
      ...ack,
    });
  });

  socket.on("player-leave-game", async (req) => {
    const { newPlayerOne } = await manageStorage.removePlayer(req);
    io.to(req.gameRoom).emit("player-left-game", {
      newPlayerOne: newPlayerOne,
      leftPlayerName: req.playerName,
    });
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  socket.on("my message", (room, msg) => {
    io.to(room).emit("my broadcast", `${msg}`);
  });
});

server.listen(port, () => console.log(`Listening on ${port}`));
