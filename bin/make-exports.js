#!/usr/bin/env node
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs-extra');

const ROOT = path.dirname(__dirname);

const template = `
// THIS FILE WAS AUTO-GENERATED. CHANGES WILL BE OVERWRITTEN!
export default [%PANELS%];
`;

const readConfig = () => new Promise((resolve, reject) => {
  const panelFile = path.resolve(ROOT, 'panels.json');

  fs.readJson(panelFile).then(resolve).catch(() => {
    console.warn('Failed to read', panelFile);
    resolve({});
  });
});

const generateFile = (cfg, type) => {
  const panels = cfg.map((p) => {
    const settings = JSON.stringify(p.settings);

    return `{
        name: '${p.name}',
        position: '${p.position}',
        configuration: ${settings},
        component: require('${ROOT}/src/panels/${p.name}/component.vue')
}`;
  }).join(',\n');

  return template.replace('%PANELS%', panels);
};

readConfig().then((cfg) => {
  const dest = path.resolve(ROOT, 'src/panels/index.js');

  fs.writeFileSync(dest, generateFile(cfg));
});
