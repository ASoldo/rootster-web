<template>
  <div class="flex justify-center">

    <canvas ref="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const sunRadius = 50;
const planetRadius = [2.44, 6.05, 6.37, 3.39, 69.91, 58.23, 25.36, 24.62]; // Planet radius in Earth radii
const planetDistance = [57.91, 108.21, 149.6, 227.92, 778.57, 1433.5, 2872.46, 4495.1]; // Distance in million km
const planetSpeed = [0.241, 0.615, 1.0, 1.881, 11.86, 29.46, 84.01, 164.79]; // Orbital speed in km/s
const planetColors = [
  'gray',
  'brown',
  'blue',
  'red',
  'orange',
  'yellow',
  'purple',
  'green'
];

let sunAngle = 0;
let planetAngles = [0, 0, 0, 0, 0, 0, 0, 0];

const canvasWidth = 1200;
const canvasHeight = 1200;

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvasWidth;
    canvas.value.height = canvasHeight;

    ctx.value = canvas.value.getContext('2d');

    if (ctx.value) {
      draw();
      animate();
    }
  }
});

function draw() {
  if (ctx.value) {
    // Clear canvas
    ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw orbit circles
    for (let i = 0; i < planetRadius.length; i++) {
      const orbitRadius = planetDistance[i] / 149.6; // Normalize distance to AU
      const scaledRadius = orbitRadius * (canvasWidth / 4); // Scale radius to canvas size

      ctx.value.strokeStyle = 'white';
      ctx.value.setLineDash([5, 5]);
      ctx.value.beginPath();
      ctx.value.arc(canvasWidth / 2, canvasHeight / 2, scaledRadius, 0, Math.PI * 2);
      ctx.value.stroke();
    }

    // Draw sun
    ctx.value.fillStyle = 'yellow';
    ctx.value.beginPath();
    ctx.value.arc(canvasWidth / 2, canvasHeight / 2, sunRadius, 0, Math.PI * 2);
    ctx.value.fill();

    // Draw planets
    for (let i = 0; i < planetRadius.length; i++) {
      const orbitRadius = planetDistance[i] / 149.6; // Normalize distance to AU
      const scaledRadius = planetRadius[i] * 0.4; // Scale radius to canvas size
      const scaledDistance = orbitRadius * (canvasWidth / 4); // Scale distance to canvas size

      const planetX = (canvasWidth / 2) + (scaledDistance * Math.cos(planetAngles[i]));
      const planetY = (canvasHeight / 2) + (scaledDistance * Math.sin(planetAngles[i]));

      ctx.value.fillStyle = planetColors[i];
      ctx.value.beginPath();
      ctx.value.arc(planetX, planetY, scaledRadius, 0, Math.PI * 2);
      ctx.value.fill();

      // Draw planet name
      ctx.value.fillStyle = 'white';
      ctx.value.font = '16px sans-serif';
      ctx.value.textAlign = 'center';
      ctx.value.fillText(getPlanetName(i), planetX, planetY + scaledRadius + 15);
    }
  }
}

function animate() {
  sunAngle += 0.01;

  for (let i = 0; i < planetAngles.length; i++) {
    planetAngles[i] += planetSpeed[i] / 100000; // Convert km/s to AU/day
  }

  draw();

  window.requestAnimationFrame(animate);
}

function getPlanetName(index: number): string {
  switch (index) {
    case 0:
      return 'Mercury';
    case 1:
      return 'Venus';
    case 2:
      return 'Earth';
    case 3:
      return 'Mars';
    case 4:
      return 'Jupiter';
    case 5:
      return 'Saturn';
    case 6:
      return 'Uranus';
    case 7:
      return 'Neptune';
    default:
      return '';
  }
}
</script>
<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
