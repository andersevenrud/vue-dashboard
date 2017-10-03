const Gitlab = require('gitlab');

module.exports = () => {
  let client;

  return {
    poll: function(cfg) {
      return new Promise((resolve, reject) => {
        try {
          client.issues.all({
            order_by: 'updated_at',
            state: 'opened',
            sort: 'desc'
          }, resolve);
        } catch ( e ) {
          console.warn(e);
          reject(e);
        }
      });
    },

    init: function(cfg, handler) {
      client = new Gitlab(cfg);

      setInterval(() => {
        handler(this.poll, [cfg]);
      }, (60 * 1000));

      return this.poll(cfg);
    }
  };
};
