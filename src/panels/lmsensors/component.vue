<template>
  <div>
    <span v-if="data.result">{{ settings.title }}: {{ data.result.value }} {{ unit(data.result.type) }}</span>
    <chartist v-if="data.result && data.result.chart"
      type="Line"
      ratio="ct-major-second"
      :data="data.result.chart"
      :options="options">
    </chartist>
  </div>
</template>

<style lang="scss">
li[data-name="lmsensors"] {
  & > div {
    position: relative;

    & > span {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      text-align: center;
      z-index: 2;
      font-size: 1em;
      letter-spacing: 2px;
    }

    & > div {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;

      & > svg {
        height: calc(100% - 2em) !important;
        margin-top: 2em;
      }
    }

    .ct-line {
      stroke: rgba(255, 255, 255, .8);
    }
    .ct-grid {
      stroke: rgba(255, 255, 255, .2);
    }
  }
}
</style>

<script>
import Vue from 'vue';
import Chartist from 'chartist';
import VueChartist from 'vue-chartist';

Vue.use(VueChartist);
require('chartist/dist/chartist.min.css');

export default {
  props: ['settings', 'data'],
  methods: {
    unit(type) {
      const map = {fan:  'rpm', temp: '°C'};
      return map[type];
    }
  },
  data() {
    return {
      options: {
        lineSmooth: Chartist.Interpolation.step(),
        showLabel: false,
        showPoint: false,
        fullWidth: true,
        chartPadding: 0,
        axisX: {
          showGrid: false,
          showLabel: false,
          offset: 0
        },
        axisY: {
          showGrid: true,
          showLabel: false,
          offset: 0
        },
      }
    }
  }
}
</script>
