<template>
  <div class="flex flex-col min-h-screen">
    <ReloadPrompt />
    <Powerline :app="data" class="fixed top-0 w-full z-50 text-white" @open-app="open($event)" ref="Powerlineref" />
    <HomeView @navigation="dataCheck($event)" class="flex-grow overflow-hidden pt-8 z-40 p-1" ref="Homeref" />
    <Footer class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white" />
    <div data-aos="fade-in" class="animated-bg w-full h-full fixed" v-bind="{ style: randomWallpaperStyle }">
      <div class="w-full h-full backdrop-blur-2xl bg-black-80"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { RouterView, useRoute } from "vue-router"
import { ref, computed } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import Powerline from "@/components/Powerline.vue";
import HomeView from "@/views/HomeView.vue";
import ReloadPrompt from "@/components/ReloadPrompt.vue";
import Footer from "@/components/Footer.vue";
import { useCounterStore } from "@/stores/counter";

// access the `store` variable anywhere in the component ✨
const store = useCounterStore();
AOS.init();

const Homeref = ref<InstanceType<typeof HomeView>>();
const Powerlineref = ref<InstanceType<typeof Powerline>>();
const open = (e: number) => {
  Homeref.value?.openApp(e);
};
const data = ref<Object>();
const dataCheck = (nav_data: Object) => {
  console.log("Nav data:", nav_data);
  data.value = nav_data;
};
// 'https://i.giphy.com/media/hugQmENCWTyPM3yG5D/giphy.webp',
const wallpapers = ref([
  "https://media4.giphy.com/media/PLJeLzh6gfL2LhUIW0/giphy.gif?cid=ecf05e477sugdxwyz6o7a7kf4gr88b2pvimqubqkkpzl069j&ep=v1_gifs_related&rid=giphy.gif&ct=g",
  "https://media1.giphy.com/media/dJD4vdBsnt3WyGcYOd/giphy.gif?cid=ecf05e47fh0ekb09klnl0jvklumtk8aqtpmqtl123jfdrtep&ep=v1_gifs_related&rid=giphy.gif&ct=g",
  "https://media0.giphy.com/media/4bhs1boql4XVJgmm4H/giphy.gif?cid=ecf05e47dsqpsc8u15m3vyllu1hwvtjusjbtv4ely8w3ndzx&ep=v1_gifs_related&rid=giphy.gif&ct=g",
  "https://media1.giphy.com/media/XfD6tQ7yogtLdh7rdf/giphy.gif?cid=ecf05e47xcpv1x5447yyo00fmimru48ta9wm11z7yrvlnp3y&ep=v1_gifs_related&rid=giphy.gif&ct=g",
]);
const randomWallpaper = ref(
  wallpapers.value[Math.floor(Math.random() * wallpapers.value.length)],
);
const randomWallpaperStyle = computed(() => {
  return {
    backgroundImage: `url(${randomWallpaper.value})`,
  };
});
</script>
<style lang="postcss" scoped>
.animated-bg {
  background-size: cover;
  background-position: center;
  @apply bg-gray-900;
}
</style>
