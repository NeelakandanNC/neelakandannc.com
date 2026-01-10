import * as THREE from 'three';

const container = document.querySelector('#webgl-container');

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Pure black void
scene.fog = new THREE.FogExp2(0x000000, 0.03); // Fog to hide the end

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- Geometry: The Greek Column ---
// A simple cylinder with a lot of segments to look smooth
// RadiusTop, RadiusBottom, Height, RadialSegments
const columnGeometry = new THREE.CylinderGeometry(0.6, 0.6, 12, 32, 1, true);

// --- Material: Cyber Marble Shader ---
const columnMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#FFFFFF') },
        uAccent: { value: new THREE.Color('#00FFFF') }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        uniform vec3 uColor;
        uniform vec3 uAccent;
        uniform float uTime;

        void main() {
            // "Fluting" effect (vertical grooves) using sine wave on UV x
            // A greek column typically has ~20-24 flutes
            float flutes = sin(vUv.x * 3.14159 * 20.0);
            
            // Base color mix based on flutes (shadows in grooves)
            vec3 base = mix(uColor * 0.8, uColor, smoothstep(-0.2, 0.2, flutes));
            
            // Rim lighting (Fresnel effect) for the "Electric Blue" glow
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
            
            // Add a vertical scanning holographic line
            float scan = smoothstep(0.4, 0.5, sin(vUv.y * 10.0 - uTime * 2.0));
            
            vec3 finalColor = base + (uAccent * fresnel * 2.0);
            finalColor += uAccent * scan * 0.1; // Subtle scanline

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    transparent: false
});

// --- Instancing for Infinite Hallway ---
const count = 40; // 20 pairs of columns
const mesh = new THREE.InstancedMesh(columnGeometry, columnMaterial, count);
scene.add(mesh);

// Set initial positions
const gap = 8; // Distance between pairs
const width = 10; // Width of the hallway
const dummy = new THREE.Object3D();

// Logic: We place them from Z = -5 to Z = -100 (into the distance)
// We will move the camera forward, not the pillars (or move pillars back, relatively)
// To make it infinite, we update positions in the loop. But actually, moving camera is easier with modulo.

for (let i = 0; i < count; i += 2) {
    // Left Column
    dummy.position.set(-width / 2, 0, - (i / 2) * gap);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    // Right Column
    dummy.position.set(width / 2, 0, - (i / 2) * gap);
    dummy.updateMatrix();
    mesh.setMatrixAt(i + 1, dummy.matrix);
}

// Floor (Reflective surface)
// Just a simple grid or plane
const floorGeo = new THREE.PlaneGeometry(50, 200, 50, 200);
const floorMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -6; // Below columns
scene.add(floor);


// --- Lighting ---
// Shader handles most, but let's add ambient just in case needed later
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);


camera.position.y = 0; // Eye level
camera.position.z = 5;

// Scroll Logic
let scrollY = 0;
let currentScroll = 0;

window.addEventListener('scroll', () => {
    // Normalize scroll to get a distance meter
    scrollY = window.scrollY * 0.05;
});

const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();
    columnMaterial.uniforms.uTime.value = time;

    // Smooth scroll
    currentScroll += (scrollY - currentScroll) * 0.1;

    // INFINITE RUN LOGIC
    // Instead of moving pillars, we move camera.
    // We want to loop every gap * 10 or so? 
    // Actually, simple infinite logic:
    // Move camera forward.
    // If camera passes a certain point, we don't reset camera (keeps scroll logic simple),
    // but we might run out of pillars.

    // Better Approach: Move Pillars relative to camera modulus
    const totalLength = (count / 2) * gap;

    // Virtual position based on scroll
    // We want to fly *forward* (negative Z) as we scroll down.
    const flyPos = currentScroll;

    for (let i = 0; i < count; i += 2) {
        // Calculate z position relative to loop
        // We want them to appear in front of camera

        let zPos = - (i / 2) * gap + (flyPos % totalLength);

        // Wrap around: if it goes behind camera (z > 5), move it to far back
        if (zPos > 5) {
            zPos -= totalLength;
        }
        // Also if it's too far (before loop start), though module handles most.
        // Let's rely on modulo centering.

        // Actually, logic is: z = (original_z + scroll) % totalLength
        // Base original_z is -(i/2)*gap
        // We want range roughly [5, -totalLength+5]

        // Simple Wrap:
        let dist = (flyPos + (i / 2) * gap) % totalLength;
        // dist goes from 0 to totalLength.
        // We want Z to go from slightly positive (behind us) to negative (far away)
        // Let's map dist 0 -> Z=5, dist totalLength -> Z = -totalLength + 5

        let actualZ = 5 - dist;

        // Left
        dummy.position.set(-width / 2, 0, actualZ);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        // Right
        dummy.position.set(width / 2, 0, actualZ);
        dummy.updateMatrix();
        mesh.setMatrixAt(i + 1, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Floor movement
    floor.position.z = (currentScroll % 10) - 50; // Simple loop


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
