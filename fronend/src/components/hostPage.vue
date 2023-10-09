<template>
  <div>
    join room:
    <div>{{ room }}</div>
    <br />
    <div v-if="socket?.state">
      <div>
        <div v-for="player in socket.state.players" :key="player.playerName">
          {{ player.playerName }}
          <span v-if="player.isPlayerOne">-P1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HostSocket from "@/hostSocket";
import API from "@/services/api";

export default {
  name: "hostComponent",
  data() {
    return {
      socket: null,
      room: "",
    };
  },
  methods: {
    async createRoom() {
      this.socket = HostSocket;
      const { gameRoom } = await API.createGame();
      this.room = gameRoom;
      this.socket.connect(this.room);
    },
  },
  mounted() {
    this.createRoom();
  },
};
</script>
