const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;
const renderWindow = BrowserWindow.fromId(ipc.sendSync('UI-windowID')); //get the id of the render Window so the deamon knows where he has to send the encoded text


// print in the CLI that this deamon is started
ipc.send('CLI-print','Whitespace-deamon started.');


/*
* This code waits for a message from the renderer process to encode a message.
* When the whole message is encoded it will send it back to the renderer
* process.
*/
ipc.on('WS-encode', function (event, message)
{
  var output = whitespaceEncode(message);
  renderWindow.webContents.send('UI-outputReady', output);
})


/*
* This code waits for a message from the renderer process to decode a message.
* When the whole message is decoded it will send it back to the renderer
* process.
*/
ipc.on('WS-decode', function (event, message)
{
  var output = whitespaceDecode(message);
  renderWindow.webContents.send('UI-outputReady', output);
})


/*
* This code waits for a message from the renderer process to encode a message
* visually.
* When the whole message is encoded it will send it back to the renderer
* process.
*/
ipc.on('WS-encodeVisual', function (event, message)
{
  var output = whitespaceEncodeVisual(message);
  renderWindow.webContents.send('UI-outputReady', output);
})


/*
* This code waits for a message from the renderer process to decode a message
* visually.
* When the whole message is decoded it will send it back to the renderer
* process.
*/
ipc.on('WS-decodeVisual', function (event, message)
{
  var output = whitespaceDecodeVisualcode(message);
  renderWindow.webContents.send('UI-outputReady', output);
})


/*
* This code waits for a message from the renderer process to inject a encoded
* message into a file.
* So this code will read the file content and will inject the message into it
* after that it will send the filepath and the injected content back to the
* render process
*/
ipc.on('WS-inject', function (event, message, file)
{

})


/*
* This code waits for a message from the renderer process to encode a file.
* When the file is encoded it will send the content and the path back to the
* renderer process
*/
ipc.on('WS-encodeFile', function (event, message, file)
{

})




/*
* Some code that the UI will work correctly
*/
const shell = require('electron').shell

const links = document.querySelectorAll('a[href]')

Array.prototype.forEach.call(links, function (link) {
  const url = link.getAttribute('href')
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
})
