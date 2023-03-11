import { createRouter, createWebHistory } from "vue-router";
import WrapperApp from "@/views/WrapperApp.vue";
import ChatGPT from "@/components/ChatGPT.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "desktop",
      component: WrapperApp
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatGPT
    }
  ]
})

export default router;
