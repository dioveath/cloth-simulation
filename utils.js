var utils = {

  norm: function(value, min, max){
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max){
    return min + norm * (max - min);
  },

  map: function(value, srcMin, srcMax, destMin, destMax){
    return lerp(norm(value, srcMin, srcMax), destMin, destMax);
  },

  clamp: function(value, min, max){
    return Math.min(Math.max(min, max), Math.max(Math.min(min, max), value));
  },

  randomRange: function(min, max){
    return min + Math.random() * (max - min);
  },

  randomInt: function(min, max){
    return min + Math.floor(Math.random(max - min + 1));
  },

  radToDeg: function(rad){
    return rad / Math.PI * 180;
  },

  degToRad: function(deg){
    return deg / 180 * Math.PI;
  },

  normDist: function(min, max, iteration){
    var total = 0;
    for(var i = 0; i <= iteration; i++){
      total += utils.randomRange(min, max);
    }
    return total / iteration;
  },

  distanceXY: function(x0, y0, x1, y1){
    var dx = x1 - x0,
        dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  pointInCircle: function(c0, x, y){
    return (utils.distanceXY(c0.x, c0.y, x, y) < c0.radius);
  },

  circleCollision: function(c0, c1){
    return (utils.distanceXY(c0.x, c0.y, c1.x, c1.y) < (c0.radius + c1.radius));
  },

  inRange: function(value, min, max){
    return (value >= Math.min(min, max) && value <= Math.max(min, max));
  },

  pointInRect: function(r0, x, y){
    return (utils.inRange(x, r0.x, r0.x + r0.width) && utils.inRange(y, r0.y, r0.y + r0.height));
  },

  rangeIntersect: function(min0, max0, min1, max1){
    return Math.min(min1, max1) <= Math.max(min0, max0) &&
           Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function(r0, r1){
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
           utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    /*
    return (utils.pointInRect(r0, r1.x           , r1.y) ||
            utils.pointInRect(r0, r1.x + r1.width, r1.y) ||
            utils.pointInRect(r0, r1.x           , r1.y + r1.height) ||
            utils.pointInRect(r0, r1.x + r1.width, r1.y + r1.height));
            */
  },

  blockRectangles: function(r0, r1){
    var cx0 = r0.x + (r0.width/2),
        cy0 = r0.y + (r0.height/2),
        cx1 = r1.x + (r1.width/2),
        cy1 = r1.y + (r1.height/2),
        dx = cx1 - cx0,
        dy = cy1 - cy0,
        absDx = Math.abs(dx),
        absDy = Math.abs(dy),
        tWidth = r0.width/2 + r1.width/2,
        tHeight = r0.height/2 + r1.height/2;

    if(absDx < tWidth && absDy < tHeight){
      var overlapx = tWidth - absDx,
          overlapy = tHeight - absDy;
      if(absDy > absDx){
        if(dy > 0){
          r0.y = r0.y - overlapy;
          return 1;
        } else {
          r0.y = r0.y + overlapy;
          return 3;
        }
      } else {
        if(dx > 0){
          r0.x = r0.x - overlapx;
          return 0;
        } else {
          r0.x = r0.x + overlapx;
          return 2;
        }
      }
    }
    return -1;
  },

  //BezierCurves
  lerpPoint: function(p0, p1, t, fPoint){
    fPoint = fPoint || {};
    fPoint.x = utils.lerp(t, p0.x, p1.x);
    fPoint.y = utils.lerp(t, p0.y, p1.y);
    return fPoint;
  },

  quadraticBezier: function(p0, p1, p2, t, fPoint){
    fPoint = fPoint || {};
    var pA = utils.lerpPoint(p0, p1, t),
        pB = utils.lerpPoint(p1, p2, t);
    utils.lerpPoint(pA, pB, t, fPoint);
    return fPoint;
  },

  cubicBezier: function(p0, p1, p2, p3, t, fPoint){
    fPoint = fPoint || {};
    var pA = utils.lerpPoint(p0, p1, t),
        pB = utils.lerpPoint(p1, p2, t),
        pC = utils.lerpPoint(p2, p3, t);
    utils.lerpPoint(pA, pB, pC, t, fPoint);
    return fPoint;
  },

  controlPointThrough: function(p0, p1, p2, cp){
    cp = cp || {};
    cp.x = (p1.x * 2) - (p0.x + p2.x) / 2;
    cp.y = (p1.y * 2) - (p0.y + p2.y) / 2;
    return cp;
  },

  drawQuadraticMulticurve: function(points, context){
    var p0, p1, mPoint = {};

    context.moveTo(points[0].x, points[0].y);
    for(var i = 1; i < points.length - 2; i+= 1){
      p0 = points[i];
      p1 = points[i + 1];
      mPoint.x = (p0.x + p1.x) / 2;
      mPoint.y = (p0.y + p1.y) / 2;
      context.quadraticCurveTo(p0.x, p0.y, mPoint.x, mPoint.y);
    }

    p0 = points[points.length - 2];
    p1 = points[points.length - 1];
    context.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
  },

  drawBezierMulticurve: function(points, context){
    var p0 = points[0], p1, p2;

    context.beginPath();
    for(var i = 1; i < points.length - 2; i += 1){
      var p1 = points[i],
          p2 = points[i + 1],
          mPoint = {};
      mPoint.x = (p1.x + p2.x) / 2;
      mPoint.y = (p1.y + p2.y) / 2;
      context.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, mPoint.x, mPoint.y);
      p0 = mPoint;
    }
    p1 = points[points.length - 2];
    p2 = points[points.length - 1];
    context.bezierCurveTo(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y);
  },

};
