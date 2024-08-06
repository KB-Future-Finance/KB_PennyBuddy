<template>
  <div class="container">
    <h1 class="title"> 월별 소비 기록 </h1>
    
    <div class="chart-container">
      <canvas id="expenseChart"></canvas>
    </div>
  </div>
      <div class="year-select-container">
        <label for="year-select">년도 선택: </label>
        <select id="year-select" v-model="selectedYear" @change="fetchData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
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
  </template>
  
  <script>
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  export default {
    data() {
      return {
        selectedYear: null,
        years: [],
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
          console.log('Year response data:', response.data);
          this.years = response.data.haveYears.map(record => record.year); // 응답에서 haveYears 배열 사용
          if (this.years.length > 0) {
            this.selectedYear = this.years[0];
            this.fetchData();
          }
        } catch (error) {
          console.error('Error fetching years:', error);
        }
      },
      async fetchData() {
        console.log("Selected year: ", this.selectedYear); // 현재 선택한 년도 로그 출력
        const params = new URLSearchParams();
        params.append('member_Id', '1'); // member_Id로 설정
        params.append('year', this.selectedYear); // selectedYear로 설정
  
        try {
          const response = await axios.get(`/api/record/chartMonth?${params.toString()}`);
          console.log('Expense response data:', response.data);
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
                beginAtZero: true,
              },
            },
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
.container{
      width:100%;
      height:fit-content;
  
      display: flex;
      flex-direction: column;
      justify-content: start;
  
      padding: 0px;
  
      font-size:14px;
  
      /* 테스트 코드 */
      /* border: 1px solid red; */
  }
  
  .title{
      font-size:20px;
      font-weight: 800;
      text-align: left;
      width:fit-content;
  
      background: linear-gradient(transparent 30%, #ffcb7c 30%);
      display: inline-block;
  
      margin-bottom:20px;
      /* border: 1px solid blue; */
  }

  
  .chart-container {
    width: 100%;
    margin: 0 auto 20px auto;
  }
  
  
  .list-container {
    display: flex;
    justify-content: space-around;
    margin: 20px auto;

    font-size: 14px;
  }
  
  .list-column {
    width: 48%;
  }
  
  .expense-item {
    display: flex;
    justify-content: space-between;

    border:1px solid red;
  }
  
  .expense-item span {
    flex: 1;
    text-align: center;
  }
  
  .expense-item .month {
    font-weight: bold;
    color: #ff9f40;
  }
  
  .expense-item .amount {
    font-weight: bold;
  }
  
  .up {
    color: red;
  }
  
  .down {
    color: blue;
  }
  </style>
