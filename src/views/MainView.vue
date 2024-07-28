<template>
    <div class="main">
        <div class="chat">chatbot영역</div>
        <div class = "flex-container">
            <div class = "box" style="height:20%;">컴포넌트1</div>
            <div class = "box">컴포넌트2</div>
            <div class = "box">컴포넌트3</div>
            <div class = "box">컴포넌트4</div>
            <div class = "box">컴포넌트5</div>
            <div class = "box">컴포넌트5</div>
            <div class = "box">컴포넌트5</div>
        </div>
    </div>
    
    </template>
    
    <style scoped>
    .main {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;

        height:100%;
        width: 100%;

        box-sizing: border-box;
        border: 5px solid blue;
    }

    .flex-container{
        flex: 3 1 75%;
        display:flex;
        flex-direction: column;
        align-items: center;

        flex-wrap: wrap;

        height:100%;
        width: calc(100% - 320px);

        border:5px solid red; 
        box-sizing: border-box;

        padding: 20px;
    }

    .box{
        flex-grow: 1;
        min-width: 400px;
        max-width: 100%;
        height : 200px;
        width: 30%;

        background-color : white;
        
        margin:10px;
        padding : 20px;

        border-radius : 15px;
        box-shadow: 5px 5px 10px rgb(221, 215, 202);

        border:1px solid red;
    }

    .chat{
        flex: 1 1 25%;
        border: 5px solid yellow;
        height : 100%;
        min-width: 300px;
    }

    @media(max-width: 1050px){
        .main{
            flex-direction:row;
            align-items: center;
        }

        .flex-container{
            width: 100%;
            height: auto;
            flex-direction:row;
        }
    }
    </style>
