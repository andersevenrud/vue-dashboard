const child_process = require('child_process');

const exec = (cmd) => new Promise((resolve, reject) => {
  child_process.exec(cmd, {}, (error, stdout, stderr) => {
    return error ? reject(stderr) : resolve(stdout);
  });
});

module.exports = () => {
  return {
    poll: function(cfg) {
      return exec(cfg.command);
    },

    init: function(cfg, handler) {
      setInterval(() => {
        handler(this.poll, [cfg]);
      }, cfg.interval || (60 * 1000));

      return this.poll(cfg);
    }
  };
};
