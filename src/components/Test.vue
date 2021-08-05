<template>
  <div class="page">
    <div class="ban">
      <p>{{ now }}</p>
      <p>{{ nowFn() }}</p>
      <!-- <p>{{count}}</p> -->
      <p>{{ msg }}</p>
    </div>
    <div class="con">
      <div class="block">
        <p>
          Most mobile devices have a delay in updating the background position
          after scrolling a page with fixed backgrounds.
        </p>

        <ul>
          <li>1. Partial support refers to supporting fixed but not local</li>
          <li>2. Partial support refers to supporting local but not fixed</li>
          <li>
            3. Only supports local when -webkit-overflow-scrolling: touch is not
            used
          </li>
          <li>
            4. Does not support fixed, and due to a bug only supports local if a
            border-radius is set on the element.
          </li>
          <li>
            5. Broken support of fixed and local when scrolling an outer scroll
            container. Related to a bug.
          </li>
        </ul>
      </div>
    </div>
    <div class="ht">Notes</div>
    <div class="box">
      <p>
          Most mobile devices have a delay in updating the background position
          after scrolling a page with fixed backgrounds.
        </p>
        <p>this is another one</p>
    </div>
    <div class="ht">Notes</div>
  </div>
</template>

<script>
export default {
  name: "Test",
  // props: ['count'],
  data() {
    return {
      msg: "hp",
      count: 1000,
    };
  },
  computed: {
    now() {
      // when other (data or props) change trigger re-render it will not change
      return Date.now();
    },
  },
  mounted() {
    this.counter();
  },
  methods: {
    nowFn() {
      // when other (data or props) change trigger re-render it will change
      // diff:  props once changed (只要父组件传了，不管这里用不用) whether that prop used in template, it will change
      //        data once changed only when the data used in template (只有视图要更新时), it will change
      return Date.now();
    },
    counter() {
      setTimeout(() => {
        this.count++;
        console.log(this.count);
        this.msg = "asdfsf";
        // this.nowFn()
        this.counter();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.page {
  // position: relative;
}
.ban {
  height: 600px;
  background: gray;
}
.con {
  height: 500px;
  // background-image: url("../assets/Castel_del_Monte.jpeg");
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: top center;
  // background-attachment: fixed;
  // transform: translateZ(0);
  &:before {
    content: " ";
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 500px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url("../assets/Castel_del_Monte.jpeg") center 0 no-repeat;
    background-size: cover;
  }
  .block {
    padding: 50px;
    line-height: 2;
  }
}
.ht {
  padding-top: 30px;
  background: #fff;
  height: 600px;
}
.box {
  &:before {
    content: " ";
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 300px;
    top: 0;
    right: 0;
    // bottom: 0;
    left: 0;
    background: url("../assets/bg.png") center 0 no-repeat;
    background-size: cover;
  }
}
</style>