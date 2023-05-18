<script setup>
function HelloWorld(){
  return Vue.createApp({
    props:{
      msg: {
        type: String,
        required: true
      }
    }
  });
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      This is a
      <a href="https://github.com/yOyOeK1/oiyshTerminal" target="_blank" rel="noopener">
        oiyshTerminal
      </a>.<br>
      Served by vue / vide
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
