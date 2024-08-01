<template>
  <div class="container">
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <form @submit.prevent="submitForm">
        <table class="filter-table">
          <tr>
            <td>
              <label for="dateRange">조회기간</label>
              <v-date-picker v-model="dateRange" is-range>
                <template #default="{ inputValue, inputEvents }">
                  <div class="flex justify-center items-center">
                    <input :value="inputValue.start" v-on="inputEvents.start" class="base-input" readonly />
                    <span class="icon-arrow-right"></span>
                    <input :value="inputValue.end" v-on="inputEvents.end" class="base-input" readonly />
                  </div>
                </template>
              </v-date-picker>
            </td>
          </tr>
          <tr>
            <td>분류</td>
            <td>
              <input type="radio" id="all" value="" v-model="type" @change="filterCategories" />
              <label for="all">전체</label>
              <input type="radio" id="income" value="1" v-model="type" @change="filterCategories" />
              <label for="income">수입</label>
              <input type="radio" id="expense" value="2" v-model="type" @change="filterCategories" />
              <label for="expense">지출</label>
            </td>
          </tr>
          <tr v-if="type">
            <td>카테고리</td>
            <td>
              <div class="checkbox-container">
                <div v-for="category in filteredCategories" :key="category.category_id" class="checkbox-item">
                  <input type="checkbox" :value="category.category_id" v-model="categories" />
                  <label>{{ category.category_name }}</label>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <button type="submit">조회</button>
      </form>
    </div>

    <!-- 기록 목록 테이블 -->
    <table class="expense-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>카테고리</th>
          <th>금액</th>
          <th>제목</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.record_id">
          <td>{{ formatDate(record.reg_date) }}</td>
          <td>{{ record.category_name }}</td>
          <td :class="amountClass(record.category_type)">{{ formatAmount(record.amount, record.category_type) }}</td>
          <td>{{ record.record_memo }}</td>
          <td>
            <button class="edit-button">수정</button>
            <button class="delete-button">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 수입 지출 체크 -->
    <div class="total-amount">
      <span class="income">총 수입: {{ formatAmount(totalIncome, '1') }}</span>
      <span class="expense">총 지출: {{ formatAmount(totalExpense, '2') }}</span>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPageGroup" :disabled="currentPage === 1">이전</button>
      <span v-for="page in visiblePages" :key="page">
        <button @click="fetchRecords(page)" :class="{ active: page === currentPage }">{{ page }}</button>
      </span>
      <button @click="nextPageGroup" :disabled="currentPageGroup * maxVisiblePages >= totalPages">다음</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'v-calendar/dist/style.css';
import { setupCalendar, DatePicker } from 'v-calendar';
import '@/assets/Expense/ExpenseList.css'; // CSS 파일을 가져옵니다.

export default {
  name: 'ExpenseList',
  components: {
    VDatePicker: DatePicker,
  },
  data() {
    return {
      records: [],
      currentPage: 1,
      totalPages: 1,
      maxVisiblePages: 3, // 최대 표시할 페이지 수
      currentPageGroup: 1,
      dateRange: {
        start: '',
        end: ''
      },
      type: '',
      categories: [],
      allCategories: [],  // 전체 카테고리 배열
      filteredCategories: [],  // 필터링된 카테고리 배열
      totalIncome: 0,  // 총 수입
      totalExpense: 0,  // 총 지출
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
    this.fetchCategories();  // 카테고리 데이터를 가져옴
  },
  methods: {
    submitForm() {
      this.currentPage = 1; // 새로운 필터를 적용할 때 페이지를 1로 설정
      this.fetchRecords();
    },
    fetchRecords(page = this.currentPage) {
      if (typeof page === 'object') page = 1; // page가 이벤트 객체인 경우 1로 설정
      const params = {
        startDate: this.dateRange.start ? this.formatDateToISO(this.dateRange.start) : null,
        endDate: this.dateRange.end ? this.formatDateToISO(this.dateRange.end) : null,
        type: this.type,
        categories: this.categories.length ? this.categories : null,
        page: page,
        size: 10,  // 페이지 크기 설정
        member_Id: '1'  // 실제 member_Id를 여기에 넣으세요
      };

      axios.get('/api/record/list', { params })
        .then(response => {
          this.records = response.data.records;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
          this.filterCategories();  // 필터링 적용
          this.updatePageGroup();
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchTotalAmount() {
      const params = {
        startDate: this.dateRange.start ? this.formatDateToISO(this.dateRange.start) : null,
        endDate: this.dateRange.end ? this.formatDateToISO(this.dateRange.end) : null,
        type: this.type,
        categories: this.categories.length ? this.categories : null,
        member_Id: '1'  // 실제 member_Id를 여기에 넣으세요
      };

      axios.get('/api/record/totalAmount', { params })
        .then(response => {
          this.totalIncome = response.data.totalIncome;
          this.totalExpense = response.data.totalExpense;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchCategories() {
      const params = {
        startDate: this.dateRange.start ? this.formatDateToISO(this.dateRange.start) : null,
        endDate: this.dateRange.end ? this.formatDateToISO(this.dateRange.end) : null,
        member_Id: '1'  // 실제 member_Id를 여기에 넣으세요
      };

      axios.get('/api/record/category', { params })
        .then(response => {
          this.allCategories = response.data.haveCategories;
          this.filterCategories();
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    },
    filterCategories() {
      if (this.type === '1') { // 수입
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '1');
      } else if (this.type === '2') { // 지출
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '2');
      } else { // 전체
        this.filteredCategories = [];
      }
      this.categories = []; // 필터링할 때마다 선택된 카테고리 초기화
    },
    prevPageGroup() {
      if (this.currentPageGroup > 1) {
        this.currentPageGroup--;
        this.fetchRecords((this.currentPageGroup - 1) * this.maxVisiblePages + 1);
      }
    },
    nextPageGroup() {
      if (this.currentPageGroup * this.maxVisiblePages < this.totalPages) {
        this.currentPageGroup++;
        this.fetchRecords((this.currentPageGroup - 1) * this.maxVisiblePages + 1);
      }
    },
    updatePageGroup() {
      this.currentPageGroup = Math.ceil(this.currentPage / this.maxVisiblePages);
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
    formatDateToISO(date) {
      return new Date(date).toISOString();
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
/* .base-input {
  border: none;
  background: transparent;
  text-align: center;
}

.icon-arrow-right {
  margin: 0 10px;
} */
</style>
