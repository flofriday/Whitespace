const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', (testvariable) =>
{
  let win = new BrowserWindow({width: 800, heigth: 600,icon: `file://${__dirname}/res/logo256.png`});
  win.loadURL(`file://${__dirname}/index.html`);
  win.setMenu(null);
  console.log(" __        ___     _ _");
  console.log(" \\ \\      / / |__ (_) |_ ___  ___ _ __   __ _  ___ ___ ");
  console.log("  \\ \\ /\\ / /| '_ \\| | __/ _ \\/ __| '_ \\ / _` |/ __/ _ \\");
  console.log("   \\ V  V / | | | | | ||  __/\\__ \\ |_) | (_| | (_|  __/");
  console.log("    \\_/\\_/  |_| |_|_|\\__\\___||___/ .__/ \\__,_|\\___\\___|");
  console.log("                                 |_|");
  //win.webContents.openDevTools();
})
