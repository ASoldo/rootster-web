<template>
  <div class="w-full mx-auto py-10 sm:px-1 lg:py-12 lg:px-8">
    <div class="rounded-lg overflow-hidden" v-if="api_key">
      <!-- Chat header -->
      <div class="bg-gray-800 px-4 py-3">
        <h2 class="text-lg font-medium text-white">Dall-E</h2>
      </div>
      <!-- Chat messages container -->
      <div class="px-4 py-5 sm:p-6 bg-gray-700">
        <div class="space-y-4">
          <!-- Previous chat messages -->
          <div v-for="(message, index) in messages" :key="index"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'">
            <div class="flex">

              <div class="flex-1">
                <div class="rounded-lg py-2 px-3 shadow-md hover:bg-gray-100"
                  :class="message.type === 'user' ? 'bg-green-300' : 'bg-blue-300'">
                  <div class="text-sm text-gray-800">
                    <div class="w-10 h-10 rounded-full mr-3 flex items-center justify-center "
                      :class="message.type === 'user' ? 'bg-green-500' : 'bg-blue-500'">
                      <img :src="message.type === 'user' ? userImage : botImage" alt="Avatar"
                        class="w-9 h-9 rounded-full">
                    </div> <span class="inline-block"> "{{ message.time }}"</span>
                  </div>
                  <div class="text-black">
                    <img v-if="message.type === 'bot' && message.image" :src="message.image" alt="Bot image"
                      class="w-full h-auto rounded-xl">
                    <div v-else>{{ message.text }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Current chat message -->
          <div class="flex justify-end">
            <div class="w-full">
              <div class="relative">
                <input v-model="query" type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-gray-600 text-white"
                  placeholder="Type your message here..." :disabled="!api_key" @keyup.enter="sendMessage">
                <div v-if="isSending" class="absolute right-2 top-2">
                  <div class="spinner"></div>
                </div>
                <button v-else
                  class="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4  btn btn-sm btn-circle"
                  @click="sendMessage" :disabled="!api_key"><span class="nf"></span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-white">Please set the API key to use the ChatGPT.</p>
      <div class="flex justify-end">
        <div class="w-full">
          <div class="relative">
            <input v-model.lazy="api_key" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Type your api key here...">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Configuration, OpenAIApi } from 'openai';

const api_key = ref('');
const isSending = ref(false);

const userImage = "https://imgs.search.brave.com/jPwJAFi4P_6r5N0Wbyvx03YXDjsup9iPeU8PoaJ2G7I/rs:fit:400:400:1/g:ce/aHR0cHM6Ly9taXJv/Lm1lZGl1bS5jb20v/bWF4LzgwMC8xKkI4/YzFFRDNRVl95YWE2/UEFXcURnTXcucG5n";
const botImage = "https://imgs.search.brave.com/vFVAD6WtlbsGS2luLnc3bOuXf3D4VHNh-mzLLaFV4gE/rs:fit:1200:1024:1/g:ce/aHR0cDovL3d3dy5u/ZXdkZXNpZ25maWxl/LmNvbS9wb3N0cGlj/LzIwMDkvMTEvdXNl/ci1pY29uXzI5MTcw/MC5qcGc";

const query = ref('');
const messages: any = ref([]);

watch(query, () => {
  isSending.value = false;
})

const sendMessage = async () => {
  const conf = new Configuration({
    apiKey: api_key.value,
  });
  const openai = new OpenAIApi(conf);
  if (query.value !== '') {
    messages.value.push({
      text: query.value,
      time: getTime(),
      type: 'user'
    });

    isSending.value = true;

    try {
      const response = await openai.createImage({
        prompt: query.value,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data.data[0].url;

      messages.value.push({
        image: imageUrl,
        time: getTime(),
        type: 'bot'
      });

    } catch (error) {
      console.error(error);
    }

    query.value = '';
    isSending.value = false;
  }
};
const getTime = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`;
};
</script>

<style>
.chat {
  display: flex;
}

.chat-image {
  flex-shrink: 0;
}

.chat-header {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.chat-bubble {
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 16px;
}

.chat-footer {
  font-size: 12px;
  margin-top: 4px;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: limegreen;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>

