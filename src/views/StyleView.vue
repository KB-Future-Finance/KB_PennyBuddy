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
                <div class = "box">
                    키키(KIKI)<br>
                    <img src="@/assets/character_2d/Kiki.png"/>
                </div>
                <div class = "box">
                    아거(AGER)<br>
                    <img src="@/assets/character_2d/Ager.png"/>
                </div>
                <div class = "box">
                    비비(BIBI)<br>
                    <img src="@/assets/character_2d/Bibi.png"/>
                </div>
                <div class = "box">
                    콜리(COLLI)<br>
                    <img src="@/assets/character_2d/Colli.png"/>
                </div>
                <div class = "box">
                    라무(LAMU)<br>
                    <img src="@/assets/character_2d/Lamu.png"/>
                </div>
            </div>
            <div class = "item flex">
                <div class = "box">
                    선글라스<br>
                    <img src="@/assets/item_2d/선글라스.png"/>
                </div>
                <div class = "box">
                    스카프<br>
                    <img src="@/assets/item_2d/스카프.png"/>
                </div>
                <div class = "box">
                    크로스백<br>
                    <img src="@/assets/item_2d/크로스백.png"/>
                </div>
                <div class = "box">
                    넥타이<br>
                    <img src="@/assets/item_2d/넥타이.png"/>
                </div>
                <div class = "box">
                    꽃<br>
                    <img src="@/assets/item_2d/꽃.png"/>
                </div>
                <div class = "box">
                    리본<br>
                    <img src="@/assets/item_2d/리본.png"/>
                </div>
                <div class = "box">
                    모자<br>
                    <img src="@/assets/item_2d/모자.png"/>
                </div>
                <div class = "box">
                    목걸이<br>
                    <img src="@/assets/item_2d/목걸이.png"/>
                </div>
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

        font-size: 18px;
        font-weight: 700;
        text-align:center;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        /* border:1px solid red; */
    }

    .box img{
        max-width: 100%;
        max-height: 80%;
        margin-bottom:10px;
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
