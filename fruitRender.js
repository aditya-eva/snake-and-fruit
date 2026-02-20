import * as THREE from "three"

export function createFruit(scene) {
    const fruitGeometry = new THREE.SphereGeometry(0.5, 16, 16)
    const fruitMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
    const fruitMesh = new THREE.Mesh(fruitGeometry, fruitMaterial)
    scene.add(fruitMesh)
    return fruitMesh;
}
