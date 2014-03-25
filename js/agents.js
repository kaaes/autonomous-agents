(function(global) {
  'use strict';

  var App = global.App;
  App.Agents = App.Agents || {};

  var FILL_STYLE = 'rgba(202,118,57,.5)';
  var VEHICLE_COUNT = 300;
  var MAX_SPEED = 8;
  var SCENE_PADDING = 50;
  var MIN_RADIUS = 8;
  var MAX_RADIUS = 13;
  var MIN_VELOCITY = -3;
  var MAX_VELOCITY = 3;

  var behaviors = App.Behaviors;
  var vehicles = [];
  var target = new Particle();
  var mouseDown = false;

  var pointQuad = true;
  var tree;

  App.Agents.forces = {
    seek: 1,
    flee: 10,
    separate: 1.5,
    align: 1.5,
    cohere: 0,
    flow: 0
  };

  App.Agents.init = function(ctx, width, height) {
    var config = this.config;

    var bounds = {
      x: 0,
      y: 0,
      width: width,
      height: height
    };

    tree = new QuadTree(bounds, pointQuad);

    ctx.fillStyle = FILL_STYLE;

    target.setPosition(
        utils.random(0, width),
        utils.random(0, height)
    );

    setupVehicles(vehicles, VEHICLE_COUNT, width, height);
    draw();

    function draw() {
      ctx.clearRect(0, 0, width, height);
      tree.clear();
      tree.insert(vehicles);
      target.update();
      for (var i = 0; i < vehicles.length; i++) {
        var cell = tree.retrieve(vehicles[i]);
        applyBehaviors(vehicles[i], vehicles, App.Agents.forces);
        vehicles[i].update();
        vehicles[i].draw(ctx);
      }
      requestAnimationFrame(draw);
    }
  }

  App.Agents.onMouseDown = function(evt) {
    mouseDown = true;
  };

  App.Agents.onMouseUp = function(evt) {
    mouseDown = false;
  };

  App.Agents.onMouseMove = function(evt) {
    target.setPosition(evt.clientX, evt.clientY);
  };

  function applyBehaviors(vehicle, cell, forces) {
    var cohere = behaviors.cohere(vehicles, vehicle);
    var align = behaviors.align(vehicles, vehicle);
    var separate = behaviors.separate(vehicles, vehicle);
    var seek = behaviors.seek(target, vehicle);
    var flee = behaviors.flee(target, vehicle);
    var flow = behaviors.flow(vehicle);

    seek.mult(forces.seek);
    separate.mult(forces.separate);
    align.mult(forces.align);
    cohere.mult(forces.cohere);
    flee.mult(mouseDown ? forces.flee : 0);
    flow.mult(forces.flow);

    vehicle.addForce(flow);
    vehicle.addForce(separate);
    vehicle.addForce(align);
    vehicle.addForce(cohere);
    vehicle.addForce(seek);
    vehicle.addForce(flee);

    Vector.recycle(separate);
    Vector.recycle(align);
    Vector.recycle(cohere);
    Vector.recycle(seek);
    Vector.recycle(flee);
    Vector.recycle(flow);
  }

  function setupVehicles(vehicles, vehicleCount, width, height) {
    var vehicle;
    var config = App.Agents.config;
    for (var i = 0; i < vehicleCount; i++) {
      vehicle = new Particle(utils.random(0, width), utils.random(0, height));
      vehicle.constrain(
          -SCENE_PADDING,
          width + SCENE_PADDING,
          -SCENE_PADDING,
          height + SCENE_PADDING
      );
      vehicle.setVelocity(
          utils.random(MIN_VELOCITY, MAX_VELOCITY),
          utils.random(MIN_VELOCITY, MAX_VELOCITY)
      );
      vehicle.radius = utils.random(MIN_RADIUS, MAX_RADIUS);
      vehicle.maxSpeed = MAX_SPEED;
      vehicle.doDraw = drawBoid;
      vehicles.push(vehicle);
      tree.insert(vehicle);
    }
  }

  function drawBoid(ctx) {
    var theta = this.velocity.heading();
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(~~(-this.radius), ~~(-this.radius / 2));
    ctx.lineTo(~~(-this.radius), ~~(this.radius / 2));
    ctx.lineTo(~~(this.radius), 0);
    ctx.closePath();
    ctx.fill();
  }

})(window);
