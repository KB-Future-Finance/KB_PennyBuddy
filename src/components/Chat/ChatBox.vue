<template>
    <div class="speech-bubble" v-if="message">
        <h1>키키(KIKI)</h1>
        <div class="message">
            <span :class="message.role">{{ message.content }}</span>
        </div>
    </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
    name: 'ChatBox',
    props: {
        message: {
            type: Object,
            required: false,
            default: null
        }
    },
    setup(props) {
        const { message } = toRefs(props);
        return {
            message
        };
    }
});
</script>

<style scoped>
.speech-bubble {
    /* border : 1px solid red; */
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    padding: 15px;
    margin: 0 auto;

    background: #ffffff;
    border-radius: 10px;

    width: 90%;
    max-width: none;

    color: rgb(0, 0, 0);
    font-size: 14px;

    box-shadow: 5px 5px 10px rgb(221, 215, 202);

}

.speech-bubble::after {
    content: '';
    position: absolute;
    bottom: 0px;
    /* Adjust this value to move the tail */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #ffffff;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -10px;
}

.speech-bubble h1 {
    font-size: 16px;
    font-weight: 800;
}

.speech-bubble p {
    max-height: 130px;
    overflow-y: auto;
}
</style>