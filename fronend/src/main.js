// import Vue from "vue";
import Vue from "vue/dist/vue.js";
import App from "./App.vue";
import VueRouter from "vue-router";
import Socket from "@/socket";
import routes from "@/services/routes";

Vue.use(VueRouter);
Vue.use(Socket);

const router = new VueRouter({
  mode: "history",
  routes,
});

Vue.use(router);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
