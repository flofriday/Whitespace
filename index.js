/*
* Loading some components
*/
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');

/*
* Grabbing some elements by their IDs
*/
var inputTextElement = document.getElementById('textareaInput');
var outputTextElement = document.getElementById('textareaOutput');
var executeElement = document.getElementById('btnExecute');
var saveElement = document.getElementById('btnSave');
var copyElement = document.getElementById('btnCopy');
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
  if(visualWhitespace === 1){unvisualizeWhitespaceCharacters.call(this, outputTextElement.value, outputTextElement);}  //replace visual Characters with orginial Whitespaces if needed
  outputTextElement.select(); //select the content of the textarea
  document.execCommand("copy"); //execute the copy command
  window.getSelection().empty();  //select nothing
  if(visualWhitespace === 1){visualizeWhitespaceCharacters.call(this, outputTextElement.value, outputTextElement);}  //replace real whitespace characters with visual Characters
}



/*
* This function opens a Save dialog and saves the whitespace code into a new file.
*/
function saveOutputContent()
{
  //creating the content which will be in the file.
  if(visualWhitespace === 1){unvisualizeWhitespaceCharacters.call(this, outputTextElement.value, outputTextElement);}  //replace visual Characters with orginial Whitespaces if needed
  var content = outputTextElement.value;  //copy the textarea content into this variable
  if(visualWhitespace === 1){visualizeWhitespaceCharacters.call(this, outputTextElement.value, outputTextElement);}  //replace real whitespace characters with visual Characters

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
* Since Whitespaces can't be seen by humans (Thats the point of this project)
* The app has to figure out another way to show the user that the text is
* encoded. And thats exactly what this function is doing.
*/
function visualizeWhitespaceCharacters(content, textarea)
{
  //replace all Whitespaces with S(Space), T(Tab) and L(Linefeed)
  for (var i = 0; i < content.length; i++)
  {
    if (content.charAt(i) === ' '){content = content.replaceAt(i, String.fromCharCode(183));}
    else if (content.charAt(i) === '\t'){content = content.replaceAt(i, '>');}
    else if (content.charAt(i) === '\n'){content = content.replaceAt(i, String.fromCharCode(182));}
  }

  //update the textarea
  textarea.innerHTML = content;
}


/*
* This function has the reversed effect than the visualizeWhitespaceCharacters
* function
*/
function unvisualizeWhitespaceCharacters(content, textarea)
{
  //replace all Whitespaces with S(Space), T(Tab) and L(Linefeed)
  for (var i = 0; i < content.length; i++)
  {
    if (content.charAt(i) === String.fromCharCode(183)){content = content.replaceAt(i, ' ');}
    else if (content.charAt(i) === '>'){content = content.replaceAt(i, '\t');}
    else if (content.charAt(i) === String.fromCharCode(182)){content = content.replaceAt(i, '\n');}
  }

  //update the textarea
  textarea.innerHTML = content;
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
    if (visualWhitespace === 1){visualizeWhitespaceCharacters.call(this, toWhitespace(inputTextElement.value), outputTextElement);}
    else {outputTextElement.innerHTML = toWhitespace(inputTextElement.value);}
  }
  else
  {
    outputTextElement.innerHTML = fromWhitespace(inputTextElement.value);
    //if (visualWhitespace === 1){visualizeWhitespaceCharacters.call(this, fromWhitespace(inputTextElement.value), inputTextElement);}
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
    executeElement.innerHTML = "decode to text";
  }
  else {
    exchanged = 0;
    executeElement.innerHTML = "encode to whitespaces";
  }

  swap = leftHeaderElement.innerHTML;
  leftHeaderElement.innerHTML = rightHeaderElement.innerHTML;
  rightHeaderElement.innerHTML = swap;

  updateOutputElement.call();
}


//creating some EventListener
inputTextElement.addEventListener("input", updateOutputElement);
executeElement.addEventListener("click", updateOutputElement);
copyElement.addEventListener("click", outputToClipboard);
saveElement.addEventListener("click", saveOutputContent);
exchangeElement.addEventListener("click", exchangeHTML);
