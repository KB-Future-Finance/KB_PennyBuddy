import {defineStore} from 'pinia';

export const useInputStore = defineStore('inputStore', {
    state:()=>({
        isHidden: true
    }),
    actions:{
        showForm() {
            this.isHidden = false;
        },
        hideForm(){
            this.isHidden = true;
        }
    }
});

export const useStyleStore = defineStore('styleStore', {
    state:()=>({
        isHidden: true
    }),
    actions:{
        showButton() {
            this.isHidden = false;
        },
        hideButton(){
            this.isHidden = true;
        }
    }
});