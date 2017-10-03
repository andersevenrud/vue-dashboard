<template>
  <div class="scrollable">
    <ul>
      <li v-for="message in data.result">
        <div class="subject"><span>{{ message.subject.join(', ') }}</span></div>
        <div class="age"><span>{{ message.date.map(age).join(', ') }}</span></div>
        <div class="to"><span>{{ message.to.join(', ') }}</span></div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  & > li {
    margin: 0;
    padding: 0;
    margin-bottom: .5em;
    position: relative;
    display: flex;

    & > div {
      & > span {
        display: inline-block;
        vertical-align: middle;
      }

      &.subject {
        flex: 0 1 auto;
      }

      &.age {
        flex: 1 0 auto;
        font-size: .8em;
        text-align: right;
        opacity: .5;
      }

      &.to {
        display: none;
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
        return moment(date).fromNow()
      }
    }
  }
</script>
