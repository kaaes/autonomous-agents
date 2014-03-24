function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector._vectors = []

Vector.get = function(x, y) {
  var v = Vector._vectors.pop() || new Vector();
  v.x = x || 0;
  v.y = y || 0;
  return v;
}

Vector.recycle = function(v) {
  Vector._vectors.push(v);
}

/* static methods */
Vector.add = function(v1, v2) {
  return Vector.get(v1.x + v2.x, v1.y + v2.y);
};

Vector.sub = function(v1, v2) {
  return Vector.get(v1.x - v2.x, v1.y - v2.y);
};

Vector.mult = function(v, scale) {
  return Vector.get(v.x * scale, v.y * scale);
};

Vector.div = function(v, scale) {
  if (scale == 0) return;
  return Vector.mult(v, 1 / scale);
};

Vector.angle = function(v1, v2) {
  return Math.atan2(v2.y - v1.y, v2.x - v1.x);
}

Vector.angleBetween = function(v1, v2) {
  return Math.acos(v1.dot(v2) / (v1.magnitude() * v2.magnitude()));
}

Vector.dist = function(v1, v2) {
  return v1.dist(v2);
}

Vector.distSq = function(v1, v2) {
  return v1.distSq(v2);
}

/* dynamic methods */
Vector.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  return this;
};

Vector.prototype.sub = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

Vector.prototype.mult = function(scale) {
  this.x *= scale;
  this.y *= scale;
  return this;
};

Vector.prototype.div = function(scale) {
  this.x /= scale;
  this.y /= scale;
  return this;
};

/* the length of the vector */
Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.magSq = function() {
  return this.x * this.x + this.y * this.y;
};

/* vector coords for magnitude 1 */
Vector.prototype.normalize = function() {
  var m = this.magnitude();
  if (m) this.div(m);
  return this;
};

Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
};

Vector.prototype.heading = function() {
  return Math.atan2(this.y, this.x);
}

Vector.prototype.limit = function(magnitude) {
  if(this.magnitude() > magnitude) {
    this.normalize();
    this.mult(magnitude);
  }
}

Vector.prototype.dot = function(vector) {
  return this.x * vector.x + this.y * vector.y;
}

Vector.prototype.dist = function(v) {
  var dx = this.x - v.x;
  var dy = this.y - v.y;
  return Math.sqrt(dx * dx + dy * dy);
};

Vector.prototype.distSq = function(v) {
  var dx = this.x - v.x;
  var dy = this.y - v.y;
  return dx * dx + dy * dy;
};



