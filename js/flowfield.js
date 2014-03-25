(function(global) {
  'use strict';

  var App = global.App;
  App.FlowField = App.FlowField || {};

  var STROKE_STYLE = 'rgba(255,255,255,.1)';
  var LINE_WIDTH = 1;
  var NOISE_STEP = 0.05;
  var GRID_SIZE = 30;

  var grid = [];
  var angles = [];

  var rows;
  var cols;

  var ctx;
  var width;
  var height;

  var column = 0;
  var row = 0;
  var field = [];

  App.FlowField.init = function(context, canvasWidth, canvasHeight) {
    var noise = new SimplexNoise();

    ctx = context;
    width = canvasWidth;
    height = canvasHeight;

    cols = Math.ceil(width / GRID_SIZE);
    rows = Math.ceil(height / GRID_SIZE);

    ctx.strokeStyle = STROKE_STYLE;
    ctx.lineWidth = LINE_WIDTH;

    makeNoise(noise, grid, cols, rows);
  }

  App.FlowField.draw = function() {
    drawGrid(ctx, angles, cols, rows);
  }

  App.FlowField.clear = function() {
    ctx.clearRect(0, 0, width, height);
  }

  App.FlowField.lookup = function(vector) {
    column = (vector.x / GRID_SIZE) | 0;
    row = (vector.y / GRID_SIZE) | 0;
    field = grid[row] || grid[0];
    field = field[column] || field[0];
    return Vector.get(field.x, field.y);
  }

  function drawGrid(ctx, grid, cols, rows) {
    ctx.save();
    for (var j, i = 0; i < rows; i++) {
      ctx.save();
      ctx.translate(0, i * GRID_SIZE);
      for (j = 0; j < cols; j++) {
        ctx.save();
        ctx.translate(0.5 * GRID_SIZE, 0.5 * GRID_SIZE);
        ctx.rotate(grid[i][j]);
        ctx.beginPath();
        ctx.moveTo((-0.4 * GRID_SIZE) | 0, 0);
        ctx.lineTo((0.4 * GRID_SIZE) | 0, 0);
        ctx.moveTo((0.25 * GRID_SIZE) | 0, (-0.15 * GRID_SIZE) | 0);
        ctx.lineTo((0.4 * GRID_SIZE) | 0, 0);
        ctx.lineTo((0.25 * GRID_SIZE) | 0, (0.15 * GRID_SIZE) | 0);
        ctx.stroke();
        ctx.restore();
        ctx.translate(GRID_SIZE, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function makeNoise(noise, grid, cols, rows) {
    var xoff = 0;
    var yoff = 0;

    var n;
    var angle;

    for (var j, i = 0; i < rows; i++) {
      xoff = 0;
      for (j = 0; j < cols; j++) {
        n = noise.noise2D(xoff, yoff, 0);
        angle = utils.map(n, -1, 1, 0, 2 * Math.PI);
        grid[i] = grid[i] || [];
        grid[i][j] = Vector.get(Math.cos(angle), Math.sin(angle));

        angles[i] = angles[i] || [];
        angles[i][j] = angle;

        xoff += 0.05;
      }
      yoff += 0.05;
    }
  }

})(window);