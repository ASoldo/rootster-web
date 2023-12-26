<template>
  <div style="height: 24px" class="flex justify-between backdrop-blur-2xl">
    <ul class="flex">
      <li>
        <PowerBox @click="toggleDialog" p_box_color="whitesmoke" p_start_box_color="transparent"
          p_end_box_color="dodgerblue" p_icon="󰣇" p_text="Arch">
          <dialog :open="showDialog" class="absolute left-0 top-0 mt-6 ml-3 rounded-lg bg-transparent z-50">
            <ul class="bg-white shadow-xl flex flex-col pl-0 ml-0 justify-start">
              <li v-for="item in dropdownItems" :key="item.id" @click.prevent="gotolink(item.action, item.id)"
                class="hover:bg-primary hover:text-white">
                <a class="p-1">
                  <span class="nf">{{ item.icon }}</span>
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </dialog>
        </PowerBox>
      </li>

      <li style="height: 24px" class="">
        <PowerBox p_box_color="dodgerblue" p_start_box_color="dodgerblue" p_end_box_color="transparent" p_icon=""
          :p_text="prop.app?.navigation[0]?.label
              ? prop.app?.navigation[0]?.label
              : '~'
            " :p_href="prop.app?.id" />
      </li>
    </ul>
    <ul class="flex list-none">
      <li class="">
        <PowerBox p_box_color="whitesmoke" p_start_box_color="transparent" p_end_box_color="transparent" p_icon=""
          :p_text="`${hours}:${minutes}:${seconds}`" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from "vue";
import PowerBox from "./PowerBox.vue";

const dialog = ref<HTMLDialogElement>();
function toggleDialog() {
  showDialog.value = !showDialog.value;
  if (showDialog.value) dialog.value?.showModal();
  else dialog.value?.close();
}
const showDialog: Ref<boolean> = ref(false);
const dropdownItems = ref([
  { id: 3, label: "Neofetch", icon: "", action: "openApp" },
  { id: 2, label: "Github Explorer", icon: "", action: "openApp" },
  { id: 5, label: "Spline", icon: "", action: "openApp" },
  { id: 7, label: "ChatGPT", icon: "󰘑", action: "openApp" },
  { id: 8, label: "Dall-E", icon: "󰔥", action: "openApp" },
  { id: 9, label: "IsoMap", icon: "󱇚", action: "openApp" },
  { id: 10, label: "ChillCraft", icon: "󰳤", action: "openApp" },
  { id: 11, label: "Satellite", icon: "󰑱", action: "openApp" },
  { id: 12, label: "BevyPreview", icon: "🎮", action: "openApp" },
]);
const emit = defineEmits(["openApp"]);
const prop = defineProps({
  app: {
    type: Object,
    required: false,
  },
});

const timeNow = ref(new Date());
const padWithZero = (number: number) => String(number).padStart(2, "0");

const hours = ref(padWithZero(timeNow.value.getHours()));
const minutes = ref(padWithZero(timeNow.value.getMinutes()));
const seconds = ref(padWithZero(timeNow.value.getSeconds()));

onMounted(() => {
  setInterval(() => {
    timeNow.value = new Date();
    hours.value = padWithZero(timeNow.value.getHours());
    minutes.value = padWithZero(timeNow.value.getMinutes());
    seconds.value = padWithZero(timeNow.value.getSeconds());
  }, 1000);
});
/**
 * # gotolink
 * @param emit_name
 * @param emit_data
 * return void
 */
const gotolink = (emit_name: any, emit_data: any): void => {
  emit(emit_name, emit_data);
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};
</script>

<style scoped>
.shrinkable {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* blinking cursor */
#cursor::after {
  content: "‏‏‎ ‎‏‏‎ ‎";
  background: lime;
  -webkit-animation: blink 0.8s infinite;
  animation: blink 0.8s infinite;
}

@-webkit-keyframes blink {
  0% {
    background: #222;
  }

  50% {
    background: lime;
  }

  100% {
    background: #222;
  }
}

@keyframes blink {
  0% {
    background: #222;
  }

  50% {
    background: lime;
  }

  100% {
    background: #222;
  }
}
</style>
