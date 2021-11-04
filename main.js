window.onload = function(){

  var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width = window.innerWidth,
  height = canvas.height = window.innerHeight;

  var CLOTH_WIDTH = 30;
  var CLOTH_HEIGHT = 30;
  var CLOTH_SPACE = 8;
  var allParticles = new Array(CLOTH_HEIGHT);


  for(var j = 0; j < CLOTH_HEIGHT; j++){
    allParticles[j] = new Array(CLOTH_WIDTH);
  }

  for(var i = 0; i < CLOTH_HEIGHT; i++){
    for(var j = 0; j < CLOTH_WIDTH; j++){
      allParticles[i][j] = new verletparticle(width/2 + j * CLOTH_SPACE, height/2 + i * CLOTH_SPACE, 0, 0, 0.1, false, i == 0);
    }
  }

  for(var i = 0; i < CLOTH_HEIGHT; i++){
    for(var j = 0; j < CLOTH_WIDTH; j++){
      if(i == CLOTH_HEIGHT - 1 && j < CLOTH_WIDTH - 1){
        allParticles[i][j].linkTo(allParticles[i][j + 1], CLOTH_SPACE);
        continue;
      }
      if(j == CLOTH_WIDTH - 1 && i < CLOTH_HEIGHT - 1){
        allParticles[i][j].linkTo(allParticles[i + 1][j], CLOTH_SPACE);
        continue;
      }
      if(i == CLOTH_WIDTH - 1 && j == CLOTH_HEIGHT - 1){
        break;
      }
      allParticles[i][j].linkTo(allParticles[i + 1][j], CLOTH_SPACE);
      allParticles[i][j].linkTo(allParticles[i][j + 1], CLOTH_SPACE);
    }
  }


  update();

  function update(){
    context.clearRect(0, 0 , width, height);

    for(var k = 0; k < 3; k++){
      for(var i = 0; i < CLOTH_HEIGHT; i++){
        for(var j = 0; j < CLOTH_HEIGHT; j++){
          allParticles[i][j].update();
          allParticles[i][j].constraintPoints(width, height);
        }
      }
    }


    renderGame();
    requestAnimationFrame(update);
  }

  function renderGame(){
    context.clearRect(0, 0, width, height);
    for(var i = 0; i < CLOTH_HEIGHT; i++){
      for(var j = 0; j < CLOTH_HEIGHT; j++){
        var p = allParticles[i][j];
        if(p.renderable){
          context.beginPath();
          context.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
          context.stroke();
        }
        for(var k = 0; k < p.links.length; k++){
          if(p.links[k].renderable){
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(p.links[k].p1.x, p.links[k].p1.y);
            context.stroke();
          }
        }
      }
    }

  }

  document.body.addEventListener("mousemove", function(event){
    for(var i = 0; i < CLOTH_WIDTH; i++){
      allParticles[0][i].x = (i - CLOTH_WIDTH / 2) * CLOTH_SPACE + event.clientX;
      allParticles[0][i].y = event.clientY;
    }
  });

};
