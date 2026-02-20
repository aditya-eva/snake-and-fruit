import * as THREE from "three";

export function createSegment(x, y, scene, snakeSegments) {
    const segment = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            color: 0x00ff00
        })
    )
    segment.position.set(x, 0.5, y);
    scene.add(segment);
    snakeSegments.push(segment);
}