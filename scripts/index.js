import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// Сцена
const scene = new THREE.Scene()

// Рендер
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Камера
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.z = 8

// Управление
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 2
controls.maxDistance = 10

// Свет
const dirLight = new THREE.DirectionalLight('white', 1)
dirLight.position.set(0, 0, 5)
scene.add(dirLight)




// Текстуры
const texture_glass = new THREE.TextureLoader().load('img/glass_seamless_texture_3533.jpg')
const texture_glassMaterial = new THREE.MeshBasicMaterial({map: texture_glass})

// Сфера
const sphereGeometry = new THREE.SphereGeometry(2, 100, 100)
const sphereMaterial = new THREE.MeshPhongMaterial({
    emissive: 'white',
    emissiveMap: texture_glass,
    shininess: 10
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 0, 0)
scene.add(sphere)

// Обработчик событий
const mouse = new THREE.Vector2()

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    console.log(mouse.x, mouse.y)
}

// window.addEventListener('mousemove', onMouseMove)
// window.addEventListener('click', onMouseClick)

//Зацикленный рендер и анимация
function animate(){
    requestAnimationFrame(animate)

    controls.update()
    renderer.render(scene, camera)
}

animate()