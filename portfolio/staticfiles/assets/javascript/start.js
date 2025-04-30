import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mazeSize = 10;
const cellSize = 2;
const wallThickness = 0.1;
const wallHeight = 2;

let scene, camera, renderer, group, orbitControls;
let PI, PI90;

let floorTexture, wallTexture, skyboxTexture;

const maze = [];

init();

function init() {
    const container = document.getElementById('container');
    if (!container) {
        console.error('Container element not found!');
        return;
    }

    PI = Math.PI;
    PI90 = Math.PI / 2;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 12.5, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();

    group = new THREE.Group();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    group.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.castShadow = true;
    dirLight.position.set(15, 5, -10);
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = 0.0001;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 1000;
    group.add(dirLight);

    scene.add(group);

    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
        loadFloor();
        loadBackground();
        generateMaze(mazeSize, mazeSize);
        renderer.setAnimationLoop(animate);
    };

    const floorLoader = new THREE.TextureLoader(manager);
    floorTexture = floorLoader.load('/static/assets/images/cobble-floor.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    const wallLoader = new THREE.TextureLoader(manager);
    wallTexture = wallLoader.load('/static/assets/images/brick_texture.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(0.5, 0.5);

    const cubeLoader = new THREE.CubeTextureLoader(manager);
    skyboxTexture = cubeLoader.load([
        '/static/assets/images/sunsetflat_rt.jpg', 
        '/static/assets/images/sunsetflat_lf.jpg', 
        '/static/assets/images/sunsetflat_up.jpg',
        '/static/assets/images/sunsetflat_dn.jpg', 
        '/static/assets/images/sunsetflat_ft.jpg', 
        '/static/assets/images/sunsetflat_bk.jpg', 
    ]);
}

function loadFloor() {
    const size = mazeSize * cellSize;
    const repeats = mazeSize * 2;
    floorTexture.repeat.set(repeats, repeats);

    const mat = new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.DoubleSide, roughness: 1 });
    const geo = new THREE.PlaneGeometry(size, size);
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -PI90;
    floor.receiveShadow = true;
    group.add(floor);
}

function loadBackground() {
    const cubeLoader = new THREE.CubeTextureLoader();
    skyboxTexture = cubeLoader.load([
        '/static/assets/images/sunsetflat_lf.jpg',
        '/static/assets/images/sunsetflat_rt.jpg',
        '/static/assets/images/sunsetflat_up.jpg',
        '/static/assets/images/sunsetflat_dn.jpg',
        '/static/assets/images/sunsetflat_ft.jpg',
        '/static/assets/images/sunsetflat_bk.jpg',
    ]);
    
    scene.background = skyboxTexture;  
}


function generateMaze(rows, cols) {
    for (let y = 0; y < rows; y++) {
        maze[y] = [];
        for (let x = 0; x < cols; x++) {
            maze[y][x] = { x, y, visited: false, walls: { top: true, right: true, bottom: true, left: true } };
        }
    }
    carvePath(0, 0);


    for (let x = 0; x < cols; x++) {
        maze[0][x].walls.top = true;           
        maze[rows - 1][x].walls.bottom = true;  
    }
    for (let y = 0; y < rows; y++) {
        maze[y][0].walls.left = true;            
        maze[y][cols - 1].walls.right = true;
    }
    
    maze[0][0].walls.top = false;
    maze[rows - 1][cols - 1].walls.bottom = false;

    renderMaze();
}

function carvePath(x, y) {
    maze[y][x].visited = true;
    const dirs = shuffle(['top', 'right', 'bottom', 'left']);
    for (const dir of dirs) {
        let nx = x, ny = y;
        if (dir === 'top') ny--;
        if (dir === 'right') nx++;
        if (dir === 'bottom') ny++;
        if (dir === 'left') nx--;
        if (
            ny >= 0 && ny < mazeSize &&
            nx >= 0 && nx < mazeSize &&
            !maze[ny][nx].visited
        ) {
            maze[y][x].walls[dir] = false;
            maze[ny][nx].walls[opposite(dir)] = false;
            carvePath(nx, ny);
        }
    }
}

function renderMaze() {
    for (const row of maze) {
        for (const cell of row) {
            const cx = cell.x * cellSize - (mazeSize * cellSize) / 2 + cellSize / 2;
            const cz = cell.y * cellSize - (mazeSize * cellSize) / 2 + cellSize / 2;
            if (cell.walls.top)    createWall(cx, cz - cellSize / 2, 0, true, true);
            if (cell.walls.bottom) createWall(cx, cz + cellSize / 2, 0, true, true);
            if (cell.walls.left)   createWall(cx - cellSize / 2, cz, PI90, true, true);
            if (cell.walls.right)  createWall(cx + cellSize / 2, cz, PI90, true, true);
        }
    }
}

function createWall(x, z, rotationY = 0, receive = true, cast = true) {
    const geo = new THREE.BoxGeometry(wallThickness, wallHeight, cellSize);
    const mat = new THREE.MeshPhongMaterial({ map: wallTexture, side: THREE.DoubleSide, shininess: 50 });
    const wall = new THREE.Mesh(geo, mat);

    wall.castShadow = cast;
    wall.receiveShadow = receive;

    wall.position.set(x, wallHeight / 2, z);
    wall.rotation.y = rotationY;

    group.add(wall);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function opposite(dir) {
    return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[dir];
}

function animate() {
    orbitControls.update();
    renderer.render(scene, camera);
}
