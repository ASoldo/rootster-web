import { createRouter, createWebHistory } from "vue-router";
import WrapperApp from "@/views/WrapperApp.vue";
import ChatGPT from "@/components/applications/ChatGPT.vue";
import Satellite from "@/components/applications/Satellite.vue";
import ChillCraft from "@/components/applications/ChillCraft.vue";
import BevyGame from "@/components/applications/BevyGame.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "desktop",
      component: WrapperApp,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatGPT,
    },
    {
      path: "/satellite",
      name: "satellite",
      component: Satellite,
    },
    {
      path: "/chillcraft",
      name: "chillcraft",
      component: ChillCraft,
    },
    {
      path: "/bevy",
      name: "bevy-game",
      component: BevyGame,
    },
  ],
});

export default router;
