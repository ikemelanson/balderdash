import { reactive } from "vue";
import { io } from "socket.io-client";
import { PlayerState } from "@/services/define-obj";

const URL =
  process.env.NODE_ENV == "production"
    ? "ws://localhost:3000"
    : `ws://${window.location.hostname}:3000`;
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

class Socket {
  constructor() {
    this.state = reactive(new PlayerState());
  }

  socket;

  connect(request) {
    this.socket = io(URL, { transports: ["websocket"] });

    this.socket.emit("join-room", request.requestedRoom);

    this.socket.on("connect", () => {
      this.state.room = request.requestedRoom;
      this.state.connected = this.socket.connected;
      if (request?.playerName) {
        this.socket.emit("add-player", request, (ack) => {
          this.state.isPlayerOne = ack.isPlayerOne;
        });
        this.state.name = request.playerName;
      }
    });

    this.socket.on("player-left-game", (req) => {
      if (req.newPlayerOne === this.state.name) {
        this.state.isPlayerOne = true;
      }
    });

    this.socket.on("disconnect", () => {
      this.state.connected = this.socket.connected;
      this.state = reactive(new PlayerState());
    });

    // listen for events from the server
    this.socket.on("my broadcast", (msg) => {
      // this.state.message = msg;
      console.log(msg);
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

  leaveGame() {
    this.socket.emit("player-leave-game", {
      gameRoom: this.state.room,
      playerName: this.state.name,
      isPlayerOne: this.state.isPlayerOne,
    });
  }

  restoreState(storedSocket) {
    for (const key in storedSocket) {
      if (key != "room" && key != "connected") {
        this.state[key] = storedSocket[key];
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      //   this.state.connected = false;
    }
  }
}

export default new Socket();
