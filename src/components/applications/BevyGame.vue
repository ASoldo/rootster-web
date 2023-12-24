<template>
  <div id="game-container">
    <canvas id="bevy-canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import init from "@/../public/bevy-game/bevy-game.js"; // Adjust the import path as needed

onMounted(async () => {
  try {
    await init();
  } catch (error: any) {
    if (!error.message.startsWith("Using exceptions for control flow,")) {
      throw error;
    }
  }
});

onBeforeUnmount(() => {
  // Handle any cleanup if necessary
});
</script>

<style scoped>
#game-container {
  /* Add styles for your game container if needed */
}
</style>
