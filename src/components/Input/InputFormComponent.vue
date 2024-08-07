<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    
    <div class="container">
        <h1 class="title"> 소비 기록하기 </h1>

        <form @submit.prevent="handleSubmit">
            <div class="date">
                <h2><span class="material-symbols-rounded icon">event_available</span><span class="subTitle"> 거래일자</span></h2>
                <input class="date-input" :value="formattedDate" readonly>
                <VDatePicker v-model="reg_date" :masks="masks">
                    <template #default="{ togglePopover }">
                        <button type="button" class="button" @click="togglePopover" style="margin-left:10px;">선택</button>
                    </template>
                </VDatePicker>
            </div>
            
            <div class="class">
                <h2><span class="material-symbols-rounded icon">view_cozy</span><span class="subTitle"> 분류</span></h2>
                <div class="class-input">
                    <label for="income" class="radio">
                        <input type="radio" name="category_type" id="income" value="1" v-model="category_type" @change="handleCategoryChange"/>
                        <span class="label"> 수입</span>
                    </label>
                    <label for="outcome" class="radio">
                        <input type="radio" name="category_type" id="outcome" value="2" v-model="category_type" @change="handleCategoryChange"/>
                        <span class="label"> 지출</span>
                    </label>
                </div>
            </div>

            <div class="category">
                <h2><span class="material-symbols-rounded icon">list</span><span class="subTitle"> 카테고리</span></h2>
                <div class="category-input">
                    <div class="select-btn" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
                        <span class="btn-text">{{ getButtonText }}</span>
                        <span class="arrow-dwn">
                            <i class="material-symbols-rounded icon">keyboard_arrow_down</i>
                        </span>
                    </div>

                    <ul class="list-items" v-show="isDropdownOpen">
                        <li class="item" v-for="category in filteredCategories" :key="category.category_id" @click.stop="selectItem(category)" :class="{ checked: selectedItem === category.category_id }">
                            <input type="radio" :value="category.category_id" v-model="selectedItem" class="radio"/>
                            <span class="item-text">{{ category.category_name }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="amount">
                <h2><span class="material-symbols-rounded icon">paid</span><span class="subTitle"> 금액</span></h2>
                <input type="text" v-model="amount" @focus="onFocus" @blur="onBlur" placeholder="금액을 입력하세요" class="amount-input">
            </div>

            <div class="memo">
                <h2><span class="material-symbols-rounded icon">sell</span><span class="subTitle"> 내역</span></h2>
                <input type="text" v-model="record_memo" class="memo-input" placeholder="내역을 입력하세요">
            </div>

            <div class="detail">
                <h2><span class="material-symbols-rounded icon">data_info_alert</span><span class="subTitle"> 메모</span></h2>
                <textarea v-model="record_details" class="detail-input" placeholder="메모를 입력하세요"></textarea>
            </div>

            <div class="enter">
                <button type="submit" class="button">확인</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.title {
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(transparent 30%, #ffcb7c 30%);
    display: inline-block;
    margin: 10px;
}

form {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 25px;
    overflow-y: auto;
}

form::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

form::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

form::-webkit-scrollbar-thumb {
    background: #FFC85E;
    border-radius: 10px;
}

form::-webkit-scrollbar-thumb:hover {
    background: #ffcb7c;
}

.material-symbols-rounded {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px !important;
    vertical-align: middle;
}

.subTitle {
    vertical-align: middle;
    font-size: 18px;
    font-weight: 700;
}

.date-input {
    width: 80%;
    height: 35px;
    padding: 5px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 5px;
    outline: none;
}

.button {
    height: 30px;
    width: 15%;
    border-radius: 15px;
    border: none;
    background-color: #FFC85E;
    font-family: "Pretendard Variable";
    font-size: 15px;
    font-weight: 500;
}

label {
    font-size: 17px;
    line-height: 2rem;
    padding: 0.2em 0.4em;
}

[type="radio"], span {
    vertical-align: middle;
}

[type="radio"] {
    appearance: none;
    border: max(2px, 0.1em) solid gray;
    border-radius: 50%;
    width: 1.25em;
    height: 1.25em;
    transition: border 0.1s ease-in-out;
    margin-right: 0.5em;
    display: inline-block;
}

[type="radio"]:checked {
    border: 0.4em solid #FFC85E;
}

[type="radio"]:hover {
    box-shadow: 0 0 0 max(4px, 0.2em) lightgray;
    cursor: pointer;
}

.select-btn {
    display: flex;
    height: 35px;
    width: 80%;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid #ccc;
}

.select-btn .btn-text {
    font-size: 16px;
}

.select-btn .arrow-dwn {
    display: flex;
    height: 21px;
    width: 21px;
    color: #fff;
    font-size: 14px;
    border-radius: 50%;
    background: #FFC85E;
    align-items: center;
    justify-content: center;
    transition: 0.3s
}

.select-btn.open .arrow-dwn {
    transform: rotate(-180deg);
}

.select-btn.open ~ .list-items {
    opacity: 0;
    animation-name: fadeInUp;
    -webkit-animation-name: fadeInUp;
    animation-duration: 0.4s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
}

.list-items {
    position: relative;
    max-width: 200px;
    width: 100%;
    border-radius: 8px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    animation-name: fadeInDown;
    -webkit-animation-name: fadeInDown;
    animation-duration: 0.35s;
    animation-fill-mode: both;
    -webkit-animation-duration: 0.35s;
    -webkit-animation-fill-mode: both;
}

.list-items .item {
    display: flex;
    align-items: center;
    list-style: none;
    height: 35px;
    cursor: pointer;
    transition: 0.3s;
    padding: 0 15px;
    border-radius: 8px;
}

.list-items .item:hover {
    background-color: antiquewhite;
}

.item .item-text {
    font-size: 16px;
    width: 100%;
}

.item .checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 16px;
    width: 16px;
    border-radius: 4px;
    margin-right: 12px;
    border: 1.5px solid #FFC85E;
    transition: all 0.3s ease-in-out;
}

.item.checked .checkbox {
    background-color: #FFC85E;
    border-color: #FFC85E;
}

.item.checked .check-icon {
    transform: scale(1);
}

.checkbox .check-icon {
    color: #fff;
    font-size: 11px;
    transform: scale(0);
    transition: all 0.2s ease-in-out;
}

@keyframes fadeInUp {
    from {
        transform: translate3d(0, 30px, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes fadeInDown {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(0, 20px, 0);
        opacity: 0;
    }
}

.category-input {
    margin-top: 5px;
}

.amount-input {
    font-family: "Pretendard Variable";
    font-size: 16px;
    width: 100%;
    height: 35px;
    border: 1px solid #ccc;
    padding: 0 15px;
    border-radius: 5px;
    margin-top: 5px;
}

.memo-input {
    font-family: "Pretendard Variable";
    font-size: 16px;
    width: 100%;
    height: 35px;
    border: 1px solid #ccc;
    padding: 0 15px;
    border-radius: 5px;
    margin-top: 5px;
}

.detail-input {
    font-family: "Pretendard Variable";
    font-size: 16px;
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    padding: 0 15px;
    border-radius: 5px;
    resize: none;
    margin-top: 5px;
}

.enter {
    width: 100%;
    text-align: center;
}

.enter .button {
    width: 60px;
    height: 35px;
    font-size: 16px;
    font-weight: 600;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const reg_date = ref(new Date());
const masks = { input: 'YYYY-MM-DD' };
const amount = ref('');
const category_type = ref('1'); // 초기 '수입' 선택
const categories = ref([]);
const selectedItem = ref('');
const isDropdownOpen = ref(false);
const record_memo = ref('');
const record_details = ref('');
const member_Id = '1';

const router = useRouter();

const formattedDate = computed(() => {
    return reg_date.value ? reg_date.value.toISOString().split('T')[0] : '';
});

const toggleDropdown = (e) => {
    e.stopPropagation();
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
    selectedItem.value = item.category_id;
    isDropdownOpen.value = false;
};

const getButtonText = computed(() => {
    if (!selectedItem.value) return '카테고리를 선택하세요';
    const category = categories.value.find(category => category.category_id === selectedItem.value);
    return category ? category.category_name : '카테고리를 선택하세요';
});

const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.category-input');
    if (dropdown && !dropdown.contains(event.target)) {
        isDropdownOpen.value = false;
    }
};

const handleCategoryChange = () => {
    selectedItem.value = ''; // 분류 변경 시 선택 초기화
    fetchCategories(); // 새로운 분류에 따라 카테고리 가져오기
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    fetchCategories(); // 페이지 로드 시 카테고리 목록 가져오기
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const formattedAmount = computed({
    get() {
        if (!amount.value) return '';
        return new Intl.NumberFormat('ko-KR').format(amount.value);
    },
    set(value) {
        const numberValue = value.replace(/,/g, '');
        if (!isNaN(numberValue)) {
            amount.value = parseInt(numberValue, 10);
        }
    }
});

const onFocus = (event) => {
    event.target.value = amount.value ? amount.value.toString() : '';
};

const onBlur = (event) => {
    event.target.value = formattedAmount.value;
};

const fetchCategories = async () => {
    try {
        const response = await axios.get(`/api/category/list`);
        categories.value = response.data.categories;
    } catch (error) {
        console.error("Failed to fetch categories", error);
    }
};

const filteredCategories = computed(() => {
    return categories.value.filter(category => category.category_type === category_type.value);
});

const handleSubmit = async () => {
    // 유효성 검사
    if (!reg_date.value) {
        alert("거래일자를 선택하세요.");
        return;
    }
    if (!category_type.value) {
        alert("분류를 선택하세요.");
        return;
    }
    if (!selectedItem.value) {
        alert("카테고리를 선택하세요.");
        return;
    }
    if (!amount.value) {
        alert("금액을 입력하세요.");
        return;
    }
    if (!record_memo.value) {
        alert("내역을 입력하세요.");
        return;
    }
    if (!record_details.value) {
        alert("메모를 입력하세요.");
        return;
    }

    // 선택된 카테고리 객체 찾기
    const selectedCategory = categories.value.find(category => category.category_id === selectedItem.value);
    if (!selectedCategory) {
        alert("선택된 카테고리가 유효하지 않습니다.");
        return;
    }

    // 데이터 전송
    const params = new URLSearchParams({
        member_Id,
        reg_date: formattedDate.value,
        amount: amount.value,
        category_type: category_type.value,
        category_Id: selectedCategory.category_id,
        record_memo: record_memo.value,
        record_details: record_details.value,
    });

    console.log("Sending request with params:", params.toString());

    try {
        await axios.get(`/api/record/insert?${params.toString()}`);
        alert("기록이 성공적으로 저장되었습니다.");
        router.push('/expense-list'); // 입력 성공 후 페이지 이동
    } catch (error) {
        console.error("Failed to save record", error);
        alert("기록 저장에 실패하였습니다.");
    }
};
</script>
