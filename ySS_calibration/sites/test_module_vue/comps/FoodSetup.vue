<template>
  <div v-on:click="countClicks">
    <b>With setup{{ name }}</b>  
    <p id="red">FoodSetup.vue You have clicked me {{ clicks }} times.</p>
  </div>
</template>

<script>

export default {

    setup(props, { expose } ){

        let ref = Vue.ref;
        
        const name = ref('Bannana');
        const clicks = ref(0);


        //expose( { name, clicks } );
        return { name, clicks };

    },    
    methods: {

        countClicks() {
            this.clicks++;
        }
    }  
    
}
</script>

<style>
  #red {
    font-weight: bold ;
    color: rgb(144, 12, 12);
  }
</style>