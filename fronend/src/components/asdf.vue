<template>
  <div>
    asdf {{ message }}
    <div>asdf {{ socketConnected }}</div>
  </div>
</template>

<script>
import Socket from "@/socket";

export default {
  name: "Asdf-comp",
  data() {
    return {
      socket: Socket,
    };
  },
  computed: {
    message() {
      return Socket.state.message;
    },
    socketConnected() {
      // fix reactivity issues.
      return this.socket.state.connected;
    },
  },
};
</script>
