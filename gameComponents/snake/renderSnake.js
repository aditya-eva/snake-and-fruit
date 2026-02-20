import * as THREE from "three"
import { createSegment } from "./createSnake";

export function renderSnake(snake, snakeSegments, scene) {
    if(snakeSegments.length < snake.length) {
        createSegment(snake[snakeSegments.length].x, snake[snakeSegments.length].y, scene, snakeSegments)
    }
    snake.forEach((pos, idx) => {
        snakeSegments[idx].position.set(pos.x, 1, pos.y);
    })
}