import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Сцена
const scene = new THREE.Scene()

// Свет

const ambientLight = new THREE.AmbientLight('yellow', 0.1)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight('white', 1)
dirLight.position.set(0, 0, 5)
scene.add(dirLight)

const pointLight = new THREE.PointLight('white', 20, 100)
pointLight.position.set(-8, 3, 3)
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(pointLightHelper)


const spotLight = new THREE.SpotLight('white', 1)
spotLight.position.set(8, 3, 3)
scene.add(spotLight)

//ФОНАРИК
const flashlight = new THREE.SpotLight('white', 10);
flashlight.position.set(0, 0, 0);
flashlight.angle = Math.PI / 4; // Угол освещения
flashlight.penumbra = 0.1;
flashlight.decay = 2;
flashlight.distance = 100;
scene.add(flashlight);


//Камера
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.z = 8

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

//Текстуры
const texture_grass = new THREE.TextureLoader().load('img/grass_seamless_texture_1403.jpg')
const texture_grassMaterial = new THREE.MeshBasicMaterial({map: texture_grass})

const texture_marble = new THREE.TextureLoader().load('img/marble_tiles_seamless_texture_2690.jpg')
const texture_marbleMaterial = new THREE.MeshBasicMaterial({map: texture_marble})

const texture_glass = new THREE.TextureLoader().load('img/glass_seamless_texture_3533.jpg')
const texture_glassMaterial = new THREE.MeshBasicMaterial({map: texture_glass})

const texture_gold = new THREE.TextureLoader().load('img/metal_seamless_texture_4105.jpg')
const texture_goldMaterial = new THREE.MeshBasicMaterial({map: texture_gold})


const originalMaterial = new THREE.MeshStandardMaterial({color: 'red'})
const highlightMaterial = new THREE.MeshStandardMaterial({color: 'yellow', emissive: 'white', emissiveIntensity: 0.5})


//Создание геометрии(Куб)
const geometry = new THREE.BoxGeometry(2, 2, 2)
const materialTexture = new THREE.MeshStandardMaterial({map: texture_marble})
const materialColor = new THREE.MeshStandardMaterial({color:'blue'})
const cube = new THREE.Mesh(geometry, materialTexture)
const cube_2 = new THREE.Mesh(geometry, materialColor)
const cube_3 = new THREE.Mesh(geometry, originalMaterial)
cube.position.set(-6, 2.5, 0)
cube_2.position.set(6, 2.5, 0)
cube_3.position.set(0, 0, 0)
scene.add(cube)
scene.add(cube_2)
scene.add(cube_3)

//Сфера
const sphereGeometry = new THREE.SphereGeometry(0.9, 100, 100)
const sphereMaterial = new THREE.MeshPhongMaterial({
    emissive: 'white',
    emissiveMap: texture_glass,
    shininess: 10
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 7, 0)
scene.add(sphere)

//Кольцо
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.5, 16, 100),
    new THREE.MeshStandardMaterial({map: texture_gold})
)
torus.position.set(0, 7, 0)
scene.add(torus)

//Плоскость
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    texture_grassMaterial
)
plane.position.set(0, 3, 0)
scene.add(plane)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let isFlashlightOn = false;
// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') { // Проверяем нажатие клавиши "F"
        isFlashlightOn = !isFlashlightOn; // Переключаем состояние
        flashlight.visible = isFlashlightOn; // Включаем или выключаем фонарик
    }
});

//GSAP CUBE_3
function gsap_cube_3(){
    gsap.to(cube_3.position, {
        y: 2,
        x: 1,
        duration: 1,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
    })
}
function colorRandom(){
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    const rndColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    if (intersects.length > 0) {
        intersects[0].object.material.color.set(rndColor)
    }
}
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)
    const rndPos = Math.floor(Math.random() * 11) - 5
    if (intersects.length > 0) {
        intersects[0].object.position.set(rndPos, rndPos, 1)
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    // colorRandom()
}

window.addEventListener('mousemove', onMouseMove)
// window.addEventListener('click', onMouseClick)

function coord_for_animation(){
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    cube_2.rotation.x += 0.01
    cube_2.rotation.y -= 0.01
    sphere.rotation.x -= 0.01
    sphere.rotation.y -= 0.01
    torus.rotation.y -= 0.01
    torus.rotation.z -= 0.01
    plane.rotation.z += 0.01
}

let isHovered = false
//Зацикленный рендер и анимация
function animate(){
    requestAnimationFrame(animate)
    raycaster.setFromCamera(mouse,camera)
    flashlight.position.copy(camera.position)
    flashlight.rotation.copy(camera.rotation)

    const intersects = raycaster.intersectObjects(scene.children)
   
    if (intersects.length > 0 && intersects[0].object === cube_3 && !isHovered) {
        cube_3.material = highlightMaterial
        isHovered = true
        gsap.to(cube_3.scale, {x: 1.5, y: 1.5, duration: 1.5, ease: "power1.out"})
    }
    else if(intersects.length == 0 && isHovered) {
        cube_3.material = originalMaterial
        isHovered = false
        gsap.to(cube_3.scale, {x: 1, y: 1, duration: 1.5, ease: "power1.out"})
    }


    // coord_for_animation()
    controls.update()
    renderer.render(scene, camera)

}

// gsap_cube_3()
animate()