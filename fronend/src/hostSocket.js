import { reactive } from "vue";
import { io } from "socket.io-client";
import { HostState, Player } from "@/services/define-obj";

const URL =
  process.env.NODE_ENV == "production"
    ? "ws://localhost:3000"
    : `ws://${window.location.hostname}:3000`;
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

class HostSocket {
  constructor() {
    this.state = reactive(new HostState());
  }

  socket;

  connect(room) {
    this.socket = io(URL, { transports: ["websocket"] });
    this.socket.emit("join-room", room);
    // this.socket.join(room);

    this.socket.on("connect", () => {
      this.state.room = room;
      this.state.connected = this.socket.connected;
    });

    this.socket.on("disconnect", () => {
      this.state.connected = this.socket.connected;
    });

    // listen for events from the server
    this.socket.on("my broadcast", (msg) => {
      this.state.message = msg;
    });

    this.socket.on("player-joined", (newPlayer) => {
      const player = new Player(newPlayer);
      this.state.players.push(player);
    });

    this.socket.on("player-left-game", (req) => {
      if (req.newPlayerOne) {
        const playerIndex = this.state.players.findIndex(
          (player) => player.playerName == req.newPlayerOne
        );
        this.state.players[playerIndex].isPlayerOne = true;
      }

      this.state.players = this.state.players.filter(
        (el) => el.playerName != req.leftPlayerName
      );
    });

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
      this.state.connected = this.socket.connected;
    });
  }

  emitMessage(message) {
    // send event to the server
    this.socket.emit("my message", this.state.room, message);
  }

  restoreState(storedSocket) {
    for (const key in storedSocket) {
      if (!key === "room") {
        this.state[key] = storedSocket[key];
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      //   this.state.connected = false;
    }
  }
}

export default new HostSocket();
