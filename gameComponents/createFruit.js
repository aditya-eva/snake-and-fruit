
export function makeNewFruit(gridSize, fruit, fruitMesh, snake) {
    let xCoord = Math.floor(Math.random() * gridSize);
    let yCoord = Math.floor(Math.random() * gridSize);
    // check weather the coordinated are in the snake 
    while(snake.some(snakeCoord => snakeCoord.x === xCoord && snakeCoord.y === yCoord)){
        xCoord = Math.floor(Math.random() * gridSize);
        yCoord = Math.floor(Math.random() * gridSize);    
    }
    fruit.x = xCoord;
    fruit.y = yCoord;
    fruitMesh.position.set(xCoord, 1, yCoord);
}