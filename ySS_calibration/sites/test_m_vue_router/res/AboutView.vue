<script>

//import useRoute  from '/yss/libs/vue-router.global.js';

export default {
  data(){

    const router = VueRouter.useRouter()
    const route = VueRouter.useRoute()
    
    const search = Vue.computed({
      get() {
        return route.query.search ?? ''
      },
      set(search) {
        //console.log('set',router);
        router.replace({ query: { search } })
      }
    });

    return { router, route, search};
  }
}
</script>

<template>
  <h2>AboutView</h2>
  <label>
    Search: <input v-model.trim="search" maxlength="20">
  </label>
</template>