<template>
    <div @click="navigateToMain">
        <div class=title ref="titleRef">
            <h1>나만의 <span>AI 금융 매니저</span>와 함께하는 빠르고 쉬운 가계부</h1>
            <img alt="logo" class="logo" src="@/assets/logo.png"/>
            <h2 class="blurredRectangle">화면을 클릭해서 시작하세요</h2>
        </div>
        <div class="decoration" ref="decorationRef">
            <img alt="bird" class="bird" src="@/assets/background/bird.png">
            <img alt="home" class="home" src="@/assets/background/home.png">
            <img alt="cloud" class="cloud1" src="@/assets/background/cloud1.png">
            <img alt="cloud" class="cloud2" src="@/assets/background/cloud2.png">
            <img alt="carrot" class="carrot" src="@/assets/background/carrot.png">
        </div>
        
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const titleRef = ref(null);
        const decorationRef = ref(null);

        const navigateToMain = () => {
            if(titleRef.value && decorationRef.value){
                titleRef.value.classList.add('up');
                decorationRef.value.classList.add('hidden');
                setTimeout(()=>{
                    router.push('/main')
                }, 500);
            }
        };

        const handleKeydown = (event) => {
            if (event.key === 'Enter') {
                navigateToMain();
                console.log("Entered Key");
            }
        };

        onMounted(() => {
            document.addEventListener('keydown', handleKeydown);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('keydown', handleKeydown);
        });

        return {
            navigateToMain,
            titleRef,
            decorationRef
        };
    }
}
</script>

<style scoped>
html, body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    overflow:hidden;
}

.title{
    /* container 배치 */
    width:100vw;
    height:85vh;
    position:fixed;
    left: 0;
    top: 0;

    /* 내부 요소 배치 */
    align-items: center;
    justify-content: center;
    overflow: hidden;

    /* 애니메이션 */
    transition: transform 0.5s ease-in-out;

    /* 테스트 코드 *반드시 삭제할 것 */
    /* border:1px solid blue; */
}

.title.up{
    transform:translateY(-100%);
}

.logo{
    /* 크기 설정 */
    width: 35%;
    min-width: 400px;
    max-width: none;


    /* 위치 설정 */
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 48%;

    /* 테스트 코드 *반드시 삭제할 것 */
    /* border: 1px solid red; */
}

h1{
    /* 위치 설정 */
    max-width: 100vw;
    text-align: center;
    position:relative;
    top: 18%;

    /* 폰트 설정 */
    color:black;
    font-weight:500;
    font-size: 24px;

    /* 테스트 코드 *반드시 삭제할 것 */
    /* border: 1px solid red; */
}

span{
    color: #FF9E10;
    font-weight: bolder;
    font-size: 26px;
}

.blurredRectangle{
    /* 박스 설정 */
    width:400px;
    height:50px;
    background-color: white;
    border-radius: 25px;
    box-shadow: 0 0px 25px white;

    /* 폰트 설정 */
    color: black;
    font-size:20px;
    font-weight:500;
    text-align:center;
    line-height: 50px;

    /* 위치 설정 */
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 80%;

    /* 테스트 코드 *반드시 삭제할 것 */
    /* border: 1px solid red; */
}

.decoration{
    width:100vw;
    height:100vh;

    position: fixed;
    top:0;
    left:0;

    overflow: hidden;

    /* 종료 애니메이션 */
    transition : opacity 0.3s ease-in-out;

    /* border: 2px solid green; */
}

.decoration.hidden{
    opacity:0;
}

.decoration > img{
    position: absolute;
    /* transform: translate(-50%, -50%); */

    /* 테스트 코드 *반드시 삭제할 것 */
    /* border: 2px solid green; */
}

.bird{
    width: 15%;
    min-width: 130px;
    left: 80%;
    bottom: 80%;
}

.home{
    width: 12%;
    min-width: 170px;
    left: 10%;
    bottom: 6%;
}

.cloud1{
    width: 15%;
    min-width: 130px;
    left: 8%;
    bottom: 65%;
}

.cloud2{
    width: 13%;
    min-width: 130px;
    left: 75%;
    bottom: 35%;
}

.carrot{
    width: 10%;
    min-width: 120px;
    left: 25%;
    bottom: -2%;
}

@media (max-width: 1024px) {
    .decoration{
        visibility:hidden;
    }
}
</style>