<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    
    <nav>
        <span class="material-symbols-rounded icon" @click="refreshPage">sync</span>
        <RouterLink to="/style"><span class="material-symbols-rounded icon">checkroom</span></RouterLink>
        <RouterLink to="/main"><span class="material-symbols-rounded icon">home</span></RouterLink>
        <RouterLink to="/"><span class="material-symbols-rounded icon">logout</span></RouterLink>
    </nav>
</template>

<style scoped>
.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    color: #FFAC0C;
    font-size: 35px !important;
    margin: 10px;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 50%;
    padding: 10px;
}

.material-symbols-rounded.icon:hover {
    background-color: #FFAC0C;
    color: white;
}
</style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

const refreshPage =() => {
    window.location.reload();
}
</script>
