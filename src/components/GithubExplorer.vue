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
  <div class="card bg-gray-700 my-4" style="width: 100%;">
    <div class="card-body bg-gray-700 rounded-2xl">
      <div class="card-title ">
        <span class="text-teal-500"> >man </span>
        <span class="text-white">
          {{ selectedProject }}
        </span>
      </div>
      <div v-if="isLoading">Loading...</div>
      <div v-else v-html="readmeContent" class="markdown"></div>
    </div>
  </div>
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
  typographer: true,
  breaks: true,
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

<style scoped>
.markdown {
  word-wrap: break-word;
}

.markdown ::v-deep a {
  color: turquoise;
}

.markdown ::v-deep li,
.markdown ::v-deep h1,
.markdown ::v-deep h2,
.markdown ::v-deep h3,
.markdown ::v-deep h4,
.markdown ::v-deep h5,
.markdown ::v-deep h6 {
  color: #fff;
}

.markdown ::v-deep h1 {
  font-size: 2rem;
}

.markdown ::v-deep h2 {
  font-size: 1.75rem;
}

.markdown ::v-deep h3 {
  font-size: 1.5rem;
}

.markdown ::v-deep h4 {
  font-size: 1.25rem;
}

.markdown ::v-deep h5 {
  font-size: 1rem;
}

.markdown ::v-deep h6 {
  font-size: 0.875rem;
}

.markdown ::v-deep p {
  margin: 1em 0;
  color: #fff;
}

.markdown ::v-deep img {
  max-width: 100%;
  display: inline-block;
  margin: 0 auto;
}

.markdown ::v-deep pre {
  background-color: #f6f8fa;
  padding: 1em;
  overflow-x: auto;
  color: white;
  background-color: black;
  border-radius: 15px;
}

.markdown ::v-deep code {
  font-family: 'Consolas', 'Courier New', monospace;
  color: #36D399;
  background-color: black;
  border-radius: 5px;
  padding: 2px;
}

.markdown blockquote {
  margin-left: 2em;
  color: #6a737d;
}

.markdown ::v-deep th {
  padding: 5px;
  color: white;
  outline: 1px solid white;
}

.markdown ::v-deep td {
  padding: 5px;
  color: white;
  outline: 1px solid white;
}
</style>

