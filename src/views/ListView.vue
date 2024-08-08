<template>
    <div class="menu">
        <MenuBar></MenuBar>
    </div>
    <div class="main">
        <div class="chat">
            <ChatBot></ChatBot>
        </div>
        <div class = "flex-container">
            <div class="box">
                <ExpenseList  @clickedAdd="removeHiddenClass"></ExpenseList>
            </div>
            <div class="box" :class="{hidden:isHidden}">
                <InputForm @clickedBack="addHiddenClass"></InputForm>
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
    display:flex;
    flex-direction: row;
    align-items: start;
    gap: 20px;

    flex-wrap: wrap;

    height:80%;
    width: 75%;

    box-sizing: border-box;

    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
}

.box{
    flex-grow: 1;
    max-width: 100%;
    height: 95%;

    background-color : white;
    
    padding : 20px;

    border-radius : 15px;
    box-shadow: 5px 5px 10px rgb(221, 215, 202);
    border:1px solid rgb(240, 240, 240);

    font-size: 18px;
    font-weight: 700;
    text-align:center;

    /* border:1px solid red; */
}

.chat{
    flex: 1 1 25%;
    /* border: 5px solid yellow; */
    height : 90vh;
    min-width: 300px;
}

.hidden{
    display: none;
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

<script setup>
import MenuBar from '@/components/common/MenuBarComponent.vue'
import ChatBot from '@/components/Chat/ChatbotComponent.vue'
import ExpenseList from '@/components/ExpenseList/ExpenseList.vue';
import InputForm from '@/components/Input/InputFormComponent.vue'

import{ref, onMounted} from 'vue';
import { useInputStore } from '@/stores/inputStore';

const store = useInputStore();
const isHidden = ref(store.isHidden);

onMounted(()=>{
    isHidden.value = store.isHidden;
});
</script>
