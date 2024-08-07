<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  
  <h1 class="title"> 카테고리별 소비 기록 </h1>

  <!-- 연도 선택 -->
  <div class="year-selection">
    <button @click="decrementYear"><span class="material-symbols-rounded icon">arrow_back_ios</span></button>
    <span>{{ selectedYear }}</span>
    <button @click="incrementYear"><span class="material-symbols-rounded icon">arrow_forward_ios</span></button>
  </div>

  <!-- 차트 -->
  <div class="chart-container">
    <canvas id="expenseChart2"></canvas>
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
        availableYears: [],
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
        params.append('memberId', '1'); // member_Id로 설정
  
        try {
          const response = await axios.get(`/api/record/year?${params.toString()}`);
          console.log('Category response data:', response.data);
          this.years = response.data.haveYears;
          this.availableYears = this.years.map(yearObj => parseInt(yearObj.year, 10)); // 응답에서 haveYears 배열 사용
          if (this.years.length > 0) {
            this.selectedYear = this.availableYears[0];
            this.fetchData();
          }
        } catch (error) {
          console.error('Error fetching years:', error);
        }
      },
      async fetchData() {
        console.log("Selected year: ", this.selectedYear); // 현재 선택한 년도 로그 출력
        const params = new URLSearchParams();
        params.append('memberId', '1'); // member_Id로 설정
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
              name: item.categoryName,
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
        const ctx = document.getElementById('expenseChart2').getContext('2d');
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
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
              legend: {
                position: 'right',
                labels:{
                  padding: 15
                }
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
  
<style scoped>
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

.year-selection {
  display: flex;
  justify-content: center;
  margin:10px auto 30px auto;
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

.chart-container {
  width: 100%;
  height: auto;
  margin: 20px auto;
  /* border: 1px solid red; */
}
</style>
