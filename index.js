/*!
 * vue-dashboard
 * @license MIT
 * @author Anders Evenrud <andersevenrud@gmail.com>
 */
const server = require('./src/server.js');
const path = require('path');

const root = process.env.APP_ROOT || path.resolve(__dirname, 'dist');
const port = process.env.APP_PORT || 8000;

server.start(port, root);
