<template>
  <div class="dropdown dropdown-bottom">
    <div class="flex powerbox cursor-pointer">
      <div class="powerbox-end"></div>
      <a tabindex="0" :href="`#${p_href}`">
        <div class="middlepart flex items-center text-white sm:w-10 lg:w-full">
          <span class="nf px-1 text-black sm:w-30">{{ p_icon }}</span>
          <span class="shrinkable text-black sm:w-30 hover:text-cyan-900"> {{ p_text }}</span>
        </div>
      </a>
      <div class="powerbox-start"></div>
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
const { p_box_color, p_start_box_color, p_end_box_color, p_icon, p_text, p_href } = defineProps({
  p_box_color: {
    type: String,
    required: true
  },
  p_start_box_color: {
    type: String,
    required: true
  },
  p_end_box_color: {
    type: String,
    required: true
  },
  p_icon: {
    type: String,
    required: true
  },
  p_text: {
    type: String,
    required: true
  },
  p_href: {
    type: Number,
    required: false
  }
})
</script>

<style scoped>
.nf:hover {
  color: black;
  cursor: pointer;
}

.shrinkable {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.powerbox {
  background-color: transparent;
}

.middlepart {
  background-color: v-bind(p_box_color);
  height: 100%;
  line-height: 1.5;
}

.powerbox-start {
  content: "";
  position: relative;
  width: 0;
  height: 0;
  border-top: 0.8em solid transparent;
  border-bottom: 0.8em solid transparent;
  border-left: 0.8em solid;
  border-left-color: v-bind(p_box_color);
  background-color: v-bind(p_end_box_color);
}

.powerbox-end {
  content: "";
  position: relative;
  width: 0;
  height: 0;
  border-top: 0.8em solid transparent;
  border-bottom: 0.8em solid transparent;
  border-right: 0.8em solid;
  border-right-color: v-bind(p_box_color);
  background-color: v-bind(p_start_box_color);
}
</style>
