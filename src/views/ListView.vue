<template>
    <div class="menu">
      <MenuBar></MenuBar>
    </div>
    <div class="main">
      <div class="chat">
        <ChatBot></ChatBot>
      </div>
      <div class="flex-container">
        <div class="box">
          <ExpenseList @clickedAdd="showInputForm" @showDetail="showDetail" @reload="reloadExpenseList" ref="expenseListRef"></ExpenseList>
        </div>
        <div class="box" :class="{ hidden: store.isHidden }">
          <DetailComponent v-if="selectedRecord && showDetailForm" :record="selectedRecord" @clickedBack="store.hideForm" @update="reloadExpenseList"/>
          <InputForm v-else @clickedBack="store.hideForm"></InputForm>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import MenuBar from '@/components/common/MenuBarComponent.vue';
  import ChatBot from '@/components/Chat/ChatbotComponent.vue';
  import ExpenseList from '@/components/ExpenseList/ExpenseList.vue';
  import InputForm from '@/components/Input/InputFormComponent.vue';
  import DetailComponent from '@/components/ExpenseList/DetailComponent.vue';
  
  import { ref, onMounted } from 'vue';
  import { useInputStore } from '@/stores/inputStore';
  
  const store = useInputStore();
  const isHidden = ref(store.isHidden);
  
  const selectedRecord = ref(null);
  const showDetailForm = ref(false);
  const expenseListRef = ref(null);
  
  const showDetail = (record) => {
      selectedRecord.value = record;
      store.showForm();
      showDetailForm.value = true;
  };
  
  const showInputForm = () => {
      showDetailForm.value = false;
      store.showForm();
  };
  
  const reloadExpenseList = () => {
      if (expenseListRef.value) {
          expenseListRef.value.fetchRecords();
      }
  };
  
  onMounted(() => {
      isHidden.value = store.isHidden;
  });
  </script>
  
  <style scoped>
  .menu {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2;
      margin-right: 3%;
  }
  
  .main {
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      align-items: center;
      flex-wrap: wrap;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 2%;
  }
  
  .flex-container {
      display: flex;
      flex-direction: row;
      align-items: start;
      gap: 20px;
      flex-wrap: wrap;
      height: 80%;
      width: 75%;
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
  }
  
  .box {
      flex-grow: 1;
      max-width: 100%;
      height: 95%;
      background-color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 5px 5px 10px rgb(221, 215, 202);
      border: 1px solid rgb(240, 240, 240);
      font-size: 18px;
      font-weight: 700;
      text-align: center;
  }
  
  .chat {
      flex: 1 1 25%;
      height: 90vh;
      min-width: 300px;
  }
  
  .hidden {
      display: none;
  }
  
  @media (max-width: 1050px) {
      .main {
          flex-direction: row;
          align-items: center;
          height: auto;
      }
  
      .flex-container {
          width: 100%;
          height: auto;
          flex-direction: row;
      }
  
      .box {
          min-width: none;
          width: 80%;
          box-sizing: border-box;
      }
  }
  </style>
  