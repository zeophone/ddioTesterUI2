<template>
  <div class="main-header">
    <img :src="baseLogo" alt="">
      <h2 class="title">
      {{Title?Title:baseTitle}}
      </h2>        
      <h2>
        {{Describe?Describe:baseDescribe}}
      </h2>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'MainHeader',
  data () {
    return {
    }
  },
  props:{
    Title: [String],
    Describe: [String]
  },
  computed: {
    ...mapState([
      'baseLogo','baseTitle','baseDescribe'
    ])
},
created() {
    document.title=this.Describe?this.Describe:this.baseDescribe
},
}
</script>