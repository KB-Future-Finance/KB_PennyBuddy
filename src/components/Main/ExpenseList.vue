<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="flex-container">
    <div class="container">
      <h1 class="title"> 이번 달 소비 기록 </h1>

      <!-- 기록 목록 테이블 -->
      <table class="expense-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>금액</th>
            <th>내역</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.recordIdx">
            <td>{{ formatDate(record.regDate) }}</td>
            <td :class="amountClass(record.categoryType)">{{ formatAmount(record.amount, record.categoryType) }}</td>
            <td>{{ record.recordMemo }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span v-for="page in visiblePages" :key="page">
          <button @click="fetchRecords({ ...filterData, page })" :class="{ active: page === currentPage }">{{ page }}</button>
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
  
    <div class="buttonFlex">
      <div class="toList">
        <RouterLink @click.native="handleShowForm" to="/expense-list" class="text">추가하기</RouterLink>
      </div>
      <div class="toList">
        <RouterLink @click.native="handleHideForm" to="/expense-list" class="text">상세 리스트 보기</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useInputStore } from '@/stores/inputStore';

const store = useInputStore();

const records = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const maxVisiblePages = 3;
const currentPageGroup = ref(1);
const filterData = ref({});

const visiblePages = computed(() => {
  const pages = [];
  let start = (currentPageGroup.value - 1) * maxVisiblePages + 1;
  let end = Math.min(start + maxVisiblePages - 1, totalPages.value);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const fetchRecords = (filterData = {}) => {
  const {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    page = currentPage.value
  } = filterData;

  const params = new URLSearchParams();
  params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
  params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
  params.append('page', page);
  params.append('size', 12);
  params.append('memberId', 1);

  axios.get(`/api/record/list?${params.toString()}`)
    .then(response => {
      records.value = response.data.records;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
      updatePageGroup();
    })
    .catch(error => {
      console.error(error);
    });
};

const updatePageGroup = () => {
  currentPageGroup.value = Math.ceil(currentPage.value / maxVisiblePages);
};

const prevPage = () => {
  if (currentPage.value > 1) {
    if ((currentPage.value - 1) % maxVisiblePages === 0) {
      prevPageGroup();
    } else {
      currentPage.value--;
      fetchRecords({ ...filterData.value, page: currentPage.value });
    }
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    if (currentPage.value % maxVisiblePages === 0) {
      nextPageGroup();
    } else {
      currentPage.value++;
      fetchRecords({ ...filterData.value, page: currentPage.value });
    }
  }
};

const prevPageGroup = () => {
  if (currentPageGroup.value > 1) {
    currentPageGroup.value--;
    fetchRecords({ ...filterData.value, page: (currentPageGroup.value - 1) * maxVisiblePages + 1 });
  }
};

const nextPageGroup = () => {
  if (currentPageGroup.value * maxVisiblePages < totalPages.value) {
    currentPageGroup.value++;
    fetchRecords({ ...filterData.value, page: (currentPageGroup.value - 1) * maxVisiblePages + 1 });
  }
};

const formatDate = (date) => {
  let d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const formatAmount = (amount, type) => {
  let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return type === '1' ? `+${formattedAmount}원` : `-${formattedAmount}원`;
};

const amountClass = (type) => {
  return type === '1' ? 'income' : 'expense';
};

const handleShowForm = () => {
  store.showForm();
};

const handleHideForm =() => {
  store.hideForm();
}

onMounted(() => {
  fetchRecords();
});
</script>

<style scoped>
.flex-container{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
  /* border:1px solid red; */
}
.container{
    width:100%;
    height:100%;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    padding: 0px;

    font-size:14px;

    /* 테스트 코드 */
    /* border: 1px solid red; */
}

.title{
    font-size:20px;
    font-weight: 800;

    background: linear-gradient(transparent 30%, #ffcb7c 30%);
    display: inline-block;

    margin-bottom:20px;
    /* border: 1px solid blue; */
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th, .expense-table td {
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 5px;
  text-align: center;
}

.expense-table th {
  font-weight: 600;
  background-color: #ffeea4;
}

.expense-table td{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.income {
  color: blue;
  margin-right: 20px;
}

.expense {
  color: red;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.pagination button.active {
  background-color: #ffb85b;
  color: white;
}

/* 추가된 스타일 */
button {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #e0e0e0;
}

.buttonFlex{
  display: flex;
  gap : 10px;
}

.toList{
  width: fit-content;
  text-decoration: none;
  
  padding:5px 10px;
  border-radius: 10px;

  border:2px solid #ffaa3a;
}

.toList .text{
  text-decoration: none;
  color:#ffaa3a;
  font-weight: 600;
}

.toList:hover{
  background-color: #fff7d5;
}
</style>



