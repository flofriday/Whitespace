/*
* WHITESPACE.js
*  ~what you see is what you get~
*
* This file is a libary to encode a text to a whitespace-only text. This text
* can't be seen by human eyes (because it just contains tranparent characters)
*
* The decode Algorithm ingnores all characters exept white spaces. So you can
* have some text between the whitespaces.
*
* I had written this code some while ago, however it was written in C++ and so
* I had to port it to java script.
*/


/*
* This function replaces a char at a particular index.
* code from: http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
*/
String.prototype.replaceAt=function(index, character)
{
  return this.substr(0, index) + character + this.substr(index+character.length);
}


/*
* This function has a string as an input and it will also output a string.
* The input should be the text it can be also encrypted because the function
* really doesn't care.
* However, the output is the input string encoded to Whitespace.
*/
function whitespaceEncode(input)
{
  //define all variables
  var output = "";
  var currentString;
  var dec = 0; var tri = 0;

  //encoding the text
  for (var i = 0; i < input.length; i++)
  {
    //save the ASCII code into a varible
    dec = input.charCodeAt(i);

    //convert dec to tri
    for (var j = 0; j < 6; j++)
    {
      tri += (dec % 3) * Math.pow(10, j);
      dec /= 3;
      dec = parseInt(dec);  //kill all floating numbers
    }

    //create the string
    currentString = tri.toString();
    tri = 0;  //clearing the int since it won't be used in this loop and so it won't effect the next loop
    while (currentString.length < 6) //make string exactly 6 chars long
    {
      currentString = '0' + currentString;
    }

    //replace 0, 1, 2 by space, tab, enter
    for (var j = 0; j < currentString.length; j++)
    {
      if (currentString.charAt(j) === '0'){currentString = currentString.replaceAt(j, ' ');}
      else if (currentString.charAt(j) === '1'){currentString = currentString.replaceAt(j, '\t');}
      else if (currentString.charAt(j) === '2'){currentString = currentString.replaceAt(j, '\n');}
    }

    //adding the callculated string to the main output string
    output += currentString;
  }

  return output;
}


/*
* This function is the decoder. It will show you the original text.
* Exactly as the encoder the input and the output are both strings.
*
* As you may have read above the decoder will ignore all characters, exept
* white-spaces. So feel free to give this function a string with some text between
* the white-spaces.
*/
function whitespaceDecode(input)
{
  //define all variables
  var output = "";
  var currentString = "";
  var dec = 0; var tri = 0;


  //clear input string from none Whitespace characters.
  var swap = "";
  for (i = 0; i < input.length; i++)
  {
    if (input.charAt(i) === ' ' || input.charAt(i) === '\t' || input.charAt(i) === '\n')
    {
      swap += input.charAt(i);
    }
  }
  input = swap;

  while (input.length > 0)
  {
    //clearing some variables (from the value of the last loop)
    dec = 0;
    tri = 0;
    currentString = "";

    /*
    * Create the currentString which contains ecactly the whitespace characters
    * for one normal character. Also shorten the input-string
    */
    for (i = 0; i < 6; i++)
    {
      currentString = currentString.replaceAt(i, input.charAt(0))
      input = input.slice(1); //shorten the input string
    }

    //convert space, tab, enter to 0, 1, 2
    for (i = 0; i < currentString.length; i++)
    {
      if (currentString.charAt(i) === ' '){currentString = currentString.replaceAt(i, '0');}
      else if (currentString.charAt(i) === '\t'){currentString = currentString.replaceAt(i, '1');}
      else if (currentString.charAt(i) === '\n'){currentString = currentString.replaceAt(i, '2');}
    }

    //create tri
    tri = parseInt(currentString);

    //convert tri to dec
    for (i = 0; tri > 0; i++)
    {
      dec += (tri % 10) * Math.pow(3, i);
      tri /= 10;
      tri = parseInt(tri);  //kill all floating numbers
    }

    //create char
    output += String.fromCharCode(dec);
  }
  return output;
}


/*
* This function is exactly like the normal toWhitespace function.
* The only difference is that this function doesn't encode to
* space, tab and linefeed but it encodes to characters that you can see.
* Instead of space it uses '·'
* Instead of tab it uses '>'
* Instead of a linefeed it uses '¶'
*/
function whitespaceEncodeVisual(input)
{
  //encode the whole input string to white-spaces
  var content = whitespaceEncode(input);

  //Replace the white-spaces with visual characterss
  for (var i = 0; i < content.length; i++)
  {
    if (content.charAt(i) === ' '){content = content.replaceAt(i, String.fromCharCode(183));}
    else if (content.charAt(i) === '\t'){content = content.replaceAt(i, '>');}
    else if (content.charAt(i) === '\n'){content = content.replaceAt(i, String.fromCharCode(182));}
  }

  //return the visual Whitespace Code
  return content;
}


/*
* This function works exactly like the normal decoder function (fromWhitespace).
* However, it uses visual white-spaces instead of real white-spaces ... you
* can read about visual whitespaces in the comment above the function toVisualWhitespace
*/
function whitespaceDecodeVisual(input)
{
  //clear input string from none visual white-space characters.
  var content = "";
  for (i = 0; i < input.length; i++)
  {
    if (input.charAt(i) === String.fromCharCode(183) || input.charAt(i) === '>' || input.charAt(i) === String.fromCharCode(182))
    {
      content += input.charAt(i);
    }
  }

  //replace visual white-space characters with real white-spaces
  for (var i = 0; i < content.length; i++)
  {
    if (content.charAt(i) === String.fromCharCode(183)){content = content.replaceAt(i, ' ');}
    else if (content.charAt(i) === '>'){content = content.replaceAt(i, '\t');}
    else if (content.charAt(i) === String.fromCharCode(182)){content = content.replaceAt(i, '\n');}
  }

  //return the original text
  return whitespaceDecode(content);
}


/*
* First, this function will encode the message to white-space.
* Now it will replace every whitespace in the container text with a whitespace
* from the encoded message.
* This way you will get a text which looks like it has a broken fromatting, but
* whou would guess that there is a message hidden in this weird layout
*/
function whitespaceInject(message, container)
{
  //encode the message
  message = whitespaceEncode(message);

  //loop throw the container and replace all white-spaces
  var i =  0;
  for (var j = 0; j < container.length && i < message.length; j++)
  {
    if (container.charAt(j) === ' ' || container.charAt(j) === '\t' || container.charAt(j) === '\n' )
    {
      container = container.replaceAt(j, message.charAt(i));
      i++;
    }
  }

  //add the rest of the message at the end
  if(i != message.length)
  {
    container += message.substring(i, message.length);
  }

  //return the injected container
  return container;
}
