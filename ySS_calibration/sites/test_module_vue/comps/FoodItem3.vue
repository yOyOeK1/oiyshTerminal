
export default {
  data() {
    return {
      name: 'Apples',
      message: 'I like apples',
      clicks: 0
    }
  },
  methods: {
    countClicks() {
      this.clicks++;
    }
  }
}


