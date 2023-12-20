<template>
  <div
    class="collapsible h-full bg-gray-800 my-2 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 hover:outline-cyan-500 outline hover:shadow-xl hover:bg-opacity-75">
    <div class="title flex justify-between items-center font-bold">
      <div class="flex items-center">
        <button class="nf z-100 close-btn rounded-md py-1 px-1 text-error font-bold" @click.stop="closeWindow">
          
        </button>
        <button :class="{ 'text-success': isCollapsed, 'text-warning': !isCollapsed }"
          class="nf collapse-btn rounded-md py-1 px-1 font-bold ml-2" @click="isCollapsed = !isCollapsed">
          {{ isCollapsed ? "" : "" }}
        </button>
        <span @click="isCollapsed = !isCollapsed" class="pl-2 text-white cursor-pointer">{{ title }}</span>
      </div>
    </div>
    <div v-show="!isCollapsed" class="content mt-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const { title, p_id } = defineProps<{
  title: string;
  p_id: number;
}>();
const isCollapsed = ref(false);
const emit = defineEmits(["close", "reset"]);

const closeWindow = () => {
  // Close the window
  emit("close", p_id);
  emit("reset");
};
</script>

<style></style>
