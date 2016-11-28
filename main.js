const electron = require('electron');
const {app, BrowserWindow} = electron;



app.on('ready', () =>
{
  //generate a bigger window for testing because the Chrome DevTools waste a lot of space
  if (process.argv[2] === '--test')
  {
    var conf = {width: 1400, heigth: 600, icon: `file://${__dirname}/res/logo256.p`};
    console.log("Starting Whitespace with Chrome DevTools.");
  }
  else
  {
    var conf= {width: 1000, heigth: 600, icon: `file://${__dirname}/res/logo256.p`};
  }

  //spawn the browser window
  win = new BrowserWindow(conf);
  if (process.argv[2] === '--test'){win.openDevTools();}  //Open Chrome DevTools for testing
  win.setMenu(null);  //Disable the menu
  win.loadURL(`file://${__dirname}/app/index.html`);  //Load html

  //write Whitespace in some fancy letters for the CLI users
  console.log(" __        ___     _ _");
  console.log(" \\ \\      / / |__ (_) |_ ___  ___ _ __   __ _  ___ ___ ");
  console.log("  \\ \\ /\\ / /| '_ \\| | __/ _ \\/ __| '_ \\ / _` |/ __/ _ \\");
  console.log("   \\ V  V / | | | | | ||  __/\\__ \\ |_) | (_| | (_|  __/");
  console.log("    \\_/\\_/  |_| |_|_|\\__\\___||___/ .__/ \\__,_|\\___\\___|");
  console.log("                                 |_|\n");
});


/*
* Exit the app if all windows are closed by the user
*/
app.on('window-all-closed', () => {
    console.log("All windows closed, exit Whitespace.");
    app.quit();
});
