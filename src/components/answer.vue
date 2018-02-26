<style scoped>
  .list-item {
    border-bottom: 1px solid #f6f6f6;
    margin: 0 20px;
    padding: 20px 0;
  }
</style>

<template>
  <div class="list-item">
    <h3>
      <router-link  :to="{ name: 'kb', params: { id: hit._id }}">
        <template v-if="hit.highlight.title">
          <span v-html=hit.highlight.title[0]></span>
        </template>
        <template v-else>{{hit._source.title}}</template>
      </router-link>
    </h3>
    <template v-if="hit.highlight.text">
      <p><span v-html=hit.highlight.text[0]></span></p>
    </template>
      <p v-else><span v-html=hit._source.text.substring(0,100)></span></p>
    <!--<Show :doc={}></Show>-->
  </div>
</template>

<script>
  import Show from '../components/show'

  export default {
    name: "answer",
    props: ['hit'],
    components: {
      Show,
    },
  }
</script>

