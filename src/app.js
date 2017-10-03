/*!
 * vue-dashboard
 * @license MIT
 * @author Anders Evenrud <andersevenrud@gmail.com>
 */
import WebSocketClient from 'socket.io-client';
import Vue from 'vue';
import Dashboard from './components/Dashboard.vue';
import panels from './panels/index.js';

// Register Vue components
Vue.component('dashboard', Dashboard);
panels.forEach((p) => {
  Vue.component('panel-' + p.name, p.component.default);
});

// Add livereload in debug mode
if ( !PRODUCTION ) {
  const el = document.createElement('script');
  el.src = `//${window.location.hostname}:35729/livereload.js`;
  document.body.appendChild(el);
}

let maxCols = 1;
let maxRows = 1;

const getPosition = (position) => {
  // Kudos: https://github.com/spatie/dashboard.spatie.be/blob/61531651d982e70d0f385ea160f0bfc13a802aec/resources/assets/js/helpers.js
  function indexInAlphabet(character) {
    const index = character.toLowerCase().charCodeAt(0) - 96;
    return index < 1 ? 1 : index;
  }

  const [from, to = null] = position.toLowerCase().split(':');

  if (from.length !== 2 || (to && to.length !== 2)) {
    return null;
  }

  const areaFrom = `${from[1]} / ${indexInAlphabet(from[0])}`;
  const area = to ? `${areaFrom} / ${Number(to[1]) + 1} / ${indexInAlphabet(to[0]) + 1}` : areaFrom;

  maxRows = to ? Math.max(maxRows, Number(to[1]) + 1) : Math.max(maxRows, from[1]);
  maxCols = to ? Math.max(maxCols, indexInAlphabet(to[0]) + 1) : Math.max(maxCols, indexInAlphabet(from[0]));

  return area;
};

const createApp = () => new Vue({
  el: '#dashboard',
  template: '<dashboard></dashboard>',

  data() {
    const list = panels.map((p, index) => {
      return {
        index,
        name: p.name,
        component: 'panel-' + p.name,
        position: getPosition(p.position),
        settings: p.configuration,
        data: {error: null, result: null}
      };
    });

    return {
      grid: {
        rows: maxRows - 1,
        cols: maxCols - 1
      },
      panels: list
    };
  },

  mounted() {
    console.debug('Panels', panels);
    document.body.classList.add('navy');
  },

  created() {
    this.ws = new WebSocketClient(window.location.origin);

    this.ws.on('open', () => {
      console.log('Opened connection');
    });

    this.ws.on('update', (update) => {
      console.log('Update', update);
      this.panels[update.index].data = update.data;
    });

    this.ws.on('debug', (a) => {
      console.info('Debug', a);
    });

    this.ws.on('error', (error) => {
      console.error(error);
    });
  }
});

// Construct our Vue application
createApp();
