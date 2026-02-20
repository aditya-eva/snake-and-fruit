import * as THREE from "three";

export function perspectiveCamera(gridSize) {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(gridSize / 2, gridSize * 2, gridSize/2);
    camera.lookAt(gridSize / 2, 0, gridSize / 2);
    return camera;
}