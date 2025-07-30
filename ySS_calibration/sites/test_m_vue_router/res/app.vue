<template>
  <h1>Hello App!</h1>
  <p>it use vue-router vite test 2</p>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav id="menuRouteT">
    <RouterLink to="/">Go to Home</RouterLink> | 
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style>
#menuRouteT .router-link-active{
  color: orange;
  font-weight: bold;
}

</style>