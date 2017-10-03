<template>
  <div>
    <ul v-if="data.result && data.result.weather">
      <li class="time">{{time}}</li>
      <li class="date">{{ data.result.name }}, {{date}}</li>
      <li class="weater">
        <div v-for="weather in data.result.weather">
          <i :class="'owi owi-' + weather.icon"></i>
        </div>
      </li>
    </ul>
    <div v-else>
      <p>
        No weather data available.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
@import '~open-weather-icons/dist/css/open-weather-icons.css';

li[data-name="today"] {
  min-height: 20em;

  & > div {
    text-align: center;

    p {
      margin: 0;
      padding: 0;
    }

    i.owi {
      font-size: 10em;
    }

    & > ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      & > li {
        margin: 0;
        padding: 0;
        flex: 1;

        &.time {
          font-size: 4em;
          letter-spacing: 4px;
        }
        &.date {
          font-size: 1em;
        }
      }
    }
  }
}
</style>

<script>
import moment from 'moment';

export default {
  props: ['settings', 'data'],

  data() {
    return this.getTimes();
  },

  created() {
    setInterval(() => {
      const times = this.getTimes();
      Object.keys(times).forEach((k) => (this[k] = times[k]));
    }, 10000);
  },

  methods: {
    getTimes() {
      return {
        time: moment().format(this.settings.time),
        date: moment().format(this.settings.date)
      };
    }
  }
}
</script>
