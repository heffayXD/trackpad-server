import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { onStartServer, onStopServer, onCheckServer } from './ipc/server'
import Server from './classes/Server'

const dev = process.env.NODE_ENV === 'development'
const server = new Server()
let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    minWidth: 400,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

ipcMain.on('start-server-message', (event, params) => onStartServer(app, server, event, params))
ipcMain.on('stop-server-message', (event, params) => onStopServer(app, server, event, params))
ipcMain.on('check-server-message', (event, params) => onCheckServer(app, server, event, params))
