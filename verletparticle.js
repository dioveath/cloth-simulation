function verletparticle(x, y, speed, direction, grav, renderable, anchored){
  this.x = x || 0;
  this.y = y || 0;
  this.vx = Math.cos(direction || 0) * speed || 0;
  this.vy = Math.sin(direction || 0) * speed || 0;
  this.oldx = this.x - this.vx;
  this.oldy = this.y - this.vy;
  this.radius = 1;
  this.friction = 0.95;
  this.bounce = 0.4;
  this.gravity = grav || 0;
  this.anchored = anchored;
  this.renderable = renderable == undefined ? true : renderable;
  this.links = [];

  this.update = function(){
    if(!this.anchored){
      this.vx = (this.x - this.oldx) * this.friction;
      this.vy = (this.y - this.oldy) * this.friction;
      this.oldx = this.x;
      this.oldy = this.y;
      this.x += this.vx;
      this.y += this.vy;
      this.y += this.gravity;
    }
  }

  this.constraintPoints = function(width, height){
    for(var i = 0; i < this.links.length; i++){
      this.links[i].update();
    }
    if(this.x > width - this.radius){
      this.x = width - this.radius;
      this.oldx = this.x + this.vx * this.bounce;
    } else if(this.x < this.radius){
      this.x = this.radius;
      this.oldx = this.x + this.vx * this.bounce;
    }
    if(this.y > height - this.radius){
      this.y = height - this.radius;
      this.oldy = this.y + this.vy * this.bounce;
    } else if(this.y < this.radius){
      this.y = this.radius;
      this.oldy = this.y + this.vy * this.bounce;
    }
  }

  this.linkTo = function(p1, renderable, length){
    this.links.push(new verletstick(this, p1, renderable, length));
  }

}
