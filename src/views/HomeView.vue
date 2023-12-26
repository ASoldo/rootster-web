<template>
  <div class="pb-8">
    <Window :id="app.id" @click="inspector(app)" class="fade-in" v-for="app in apps" :key="app.id"
      :title="app.name.toUpperCase()" @close="closeApp($event)" @reset="reset" :p_id="app.id">
      <pre class="nf text-green-500" data-prefix=""><code>{{ app.name }}</code></pre>
      <component :is="app.component" v-bind="app.props"></component>
    </Window>
  </div>
</template>
<script lang="ts" setup>
import { markRaw, Ref, ref, defineAsyncComponent } from "vue";
import Window from "@/components/system/Window.vue";
import { Application } from "@/internals/types";
import config from "@/config";

const apps: Ref<Array<Application>> = ref<Array<Application>>([]);

/**
 * Close Application by id
 * @param e id of the application
 * @returns void
 * @example
 * ```ts
 * closeApp(2)
 * ```
 */
const closeApp = (e: number): void => {
  apps.value = apps.value.filter((app) => app.id !== e);
};

const lastId = ref(0);

/**
 * Open Application by id
 * @param e id of the application
 * @returns void
 * @example
 * ```ts
 * openApp(2)
 * ```
 */
const openApp = (e: number): void => {
  switch (e) {
    case 2:
      const GithubExplorer = defineAsyncComponent(
        () => import("@/components/applications/GithubExplorer.vue"),
      );
      const github_explorer: Application = {
        id: ++lastId.value,
        name: "github-explorer",
        component: GithubExplorer,
        props: { username: "ASoldo", repo: "digital-arena-web" },
        navigation: [{ label: "Github-Explorer", path: "/" }],
      };
      apps.value.push(markRaw(github_explorer));
      break;
    case 3:
      const Neofetch = defineAsyncComponent(
        () => import("@/components/applications/Neofetch.vue"),
      );
      const neofetch: Application = {
        id: ++lastId.value,
        name: "neofetch",
        component: Neofetch,
        props: {},
        navigation: [{ label: "Neofetch", path: "/" }],
      };
      apps.value.push(markRaw(neofetch));
      break;

    case 5:
      const Spline = defineAsyncComponent(
        () => import("@/components/applications/Spline.vue"),
      );
      const spline: Application = {
        id: ++lastId.value,
        name: "spline",
        component: Spline,
        props: {},
        navigation: [{ label: "Spline", path: "/" }],
      };
      apps.value.push(markRaw(spline));
      break;

    case 7:
      const ChatGPT = defineAsyncComponent(
        () => import("@/components/applications/ChatGPT.vue"),
      );
      const chatgpt: Application = {
        id: ++lastId.value,
        name: "chat-gpt",
        component: ChatGPT,
        props: {},
        navigation: [{ label: "ChatGPT", path: "/" }],
      };
      apps.value.push(markRaw(chatgpt));
      break;
    case 8:
      const Dalle = defineAsyncComponent(
        () => import("@/components/applications/Dall-e.vue"),
      );
      const dalle: Application = {
        id: ++lastId.value,
        name: "dall-e",
        component: Dalle,
        props: {},
        navigation: [{ label: "Dall-E", path: "/" }],
      };
      apps.value.push(markRaw(dalle));
      break;
    case 9:
      const IsoMap = defineAsyncComponent(
        () => import("@/components/applications/IsoMap.vue"),
      );
      const isoMap: Application = {
        id: ++lastId.value,
        name: "iso-map",
        component: IsoMap,
        props: {},
        navigation: [{ label: "IsoMap", path: "/" }],
      };
      apps.value.push(markRaw(isoMap));
      break;

    case 10:
      const ChillCraft = defineAsyncComponent(
        () => import("@/components/applications/ChillCraft.vue"),
      );
      const chillCraft: Application = {
        id: ++lastId.value,
        name: "chill-craft",
        component: ChillCraft,
        props: {},
        navigation: [{ label: "ChillCraft", path: "/" }],
      };
      apps.value.push(markRaw(chillCraft));
      break;
    case 11:
      const Satelite = defineAsyncComponent(
        () => import("@/components/applications/Satellite.vue"),
      );
      const satelite: Application = {
        id: ++lastId.value,
        name: "satellite",
        component: Satelite,
        props: {},
        navigation: [{ label: "Satellite", path: "/" }],
      };
      apps.value.push(markRaw(satelite));
      break;
    case 12:
      const BevyGame = defineAsyncComponent(
        () => import("@/components/applications/BevyGame.vue"),
      );
      const bevy_preview: Application = {
        id: ++lastId.value,
        name: "bevy-game",
        component: BevyGame,
        props: {},
        navigation: [{ label: "BevyGame", path: "/" }],
      };
      apps.value.push(markRaw(bevy_preview));
      break;
  }
};

/**
 * Open Application by id
 * @param e id of the application
 * @returns void
 */
const inspector = (app: Application): void => {
  console.log("inspected ", app);
  emit("navigation", app);
  if (app.navigation) {
    for (let i = 0; i < app.navigation.length; i++) {
      console.log(app.navigation[i].label);
    }
  }
};

/**
 * Reset the navigation
 * @returns void
 * @example
 * ```ts
 * reset()
 * ```
 */
const reset = (): void => {
  emit("navigation", {
    id: 0,
    name: "",
    component: null,
    props: {},
    navigation: [{ label: "~", path: "/" }],
  });
};

const emit = defineEmits(["navigation"]);

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
