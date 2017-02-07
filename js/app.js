$(document).ready(function() {
  var sprite = $(".sprite");


  $(document).keypress(function(event) {
    if(event.which == 97) {
      sprite.animate({left: "-=30px"}, 100);
    }
    else if(event.which == 100) {
      sprite.animate({left: "+=30px"}, 100);
    }
    else if(event.which == 119) {
      sprite.animate({top: "-=30px"}, 100);
    }
    else if(event.which == 115) {
      sprite.animate({top: "+=30px"}, 100);
    }
  });
});
