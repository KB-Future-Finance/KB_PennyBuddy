<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="container">
    <!-- 필터 -->
    <div>
      <FilterComponent @filter-applied="applyFilter"></FilterComponent>
    </div>

    <!-- 기록 목록 테이블 -->
    <div class="list">
      <table class="expense-table">
        <thead>
          <tr>
            <th class="date">날짜</th>
            <th class="category">카테고리</th>
            <th class="amount">금액</th>
            <th class="memo">내역</th>
            <th class="etc"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.recordIdx">
            <td class="date">{{ formatDate(record.regDate) }}</td>
            <td class="category">{{ record.categoryName }}</td>
            <td class="amount" :class="amountClass(record.categoryType)">{{ formatAmount(record.amount, record.categoryType) }}</td>
            <td class="memo">{{ record.recordMemo }}</td>
            <td class="etc">
              <button class="edit-button" @click="showDetail(record)">
                <span class="material-symbols-rounded icon">info</span>
              </button>
              <button class="delete-button" @click="confirmDelete(record.recordIdx)">
                <span class="material-symbols-rounded icon">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 수입 지출 체크 -->
    <div class="total-amount">
      <div>
        <button class="addButton" @click="emitClickedAdd">거래 추가하기</button>
      </div>
      <div>
        <span class="income">총 수입: {{ formatAmount(totalIncome, '1') }}</span>
        <span class="expense">총 지출: {{ formatAmount(totalExpense, '2') }}</span>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span v-for="page in visiblePages" :key="page">
        <button @click="fetchRecords({ ...filterData, page })" :class="{ active: page === currentPage }">{{ page }}</button>
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'v-calendar/dist/style.css';
import { setupCalendar, DatePicker } from 'v-calendar';
import FilterComponent from '@/components/ExpenseList/FilterComponent.vue';

export default {
  name: 'ExpenseList',
  components: {
    DatePicker,
    FilterComponent
  },
  emits: ['clickedAdd', 'showDetail', 'reload'], // Add this line to declare the emitted events
  data() {
    return {
      records: [],
      currentPage: 1,
      totalPages: 1,
      maxVisiblePages: 5,
      currentPageGroup: 1,
      dateRange: {
        start: '',
        end: ''
      },
      type: '',
      categories: [],
      allCategories: [],
      filteredCategories: [],
      totalIncome: 0,
      totalExpense: 0,
      filterData: {}
    };
  },
  watch: {
    type() {
      this.filterCategories();
    }
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
    this.fetchTotalAmount();
    this.fetchCategories();
  },
  methods: {
    applyFilter(filterData) {
      this.filterData = filterData;
      this.currentPage = 1;
      this.fetchRecords(filterData);
    },
    fetchRecords(filterData = {}) {
      const {
        startDate = this.dateRange.start,
        endDate = this.dateRange.end,
        categoryType = this.categoryType || null,
        categories = (this.categories && this.categories.length > 0) ? this.categories : null,
        page = this.currentPage
      } = filterData;

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
      if (endDate) params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
      if (categoryType) params.append('categoryType', categoryType);
      if (categories) {
        categories.forEach(category => params.append('categories', category));
      } else {
        params.append('categories', '');
      }
      params.append('page', page);
      params.append('size', 9);
      params.append('memberId', 1);

      axios.get(`/api/record/list?${params.toString()}`)
        .then(response => {
          this.records = response.data.records;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
          this.filterCategories();
          this.updatePageGroup();
          this.fetchTotalAmount(filterData);
        })
        .catch(error => {
          console.error(error);
        });
    },
    async fetchTotalAmount(filterData = {}) {
      const {
        startDate = this.dateRange.start,
        endDate = this.dateRange.end,
        categoryType = this.categoryType || null,
        categories = (this.categories && this.categories.length > 0) ? this.categories : null
      } = filterData;

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
      if (endDate) params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
      if (categoryType) params.append('categoryType', categoryType);
      if (categories) {
        categories.forEach(category => params.append('categories', category));
      } else {
        params.append('categories', '');
      }
      params.append('memberId', 1);

      try {
        const response = await axios.get(`/api/record/totalAmount?${params.toString()}`);
        this.totalIncome = response.data.totalIncome;
        this.totalExpense = response.data.totalExpense;
      } catch (error) {
        console.error(error);
      }
    },
    fetchCategories() {
      const params = new URLSearchParams();
      if (this.dateRange.start) params.append('startDate', new Date(this.dateRange.start).toISOString().split('T')[0]);
      if (this.dateRange.end) params.append('endDate', new Date(this.dateRange.end).toISOString().split('T')[0]);
      params.append('memberId', 1);

      axios.get(`/api/record/category?${params.toString()}`)
        .then(response => {
          this.allCategories = response.data.haveCategories;
          this.filterCategories();
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    },
    filterCategories() {
      if (this.type === '1') {
        this.filteredCategories = this.allCategories.filter(category => category.categoryType === '1');
      } else if (this.type === '2') {
        this.filteredCategories = this.allCategories.filter(category => category.categoryType === '2');
      } else {
        this.filteredCategories = [];
      }
      this.categories = [];
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
    },
    confirmDelete(recordIdx) {
      if (confirm("삭제하시겠습니까?")) {
        this.deleteRecord({ recordIdx: recordIdx, memberId: 1 });
      }
    },
    deleteRecord(deleteData = {}) {
      const {
        recordIdx,
        memberId
      } = deleteData;

      const params = new URLSearchParams();
      if (recordIdx) params.append('recordIdx', recordIdx);
      if (memberId) params.append('memberId', memberId);

      axios.get(`/api/record/delete`, {
        params: {
          recordIdx: recordIdx,
          memberId: memberId
        }
      })
      .then(response => {
        console.log('delete success');
        if (this.records.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.fetchRecords(this.filterData);
        this.$emit('reload'); // reload 이벤트 발생
      })
      .catch(error => {
        console.error("Error fetching delete:", error);
      });
    },
    showDetail(record) {
      this.$emit('showDetail', record);
    },
    emitClickedAdd() {
      this.$emit('clickedAdd');
    }
  }
};
</script>





<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.list {
  min-height: 65%;
  overflow: hidden;
}

.expense-table {
  min-width: 100px;
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.expense-table th, .expense-table td {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.expense-table th {
  padding: 8px;
  background-color: #f2f2f2;
  font-weight: 600;
}

.expense-table td {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.date {
  max-width: 15%;
}

.category {
  max-width: 15%;
}

.amount {
  max-width: 20%;
}

.memo {
  max-width: 150px;
  width: 40%;
}

.etc {
  max-width: 40px;
  width: 10%;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  padding: 3px;
  font-size: 16px;
}

.income {
  color: blue;
  margin-right: 20px;
}

.expense {
  color: red;
}

.edit-button, .delete-button {
  background-color: white;
  border: none;
  margin: 0px 5px;
  padding: 5px;
  color: #ffcb7c;
  border-radius: 100px;
}

.edit-button:hover, .delete-button:hover {
  background-color: #ffcb7c;
  border: none;
  margin: 0px 5px;
  padding: 5px;
  color: white;
  border-radius: 100px;
}

.etc {
  text-align: left;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.pagination button.active {
  background-color: #ffcb7c;
  color: white;
}

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

.addButton {
  background-color: #ffe1b5;
  font-weight: 500;
  font-family: "Pretendard Variable";
  font-size: 14px;
  padding: 10px;
}
</style>
