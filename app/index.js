/*
* Loading some components
*/
const app = require('electron').remote;
const dialog = app.dialog;
const fs = require('fs');
const path = require('path');
const clipboard = require('electron').clipboard;
const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const ipc = require('electron').ipcRenderer;


/*
* Grabbing some elements by their IDs
*/
var inputTextElement = document.getElementById('textareaInput');
var outputTextElement = document.getElementById('textareaOutput');
var saveElement = document.getElementById('btnSave');
var openElement = document.getElementById('btnOpen');
var injectElement = document.getElementById('btnInject');
var copyElement = document.getElementById('btnCopy');
var pasteElement = document.getElementById('btnPaste');
var clearElement = document.getElementById('btnClear');
var exchangeElement = document.getElementById('btnExchange');
var leftHeaderElement = document.getElementById('leftheader');
var rightHeaderElement = document.getElementById('rightheader');


//defining some global variables
var exchanged = 0;  //this variable describes if the code has to encode or has to decode.
var visualWhitespace = 1;


/*
* After reading the functions name it should be obvious what it is doing, isn't
* it?
*
* So yeah it will simply copy the text of the output-texarea to the clipboard.
*/
function outputToClipboard()
{
  if (exchanged === 0)
  {
    clipboard.writeText(toWhitespace(inputTextElement.value));
  }
  else
  {
    clipboard.writeText(fromWhitespace(inputTextElement.value));
  }
  ipc.send('CLI-print', 'Copied output to clipboard.');
}


/*
* This function copies the value of the clipboard into the inputTextElement
*/
function clipboardToInput()
{
  inputTextElement.value.getSelection() += `${clipboard.readText()}`;
  updateOutputElement();
}


/*
* This function clears the input Textarea.
*/
function clearInputContent()
{
  inputTextElement.value="";
  updateOutputElement();
}


/*
* This function opens a Save dialog and saves the whitespace code into a new file.
*/
function saveOutputFile()
{
  //creating the content which will be in the file.
  var content
  if (exchanged === 1) content = fromWhitespace(inputTextElement.value);  //copy the textarea content into this variable
  if (exchanged === 0) content = toWhitespace(inputTextElement.value);

  //create a save dialog (code from http://ourcodeworld.com/articles/read/106/how-to-choose-read-save-delete-or-create-a-file-with-electron-framework)
  dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;

    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(fileName, content, function (err) {
      if(err){
        ipc.send('CLI-print', 'An error ocurred opening the file \'' + fileName + '\': '+ err.message);
      }
      else
      {
        ipc.send('CLI-print', 'Saved Whitespace-file as: \'' + fileName + '\'');
      }

    });
  });
}


/*
* This function opens a dialog in which you can select a textfile. The content
* of the selected file will appear in the input Textarea.
*
* This function is mainly copied from: http://mylifeforthecode.com/getting-started-with-standard-dialogs-in-electron/
*/
function openInputFile()
{

  dialog.showOpenDialog(function (fileNames)
  {
    if (fileNames === undefined) return;

    var fileName = fileNames[0];

    fs.readFile(fileName, 'utf-8', function (err, data)
    {
      if (err)
      {
        ipc.send('CLI-print', 'An error ocurred opening the file \'' + fileName + '\': '+ err.message);
      }
      else
      {
        inputTextElement.value = data;
        updateOutputElement(); //update the content of the output Textarea
        ipc.send('CLI-print', 'Opend file: \'' + fileName + '\'');
      }

    });
  });
}


/*
* This function opens a file dialog where you should select a textfile.
* In this textfile every white-spaces will be replaced by a Code-character
* from the output code.
* This function won't destroy the original file. It will make a copy with the
* prefix "WS".
* for example the file "test.txt" will create a injected file "WStest.txt"
*/
function injectOutputFile()
{
  //check if Whitespace is even in encode modules
  if (exchanged === 1)
  {
    alert('You can only inject Code not normal text!');
    return;
  }

  //create some variables
  var container;
  var inputFile;
  var outputFile;

  //open the file dialog
  dialog.showOpenDialog(function (fileNames)
  {
    if (fileNames === undefined) return;

    inputFile = fileNames[0];

    fs.readFile(inputFile, 'utf-8', function (err, data)
    {
      container = data;

      //create the path of the output file
      var a = path.dirname(inputFile);
      var b = path.basename(inputFile);
      outputFile = path.join(a, 'WS-' + b);

      //write the content to the file
      fs.writeFile(outputFile, injectWhitespace(inputTextElement.value, container), function (err) {
        if(err)
        {
          ipc.send('CLI-print', 'An error ocurred opening the file \'' + fileName + '\': '+ err.message);
        }
        else
        {
          ipc.send('CLI-print', "Saved injected file as: \'" + outputFile + "\'");
        }
      });

    });

  });

}


/*
* This function checks if the app has to encode to Whitespace or from Whitespace
* After that it also updates the Output textarea with the encoded or decoded
* characters
*/
function updateOutputElement()
{
  if (exchanged === 0)
  {
    if (visualWhitespace === 1){ outputTextElement.innerHTML = toVisualWhitespace(inputTextElement.value); }
    else {outputTextElement.innerHTML = toWhitespace(inputTextElement.value);}
  }
  else
  {
    outputTextElement.innerHTML = fromWhitespace(inputTextElement.value)
  }
}


/*
* This function changes the interface so you can change between encode and decode.
*/
function exchangeHTML()
{
  var swap; //this variable is only used in this function to save strings for a short time

  //change the placeholder text
  if (exchanged === 0)
  {
    exchanged = 1;
    $('#textareaInput').attr('placeholder','Paste some encoded text here.');
    ipc.send('CLI-print','Changed Interface to decode.');
  }
  else {
    exchanged = 0;
    $('#textareaInput').attr('placeholder','Start typing to get hidden text.');
    ipc.send('CLI-print','Changed Interface to encode.');
  }

  //change the headers
  swap = leftHeaderElement.innerHTML;
  leftHeaderElement.innerHTML = rightHeaderElement.innerHTML;
  rightHeaderElement.innerHTML = swap;

  updateOutputElement(); //update the content of the Output Textarea
}


/*
* creating some EventListener
*/
inputTextElement.addEventListener("input", updateOutputElement);  //if the normal input changes
inputTextElement.addEventListener("keydown", updateOutputElement);  //tabs aren't handeled as normal input so I have also to listen to a keydown event.
copyElement.addEventListener("click", outputToClipboard);
pasteElement.addEventListener("click", clipboardToInput)
saveElement.addEventListener("click", saveOutputFile);
openElement.addEventListener("click", openInputFile);
injectElement.addEventListener("click", injectOutputFile);
clearElement.addEventListener("click", clearInputContent);
exchangeElement.addEventListener("click", exchangeHTML);
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

/*
* Gets the anchor of the current URL to check and disable context menu
* which is set in the jQuery script
*/
function getMenu() {  
    var windowlocation = document.URL,
    anchor = windowlocation.split('#');
    return (anchor.length > 1) ? anchor[1] : null;
}

/*
* This code creates a Chrome contextmenu.
* This menu is available on all Pages of the window which is not totally optimal
* so I will probably replace this code afterwards.
*/
const menu = new Menu();

//Check on which page the user is. If "Main" display context menu (or whatever flo wants to display)
switch(anchor){
    case "Settings"
    //Whatever
    break;
    
    case "About"
    //Whatever
    break;
    
    //This is window "main"
    case default
    //whatever
}

menu.append(new MenuItem({label: 'Change', click() { exchangeHTML(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Copy Output', click() { outputToClipboard(); }}));
menu.append(new MenuItem({label: 'Paste Input', click() { clipboardToInput(); }}));
menu.append(new MenuItem({label: 'Clear Input', click() { clearInputContent(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Save As', accelerator: 'CommandOrControl+Alt+K', click() { saveOutputFile(); }}));
menu.append(new MenuItem({label: 'Open File', click(){ openInputFile(); }}));
menu.append(new MenuItem({label: 'Inject Code', click(){ injectOutputFile(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Main', click() { window.location.href = "#Main" }}));
menu.append(new MenuItem({label: 'Settings', click() { window.location.href = "#Settings" }}));
menu.append(new MenuItem({label: 'About', click() { window.location.href = "#About" }}));


/*
* This code handels droping files into Whitespace. Every droped file will be
* opend as a input file.
*/
document.body.ondrop = (ev) =>
{
  var fileName = ev.dataTransfer.files[0].path;

  fs.readFile(fileName, 'utf-8', function (err, data)
  {
    if (err)
    {
      ipc.send('CLI-print', 'An error ocurred opening the file \'' + fileName + '\': '+ err.message);
    }
    else
    {
      inputTextElement.value = data;
      updateOutputElement(); //update the content of the output Textarea
      ipc.send('CLI-print', 'Opend droped file: \'' + fileName + '\'');
    }

  });

  ev.preventDefault();
};
