$(document).ready(function() {
  var sprite = $(".sprite");
  var container = $(".container");

  var enemyPropertiesMummy = {
    class: "enemyMummy",
    class2: "enemyMummy2",
    moveStart: -1107,
    moveStep: 123,
    attackStart: -861,
    experience: 10,
    directionAttack: "406px",
    height: 167,
    delay: 2000,
    life: 1,
    randomY: 550,
    frames: 10
  }

  var enemyPropertiesBehemoth = {
    class: "enemyBehemoth",
    class2: "enemyBehemoth2",
    moveStart: -2430,
    moveStep: 270,
    attackStart: -1620,
    experience: 100,
    directionAttack: "-528px",
    height: 264,
    delay: 4000,
    life: 3,
    randomY: 450,
    frames: 7
  }

//Movement system and limit
  function moveSystem(minPosX, maxPosX, minPosY, maxPosY){
    $(document).keypress(function(event) {
      var posX = parseInt(sprite.css("left"));
      var posY = parseInt(sprite.css("top"));
      var animate = sprite.is(':animated');

      function spriteAnimateProperties(displacement){
        return {duration: 120, complete: function(){sprite.css("background-position", displacement);}}
      }
      function spriteAnimateLeft(value){
        sprite.animate({left: value}, spriteAnimateProperties("-63px 0"));
        sprite.animate({left: value}, spriteAnimateProperties("-126px 0"));
        sprite.animate({left: value}, spriteAnimateProperties("0 0"));
      }
      function spriteAnimateTop(value){
        sprite.animate({top: value}, spriteAnimateProperties("-63px 0"));
        sprite.animate({top: value}, spriteAnimateProperties("-126px 0"));
        sprite.animate({top: value}, spriteAnimateProperties("0 0"));
      }

      if(event.which == 97 && !animate) {
        if (posX >= minPosX){
            spriteAnimateLeft("-=20px");
        }
      }
      else if(event.which == 100 && !animate) {
        if (posX <= maxPosX){
            spriteAnimateLeft("+=20px");
        }
      }
      else if(event.which == 119 && !animate) {
        if (posY >= minPosY){
          spriteAnimateTop("-=20px");
        }
      }
      else if(event.which == 115 && !animate) {
        if (posY <= maxPosY){
          spriteAnimateTop("+=20px");
        }
      }
      //Shooting
      else if(event.which == 32 && !animate) {
        shoot(posY, posX);

      }
    });
  };

  function createEnemy(number, enemyType){
    for (var i = 0; i < number; i++){

      if (enemyType == "mummy"){
        var enemyProperties = enemyPropertiesMummy;

        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 3000, easing: "linear"})
            .animate({left: "-150px", top: randomDirection},
            {duration: 15000, easing: "linear", complete: function(){$(this).remove();}});
        }
      }
      else if (enemyType == "behemoth"){
        var enemyProperties = enemyPropertiesBehemoth;

        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "20px"},
            {duration: 2000, easing: "linear", complete: function(){
              enemy.pause()
                .addClass(enemyProperties.class2);
              setTimeout(function(){
                enemy.removeClass(enemyProperties.class2)
                  .resume()
                  .animate({left: "-150px", top: randomDirection},
                    {duration: 12000, easing: "linear", complete: function(){$(this).remove();}});
              }, 1000);
            }})
        }
      }

      // Create enemy on randomPosY
      setTimeout(function(){
        var randomPosY = Math.floor((Math.random() * enemyProperties.randomY) + 1);
        var randomDirection = Math.floor((Math.random() * enemyProperties.randomY) + 1);
        var enemy = $("<div>").addClass(enemyProperties.class).css("top", randomPosY);
        addEnemy(enemy, enemyProperties);
        intervalBGAnimation(enemyProperties, enemy);
        enemyAnimate(enemy, randomDirection);

      }, enemyProperties.delay*i);
    }
  }

  function intervalBGAnimation(enemyProperties, enemy){
    var animationStep = 1;
    var interval = setInterval(function(){

      var heroPosX = parseInt(sprite.css("left"))+43;
      var heroPosY = parseInt(sprite.css("top"))+113;
      var thisX = parseInt(enemy.css("left"));
      var thisY = parseInt(enemy.css("top"));
      var hit = sprite.hasClass("hit");

      //Checking bullet
      if ($("div.bullet").length){
        killEnemy($("div.bullet"), enemyProperties, enemy, thisX, thisY);
      }

      enemy.attr("data-interval", interval)
        .css("background-position", (enemyProperties.moveStart+(animationStep*enemyProperties.moveStep))+"px 0");
      animationStep++;

      //Enemy attack - using the same Interval as a BG animation
      var conditionX = thisX <= heroPosX && thisX + 123 >= heroPosX && !hit;
      var dirAtt = enemyProperties.directionAttack;
      var height = enemyProperties.height;

      if (thisY <= heroPosY && thisY + height/3 >= heroPosY-100 && conditionX){
        dirAtt = parseInt(dirAtt)/2+"px";
      }
      else if (thisY + 2*height/3 <= heroPosY-100 && thisY + height >= heroPosY-100 && conditionX){
        dirAtt = parseInt(dirAtt) + parseInt(dirAtt)/2+"px";
      }

      if (thisY <= heroPosY && thisY + height >= heroPosY-100 && conditionX){
        console.log(dirAtt);
        sprite.addClass("hit");

        for (var i = 0; i < 39; i++) {
          sprite.toggle(80);
          i++;
        }
        setTimeout(function(){sprite.removeClass("hit");}, 4000);
        clearInterval(enemy.attr("data-interval"));
        enemy.pause()
          .addClass(enemyProperties.class2);
        iterationAttack(enemyProperties, enemy, dirAtt);

      }
    }, 100);
  }

  function iterationAttack(propertiesObj, enemy, dirAtt){
    var iterationAttack = 1;
    var attackInterval = setInterval(function(){
      enemy.css("background-position", propertiesObj.attackStart+iterationAttack*propertiesObj.moveStep+"px "+ dirAtt)
        .css("left", "-=8px");
      iterationAttack++;
      if (iterationAttack == 9){
        enemy.removeClass(propertiesObj.class2)
          .css("background-position", propertiesObj.moveStart+"px 0")
          .resume();
        clearInterval(attackInterval);
        intervalBGAnimation(propertiesObj, enemy);
      }
    }, 100);
  }

  function addEnemy(enemy, propertiesObj){
    container.append(enemy);
    enemy.attr("data-experience", propertiesObj.experience)
      .attr("data-life", propertiesObj.life)
      .addClass("enemy")
  }

  function shoot(posY, posX){
    sprite.animate({top: "+=0"},
    {duration: 200, complete:
    function(){
      sprite.css("background-position", "0 0")
      .addClass("spriteShoot");
      }
    })
      .animate({top: "+=0"},
      {duration: 200, complete:
      function(){
        sprite.css("background-position", "-153px 0");
        }
      })
      .animate({top: "+=0"},
        {duration: 200, complete:
        function(){
          var bullet = $("<div>")
          .addClass("bullet")
          .css("top", posY+30)
          .css("left", posX+100);
          container.append(bullet);
          bullet.animate({left: "1000px"},
          {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
          sprite.css("background-position", "0 0")
          .removeClass("spriteShoot");
        }
    });
  }

  function hitEnemy(hit, propertiesObj){
    var iteration = 0;
    hit.pause()
      .addClass(propertiesObj.class2)
    var hitAnimation = setInterval(function(){
      iteration++;
      hit.css("background-position", propertiesObj.attackStart+(iteration*propertiesObj.step)+"px "+(-propertiesObj.height)*4);
      if (iteration == propertiesObj.frames-1){
        clearInterval(hitAnimation);
      }
    }, 80)
      // .css("background-position", "0 "+ -(parseInt(hit.css("height"))*4)+"px");

    setTimeout(function(){
      hit.resume()
        .removeClass("enemyBehemoth2");
      intervalBGAnimation(enemyPropertiesBehemoth, hit);

    }, 500)
  }
  // function killAnimation(toKill){
  //   var iteration = 0;
  //   var killAnimation = setInterval(function(){
  //     iteration++;
  //     toKill.css("background-position", (-1107+(iteration*123))+"px 167px");
  //     if (iteration == toKill.attr("data-frames")-1){
  //       clearInterval(killAnimation);
  //     }
  //   }, 50)
  // }

  function killEnemy(fireball, enemyProperties, enemy, enemyX, enemyY){
    var fireballPosY = parseInt(fireball.css("top"));
    var fireballPosX = parseInt(fireball.css("left"));

    var checkInterval = setInterval(function(){
      if (fireballPosY >= enemyY && fireballPosY <= enemyY+enemyProperties.height && fireballPosX >= enemyX-60 && fireballPosX <= enemyX+20){
        clearInterval(checkInterval);
        fireball.remove();
        enemy.attr("data-life", parseInt(enemy.attr("data-life")-1));
        clearInterval($(this).attr("data-interval"));
        if (enemy.attr("data-life") > 0){
          hitEnemy(enemy, enemyProperties);
        }

        else if (enemy.attr("data-life") < 1){
          enemy.stop()
            .removeClass("enemy");
          //killAnimation($this);
          enemy.stop();
          return false;
        }
      };
    }, 20)

  }
  moveSystem(30, 890, 70, 570);
  createEnemy(2, "behemoth");
});
