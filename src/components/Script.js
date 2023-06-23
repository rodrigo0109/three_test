import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let currentMount = null

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  //fov
  25,
  //aspect
  //currentMount.clientWidth / currentMount.clientHeight,
  100 / 100,
  //near
  0.1,
  //far
  1000
)
camera.position.z = 12
scene.add(camera)

//Renderer
const renderer = new THREE.WebGL1Renderer()
//renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
//currentMount.appendChild(renderer.domElement)

//Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(3, 3, 3)
controls.enableDamping = true
controls.target.y = 1

//Resize
const resize = () => {
  renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
  camera.aspect = currentMount.clientWidth / currentMount.clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

//loader
const gltfLoader = new GLTFLoader()
gltfLoader.load('./model/amongus.gltf',
  //onLoad
  (gltf) => {
    scene.add(gltf.scene)
  },
  //onProgress
  () => {},
  //onError
  () => {},
)


//Textures
const textureLoader = new THREE.TextureLoader()
const map = textureLoader.load('./bricks/basecolor.jpg')
const aoMap = textureLoader.load('./bricks/ao.jpg')
const roughnessMap = textureLoader.load('./bricks/roughness.jpg')
const normalMap = textureLoader.load('./bricks/normal.jpg')
const heightMap = textureLoader.load('./bricks/height.png')

//Cube
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 
  250,
  250,
  250 
)
const material = new THREE.MeshStandardMaterial({
  map: map,
  aoMap: aoMap,
  roughnessMap: roughnessMap,
  normalMap: normalMap,
  displacementMap: heightMap,
  displacementScale: 0.07
})
const cube = new THREE.Mesh(
  geometry,
  material
)
cube.position.set(3, 3, 0)
cube.scale.set(3, 3, 3)
scene.add(cube)

//Lights
const AO = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(AO)

const pointLight = new THREE.PointLight(
  0xffffff,
  1.3
)
pointLight.position.y = 5
//scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(
  0xffffff,
  1.3,
)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const enviromentMap = new THREE.CubeTextureLoader()
const envMap = enviromentMap.load([
  './envmap/px.png',
  './envmap/nx.png',
  './envmap/py.png',
  './envmap/ny.png',
  './envmap/pz.png',
  './envmap/nz.png',
])

scene.environment = envMap
scene.background = envMap

//Render the scene
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

//Mount scene
export const mountScene = (mountRef) => {
  currentMount = mountRef.current
  resize()
  currentMount.appendChild(renderer.domElement)
}

//Clean up scene
export const cleanUpScene = () => {
  scene.dispose()
  currentMount.removeChild(renderer.domElement)
}