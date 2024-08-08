<template>
    <div class="backdrop" @click.self="close">
        <slot></slot>
    </div>
</template>

<script setup>
    import { defineEmits } from 'vue';
    const emit = defineEmits(['close']);
    const close = () => {
        emit('close');
    };
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
</style>
