var expand = function (circle) {

    document.getElementById(circle).classList.toggle("expand");
    document.getElementById(circle + "-inner").classList.toggle("expand");
    //document.getElementById(circle + "-title").classList.toggle("expand");
    document.getElementById("exit-about").classList.toggle("expand");
    document.getElementById("img-holder").classList.toggle("expand");

}

var expandWork = function (circle) {
    //
    // document.getElementById(circle).classList.toggle("expand");
    // document.getElementById(circle + "-inner").classList.toggle("expand");
    // //document.getElementById(circle + "-title").classList.toggle("expand");
    // document.getElementById("exit-about").classList.toggle("expand");
    // document.getElementById("img-holder").classList.toggle("expand");

}


$(document).ready(function () {
    $('a').click(function (event) {
        event.preventDefault();
        $(this).hide("slow");
    });

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '../../port/audio/minerals2.mp3');

    $('.about').parent().bind('transitionend', function (event) {
        console.log("event: ");
        console.log(event);
        console.log(event.originalEvent.propertyName);
        if (event.originalEvent.propertyName == 'transform') {
            $(".about").toggleClass("highlight");
        }
    });
    var minerals = function () {
        audioElement.play();
    }
    $(".minerals").click(function () {
        audioElement.play();
    });

});
