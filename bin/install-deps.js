#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const paneldir = path.resolve(process.cwd(), 'src/panels');
const subfolders = fs.readdirSync(paneldir)
  .filter(subfolder => fs.statSync(path.join(paneldir, subfolder)).isDirectory())
  .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
  .map(subfolder => path.join(paneldir, subfolder));

subfolders.forEach((subfolder) => {
  const cwd = path.resolve(process.cwd(), 'src/panels', subfolder);
  if ( fs.existsSync(path.resolve(cwd, 'package.json')) ) {
    console.log('Installing panel dependencies for', cwd);

    child_process.execSync('npm install', {
      cwd: cwd,
      env: process.env,
      stdio: 'inherit'
    });
  }
});
