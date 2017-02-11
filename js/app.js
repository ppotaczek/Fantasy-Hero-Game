$(document).ready(function() {

//Movement system and limit
  function moveSystem(minPosX, maxPosX, minPosY, maxPosY){
    $(document).keypress(function(event) {
      var sprite = $(".sprite");
      var posX = parseInt(sprite.css("left"));
      var posY = parseInt(sprite.css("top"));
      var animate = sprite.is(':animated');

      if(event.which == 97 && !animate) {
        if (posX >= minPosX){
            sprite.animate({left: "-=15px"}, {duration: 100, complete: function(){sprite.css("background-position", "-63px 0");}});
            sprite.animate({left: "-=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "-126px 0");}});
            sprite.animate({left: "-=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "0 0");}});
        }
      }
      else if(event.which == 100 && !animate) {
        if (posX <= maxPosX){
            sprite.animate({left: "+=15px"}, {duration: 100, complete: function(){sprite.css("background-position", "-63px 0");}});
            sprite.animate({left: "+=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "-126px 0");}});
            sprite.animate({left: "+=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "0 0");}});
        }
      }
      else if(event.which == 119 && !animate) {
        if (posY >= minPosY){
          sprite.animate({top: "-=15px"}, {duration: 100, complete: function(){sprite.css("background-position", "-63px 0");}});
          sprite.animate({top: "-=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "-126px 0");}});
          sprite.animate({top: "-=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "0 0");}});
        }
      }
      else if(event.which == 115 && !animate) {
        if (posY <= maxPosY){
          sprite.animate({top: "+=15px"}, {duration: 100, complete: function(){sprite.css("background-position", "-63px 0");}});
          sprite.animate({top: "+=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "-126px 0");}});
          sprite.animate({top: "+=15px"}, {duration: 200, complete: function(){sprite.css("background-position", "0 0");}});
        }
      }
      else if(event.which == 32 && !animate) {
        console.log("strzelanie");
        sprite.animate({top: "+=0"}, {duration: 200, complete: function(){sprite.css("background-position", "0 0").addClass("spriteShoot");}});
        sprite.animate({top: "+=0"}, {duration: 200, complete: function(){sprite.css("background-position", "-153px 0").addClass("spriteShoot");}});
        sprite.animate({top: "+=0"}, {duration: 200, complete: function(){
          var bullet = $("<div>")
          .addClass("bullet")
          .css("top", posY+30)
          .css("left", posX+100);
          $(".container").append(bullet);
          bullet.animate({left: "1000px"}, {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
          sprite.css("background-position", "0 0")
          .removeClass("spriteShoot");
        }});
      }
    });
  };

  moveSystem(30, 890, 140, 570);
  function moveBackGround(){

  }
});
