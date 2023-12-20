<template>
  <RouterView />
  <ReloadPrompt />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import config from "@/config";
import ReloadPrompt from "@/components/ReloadPrompt.vue";

console.log("Config url", config.apiUrl);
</script>

<style lang="postcss" scoped></style>
