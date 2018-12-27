'use strict';

class Canvas {
  constructor(elem) {
    this.elem = elem;
    this.context = elem.getContext('2d');
    this.objects = [];
  }

  initialize(window) {
    window.addEventListener('resize', (event) => this.resize(window), false);
    this.resize(window);
    this.clear();
  }

  add(o) {
    this.objects.push(o);
  }

  resize(window) {
    this.elem.width = window.innerWidth;
    this.elem.height = window.innerHeight;
  }

  clear() {
    var ctx = this.context;
    ctx.beginPath();
    ctx.rect(0, 0, this.elem.width, this.elem.height);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  redraw() {
    this.clear();
    var ctx = this.context;
    for (var o of this.objects) {
      o.draw(ctx);
    }
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

class InteractiveCircle extends Circle {
  initialize(window) {
    window.addEventListener('deviceorientation', (event) => this.orient(event), true);
  }

  orient(event) {
    console.log('yay');
    console.log(event);
  }
}

var C;
var O;

function animloop(f) {
  function step() {
    f();
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

function onload() {
  C = new Canvas(document.getElementById('display'));
  C.initialize(window);
  O = new InteractiveCircle(50, 50, 20);
  O.initialize(window);
  C.add(O);
  animloop(() => C.redraw());
}
