(function(global) {
  'use strict';

  var App = global.App;
  App.Behaviors = App.Behaviors || {};

  var MAX_FORCE = 0.1;
  var FLOCK_DISTANCE = 50;
  var FLEE_DISTANCE = 200;

  var i = 0;
  var distanceSq = 0;
  var count = 0;
  var interactionDistance = 0;

  App.Behaviors.seek = function(target, mover) {
    var desired = Vector.sub(target.position, mover.position);
    desired.normalize();
    desired.mult(mover.maxSpeed);

    var steer = Vector.sub(desired, mover.velocity);
    steer.limit(MAX_FORCE);
    Vector.recycle(desired);
    return steer;
  }

  App.Behaviors.flee = function(target, mover) {
    distanceSq = Vector.distSq(target.position, mover.position);
    var steer;
    if (distanceSq < FLEE_DISTANCE * FLEE_DISTANCE) {
      var desired = Vector.sub(mover.position, target.position);
      desired.normalize();
      desired.mult(mover.maxSpeed);

      steer = Vector.sub(desired, mover.velocity);
      steer.limit(MAX_FORCE);
      Vector.recycle(desired);
    } else {
      steer = Vector.get();
    }
    return steer;
  }

  App.Behaviors.align = function(vehicles, mover) {
    var sum = Vector.get();
    var steer = Vector.get();

    count = 0;

    for (i = 0; i < vehicles.length; i++) {
      distanceSq = Vector.distSq(mover.position, vehicles[i].position);
      if (distanceSq > 0 && distanceSq < FLOCK_DISTANCE * FLOCK_DISTANCE) {
        sum.add(vehicles[i].velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(mover.maxSpeed);
      steer = Vector.sub(sum, mover.velocity);
      steer.limit(MAX_FORCE);
    }
    Vector.recycle(sum);
    return steer;
  }

  App.Behaviors.separate = function(vehicles, mover) {
    var sum = Vector.get();
    var steer = Vector.get();
    var diff;

    count = 0;

    for (i = 0; i < vehicles.length; i++) {
      interactionDistance = mover.radius + vehicles[i].radius;
      distanceSq = Vector.distSq(mover.position, vehicles[i].position);
      if (distanceSq > 0 && distanceSq < interactionDistance * interactionDistance) {
        diff = Vector.sub(mover.position, vehicles[i].position);
        diff.normalize();
        diff.div(distanceSq);
        sum.add(diff);
        count++;
        Vector.recycle(diff);
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(mover.maxSpeed);
      steer = Vector.sub(sum, mover.velocity);
    }

    Vector.recycle(sum);
    steer.limit(MAX_FORCE);
    return steer;
  }

  App.Behaviors.cohere = function(vehicles, mover) {
    var sum = Vector.get();
    var steer = Vector.get();
    var desired;

    count = 0;

    for (i = 0; i < vehicles.length; i++) {
      distanceSq = Vector.distSq(mover.position, vehicles[i].position);
      if (distanceSq > 0 && distanceSq < FLOCK_DISTANCE * FLOCK_DISTANCE) {
        sum.add(vehicles[i].position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      desired = Vector.sub(sum, mover.position);
      steer = Vector.sub(desired, mover.velocity);
      Vector.recycle(desired);
    }
    Vector.recycle(sum);
    steer.limit(MAX_FORCE);
    return steer;
  }

  App.Behaviors.flow = function(mover) {
    var desired = App.FlowField.lookup(mover.position);
    desired.mult(mover.maxSpeed);
    var steer = Vector.sub(desired, mover.velocity);
    steer.limit(MAX_FORCE);
    Vector.recycle(desired);
    return steer;
  }

})(window);