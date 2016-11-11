/**
* This file contais some custom JS code to make some simple animations or to
* change the design.
*/


$("textarea").hover(
    function () {
        $(this).removeClass('out').addClass('over');
    },
    function () {
        $(this).removeClass('over').addClass('out');
    }
);
