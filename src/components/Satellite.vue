<template>
  <div style="width: 100%; position: relative;">
    <select v-model="selectedGroup" @change="updateSatelliteData" style="position: absolute; z-index: 10;">
      <option v-for="group in satelliteGroups" :value="group.url" :key="group.name">
        {{ group.name }}
      </option>
    </select>
    <canvas style="width: 100%; position: relative;" ref="canvas"></canvas>
    <div v-if="isLoading" class="loading-bar"
      style="position: absolute; z-index: 10; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

// Set up the Three.js scene, camera, renderer, and controls
const canvas = ref<HTMLCanvasElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

const scaleFactor = 1 / 1000;
const mounted = ref(false);
const isLoading = ref(false);
let labelRenderer: CSS2DRenderer;

const satelliteGroups = [
  { name: 'Active', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json' },
  { name: 'Last 30 days', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json' },
  { name: 'Space Stations', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json' },
  { name: 'Russian ASAT Test', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=1982-092&FORMAT=json' },
  { name: 'Chinese ASAT Test', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=1999-025&FORMAT=json' },
  { name: 'IRIDIUM 33 Debris', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=json' },
  { name: 'COSMOS 2251 Debris', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json' },
  { name: '100 brightest', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=json' },
];
const selectedGroup = ref(satelliteGroups[0].url);

// Fetch satellite data from the given URL
async function fetchSatelliteData(url: any) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function updateSatelliteData() {
  loadSatelliteData(selectedGroup.value);
}

async function loadSatelliteData(url: String) {
  isLoading.value = true;
  const data = await fetchSatelliteData(url);

  // Clear existing satellites from the scene
  for (const object of scene.children) {
    if (object.userData.type === 'satellite') {
      scene.remove(object);
    }
  }

  for (const satellite of data) {
    const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = 'satellite'; // Mark this object as a satellite
    scene.add(mesh);
    // Set the mesh position according to satellite data
    mesh.position.copy(satellitePosition(satellite));

    // Add satellite orbit
    const orbit = createOrbit(satellite);
    scene.add(orbit);
  }
  isLoading.value = false;
}

function satellitePosition(satellite: any) {
  const earthRadius = 6371 * scaleFactor;
  const semiMajorAxis = Math.pow(6.67430e-11 * 5.97219e24 / (4 * Math.PI ** 2 * satellite.MEAN_MOTION ** 2), 1 / 3) / 1000;
  const eccentricity = satellite.ECCENTRICITY;
  const inclination = THREE.MathUtils.degToRad(satellite.INCLINATION);
  const raOfAscNode = THREE.MathUtils.degToRad(satellite.RA_OF_ASC_NODE);
  const argOfPericenter = THREE.MathUtils.degToRad(satellite.ARG_OF_PERICENTER);
  const meanAnomaly = THREE.MathUtils.degToRad(satellite.MEAN_ANOMALY);

  const E0 = meanAnomaly;
  let E = E0;
  let dE = 1;
  while (Math.abs(dE) > 1e-6) {
    dE = (E0 - (E - eccentricity * Math.sin(E))) / (1 - eccentricity * Math.cos(E));
    E += dE;
  }

  const spherical = new THREE.Spherical(
    earthRadius + semiMajorAxis * (1 - eccentricity * Math.cos(E)),
    Math.PI / 2 - Math.asin(Math.sin(inclination) * Math.sin(argOfPericenter + Math.cos(E))),
    raOfAscNode + Math.atan2(Math.sqrt(1 - eccentricity ** 2) * Math.sin(E), Math.cos(E) - eccentricity)
  );
  const position = new THREE.Vector3();
  position.setFromSpherical(spherical);
  return position;
}

// Initialize the 3D visualization
function init() {
  // Set up the scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
  updateRendererSize();

  // Set up the OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);

  // Create Earth model
  const earthRadius = 6371 * scaleFactor;
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
  const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg');
  // const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/b/b3/Solarsystemscope_texture_8k_earth_nightmap.jpg');
  const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  renderer = new THREE.WebGLRenderer({ antialias: false, canvas: canvas.value, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.position.z = 6 * 6371 * scaleFactor;
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild(labelRenderer.domElement);
}

function createOrbit(satellite: any) {
  const points = [];
  for (let angle = 0; angle < 360; angle += 5) {
    const pos = satellitePosition({ ...satellite, MEAN_ANOMALY: angle });
    points.push(pos);
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x03fcfc, transparent: true, opacity: 0.1 });
  const orbit = new THREE.Line(geometry, material);
  orbit.userData.type = 'satellite';
  return orbit;
}

function cleanUp() {
  controls.dispose();
  renderer.dispose();
  camera = null;
  scene = null;
  controls = null;
  renderer = null;
}

// Animate the 3D visualization
function animate() {
  if (mounted.value) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
}
const updateRendererSize = () => {
  if (!canvas.value) return;

  const parent = canvas.value.parentElement;
  if (!parent) return;

  const width = parent.clientWidth;
  const height = parent.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

// Handle component lifecycle
onMounted(() => {
  mounted.value = true;
  init();
  animate();
  updateSatelliteData(); // Load satellite data initially
  labelRenderer.render(scene, camera);
  window.addEventListener('resize', updateRendererSize);
});

onUnmounted(() => {
  cleanUp();
  window.removeEventListener('resize', updateRendererSize);
  mounted.value = false;
});
</script>

<style>
canvas {
  width: 100%;
}

.loading-bar {
  width: 100px;
  height: 10px;
  background-color: #ccc;
  position: relative;
  overflow: hidden;
}

.loading-bar::before {
  content: "";
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #00ff00;
  animation: loading-bar-animation 1s linear infinite;
}

@keyframes loading-bar-animation {
  0% {
    transform: translateX(0%);
  }

  50% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(0%);
  }
}
</style>
