<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  
    <div class="container">
      <h1 class="title"> 이번 달 수입 / 지출</h1>
      <p class="money">
        <div class="income">
          <span class="material-symbols-rounded icon">trending_up</span>
          <span class="moneyText">수입 : {{ formatAmount(totalIncome, '1') }} 원</span>
        </div>
        <div class="outcome">
          <span class="material-symbols-rounded icon">trending_down</span>
          <span class="moneyText">지출 : {{ formatAmount(totalExpense, '2') }} 원</span>
        </div>
      </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ExpenseList',
    data() {
      return {
        totalIncome: 0,  // 총 수입
        totalExpense: 0  // 총 지출
      };
    },
    created() {
      this.fetchTotalAmount();
    },
    methods: {
      async fetchTotalAmount() {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
        const params = new URLSearchParams();
        params.append('startDate', startDate.toISOString().split('T')[0]);
        params.append('endDate', endDate.toISOString().split('T')[0]);
        params.append('memberId', 1);
  
        try {
          const response = await axios.get(`/api/record/totalAmount?${params.toString()}`);
          this.totalIncome = response.data.totalIncome;
          this.totalExpense = response.data.totalExpense;
        } catch (error) {
          console.error(error);
        }
      },
      formatAmount(amount, type) {
        let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${formattedAmount}`;
      }
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
      /* align-items: center; */
  
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
  
  .money{
    display: flex;
    gap: 7%;
    font-size: 20px;
    font-weight: 600;  
    /* border: 1px solid blue; */
  }
  
  .money .icon{
    vertical-align: middle;
  
    font-size:25px;
    margin-right: 5px;
  }
  
  .money .moneyText{
    vertical-align: middle;
  
    font-weight: 600;
    /* border: 1px solid red; */
  }

  .income .icon{
    color: rgb(64, 131, 255);
  }

  .outcome .icon{
    color: red;
  }
  </style>  