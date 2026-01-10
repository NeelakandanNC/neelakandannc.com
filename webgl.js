import * as THREE from 'three';

const container = document.querySelector('#webgl-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Load Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/background.jpg');

// Geometry & Material
// We'll update the geometry aspect ratio once the texture loads
const geometry = new THREE.PlaneGeometry(16, 9, 32, 32);

const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTexture: { value: texture },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageResolution: { value: new THREE.Vector2(1920, 1080) } // Default assumption, updated later
    },
    vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Subtle wave effect
            float wave = sin(pos.y * 1.5 + uTime * 0.5 + uScroll * 2.0) * 0.3;
            pos.z += wave * (uScroll * 2.0); // Effect increases with scroll
            
            // Twist effect based on scroll
            pos.x += sin(uScroll * 1.0) * 1.0 * pos.y * 0.1;

            vElevation = wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uScroll;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;
        varying vec2 vUv;
        varying float vElevation;

        // Function to cover the texture like CSS background-size: cover
        vec2 cover(vec2 uv, vec2 resolution, vec2 imageResolution) {
            vec2 ratio = resolution / imageResolution;
            float maxRatio = max(ratio.x, ratio.y);
            vec2 newSize = imageResolution * maxRatio;
            vec2 offset = (newSize - resolution) / 2.0;
            vec2 newUv = uv * resolution / newSize + offset / newSize;
            return newUv;
        }

        void main() {
            vec2 uv = cover(vUv, uResolution, uImageResolution);
            vec4 texColor = texture2D(uTexture, uv);
            
            // Grayscale to "Electric Blue" conversion logic
            float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            
            // Base electric blue color
            vec3 electricBlue = vec3(0.0, 1.0, 1.0);
            
            // Mix original with electric blue based on scroll/style
            vec3 finalColor = mix(texColor.rgb, electricBlue * gray * 1.5, 0.3); // Slight tint
            
            // RGB Shift effect on scroll
            float shift = uScroll * 0.05;
            float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
            float g = texture2D(uTexture, uv).g;
            float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
            
            vec3 shiftingColor = vec3(r, g, b);

            // Combine effects
            gl_FragColor = vec4(shiftingColor, 1.0);
            
            // Darken slightly for text readability
            gl_FragColor.rgb *= 0.8;
        }
    `,
    side: THREE.DoubleSide
    // wireframe: true // Uncomment for matrix look
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 10;

// Update aspect ratio when texture loads
texture.image.onload = () => {
    material.uniforms.uImageResolution.value.set(texture.image.width, texture.image.height);
    const aspect = texture.image.width / texture.image.height;
    // Adjust scale to cover screen roughly at z=0 (camera at 10)
    // Visible height at z=0 is 2 * tan(fov/2) * distance
    const vFov = camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * camera.position.z;
    const width = height * camera.aspect;

    mesh.scale.set(width * 1.5, height * 1.5, 1); // Scale up to ensure cover
};

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

    // Subtle rotation/movement
    // mesh.rotation.y = currentScroll * 0.1;

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

    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

    // Recalculate cover scale
    const vFov = camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * camera.position.z;
    const width = height * camera.aspect;
    mesh.scale.set(width * 1.5, height * 1.5, 1);
});
