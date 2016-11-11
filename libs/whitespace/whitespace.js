/*
* WHITESPACE
*  ~what you see is what you get~
*
* This file is a libary to encode a text to a whitespace-only text. This text
* can't be seen by human eyes (because it just contains tranparent characters).
*
* I had written this code some while ago, however it was written in C++ and so
* I had to port it to java script.
*/

//Initialize some variables about this libary
const WHITESPACE_LIB_VERSION = 0.1;
const WHITESPACE_LIB_DATE = "30.10.2016";
const WHITESPACE_LIB_AUTHOR = "flofriday (www.github.com/flofriday)";


/*
* This function replaces a char at a particular index.
* function from: http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
*/
String.prototype.replaceAt=function(index, character)
{
  return this.substr(0, index) + character + this.substr(index+character.length);
}


function toWhitespace(input)
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


function fromWhitespace(input)
{
  //define all variables
  var output = "";
  var currentString = "";
  var dec = 0; var tri = 0;


  //clear input string from none Whitespace characters.
  var swap = "";
  for (i = 0, j = 0; i < input.length; i++)
  {
    if (input.charAt(i) === ' ' || input.charAt(i) === '\t' || input.charAt(i) === '\n')
    {
      swap += input.charAt(i);
      j++;
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
