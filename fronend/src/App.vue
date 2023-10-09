<template>
  <div id="app">
    <alert v-if="alertMessage" :message="alertMessage"></alert>
    <router-view @show-alert="showAlert"></router-view>
  </div>
</template>
<script>
import { RouterView } from "vue-router";
import Alert from "./components/player/alert.vue";

export default {
  name: "App",
  components: { RouterView, Alert },
  data() {
    return {
      alertMessage: "",
    };
  },
  methods: {
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.hideAlert();
      }, 2000);
    },
    hideAlert() {
      this.alertMessage = "";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
