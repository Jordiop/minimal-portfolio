import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

/*
 * A low-poly forest that dissolves into the page.
 *
 * The fog is the exact --paper colour, so trees fade into the background
 * instead of ending at a horizon. The forest is a fixed strip of instances that
 * wraps around the camera in the vertex shader, so it never runs out and no
 * JavaScript touches individual trees per frame.
 */

const SPAN = 140 // depth of the tree strip that wraps around the camera
const FLY_SPAN = 60 // fireflies stay closer
const SPEED = 1.1 // units per second of forward drift

const PALETTES = {
  light: {
    background: '#f2efe9',
    ground: '#e4ded2',
    sky: '#fffaf0',
    soil: '#b9b1a0',
    hemi: 1.6,
    sun: '#fff1dc',
    sunIntensity: 1.6,
    firefly: '#b23a15',
    fogNear: 6,
    fogFar: 58,
    glow: 0,
  },
  dark: {
    background: '#111110',
    ground: '#151513',
    sky: '#6b7a92',
    soil: '#141412',
    hemi: 1.5,
    sun: '#b4c6e2',
    sunIntensity: 1.6,
    firefly: '#e8623a',
    fogNear: 4,
    fogFar: 48,
    glow: 1,
  },
}

// Deterministic randomness so the forest looks the same on every visit.
function random(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function paint(geometry, shade) {
  const count = geometry.attributes.position.count
  const colors = new Float32Array(count * 3).fill(shade)
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

function pineGeometry() {
  const trunk = paint(new THREE.CylinderGeometry(0.07, 0.13, 1.4, 5).translate(0, 0.7, 0), 0.55)
  const tiers = [
    [1.15, 1.7, 1.6],
    [0.9, 1.5, 2.4],
    [0.6, 1.3, 3.15],
  ].map(([radius, height, y]) => paint(new THREE.ConeGeometry(radius, height, 7).translate(0, y, 0), 1))
  return mergeGeometries([trunk, ...tiers])
}

/** Lambert, plus wind sway and the endless z-wrap injected into the vertex stage. */
function forestMaterial(uniforms) {
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTime;
        uniform float uTravel;
        uniform float uWind;`,
      )
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = vec4(transformed, 1.0);
        vec3 origin = vec3(0.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
          origin = instanceMatrix[3].xyz;
        #endif
        float wrapped = mod(origin.z + uTravel + ${SPAN / 2}.0, ${SPAN}.0) - ${SPAN / 2}.0;
        mvPosition.z += wrapped - origin.z;
        float bend = transformed.y * transformed.y * uWind;
        mvPosition.x += sin(uTime * 1.3 + origin.x * 0.35 + origin.z * 0.2) * bend;
        mvPosition.z += cos(uTime * 1.1 + origin.x * 0.2) * bend * 0.5;
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`,
      )
  }
  return material
}

function scatter(geometry, material, count, place, colors, rand) {
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  for (let i = 0; i < count; i++) {
    place(dummy, rand)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    color.set(colors[Math.floor(rand() * colors.length)]).offsetHSL(0, 0, (rand() - 0.5) * 0.05)
    mesh.setColorAt(i, color)
  }
  // Instances are moved in the shader, so the CPU-side bounds are meaningless.
  mesh.frustumCulled = false
  return mesh
}

function fireflies(count, uniforms, rand) {
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const side = rand() < 0.5 ? -1 : 1
    positions[i * 3] = side * rand() * 14
    positions[i * 3 + 1] = 0.3 + rand() * 4
    positions[i * 3 + 2] = rand() * FLY_SPAN - FLY_SPAN / 2
    seeds[i] = rand()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uTravel;
      uniform float uPixelRatio;
      uniform float uFogNear;
      uniform float uFogFar;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.z = mod(p.z + uTravel * 0.9 + ${FLY_SPAN / 2}.0, ${FLY_SPAN}.0) - ${FLY_SPAN / 2}.0;
        p.x += sin(uTime * 0.6 + aSeed * 6.28) * 0.6;
        p.y += sin(uTime * 0.9 + aSeed * 12.0) * 0.35;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        gl_PointSize = 60.0 * uPixelRatio * (0.6 + aSeed * 0.8) / depth;
        float blink = 0.5 + 0.5 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 40.0);
        vAlpha = (1.0 - smoothstep(uFogNear, uFogFar, depth)) * mix(0.2, 1.0, blink);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uGlow;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        // Day: small crisp seeds of pollen. Night: soft glowing halos.
        float shape = mix(smoothstep(0.32, 0.22, d), pow(core, 1.6), uGlow);
        gl_FragColor = vec4(uColor, shape * vAlpha);
        #include <colorspace_fragment>
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return points
}

export function createForest(canvas, { dark = false, reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))

  const small = window.innerWidth < 640
  const rand = random(7)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120)
  camera.position.set(0, 1.7, 8)

  const fog = new THREE.Fog(0xffffff, 6, 58)
  scene.fog = fog
  scene.background = new THREE.Color()

  const hemi = new THREE.HemisphereLight()
  const sun = new THREE.DirectionalLight()
  sun.position.set(-6, 10, 4)
  scene.add(hemi, sun)

  const uniforms = {
    uTime: { value: 0 },
    uTravel: { value: 0 },
    uWind: { value: reducedMotion ? 0 : 0.012 },
  }
  const material = forestMaterial(uniforms)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2),
    new THREE.MeshLambertMaterial(),
  )
  scene.add(ground)

  // Trees keep a clearing down the middle so the camera has a path to walk.
  const pines = scatter(
    pineGeometry(),
    material,
    small ? 500 : 950,
    (o, r) => {
      const side = r() < 0.5 ? -1 : 1
      const s = 0.7 + r() * 1.1
      o.position.set(side * (3.6 + s * 1.2 + Math.pow(r(), 1.4) * 34), 0, r() * SPAN - SPAN / 2)
      o.scale.set(s, s * (0.8 + r() * 0.5), s)
      o.rotation.set((r() - 0.5) * 0.06, r() * Math.PI * 2, (r() - 0.5) * 0.06)
    },
    ['#3f4d3a', '#33402f', '#4b5a42', '#2c372a', '#46523b'],
    rand,
  )

  const shrubs = scatter(
    new THREE.IcosahedronGeometry(1, 0).scale(1, 0.7, 1),
    material,
    small ? 160 : 320,
    (o, r) => {
      const side = r() < 0.5 ? -1 : 1
      const s = 0.25 + r() * 0.55
      o.position.set(side * (2 + r() * 26), s * 0.35, r() * SPAN - SPAN / 2)
      o.scale.setScalar(s)
      o.rotation.y = r() * Math.PI
    },
    ['#56643f', '#48563a', '#5e6a46'],
    rand,
  )

  const rocks = scatter(
    new THREE.DodecahedronGeometry(0.5, 0).scale(1, 0.55, 1),
    material,
    small ? 60 : 120,
    (o, r) => {
      const side = r() < 0.5 ? -1 : 1
      const s = 0.3 + r() * 1.1
      o.position.set(side * (1.2 + r() * 20), 0.05, r() * SPAN - SPAN / 2)
      o.scale.setScalar(s)
      o.rotation.set(r(), r() * Math.PI, r())
    },
    ['#8a857a', '#77736a', '#99938a'],
    rand,
  )

  // Vertex colours are white for foliage; instances carry the actual tint.
  for (const mesh of [shrubs, rocks]) paint(mesh.geometry, 1)
  scene.add(pines, shrubs, rocks)

  const flyUniforms = {
    uTime: uniforms.uTime,
    uTravel: uniforms.uTravel,
    uPixelRatio: { value: renderer.getPixelRatio() },
    uFogNear: { value: 6 },
    uFogFar: { value: 58 },
    uColor: { value: new THREE.Color() },
    uGlow: { value: 0 },
  }
  const flies = fireflies(small ? 70 : 140, flyUniforms, rand)
  scene.add(flies)

  // --- Theme: every colour eases toward its target, mirroring the CSS fade.
  const colors = ['background', 'ground', 'sky', 'soil', 'sun', 'firefly']
  const numbers = ['hemi', 'sunIntensity', 'fogNear', 'fogFar', 'glow']
  const current = {}
  const target = {}
  for (const key of colors) {
    current[key] = new THREE.Color()
    target[key] = new THREE.Color()
  }

  function setTheme(isDark, immediate = false) {
    const palette = PALETTES[isDark ? 'dark' : 'light']
    for (const key of colors) target[key].set(palette[key])
    for (const key of numbers) target[key] = palette[key]
    flies.material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending
    if (immediate) {
      for (const key of colors) current[key].copy(target[key])
      for (const key of numbers) current[key] = target[key]
    }
    needsRender = true
  }

  function applyTheme() {
    scene.background.copy(current.background)
    fog.color.copy(current.background)
    fog.near = current.fogNear
    fog.far = current.fogFar
    ground.material.color.copy(current.ground)
    hemi.color.copy(current.sky)
    hemi.groundColor.copy(current.soil)
    hemi.intensity = current.hemi
    sun.color.copy(current.sun)
    sun.intensity = current.sunIntensity
    flyUniforms.uColor.value.copy(current.firefly)
    flyUniforms.uFogNear.value = current.fogNear
    flyUniforms.uFogFar.value = current.fogFar
    flyUniforms.uGlow.value = current.glow
  }

  function easeTheme(amount) {
    let moving = false
    for (const key of colors) {
      current[key].lerp(target[key], amount)
      moving ||= !current[key].equals(target[key])
    }
    for (const key of numbers) {
      current[key] += (target[key] - current[key]) * amount
      if (Math.abs(target[key] - current[key]) < 1e-3) current[key] = target[key]
      else moving = true
    }
    return moving
  }

  // --- Input
  const pointer = new THREE.Vector2()
  const look = new THREE.Vector2()
  let scroll = 0
  let scrollEased = 0

  function setPointer(x, y) {
    pointer.set(x, y)
    if (reducedMotion) needsRender = true
  }

  function setScroll(y) {
    scroll = y
    if (reducedMotion) needsRender = true
  }

  function resize(width, height) {
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Keep the forest framed on narrow, tall screens.
    camera.fov = camera.aspect < 1 ? 62 : 50
    // On wide screens push the vanishing point right, so the copy sits on open paper.
    if (camera.aspect > 1.2) camera.setViewOffset(width * 1.4, height, 0, 0, width, height)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
    needsRender = true
  }

  // --- Loop
  let last = 0
  let frame = 0
  let running = false
  let needsRender = true
  let time = 0

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const themeMoving = easeTheme(1 - Math.exp(-dt * 4))
    applyTheme()

    if (reducedMotion) {
      scrollEased = scroll
      look.copy(pointer)
    } else {
      time += dt
      scrollEased += (scroll - scrollEased) * (1 - Math.exp(-dt * 3))
      look.lerp(pointer, 1 - Math.exp(-dt * 2.5))
    }

    uniforms.uTime.value = time
    uniforms.uTravel.value = time * SPEED + scrollEased * 0.02

    camera.position.x = look.x * 0.9
    camera.position.y = 1.7 + look.y * 0.35 + (reducedMotion ? 0 : Math.sin(time * 0.8) * 0.04)
    camera.lookAt(look.x * 0.3, 2.3 + look.y * 0.6, -20)

    if (!reducedMotion || needsRender || themeMoving) {
      renderer.render(scene, camera)
      needsRender = false
    }
    frame = requestAnimationFrame(step)
  }

  function start() {
    if (running) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(step)
  }

  function stop() {
    running = false
    cancelAnimationFrame(frame)
  }

  function dispose() {
    stop()
    scene.traverse((object) => {
      object.geometry?.dispose()
      object.material?.dispose()
    })
    renderer.dispose()
  }

  setTheme(dark, true)
  applyTheme()

  return { start, stop, resize, setTheme, setPointer, setScroll, dispose }
}
