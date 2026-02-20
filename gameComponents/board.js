import * as THREE from 'three';

export function createBoard(gridSize, scene) {
    const geometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const gridMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide })
    const board = new THREE.Mesh(geometry, gridMaterial);
    board.rotation.x = -Math.PI / 2;
    board.position.set(gridSize / 2, 0, gridSize / 2);
    scene.add(board);
    const gridHelper = new THREE.GridHelper(gridSize, gridSize);
    gridHelper.position.set(gridSize / 2, 0.01, gridSize / 2);
    scene.add(gridHelper);
} 