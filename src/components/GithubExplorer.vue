<template>
  <ul class="list-none">
    <li :class="{ 'bg-black': i === selectedProject, 'text-white': i === selectedProject }"
      v-for="(i, key) in projectNames" :key="key"
      class="inline-block mr-1 my-1 px-1 text-black bg-blue-500 hover:text-white hover:bg-gray-900 cursor-pointer"
      @click="selectedProject = i">
      /{{ i }}
    </li>
  </ul>
  <ul class="text-white">
    <li>
      <a href="#" @click.prevent="handleItemClick({ name: '.', path: '', type: 'dir', url: '#' })">
        <span class="hidden md:inline-block">drwxr-xr-x 2 rootster rootster {{ hours }}:{{ minutes }}:{{ seconds }}
        </span>
        &nbsp;.
        <span class="nf"></span>
      </a>
    </li>
    <li v-if="path !== ''">
      <a href="#" @click.prevent="handleItemClick({ name: '..', path: getParentPath(), type: 'dir', url: '#' })">
        <span class="hidden md:inline-block">drwxr-xr-x 7 rootster rootster {{ hours }}:{{ minutes }}:{{ seconds }}
        </span>&nbsp;&nbsp;..
        <span class="nf">󰁭</span>
      </a>
    </li>
    <li v-for="item in items" :key="item.path">
      <a :href="item.type === 'dir' ? '#' : item.url" target="_blank" rel="noopener noreferrer"
        @click.prevent="handleItemClick(item)">
        <span>
          <span class="hidden md:inline-block" v-if="item.type == 'dir'">drwxr-xr-x 1 rootster rootster</span>
          <span class="hidden md:inline-block" v-else>-rw-r--r--&nbsp; 1 rootster rootster</span> {{ hours }}:{{
            minutes }}:{{ seconds }}</span> &nbsp;
        <span class="text-success">{{ item.name }}</span>
        &nbsp;
        <a v-if="item.type == 'dir'" :href="item.url" rel="noopener noreferrer" class="nf"></a>
      </a>
      <a v-if="item.type !== 'dir'" :href="item.url" target="_blank" rel="noopener noreferrer" class="nf"></a>
    </li>

    <div>
    </div>
  </ul>
  <!-- <div class="card bg-gray-700 " style="width: 100%;"> -->
  <!--   <div class="card-body bg-gray-700"> -->
  <!--     <div v-if="isLoading">Loading...</div> -->
  <!--     <div v-else v-html="readmeContent" class="text-red" -->
  <!--       style="color: red; font-size: 12px; text-align: left; overflow-wrap: break-word;"></div> -->
  <!--   </div> -->
  <!-- </div> -->
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import MarkdownIt from 'markdown-it';

interface GithubItem {
  name: string;
  path: string;
  type: 'dir' | 'file';
  url?: string;
}

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    default: '',
  },
});

const path = ref(props.path);
const items = ref<GithubItem[]>([]);
const timeNow = new Date();
const hours = timeNow.getHours();
const minutes = timeNow.getMinutes();
const seconds = timeNow.getSeconds();
const isLoading = ref<boolean>(true);
const readmeContent = ref<string>('');
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});
const projectNames = ['go-chi-blog-api', 'digital-arena-web'];
const selectedProject = ref(projectNames[0]);

const fetchItems = async () => {
  const response = await fetch(`https://api.github.com/repos/${props.username}/${selectedProject.value}/contents/${path.value}`);
  const data = await response.json();
  items.value = data.map((item: any) => ({
    name: item.name,
    path: item.path,
    type: item.type,
    url: item.type === 'file' ? item.html_url : undefined,
  }));
}

const handleItemClick = (item: GithubItem) => {
  if (item.type === 'dir') {
    if (item.name === '.') {
      path.value = '';
    } else if (item.name === '..') {
      path.value = getParentPath();
    } else {
      path.value = item.path;
    }
    fetchItems();
  }
}

const getParentPath = () => {
  const pathSegments = path.value.split('/');
  pathSegments.pop();
  return pathSegments.join('/');
}
const readMe = async () => {

  const repoUrl = `https://api.github.com/repos/${props.username}/${selectedProject.value}`;
  const readmeUrl = `https://api.github.com/repos/${props.username}/${selectedProject.value}/contents/README.md`;

  try {
    const repoResponse = await fetch(repoUrl);
    const repoData = await repoResponse.json();
    const readmeResponse = await fetch(readmeUrl);
    const readmeData = await readmeResponse.json();
    const readmeContentValue = atob(readmeData.content);
    readmeContent.value = md.render(readmeContentValue);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
});
watch(selectedProject, (newVal) => {
  path.value = '';
  readmeContent.value = '';
  isLoading.value = true;
  fetchItems();
  readMe();
});

fetchItems();
readMe();
</script>
<style scoped></style>
