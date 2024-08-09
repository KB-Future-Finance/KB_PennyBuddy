<template>
  <div class="container">
    <div class="titleRow">
      <button type="button" @click="clickedBack">
        <span class="material-symbols-rounded titleicon">arrow_back</span>
      </button>
      <h1 class="title">상세 화면</h1>
      <button type="button" @click="clickedCamera" v-if="isEditing">
        <span class="material-symbols-rounded titleicon camera">photo_camera</span>
      </button>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="date">
        <h2><span class="material-symbols-rounded icon">event_available</span><span class="subTitle"> 거래일자</span></h2>
        <input class="date-input" :value="formattedDate" readonly>
        <VDatePicker v-model="regDate" :masks="masks" :disabled="isReadOnly">
          <template #default="{ togglePopover }">
            <button type="button" class="button" @click="togglePopover" style="margin-left:10px;" :disabled="isReadOnly">선택</button>
          </template>
        </VDatePicker>
      </div>
      <div class="class">
        <h2><span class="material-symbols-rounded icon">view_cozy</span><span class="subTitle"> 분류</span></h2>
        <div class="class-input">
          <label for="income" class="radio">
            <input type="radio" name="categoryType" id="income" value="1" v-model="categoryType" @change="handleCategoryChange" :disabled="isReadOnly"/>
            <span class="label"> 수입</span>
          </label>
          <label for="outcome" class="radio">
            <input type="radio" name="categoryType" id="outcome" value="2" v-model="categoryType" @change="handleCategoryChange" :disabled="isReadOnly"/>
            <span class="label"> 지출</span>
          </label>
        </div>
      </div>
      <div class="category">
        <h2><span class="material-symbols-rounded icon">list</span><span class="subTitle"> 카테고리</span></h2>
        <div class="category-input">
          <div class="select-btn" :class="{ open: isDropdownOpen }" @click="toggleDropdown" :disabled="isReadOnly">
            <span class="btn-text">{{ getButtonText }}</span>
            <span class="arrow-dwn">
              <i class="material-symbols-rounded icon">keyboard_arrow_down</i>
            </span>
          </div>
          <ul class="list-items" v-show="isDropdownOpen">
            <li class="item" v-for="category in filteredCategories" :key="category.categoryIdx" @click.stop="selectItem(category)" :class="{ checked: selectedItem === category.categoryIdx }">
              <input type="radio" :value="category.categoryIdx" v-model="selectedItem" class="radio" :disabled="isReadOnly"/>
              <span class="item-text">{{ category.categoryName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="amount">
        <h2><span class="material-symbols-rounded icon">paid</span><span class="subTitle"> 금액</span></h2>
        <input type="text" 
               :value="formattedAmount" 
               @input="onInput" 
               @focus="onFocus" 
               @blur="onBlur" 
               placeholder="금액을 입력하세요" 
               class="amount-input" 
               :readonly="isReadOnly">
      </div>
      <div class="memo">
        <h2><span class="material-symbols-rounded icon">sell</span><span class="subTitle"> 내역</span></h2>
        <input type="text" v-model="recordMemo" class="memo-input" placeholder="내역을 입력하세요" :readonly="isReadOnly">
      </div>
      <div class="detail">
        <h2><span class="material-symbols-rounded icon">data_info_alert</span><span class="subTitle"> 메모</span></h2>
        <textarea v-model="recordDetails" class="detail-input" placeholder="메모를 입력하세요" :readonly="isReadOnly"></textarea>
      </div>
      <div class="enter">
        <button type="button" class="button" @click="toggleEdit">{{ isEditing ? '확인' : '수정' }}</button>
      </div>
    </form>
    <Backdrop v-if="showBackdrop" @close="closeBackdrop">
      <FileUpload @close="closeBackdrop" />
    </Backdrop>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import Backdrop from '@/components/Input/Backdrop.vue';
import FileUpload from '@/components/Input/FileUpload.vue';

const props = defineProps(['record']);
const regDate = ref(new Date(props.record.regDate));
const amount = ref(props.record.amount);
const categoryType = ref(props.record.categoryType);
const selectedItem = ref(props.record.categoryIdx);
const recordMemo = ref(props.record.recordMemo);
const recordDetails = ref(props.record.recordDetails);

const isReadOnly = ref(true);
const isEditing = ref(false);
const isDropdownOpen = ref(false);
const masks = { input: 'YYYY-MM-DD' };
const categories = ref([]);
const filteredCategories = ref([]);
const showBackdrop = ref(false);

const formattedDate = computed(() => {
  return regDate.value ? regDate.value.toISOString().split('T')[0] : '';
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

const onInput = (event) => {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(value)) {
        amount.value = value;
    }
};

const onFocus = (event) => {
    event.target.value = amount.value ? amount.value.toString() : '';
};

const onBlur = (event) => {
    event.target.value = formattedAmount.value;
};

watch(() => props.record, (newRecord) => {
  regDate.value = new Date(newRecord.regDate);
  amount.value = newRecord.amount;
  categoryType.value = newRecord.categoryType;
  selectedItem.value = newRecord.categoryIdx;
  recordMemo.value = newRecord.recordMemo;
  recordDetails.value = newRecord.recordDetails;
}, { immediate: true });

const fetchCategories = async () => {
  try {
    const response = await axios.get(`/api/category/list`);
    categories.value = response.data.categories || [];
    filterCategories();
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};

const filterCategories = () => {
  const type = categoryType.value || '1';
  if (type === '1') {
    filteredCategories.value = categories.value.filter(category => category.categoryType === '1');
  } else if (type === '2') {
    filteredCategories.value = categories.value.filter(category => category.categoryType === '2');
  } else {
    filteredCategories.value = categories.value;
  }
};

const toggleDropdown = (e) => {
  if (!isReadOnly.value) {
    e.stopPropagation();
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const selectItem = (item) => {
  selectedItem.value = item.categoryIdx;
  isDropdownOpen.value = false;
};

const getButtonText = computed(() => {
  if (!selectedItem.value) return '카테고리를 선택하세요';
  const category = categories.value.find(category => category.categoryIdx === selectedItem.value);
  return category ? category.categoryName : '카테고리를 선택하세요';
});

const handleCategoryChange = () => {
  selectedItem.value = '';
  filterCategories();
};

const toggleEdit = () => {
  if (isEditing.value) {
    handleSubmit();
    console.log("Emitting update event"); // 디버깅 로그 추가
    emit('update');
  } else {
    isReadOnly.value = false;
    isEditing.value = true;
  }
};

const handleSubmit = async () => {
  if (isReadOnly.value) return;

  if (!regDate.value) {
    alert("거래일자를 선택하세요.");
    return;
  }
  if (!categoryType.value) {
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
  if (!recordMemo.value) {
    alert("내역을 입력하세요.");
    return;
  }
  if (!recordDetails.value) {
    alert("메모를 입력하세요.");
    return;
  }

  const confirmUpdate = confirm("기존의 정보를 수정하시겠습니까?");
  if (!confirmUpdate) return;

  const selectedCategory = categories.value.find(category => category.categoryIdx === selectedItem.value);
  if (!selectedCategory) {
    alert("선택된 카테고리가 유효하지 않습니다.");
    return;
  }

  const params = new URLSearchParams({
    memberId: props.record.memberId,
    regDate: formattedDate.value,
    amount: amount.value,
    categoryType: categoryType.value,
    categoryIdx: selectedCategory.categoryIdx,
    recordMemo: recordMemo.value,
    recordDetails: recordDetails.value,
    recordIdx: props.record.recordIdx
  });

  try {
    await axios.get(`/api/record/update?${params.toString()}`);
    alert("기록이 성공적으로 수정되었습니다.");
    isReadOnly.value = true;
    isEditing.value = false;
    console.log("Emitting update event"); // 디버깅 로그 추가
    emit('update'); 
  } catch (error) {
    console.error("Failed to save record", error);
    alert("기록 저장에 실패하였습니다.");
  }
};

const emit = defineEmits(['clickedBack', 'update']);
const clickedBack = () => {
    console.log("clicked Back Button");
    emit('clickedBack');
};
const clickedCamera = () => {
    showBackdrop.value = true;
};

const closeBackdrop = () => {
    showBackdrop.value = false;
};

watch(categoryType, handleCategoryChange);
onMounted(fetchCategories);

</script>

<style scoped>
.titleRow{
    width: 100%;
    display:flex;
    justify-content: space-between;
}

.titleRow>button{
    width:10%;
    border: none;
    background-color: white;
}
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
