<script setup>

import { computed, ref } from 'vue'

import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

import OtvNotFound from './components/OtvNotFound.vue'
import OtvHome from './components/OtvHome.vue'


import OtvPlayground from './components/OtvPlayground.vue'
import OtvTestJQMobile from './components/OtvTestJQMobile.vue'
import OtvFastDos from './components/OtvFastDos.vue'


//import 'yBlank' from './assets/ySS_calibration/sites/blank/s_blankPage.js'

// router section ----- start
const routes = {
  '/': OtvHome,
  '/PlayGround': OtvPlayground,
  '/OtvTestJQMobile': OtvTestJQMobile,
  '/OtvFastDos': OtvFastDos

}
const pathUrls = Object.keys(routes)
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || OtvNotFound
})
// router section ---- end

function cl(m){
  console.log("App:", m)
}
cl("hello console")
cl(Object.keys(routes))


function gotoUrl( url ){
  cl("got go to URL");cl(url);
  window.location.href = url;

}

</script>

<template>
  <header>
    <div>
      <div style="display:inline;" v-for="pathUrl in pathUrls">
        <button @click="gotoUrl( '/#'+pathUrl )"
          >{{pathUrl}}</button>
      </div>
      <div style="display:inline;">
        <button @click="gotoUrl('/aH')">/aH</button>
      </div>
    </div>

    <!--
    <HelloWorld msg="OTV3 - vue / vite 3" />
    <img alt="oiyshTerminal logo" class="logo" src="./assets/ySS_calibration/images/otWorld1_640_320.png" width="256" />
    -->
    <!--
    <div class="wrapper">
      <HelloWorld msg="You did it!777" />
    </div>
  -->
  </header>

  <main>
    <component :is="currentView" />
    <ul>
      <!-- router section --- start -->
      <!--
      <li>
        <b>some experiments with extracting paths / current</b>
        [[{{currentPath}}]]
      </li>
      <li>
        <h2>otv - Routing</h2>
        <a href="#/">Home</a> |
        <a href="#/OtvFastDos">FastDos</a> |
        <a href="#/Ot">About</a> |
        <a href="#/non-existent-path">Broken Link</a>
      </li>
      -->
      <!-- router section --- end -->


      <!-- moved to OtvFastDos.vue
      <li>
        <h2>otv-fast-dos</h2>
        <p>
          <OtcFastDo titleit="ping" sapi="ping/.json" host="192.168.43.220" port="1990" useprot="http" />
          <OtcFastDo titleit="help" sapi="help/.json" host="192.168.43.220" port="1990" useprot="http" />
          <OtcFastDo titleit="ver" sapi="ver/.json" host="192.168.43.220" port="1990" useprot="http" />


        </p>
      </li>
      -->
    </ul>

    <!--
    <TheWelcome />
    -->
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
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
}
</style>
