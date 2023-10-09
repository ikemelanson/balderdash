<template>
  <div>
    <div v-if="!socket?.state?.connected">
      <router-link to="/host">Host A Game</router-link><br />

      <input
        type="text"
        ref="nameInput"
        v-model="nameInput"
        placeholder="Your name here"
      />
      <span> {{ 12 - nameInput.length }}</span>
      <br />
      <input type="text" ref="roomInput" v-model="roomInput" />
      <button @click="connectSocket()">Join Game</button>
      <br />
    </div>
    <div v-else>
      <button v-if="socket?.state?.isPlayerOne">Start Game</button>

      <button @click="leaveGame()">Leave Game</button>

      <!-- <input v-if="socketConnected" v-model="name" type="text" />
            <button v-if="socketConnected" @click="emitMessage()">Send Message</button>
            <br /> -->
    </div>
    <br />

    {{ socket?.state }}
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Socket from "@/socket";
import API from "@/services/api";

export default {
  name: "landingPage",
  components: { RouterLink },
  data() {
    return {
      socket: null,
      name: "",
      nameInput: "",
      roomInput: null,
    };
  },
  methods: {
    async connectSocket() {
      this.socket = this.socket || Socket;

      const requestedRoom = this.$refs.roomInput.value;
      const { roomIsActive } = await API.roomIsActive(requestedRoom);
      if (roomIsActive) {
        const playerName = this.$refs.nameInput.value;
        const { nameExists } = await API.nameExists({
          room: requestedRoom,
          name: playerName,
        });
        if (!nameExists) {
          this.socket.connect({
            requestedRoom: requestedRoom,
            playerName: playerName,
          });
        } else {
          this.$emit("show-alert", `${playerName} already taken`);
        }
      } else {
        this.$emit("show-alert", `Game room ${requestedRoom} not found`);
      }
    },
    emitMessage() {
      this.socket.emitMessage(this.name);
    },
    storeSocket() {
      if (this?.socket?.state?.connected) {
        sessionStorage.setItem("socket", JSON.stringify(this.socket.state));
        this.socket.disconnect();
      }
    },
    leaveGame() {
      this.socket.leaveGame();
      const storedSocket = sessionStorage.getItem("socket");
      if (storedSocket) {
        sessionStorage.removeItem("socket");
      }
      this.socket.disconnect();
    },
  },
  watch: {
    "socket.state.connected"(isConnected) {
      if (isConnected) {
        this.$emit(
          "show-alert",
          `Now connected to game room ${this.socket.state.room}`
        );
        // TODO: add else if to check if game is still in progress and to retry connection
        //TODO: add else to check if they purposfully left the game
      } else {
        setTimeout(() => {
          this.$emit("show-alert", `Connection failed, please try again`);
        }, 750);
      }
    },
    nameInput(name) {
      name = name.slice(0, 12);
      if (name.slice(0, 1) == " ") {
        name = name.slice(1, name.length);
      }
      name = name.toUpperCase();
      name = name.replace(/[^A-Z -]/g, "");
      this.nameInput = name;
    },
    roomInput(room) {
      room = room.slice(0, 4);
      room = room.toUpperCase();
      room = room.replace(/[^A-Z -]|\s/g, "");
      this.roomInput = room;
    },
  },
  computed: {
    message() {
      return this?.socket?.state?.message;
    },
  },

  created() {
    window.addEventListener("beforeunload", this.storeSocket);
  },
  async mounted() {
    const storedSocket = JSON.parse(sessionStorage.getItem("socket"));
    if (storedSocket) {
      const { room } = storedSocket;
      const { roomIsActive } = await API.roomIsActive(room);
      //   TODO: add check if game is already done in if statement below
      if (roomIsActive) {
        this.socket = !this.socket && Socket;
        this.socket.restoreState(storedSocket);
        this.socket.connect({
          requestedRoom: room,
        });
      } else {
        this.$emit(
          "show-alert",
          `Could not restore game. Game room ${room} not found`
        );
        sessionStorage.removeItem("socket");
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.storeSocket);
  },
  emits: ["emitMessage"],
};
</script>
