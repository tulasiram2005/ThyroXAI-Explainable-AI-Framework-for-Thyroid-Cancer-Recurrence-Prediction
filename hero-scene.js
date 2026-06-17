// hero-scene.js
//
// Ambient 3D visual for the hero: a small "reasoning network" — clinical
// input nodes feeding an ensemble layer, feeding a single highlighted
// prediction node, with a slow pulse traveling along the graph to suggest
// explanation flowing toward a decision. This is the page's one deliberate
// 3D moment; everything else stays calm so this can read clearly.
//
// This script is entirely optional enhancement. If WebGL isn't available,
// the viewport is small, the user prefers reduced motion, or the CDN module
// fails to load, the static dashboard screenshot already in the hero stays
// visible and nothing else on the page is affected.

const canvas = document.querySelector("#hero-canvas");
const heroMedia = document.querySelector(".hero-media");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallViewport = window.innerWidth < 760;

function supportsWebGL() {
  try {
    const test = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (test.getContext("webgl") || test.getContext("experimental-webgl")));
  } catch (error) {
    return false;
  }
}

if (canvas && heroMedia && !prefersReducedMotion && !isSmallViewport && supportsWebGL()) {
  initScene().catch(() => {
    // Leave the static fallback image visible if the module fails to load.
  });
}

async function initScene() {
  const THREE = await import("three");

  const palette = {
    input: 0x107a74,
    ensemble: 0x8ed8c7,
    output: 0xee7469,
    edgeWarm: 0x8ed8c7,
    edgeCool: 0x107a74,
    pulse: 0xf5b84b
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0.4, 0.3, 9.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.PointLight(0xffffff, 1.2, 30);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const group = new THREE.Group();
  scene.add(group);

  function makeNode(x, y, z, radius, color, glow) {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: glow ? 0.9 : 0.35,
      roughness: 0.45,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
  }

  function layoutColumn(count, x, spread, color, radius) {
    const nodes = [];
    for (let i = 0; i < count; i += 1) {
      const y = (i - (count - 1) / 2) * (spread / Math.max(count - 1, 1));
      const z = (Math.random() - 0.5) * 1.1;
      nodes.push(makeNode(x, y, z, radius, color));
    }
    return nodes;
  }

  function makeEdge(a, b, color, opacity) {
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    return new THREE.Line(geometry, material);
  }

  function pickRandom(list, count) {
    const copy = [...list];
    const picked = [];
    for (let i = 0; i < count && copy.length; i += 1) {
      picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return picked;
  }

  const inputLayer = layoutColumn(6, -3.4, 4.4, palette.input, 0.1);
  const ensembleLayer = layoutColumn(5, 0, 3.6, palette.ensemble, 0.12);
  const outputNode = makeNode(3.4, 0, 0, 0.22, palette.output, true);

  group.add(...inputLayer, ...ensembleLayer, outputNode);

  inputLayer.forEach((from) => {
    pickRandom(ensembleLayer, 2).forEach((to) => {
      group.add(makeEdge(from.position, to.position, palette.edgeWarm, 0.18));
    });
  });
  ensembleLayer.forEach((from) => {
    group.add(makeEdge(from.position, outputNode.position, palette.edgeCool, 0.26));
  });

  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshBasicMaterial({ color: palette.pulse })
  );
  group.add(pulse);

  let pulsePath = randomPulsePath();
  let pulseT = 0;

  function randomPulsePath() {
    const from = inputLayer[Math.floor(Math.random() * inputLayer.length)];
    const mid = ensembleLayer[Math.floor(Math.random() * ensembleLayer.length)];
    return [from.position, mid.position, outputNode.position];
  }

  function setPulsePosition(t) {
    const onFirstLeg = t < 0.5;
    const localT = onFirstLeg ? t / 0.5 : (t - 0.5) / 0.5;
    const a = pulsePath[onFirstLeg ? 0 : 1];
    const b = pulsePath[onFirstLeg ? 1 : 2];
    pulse.position.lerpVectors(a, b, localT);
  }

  function resize() {
    const width = canvas.clientWidth || heroMedia.clientWidth;
    const height = canvas.clientHeight || heroMedia.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();

  function animate() {
    const delta = Math.min(clock.getDelta(), 0.1);
    group.rotation.y += delta * 0.12;
    group.rotation.x = Math.sin(performance.now() / 9000) * 0.05;

    pulseT += delta * 0.55;
    if (pulseT >= 1) {
      pulseT = 0;
      pulsePath = randomPulsePath();
    }
    setPulsePosition(pulseT);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
  heroMedia.classList.add("is-3d-active");
}
