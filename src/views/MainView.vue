<script setup>
import MenuBar from '@/components/common/MenuBarComponent.vue'
import ChatBot from '@/components/Chat/ChatbotComponent.vue'

import ExpenseList from '@/components/Main/ExpenseList.vue'
import TotalMoney from '@/components/Main/TotalMoney.vue'
import MonthlySpend from '@/components/Main/MonthlySpend.vue'
import InputFormComponent from '@/components/Input/InputFormComponent.vue'


</script>

<template>
    <div class="menu">
        <MenuBar></MenuBar>
    </div>
    <div class="main">
        <div class="chat">
            <ChatBot></ChatBot>
        </div>
        <div class = "flex-container">
            <div class = "box" >
                <TotalMoney></TotalMoney>
            </div>
            <div class = "box">
                <MonthlySpend></MonthlySpend>
            </div>
            <div class = "box"><InputFormComponent></InputFormComponent>></div>
            <div class = "box">컴포넌트4</div>
            <div class = "box">
                <router-link to="/expense-list" class="nav-link">리스트</router-link>
            </div>
            
            <div class = "box">
                <ExpenseList></ExpenseList>
            </div>
        </div>
    </div>
    
    </template>
    
    <style scoped>

    .menu{
        position:fixed;
        top:20px;
        right: 20px;
        
        z-index: 2;

        /* border: 1px solid red; */

        margin-right: 3%;
    }

    .main {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;
        flex-wrap: wrap;

        height:100%;
        width: 100%;

        box-sizing: border-box;

        padding:0px 2%;
        /* border: 5px solid blue; */
    }

    .flex-container{
        flex: 3 1 75%;
        display:flex;
        flex-direction: column;
        align-items: flex-center;

        flex-wrap: wrap;

        height:80%;
        max-width: 100%;

        /* border:5px solid red;  */
        box-sizing: border-box;
        padding-bottom: 20px;
    }

    .box{
        flex-grow: 1;
        max-width: 100%;
        max-height: 100%;
        height : auto;
        width: 32%;
        margin-bottom: 15px;

        background-color : white;
        
        padding : 20px;

        border-radius : 15px;
        box-shadow: 5px 5px 10px rgb(221, 215, 202);
        border:1px solid rgb(240, 240, 240);

        /* border:1px solid red; */
    }

    .chat{
        flex: 1 1 25%;
        /* border: 5px solid yellow; */
        height : 90vh;
        min-width: 300px;
    }

    @media(max-width: 1050px){
        .main{
            flex-direction:row;
            align-items: center;
            height:auto;
        }

        .flex-container{
            width: 100%;
            height: auto;
            flex-direction:row;
        }

        .box{
            min-width: none;
            width: 80%;

            box-sizing: border-box;
        }
        
    }
    </style>
