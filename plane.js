import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//Сцена
const scene = new THREE.Scene()

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

//Загрузка
const loader = new GLTFLoader()

loader.load(
    'models/soviet_plane/scene.gltf',
    (gltf) => {
        const model = gltf.scene
        model.scale.set(1, 1, 1)
        model.position.set(1, 1, 1)
        scene.add(model)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% загружено")
    },
    (error) => {
        console.error('Ошибка: ' + error)
    }
)

//В отдельном файле не работает, в индексе работает