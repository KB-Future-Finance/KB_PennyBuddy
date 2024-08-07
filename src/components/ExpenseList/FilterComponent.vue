<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="container">
    <!-- 필터 섹션 -->
    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td>
            <h2><span class="material-symbols-rounded icon">event_available</span><span class="subTitle"> 거래일자</span></h2>
            <date-picker v-model="dateRange" is-range>
              <template #default="{ inputValue = { start: '', end: '' }, inputEvents = {} }">
                <div class="flex justify-center items-center">
                  <input :value="inputValue.start || ''" v-on="inputEvents.start || {}" class="date-input" readonly />
                  <span class="icon-arrow-right"></span>
                  <input :value="inputValue.end || ''" v-on="inputEvents.end || {}" class="date-input" readonly />
                </div>
              </template>
            </date-picker>
          </td>
        </tr>
        <tr>
          <td>
            <h2><span class="material-symbols-rounded icon">view_cozy</span><span class="subTitle"> 분류</span></h2>
            <div class="class-input">
              <label for="all" class="radio">
                <input type="radio" id="all" value="" v-model="categoryType" @change="filterCategories" />
                <span class="label">전체</span>
              </label>
              <label for="income" class="radio">
                <input type="radio" id="income" value="1" v-model="categoryType" @change="filterCategories" />
                <span class="label">수입</span>
              </label>
              <label for="expense" class="radio">
                <input type="radio" id="expense" value="2" v-model="categoryType" @change="filterCategories" />
                <span class="label">지출</span>
              </label>
            </div>
          </td>
        </tr>
        <tr v-if="filteredCategories.length">
          <td>
            <h2><span class="material-symbols-rounded icon">list</span><span class="subTitle"> 카테고리</span></h2>
            <div class="category-input">
              <div class="select-btn" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
                <span class="btn-text">{{ getButtonText }}</span>
                <span class="arrow-dwn">
                  <i class="material-symbols-rounded icon">keyboard_arrow_down</i>
                </span>
              </div>

              <ul class="list-items" v-show="isDropdownOpen">
                <li class="item" v-for="category in filteredCategories" :key="category.categoryIdx" @click.stop="selectItem(category)" :class="{ checked: selectedItem === category.categoryIdx }">
                  <input type="radio" :value="category.categoryIdx" v-model="selectedItem" class="radio"/>
                  <span class="item-text">{{ category.categoryName }}</span>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </table>
      <button @click="applyFilter" class="button">조회</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // axios 가져오기
import { DatePicker } from 'v-calendar'; // DatePicker 가져오기
import { ref, computed, onMounted, onUnmounted } from 'vue';

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
      categoryType: '', // type을 categoryType 변경
      categories: [],
      filteredCategories: [],
      allCategories: [],
      isDropdownOpen: false,
      selectedItem: ''
    };
  },
  methods: {
    applyFilter() {
      const filterData = {
        startDate: this.dateRange.start,
        endDate: this.dateRange.end,
        categoryType: this.categoryType, // type을 category_type으로 변경
        categories: this.categories.slice() // 배열의 실제 복사본 전달
      };

      console.log("Apply filter button clicked with data:", filterData);
      this.$emit('filter-applied', filterData);
    },

    async fetchCategories() {
      const params = new URLSearchParams();
      if (this.dateRange.start) params.append('startDate', this.dateRange.start);
      if (this.dateRange.end) params.append('endDate', this.dateRange.end);
      params.append('memberId', 1);

      try {
        const response = await axios.get(`/api/record/category?${params.toString()}`);
        this.allCategories = response.data.haveCategories;
        this.filterCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    filterCategories() {
      if (this.categoryType === '1') { // 수입
        this.filteredCategories = this.allCategories.filter(category => category.categoryType === '1');
      } else if (this.categoryType === '2') { // 지출
        this.filteredCategories = this.allCategories.filter(category => category.categoryType === '2');
      } else { // 전체
        this.filteredCategories = [];
      }
      this.categories = []; // 필터링할 때마다 선택된 카테고리 초기화
    },
    toggleDropdown(e) {
      e.stopPropagation();
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectItem(item) {
      this.selectedItem = item.categoryIdx;
      this.isDropdownOpen = false;
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.dropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  },
  watch: {
    categoryType() {
      this.filterCategories();
    }
  },
  computed: {
    getButtonText() {
      if (!this.selectedItem) return '카테고리를 선택하세요';
      const category = this.categories.find(category => category.categoryIdx === this.selectedItem);
      return category ? category.categoryName : '카테고리를 선택하세요';
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

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.filter-section {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

.filter-section::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.filter-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.filter-section::-webkit-scrollbar-thumb {
  background: #FFC85E;
  border-radius: 10px;
}

.filter-section::-webkit-scrollbar-thumb:hover {
  background: #ffcb7c;
}

.filter-table {
  width: 100%;
}

.filter-table td {
  text-align: left; /* 추가 */
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

.label {
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
</style>
