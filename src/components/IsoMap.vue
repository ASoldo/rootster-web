<template>
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
    <div style="position: relative; width: 1024px; height: 512px;">
      <canvas ref="canvas" style="position: absolute; width: 100%"></canvas>
      <canvas ref="effectsCanvas" @mousemove="onMouseMove" @click="onClick"
        style="position: absolute; width: 100%;"></canvas>

    </div>
  </div>
  <div class="assets-list">
    <button class="asset-button" v-for="(asset, index) in assets" :key="index" @click="changeSelectedAsset(asset)">
      <img :src="asset" class="asset-image" />
      <span class="asset-text">Asset {{ index + 1 }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const effectsCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const effectsCtx = ref<CanvasRenderingContext2D | null>(null);
let assets = [
  'https://j-img.game8.co/1652101/d871d2ac249bd68df04e43bfd4b36b42.png/show?1527556487',
  'https://j-img.game8.co/1652100/af09bf9e33303c806007ab4989d61ca1.png/show?1527556487',
  'https://j-img.game8.co/1652118/2640777db1eb11b87e95172adc11324d.png/show?1527556488',
  'https://j-img.game8.co/1863178/20a479afd2a16b4ad008ca4ba408ea87.png/show?1534398556',
  'https://j-img.game8.co/1862009/386c356ec3f08caedebcff6c5e60ed56.png/show?1534384966',
  'https://j-img.game8.co/1652340/b90bbcd2a79d87ded1161d482f4bb62c.png/show?1527556504',
  'https://j-img.game8.co/1652245/c3d88fb25c923f5f25714fa8b98f8972.png/show?1527556498',
];
const state = reactive({
  paddingLeftRight: 0,
  paddingTopBottom: -24,
  imgWidth: 0,
  imgHeight: 0,
  gridWidth: 28,
  gridHeight: 28,
  offsetXCenter: 0,
  offsetYCenter: 0,
});
const changeSelectedAsset = (asset: string) => {
  selectedAsset.value = asset;
};
const selectedAsset = ref(assets[0]);
const preloadAssets = async () => {
  const loadedAssets = await Promise.all(assets.map((src) => loadImage(src)));
  const assetMap = new Map(assets.map((src, i) => [src, loadedAssets[i]]));
  return assetMap;
};

const assetMap = reactive(new Map());

const createBoard = () => {
  const board = [];
  for (let row = 0; row < state.gridHeight; row++) {
    const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
    const rowData = [];
    for (let col = 0; col < cellsInRow; col++) {
      rowData.push({
        asset: assets[Math.floor(Math.random() * assets.length)],
      });
    }
    board.push(rowData);
  }
  return board;
};

const board = reactive(createBoard());

const loadImage = async (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

const drawScene = () => {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

  for (let row = 0; row < state.gridHeight; row++) {
    const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
    const offsetXForRow = state.imgWidth / 2 * (state.gridHeight - cellsInRow * 2);

    for (let col = 0; col < cellsInRow; col++) {
      const img = assetMap.get(board[row][col].asset);

      const x = state.offsetXCenter + offsetXForRow / 2 + col * (state.imgWidth + state.paddingLeftRight * 2) + state.paddingLeftRight;
      const y = state.offsetYCenter + row * (state.imgHeight + state.paddingTopBottom * 2) + state.paddingTopBottom;
      ctx.value!.drawImage(img!, x, y, state.imgWidth, state.imgHeight);
    }
  }
};

const hoveredCell = reactive({ row: -1, col: -1 });

const pointInHexagon = (px: number, py: number, x: number, y: number, width: number, height: number, scaleX: number, scaleY: number) => {
  const q2x = (px - x) * scaleX;
  const q2y = (py - y) * scaleY;
  let s = false;

  for (let i = 0, j = 5; i < 6; j = i++) {
    const qx = width * Math.cos((2 * Math.PI * i) / 6) / 2;
    const qy = height * Math.sin((2 * Math.PI * i) / 6) / 4;
    const q2 = width * Math.cos((2 * Math.PI * j) / 6) / 2;
    const q3 = height * Math.sin((2 * Math.PI * j) / 6) / 4;

    if ((((qy <= q2y) && (q2y < q3)) || ((q3 <= q2y) && (q2y < qy))) && (q2x < (q2 - qx) * (q2y - qy) / (q3 - qy) + qx)) {
      s = !s;
    }
  }
  return s;
};


const onMouseMove = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const scaleFactorX = canvas.value!.width / rect.width;
  const scaleFactorY = canvas.value!.height / rect.height;
  const x = (event.clientX - rect.left) * scaleFactorX;
  const y = (event.clientY - rect.top) * scaleFactorY;
  let found = false;

  for (let row = 0; row < state.gridHeight; row++) {
    const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
    const offsetXForRow = state.imgWidth / 2 * (state.gridHeight - cellsInRow * 2);

    for (let col = 0; col < cellsInRow; col++) {
      const cellX = state.offsetXCenter + offsetXForRow / 2 + col * (state.imgWidth + state.paddingLeftRight * 2) + state.paddingLeftRight;
      const cellY = state.offsetYCenter + row * (state.imgHeight + state.paddingTopBottom * 2) + state.paddingTopBottom;

      if (pointInHexagon(x, y, cellX + state.imgWidth / 1.7, cellY + state.imgHeight / 1.7 - 25, state.imgWidth, state.imgHeight, scaleFactorX, scaleFactorY)) {
        hoveredCell.row = row;
        hoveredCell.col = col;
        found = true;
        break; // Stop searching after the first hexagon is found
      }
    }
    if (found) {
      break;
    }
  }

  if (!found) {
    hoveredCell.row = -1;
    hoveredCell.col = -1;
  }

  drawEffects();
};

const onClick = (event: MouseEvent) => {
  if (hoveredCell.row >= 0 && hoveredCell.col >= 0) {
    // Update the asset for the clicked cell
    board[hoveredCell.row][hoveredCell.col].asset = selectedAsset.value;

    // Redraw the scene
    drawScene();
  }
};
const drawEffects = () => {
  if (!effectsCtx.value) return;
  effectsCtx.value.clearRect(0, 0, effectsCanvas.value!.width, effectsCanvas.value!.height);

  for (let row = 0; row < state.gridHeight; row++) {
    const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
    const offsetXForRow = state.imgWidth / 2 * (state.gridHeight - cellsInRow * 2);

    for (let col = 0; col < cellsInRow; col++) {
      const x = state.offsetXCenter + offsetXForRow / 2 + col * (state.imgWidth + state.paddingLeftRight * 2) + state.paddingLeftRight;
      const y = state.offsetYCenter + row * (state.imgHeight + state.paddingTopBottom * 2) + state.paddingTopBottom;

      // Draw the hover effect
      if (hoveredCell.row === row && hoveredCell.col === col) {
        effectsCtx.value.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        effectsCtx.value.beginPath();
        effectsCtx.value.moveTo(x + state.imgWidth / 2, y);
        effectsCtx.value.lineTo(x + state.imgWidth, y + state.imgHeight / 4);
        effectsCtx.value.lineTo(x + state.imgWidth, y + state.imgHeight * 3 / 4);
        effectsCtx.value.lineTo(x + state.imgWidth / 2, y + state.imgHeight);
        effectsCtx.value.lineTo(x, y + state.imgHeight * 3 / 4);
        effectsCtx.value.lineTo(x, y + state.imgHeight / 4);
        effectsCtx.value.closePath();
        effectsCtx.value.stroke();
      }
    }
  }
};

onMounted(async () => {
  if (!canvas.value || !effectsCanvas.value) return;
  ctx.value = canvas.value.getContext('2d');
  effectsCtx.value = effectsCanvas.value.getContext('2d');
  canvas.value.width = 1024;
  canvas.value.height = 512;
  effectsCanvas.value.width = 1024;
  effectsCanvas.value.height = 512;

  // Clear the assetMap and preload images
  assetMap.clear();
  const preloadedAssets = await preloadAssets();
  preloadedAssets.forEach((value, key) => {
    assetMap.set(key, value);
  });

  const img = assetMap.get(assets[0]);
  state.imgWidth = 64 - state.paddingLeftRight * 2;
  state.imgHeight = (img!.height / img!.width) * state.imgWidth;

  const totalWidth = (state.gridWidth * (state.imgWidth / 2));
  const totalHeight = state.gridHeight * (state.imgHeight + state.paddingTopBottom * 2);
  state.offsetXCenter = (canvas.value.width - totalWidth) / 2;
  state.offsetYCenter = (canvas.value.height - totalHeight) / 2;

  drawScene();
  drawEffects();
});

</script>

<style scoped>
canvas {
  border-radius: 50px;
  border: 1px dashed lightblue;
  image-rendering: pixelated;
  user-select: none;
  touch-action: none;
}

.assets-list {
  display: flex;
  overflow-x: auto;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
  justify-content: center;

}

.asset-button {
  color: whitesmoke;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  cursor: pointer;
  border: 1px dotted lightblue;
  border-radius: 50px;
}

.asset-image {
  width: 32px;
  height: auto;
}

.asset-text {
  font-size: 14px;
}
</style>

