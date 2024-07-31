<template>
  <div class="expense-list">
    <header>
      <!-- <img src="@/assets/penny-buddy-logo.png" alt="Penny Buddy Logo"/> -->
      <div class="rabbit-image"></div>
    </header>
    <main>
      <div class="filter-section">
        <vue3-datepicker v-model="startDate" placeholder="시작일" />
        <vue3-datepicker v-model="endDate" placeholder="종료일" />
        <div class="radio-group">
          <label><input type="radio" v-model="filterType" value="전체" /> 전체</label>
          <label><input type="radio" v-model="filterType" value="수입" /> 수입</label>
          <label><input type="radio" v-model="filterType" value="지출" /> 지출</label>
        </div>
        <div class="checkbox-group">
          <label v-for="category in categories" :key="category.id">
            <input type="checkbox" v-model="selectedCategories" :value="category.id" /> {{ category.name }}
          </label>
        </div>
      </div>
      <div class="data-section">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>카테고리</th>
              <th>금액</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayedData" :key="item.id">
              <td>{{ item.date }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.amount }}</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)">{{ page }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </main>
    <footer>
      <div>총 수입: {{ totalIncome }}</div>
      <div>총 지출: {{ totalExpense }}</div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import Datepicker from 'vue3-datepicker';

export default {
  components: {
    'vue3-datepicker': Datepicker
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      filterType: '전체',
      categories: [],
      selectedCategories: [],
      data: [],
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredData() {
      return this.data.filter(item => {
        const inDateRange = (!this.startDate || new Date(item.date) >= new Date(this.startDate)) &&
                            (!this.endDate || new Date(item.date) <= new Date(this.endDate));
        const matchesType = this.filterType === '전체' || item.type === this.filterType;
        const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(item.categoryId);

        return inDateRange && matchesType && matchesCategory;
      });
    },
    displayedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    totalIncome() {
      return this.data.filter(item => item.type === '수입').reduce((sum, item) => sum + item.amount, 0);
    },
    totalExpense() {
      return this.data.filter(item => item.type === '지출').reduce((sum, item) => sum + item.amount, 0);
    }
  },
  methods: {
    fetchData() {
      axios.get('/api/record/list')
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    changePage(page) {
      this.currentPage = page;
    }
  },
  created() {
    this.fetchData();
    axios.get('/api/categories')
      .then(response => {
        this.categories = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style>
/* Add necessary styles here */
</style>
