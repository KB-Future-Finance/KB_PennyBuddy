<template>
    <div class="file-upload">
        <button @click="close" class="close-btn">
            <span class="material-symbols-rounded titleicon">close</span>
        </button>
        <h2>파일을 드래그 앤 드롭하세요</h2>
        <div id="drop-area" @dragover.prevent @dragleave="resetDropArea" @drop="handleDrop" @click="triggerFileInput">
            <p>이미지를 드래그 앤 드롭 하거나 클릭하여 업로드하세요.</p>
            <input type="file" id="file-input" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">
        </div>
        <img v-if="imagePreview" :src="imagePreview" alt="업로드된 이미지" class="image-preview">
        <button @click="submitFile" :disabled="!selectedFile" class="submit-btn">제출</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'ocrDataParsed']);
const selectedFile = ref(null);
const imagePreview = ref(null);

const close = () => {
    emit('close');
};

const resetDropArea = (e) => {
    const dropArea = e.currentTarget;
    dropArea.style.backgroundColor = "#fff";
};

const handleDrop = (e) => {
    e.preventDefault();
    resetDropArea(e);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image")) {
        displayImage(file);
        selectedFile.value = file;
    }
};

const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
};

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
        displayImage(file);
        selectedFile.value = file;
    }
};

const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
        imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
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

#drop-area {
    border: 2px dashed #ccc;
    width: 100%;
    height: 200px;
    text-align: center;
    padding: 10px;
    margin: 10px auto;
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;
}

#drop-area:hover {
    background-color: #eee;
}

.image-preview {
    margin: 10px auto;
    max-width: 100%;
    max-height: 200px;
    display: block;
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