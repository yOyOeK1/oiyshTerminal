<script setup>
function OtcHello(){
  return Vue.createApp({

    data(){
      let cc = new otCl('vvaHello');
      const cl = function(){cc.doClFromArgs( arguments );  };
      const msg = 0;
      return {
        msg,
        'cl' : cl
      }
    },
    //'template': `<div>He<b>ll</b>o<b>.vue</b> vvaHello uuuu aaaa msg:{{msg}}</div>`,
    created(){
      this.cl("created","VUE");
      pager.getCurrentPage().vvaHello_obj = this;
    }
  });
  
}

</script>


<template>
  <div>He<b>ll</b>o<b>.vue</b> ignored! vvaHello.vue msg:{{msg}}</div>
  <button @click="msg++">msg add 1</button>
</template>
