'use strict';

function clamp(v, l, h) {
  if (v < l) { return l; }
  else if (v > h) { return h; }
  else { return v; }
}

function sigmoid(x) {
  return 2 / (1 + Math.exp(-5 * x)) - 1;
}

class Canvas {
  constructor(window, elem) {
    this._elem = elem;
    this.context = elem.getContext('2d');
    this.objects = [];
    this.resize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', (event) => this.resize(window.innerWidth, window.innerHeight), false);
  }


  get width() { return this._elem.width; }
  get height() { return this._elem.height; }

  resize(w, h) {
    this._elem.width = w;
    this._elem.height = h;
  }
  add(o) { this.objects.push(o); }

  clear() {
    var ctx = this.context;
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  redraw() {
    this.clear();
    var ctx = this.context;
    for (var o of this.objects) {
      o.draw(this);
    }
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  draw(canvas) {
    var ctx = canvas.context;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

class Ball {
  constructor(window, r) {
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.r = r;
    window.addEventListener('deviceorientation', (event) => this.orient(event), true);
    window.addEventListener('resize', (event) => this.resize(window.innerWidth, window.innerHeight), false);
  }

  orient(event) {
    this.alpha = event.alpha;
    this.beta = sigmoid(clamp(event.beta / 90, -1, 1));
    this.gamma = sigmoid(clamp(event.gamma / 90, -1, 1));
    console.log(event);
  }

  resize(w, h) {
    this.w = w;
    this.h = h;
  }

  draw(canvas) {
    var ctx = canvas.context;
    ctx.beginPath();
    ctx.arc(this.w/2 * (1 + this.gamma), this.h/2 * (1 + this.beta), this.r, 0, 2*Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

var C;
var O;
var R;

function animloop(f) {
  function step() {
    f();
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

function onload() {
  C = new Canvas(window, document.getElementById('display'));
  var ball = new Ball(window, 20);
  C.add(ball);
  animloop(() => C.redraw());
}
