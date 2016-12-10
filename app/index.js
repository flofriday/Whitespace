/*
* Loading some components
*/
const app = require('electron').remote;
const dialog = app.dialog;
const fs = require('fs');
const clipboard = require('electron').clipboard;
const {remote} = require('electron')
const {Menu, MenuItem} = remote

/*
* Grabbing some elements by their IDs
*/
var inputTextElement = document.getElementById('textareaInput');
var outputTextElement = document.getElementById('textareaOutput');
var saveElement = document.getElementById('btnSave');
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
}


/*
* This function copies the value of the clipboard into the inputTextElement
*/
function clipboardToInput()
{
  inputTextElement.value = `${clipboard.readText()}`;
  updateOutputElement.call();
}


/*
* This function clears the input Textarea.
*/
function clearInputContent()
{
  inputTextElement.value="";
  updateOutputElement.call();
}


/*
* This function opens a Save dialog and saves the whitespace code into a new file.
*/
function saveOutputContent()
{
  //creating the content which will be in the file.
  var content = toWhitespace(inputTextElement.value);  //copy the textarea content into this variable

  //create a save dialog (code from http://ourcodeworld.com/articles/read/106/how-to-choose-read-save-delete-or-create-a-file-with-electron-framework)
  dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined){
      console.log("You didn't save the file");
      return;
    }
    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(fileName, content, function (err) {
      if(err){
        alert("An error ocurred creating the file "+ err.message)
      }

      alert("The file has been succesfully saved");
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
    outputTextElement.innerHTML = fromWhitespace(inputTextElement.value);
    //if (visualWhitespace === 1){fromVisualWhitespace(inputTextElement.value)}
  }
}


/*
* This function changes the interface so that you can also decode.
*/
function exchangeHTML()
{
  var swap; //this variable is only used in this function to save strings for a short time

  //change the text based on
  if (exchanged === 0)
  {
    exchanged = 1;
    $('#textareaInput').attr('placeholder','Paste some encoded text here.');
  }
  else {
    exchanged = 0;
    $('#textareaInput').attr('placeholder','Start typing to get hidden text.');
  }

  swap = leftHeaderElement.innerHTML;
  leftHeaderElement.innerHTML = rightHeaderElement.innerHTML;
  rightHeaderElement.innerHTML = swap;

  updateOutputElement.call();
}


/*
* creating some EventListener
*/
inputTextElement.addEventListener("input", updateOutputElement);  //if the normal input changes
inputTextElement.addEventListener("keydown", updateOutputElement);  //tabs aren't handeled as normal input so I have also to listen to a keydown event.
copyElement.addEventListener("click", outputToClipboard);
pasteElement.addEventListener("click", clipboardToInput)
saveElement.addEventListener("click", saveOutputContent);
clearElement.addEventListener("click", clearInputContent);
exchangeElement.addEventListener("click", exchangeHTML);



/*
* This code creates a Chrome contextmenu.
* This menu is available on all Pages of the window which is not totally optimal
* so I will probably replace this code afterwards.
*/
const menu = new Menu();
menu.append(new MenuItem({label: 'Change', click() { exchangeHTML.call(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Copy Output', click() { outputToClipboard.call(); }}));
menu.append(new MenuItem({label: 'Paste Input', click() { clipboardToInput.call(); }}));
menu.append(new MenuItem({label: 'Clear Input', click() { clearInputContent.call(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Save As', click() { saveOutputContent.call(); }}));
menu.append(new MenuItem({type: 'separator'}));
menu.append(new MenuItem({label: 'Main', click() { window.location.href = "#Main" }}));
menu.append(new MenuItem({label: 'Settings', click() { window.location.href = "#Settings" }}));
menu.append(new MenuItem({label: 'About', click() { window.location.href = "#About" }}));


window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);
