<template>
  <div>
    <iframe
      :src="url"
      class="w-[100%] h-[50vh] rounded-2xl overflow-hidden"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
const { url } = defineProps({
  url: {
    type: String,
    required: true,
    default: "http://localhost:5173/bevy",
  },
});
</script>

<style scoped>
#game-container {
}
</style>
