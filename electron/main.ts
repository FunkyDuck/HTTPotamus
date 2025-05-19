import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow | null = null;

function createWindow(): void {
    win = new BrowserWindow({
        width: 1200,//window.screen.width,
        height: 800,//window.screen.height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '../dist/htt-potamus/browser/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(win === null) {
        createWindow();
    }
});