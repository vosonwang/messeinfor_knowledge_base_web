<style>
  @import '../style/mavon.less';
</style>

<template>
  <mavon-editor default_open="preview" :value=this.doc.text :toolbarsFlag="false" :external_link="external_link"
                :subfield="false"></mavon-editor>
</template>

<script>
  import el from '../util/mavon'
  import {mavonEditor} from 'mavon-editor'
  //import {mapState} from 'vuex'


  export default {
    name: "show",
    props:['doc'],
    components:{
      mavonEditor,
    },
    data() {
      return {
        external_link: el
      }
    },
    // computed: {
    //   ...mapState({
    //     'doc': state => state.doc,
    //   }),
    // },

  }
</script>

