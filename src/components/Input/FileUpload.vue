<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <div class="file-upload">
        <button @click="close" class="close-btn">
            <span class="material-symbols-rounded titleicon">close</span>
        </button>
        <h2>파일을 드래그 앤 드롭하세요</h2>
        <div class="drop-area">
            <input type="file" @change="handleFileChange" class="chooseFile">
        </div>
        <button @click="submitFile" :disabled="!selectedFile" class="submit-btn">
            제출
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'ocrDataParsed']);
const selectedFile = ref(null);

const close = () => {
    emit('close');
};

const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        selectedFile.value = files[0];
    }
};

const submitFile = async () => {
    if (!selectedFile.value) return;

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    try {
        const response = await axios.post('http://127.0.0.1:5000/parse-ocr/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const parsedData = response.data;
        console.log("Parsed OCR Data:", parsedData);

        // 부모 컴포넌트로 OCR 데이터를 전달하고 창을 닫음
        emit('ocrDataParsed', parsedData);
        emit('close');

    } catch (error) {
        console.error("Failed to parse OCR:", error);
        alert("OCR 분석에 실패했습니다.");
    }
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

.submit-btn {
    margin-top: 20px;
    background-color: #FFC85E;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>