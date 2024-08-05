<script setup>
import MenuBar from '@/components/common/MenuBarComponent.vue'
import ChatBot from '@/components/Chat/ChatbotComponent.vue'

//테스트코드
import Input from '@/components/Input/InputFormComponent.vue'
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
            <div class = "box" style="height:20%;">컴포넌트1</div>
            <div class = "box">컴포넌트2</div>
            <router-link class="box" style="height:20%;" to="/chartMonth">월별차트</router-link>
            <div class = "box">컴포넌트4</div>
            <div class = "box">컴포넌트5</div>
            <router-link class="box" style="height:20%;" to="/expense-list">컴포넌트6</router-link>
            <div class = "box">
                <!-- 테스트 -->
                <Input></Input>
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
        align-items: center;

        flex-wrap: wrap;

        height:80%;
        max-width: 80%;

        /* border:5px solid red;  */
        box-sizing: border-box;

        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }

    .box{
        flex-grow: 1;
        max-width: 100%;
        height : 200px;
        width: 30%;

        background-color : white;
        
        margin: 10px 10px;
        padding : 20px;
        box-sizing: border-box;

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
