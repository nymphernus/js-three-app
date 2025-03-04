import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//Сцена
const scene = new THREE.Scene()

//Загрузка
const loader = new GLTFLoader()

loader.load(
    'models/soviet_plane/scene.gltf',
    (gltf) => {
        const model = gltf.scene
        model.scale.set(20, 20, 20)
        model.position.set(0, 0, 0)
        scene.add(model)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% загружено")
    },
    (error) => {
        console.error('Ошибка: ' + error)
    }
)

// Свет
const ambientLight = new THREE.AmbientLight('yellow', 0.1)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight('white', 3)
dirLight.position.set(0, -5, 5)
scene.add(dirLight)

const pointLight = new THREE.PointLight('white', 500, 200)
pointLight.position.set(0, 10, 0)
scene.add(pointLight)


//ФОНАРИК
const flashlight = new THREE.SpotLight('white', 10);
flashlight.position.set(0, 0, 0);
flashlight.angle = Math.PI / 4; // Угол освещения
flashlight.penumbra = 0.1;
flashlight.decay = 2;
flashlight.distance = 100;
scene.add(flashlight);
let isFlashlightOn = false;


// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') { // Проверяем нажатие клавиши "F"
        isFlashlightOn = !isFlashlightOn; // Переключаем состояние
        flashlight.visible = isFlashlightOn; // Включаем или выключаем фонарик
    }
    if (event.key === '1') {
        window.location.href = "./index.html";
    }
});

//Камера
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.z = 8
const cameraSpeed = 0.1; // Скорость перемещения камеры

//Рендер
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 2
controls.maxDistance = 10



const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function flashOnCamera() {
    flashlight.position.copy(camera.position)
    flashlight.rotation.copy(camera.rotation)
}

//Зацикленный рендер и анимация
function animate(){
    requestAnimationFrame(animate)
    raycaster.setFromCamera(mouse,camera)

    flashOnCamera(); // Вызов функции фонарика

    controls.update()
    renderer.render(scene, camera)
}

animate()