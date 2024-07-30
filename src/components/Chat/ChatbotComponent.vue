
<template>
    <div class="chat">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<style scoped>
.chat{
    width:100%;
    border:1px solid green;
}
canvas{
    display:block;
    width:100%;
    height:100%;
}

</style>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = ref(null);
let mixer;

onMounted(async () => {
    await nextTick();

    const parentElement = canvas.value.parentElement;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(0, 7, 70); // 카메라 위치 설정

    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(1, 1, 10).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // 기본 조명 추가
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI/2;
    controls.minPolarAngle = Math.PI/2;
    controls.enablePan = false;
    controls.target.set(0,0,0);
    controls.update();

    const fbxLoader = new FBXLoader();
    const fbxModelUrl = new URL('@/assets/kiki_idle.fbx', import.meta.url).href;
    fbxLoader.load(
        fbxModelUrl,
        (object) => {
            object.scale.set(1, 1, 1); // 모델 크기 조정
            object.position.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3()); 
            const size = box.getSize(new THREE.Vector3());

            object.position.sub(center);
            object.position.y-=size.y/3;

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material.map) {
                        child.material.map.encoding = THREE.sRGBEncoding;
                    }
                }
        });

        mixer = new THREE.AnimationMixer(object);
        const action = mixer.clipAction(object.animations[0]);
        action.play();

        scene.add(object);

        renderer.render(scene, camera); // 모델이 로드되면 바로 렌더링
        },
        (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
        console.error('An error happened', error);
        }
    );

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        // const currentTime = Date.now();
        // const delta = (currentTime - previousTime) / 1000;
        // previousTime = currentTime;

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        // controls.update();

        light.position.copy(camera.position);
        
        renderer.render(scene, camera);
    };

    animate();
});

</script>