// @ts-ignore
const { writeFileSync } = require('fs');
// @ts-ignore
const { version } = require('../package.json');

writeFileSync(
    './src/version.ts',
    `export const appVersion = '${version}';\n`
);