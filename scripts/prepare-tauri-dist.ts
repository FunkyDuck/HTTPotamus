// @ts-ignore
const fs = require('fs-extra');
// @ts-ignore
const path = require('path');

// @ts-ignore
const source = path.join(__dirname, "../dist/htt-potamus/browser");
const destination = path.join(__dirname, "../src-tauri/extra/browser");

fs.copySync(source, destination);
console.log("Frontend successfully copied to : src-tauri/extra/browser");