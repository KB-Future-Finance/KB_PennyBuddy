<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="container">

  
  <div class="container2">
    <div class="date">
      <h2><span class="material-symbols-rounded icon">event_available</span><span class="subTitle"> 거래일자 | </span></h2>
      <date-picker v-model="dateRange" is-range>
        <template #default="{ inputValue = { start: '', end: '' }, inputEvents = {} }">
          <div class="date_input_area">
              <span class="date_text">시작일</span>
              <input :value="inputValue.start || ''" v-on="inputEvents.start || {}" class="date-input" readonly />
              <span class="date_text">종료일</span>
              <input :value="inputValue.end || ''" v-on="inputEvents.end || {}" class="date-input" readonly />
          </div>
        </template>
      </date-picker>
    </div>

    <div class="class">
      <h2><span class="material-symbols-rounded icon">view_cozy</span><span class="subTitle"> 분류 | </span></h2>
      <div class="class-input">
        <div class="radio">
          <input type="radio" id="all" value="" v-model="categoryType" @change="filterCategories"/>
          <label for="all" class="label"> 전체</label>
        </div>
        <div class="radio">
          <input type="radio" id="income" value="1" v-model="categoryType" @change="filterCategories" />
          <label for="income" class="label"> 수입</label>
        </div>
        <div class="radio">
          <input type="radio" id="expense" value="2" v-model="categoryType" @change="filterCategories"/>
          <label for="expense" class="label"> 지출</label>
        </div>
      </div>
    </div>

    <div class="category" v-if="filteredCategories.length">
      <h2><span class="material-symbols-rounded icon">list</span><span class="subTitle"> 카테고리 | </span></h2>
      <div class="category-input">
        <div class="select-btn" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
          <span class="btn-text">{{ getButtonText }}</span>
          <span class="arrow-dwn">
            <i class="material-symbols-rounded icon">keyboard_arrow_down</i>
          </span>
        </div>

        <ul class="list-items" v-if="isDropdownOpen">
          <li class="item" v-for="category in filteredCategories" :key="category.categoryIdx">
            <input type="checkbox" :value="category.categoryIdx" v-model="selectedItems" class="checkbox"/>
            <span class="item-text">{{ category.categoryName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="filterButton">
    <button @click="applyFilter" class="button">조회</button>
  </div>
</div>
</template>



<style scoped>
.container{
  display:flex;
  align-items:end;
  justify-content: space-between;

  padding:10px 30px;
  margin-bottom: 15px;
  
  /* border:2px solid blue; */
  background-color:#fff6e4;
  border-radius: 10px;
}

.container2{
  width:90%;
  height:100%;

  background-color: none;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: start;
}

.container2>div{
  display: flex;
  text-align: start;
  height:fit-content;
  /* border:1px solid blue; */
}

.subTitle{
  /* border: 1px solid red; */
  vertical-align: middle;

  font-size:16px;
  font-weight: 700;
}

/* 날짜 css */
.date{
  display: flex;

  width:100%;
}

.date_input_area{
  /* border: 1px solid red; */
  height:fit-content;
  margin:auto 0px;
  
}

.date-input{
  width:30%;
  height: 25px;
  padding: 5px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius:4px;
  box-sizing:border-box;
  margin-top: 5px;
  outline: none;
}

.date_text{
  font-size: 14px;
  font-weight: 600;
  margin: 0px 5px;
}

.filterButton{
  width: 10%;
  height: 100%;
}

.button{
  height:30px;
  width: 100%;
  border-radius: 15px;

  text-align: center;
  border:none;
  background-color: #FFC85E;

  font-family: "Pretendard Variable";
  font-size: 14px;
  font-weight: 500;
}

.button:hover{
  background-color: rgb(255, 146, 44);
}

/* 수입/지출 css */
.class-input{
  width: fit-content;
  display: flex;
  gap: 20px;

}
.class-input>div{

  height: fit-content;
  margin:auto 5px;

  font-size: 14px;
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
}

[type="radio"]:checked {
    border: 0.4em solid #FFC85E;
}

[type="radio"]:hover {
    box-shadow: 0 0 0 max(4px, 0.2em) lightgray;
    cursor: pointer;
}

/* 카테고리 css */
.select-btn{
  display:flex;
  height: 30px;
  width: 120%;
  align-items: center;
  justify-content: space-between;

  margin:3px 10px;
  padding : 0 16px;

  border-radius: 5px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #ccc;
}

.select-btn .btn-text {
  font-size: 14px;;
}

.select-btn .arrow-dwn{
  display: flex;
  height: 21px;
  width: 21px;
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  background:#FFC85E;
  align-items: center;
  justify-content: center;
  transition: 0.3s
}

.select-btn.open .arrow-dwn {
  transform: rotate(-180deg);
}

.select-btn.open ~ .list-items{
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
  animation-duration: 0.4s;
  animation-fill-mode: both;
  -webkit-animation-duration:0.4s;
  -webkit-animation-fill-mode: both;
}

.category{
  position:relative;
}

.list-items{
  position: absolute;

  max-width: 200px;
  width: 100%;
  max-height: 150px;
  overflow-y:auto;

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

.list-items::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.list-items::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.list-items::-webkit-scrollbar-thumb {
    background: #FFC85E;
    border-radius: 10px;
}

.list-items::-webkit-scrollbar-thumb:hover {
    background: #ffcb7c;
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

.list-items .item:hover{
  background-color:antiquewhite;
}

.item .item-text{
  font-size:16px;
  width: 100%;
}

.item .checkbox{
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

.item.checked .checkbox{
  background-color: #FFC85E;
  border-color:#FFC85E;
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
  from{
      transform: translate3d(0, 30px, 0);
  }
  to{
      transform: translate3d(0, 0, 0);
      opacity: 1;
  }
}

@keyframes fadeInDown{
  from{
      transform: translate3d(0, 0, 0);
  }
  to{
      transform: translate3d(0, 20px, 0);
      opacity: 0;
  }
}

.category-input{
  margin-top:5px;
}

</style>

<script setup>
import axios from 'axios';
import {DatePicker} from 'v-calendar'
import { ref, computed, onMounted, onUnmounted } from 'vue';

//날짜 관련 함수 및 변수
const dateRange = ref({
  start: '',
  end:''
})

//수입/지출 관련 함수 및 변수
const categoryType = ref('');
const filteredCategories = ref([]);
const allCategories = ref([]);
const isDropdownOpen = ref(false);
const selectedItems = ref([]);

const fetchCategories = async () => {
  const params = new URLSearchParams();
  if (dateRange.value.start) params.append('startDate', dateRange.value.start);
  if (dateRange.value.end) params.append('endDate', dateRange.value.end);
  params.append('memberId', 1);

  try {
    const response = await axios.get(`/api/record/category?${params.toString()}`);
    allCategories.value = response.data.haveCategories;
    filterCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const filterCategories = () => {
  if (categoryType.value === '1') { // 수입
    filteredCategories.value = allCategories.value.filter(category => category.categoryType === '1');
  } else if (categoryType.value === '2') { // 지출
    filteredCategories.value = allCategories.value.filter(category => category.categoryType === '2');
  } else { // 전체
    filteredCategories.value = [];
  }
  selectedItems.value = []; // 필터링할 때마다 선택된 카테고리 초기화
};

const toggleDropdown = (e) => {
  e.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleItemSelection = (item) => {
  const index = selectedItems.value.indexOf(item);
  if (index === -1) {
      selectedItems.value.push(item);
  } else {
      selectedItems.value.splice(index, 1);
  }
};

const getButtonText = computed(() => {
  return selectedItems.value.length > 0 ? `${selectedItems.value.length}개 선택되었습니다` : '카테고리를 선택하세요';
});

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.category-input');
  if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen.value = false;
  }
};

//필터링
const emit = defineEmits(['filter-applied']);

const applyFilter = () => {
  const filterData = {
    startDate: dateRange.value.start,
    endDate: dateRange.value.end,
    categoryType: categoryType.value,
    categories: selectedItems.value.slice()
  };

  console.log("Apply filter button clicked with data:", filterData);
  emit('filter-applied', filterData)
}

onMounted(() => {
  fetchCategories();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>