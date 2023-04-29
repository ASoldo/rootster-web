<template>
  <div style="width: 100%; position: relative;">
    <div style=" display: flex; justify-content: center; align-items: center;">
      <select v-model="selectedGroup" @change="updateSatelliteData" style="position: absolute; z-index: 10;">
        <option v-for="group in satelliteGroups" :value="group.url" :key="group.name">
          {{ group.name }}
        </option>
      </select>
    </div>
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
let scene: THREE.Scene | null;
let camera: THREE.PerspectiveCamera | null;
let renderer: THREE.WebGLRenderer | null;
let controls: OrbitControls | null;

const animationSpeed = ref(0.5);

const scaleFactor = 1 / 1000;
const mounted = ref(false);
const isLoading = ref(false);
let labelRenderer: CSS2DRenderer;
const atmosphereLayers = [
  { name: 'Troposphere', altitude: 12000, color: 0x7DB9DE },
  { name: 'Stratosphere', altitude: 50000, color: 0x4D5D53 },
  { name: 'Mesosphere', altitude: 85000, color: 0x0B3D91 },
  { name: 'Thermosphere', altitude: 690000, color: 0x0B3D61 },
];


const satelliteGroups = [
  { name: 'Active', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json' },
  { name: 'Last 30 days', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json' },
  { name: 'Space Stations', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json' },
  { name: 'Russian ASAT Test', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=1982-092&FORMAT=json' },
  { name: 'Chinese ASAT Test', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=1999-025&FORMAT=json' },
  { name: 'IRIDIUM 33 Debris', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=json' },
  { name: 'COSMOS 2251 Debris', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json' },
  { name: '100 brightest', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=json' },
  { name: 'Search & Rescue', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=sarsat&FORMAT=json' },
  { name: 'Planet', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=planet&FORMAT=json' },
  { name: 'GPS Operational', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=json' },
  { name: 'Weather', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=json' },
  { name: 'Other', url: 'http://celestrak.org/NORAD/elements/gp.php?GROUP=other&FORMAT=json' },
];
const selectedGroup = ref(satelliteGroups[0].url);

// Fetch satellite data from the given URL
const fetchSatelliteData = async (url: any) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const addAtmosphereLayers = () => {
  const earthRadius = 6371 * scaleFactor;

  for (const layer of atmosphereLayers) {
    const radius = earthRadius + layer.altitude * scaleFactor;

    const material = new THREE.LineBasicMaterial({ color: layer.color });

    const circlePoints = [];
    const segmentCount = 128;
    const angleStep = (2 * Math.PI) / segmentCount;

    // XY plane circle
    for (let i = 0; i <= segmentCount; i++) {
      circlePoints.push(new THREE.Vector3(radius * Math.cos(i * angleStep), radius * Math.sin(i * angleStep), 0));
    }

    for (let i = 0; i <= segmentCount; i++) {
      circlePoints[i].set(radius * Math.cos(i * angleStep), 0, radius * Math.sin(i * angleStep));
    }

    const geometryXZ = new THREE.BufferGeometry().setFromPoints(circlePoints);
    const circleXZ = new THREE.Line(geometryXZ, material);
    scene?.add(circleXZ);
  }
}

const updateSatelliteData = () => {
  loadSatelliteData(selectedGroup.value);
}

const loadSatelliteData = async (url: String) => {
  isLoading.value = true;
  const data = await fetchSatelliteData(url);

  // Clear existing satellites and satellite orbits from the scene
  const objectsToRemove = scene?.children.filter(object => object.userData.type === 'satellite') ?? [];
  for (const object of objectsToRemove) {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
      object.geometry.dispose(); // Dispose of the object's geometry
      object.material.dispose(); // Dispose of the object's material
    }
    scene?.remove(object);
  }

  for (const satellite of data) {
    const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = 'satellite'; // Mark this object as a satellite
    mesh.userData.satelliteData = satellite; // Store satellite data
    scene?.add(mesh);
    // Set the mesh position according to satellite data
    mesh.position.copy(satellitePosition(satellite));

    // Add satellite orbit
    const orbit = createOrbit(satellite);
    scene?.add(orbit);
  }
  isLoading.value = false;
}


const satellitePosition = (satellite: any) => {
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
const init = () => {
  // Set up the scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 16000);
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value! });
  updateRendererSize();

  // Set up the OrbitControls
  controls = new OrbitControls(camera!, renderer.domElement);

  // Create Earth model
  const earthRadius = 6371 * scaleFactor;
  const earthPolarRadius = 6356.8 * scaleFactor; // Earth's polar radius
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
  const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg');
  const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

  // Scale Y-axis to create an oval shape
  earthMesh.scale.y = earthPolarRadius / earthRadius;
  // earthMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
  scene.add(earthMesh);
  addAtmosphereLayers();

  renderer = new THREE.WebGLRenderer({ antialias: false, canvas: canvas.value!, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.position.z = 6 * 6371 * scaleFactor;
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer!.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild(labelRenderer.domElement);
}

const createOrbit = (satellite: any) => {
  const points = [];
  for (let angle = 0; angle <= 360; angle += 5) {
    const pos = satellitePosition({ ...satellite, MEAN_ANOMALY: angle });
    points.push(pos);
  }
  points.push(points[0]); // Add the first point to the end, closing the loop
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x03fcfc, transparent: true, opacity: 0.1 });
  const orbit = new THREE.Line(geometry, material);
  orbit.userData.type = 'satellite';
  return orbit;
}


const cleanUp = () => {
  controls?.dispose();
  renderer?.dispose();
  camera = null;
  scene = null;
  controls = null;
  renderer = null;
}

// Animate the 3D visualization

const animate = () => {
  if (mounted.value) {
    requestAnimationFrame(animate);

    // Update satellite positions
    for (const object of scene?.children.filter(object => object.userData.type === 'satellite') ?? []) {
      if (object instanceof THREE.Mesh) {
        object.userData.satelliteData.MEAN_ANOMALY += animationSpeed.value;
        object.position.copy(satellitePosition(object.userData.satelliteData));
      }
    }

    controls?.update();
    renderer?.render(scene!, camera!);
    labelRenderer.render(scene!, camera!);
  }
}

const updateRendererSize = () => {
  if (!canvas.value) return;

  const parent = canvas.value.parentElement;
  if (!parent) return;

  const width = parent.clientWidth;
  const height = parent.clientHeight;

  camera!.aspect = width / height;
  camera!.updateProjectionMatrix();

  renderer!.setSize(width, height);
};

// Handle component lifecycle
onMounted(() => {
  mounted.value = true;
  init();
  animate();
  updateSatelliteData(); // Load satellite data initially
  labelRenderer.render(scene!, camera!);
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
  border-radius: 15px;
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

.label {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 4px;
  font-family: Arial, sans-serif;
  font-size: 12px;
}
</style>
