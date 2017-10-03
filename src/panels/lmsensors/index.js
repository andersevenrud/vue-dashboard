const moment = require('moment');
const sensors = require('lm_sensors.js');

const BUFFER_SIZE = 50;

module.exports = () => {
  let current = 0;
  let type = '';
  let buffer = Array.from(Array(BUFFER_SIZE), (a, i) => {
    return {date: moment().subtract(i + 1, 'seconds'), value: 0};
  });

  function push(date, sensor, value) {
    current = value;
    type = sensor;

    buffer.push({date, value});
    buffer.splice(0, buffer.length - BUFFER_SIZE);
  }

  function get() {
    return {
      value: current,
      type: type,
      chart: {
        labels: buffer.map(b => b.date),
        series: [buffer.map(b => b.value)]
      }
    };
  }

  return {
    poll: function(cfg) {
      return new Promise((resolve, reject) => {
        sensors.sensors().then((result) => {
          const data = result[cfg.adapter].sensors[cfg.sensor];
          return push(moment(), data.sensor, data.input);
        }).catch(reject);
      });
    },

    init: function(cfg, handler) {
      setInterval(() => {
        //handler(this.poll, [cfg]);
        handler(() => Promise.resolve(get()), []);
      }, 5000);

      setInterval(() => this.poll(cfg), 1000);

      return Promise.resolve(get());
    }
  };
};
