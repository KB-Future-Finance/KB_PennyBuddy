
<template>
    <div class="speech-bubble">
        <p>S&P 500와 나스닥 종합지수는 반도체 주의 강세로 사상 최고치를 기록했습니다. S&P 500은 0.1% 상승했으며, 나스닥은 0.3% 상승해 5일 연속 상승세를 보였습니다. 반면, 다우 존스 산업평균지수는 0.1% 하락했습니다</p>
    </div>
</template>

<style scoped>
.speech-bubble {
    /* border : 1px solid red; */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    padding: 15px;
    margin: 0 auto;

    background: #ffffff;
    border-radius: 10px;
    
    width: 90%;
    max-width: none;
    
    color: rgb(0, 0, 0);
    font-size: 14px;
    text-align: center;

    box-shadow: 5px 5px 10px rgb(221, 215, 202);

}

.speech-bubble::after {
    content: '';
    position: absolute;
    bottom: 0px; /* Adjust this value to move the tail */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color:#ffffff;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -10px;
}
</style>

<script setup>

</script>