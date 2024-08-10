<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <div class="container">
    <!-- 주제 버튼 -->
    <div class="radio">
      <label for="chat" class="radio">
        <input type="radio" name="topic" id="chat" value="1" checked/>
        <span class="label"> 대화하기</span>
      </label>
      <label for="viewSpend" class="radio">
        <input type="radio" name="topic" id="viewSpend" value="2"/>
        <span class="label"> 거래내역 조회하기 </span>
      </label>
    </div>

    <!-- 대화 입력 -->
    <div class="input">
      <span class="material-symbols-rounded icon">sms</span>
      <input v-model="userInput" type="text" @keypress.enter="sendMessage">
      
      <button type="button" @click="sendMessage">
        <span class="material-symbols-rounded icon">arrow_back</span>
      </button>
    </div>
  </div>
  
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'InputChat',
  setup(_, { emit }) {
    const userInput = ref('');

    const sendMessage = async () => {
      if (userInput.value.trim() !== '') {
        const message = userInput.value;
        emit('send-message', message);

        try {
          const response = await fetch('http://localhost:5000/analyze-and-execute/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              question: message
            })
          });
            
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let partialMessage = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const decodedValue = decoder.decode(value, { stream: true });
            partialMessage += decodedValue;
            emit('receive-message', { role: 'bot', content: partialMessage });
          }
        } catch (error) {
          console.error('Error sending message:', error);
          emit('receive-message', { role: 'bot', content: 'Error occurred while processing your message.' });
        }

        userInput.value = '';
      }
    };

    return {
      userInput,
      sendMessage
    };
  }
});
</script>

<style scoped>
.container{
  /* border: 1px solid red; */

  width:100vw;

  position: fixed;
  left:0;
  bottom : 18px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 30vw;
  padding: 15px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 100px;
  border: 2px solid rgb(39, 30, 30);

  display: flex;
  justify-content: space-around;
  align-items: stretch;
}

.radio>label{
  padding:0px 10px;
}

[type="radio"], span {
    vertical-align: middle;
}

[type="radio"] {
    appearance: none;
    border: max(2px, 0.1em) solid gray;
    border-radius: 50%;
    width: 1.25em;
    height: 1.25em;
    transition: border 0.1s ease-in-out;
    margin-right: 0.5em;
    display: inline-block;
}

[type="radio"]:checked {
    border: 0.4em solid #FFC85E;
}

[type="radio"]:hover {
    box-shadow: 0 0 0 max(4px, 0.2em) lightgray;
    cursor: pointer;
}

[type='text'] {
  width: 80%;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
}

button {
  background-color: white;
  border: none;
  outline: none;
  cursor: pointer;
}

.material-symbols-rounded {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: #000000;
  font-size: 25px !important;
  margin: auto;
}

@media(max-width: 1050px) {
  .input {
    width: 80vw;
  }
}
</style>