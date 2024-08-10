<template>
    <div class="file-upload">
        <button @click="close" class="close-btn">
            <span class="material-symbols-rounded titleicon">close</span>
        </button>
        <h2>파일을 드래그 앤 드롭하세요</h2>
        <div 
            id="drop-area" 
            @dragover.prevent 
            @dragleave="resetDropArea" 
            @drop="handleDrop" 
            @click="triggerFileInput"
            :class="{ disabled: selectedFile }"
        >
            <p v-if="!selectedFile">이미지를 드래그 앤 드롭 하거나 클릭하여 업로드하세요.</p>
            <p v-else>이미지 업로드 완료</p>
            <input type="file" id="file-input" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" :disabled="selectedFile">
        </div>
        <img v-if="imagePreview" :src="imagePreview" alt="업로드된 이미지" class="image-preview">
        <button v-if="selectedFile" @click="removeImage" class="remove-btn">이미지 제거</button>
        <button @click="submitFile" :disabled="!selectedFile" class="submit-btn">제출</button>

        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>분석 중...</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'ocrDataParsed']);
const selectedFile = ref(null);
const imagePreview = ref(null);
const isLoading = ref(false); // 로딩 상태 추가

const close = () => {
    emit('close');
};

const resetDropArea = (e) => {
    const dropArea = e.currentTarget;
    dropArea.style.backgroundColor = "#fff";
};

const handleDrop = (e) => {
    e.preventDefault();
    if (selectedFile.value) return; // 이미 파일이 선택된 경우 더 이상 처리하지 않음
    resetDropArea(e);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image")) {
        displayImage(file);
        selectedFile.value = file;
    }
};

const triggerFileInput = () => {
    if (selectedFile.value) return; // 이미 파일이 선택된 경우 더 이상 처리하지 않음
    const fileInput = document.getElementById('file-input');
    fileInput.click();
};

const handleFileChange = (e) => {
    if (selectedFile.value) return; // 이미 파일이 선택된 경우 더 이상 처리하지 않음
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

const removeImage = () => {
    selectedFile.value = null;
    imagePreview.value = null;
    document.getElementById('file-input').value = ''; // 파일 입력 필드를 초기화하여 동일한 파일도 다시 선택 가능하게 함
};

const submitFile = async () => {
    if (!selectedFile.value) return;

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    isLoading.value = true; // 로딩 시작

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
    } finally {
        isLoading.value = false; // 로딩 종료
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

#drop-area.disabled {
    background-color: #f8f8f8;
    cursor: not-allowed;
}

.image-preview {
    margin: 10px auto;
    max-width: 100%;
    max-height: 200px;
    display: block;
}

.remove-btn {
    margin-top: 10px;
    background-color: #FF6B6B;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
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
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #000;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>