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
let snake = [{ x: 6, y: 6 }];
let previousSnake = JSON.parse(JSON.stringify(snake));
let fruit = { x: 5, y: 5 }
let direction = { x: 1, y: 0 }
let nextDirection = { x: 1, y: 0 }
let score = 0
let gameOver = false
let gameStarted = false
let lastUpdatedTime = 0
let updateInterval = 180


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


const finalScore = document.getElementById("finalScore")
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
        updateLeaderboard();
        finalScore.innerText = score;
        gameOverDiv.classList.remove("hidden");
        return;
    }
    let ans = snake.some((point) => point.x === newHead.x && point.y === newHead.y);
    if(ans) {
        gameOver = true;
        updateLeaderboard();
        finalScore.innerText = score;
        gameOverDiv.classList.remove("hidden");
        return;
    }
    // add new Head at the beggining
    snake.unshift(newHead);
    if(newHead.x === fruit.x && newHead.y === fruit.y) {
        score++;
        scoreBoard.innerHTML = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }
        makeNewFruit(gridSize, fruit, fruitMesh, snake)
    } else {
        // remove last element
        snake.pop();
    }
}


document.addEventListener('keydown', (e) => {
    if (e.code === "Space" && !gameStarted) {
        gameStarted = true;
        startScreen.classList.add("hidden");
        return;
    }
    if (!gameStarted || gameOver) return;
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
const startScreen = document.getElementById("startScreen");
const highScoreElement = document.getElementById("highScore");
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const leaderboardList = document.getElementById("leaderboardList");
let playerName = "";


let leaderboard = JSON.parse(localStorage.getItem("snakeLeaderboard")) || [
    {name: "Aditya Mohaty", score: 2000},
    {name: "Virat Kohli", score: 83},
    {name: "Rohit Sharma", score: 62},
    {name: "Pat cummins", score: 14}
];


let highScore = localStorage.getItem("snakeHighScore");
if (highScore === null) {
    highScore = 2000;
    localStorage.setItem("snakeHighScore", highScore);
} else {
    highScore = Number(highScore);
}
highScoreElement.innerText = highScore;


startBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name === "") {
        alert("Please enter your name!");
        return;
    }
    playerName = name;
    gameStarted = true;
    startScreen.classList.add("hidden");
});


function updateLeaderboard() {
    if (!playerName) return;
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("snakeLeaderboard", JSON.stringify(leaderboard));
    renderLeaderboard();
}


function renderLeaderboard() {
    leaderboardList.innerHTML = "";
    leaderboard.forEach((player, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score}</span>
        `;
        leaderboardList.appendChild(li);
    });
}


restartBtn.addEventListener('click', () => {
    restartGame(snakeSegments, snake, direction, nextDirection, scene);
    score = 0;
    gameOver = false;
    gameStarted = false;
    gameOverDiv.classList.add("hidden");
    startScreen.classList.remove("hidden");
    scoreBoard.innerText = score;
})


let accumulator = 0;


function animate(currentTime) {
    requestAnimationFrame(animate);


    if (!lastUpdatedTime) lastUpdatedTime = currentTime;


    const delta = currentTime - lastUpdatedTime;
    lastUpdatedTime = currentTime;


    accumulator += delta;


    while (accumulator >= updateInterval) {
        previousSnake = JSON.parse(JSON.stringify(snake));
        updateSnake();
        accumulator -= updateInterval;
    }


    const alpha = accumulator / updateInterval;


    renderSnakeInterpolated(snake, previousSnake, alpha);


    renderer.render(scene, camera);
}


function renderSnakeInterpolated(currentSnake, previousSnake, alpha) {
    currentSnake.forEach((segment, index) => {
        if (!snakeSegments[index]) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: "lime" });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            snakeSegments.push(mesh);
        }


        const prev = previousSnake[index] || segment;


        const interpolatedX = prev.x + (segment.x - prev.x) * alpha;
        const interpolatedY = prev.y + (segment.y - prev.y) * alpha;


        snakeSegments[index].position.set(interpolatedX, 0.5, interpolatedY);
    });
    while (snakeSegments.length > currentSnake.length) {
        const mesh = snakeSegments.pop();
        scene.remove(mesh);
    }
}
animate(0);
renderSnake(snake, snakeSegments, scene);
renderLeaderboard();