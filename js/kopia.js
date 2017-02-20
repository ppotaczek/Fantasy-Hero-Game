$(document).ready(function() {
  var sprite = $(".sprite");
  var container = $(".container");

  var enemyPropertiesMummy = {
    class: "enemyMummy",
    class2: "enemyMummy2",
    destroyClass: "enemyMummy",
    moveStart: -1107,
    moveStep: 123,
    attackStart: -861,
    experience: 10,
    directionAttack: "-406px",
    height: 167,
    delay: 2000,
    life: 1,
    randomY: 550,
    frames: 10,
    strength: 1
  }

  var enemyPropertiesBehemoth = {
    class: "enemyBehemoth",
    class2: "enemyBehemoth2",
    destroyClass: "enemyBehemoth2",
    moveStart: -2430,
    moveStep: 270,
    attackStart: -1620,
    experience: 100,
    directionAttack: "-528px",
    height: 264,
    delay: 4000,
    life: 3,
    randomY: 450,
    frames: 7,
    strength: 3
  }

  var enemyPropertiesEnt = {
    class: "enemyEnt",
    class2: "enemyEnt2",
    destroyClass: "enemyEnt2",
    moveStart: -1512,
    moveStep: 216,
    attackStart: -1296,
    experience: 50,
    directionAttack: "-430px",
    height: 215,
    delay: 3000,
    life: 4,
    randomY: 450,
    frames: 7,
    strength: 2
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
              if (enemy.attr("data-life") < 1){
                return false;
              }
              setTimeout(function(){
                enemy.removeClass(enemyProperties.class2)
                  .resume()
                  .animate({left: "-250px", top: randomDirection},
                    {duration: 13000, easing: "linear", complete: function(){$(this).remove();}});
              }, 500);
            }})
        }
      }
      else if (enemyType == "ent"){
        var enemyProperties = enemyPropertiesEnt;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 6000, easing: "linear"})
            .animate({left: "-150px", top: randomDirection},
            {duration: 25000, easing: "linear", complete: function(){$(this).remove();}});
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
        hitHero(enemyProperties.strength);
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
          killEnemy(bullet);
          bullet.animate({left: "1100px"},
          {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
          sprite.css("background-position", "0 0")
          .removeClass("spriteShoot");
        }
    });
  }

  function hitHero(power){
    var actualLifes = ($("#lifes").text())-power;
    $("#lifes").text(actualLifes);
  }

  function addExperience(amount){
    var actualExp = parseInt($("#exp").text());
    var newExp = actualExp+parseInt(amount);
    $("#exp").text(newExp);
  }

  function hitEnemy(hit, typeProperties){
    var iteration = 0;
    hit.pause()
      .addClass(typeProperties.destroyClass)
    var hitAnimation = setInterval(function(){
      if (hit.attr("data-life") < 1){
        return false;
      }
      iteration++;
      hit.css("background-position", typeProperties.attackStart+(iteration*typeProperties.moveStep)+"px "+typeProperties.height*(-4)+"px");
      if (iteration == typeProperties.frames-1){
        clearInterval(hitAnimation);
      }
    }, 80)

    setTimeout(function(){
      hit.resume()
        .removeClass(typeProperties.destroyClass);
      intervalBGAnimation(typeProperties, hit);
    }, 500)
  }

  function killAnimation(toKill, typeProperties){
    var iteration = 0;
    var killAnimation = setInterval(function(){
      iteration++;
      toKill.addClass(typeProperties.destroyClass)
        .css("background-position", (-typeProperties.moveStep*(typeProperties.frames-1))+(iteration*typeProperties.moveStep)+"px "+typeProperties.height+"px")

      if (iteration == typeProperties.frames-1){
        clearInterval(killAnimation);
        clearInterval(toKill.attr("data-interval"));
      }
    }, 50)
  }

  function killEnemy(fireball){
    var intervalCheck = setInterval(function(){
      var fireballPosY = parseInt(fireball.css("top"));
      var fireballPosX = parseInt(fireball.css("left"));
      var enemies = $(".enemy");

      enemies.each(function(){
        var thisTop = parseInt($(this).css("top"));
        var thisLeft = parseInt($(this).css("left"));
        var $this = $(this);
        var typeProperties = null;

        if ($this.hasClass("enemyMummy")){
          typeProperties = enemyPropertiesMummy;
        }
        else if ($this.hasClass("enemyBehemoth")){
          typeProperties = enemyPropertiesBehemoth;
        }
        else if ($this.hasClass("enemyEnt")){
          typeProperties = enemyPropertiesEnt;
        }

        if (fireballPosY >= thisTop && fireballPosY <= thisTop+typeProperties.height && fireballPosX >= thisLeft-20 && fireballPosX <= thisLeft+20){
          clearInterval(intervalCheck);
          fireball.remove();
          $this.attr("data-life", parseInt($this.attr("data-life")-1));
          clearInterval($(this).attr("data-interval"));
          if ($this.attr("data-life") > 0){
            hitEnemy($this, typeProperties);
          }

          else if ($this.attr("data-life") < 1){
            $this.stop()
              .removeClass("enemy");
            killAnimation($this, typeProperties);
            clearInterval($(this).attr("data-interval"));
            addExperience($this.attr("data-experience"));
            $this.stop();
          }
        }
      });
    }, 20);

  }
  moveSystem(30, 890, 70, 570);
  //createEnemy(5, "ent");
  //createEnemy(25, "mummy");
  createEnemy(5, "behemoth");
});
