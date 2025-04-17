import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// Scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cameraHolder = new THREE.Object3D(); 
const pitchObject = new THREE.Object3D();  
pitchObject.add(camera);
cameraHolder.add(pitchObject);
scene.add(cameraHolder);

camera.position.set(0, 1.6, 0);
cameraHolder.position.set(0, 0, 5); 

//character
const gltfLoader = new GLTFLoader();
let knight; 
let mixer;

gltfLoader.load('/static/assets/images/knight.glb', function (gltf) {
    knight = gltf.scene;

    knight.traverse(function (object) {
        if (object.isMesh) {
            object.castShadow = true;
        }
    });

    scene.add(knight);
    knight.position.set(0,0,-7.5)
    knight.rotation.y = Math.PI;

    mixer = new THREE.AnimationMixer(knight);

    const animations = gltf.animations;

    const idleAnimation = animations.find(animation => animation.name ==='idle');

    const idleAction = mixer.clipAction(idleAnimation)

    idleAction.play();
});

// Skybox 
const loader = new THREE.CubeTextureLoader();
const bg = loader.load([
  '/static/assets/images/sunsetflat_lf.jpg', 
  '/static/assets/images/sunsetflat_rt.jpg', 
  '/static/assets/images/sunsetflat_up.jpg', 
  '/static/assets/images/sunsetflat_dn.jpg', 
  '/static/assets/images/sunsetflat_ft.jpg', 
  '/static/assets/images/sunsetflat_bk.jpg'  
]);
scene.background = bg;

// Lighting 
const sunsetLight = new THREE.DirectionalLight(0xffaa33, 2);
sunsetLight.position.set(2, 4, -20);
sunsetLight.target.position.set(0, 5, 0);
sunsetLight.castShadow = true;
scene.add(sunsetLight);
scene.add(sunsetLight.target);

const light = new THREE.DirectionalLight(0xcc4400, .4); 
light.position.set(0, 20, 15);  
light.target.position.set(-2, 15, 0); 
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 4); 
ambientLight.position.set(-2,4,-10)
scene.add(ambientLight);

// Floor 
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/static/assets/images/cobble-floor.jpg', function (texture_floor) {
    texture_floor.repeat.set(25, 25);
    texture_floor.wrapS = THREE.RepeatWrapping;
    texture_floor.wrapT = THREE.RepeatWrapping;
});
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Grid helper
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// Wall setup
const brickTexture = textureLoader.load('/static/assets/images/brick_texture.jpg', function (texture) {
    texture.repeat.set(9, 2); 
    texture.wrapS = THREE.RepeatWrapping;  
    texture.wrapT = THREE.RepeatWrapping;
});
const wallMaterial = new THREE.MeshStandardMaterial({
    map: brickTexture,
    roughness: 1, 
    metalness: 0.2
});
const wallGeometry = new THREE.BoxGeometry(0.2, 3, 15);
const wallPositions = [
    { x: -2, z: 0 },
    { x: 2, z: 0 },
];

const walls = [];
wallPositions.forEach(pos => {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(pos.x, 1, pos.z);
    scene.add(wall);
    walls.push(wall);
});

// Lantern setup
const lanternGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
const lanternMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
const lantern1 = new THREE.Mesh(lanternGeometry, lanternMaterial);
lantern1.position.set(1.9, 2, 0);
lantern.position.set(-1.9, 2, 0); 
scene.add(lantern1);
scene.add(lantern);

const fireLight = new THREE.PointLight(0xffaa33, 1 , 20);
fireLight.position.set(-1, 2, 0);
scene.add(fireLight);

const fireLight1 = new THREE.PointLight(0xffaa33, 1, 20);
fireLight1.position.set(1, 2, 0);
scene.add(fireLight1);

function flicker() {
    fireLight.intensity = 1 + Math.random() * 0.4;
    fireLight1.intensity = 1 + Math.random() * 0.4;
    requestAnimationFrame(flicker);
}
flicker();

// Movement 
const move = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') move.forward = true;
    if (e.key === 's') move.backward = true;
    if (e.key === 'a') move.left = true;
    if (e.key === 'd') move.right = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'w') move.forward = false;
    if (e.key === 's') move.backward = false;
    if (e.key === 'a') move.left = false;
    if (e.key === 'd') move.right = false;
});

// Pointer lock 
document.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === renderer.domElement) {
        cameraHolder.rotation.y -= e.movementX * 0.002;
        pitchObject.rotation.x -= e.movementY * 0.002;
        const maxPitch = Math.PI / 3;
        const minPitch = -Math.PI / 3.25;
        pitchObject.rotation.x = Math.max(minPitch, Math.min(maxPitch, pitchObject.rotation.x));
    }
});

// Collision detection
function checkCollision(playerBox) {
    for (const wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            return true;
        }
    }
    return false;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if (mixer) {
        mixer.update(0.01);
    }

    const speed = 0.1;
    const direction = new THREE.Vector3();
    if (move.forward) direction.z -= 1;
    if (move.backward) direction.z += 1;
    if (move.left) direction.x -= 1;
    if (move.right) direction.x += 1;
    direction.normalize();

    const moveVector = new THREE.Vector3(direction.x, 0, direction.z);
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraHolder.rotation.y);

    const playerBox = new THREE.Box3().setFromObject(cameraHolder);
    const collisionVector = moveVector.clone().multiplyScalar(speed);
    const nextPosition = cameraHolder.position.clone().add(collisionVector);
    const nextPlayerBox = new THREE.Box3().setFromCenterAndSize(nextPosition, new THREE.Vector3(.3, 2, .1));

    if (!checkCollision(nextPlayerBox)) {
        cameraHolder.position.add(collisionVector);
    }

    renderer.render(scene, camera);
}
animate();

