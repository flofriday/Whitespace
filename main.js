/*
* include some node modules
*/
const electron = require('electron');
const {app, BrowserWindow} = electron;
const os = require('os');
const ipc = require('electron').ipcMain;



/*
* Write Whitespace in some fancy letters for the CLI users.
* So the freaks will have a reason to smile.
* Also this way this app will be different from  most others Applications
*/
function printCliLogo()
{
  console.log("\n __        ___     _ _");
  console.log(" \\ \\      / / |__ (_) |_ ___  ___ _ __   __ _  ___ ___ ");
  console.log("  \\ \\ /\\ / /| '_ \\| | __/ _ \\/ __| '_ \\ / _` |/ __/ _ \\");
  console.log("   \\ V  V / | | | | | ||  __/\\__ \\ |_) | (_| | (_|  __/");
  console.log("    \\_/\\_/  |_| |_|_|\\__\\___||___/ .__/ \\__,_|\\___\\___|");
  console.log("                                 |_|\n");
}


/*
* This function is needed thanks to the bad developer on the windows and mac
* side. Because the need their own "special" file format for the icons. That
* so useless because there aren't any benefits of having 3 fileformats for icons
* on 3 different Operating systems. Why just they can't all use some standards
* like .png ???
*
* So this little function will return the right path of the icon for each OS.
*/
function getLogoPath()
{
  if (os.platform() === 'darwin')
  {
    return '/res/logo.icns';
  }
  else if (os.platform() === 'win32')
  {
    return '/res/logo.ico';
  }
  else
  {
    return '/res/logo.png';
  }
}


/*
* This function will create the config for the main window
*/
function createWindowConfig()
{
  //gernerating the config for the browser window
  if (process.argv[2] === '--test')
  {
    //generate a bigger window for testing because the Chrome DevTools waste a lot of space
    var conf = {width: 1400, heigth: 600, icon: __dirname + getLogoPath(), show: false };
    console.log("Starting Whitespace with Chrome DevTools.");
  }
  else
  {
    var conf = {width: 1000, heigth: 600, icon: __dirname + getLogoPath(), show: false};
  }
  return conf;
}


/*
* This code waits for a messege from the render process and prints it to the
* CLI
*/
ipc.on('CLI-print', function (event, arg) {
  console.log(arg);
})


/*
* This code waits for a request for the id of the main window
*/
ipc.on('UI-windowID', function (event)
{
  event.returnValue = win.id;
})


/*
* Create a Browser window when the app ist started.
* Also create an invisible window for the encoding process so the UI doesn't
* suffer under the performance of the encoding
*/
app.on('ready', () =>
{
  //print logo
  printCliLogo();

  //spawn the browser window
  win = new BrowserWindow({width: 1000, heigth: 600, icon: __dirname + getLogoPath(), show: false});
  if (process.argv[2] === '--test'){win.openDevTools();}  //Open Chrome DevTools for testing
  win.setMenu(null);  //Disable the menu
  win.loadURL(`file://${__dirname}/app/index.html`);  //Load html

  //Show the window when it is ready
  win.on('ready-to-show', () => {
    win.show();
  })

  //Close the whole app if the mainwindow is closed
  win.on('closed', () =>{
    console.log("Window closed, exit Whitespace.")
    app.quit();
  })

});
