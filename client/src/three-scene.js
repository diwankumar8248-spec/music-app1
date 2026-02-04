import * as THREE from 'three';

export function setupThreeScene() {
    const container = document.getElementById('bg-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x050505); // Very dark bg

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Custom material for better look
    const material = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x1DB954, // Sparklin Green
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Floating Abstract Shapes
    const shapeGeo = new THREE.IcosahedronGeometry(1, 0);
    const shapeMat = new THREE.MeshStandardMaterial({
        color: 0x64b5f6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    // Create a few floating shapes
    const shapes = [];
    for (let i = 0; i < 3; i++) {
        const shape = new THREE.Mesh(shapeGeo, shapeMat);
        shape.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        shapes.push(shape);
        scene.add(shape);
    }

    // Gentle Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x1DB954, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4444ff, 2);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const clock = new THREE.Clock();

    // Animation Loop
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Particles Wave Effect
        const positions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            const x = geometry.attributes.position.array[i3];
            // Sine wave based on x position and time
            positions[i3 + 1] = Math.sin(elapsedTime + x) * 2 + (Math.sin(elapsedTime * 3 + x) * 0.5);
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;

        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Pulsing Shapes (Simulated Audio Reactivity)
        shapes.forEach((shape, i) => {
            shape.rotation.x += 0.01 * (i + 1);
            shape.rotation.y += 0.005 * (i + 1);

            // Pulse scale
            const scale = 1 + Math.sin(elapsedTime * 2 + i) * 0.2;
            shape.scale.set(scale, scale, scale);
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
