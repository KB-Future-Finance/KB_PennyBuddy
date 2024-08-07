<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  
  <h1 class="title"> 월별 소비 기록 </h1>
  
  <div class="container">  
    <!-- 연도 선택 -->
    <div class="year-selection">
      <button @click="decrementYear"><span class="material-symbols-rounded icon">arrow_back_ios</span></button>
      <span>{{ selectedYear }}</span>
      <button @click="incrementYear"><span class="material-symbols-rounded icon">arrow_forward_ios</span></button>
    </div>
    
    <div class="chart-container">
      <canvas id="expenseChart"></canvas>
    </div>
    <div class="list-container">
        <div class="list-column">
          <div v-for="(expense, index) in firstHalfExpenses" :key="index" class="expense-item">
            <span class="month">{{ expense.month }}월</span>
            <span class="amount">{{ expense.amount.toLocaleString() }} 원</span>
            <span class="change" :class="expense.change > 0 ? 'up' : 'down'">
              {{ expense.change > 0 ? '↑' : expense.change < 0 ? '↓' : '-' }}
            </span>
          </div>
        </div>
        <div class="list-column">
          <div v-for="(expense, index) in secondHalfExpenses" :key="index" class="expense-item">
            <span class="month">{{ expense.month }}월</span>
            <span class="amount">{{ expense.amount.toLocaleString() }} 원</span>
            <span class="change" :class="expense.change > 0 ? 'up' : 'down'">
              {{ expense.change > 0 ? '↑' : expense.change < 0 ? '↓' : '-' }}
            </span>
          </div>
        </div>
      </div>
  </div>      
</template>
  
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
  
export default {
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      years: [],
      availableYears: [], // 사용 가능한 연도를 저장하기 위한 배열
      expenses: [],
      chartInstance: null // Chart 인스턴스를 저장하기 위한 변수
    };
  },
  computed: {
    firstHalfExpenses() {
      const halfLength = Math.ceil(this.expenses.length / 2);
      return this.expenses.slice(0, halfLength);
    },
    secondHalfExpenses() {
      const halfLength = Math.ceil(this.expenses.length / 2);
      return this.expenses.slice(halfLength);
    }
  },
  methods: {
    async fetchYears() {
      const params = new URLSearchParams();
      params.append('member_Id', '1'); // member_Id로 설정
  
      try {
        const response = await axios.get(`/api/record/year?${params.toString()}`);
        // console.log('Year response data:', response.data);
        this.years = response.data.haveYears; // 응답에서 haveYears 배열 사용
        this.availableYears = this.years.map(yearObj => parseInt(yearObj.year, 10)); // 사용 가능한 연도 배열로 저장
        // console.log('Available years:', this.availableYears);
        if (this.years.length > 0) {
          this.selectedYear = this.availableYears[0];
          this.fetchData();
        }
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    },
    async fetchData() {
      // console.log("Selected year: ", this.selectedYear); // 현재 선택한 년도 로그 출력
      const params = new URLSearchParams();
      params.append('member_Id', '1'); // member_Id로 설정
      params.append('year', this.selectedYear); // selectedYear로 설정
  
      try {
        const response = await axios.get(`/api/record/chartMonth?${params.toString()}`);
        // console.log('Expense response data:', response.data);
        this.expenses = response.data.chartMonth.map((item, index, array) => {
          let change = 0;
          if (index > 0) {
            change = item.amount - array[index - 1].amount;
          }
          return {
            month: item.months,
            amount: item.amount,
            change: change
          };
        });
        this.updateChart();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    incrementYear() {
      const nextYear = parseInt(this.selectedYear, 10) + 1;
      // console.log('Trying to increment to year:', nextYear);
      if (this.availableYears.includes(nextYear)) {
        this.selectedYear = nextYear;
        this.fetchData();
      } else {
        // console.log('Year not available:', nextYear);
      }
    },
    decrementYear() {
      const prevYear = parseInt(this.selectedYear, 10) - 1;
      // console.log('Trying to decrement to year:', prevYear);
      if (this.availableYears.includes(prevYear)) {
        this.selectedYear = prevYear;
        this.fetchData();
      } else {
        // console.log('Year not available:', prevYear);
      }
    },
    updateChart() {
      const ctx = document.getElementById('expenseChart').getContext('2d');
      if (this.chartInstance) {
        this.chartInstance.destroy(); // 기존 차트가 있으면 파괴
      }
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.expenses.map(expense => `${expense.month}월`),
          datasets: [
            {
              label: '월별 소비 금액',
              data: this.expenses.map(expense => expense.amount),
              fill: true,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.2
        },
      });
    }
  },
  mounted() {
    this.fetchYears();
  }
};
</script>
  
<style scoped>
.container {
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 0px;

  font-size: 14px;

  /* 테스트 코드 */
  /* border: 1px solid red; */
}

.title {
  font-size: 20px;
  font-weight: 800;
  text-align: left;
  width: fit-content;

  background: linear-gradient(transparent 30%, #ffcb7c 30%);
  display: inline-block;

  margin-bottom: 20px;
  /* border: 1px solid blue; */
}

.chart-container {
  width: 100%;
  /* border: 1px solid red; */
}

.list-container {
  display: flex;
  gap: 30px;
  justify-content: space-around;

  font-size: 14px;
}

.list-column {
  width: 45%;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  border-radius: 0px;
  padding: 8px 0px;
  background-color: white;
  box-shadow: none;

  /* border:1px solid red; */
}

.expense-item span {
  flex: 1;
  text-align: center;
  /* border: 1px solid red; */
}

.expense-item .month {
  font-weight: 600;
  color: #ff8e1d;

  background-color: #fdf1df;
  border-radius: 10px;
  padding: 2px;
}

.expense-item .amount {
  font-weight: bold;
  min-width: 65%;
}

.change {
  max-width: 10%;
}

.up {
  color: red;
}

.down {
  color: blue;
}

.year-selection {
  display: flex;
  justify-content: center;
}

.year-selection button {
  background-color: white;
  border: none;
}

button .icon {
  color:#ffaa29;
  font-size: 14px;
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
}

button .icon:hover {
  color:#ffffff;
  font-size: 14px;
  background-color: #ffaa29;
  padding: 5px;
  border-radius: 100px;
}

.year-selection > span {
  color:#ffaa29;
  font-size: 17px;
  font-weight: 500;
  text-align: center;

  background-color: #fdf1df;
  border-radius: 100px;

  margin: 0px 10px;

  width: 100px;
}
</style>
