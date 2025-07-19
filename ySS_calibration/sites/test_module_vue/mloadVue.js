


function mloadVue( lm ){
    const sfcContent = `
      <template>
        Hello World !
      </template>
    `;
    /* --> */

    const options = {
      moduleCache: {
        vue: Vue,
      },
      getFile(url) {

        if ( url === '/myComponent.vue' )
          return Promise.resolve(sfcContent);
      },
      addStyle() { /* unused here */ },
    }

    
    return Vue.createApp(Vue.defineAsyncComponent(() => lm('/myComponent.vue', options))).mount(document.body);

}

export { mloadVue };