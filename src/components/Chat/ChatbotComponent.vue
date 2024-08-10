<template>
    <div class="chat">
        <img src="@/assets/logo.png" class="logo">
        <div class="resultChat">
            <ChatBox :message="message"></ChatBox>
        </div>
        <canvas ref="canvas" class="idle"></canvas>
        <button type="button" @click="changeTexture" class="color_button" :class="{hidden:store.isHidden}">색상 바꾸기</button>
        <div class="input">
            <InputChat @send-message="handleSendMessage" @receive-message="handleReceiveMessage"></InputChat>
        </div>
    </div>
</template>
<style scoped>
.hidden{
    display: none;
}
.input {
    position: fixed;
    /* border: 1px solid green; */
}

.logo {
    width: 80%;
    max-width: 600px;
    height: auto;
    object-fit: contain;
    margin-bottom: 20px;
    /* border:1px solid blue; */
}

.chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    /* border:1px solid green; */
}

canvas {
    display: block;
    width: 100%;
    height: 40%;
}

.resultChat {
    position: relative;
    bottom: -20px;
    width: 100%;
    height: 25%;
    /* border: 1px solid red; */
}

.color_button {
    font-family: "Pretendard Variable";
    font-size: 15px;
    font-weight: 500;
    color: ffb41d;

    margin-top: 10px;
    margin-bottom: -10px;
    padding: 10px;

    background-color: white;
    border-radius: 10px;
}
</style>

<script setup>
import ChatBox from '@/components/Chat/ChatBox.vue';
import InputChat from '@/components/Chat/InputChat.vue';
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useStyleStore } from '@/stores/inputStore';

//pinia > 버튼 상태 관리
const store = useStyleStore();

// 메시지 데이터와 메시지 전송 핸들러 추가
const message = ref(null);

const handleSendMessage = (message) => {
    // 사용자가 보낸 메시지는 처리시 사용.
};

const handleReceiveMessage = (receivedMessage) => {
    message.value = { ...receivedMessage, id: Date.now() };
};

const canvas = ref(null);
let mixer, renderer, camera, scene, controls;
let idleAction, danceAction;
const transitionDuration = 0.5;
let currentTargetColor = '#f06687'; // 초기 타겟 색상

// 캔버스 크기 조절 함수
const resizeCanvas = () => {
    const parentElement = canvas.value.parentElement;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight * 0.5;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

// 애니메이션 설정 함수
const setAnimation = (action) => {
    if (action === 'dance') {
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
};

// 캔버스 클릭 핸들러
const handleCanvasClick = () => {
    canvas.value.classList.remove('idle');
    canvas.value.classList.add('dance');
    setAnimation('dance');
};

// 랜덤 색상 생성 함수
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// 특정 색상을 랜덤 색상으로 변경하는 함수
const changeTextureColor = (texture, targetColor) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = texture.image;

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetRGB = hexToRgb(targetColor);
    const randomColor = getRandomColor();
    const randomRGB = hexToRgb(randomColor);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] === targetRGB.r && data[i + 1] === targetRGB.g && data[i + 2] === targetRGB.b) {
            data[i] = randomRGB.r;
            data[i + 1] = randomRGB.g;
            data[i + 2] = randomRGB.b;
            data[i + 3] = 255; // 알파값을 255로 설정
        }
    }

    context.putImageData(imageData, 0, 0);

    // 텍스처 업데이트
    texture.image = canvas;
    texture.needsUpdate = true;

    return randomColor; // 반환된 랜덤 색상
};

// 헥스 코드를 RGB로 변환하는 함수
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: (bigint & 255),
    };
};

// 텍스처 변경 함수
const changeTexture = () => {
    console.log("changeTexture!");
    let newTargetColor = currentTargetColor; // 초기 타겟 색상
    scene.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach((material) => {
                    if (material.map) {
                        newTargetColor = changeTextureColor(material.map, newTargetColor);
                    }
                });
            } else {
                if (child.material.map) {
                    newTargetColor = changeTextureColor(child.material.map, newTargetColor);
                }
            }
        }
    });
    currentTargetColor = newTargetColor; // 업데이트된 타겟 색상
};

// 모델 로드 함수
const loadModel = (url, onLoad, onProgress, onError) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(url, onLoad, onProgress, onError);
};

// 씬 초기화 함수
const initScene = () => {
    const parentElement = canvas.value.parentElement;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight * 0.5;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1000);
    camera.position.set(0, 7, 40);

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // 조명 설정
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, -1, 2).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040); // 기본 조명 추가
    scene.add(ambientLight);

    // 환경 조명 추가
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    controls.target.set(0, -4, 0);
    controls.update();
};

// 모델 로드 및 애니메이션 설정
const setupModelsAndAnimations = () => {
    const idleModelUrl = new URL('@/assets/kiki_idle.fbx', import.meta.url).href;
    loadModel(
        idleModelUrl,
        (object) => {
            object.scale.set(1, 1, 1);
            object.position.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            object.position.sub(center);
            object.position.y -= size.y / 3;

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
            if (object.animations && object.animations.length > 0) {
                idleAction = mixer.clipAction(object.animations[0]);
                idleAction.play();
            } else {
                console.error('No animations found in the idle model.');
            }

            scene.add(object);
            renderer.render(scene, camera);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error happened', error);
        }
    );

    const danceModelUrl = new URL('@/assets/kiki_dance.fbx', import.meta.url).href;
    loadModel(
        danceModelUrl,
        (object) => {
            if (object.animations && object.animations.length > 0) {
                danceAction = mixer.clipAction(object.animations[0]);
                danceAction.loop = THREE.LoopOnce;
                danceAction.clampWhenFinished = true;
            } else {
                console.error('No animations found in the dance model.');
            }
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error happened', error);
        }
    );
};

// 애니메이션 루프
const animate = () => {
    const clock = new THREE.Clock();

    const renderLoop = () => {
        requestAnimationFrame(renderLoop);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        renderer.render(scene, camera);
    };

    renderLoop();
};

// onMounted, onUnmounted 설정
onMounted(async () => {
    await nextTick();

    initScene();
    setupModelsAndAnimations();
    animate();

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.value.addEventListener('click', handleCanvasClick);
});

onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas);

    if (canvas.value) {
        canvas.value.removeEventListener('click', handleCanvasClick);
    }
});
</script>