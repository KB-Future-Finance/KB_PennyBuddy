
<template>
    <div class="speech-bubble">
        <h1>키키(KIKI)</h1>
        <p>
            오늘의 경제 소식에서는 다음과 같은 주요 이슈들이 다루어졌습니다.<br>
            모로코 프리미엄 커피 브랜드 바샤커피의 한국 상륙: 바샤커피는 서울 강남구 청담동에 국내 첫 매장을 오픈했습니다. 매장은 2개 층으로 구성되어 있으며, 고급 커피를 제공하는 '커피룸'과 원두 및 드립백을 판매하는 '부티크'로 이루어져 있습니다. 일부 커피 메뉴는 1만원을 넘고, 최고 48만원짜리 커피도 판매되고 있습니다​ (인터넷뉴스 한경닷컴)​.<br>
            티메프 미환불 고객 분쟁조정 신청 접수: 한국소비자원이 티메프에서 환불을 받지 못한 고객을 대상으로 집단 분쟁조정을 신청받기 시작했습니다. 해당 신청은 온라인을 통해 가능하며, 여행, 숙박, 항공권 관련 피해를 입은 고객들이 대상입니다​ (인터넷뉴스 한경닷컴)​.<br>
            금융당국 수장의 첫 회동: 김병환 신임 금융위원장과 이복현 금융감독원장이 첫 회동을 가졌습니다. 두 수장은 가계부채, 부동산 PF, 소상공인·자영업자 부채, 2금융권 건전성 등 4대 리스크 요인을 집중 관리하고, 글로벌 무역 및 산업구조 변화에 대응하여 금융 규제를 혁신하기로 합의했습니다​ (인터넷뉴스 한경닷컴)​​ (서울경제)​.<br>
            채권 금리 상승: 3년 만기 국고채 금리가 전 거래일보다 2.8bp 상승한 연 3.210%를 기록했습니다. 10년물, 20년물, 30년물 및 50년물 국고채 금리도 각각 상승했습니다. 3년 만기 회사채 AA-와 BBB- 금리 역시 각각 2.3bp 상승했습니다​ (서울경제)​.<br>
            이와 같은 소식들이 오늘의 경제 주요 뉴스로 다루어졌습니다.
        </p>
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

.speech-bubble h1{
    font-size: 16px;
    font-weight: 800;
}

.speech-bubble p{
    max-height: 130px;
    overflow-y: auto;
}
</style>

<script setup>

</script>