<template>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="flex-container">
  <div class="container" >
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
      <RouterLink to="/inputFormComponent" class="text">추가하기</RouterLink>
    </div>
    <div class="toList">
      <RouterLink to="/expense-list" class="text">상세 리스트 보기</RouterLink>
    </div>
  </div>
  
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExpenseList',
  data() {
    return {
      records: [],
      currentPage: 1,
      totalPages: 1,
      maxVisiblePages: 3, // 최대 표시할 페이지 수
      currentPageGroup: 1,
      filterData: {} // 필터링 데이터를 상태로 유지
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      let start = (this.currentPageGroup - 1) * this.maxVisiblePages + 1;
      let end = Math.min(start + this.maxVisiblePages - 1, this.totalPages);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    fetchRecords(filterData = {}) {
      const {
        startDate = new Date(new Date(). getFullYear(), new Date().getMonth(), 1),
        endDate = new Date(new Date(). getFullYear(), new Date().getMonth()+1, 0),
        page = this.currentPage
      } = filterData;

      const params = new URLSearchParams();
      params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
      params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
      params.append('page', page);
      params.append('size', 12); // 화면당 보여주는 개수 
      params.append('memberId', 1);

      axios.get(`/api/record/list?${params.toString()}`)
        .then(response => {
          this.records = response.data.records;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
          this.updatePageGroup();
        })
        .catch(error => {
          console.error(error);
        });
    },
    updatePageGroup() {
      this.currentPageGroup = Math.ceil(this.currentPage / this.maxVisiblePages);
    },
    prevPage() {
      if (this.currentPage > 1) {
        if ((this.currentPage - 1) % this.maxVisiblePages === 0) {
          this.prevPageGroup();
        } else {
          this.currentPage--;
          this.fetchRecords({ ...this.filterData, page: this.currentPage });
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        if (this.currentPage % this.maxVisiblePages === 0) {
          this.nextPageGroup();
        } else {
          this.currentPage++;
          this.fetchRecords({ ...this.filterData, page: this.currentPage });
        }
      }
    },
    prevPageGroup() {
      if (this.currentPageGroup > 1) {
        this.currentPageGroup--;
        this.fetchRecords({ ...this.filterData, page: (this.currentPageGroup - 1) * this.maxVisiblePages + 1 });
      }
    },
    nextPageGroup() {
      if (this.currentPageGroup * this.maxVisiblePages < this.totalPages) {
        this.currentPageGroup++;
        this.fetchRecords({ ...this.filterData, page: (this.currentPageGroup - 1) * this.maxVisiblePages + 1 });
      }
    },
    formatDate(date) {
      let d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    formatAmount(amount, type) {
      let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return type === '1' ? `+${formattedAmount}원` : `-${formattedAmount}원`;
    },
    amountClass(type) {
      return type === '1' ? 'income' : 'expense';
    }
  }
};
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



