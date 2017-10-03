<template>
  <div class="scrollable">
    <pre>{{ data.result }}</pre>
  </div>
</template>

<style lang="scss" scoped>
pre {
  font-size: .8em;
  font-family: monospace;
  line-height: 1.2;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>

<script>
  export default {
    props: ['settings', 'data']
  }
</script>
