<template>
  <div class="flex flex-col min-h-screen">
    <Powerline :app="data" class="fixed top-0 w-full z-50 text-white" @open-app="open($event)" ref="Powerlineref" />
    <HomeView @navigation="dataCheck($event)" class="flex-grow overflow-hidden pt-8 z-40 p-1" ref="Homeref" />
    <Footer class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white" />
    <div data-aos="fade-in" class="animated-bg w-full h-full fixed">
      <div class="w-full h-full backdrop-blur-2xl" style="background-color: rgba(0, 0, 0, 0.8);"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router"
import { ref } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeView from "./HomeView.vue";
import Powerline from "@/components/Powerline.vue";
import Footer from "@/components/Footer.vue";
import { useCounterStore } from '@/stores/counter'

// access the `store` variable anywhere in the component ✨
const store = useCounterStore();
AOS.init();


const Homeref = ref<InstanceType<typeof HomeView>>();
const Powerlineref = ref<InstanceType<typeof Powerline>>();
const open = (e: number) => {
  Homeref.value?.openApp(e);
}
const data = ref()
const dataCheck = (nav_data: {}) => {
  console.log("Nav data:", nav_data);
  data.value = nav_data;
}
</script>
<style lang="postcss" scoped>
.animated-bg {
  background-image: url("https://i.giphy.com/media/hugQmENCWTyPM3yG5D/giphy.webp");
  background-size: cover;
  @apply bg-gray-900;
}
</style>
