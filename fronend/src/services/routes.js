import landingPage from "@/components/landingPage.vue";
import hostComponent from "@/components/hostPage.vue";

const routes = [
  { path: "/", component: landingPage },
  { path: "/host", component: hostComponent },
];

export default routes;
