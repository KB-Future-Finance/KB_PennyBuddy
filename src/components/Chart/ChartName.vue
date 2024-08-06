<template>
    <div id="app2">
      <h1>카테고리별 소비 기록</h1>
      <div class="year-select-container">
        <label for="year-select">년도 선택: </label>
        <select id="year-select" v-model="selectedYear" @change="fetchData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="chart-container">
        <canvas id="expenseChart"></canvas>
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
          console.log('Category response data:', response.data);
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
          const response = await axios.get(`/api/record/chartName?${params.toString()}`);
          console.log('Expense response data:', response.data);
          this.expenses = response.data.chartName.map((item, index, array) => {
            let change = 0;
            if (index > 0) {
              change = item.amount - array[index - 1].amount;
            }
            return {
              name: item.category_name,
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

        // 동적으로 색상을 생성
        const colors = this.expenses.map((_, index) => `hsl(${index * 30}, 100%, 75%)`);

        this.chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.expenses.map(expense => `${expense.name}`),
            datasets: [
              {
                label: '카테고리별 소비 금액',
                data: this.expenses.map(expense => expense.amount),
                fill: true,
                backgroundColor: colors,
                borderColor:  colors.map(color => color.replace('75%', '50%')),
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
            plugins: {
              legend: {
                position: 'bottom',
              }
            }
          },
        });
      }
    },
    mounted() {
      this.fetchYears();
    }
  };
  </script>
  
  <style>
  #app2 {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    margin: 20px auto;
  }
  
  .year-select-container {
    margin: 20px;
  }
  
  .chart-container {
    width: 80%;
    margin: 0 auto 20px auto;
  }
  

  
  .list-column {
    width: 48%;
  }
  
  .expense-item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
