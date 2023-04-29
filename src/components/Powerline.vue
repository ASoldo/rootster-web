<template>
  <div style="height: 24px;" class="flex justify-between backdrop-blur-2xl">
    <ul class="flex list-none">
      <li class="">
        <PowerBox p_box_color="whitesmoke" p_start_box_color="transparent" p_end_box_color="dodgerblue" p_icon="󰣇"
          p_text="Arch">
          <ul tabindex="0" class="dropdown-content menu w-56 bg-black-80">
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 3)" class="p-1">
                <span class="nf"></span>
                Neofetch
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 2)" class="p-1">
                <span class="nf"></span>
                Github Explorer
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 7)" class="p-1">
                <span class="nf">󰘑</span>
                ChatGPT
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 8)" class="p-1">
                <span class="nf">󰔥</span>
                Dall-E
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 5)" class="p-1">
                <span class="nf"></span>
                Spline
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 9)" class="p-1">
                <span class="nf">󱇚</span>
                IsoMap
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 10)" class="p-1">
                <span class="nf">󰳤</span>
                ChillCraft
              </a>
            </li>
            <li class="hover:bg-primary">
              <a @click.prevent="gotolink('openApp', 11)" class="p-1">
                <span class="nf">󰑱</span>
                Satellite
              </a>
            </li>
          </ul>
        </PowerBox>
      </li>

      <li style="height: 24px;" class="">
        <PowerBox p_box_color="dodgerblue" p_start_box_color="dodgerblue" p_end_box_color="transparent" p_icon=""
          :p_text="prop.app?.navigation[0]?.label ? prop.app?.navigation[0]?.label : '~'" :p_href="prop.app?.id" />
      </li>
      <!-- <li class=""> -->
      <!--   <PowerBox p_box_color="yellow" p_start_box_color="yellow" p_end_box_color="cyan" p_icon="" -->
      <!--     p_text="Go Chi Blog API" /> -->
      <!-- </li> -->
      <!-- <li class=""> -->
      <!--   <PowerBox p_box_color="cyan" p_start_box_color="cyan" p_end_box_color="transparent" p_icon="" p_text="main" /> -->
      <!-- </li> -->

      <!-- <li> -->
      <!--   <span id="cursor" class="p-2 shrinkable"> -->
      <!--     <u> cd Documents/Go Chi Blog API</u> -->
      <!--   </span> -->
      <!-- </li> -->
    </ul>
    <ul class="flex list-none">
      <!-- <li class=""> -->
      <!--   <PowerBox p_box_color="cyan" p_start_box_color="transparent" p_end_box_color="cyan" p_icon="" p_text="" /> -->
      <!-- </li> -->
      <!-- <li class=""> -->
      <!--   <PowerBox p_box_color="limegreen" p_start_box_color="cyan" p_end_box_color="limegreen" p_icon="" p_text="Go" /> -->
      <!-- </li> -->
      <li class="">
        <PowerBox p_box_color="whitesmoke" p_start_box_color="transparent" p_end_box_color="transparent" p_icon=""
          :p_text="`${hours}:${minutes}:${seconds}`" />
      </li>
    </ul>
  </div>
</template>


<script lang="ts" setup>
import { defineEmits, ref, onMounted } from "vue";
import PowerBox from "./PowerBox.vue";
const emit = defineEmits(['openApp'])
const prop = defineProps({
  app: {
    type: Object,
    required: false,
  }
})

const timeNow = ref(new Date());
const hours = ref(timeNow.value.getHours());
const minutes = ref(timeNow.value.getMinutes());
const seconds = ref(timeNow.value.getSeconds());
onMounted(() => {
  setInterval(() => {
    timeNow.value = new Date();
    hours.value = timeNow.value.getHours();
    minutes.value = timeNow.value.getMinutes();
    seconds.value = timeNow.value.getSeconds();
  }, 1000);
})
const gotolink = (emit_name: any, emit_data: any) => {
  emit(emit_name, emit_data);
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }, 100)
}
</script>

<style lang="postcss">
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
    background: #222
  }

  50% {
    background: lime
  }

  100% {
    background: #222
  }
}

@keyframes blink {
  0% {
    background: #222
  }

  50% {
    background: lime
  }

  100% {
    background: #222
  }
}
</style>

