<template>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    
  <div>
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <div class="date">
        <h2><span class="material-symbols-rounded icon">event_available</span><span class="subTitle"> 조회기간</span></h2>
        <date-picker v-model="dateRange" is-range>
          <template #default="{ inputValue = { start: '', end: '' }, inputEvents = {} }">
            <div class="date-input-container">
              <input :value="inputValue.start || ''" v-on="inputEvents.start || {}" class="date-input" readonly />
              <span class="icon-arrow-right"></span>
              <input :value="inputValue.end || ''" v-on="inputEvents.end || {}" class="date-input" readonly />
            </div>
          </template>
        </date-picker>
      </div>

      <div class="class">
        <h2><span class="material-symbols-rounded icon">view_cozy</span><span class="subTitle"> 분류</span></h2>
        <div class="class-input">
          <label for="all" class="radio">
            <input type="radio" id="all" value="" v-model="category_type" @change="filterCategories" class="hidden" />
            <span class="label">전체</span>
          </label>
          <label for="income" class="radio">
            <input type="radio" id="income" value="1" v-model="category_type" @change="filterCategories"  />
            <span class="label">수입</span>
          </label>
          <label for="expense" class="radio">
            <input type="radio" id="expense" value="2" v-model="category_type" @change="filterCategories" class="hidden" />
            <span class="label">지출</span>
          </label>
        </div>
      </div>

      <div class="category" v-if="filteredCategories.length">
        <h2><span class="material-symbols-rounded icon">list</span><span class="subTitle"> 카테고리</span></h2>
        <div class="category-input">
          <div class="select-btn" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
            <span class="btn-text">{{ getButtonText }}</span>
            <span class="arrow-dwn">
              <i class="material-symbols-rounded icon">keyboard_arrow_down</i>
            </span>
          </div>

          <ul class="list-items" v-show="isDropdownOpen">
            <li class="item" v-for="category in filteredCategories" :key="category.category_id" @click.stop="toggleItemSelection(category.category_id)" :class="{ checked: categories.includes(category.category_id) }">
              <span class="checkbox">
                <span class="material-symbols-rounded icon check-icon">check</span>
              </span>
              <span class="item-text">{{ category.category_name }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="enter">
        <button @click="applyFilter" class="button">조회</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // axios 가져오기
import { DatePicker } from 'v-calendar'; // DatePicker 가져오기
import '@/assets/Expense/FilterComponent.css'; // CSS 파일을 가져오기

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
      allCategories: [],
      isDropdownOpen: false
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
    },
    toggleDropdown(e) {
      e.stopPropagation();
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleItemSelection(categoryId) {
      const index = this.categories.indexOf(categoryId);
      if (index === -1) {
        this.categories.push(categoryId);
      } else {
        this.categories.splice(index, 1);
      }
    },
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.category-input');
      if (dropdown && !dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  },
  computed: {
    getButtonText() {
      return this.categories.length > 0 ? `${this.categories.length}개 선택되었습니다` : '카테고리를 선택하세요';
    }
  },
  watch: {
    category_type() {
      this.filterCategories();
    }
  },
  mounted() {
    this.fetchCategories();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>


