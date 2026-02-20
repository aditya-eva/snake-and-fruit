import * as THREE from "three"

export function createBoard(scene) {
    const boardSize = 20;
    const boardGeometry = new THREE.PlaneGeometry(boardSize, boardSize);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: "white", metalness: 0.3 });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.rotation.x = -Math.PI / 2;
    board.receiveShadow = true;
    scene.add(board);
}
