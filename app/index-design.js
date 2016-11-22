/**
* This file contais some custom JS code to make some simple animations or to
* change the design.
*/


/*
* Setting up fullpage to get this amazing scroll-effect working
*/
$(document).ready(function() {
  $('#fullpage').fullpage({
    sectionsColor: ['whitesmoke', '#939FAA', '#323539'],
    anchors: ['Main', 'Settings', 'About'],
    css3: false,
    normalScrollElements: "textarea",  //So scrolling inside the textarea won't effect the autoscrolling of fullPage.js
    navigation: true,
    autoScrolling: true,
    navigationPosition: 'right'
  });
});


/*
* This function adds a shadow to the textareas smoothly
*/
$("textarea").hover(
  function () {
    $(this).removeClass('out').addClass('over');
  },
  function () {
    $(this).removeClass('over').addClass('out');
  }
);


/*
* This function fixes a bug so you can now hit the tab key on your keyboard
* and the tab will also appear in the textarea and you won't select another
* element like the default would be.
*
* This code is copied from: http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
*/
$("textarea").keydown(function(e) {
  if(e.keyCode === 9) { // tab was pressed
    // get caret position/selection
    var start = this.selectionStart;
    end = this.selectionEnd;

    var $this = $(this);

    // set textarea value to: text before caret + tab + text after caret
    $this.val($this.val().substring(0, start)
    + "\t"
    + $this.val().substring(end));

    // put caret at right position again
    this.selectionStart = this.selectionEnd = start + 1;

    // prevent the focus lose
    return false;
  }
});
