const openweathermap = require('openweathermap');

module.exports = () => {
  return {
    poll: function(cfg) {
      return new Promise((resolve, reject) => {
        try {
          openweathermap.now({
            appid: cfg.key,
            units: cfg.units || 'metric',
            lang: cfg.lang || 'en',
            q: cfg.location
          }, (error, result) => {
            if ( error ) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        } catch ( e ) {
          console.warn(e);

          reject(e);
        }
      });
    },

    init: function(cfg, handler) {
      setInterval(() => {
        handler(this.poll, [cfg]);
      }, (60 * 1000) * 60);

      return this.poll(cfg);
    }
  };
};
