<template>
  <div class="container">
    <div>
      <FilterComponent @filter-applied="applyFilter"></FilterComponent>
    </div>

    <!-- 기록 목록 테이블 -->
    <table class="expense-table">
      <thead>
        <tr>
          <th class="hidden">인덱스</th>
          <th>날짜</th>
          <th>카테고리</th>
          <th>금액</th>
          <th>제목</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.record_id">
          <td class="hidden">{{ record.record_id }}</td>
          <td>{{ formatDate(record.reg_date) }}</td>
          <td>{{ record.category_name }}</td>
          <td :class="amountClass(record.category_type)">{{ formatAmount(record.amount, record.category_type) }}</td>
          <td>{{ record.record_memo }}</td>
          <td>
            <button class="edit-button" @click="getDetail(record.record_id)">상세</button>
            <button class="delete-button" @click="confirmDelete(record.record_id)">삭제</button>
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
import { useRouter } from 'vue-router';

export default {
  name: 'ExpenseList',
  components: {
    DatePicker,
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
      filterData: {} // 필터링 데이터를 상태로 유지
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
    applyFilter(filterData) {
      this.filterData = filterData; // 필터링 데이터를 상태로 저장
      this.currentPage = 1; // 필터링 적용 시 첫 페이지로 이동
      this.fetchRecords(filterData);
    },
    fetchRecords(filterData = {}) {
      console.log("Fetch records called with data:", filterData);
      const {
        startDate = this.dateRange.start,
        endDate = this.dateRange.end,
        category_type = this.category_type || null,
        categories = (this.categories && this.categories.length > 0) ? this.categories : null, // 빈 배열 대신 null을 전달
        page = this.currentPage
      } = filterData;

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', new Date(startDate).toISOString().split('T')[0]); // ISO 형식으로 변환
      if (endDate) params.append('endDate', new Date(endDate).toISOString().split('T')[0]); // ISO 형식으로 변환
      if (category_type) params.append('category_type', category_type);
      if (categories) {
        categories.forEach(category => params.append('categories', category)); // 수정된 부분
      } else {
        params.append('categories', ''); // 빈 배열을 빈 문자열로 처리
      }
      params.append('page', page);
      params.append('size', 5); // 화면당 보여주는 개수 
      params.append('member_Id', 1);

      axios.get(`/api/record/list?${params.toString()}`)
        .then(response => {
          console.log("API response:", response.data);
          this.records = response.data.records;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
          this.filterCategories();  // 필터링 적용
          this.updatePageGroup();
          this.fetchTotalAmount(filterData); // 필터링된 데이터로 총 수입/지출 금액을 업데이트합니다.
        })
        .catch(error => {
          console.error(error);
        });
    },

    async fetchTotalAmount(filterData = {}) {
      const {
        startDate = this.dateRange.start,
        endDate = this.dateRange.end,
        category_type = this.category_type || null,
        categories = (this.categories && this.categories.length > 0) ? this.categories : null
      } = filterData;

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', new Date(startDate).toISOString().split('T')[0]);
      if (endDate) params.append('endDate', new Date(endDate).toISOString().split('T')[0]);
      if (category_type) params.append('category_type', category_type);
      if (categories) {
        categories.forEach(category => params.append('categories', category));
      } else {
        params.append('categories', '');
      }
      params.append('member_Id', 1);

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
      if (this.dateRange.start) params.append('startDate', new Date(this.dateRange.start).toISOString().split('T')[0]); // ISO 형식으로 변환
      if (this.dateRange.end) params.append('endDate', new Date(this.dateRange.end).toISOString().split('T')[0]); // ISO 형식으로 변환
      params.append('member_Id', 1);

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
      if (this.type === '1') { // 수입
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '1');
      } else if (this.type === '2') { // 지출
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '2');
      } else { // 전체
        this.filteredCategories = [];
      }
      this.categories = []; // 필터링할 때마다 선택된 카테고리 초기화
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
    confirmDelete(record_id) {
      if (confirm("삭제하시겠습니까?")) {
        this.deleteRecord({ record_id: record_id, member_Id: 1 });
      }
    },
    deleteRecord(deleteData={}) {
      const {
        record_id,
        member_Id
      } = deleteData;

      const params = new URLSearchParams();
      if (record_id) params.append('record_id', record_id);
      if (member_Id) params.append('member_Id', member_Id);

      axios.get(`/api/record/delete`, {
        params: {
          record_id: record_id,
          member_Id: member_Id
        }
      })
      .then(response => {
        console.log('delete success');
        // 현재 페이지의 데이터가 삭제되었을 때 페이지 이동 처리
        if (this.records.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.fetchRecords(this.filterData);
      })
      .catch(error => {
        console.error("Error fetching delete:", error);
      });
    },
    getDetail(record_id) {
      const member_Id = 1; // 실제 사용 시, 현재 로그인된 사용자의 ID로 변경
      console.log("Record ID:", record_id);
      this.$router.push({ name: 'Detail', params: { record_id ,member_Id} });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: white; /* 전체 페이지 배경을 하얀색으로 설정 */
}

.filter-section {
  margin-bottom: 20px;
}

.filter-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.filter-table td {
  padding: 10px;
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 5px;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th, .expense-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.expense-table th {
  background-color: #f2f2f2;
}

.total-amount {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.income {
  color: blue;
  margin-right: 20px;
}

.expense {
  color: red;
}

.edit-button, .delete-button {
  background-color: #f08d8d;
  border: none;
  padding: 5px 10px;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.pagination button.active {
  background-color: #f08d8d;
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

</style>
