const iconGen = require('icon-gen');
const path = require('path');
const fs = require('fs');

const source = path.resolve(__dirname, '../src/assets/logo/logo-v1.svg');
const output = path.resolve(__dirname, '../src-tauri/icons');

console.log('START')

if(!fs.existsSync(output)){
    fs.mkdirSync(output, { recursive: true });
    console.log('Created directory : ', output);
} else {
    console.log(`Directory ${output} exist : SKIPPIN'`)
}

iconGen(source, output, {
    report: true,
    types: ['ico', 'icns', 'png'],
    destination: [output],
    ico: {
        sizes: [16, 24, 32, 48, 64, 128, 256]
    },
    icns: {
        sizes: [16, 32, 64, 128, 256, 512, 1024]
    },
    png: {
        sizes: [32, 128, 256, 512, 1024]
    }
}).then(() => {
    console.log('Icons generated successfully!');
}).catch((err: any) => {
    console.info('PATH / ', output)
    console.error('Failed to generate icons : ', err)

});