<template>
<div>
    <b>- {{ foodName }}</b>
    <p>FoodItem.vue {{ foodDesc }}</p>
    </div>
</template>

<script>
export default {
    data(){ return {
        
    }},
    props: ['foodName','foodDesc']
   
}
</script>
