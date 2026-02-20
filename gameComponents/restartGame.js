
export function restartGame(snakeSegments, snake, direction, nextDirection, scene) {
    snakeSegments.forEach(segment => {
        scene.remove(segment);
    });
    snakeSegments.length = 0;
    snake.length = 0;
    snake.push({ x: 6, y: 6 });

    direction.x = 1;
    direction.y = 0;

    nextDirection.x = 1;
    nextDirection.y = 0;
}