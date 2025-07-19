
let FoodItem = new Vue.defineComponent({
    data(){ return {
        
    }},
    props: ['foodName','foodDesc'],
    template: `
    <div>
        <b>- {{ foodName }}</b>
        <p>FoodItem.js {{ foodDesc }}</p>
    </div>
    `,

});
export { FoodItem };
