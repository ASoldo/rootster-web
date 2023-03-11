<template>
  <div class="pb-8">
    <!-- @mouseover="inspector(app)" -->
    <Window :id="app.id" @click="inspector(app)" class="fade-in " v-for="app in apps" :key="app.id"
      :title="app.name.toUpperCase()" @close="closeApp($event)" @reset="reset" :p_id="app.id">
      <pre class="nf text-success" data-prefix=""><code>{{ app.name }}</code></pre>
      <component :is="app.component" v-bind="app.props"></component>
    </Window>

  </div>
</template>
<script lang="ts" setup>
import { DefineComponent, markRaw, Ref, ref, defineExpose, defineAsyncComponent } from "vue";
import Window from "@/components/Window.vue";

interface NavigationItem {
  label: string,
  path: string
}

interface Application {
  id: number,
  name: string,
  component: DefineComponent<any, any, any>,
  props: Record<string, any>,
  events?: Record<string, (...args: any[]) => void>,
  navigation?: NavigationItem[]
}

const apps: Ref<Application[]> = ref([]);
const closeApp = (e: number) => {
  apps.value = apps.value.filter((app) => app.id !== e);
}
let lastId = 0;
const openApp = (e: number) => {
  switch (e) {

    case 2:
      const GithubExplorer = defineAsyncComponent(() => import("@/components/GithubExplorer.vue"))
      const github_explorer: Application = {
        id: ++lastId, name: "github-explorer", component: GithubExplorer, props: { username: "ASoldo", repo: "digital-arena-web" }, navigation: [
          { label: 'Github-Explorer', path: '/' },
        ]
      };
      apps.value.push(markRaw(github_explorer));
      break;
    case 3:
      const Neofetch = defineAsyncComponent(() => import("@/components/Neofetch.vue"))
      const neofetch: Application = {
        id: ++lastId, name: "neofetch", component: Neofetch, props: {}, navigation: [
          { label: 'Neofetch', path: '/' },
        ]
      };
      apps.value.push(markRaw(neofetch));
      break;

    case 5:
      const Spline = defineAsyncComponent(() => import("@/components/Spline.vue"))
      const spline: Application = {
        id: ++lastId, name: "spline", component: Spline, props: {}, navigation: [
          { label: 'Spline', path: '/' },
        ]
      };
      apps.value.push(markRaw(spline));
      break;

    case 7:
      const ChatGPT = defineAsyncComponent(() => import("@/components/ChatGPT.vue"))
      const chatgpt: Application = {
        id: ++lastId, name: "chat-gpt", component: ChatGPT, props: {}, navigation: [
          { label: 'ChatGPT', path: '/' },
        ]
      };
      apps.value.push(markRaw(chatgpt));
      break;
    case 8:
      const Dalle = defineAsyncComponent(() => import("@/components/Dall-e.vue"))
      const dalle: Application = {
        id: ++lastId, name: "dall-e", component: Dalle, props: {}, navigation: [
          { label: 'Dall-E', path: '/' },
        ]
      };
      apps.value.push(markRaw(dalle));
      break;
  }
}
const inspector = (app: Application) => {
  console.log("inspected ", app);
  emit("navigation", app);
  if (app.navigation) {
    for (let i = 0; i < app.navigation.length; i++) {
      console.log(app.navigation[i].label);
    }
  }
}

const reset = () => {

  emit("navigation", {
    id: ++lastId, name: "chess", component: null, props: {}, navigation: [
      { label: '~', path: '/' },
    ]
  });
}

const emit = defineEmits(['navigation'])

defineExpose({
  openApp,
});
</script>

<style scoped lang="postcss">
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
