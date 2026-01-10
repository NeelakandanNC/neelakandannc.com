import * as THREE from 'three';

const container = document.querySelector('#webgl-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Create a Placeholder Texture
const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 1024;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#111';
ctx.fillRect(0, 0, 1024, 1024);
ctx.fillStyle = '#00FFFF'; // Electric Blue
ctx.font = 'bold 100px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('NEELAKANDAN', 512, 512);
ctx.strokeStyle = '#00FFFF';
ctx.lineWidth = 10;
ctx.strokeRect(50, 50, 924, 924);

// Add some random lines for "tech" feel
for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
    ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
    ctx.stroke();
}

const texture = new THREE.CanvasTexture(canvas);

// Geometry & Material
const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTexture: { value: texture }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Scroll distortion effect
            float wave = sin(pos.y * 2.0 + uTime + uScroll * 5.0) * 0.5;
            pos.z += wave * (uScroll); // Effect increases with scroll
            
            // Twist effect based on scroll
            pos.x += sin(uScroll * 2.0) * 2.0;

            vElevation = wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            
            // Electric blue tint based on elevation/distortion
            vec3 color = texColor.rgb;
            color.b += vElevation * 2.0;
            color.g += vElevation;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.DoubleSide
    // wireframe: true // Uncomment for matrix look
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 15;

// Scroll Logic
let scrollY = 0;
let currentScroll = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight; // Normalize roughly
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Smooth scroll interpolation
    currentScroll += (scrollY - currentScroll) * 0.1;

    material.uniforms.uTime.value = elapsedTime;
    material.uniforms.uScroll.value = currentScroll;

    // Subtle rotation
    mesh.rotation.z = currentScroll * 0.2;
    mesh.rotation.y = currentScroll * 0.5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
