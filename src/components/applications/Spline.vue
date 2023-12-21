<template>
  <div class="spline-embed">
    <div v-if="isLoading">Loading...</div>
    <iframe class="rounded-xl h-screen" ref="splineIframe" frameborder="0" width="100%" height="100%"
      @load="onIframeLoad" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const splineIframe = ref<HTMLIFrameElement>();
const isLoading = ref<boolean>(true);

onMounted((): void => {
  if (splineIframe.value) {
    splineIframe.value.src =
      "https://my.spline.design/miniroomartcopy-2b6b9ccdd303bc4143e6573fc1c351e7/";
  }
});

const onIframeLoad = (): void => {
  isLoading.value = false;
};
</script>
