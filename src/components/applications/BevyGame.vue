<template>
  <div class="w-[100dvw] h-[100dvh]">
    <canvas ref="canvasRef" :id="canvas_id"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import init, { initialize_game, set_exit_flag } from "@/bevy-game/bevy-game.js";

const canvas_id = ref<string>(
  "bevy-canvas" + Math.random().toString(36).substring(7),
);
const canvasRef = ref<HTMLCanvasElement>();

const init_game = async () => {
  try {
    console.log("Initializing BevyGame");
    await init();
  } catch (error: any) {
    if (!error.message.startsWith("Using exceptions for control flow,")) {
      throw error;
    }
  }
  try {
    initialize_game("#" + canvas_id.value);
  } catch (error: any) {
    if (!error.message.startsWith("Using exceptions for control flow,")) {
      throw error;
    }
  }
  console.log("Finished Loading BevyGame");
};
// await init_game();

onMounted(async () => {
  await init_game();
});

onBeforeUnmount(() => {
  console.log("Unmounting BevyGame");
  console.log(canvasRef.value?.getAttribute("id"));
  canvasRef.value?.removeAttribute("id");
  set_exit_flag();
});
</script>

<style scoped>
#game-container {}
</style>
