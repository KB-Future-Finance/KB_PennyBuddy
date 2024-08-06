<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

  <div class="container">
    <h1 class="title"> 현재 자산 </h1>

    <p class="money">
      <span class="material-symbols-rounded icon">paid</span>
      <span class="moneyText">{{ formattedAmount }} 원</span>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExpenseList',
  data() {
    return {
      amount: 0
    };
  },
  computed: {
    formattedAmount() {
      return new Intl.NumberFormat('ko-KR').format(this.amount);
    }
  },
  created() {
    this.fetchTotalAmount();
  },
  methods: {
    async fetchTotalAmount() {
      const params = new URLSearchParams();
      params.append('member_Id', 1);
      try {
        const response = await axios.get(`/api/record/resultAmount?${params.toString()}`);
        this.amount = response.data.amount.amount;
      } catch (error) {
        console.error(error);
      }
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
</style>
