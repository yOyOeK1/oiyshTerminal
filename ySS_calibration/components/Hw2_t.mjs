
export default {
  props:{
    msg: String
  },
  template: `  <h2>Hw2 Component! {{ msg || 'not set msg / prop'}}</h2>`
}
