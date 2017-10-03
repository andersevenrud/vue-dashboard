<template>
  <div>
    <ul>
      <li v-for="issue in data.result">
        <a target="_blank" :href="issue.web_url">#{{ issue.iid }} - {{ issue.title }} <span>{{ age(issue.updated_at) }}</span></a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;

  & > li {
    margin: 0;
    padding: 0;
    line-height: 1.5;

    & > a {
      & > span {
        opacity: .5;
      }
    }
  }
}
</style>

<script>
import moment from 'moment';

export default {
  props: ['settings', 'data'],
  methods: {
    age(date) {
      return moment(date).fromNow();
    }
  }
}
</script>
