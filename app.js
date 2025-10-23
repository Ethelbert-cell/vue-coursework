new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue Coursework!'
  },
  methods: {
    changeMessage: function() {
      this.message = 'You clicked the button!';
    }
  }
});