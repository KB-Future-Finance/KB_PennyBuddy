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