
<template>
    <div class="chat">
        <img src="@/assets/logo.png" class="logo">
        <div class="resultChat">
            <ChatBox></ChatBox>
        </div>
        <canvas ref="canvas" class="idle"></canvas>
        <!-- 테스트코드 -->
        <button type="button" @click="changeTexture">의상바꾸기</button>
        <div class="input">
            <InputChat></InputChat>
        </div>
    </div>
</template>

<style scoped>
.input{
    position: fixed;
    
    /* border: 1px solid green; */

}
.logo{
    width: 80%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    margin-bottom: 20px;
    /* border:1px solid blue; */
}
.chat{
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content:space-around;
    width:100%;
    /* border:1px solid green; */
}

canvas{
    display:block;
    width:100%;
    height:40%;
}

.resultChat{
    position: relative;
    bottom: -20px;
    width: 100%;
    height: 25%;
    /* border: 1px solid red; */
}
</style>

<script setup>
import ChatBox from '@/components/Chat/ChatBox.vue';
import InputChat from '@/components/Chat/InputChat.vue';
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = ref(null);
let mixer, renderer, camera, scene, controls;
let idleAction, danceAction;
const transitionDuration = 0.5;

const resizeCanvas = () => {
    const parentElement = canvas.value.parentElement;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight*0.5;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

const setAnimation = (action) => {
    if(action === 'dance'){
        if (idleAction && danceAction) {
            idleAction.crossFadeTo(danceAction, transitionDuration, false);
            danceAction.reset();
            danceAction.play();
            danceAction.getMixer().addEventListener('finished', () => {
                danceAction.stop();
                danceAction.crossFadeTo(idleAction, transitionDuration, false);
                idleAction.reset();
                idleAction.play();
                canvas.value.classList.remove('dance');
                canvas.value.classList.add('idle');
            });
        }
    }
}

const handleCanvasClick = () => {
    canvas.value.classList.remove('idle');
    canvas.value.classList.add('dance');
    setAnimation('dance');
}

const changeTexture = () => {
    const newTextureUrl = new URL('@/assets/texture_green.jpg', import.meta.url).href;
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(newTextureUrl, (newTexture) => {
        scene.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material) => {
                        if (material.map) {
                            material.map = newTexture;
                            material.needsUpdate = true;
                        }
                    });
                } else {
                    if (child.material.map) {
                        child.material.map = newTexture;
                        child.material.needsUpdate = true;
                    }
                }
            }
        });
    });
}

onMounted(async () => {
    await nextTick();

    const parentElement = canvas.value.parentElement;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight*0.5;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(0, 7, 40); // 카메라 위치 설정

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(1, 1, 10).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // 기본 조명 추가
    scene.add(ambientLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI/2;
    controls.minPolarAngle = Math.PI/2;
    controls.enablePan = false;
    controls.target.set(0,-4,0);
    controls.update();

    const fbxLoader = new FBXLoader();

    const idleModelUrl = new URL('@/assets/kiki_idle.fbx', import.meta.url).href;
    fbxLoader.load(
        idleModelUrl,
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
        if (object.animations && object.animations.length > 0) { // 애니메이션이 있는지 확인
            idleAction = mixer.clipAction(object.animations[0]);
            idleAction.play();
        } else {
            console.error('No animations found in the idle model.');
        }

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

    const danceModelUrl = new URL('@/assets/kiki_dance.fbx', import.meta.url).href;
    fbxLoader.load(
        danceModelUrl,
        (object) => {
            if (object.animations && object.animations.length > 0) {
                danceAction = mixer.clipAction(object.animations[0]);
                danceAction.loop = THREE.LoopOnce;
                danceAction.clampWhenFinished = true; // 애니메이션이 끝나면 마지막 프레임 유지
            } else {
                console.error('No animations found in the dance model.');
            }
        },
        (xhr) => {
            console.log((xhr.loaded/xhr.total)*100+'% loaded');
        },
        (error) => {
            console.error('An error happened', error);
        }
    );

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        light.position.copy(camera.position);
        
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.value.addEventListener('click', handleCanvasClick);
});

onUnmounted(()=>{
    window.removeEventListener('resize', resizeCanvas);

    if (canvas.value) {
        canvas.value.removeEventListener('click', handleCanvasClick);
    }
})

</script>