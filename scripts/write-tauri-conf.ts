// @ts-ignore
const { writeFileSync } = require('fs');
const { join } = require('path');
// @ts-ignore
const { version } = require('../package.json');

const config = {
  "$schema": "../node_modules/@tauri-apps/cli/config.schema.json",
  "productName": "HTTPotamus",
  "version": version,
  "identifier": "be.funkyduck.httpotamus",
  "build": {
    "frontendDist": "../dist/htt-potamus/browser",
    "devUrl": "http://localhost:7500",
    "beforeDevCommand": "pnpm start",
    "beforeBuildCommand": "pnpm build"
  },
  "app": {
    "windows": [
      {
        "title": "HTTPotamus",
        "width": 1280,
        "height": 720,
        "resizable": true
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": ["nsis"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "windows": {
      "webviewInstallMode": {
        "type": "offlineInstaller"
      }
    },
  }
};

const outputPath = join(__dirname, '../src-tauri/tauri.conf.json');
writeFileSync(outputPath, JSON.stringify(config, null, 2));
console.log(`tauri.conf.json written to ${outputPath}`);
