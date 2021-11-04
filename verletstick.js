function verletstick(p0, p1, renderable, length){
  this.p0 = p0;
  this.p1 = p1;
  this.length = length || utils.distanceXY(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
  this.renderable = renderable == undefined ? true : renderable;

  this.update = function(){
    var dx = (this.p1.x - this.p0.x),
        dy = (this.p1.y - this.p0.y),
        dist = Math.sqrt(dx * dx + dy * dy),
        norm = (this.length - dist) / dist / 2;

    if(!this.p0.anchored){
      this.p0.x -= dx * norm;
      this.p0.y -= dy * norm;
    }
    if(!this.p1.anchored){
      this.p1.x += dx * norm;
      this.p1.y += dy * norm;
    }
  }

}
