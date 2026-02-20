import * as THREE from 'three';
import { createFruit } from "./fruitRender"
import { perspectiveCamera } from './core/camera';
import { addLights } from './core/light';
import { createBoard } from './gameComponents/board';
import { renderSnake } from './gameComponents/snake/renderSnake';
import { makeNewFruit } from './gameComponents/createFruit';
import renderer from './core/renderer';
import { restartGame } from './gameComponents/restartGame';
import { windowResize } from './core/windowResizing';

const gridSize = 20;
let snake = [{ x: 6, y: 6 }]
let fruit = { x: 5, y: 5 }
let direction = { x: 1, y: 0 }
let nextDirection = { x: 1, y: 0 }
let score = 0
let gameOver = false
let gameStarted = false
let lastUpdatedTime = 0
let updateInterval = 300

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

const camera = perspectiveCamera(gridSize);
scene.add(camera);

renderer

addLights(scene);

createBoard(gridSize, scene);

const fruitMesh = createFruit(scene);
fruitMesh.position.set(fruit.x, 0.5, fruit.y);

let snakeSegments = [];
const scoreBoard = document.querySelector(".score");

windowResize(camera, renderer);


function updateSnake() {
    // Apply nextDirection to Direction
    direction = { ...nextDirection };
    // compute New Head
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    if(newHead.x < 0 || newHead.x > gridSize || newHead.y < 0 || newHead.y > gridSize ) {
        gameOver = true;
        return;
    }
    let ans = snake.some((point) => point.x === newHead.x && point.y === newHead.y);
    if(ans) {
        gameOver = true;
        return;
    }
    // add new Head at the beggining
    snake.unshift(newHead);
    if(newHead.x === fruit.x && newHead.y === fruit.y) {
        score++;
        scoreBoard.innerHTML = score;
        makeNewFruit(gridSize, fruit, fruitMesh, snake)
    } else {
        // remove last element
        snake.pop();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.x !== 0) {
        nextDirection = { x: 0, y: -1 }
    } else if (e.key === 'ArrowDown' && direction.x !== 0) {
        nextDirection = { x: 0, y: 1 }
    } else if (e.key === 'ArrowLeft' && direction.y !== 0) {
        nextDirection = { x: -1, y: 0 }
    } else if (e.key === 'ArrowRight' && direction.y !== 0) {
        nextDirection = { x: 1, y: 0 }
    }
})
 

const gameOverDiv = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
       
restartBtn.addEventListener('click', () => {
    restartGame(snakeSegments, snake, direction, nextDirection, scene);
    score = 0;
    gameOver = false;
    gameStarted = false;
    gameOverDiv.style.display = "none";   
    scoreBoard.innerText = score;
})

function animate(currentTime) {
    requestAnimationFrame(animate);
    fruitMesh.rotation.x += 0.01
    if (!gameOver && currentTime - lastUpdatedTime > updateInterval) {
        console.log(updateInterval);
        updateSnake();
        renderSnake(snake, snakeSegments, scene);
        lastUpdatedTime = currentTime;
    }
    if(gameOver) {
        gameOverDiv.style.display = "block";   
    }
    renderer.render(scene, camera);
}

animate(0);
renderSnake(snake, snakeSegments, scene);