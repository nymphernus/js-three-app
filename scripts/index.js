import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Сцена
const scene = new THREE.Scene()

// Камера
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 3, 10)
camera.rotation.x = 6

// Рендер
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Свет
const ambientLight = new THREE.AmbientLight('white', 0.5)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight('white', 1)
dirLight.position.set(5, 5, 5)
dirLight.castShadow = true
scene.add(dirLight)

//Загрузка
const loader = new GLTFLoader()

let car

loader.load(
    'models/car/scene.gltf',
    (gltf) => {
        car = gltf.scene
        car.scale.set(1.5, 1.5, 1.5)
        car.position.set(0, 0, 0)
        scene.add(car)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% загружено")
    },
    (error) => {
        console.error('Ошибка: ' + error)
    }
)

// Создание фигур
const road = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshStandardMaterial({color: 'grey'}))
road.rotation.x = -Math.PI / 2
scene.add(road)

// Движение машины
let angle = 0
let isMoving = false
window.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowUp')
        isMoving = true
})
window.addEventListener('keyup', (event) => {
    if(event.key === 'ArrowUp')
        isMoving = false
})

function moveCar() {
    if(!car || !isMoving) return
    angle += 0.01
    car.position.x = 5 * Math.cos(angle)
    car.position.z = 5 * Math.sin(angle)
    car.rotation.y = -angle
}

//Точки
const infoPoints = [
    { position: new THREE.Vector3(5, 0, 0), message: 'Первый' },
    { position: new THREE.Vector3(0, 0, 5), message: 'Второй' },
    { position: new THREE.Vector3(-5, 0, 0), message: 'Третий' },
    { position: new THREE.Vector3(0, 0, -5), message: 'Четвертый' }
]

function checkInfoPoints() {
    infoPoints.forEach(point => {
        const distance = car.position.distanceTo(point.position)
        if(distance < 0.5)
            showInfo(point.message)
    })
}

function showInfo(message) {
    const infoBox = document.getElementById("iblock")
    infoBox.innerText = message
    infoBox.style.display = 'block'
}

function createInfoSphere(position) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshStandardMaterial({color:'red'}))
    sphere.position.copy(position)
    sphere.position.y = 2
    scene.add(sphere)
}

infoPoints.forEach(point => {
    createInfoSphere(point.position)
})
//Зацикленный рендер и анимация
function animate(){
    requestAnimationFrame(animate)
    moveCar()
    checkInfoPoints()

    renderer.setClearColor('lightblue')
    renderer.render(scene, camera)
}

animate()