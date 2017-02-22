$(document).ready(function() {
  var sprite = $(".sprite");
  var container = $(".container");
  sprite.attr("data-shoot", "fireball");

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
  var enemyPropertiesHarpy = {
    class: "enemyHarpy",
    class2: "enemyHarpy2",
    destroyClass: "enemyHarpy2",
    moveStart: -696,
    moveStep: 174,
    attackStart: -1218,
    experience: 30,
    directionAttack: "-338px",
    height: 169,
    delay: 2000,
    life: 2,
    randomY: 490,
    frames: 7,
    strength: 2
  }
  var enemyPropertiesBlackKnight = {
    class: "enemyBlackKnight",
    class2: "enemyBlackKnight2",
    destroyClass: "enemyBlackKnight2",
    moveStart: -2268,
    moveStep: 189,
    attackStart: -1134,
    experience: 150,
    directionAttack: "-378px",
    height: 189,
    delay: 5000,
    life: 5,
    randomY: 470,
    frames: 6,
    strength: 4
  }
  var enemyPropertiesMedusa = {
    class: "enemyMedusa",
    class2: "enemyMedusa2",
    destroyClass: "enemyMedusa2",
    moveStart: -1169,
    moveStep: 167,
    attackStart: -1002,
    experience: 30,
    directionAttack: "-360px",
    height: 180,
    delay: 5000,
    life: 2,
    randomY: 520,
    frames: 6,
    strength: 2,
    classBullet: "enemyMedusaBullet",
    shootY: 70
  }
  var enemyPropertiesCyclop = {
    class: "enemyCyclop",
    class2: "enemyCyclop2",
    destroyClass: "enemyCyclop2",
    moveStart: -1256,
    moveStep: 157,
    attackStart: -1099,
    experience: 130,
    directionAttack: "-414px",
    height: 207,
    delay: 7000,
    life: 4,
    randomY: 500,
    frames: 7,
    strength: 4,
    classBullet: "enemyCyclopBullet",
    shootY: 90
  }

//Movement system and limit
  function moveSystem(minPosX, maxPosX, minPosY, maxPosY){
    $(document).keypress(function(event) {
      var posX = parseInt(sprite.css("left"));
      var posY = parseInt(sprite.css("top"));
      var animate = sprite.is(':animated');
      var shooter = sprite.hasClass("heroShooter");

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

      if (!shooter && !animate){
        if(event.which == 97 && posX >= minPosX) {
          spriteAnimateLeft("-=20px");
        }
        else if(event.which == 100 && posX <= maxPosX) {
          spriteAnimateLeft("+=20px");
        }
        else if(event.which == 119 && posY >= minPosY) {
          spriteAnimateTop("-=20px");
        }
        else if(event.which == 115 && posY <= maxPosY) {
          spriteAnimateTop("+=20px");
        }
        //Shooting
        else if(event.which == 32) {
          shoot(posY, posX);
        }
        //Magic
        else if(event.which == 49) {
          defenseMagic("magicCure", 90, 20, 40);
        }
        else if(event.which == 50) {
          defenseMagic("magicShield", 56, 16, 20);
        }
        else if(event.which == 51) {
          shoot(posY, posX);
        }
        else if(event.which == 52) {
          armagedon(50);
        }
      }
    });
  };
  function armagedon(mana){
    var actualMana = $("#mana").text();
    if (actualMana >= mana){
      var newMana = parseInt(actualMana) - mana;
      $("#mana").text(newMana);
      var armagedonDiv = $("<div>")
        .addClass("armagedon");
      container.append(armagedonDiv);
      killEnemy(armagedonDiv, "armagedon");

      var armagedonIteration = 1;
      var armagedonInterval = setInterval(function(){
        armagedonIteration++;
        armagedonDiv.css("background-image", "url(./images/magic/C06spF"+armagedonIteration+".png)");
        if (armagedonIteration > 20){
          clearInterval(armagedonInterval);
        }
      }, 40);
    }
  }

  function defenseMagic(spellClass, step, frames, mana){
    var actualMana = $("#mana").text();

    if (actualMana >= mana){
      var heroX = parseInt(sprite.css("left"));
      var heroY = parseInt(sprite.css("top"));
      var newMana = parseInt(actualMana) - mana;
      $("#mana").text(newMana);

      var magicDiv = $("<div>")
      .addClass(spellClass)
      .css("left", heroX+"px")
      .css("top", heroY+"px");
      container.append(magicDiv);

      if (spellClass=="magicCure"){
        $("#lifes").text("25");
      }
      else if (spellClass = "magicShield"){
        sprite.addClass("hit");
        setTimeout(function(){
          sprite.removeClass("hit");
        }, 10000)
      }

      var magicIteration = 0;
      var magicInterval = setInterval(function(){
        magicIteration++;
        magicDiv.css("background-position", magicIteration*step + "px 0");

        if (magicIteration > frames){
          clearInterval(magicInterval);
          magicDiv.remove();
        }
      }, 80)
    }
  }

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
                if (enemy.attr("data-life") < 1){
                  return false;
                }
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
      else if (enemyType == "harpy"){
        var enemyProperties = enemyPropertiesHarpy;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 1000, easing: "linear"})
            .animate({left: sprite.css("left"), top: sprite.css("top")},
            {duration: 4000, easing: "linear", complete: function(){
              enemy.animate({left: 800, top: randomDirection},
                {duration: 4000, easing: "linear", complete: function(){
                  enemyAnimate(enemy, randomDirection);
                }})
            }});
        }
      }
      else if (enemyType == "blackKnight"){
        var enemyProperties = enemyPropertiesBlackKnight;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 2000, easing: "linear"})
            .animate({left: sprite.css("left"), top: sprite.css("top")},
            {duration: 6000, easing: "linear", complete: function(){
              enemy.animate({left: 800, top: randomDirection},
                {duration: 6000, easing: "linear", complete: function(){
                  enemyAnimate(enemy, randomDirection);
                }})
            }});
        }
      }
      else if (enemyType == "medusa"){
        var enemyProperties = enemyPropertiesMedusa;
        function enemyAnimate(enemy, randomDirection){
          enemy.addClass("shooter")
            .animate({right: "20px"},
            {duration: 2000, easing: "linear", complete: function(){
              clearInterval($(this).attr("data-interval"));
              enemyShoot(enemy, enemyProperties, 4);
            }});
        }
      }
      else if (enemyType == "cyclop"){
        var enemyProperties = enemyPropertiesCyclop;
        function enemyAnimate(enemy, randomDirection){
          enemy.addClass("shooter")
            .animate({right: "20px"},
            {duration: 3000, easing: "linear", complete: function(){
              clearInterval($(this).attr("data-interval"));
              enemyShoot(enemy, enemyProperties, 20);
            }});
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
    if (enemy.hasClass("shooter")){
      return false;
    }
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
    var zIndex = parseInt(enemy.css("top"));
    enemy.attr("data-experience", propertiesObj.experience)
      .attr("data-life", propertiesObj.life)
      .addClass("enemy")
      .css("z-index", zIndex);
  }

  function enemyShoot(enemy, propertiesObj, number){
    var enPosY = parseInt(enemy.css("top"));
    var enPosX = parseInt(enemy.css("left"));
    var iteration = 0;
    var shootInterval = setInterval(function(){
      var animateIteration = 0;
      var enemyShootAnimation = setInterval(function(){
        if (!enemy.hasClass("enemy")){
          clearInterval(shootInterval);
          clearInterval(enemyShootAnimation);
          return false;
        }
        enemy.addClass(propertiesObj.class2);
        animateIteration++;
        enemy.css("background-position", (propertiesObj.moveStart+(animateIteration*propertiesObj.moveStep))+"px 0");

        if (animateIteration > propertiesObj.frames){
          clearInterval(enemyShootAnimation);
          var heroX = parseInt(sprite.css("left"));
          var heroY = parseInt(sprite.css("top"));
          var enemyBullet = $("<div>")
          .addClass("enemyBullet")
          .addClass(propertiesObj.classBullet)
          .css("top", enPosY+propertiesObj.shootY)
          .css("left", enPosX);
          container.append(enemyBullet);
          enemyBullet.animate({left: heroX-10, top: heroY+30},
          {duration: 2000, easing: "linear", complete: function(){$(this).remove();}});
          ++iteration;

          var checkHeroHit = setInterval(function(){
            var enemyBulletX = parseInt(enemyBullet.css("left"));
            var enemyBulletY = parseInt(enemyBullet.css("top"));
            var heroX = parseInt(sprite.css("left"));
            var heroY = parseInt(sprite.css("top"));

            var conditionX = enemyBulletX > heroX && enemyBulletX < heroX+60;
            var conditionY = enemyBulletY > heroY && enemyBulletY < heroY+100;
            var hit = sprite.hasClass("hit");

            if (conditionX && conditionY && !hit){
              clearInterval(checkHeroHit);
              enemyBullet.remove();
              hitHero(propertiesObj.strength);

            }
          }, 20);

          if (iteration >= number){
            clearInterval(shootInterval);
            iteration = 0;
            enemy.removeClass(propertiesObj.class2)
              .animate({left: "-150px", top: heroY},
                {duration: 15000, easing: "linear", complete: function(){$(this).remove();}})
              .removeClass("shooter");
            intervalBGAnimation(propertiesObj, enemy);
          }
        }
      }, 100)

    }, 2000)
  }

  function shoot(posY, posX){
    var heroShootIterate = 0;
    sprite.addClass("heroShooter");

    var heroShootInterval = setInterval(function(){
      sprite.css("background-position", -153 * heroShootIterate + "px" + " 0")
      .addClass("spriteShoot");
      if(sprite.attr("data-shoot") == "thor"){
        sprite.addClass("spriteThor");
      }
      else if(sprite.attr("data-shoot") == "fireballExplosion"){
        sprite.addClass("spriteShootExplosion");
      }
      heroShootIterate++;

      if (heroShootIterate > 2){
        clearInterval(heroShootInterval);
        sprite.removeClass("heroShooter");
        var bullet = $("<div>");
        container.append(bullet);
        killEnemy(bullet);
        sprite.css("background-position", "0 0")
          .removeClass("spriteShoot")
          .removeClass("spriteThor")
          .removeClass("spriteShootExplosion");

        if (sprite.attr("data-shoot") == "fireball"){
          bullet.addClass("bullet")
            .css("top", posY+30)
            .css("left", posX+100);
            bullet.animate({left: posX+1000},
            {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
        }

        else if (sprite.attr("data-shoot") == "fireballExplosion"){
          bullet.addClass("explosionBullet")
            .css("top", posY+20)
            .css("left", posX+100);
            bullet.animate({left: posX+1000},
            {duration: 1000, easing: "linear", complete: function(){
              if (!$(this).hasClass("explosion")){
                $(this).remove();
              }
            }
          });
        }

        else if (sprite.attr("data-shoot") == "thor"){
          bullet.addClass("thunderclap")
            .css("top", posY-5)
            .css("left", posX+50);
            var thorIteration = 0;
            var thorInterval = setInterval(function(){
              thorIteration++;
              bullet.css("background-position", "0 "+thorIteration*101+"px");
              if(thorIteration > 3){
                clearInterval(thorInterval);
                bullet.remove();
              }
            }, 100)
        }
      }
    }, 200);
  }

  function hitHero(power){
    var actualLifes = ($("#lifes").text())-power;
    $("#lifes").text(actualLifes);
    sprite.addClass("hit");
    for (var i = 0; i < 39; i++) {
      sprite.toggle(80);
      i++;
    }
    setTimeout(function(){sprite.removeClass("hit");}, 4000);
  }

  function addExperience(amount){
    var actualExp = parseInt($("#exp").text());
    var newExp = actualExp+parseInt(amount);
    var actualMana = parseInt($("#mana").text());
    var newMana = actualMana+2;
    $("#exp").text(newExp);
    $("#mana").text(newMana);
    if (actualExp > 10){
      sprite.attr("data-shoot", "fireballExplosion");
    }
    else if (actualExp > 200){
      sprite.attr("data-shoot", "thor");
    }
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

    }, 500)
  }

  function killAnimation(toKill, typeProperties){
    var iteration = 0;
    var killAnimation = setInterval(function(){
      iteration++;
      toKill.addClass(typeProperties.destroyClass)
        .css("background-position", (-typeProperties.moveStep*(typeProperties.frames-1))+(iteration*typeProperties.moveStep)+"px "+typeProperties.height+"px")
      clearInterval(toKill.attr("data-interval"));
      if (iteration == typeProperties.frames-1){
        clearInterval(killAnimation);
      }
    }, 50)
  }

  function killEnemy(fireball, magic){
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
        else if ($this.hasClass("enemyMedusa")){
          typeProperties = enemyPropertiesMedusa;
        }
        else if ($this.hasClass("enemyCyclop")){
          typeProperties = enemyPropertiesCyclop;
        }
        else if ($this.hasClass("enemyHarpy")){
          typeProperties = enemyPropertiesHarpy;
        }
        else if ($this.hasClass("enemyBlackKnight")){
          typeProperties = enemyPropertiesBlackKnight;
        }
        if (magic){
          clearInterval(intervalCheck);
          afterHitEnemy($this, typeProperties, 4);
        }
        else if (fireball.hasClass("thunderclap") && fireballPosY+40 >= thisTop+30 && fireballPosY <= thisTop+typeProperties.height-30){
          clearInterval(intervalCheck);
          afterHitEnemy($this, typeProperties, 1);
        }

        else if (fireball.hasClass("explosionBullet") && fireballPosY+40 >= thisTop+30 && fireballPosY <= thisTop+typeProperties.height-30 && fireballPosX >= thisLeft-20 && fireballPosX <= thisLeft+20){
          clearInterval(intervalCheck);
          enemies.each(function(){
            var thisTopAfter = parseInt($(this).css("top"));
            var thisLeftAfter = parseInt($(this).css("left"));

            if(fireballPosY+100 >= thisTopAfter+30 && fireballPosY-100 <= thisTopAfter+typeProperties.height-30 && fireballPosX >= thisLeftAfter-130 && fireballPosX <= thisLeftAfter+130){
              afterHitEnemy($(this), typeProperties, 1);
            }
          })
          fireball.stop();
          var explosionIteration = 0;
          var explosionInterval = setInterval(function(){
            explosionIteration++;
            fireball.addClass("explosion")
              .css("background-position", -2769+explosionIteration*213+"px 0");
              if (explosionIteration > 13){
                fireball.remove();
              }
          }, 60)
        }

        else if (fireball.hasClass("bullet") && fireballPosY+40 >= thisTop+30 && fireballPosY <= thisTop+typeProperties.height-30 && fireballPosX >= thisLeft-20 && fireballPosX <= thisLeft+20){
          clearInterval(intervalCheck);
          fireball.remove();
          afterHitEnemy($this, typeProperties, 1);
        }
      });
    }, 20);
  }

  function afterHitEnemy($this, typeProperties, number){
    $this.attr("data-life", parseInt($this.attr("data-life")-number));
    clearInterval($(this).attr("data-interval"));

    if ($this.attr("data-life") > 0){
      hitEnemy($this, typeProperties);
    }
    else if ($this.attr("data-life") < 1){
      clearInterval($(this).attr("data-interval"));
      $this.stop()
        .removeClass("enemy")
        .css("z-index", 1);
      killAnimation($this, typeProperties);
      clearInterval($(this).attr("data-interval"));
      addExperience($this.attr("data-experience"));
      $this.stop();
    }
  }

  moveSystem(30, 890, 70, 570);
  //createEnemy(15, "ent");
  //createEnemy(5, "mummy");
  createEnemy(5, "blackKnight");
  //createEnemy(5, "medusa");
});
