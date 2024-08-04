<script setup>
import MenuBar from '@/components/common/MenuBarComponent.vue'
import ChatBot from '@/components/Chat/ChatbotComponent.vue'

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
            <div class = "character flex">
                <div class = "box">컴포넌트2</div>
                <div class = "box">컴포넌트2</div>
                <div class = "box">컴포넌트2</div>
                <div class = "box">컴포넌트2</div>
                <div class = "box">컴포넌트2</div>
            </div>
            <div class = "item flex">
                <div class = "box">컴포넌트3</div>
                <div class = "box">컴포넌트4</div>
                <div class = "box">컴포넌트5</div>
                <div class = "box">컴포넌트5</div>
                <div class = "box">컴포넌트3</div>
                <div class = "box">컴포넌트4</div>
                <div class = "box">컴포넌트5</div>
                <div class = "box">컴포넌트5</div>
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
        align-items: start;
        gap: 20px;

        flex-wrap: wrap;

        height:80%;
        max-width: 75%;

        /* border:5px solid red;  */
        box-sizing: border-box;

        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }

    .flex{
        display:flex;
        max-width: 100%;
        flex-wrap:nowrap;
        overflow-x: auto;
        /* border:1px solid red; */
    }

    .flex::-webkit-scrollbar{
        width: 10px;
        height: 10px;
    }
    .flex::-webkit-scrollbar-track{
        background: #ffffff;
        border-radius: 10px;
    }
    .flex::-webkit-scrollbar-thumb{
        background: #FFC85E;
        border-radius: 10px;
    }
    .flex::-webkit-scrollbar-thumb:hover{
        background: #ffcb7c;
    }

    .character .box{
        width:30%;
        min-width:250px;
        height:400px;
    }

    .item .box{
        min-width:200px;
        height:200px;
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
