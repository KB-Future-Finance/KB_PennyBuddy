<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <div class="file-upload">
    <button @click="close" class="close-btn">
        <span class="material-symbols-rounded titleicon">close</span>
    </button>
    <h2>파일을 드래그 앤 드롭하세요</h2>
    <div class="drop-area">
        <input type="file" @change="handleFileUpload" class="chooseFile">
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
const close = () => {
    emit('close');
};

const handleFileUpload = (event) => {
    const files = event.target.files;
    console.log("Uploaded files:", files);
};
</script>
  
<style scoped>
.file-upload {
    width: 40%;
    height: 40%;
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
}
  
.drop-area {
    width: 100%;
    height: 80%;
    
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
}

</style>
  