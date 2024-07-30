<script setup>
// import { RouterLink, RouterView } from 'vue-router'


</script>


<template>
  <!-- background -->
  <img alt="ground" class="ground" src="@/assets/background/ground3.png"/>
  
  <div class="flex-container">    
      
      <div class="router">
        <RouterView/>
      </div>
  </div>
</template>

<style scoped>

.flex-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 100vh;

  position:absolute;
  top:0;
  left:0;

  align-items:flex-start;

  /* border: 5px dotted green; */
}

.wrapper{
  width: 100%;
  /* border:5px solid yellow; */
}

.router{
  height: 100%;
  width:100%;
  /* border : 5px solid greenyellow */
}

.ground {
  /* 크기 설정 */
  width: 100%;
  min-width: 1300px;
  max-width: none;

  /* 위치 설정 */
  position:fixed;
  bottom: 0;
  left:50%;
  transform: translate(-50%, 10%);
  z-index: -1;
}

@media(max-width: 1050px){
  .router{
    height: auto;
    width:100%;
    /* border : 5px solid greenyellow */
  }
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
