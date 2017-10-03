<template>
  <div>
    <div v-if="disconnected" class="disconnected">
      <span>Disconnected</span>
    </div>

    <ul :style="{'grid-template-columns': 'repeat(' + grid.cols + ', 1fr)', 'grid-template-rows': 'repeat(' + grid.rows + ', 1fr)'}">
      <li v-for="panel in panels" :data-position="panel.position" :style="{'grid-area': panel.position}" :data-name="panel.name">
        <div class="error" v-if="panel.data.error">
          <span>[{{ error(panel.name) }}]</span>
          <span>{{ error(panel.data.error) }}</span>
        </div>
        <component v-else :is="panel.component" :settings="panel.settings" :data="panel.data"></component>
      </li>
    </ul>
  </div>
</template>

<script>

import moment from 'moment';

export default {
  methods: {
    error(e) {
      if ( e instanceof Error || typeof e === 'string' ) {
        return e.toString();
      }
      return 'Unknown error';
    }
  },
  created() {
    this.$root.ws.on('heartbeat', () => {
      this.lastHeartbeat = moment();
    });

    setInterval(() => {
      const now = moment();
      const diff = now.diff(this.lastHeartbeat, 'seconds');
      this.disconnected = diff > 60;
    }, 1000);
  },
  data() {
    return {
      disconnected: false,
      grid: this.$root.grid,
      panels: this.$root.panels,
      lastHeartbeat: moment()
    }
  }
}
</script>
