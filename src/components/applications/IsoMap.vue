<template>
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
    <div style="position: relative; width: 1024px; height: 700px;">
      <canvas ref="canvas" style="position: absolute; width: 100%;"></canvas>
      <canvas ref="level1Canvas" style="position: absolute; width: 100%; z-index: 2"></canvas>
      <canvas ref="effectsCanvas" @mousemove="onMouseMove" @click="onClick"
        style="position: absolute; width: 100%; z-index: 3"></canvas> <!-- zIndex value changed to 3 -->

    </div>
  </div>
  <div class="level-selector">
    <label for="level" style="color: white;">Select Level:</label>
    <select id="level" v-model="selectedMode">
      <option value="level0">Level 0</option>
      <option value="level1">Level 1</option>
    </select>
  </div>
  <div class="assets-list">

    <button class="asset-button" v-for="(asset, index) in assets[selectedMode as keyof typeof assets]" :key="index"
      @click="changeSelectedAsset(asset)">
      <img :src="asset.asset" class="asset-image" />
      <span class="asset-text">{{ asset.name }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const effectsCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const effectsCtx = ref<CanvasRenderingContext2D | null>(null);
const level1Canvas = ref<HTMLCanvasElement | null>(null);
const level1Ctx = ref<CanvasRenderingContext2D | null>(null);

const assets = reactive({
  level0: [
    {
      name: 'Grass',
      asset: 'https://j-img.game8.co/1652101/d871d2ac249bd68df04e43bfd4b36b42.png/show?1527556487',
    },
    {
      name: 'Mycelium',
      asset: 'https://j-img.game8.co/1652255/4ab847f418523f9d9e1901f982b4ad6c.png/show?1527556498',
    },
    {
      name: 'Red Sand',
      asset: 'https://j-img.game8.co/1652119/9cbe9bfdfb27361d609bc17475bbf39f.png/show?1527556488',
    },
    {
      name: 'Dirt',
      asset: 'https://j-img.game8.co/1652102/77128c1c23c5abc722044830c6dfa872.png/show?1527556487',
    },
  ],
  level1: [
    {
      name: 'Enchanting Table',
      asset: 'https://j-img.game8.co/1652260/d5c088e9622cb5cafdf3fb8496054be5.png/show?1527556499',
    },
    {
      name: 'Furnace',
      asset: 'https://j-img.game8.co/1652199/9f45dd5bb848889d8a1c3a63851c360a.png/show?1527556494',
    },
    {
      name: 'Crafting Table',
      asset: 'https://j-img.game8.co/1652198/f0210a2b30b8d3ece837484a06027cd2.png/show?1527556494',
    },
    {
      name: 'Beacon',
      asset: 'https://img.game8.co/3529063/438732cbdf100b718d4d7c70896724c6.png/show',
    },
    {
      name: 'Air',
      asset: 'https://imgs.search.brave.com/yoe7iXFEBB4Waj0DJHtUjNrame24JzthWH7qLWGzFNg/rs:fit:22:22:1/g:ce/aHR0cHM6Ly9pLnN0/YWNrLmltZ3VyLmNv/bS8wS3ZCOC5wbmc'
    }
  ],
});


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
const selectedMode = ref("level0");
const selectedAssetName = ref('');


const changeSelectedAsset = (asset: { name: string; asset: string }) => {
  selectedAsset.value = asset.asset;
  selectedAssetName.value = asset.name;
};
const selectedAsset = ref(assets.level0[0].asset);

const preloadAssets = async () => {
  const allAssets = [...assets.level0, ...assets.level1];
  const loadedAssets = await Promise.all(allAssets.map((assetObj) => loadImage(assetObj.asset)));
  const assetMap = new Map(allAssets.map((assetObj, i) => [assetObj.asset, loadedAssets[i]]));
  return assetMap;
};


const assetMap = reactive(new Map());


const airAsset = assets.level1.find((asset) => asset.name === "Air");

const createBoard = (levelAssets: any[], useAir = false) => {
  const board = [];
  for (let row = 0; row < state.gridHeight; row++) {
    const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
    const rowData = [];
    for (let col = 0; col < cellsInRow; col++) {
      const cellAsset = useAir ? airAsset : levelAssets[Math.floor(Math.random() * levelAssets.length)];
      rowData.push({
        asset: cellAsset.asset,
        name: cellAsset.name,
      });
    }
    board.push(rowData);
  }
  return board;
};

const level0Board = reactive(createBoard(assets.level0));
const level1Board = reactive(createBoard(assets.level1, true));

const loadImage = async (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

const drawScene = () => {
  if (!ctx.value || !level1Ctx.value) return;
  ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  level1Ctx.value.clearRect(0, 0, level1Canvas.value!.width, level1Canvas.value!.height);

  const boards = [level0Board, level1Board];

  boards.forEach((board, boardIndex) => {
    for (let row = 0; row < state.gridHeight; row++) {
      const cellsInRow = row < Math.ceil(state.gridHeight / 2) ? row : state.gridHeight - row;
      const offsetXForRow = state.imgWidth / 2 * (state.gridHeight - cellsInRow * 2);

      for (let col = 0; col < cellsInRow; col++) {
        const cellAsset = board[row][col].asset;

        const img = assetMap.get(cellAsset);
        const x = state.offsetXCenter + offsetXForRow / 2 + col * (state.imgWidth + state.paddingLeftRight * 2) + state.paddingLeftRight;
        const y = state.offsetYCenter + row * (state.imgHeight + state.paddingTopBottom * 2) + state.paddingTopBottom;

        // Calculate the updated y-coordinate for Level 1
        const yOffsetY = boardIndex === 1 ? y + state.imgHeight + state.paddingTopBottom * 2 - 50 : y;

        if (boardIndex === 0) {
          ctx.value!.drawImage(img!, x, yOffsetY, state.imgWidth, state.imgHeight);
        } else {
          level1Ctx.value!.drawImage(img!, x, yOffsetY, state.imgWidth, state.imgHeight);
        }
      }
    }
  });
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

      const yOffsetY = selectedMode.value === "level1" ? cellY + state.imgHeight + state.paddingTopBottom * 2 - 50 : cellY;

      if (pointInHexagon(x, y, cellX + state.imgWidth / 1.7, yOffsetY + state.imgHeight / 1.7 - 25, state.imgWidth, state.imgHeight, scaleFactorX, scaleFactorY)) {
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
    const currentBoard = selectedMode.value === "level0" ? level0Board : level1Board;
    currentBoard[hoveredCell.row][hoveredCell.col].asset = selectedAsset.value;
    currentBoard[hoveredCell.row][hoveredCell.col].name = selectedAssetName.value; // Update the asset name

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

      // Calculate the updated y-coordinate for Level 1
      const yOffsetY = selectedMode.value === "level1" ? y + state.imgHeight + state.paddingTopBottom * 2 - 50 : y;

      // Draw the hover effect
      if (hoveredCell.row === row && hoveredCell.col === col) {
        effectsCtx.value.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        effectsCtx.value.beginPath();
        effectsCtx.value.moveTo(x + state.imgWidth / 2, yOffsetY);
        effectsCtx.value.lineTo(x + state.imgWidth, yOffsetY + state.imgHeight / 4);
        effectsCtx.value.lineTo(x + state.imgWidth, yOffsetY + state.imgHeight * 3 / 4);
        effectsCtx.value.lineTo(x + state.imgWidth / 2, yOffsetY + state.imgHeight);
        effectsCtx.value.lineTo(x, yOffsetY + state.imgHeight * 3 / 4);
        effectsCtx.value.lineTo(x, yOffsetY + state.imgHeight / 4);
        effectsCtx.value.closePath();
        effectsCtx.value.stroke();

        // Draw the 3D effect lines
        effectsCtx.value.beginPath();
        effectsCtx.value.moveTo(x, yOffsetY + state.imgHeight / 4);
        effectsCtx.value.lineTo(x + state.imgWidth / 2, yOffsetY + state.imgHeight / 2);
        effectsCtx.value.lineTo(x + state.imgWidth, yOffsetY + state.imgHeight / 4);
        effectsCtx.value.stroke();

        effectsCtx.value.beginPath();
        effectsCtx.value.moveTo(x + state.imgWidth / 2, yOffsetY + state.imgHeight / 2);
        effectsCtx.value.lineTo(x + state.imgWidth / 2, yOffsetY + state.imgHeight);
        effectsCtx.value.stroke();

        const currentBoard = selectedMode.value === "level0" ? level0Board : level1Board;
        const hoveredAsset = currentBoard[row][col].asset;
        const assetName = assets[selectedMode.value as keyof typeof assets].find(asset => asset.asset === hoveredAsset)?.name || 'Unknown';

        // Draw the asset name
        effectsCtx.value.fillStyle = 'rgba(255, 255, 255, 1)';
        effectsCtx.value.fillText(assetName, x, yOffsetY);
      }
    }
  }
};

onMounted(async () => {
  if (!canvas.value || !effectsCanvas.value) return;
  ctx.value = canvas.value.getContext('2d');
  effectsCtx.value = effectsCanvas.value.getContext('2d');
  canvas.value.width = 1024;
  canvas.value.height = 700;
  effectsCanvas.value.width = 1024;
  effectsCanvas.value.height = 700;

  // Clear the assetMap and preload images
  assetMap.clear();
  const preloadedAssets = await preloadAssets();
  preloadedAssets.forEach((value, key) => {
    assetMap.set(key, value);
  });

  if (!level1Canvas.value) return;
  level1Ctx.value = level1Canvas.value.getContext('2d');
  level1Canvas.value.width = 1024;
  level1Canvas.value.height = 700;

  const img = assetMap.get(assets.level0[0].asset);

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
.level-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

canvas {
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

