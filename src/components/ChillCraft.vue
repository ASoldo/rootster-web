<template>
  <div style="width: 100%; position: relative;">
    <canvas style="width: 100%; position: relative;" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = ref<HTMLCanvasElement | undefined>(undefined);
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let plane: THREE.Mesh;
let pointer: THREE.Vector2;
let raycaster: THREE.Raycaster;
let isShiftDown = ref(false);
let rollOverMesh: THREE.Mesh;
let rollOverMaterial: THREE.MeshBasicMaterial;
let cubeGeo: THREE.BoxGeometry;
let cubeMaterial: THREE.MeshLambertMaterial;
const objects: THREE.Object3D[] = [];
let controls: OrbitControls;

const customBlock = {
  name: 'Custom Block',
  texture: 'https://lh3.googleusercontent.com/iqlWY7XMz8zrcXeIUYrcXCbNtxL3TzXgWUwrusLJyMwirLq0Gku4Af8YmhJZu9y8S6bx3Fj-4ey1pkFE2BQA2n4=s400',
};

onMounted(() => {
  if (!canvas.value) return;
  init();
  render();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onDocumentKeyDown);
  document.addEventListener('keyup', onDocumentKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerdown', onPointerDown);
  document.removeEventListener('keydown', onDocumentKeyDown);
  document.removeEventListener('keyup', onDocumentKeyUp);
});

const init = () => {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1300, 800, 1300);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  // roll-over helpers
  const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
  rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.4, transparent: true });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // cubes
  cubeGeo = new THREE.BoxGeometry(50, 50, 50);

  const textureLoader = new THREE.TextureLoader();
  const grassBlockTexture = textureLoader.load(customBlock.texture);

  cubeMaterial = new THREE.MeshLambertMaterial({ map: grassBlockTexture });

  // grid
  const gridHelper = new THREE.GridHelper(1000, 20);
  scene.add(gridHelper);

  // raycaster and pointer
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);

  plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
  scene.add(plane);
  objects.push(plane);

  // lights
  const ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas.value, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  updateRendererSize();

  if (renderer.domElement) {
    controls = new OrbitControls(camera, renderer.domElement as HTMLElement);
  }

  animate();
};

const updateRendererSize = () => {
  if (!canvas.value) return;

  const parent = canvas.value.parentElement;
  if (!parent) return;

  const width = parent.clientWidth;
  const height = parent.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  render();
};

const onWindowResize = () => {
  updateRendererSize();
};

const onPointerMove = (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (intersect.face) {
      rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
      rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

      render();
    }
  }
};

const onPointerDown = (event: MouseEvent) => {
  // check if pointer is dragging and stop
  if (event.buttons !== 1) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    if (intersect.face) {
      // delete cube
      if (isShiftDown.value) {
        if (intersect.object !== plane) {
          scene.remove(intersect.object);
          objects.splice(objects.indexOf(intersect.object), 1);
        }

        // create cube
      } else {
        const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        scene.add(voxel);

        objects.push(voxel);
      }

      render();
    }
  }
};

const onDocumentKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Shift':
      isShiftDown.value = true;
      break;
  }
};

const onDocumentKeyUp = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Shift':
      isShiftDown.value = false;
      break;
  }
};

const render = () => {
  if (controls) {
    controls.update();
  }
  renderer.render(scene, camera);
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};
</script>

<style></style>
