import Vue from 'vue'
import HelloWorld from './HelloWorld.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<HelloWorld/>',
  components: { HelloWorld }
})
