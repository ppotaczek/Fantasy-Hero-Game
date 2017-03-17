$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyBsczmxTd20B4jRh7_-ywlbZCaFUEmQiUE",
    databaseURL: "https://fantasy-hero.firebaseio.com",
  };
  var app = firebase.initializeApp(config);
  var container = $(".container");
  var gamePanel = $(".panel");
  var sprite = container.find(".sprite");
  var difficulty = 1;
  var maxLifes = 25;
  var mana = $("#mana");
  var lifes = $("#lifes");
  var scores = null;

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
    life: 4,
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
    life: 3,
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
        switch (true){
          case (event.which == 97 && posX >= minPosX):
            spriteAnimateLeft("-=20px");
            break;
          case (event.which == 100 && posX <= maxPosX):
            spriteAnimateLeft("+=20px");
            break;
          case (event.which == 119 && posY >= minPosY):
            spriteAnimateTop("-=20px");
            break;
          case (event.which == 115 && posY <= maxPosY):
            spriteAnimateTop("+=20px");
            break;

          //Shooting
          case (event.which == 32):
            shoot(posY, posX);
            break;
          //Magic
          case (event.which == 49):
            defenseMagic("magicCure", 90, 20, 40);
            break;
          case (event.which == 50):
            defenseMagic("magicShield", 56, 16, 20);
            break;
          case (event.which == 51):
            magicShoot(30);
            break;
          case (event.which == 52):
            armagedon(50);
            break;
        }
      }
    });

    $(".spellCure").on("click", function(){
      var animate = sprite.is(':animated');
      var shooter = sprite.hasClass("heroShooter");
      if (!shooter && !animate){
        defenseMagic("magicCure", 90, 20, 40);
      }
    });

    $(".spellShield").on("click", function(){
      var animate = sprite.is(':animated');
      var shooter = sprite.hasClass("heroShooter");
      if (!shooter && !animate){
        defenseMagic("magicShield", 56, 16, 20);
      }
    });

    $(".spellMagicShoot").on("click", function(){
      var animate = sprite.is(':animated');
      var shooter = sprite.hasClass("heroShooter");
      if (!shooter && !animate){
        magicShoot(30);
      }
    });

    $(".spellArmagedon").on("click", function(){
      var animate = sprite.is(':animated');
      var shooter = sprite.hasClass("heroShooter");
      if (!shooter && !animate){
        armagedon(50);
      }
    });
  };

  function magicShoot(manaCost){
    var actualMana = mana.text();
    var heroX = parseInt(sprite.css("left"));
    var heroY = parseInt(sprite.css("top"));

    if (actualMana >= manaCost){
      var newMana = parseInt(actualMana) - manaCost;
      mana.text(newMana);
      var magicShootDiv = $("<div>")
        .addClass("magicShoot")
        .css("left", heroX+60+"px")
        .css("top", heroY+40+"px");
      magicShootDiv.animate({left: heroX+1000}, {duration: 2000, easing: "linear", complete: function(){$(this).remove()}})
      container.append(magicShootDiv);

      var magicIteration = 0;
      var magicCheckInterval = setInterval(function(){
        magicIteration++;
        magicShootDiv.css("background-position", 128*magicIteration+"px 0");
      });
      killEnemy(magicShootDiv, "magicShoot");
      setTimeout(function(){
        clearInterval(magicCheckInterval);
      }, 2500);
    }
  }

  function armagedon(manaCost){
    var actualMana = mana.text();
    if (actualMana >= manaCost){
      var newMana = parseInt(actualMana) - manaCost;
      mana.text(newMana);
      var armagedonDiv = $("<div>")
        .addClass("armagedon");
      container.append(armagedonDiv);
      killEnemy(armagedonDiv, "armagedon");

      var armagedonIteration = 1;
      var armagedonInterval = setInterval(function(){
        armagedonIteration++;
        armagedonDiv.css("background-image", "url(./images/magic/C06spF"+armagedonIteration+".png)");
        if (armagedonIteration > 19){
          clearInterval(armagedonInterval);
          armagedonDiv.remove();
        }
      }, 60);
    }
  }

  function defenseMagic(spellClass, step, frames, manaCost){
    var actualMana = mana.text();

    if (actualMana >= manaCost){
      var heroX = parseInt(sprite.css("left"));
      var heroY = parseInt(sprite.css("top"));
      var newMana = parseInt(actualMana) - manaCost;
      mana.text(newMana);

      var magicDiv = $("<div>")
        .addClass(spellClass)
        .css("left", heroX+"px")
        .css("top", heroY+"px");
      container.append(magicDiv);

      if (spellClass=="magicCure"){
        lifes.text(maxLifes);
      }
      else if (spellClass = "magicShield"){
        sprite.addClass("hit");
        setTimeout(function(){
          sprite.removeClass("hit");
        }, 20000);
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
    for (var k = 0; k < number; k++){
      if (enemyType == "mummy"){
        var enemyProperties = enemyPropertiesMummy;

        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 3000*difficulty, easing: "linear"})
            .animate({left: "-150px", top: randomDirection},
            {duration: 15000*difficulty, easing: "linear", complete: function(){$(this).remove();}});
        }
      }
      else if (enemyType == "behemoth"){
        var enemyProperties = enemyPropertiesBehemoth;

        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "20px"},
            {duration: 2000*difficulty, easing: "linear", complete: function(){
              enemy.pause()
                .addClass(enemyProperties.class2);
              setTimeout(function(){
                enemy.removeClass(enemyProperties.class2)
                  .resume()
                  .animate({left: "-250px", top: randomDirection},
                    {duration: 13000*difficulty, easing: "linear", complete: function(){$(this).remove();}});
              }, 500);
            }})
        }
      }
      else if (enemyType == "ent"){
        var enemyProperties = enemyPropertiesEnt;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 6000*difficulty, easing: "linear"})
            .animate({left: "-150px", top: randomDirection},
            {duration: 25000*difficulty, easing: "linear", complete: function(){$(this).remove();}});
        }
      }
      else if (enemyType == "harpy"){
        var enemyProperties = enemyPropertiesHarpy;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 1000*difficulty, easing: "linear"})
            .animate({left: sprite.css("left"), top: sprite.css("top")},
            {duration: 4000*difficulty-(parseInt(sprite.css("left"))*3), easing: "linear", complete: function(){
              enemy.animate({left: 800, top: randomDirection},
                {duration: 4000*difficulty-(parseInt(sprite.css("left"))*3), easing: "linear", complete: function(){
                  enemyAnimate(enemy, randomDirection);
                }})
            }});
        }
      }
      else if (enemyType == "blackKnight"){
        var enemyProperties = enemyPropertiesBlackKnight;
        function enemyAnimate(enemy, randomDirection){
          enemy.animate({right: "50px"},
            {duration: 2000*difficulty, easing: "linear"})
            .animate({left: sprite.css("left"), top: sprite.css("top")},
            {duration: 6000*difficulty-(parseInt(sprite.css("left"))*3), easing: "linear", complete: function(){
              enemy.animate({left: 800, top: randomDirection},
                {duration: 6000*difficulty-(parseInt(sprite.css("left"))*3), easing: "linear", complete: function(){
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
            {duration: 2000*difficulty, easing: "linear", complete: function(){
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
            {duration: 3000*difficulty, easing: "linear", complete: function(){
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
      }, enemyProperties.delay*k);
    }
  }

  function intervalBGAnimation(enemyProperties, enemy){
    var animationStep = 1;
    if (enemy.hasClass("shooter")){
      return false;
    }
    var interval = setInterval(function(){

      var heroPosX = parseInt(sprite.css("left"))+63;
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
      else if (thisY + height/3*2 <= heroPosY-100 && thisY + height >= heroPosY-100 && conditionX){
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

    }, 2000*difficulty)
  }

  function shoot(posY, posX){
    var shootSong = $("audio")[5];
    shootSong.play();
    var heroShootIterate = 0;
    sprite.addClass("heroShooter");

    var heroShootInterval = setInterval(function(){
      sprite.css("background-position", -155 * heroShootIterate + "px" + " 0")
      .css("width", "155px")
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
        sprite.removeClass("heroShooter")
        .css("width", "63px");

        var bullet = $("<div>");
        container.append(bullet);
        killEnemy(bullet);

        sprite.css("background-position", "0 0")
          .removeClass("spriteShoot")
          .removeClass("spriteThor")
          .removeClass("spriteShootExplosion");

        if (sprite.attr("data-shoot") === "fireball"){
          bullet.addClass("bullet")
            .css("top", posY+30)
            .css("left", posX+100);
            bullet.animate({left: posX+1000},
            {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
        }

        else if (sprite.attr("data-shoot") === "fireballExplosion"){
          bullet.addClass("explosionBullet")
            .css("top", posY+20)
            .css("left", posX+100);
            bullet.animate({left: posX+1000},
            {duration: 1000, easing: "linear", complete: function(){$(this).remove();}});
        }

        else if (sprite.attr("data-shoot") === "thor"){
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
    var hitSong = $("audio")[4];
    hitSong.play();
    var actualLifes = lifes.text()-power;
    lifes.text(actualLifes);

    if (lifes.text() < 1){
      lifes.text("0");
      setTimeout(function(){
        gameOver();
      }, 500);
    }

    sprite.addClass("hit")
      .css("width", "63px");
    for (var i = 0; i < 40; i++) {
      sprite.toggle(40);
      i++;
    }
    setTimeout(function(){sprite.removeClass("hit");}, 4000);
  }

  function addExperience(amount){
    var experience = $("#exp");
    var actualExp = parseInt(experience.text());
    var newExp = actualExp+parseInt(amount);
    var actualMana = parseInt(mana.text());
    var newMana = actualMana+2;
    experience.text(newExp);
    mana.text(newMana);
    if (newExp > 4000){
      sprite.attr("data-shoot", "thor");
    }
    else if (newExp > 2000){
      sprite.attr("data-shoot", "fireballExplosion");
    }
  }

  function hitEnemy(hit, typeProperties){
    var iteration = 0;
    hit.pause()
      .addClass(typeProperties.destroyClass)
    var hitAnimation = setInterval(function(){
      if (hit.attr("data-life") < 1){
        clearInterval(hitAnimation);
        killAnimation(hit, typeProperties);
        return false;
      }
      iteration++;
      hit.css("background-position", typeProperties.attackStart+(iteration*typeProperties.moveStep)+"px "+typeProperties.height*(-4)+"px");
      if (iteration == typeProperties.frames-1){
        clearInterval(hitAnimation);
      }
    }, 80)
    if (hit.hasClass("enemy")){
      setTimeout(function(){
        hit.resume()
          .removeClass(typeProperties.destroyClass);
      }, 500);
    }
  }

  function afterHitEnemy($this, typeProperties, number){
    $this.attr("data-life", parseInt($this.attr("data-life")-number));

    if ($this.attr("data-life") > 0){
      hitEnemy($this, typeProperties);
    }
    else if ($this.attr("data-life") < 1){
      clearInterval($this.attr("data-interval"));
      $this.css("z-index", 1);
      addExperience($this.attr("data-experience"));
      killAnimation($this, typeProperties);
      $this.stop();
      setTimeout(function(){
        $this.stop()
          .addClass(typeProperties.destroyClass);
      }, 120)
    }
  }

  function killAnimation(toKill, typeProperties){
    toKill.addClass(typeProperties.destroyClass)
      .removeClass("enemy");
    var iteration = 0;
    var killAnimation = setInterval(function(){
      iteration++;
      toKill.css("background-position", (-typeProperties.moveStep*(typeProperties.frames-1))+(iteration*typeProperties.moveStep)+"px "+typeProperties.height+"px")
      clearInterval(toKill.attr("data-interval"));
      if (iteration == typeProperties.frames-1){
        clearInterval(toKill.attr("data-interval"));
        clearInterval(killAnimation);
      }
    }, 50);
    toKill.stop();
  }

  function killEnemy(fireball, magic){
    var intervalCheck = setInterval(function(){
      var enemies = $(".enemy");
      var fireballPosY = parseInt(fireball.css("top"));
      var fireballPosX = parseInt(fireball.css("left"));

      if (magic === "magicShoot"){
        fireball.addClass("bullet");
      }

      enemies.each(function(){
        var $this = $(this);
        var thisTop = parseInt($this.css("top"));
        var thisLeft = parseInt($this.css("left"));
        var typeProperties = null;

        switch(true){
          case ($this.hasClass("enemyMummy")):
            typeProperties = enemyPropertiesMummy;
            break;

          case ($this.hasClass("enemyBehemoth")):
            typeProperties = enemyPropertiesBehemoth;
            break;

          case ($this.hasClass("enemyEnt")):
            typeProperties = enemyPropertiesEnt;
            break;

          case ($this.hasClass("enemyMedusa")):
            typeProperties = enemyPropertiesMedusa;
            break;

          case ($this.hasClass("enemyCyclop")):
            typeProperties = enemyPropertiesCyclop;
            break;

          case ($this.hasClass("enemyHarpy")):
            typeProperties = enemyPropertiesHarpy;
            break;

          case ($this.hasClass("enemyBlackKnight")):
            typeProperties = enemyPropertiesBlackKnight;
            break;
        }

        if (magic === "armagedon"){
          clearInterval(intervalCheck);
          afterHitEnemy($this, typeProperties, 4);
          return true;
        }

        else if (magic === "eruption"){
          var condition1 = fireballPosY+100 >= thisTop+30;
          var condition2 = fireballPosY-100 <= thisTop+typeProperties.height-30;
          var condition3 = fireballPosX >= thisLeft-130;
          var condition4 = fireballPosX <= thisLeft+130;

          if (condition1 && condition2 && condition3 && condition4){
            clearInterval(intervalCheck);
            setTimeout(function(){
              afterHitEnemy($this, typeProperties, 1);
            }, 200);
            return true;
          }
        }

        else if (fireball.hasClass("thunderclap")){
          var condition1 = fireballPosY+40 >= thisTop+30;
          var condition2 = fireballPosY <= thisTop+typeProperties.height-30;
          clearInterval(intervalCheck);

          if (condition1 && condition2){
            setTimeout(function(){
              afterHitEnemy($this, typeProperties, 2);
              fireball.remove();
            }, 200);
            return true;
          }
          else {
            setTimeout(function(){
              fireball.remove();
              return false;
            }, 200);
          }
        }

        else if (fireball.hasClass("bullet")){
          var condition1 = fireballPosY+40 >= thisTop+30;
          var condition2 = fireballPosY <= thisTop+typeProperties.height-30;
          var condition3 = fireballPosX >= thisLeft-20;
          var condition4 = fireballPosX <= thisLeft+20;

          if (condition1 && condition2 && condition3 && condition4){
            clearInterval(intervalCheck);
            fireball.remove();
            if (magic === "magicShoot"){
              afterHitEnemy($this, typeProperties, 4);
              return false;
            }
            else if (fireball.hasClass("bullet")){
              afterHitEnemy($this, typeProperties, 1);
              return false;
            }
          }
        }

        else if (fireball.hasClass("explosionBullet")){
          var condition1 = fireballPosY+40 >= thisTop+30;
          var condition2 = fireballPosY <= thisTop+typeProperties.height-30;
          var condition3 = fireballPosX >= thisLeft-20;
          var condition4 = fireballPosX <= thisLeft+20;

          if (condition1 && condition2 && condition3 && condition4){
            clearInterval(intervalCheck);
            fireball.stop();
            killEnemy(fireball, "eruption");
            var explosionSong = $("audio")[3];
            explosionSong.play();
            var explosionIteration = 0;
            var explosionInterval = setInterval(function(){
              explosionIteration++;
              fireball.addClass("explosion")
                .css("background-position", -2769+explosionIteration*213+"px 0");
                if (explosionIteration > 13){
                  fireball.remove();
                  clearInterval(explosionInterval);
                }
            }, 60)
            return true;
          }
        }
      });
    }, 20);
  }

  function gameOver(){
    var menuSong = $("audio")[1];
    menuSong.play();
    for (var i = 0; i < 9999; i++){
      clearInterval(i);
    }
    var enemies = $(".enemy");
    enemies.stop();
    var result = Math.floor(parseInt($("#exp").text())/difficulty);
    sprite.stop();

    $(".container").removeClass("show");
    $(".panel").removeClass("show");
    $("audio")[2].pause();
    $(".menu").removeClass("hide");
    $("#menuText").addClass("hide");
    $(".gameOver").addClass("show");
    $("#result").text(result);

    $("#saveResult").on("click", function(){
      var tip = $("#tip");
      if ($("#inputName").val().length > 12){
        console.log("max 12");
        tip.text("Error! Max 12 characters");
      }
      else {
        $(this).off();
        highscore("add");
        tip.text("Result saved").css("color", "green");
      }
    });
  }

  function startGame(){
    var audioLaugh = $("audio")[0];
    audioLaugh.play();

    var blackScreen = $(".blackScreen");
    var startText = $(".startText");
    var startAnimation = $(".startAnimation");
    var startAnimationText = $(".startAnimationText");
    var portal = $(".portal");

    $("#inputName").val("");
    $("#tip").text("");
    lifes.text(maxLifes);
    $("#exp").text("0");
    mana.text("100");
    sprite.removeClass("hit")
      .attr("data-shoot", "fireball");
    blackScreen.addClass("show")
    .css("display", "block")
      .addClass("startScreen");
    startText.fadeIn(2000);

    setTimeout(function(){
      blackScreen.removeClass("startScreen");
      startText.fadeOut(0);
      startAnimation.addClass("show");
      startAnimationText.fadeIn(2000);

      var startIteration = 0;
      var startInterval = setInterval(function(){
        startAnimation.css("background-position", -213*startIteration+"px 0");
        startIteration++;
        if (startIteration > 13){
          clearInterval(startInterval);
        }
      }, 90);

      setTimeout(function(){
        var battleSong = $("audio")[2];
        battleSong.play();
        startAnimationText.fadeOut(0);
        startAnimation.removeClass("show");
        blackScreen.removeClass("show");
        container.addClass("show");
        gamePanel.addClass("show");
        clearBattlefield();
        portal.css("display", "none");
        level1();
      }, 3000);
    }, 3000)

    function level1(){
      container.css("background-image", "url(./images/Battleback_snow1.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(25, "mummy");
      createPortal(30000, 2);
    }

    function level2(){
      container.css("background-image", "url(./images/Battleback_snow2.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(3, "medusa");
      createEnemy(5, "ent");
      createEnemy(15, "mummy");
      createPortal(30000, 3);
    }

    function level3(){
      container.css("background-image", "url(./images/Battleback_snow3.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(1, "blackKnight");
      createEnemy(3, "cyclop");
      createEnemy(10, "harpy");
      createPortal(30000, 4);
    }

    function level4(){
      container.css("background-image", "url(./images/Battleback_snow4.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(5, "cyclop");
      createEnemy(5, "medusa");
      createEnemy(10, "ent");
      createEnemy(3, "harpy");
      createPortal(30000, 5);
    }

    function level5(){
      container.css("background-image", "url(./images/Battleback_snow5.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(5, "blackKnight");
      createEnemy(7, "behemoth");
      createEnemy(15, "ent");
      createEnemy(5, "medusa");
      createPortal(40000, 6);
    }

    function level6(){
      container.css("background-image", "url(./images/Battleback_snow6.png)");
      moveSystem(30, 890, 70, 570);
      createEnemy(10, "blackKnight");
      createEnemy(10, "cyclop");
      createEnemy(10, "behemoth");
      createPortal(40000, 7);
    }

    function clearBattlefield(){
      sprite.removeClass("hit");
      container.children().each(function(){
        clearInterval($(this).attr("data-interval"));
        $(this).stop();
      })
      container.children().not("div.sprite").not("div.portal").not("div.backToMenu").remove();
      blackScreen.fadeIn(200).fadeOut(200);
      sprite.css({top: 400, left: 0});
      for (var i = 0; i < 9999; i++){
        clearInterval(i);
      }
      return false;
    }

    function createPortal(time, number){
      setTimeout(function(){
        portal.fadeIn(2000);
        var portalInterval = setInterval(function(){
          var spriteX = parseInt(sprite.css("left"));
          var spriteY = parseInt(sprite.css("top"));
          if (spriteX > 770 && spriteY < 410 && spriteY > 210){
            sprite.stop();
            portal.hide();
            clearInterval(portalInterval);
            clearBattlefield();
            if (number == 7){
              gameOver();
            }
            eval('level'+number+'()');
          }
        }, 40)
      }, time);
    }
  }

  function getHighScore(){
    var results = app.database().ref();

    results.on("value", function(data) {
      scores = data.val();
    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  function highscore(method){
    var arrKeys = [];
    var arrValues = [];
    var finalResult = $("#result").text();

    finalResult = parseInt(finalResult);
    $.map(scores, function(value, key) {
      arrKeys.push(key);
      arrValues.push(value);
    })
    arrKeys.reverse();
    arrValues.reverse();

    if (method === "add" && typeof finalResult === 'number' && finalResult < 13000){
      var results = app.database().ref();
      var finalObj = {};
      var finalName = $("#inputName").val();
      arrKeys.push(finalResult);
      arrKeys.sort(function(a, b){return b-a});
      var realIndex = $.inArray(finalResult, arrKeys);
      arrValues.splice(realIndex, 0, finalName);
      for (var i = 0; i < 10; i++){
        if (finalObj[arrKeys[i]] == null){
          finalObj[arrKeys[i]] = arrValues[i];
        }
        else {
          finalObj[arrKeys[i]-1] = arrValues[i];
        }
      }
      results.set(finalObj);
      return true;
    }

    var namesList = $("#highscoreNames");
    var scoresList = $("#highscoreResults");

    namesList.children().remove();
    scoresList.children().remove();

    for (var i = 0; i < 10; i++){
      scoresList.append($("<li>"+arrKeys[i]+"</li>").addClass("highscoreItems"));
      namesList.append($("<li>"+arrValues[i]+"</li>").addClass("highscoreItems"));
    }
  }

  function main(){
    var menuContainer = $(".menu");
    var startBtn = $("#start");
    var optionsBtn = $("#options");
    var scoreBtn = $("#score");
    var backBtn = $(".back");
    var menuText = $("#menuText");
    var scorePanel = $(".scoreScreen");
    var easyBtn = $("#easy");
    var mediumBtn = $("#medium");
    var hardBtn = $("#hard");
    var sound = $("#sound");
    var optionsContainer = $(".optionsScreen");
    var instructionsBtn = $("#instructions");
    var instructionsContainer = $(".instructionsScreen");

    var menuSong = $("audio")[1];
    menuSong.play();
    getHighScore();

    startBtn.on("click", function(){
      menuContainer.addClass("hide");
      menuSong.pause();
      startGame();
    });

    optionsBtn.on("click", function(){
      menuText.addClass("hide");
      backBtn.addClass("show");
      optionsContainer.addClass("show");
    });

    instructionsBtn.on("click", function(){
      menuText.addClass("hide");
      backBtn.addClass("show");
      instructionsContainer.addClass("show");
    });

    scoreBtn.on("click", function(){
      menuText.addClass("hide");
      scorePanel.addClass("show");
      backBtn.addClass("show");
      highscore();
    });

    easyBtn.on("click", function(){
      difficulty = 1.5;
      maxLifes = 30;
      lifes.text(maxLifes);
      easyBtn.addClass("selected");
      mediumBtn.removeClass("selected");
      hardBtn.removeClass("selected");
    });

    mediumBtn.on("click", function(){
      difficulty = 1;
      maxLifes = 25;
      lifes.text(maxLifes);
      mediumBtn.addClass("selected");
      easyBtn.removeClass("selected");
      hardBtn.removeClass("selected");
    });

    hardBtn.on("click", function(){
      difficulty = 0.5;
      maxLifes = 20;
      lifes.text(maxLifes);
      hardBtn.addClass("selected");
      easyBtn.removeClass("selected");
      mediumBtn.removeClass("selected");
    });

    sound.on("click", function(){
      if (sound.text()=="Sound ON"){
        sound.text("Sound OFF");
        $('audio').prop("volume", 0);
      }
      else if (sound.text()=="Sound OFF"){
        sound.text("Sound ON");
        $('audio').prop("volume", 1);
      }
    });

    backBtn.on("click", function(){
      menuText.removeClass("hide");
      scorePanel.removeClass("show");
      backBtn.removeClass("show");
      optionsContainer.removeClass("show");
      instructionsContainer.removeClass("show");
    });

    $("#exit").on("click", function(){
      $(".gameOver").removeClass("show");
      $("#saveResult").off();
      menuText.removeClass("hide");
    });

    $("#again").on("click", function(){
      $(".gameOver").removeClass("show");
      $("#saveResult").off();
      menuContainer.addClass("hide");
      menuSong.pause();
      startGame();
    });

    $(".backToMenu").on("click", function(){
      gameOver();
    });
  }

  main();
});
