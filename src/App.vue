<template>
  <div>
    <Test></Test>
  </div>
</template>

<script>
import Test from './components/Test'
export default {
  name: 'App',
  components: {
    Test
  },
  data() {
    return {
      count: 0
    }
  },
  // computed: {
  //   now() {
  //     // when other data change trigger re-render it will not change
  //     return Date.now()
  //   }
  // },
  mounted() {
    this.counter()
  },
  methods: {
    counter() {
      setTimeout(() => {
        this.count++
        console.log('par c ', this.count)
        this.counter()
      }, 1000);
    },

  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
