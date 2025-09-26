const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('window-minimize', () => {
  const target = BrowserWindow.getFocusedWindow() || win;
  if (target && !target.isDestroyed()) target.minimize();
});

ipcMain.on('window-maximize', () => {
  const target = BrowserWindow.getFocusedWindow() || win;
  if (target && !target.isDestroyed()) {
    if (target.isMaximized()) target.unmaximize();
    else target.maximize();
  }
});

ipcMain.on('window-close', () => {
  const target = BrowserWindow.getFocusedWindow() || win;
  if (target && !target.isDestroyed()) target.close();
});
