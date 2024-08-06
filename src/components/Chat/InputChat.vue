<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <div class="input">
        <span class="material-symbols-rounded icon">sms</span>
        <input type="text">
        <button type="button">
            <span class="material-symbols-rounded icon">arrow_back</span>
        </button>
    </div>
</template>

<style scoped>

.input{
    width:30vw;
    padding: 15px;
    margin: 0 auto;

    background: #ffffff;
    border-radius: 100px;
    border: 2px solid rgb(39, 30, 30);

    position:fixed;
    bottom:20px;
    left:1px;
    right:1px;

    display: flex;
    justify-content: space-around;
    align-items: stretch;
}

input{
    width:80%;
    border: none;
    outline: none;
    font-size: 18px;
    font-weight:600;
}

button{
    background-color: white;
    border: none;
    outline: none;
    cursor:pointer;
}

.material-symbols-rounded {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    color: #000000;
    font-size: 25px !important;

    margin:auto;
}

@media(max-width: 1050px){
        .input{
            width: 80vw;
        }
    }

</style>

<script setup>

</script>