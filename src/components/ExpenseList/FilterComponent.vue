<template>
  <div>
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td>
            <label for="dateRange">조회기간</label>
            <date-picker v-model="dateRange" is-range>
              <template #default="{ inputValue = { start: '', end: '' }, inputEvents = {} }">
                <div class="flex justify-center items-center">
                  <input :value="inputValue.start || ''" v-on="inputEvents.start || {}" class="base-input" readonly />
                  <span class="icon-arrow-right"></span>
                  <input :value="inputValue.end || ''" v-on="inputEvents.end || {}" class="base-input" readonly />
                </div>
              </template>
            </date-picker>
          </td>
        </tr>
        <tr>
          <td>분류</td>
          <td>
            <input type="radio" id="all" value="" v-model="category_type" @change="filterCategories" />
            <label for="all">전체</label>
            <input type="radio" id="income" value="1" v-model="category_type" @change="filterCategories" />
            <label for="income">수입</label>
            <input type="radio" id="expense" value="2" v-model="category_type" @change="filterCategories" />
            <label for="expense">지출</label>
          </td>
        </tr>
        <tr v-if="filteredCategories.length">
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
      <button @click="applyFilter">조회</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // axios 가져오기
import { DatePicker } from 'v-calendar'; // DatePicker 가져오기

export default {
  components: {
    DatePicker // DatePicker 등록
  },
  data() {
    return {
      dateRange: {
        start: '',
        end: ''
      },
      category_type: '', // type을 category_type으로 변경
      categories: [],
      filteredCategories: [],
      allCategories: []
    };
  },
  methods: {
    applyFilter() {
      const filterData = {
        startDate: this.dateRange.start,
        endDate: this.dateRange.end,
        category_type: this.category_type, // type을 category_type으로 변경
        categories: this.categories.slice() // 배열의 실제 복사본 전달
      };

      console.log("Apply filter button clicked with data:", filterData);
      this.$emit('filter-applied', filterData);
    },

    async fetchCategories() {
      const params = new URLSearchParams();
      if (this.dateRange.start) params.append('startDate', this.dateRange.start);
      if (this.dateRange.end) params.append('endDate', this.dateRange.end);
      params.append('member_Id', 1);

      try {
        const response = await axios.get(`/api/record/category?${params.toString()}`);
        this.allCategories = response.data.haveCategories;
        this.filterCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    filterCategories() {
      if (this.category_type === '1') { // 수입
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '1');
      } else if (this.category_type === '2') { // 지출
        this.filteredCategories = this.allCategories.filter(category => category.category_type === '2');
      } else { // 전체
        this.filteredCategories = [];
      }
      this.categories = []; // 필터링할 때마다 선택된 카테고리 초기화
    }
  },
  watch: {
    category_type() {
      this.filterCategories();
    }
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>

<style scoped>
/* 스타일을 여기에 추가하세요 */
</style>
