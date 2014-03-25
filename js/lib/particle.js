function Particle(x, y) {
  if (typeof Vector !== 'function') {
    throw new Error('Vector is necessary for Particle well being!');
  }

  this.position = Vector.get(~~x, ~~y);
  this.velocity = Vector.get();
  this.acceleration = Vector.get();

  this.x = this.position.x;
  this.y = this.position.y;

  this.radius = 1;
  this.mass = 1;
  this.maxSpeed = 0;
}

Particle.G = 1;

Particle.prototype.fillColor = 'black';

Particle.prototype.setPosition = function(x, y) {
  this.position.x = ~~x;
  this.position.y = ~~y;

  this.x = this.position.x;
  this.y = this.position.y;
};

Particle.prototype.setVelocity = function(x, y) {
  this.velocity.x = x;
  this.velocity.y = y;
};

Particle.prototype.addForce = function(force) {
  this.acceleration.add(force);
};

Particle.prototype.constrain = function(fromX, toX, fromY, toY) {
  this.constrainX = [fromX, toX];
  this.constrainY = [fromY, toY];
};

Particle.prototype.update = function(ctx) {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0);

  if (this.radius < 0) {
    this.radius = 0;
  }

  if (this.constrainX) {
    if (this.position.x + this.radius > this.constrainX[1]) {
      this.velocity.x *= -1;
      this.position.x = this.constrainX[1] - this.radius;
    }

    if (this.position.x <= this.constrainX[0] + this.radius) {
      this.velocity.x *= -1;
      this.position.x = this.constrainX[0] + this.radius;
    }

    // if (this.position.x > this.constrainX[1] + this.radius) {
    //   this.position.x = this.constrainX[0];
    // }

    // if (this.position.x < this.constrainX[0] - this.radius) {
    //   this.position.x = this.constrainX[1];
    // }
  }

  if (this.constrainY) {
    if (this.position.y + this.radius > this.constrainY[1]) {
      this.velocity.y *= -1;
      this.position.y = this.constrainY[1] - this.radius;
    }


    if (this.position.y <= this.constrainY[0] + this.radius) {
      this.velocity.y *= -1;
      this.position.y = this.constrainY[0] + this.radius;
    }
    // if (this.position.y > this.constrainY[1] + this.radius) {
    //   this.position.y = this.constrainY[0];
    // }

    // if (this.position.y < this.constrainY[0] - this.radius) {
    //   this.position.y = this.constrainY[1];
    // }
  }
};

Particle.prototype.limitVelocity = function() {
  if (this.maxSpeed && this.velocity.magSq() > this.maxSpeed * this.maxSpeed) {
    this.velocity.normalize();
    this.velocity.mult(this.maxSpeed);
  }
};

Particle.prototype.draw = function(ctx) {
  ctx.save();
  //ctx.fillStyle = this.fillColor;
  ctx.translate(~~(0.5 + this.position.x), ~~(0.5 + this.position.y));
  this.doDraw(ctx);
  ctx.restore();
};

Particle.prototype.doDraw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius, 0, Math.PI / 2);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
};

Particle.prototype.attract = function(mover) {
  var force = Vector.sub(this.position, mover.position);
  var distance = force.magnitude();

  distance = distance < 20 ? 20 : distance > 30 ? 30 : distance;

  force.normalize();
  var strength = (Particle.G * this.mass * mover.mass) / (distance * distance);

  force.mult(strength);

  return force;
};

Particle.prototype.doesCollide = function(particle) {
  var dist = Vector.get(
      this.position.x - particle.position.x,
      this.position.y - particle.position.y
      );
  var magn = dist.magnitude();
  Vector.recycle(dist);
  return magn <= this.radius + particle.radius;
};
