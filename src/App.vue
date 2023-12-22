<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import config from "@/config";

console.log("Config url", config.apiUrl);
</script>

<style scoped></style>
