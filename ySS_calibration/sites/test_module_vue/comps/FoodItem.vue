export default {
    props: ['foodName','foodDesc'],
    //data(){ return {

    //}},
    template: `<div>
        <b>
            {{ foodName }}
        </b>
        <p>FoodItem.vue: {{ foodDesc }}</p>
    </div>`

};
