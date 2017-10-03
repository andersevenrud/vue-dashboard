/*!
 * vue-dashboard
 * @license MIT
 * @author Anders Evenrud <andersevenrud@gmail.com>
 */
const Promise = require('bluebird');
const fs = require('fs-extra');
const express = require('express');
const path = require('path');
const sio = require('socket.io');

// Constants
const ROOT = path.dirname(__dirname);
const IS_PRODUCTION = String(process.env.NODE_ENV).match(/^prod/i);
if ( !IS_PRODUCTION && !process.env.DEBUG ) {
  process.env.DEBUG = 'http,ws,panels';
}

const debug = require('debug');
const log = {
  panels: debug('panels'),
  http: debug('http'),
  ws: debug('ws')
};

/*
 * Panel Abstraction
 */
class Panel {
  /**
   * @param {Number} index Panel index
   * @param {String} name Panel name
   * @param {Object} options Panel options
   */
  constructor(index, name, options) {
    this.index = index;
    this.name = name;
    this.options = options;
    this.module = require(path.resolve(ROOT, `src/panels/${name}/index.js`))();
    this.busy = false;
    this.socket = null;
    this.lastData = {error: null, result: null};
  }

  /**
   * Emits our data
   * @param {Socket} ws A socket connection
   */
  emit(ws) {
    if ( !ws ) {
      console.warn('No socket to emit to', this.index, this.name);
      return;
    }

    ws.emit('update', {
      index: this.index,
      data: this.lastData
    });
  }

  /**
   * Sets our panel data
   * @param {Promise} promise A promise that resolves data
   * @param {Function} cb A function for finally()
   */
  setData(promise, cb) {
    const setResult = (error, result = null) => {
      this.lastData = {error, result};
    };

    Promise.resolve(promise)
      .then((result) => setResult(null, result))
      .catch((error) => setResult(error))
      .finally(cb);
  }

  /**
   * Initializes our panel
   * @return {Promise<Error, Object>}
   */
  init() {
    return new Promise((resolve) => {
      const promise = this.module.init(this.options, (fn, args) => {
        if ( this.busy ) {
          return;
        }

        this.busy = true;

        this.setData(fn.apply(fn, args), () => {
          this.emit(this.socket);
          this.busy = false;
        });
      });

      this.setData(promise, () => resolve());
    });
  }

  /**
   * Registers broadcaster socket
   * @param {Server} socket Our socket
   */
  register(socket) {
    log.panels('register', this.name, !!socket);
    this.socket = socket;
  }
}

/*
 * Starts all the panels
 */
const startPanels = () => {
  const panelFile = path.resolve(ROOT, 'panels.json');
  return new Promise((resolve, reject) => {
    fs.readJson(panelFile).then((cfg) => {
      const panels = cfg.map((i, idx) => new Panel(idx, i.name, i.options));
      Promise.map(panels, (p) => p.init())
        .then(() => resolve(panels))
        .catch(reject);
    }).catch(reject);
  });
};

/*
 * Start HTTP and WS server
 */
const startServer = (panels, port, root) => {
  const app = express();
  const htmlFile = path.resolve(root, 'index.html');

  // Host our SPA
  app.use(express.static(root));
  app.get('/', (req, res) => {
    res.sendFile(htmlFile);
  });

  const server = app.listen(port, () => log.http('Listening on %d', port));
  const io = sio(server);

  // Add broadcasting
  panels.forEach((p) => p.register(io));

  // Accept websockets
  io.on('connection', (ws) => {
    log.ws('Connected client');

    let connected = true;
    let heartbeat = setInterval(() => {
      if ( connected ) {
        ws.emit('heartbeat');
      }
    }, 2000);

    ws.on('disconnect', () => {
      log.ws('Closed client');

      heartbeat = clearInterval(heartbeat);
      connected = false;
    });

    // Make sure to emit data from init so client immediately
    // updates
    panels.forEach((p) => p.emit(ws));
  });

  return app;
};

module.exports.start = (port, root) => {
  startPanels().then((panels) => {
    startServer(panels, port, root);
  }).catch((e) => console.error(e));
};
