(function(global) {
  'use strict';

  var App = global.App;
  App.Pattern = App.Pattern || {};

  App.Pattern.config = {
    tile: 10,
    fillStyle: 'hsl(0,100%,0%)',
    strokeStyle: 'hsl(0,0%,10%)',
    globalAlpha: 0.1,
    colors: [
      'hsl(0,0%,30%)',
      'hsl(0,0%,40%)',
      'hsl(0,0%,50%)'
    ]
  }

  App.Pattern.init = function(ctx, width, height) {
    var config = this.config;

    ctx.globalAlpha = config.globalAlpha;
    ctx.fillStyle = config.fillStyle;
    ctx.strokeStyle = config.strokeStyle;

    draw(ctx, width, height, config.tile);
  }

  function draw(ctx, width, height, tile) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    drawPattern(ctx, width, height, tile);
    ctx.restore();
  }

  function drawPattern(ctx, width, height, tile) {
    // vertical height of the tile - it's triangle
    // so we need to calculate it based on the side
    var tileH = (0.5 + 0.5 * Math.sqrt(3) * tile) | 0;
    
    // round'em up
    var rows = (1.5 + height / tileH) | 0;
    var cols = (1.5 + width / tile) | 0;
    
    for (var j, i = 0; i < rows; i++) { 
        ctx.save();
        ctx.translate(-tile + tile/2 * (i % 2), i * tileH);
        for (j = 0; j < cols; j++) {
          drawModule(ctx, tile);
          ctx.translate(tile, 0);
        }
        ctx.restore();
      }
  }

  // One module is two triangles 
  function drawModule(ctx, tile) {
    var colors = App.Pattern.config.colors;
    ctx.save();
    drawTriangle(ctx, tile, colors[utils.random(0, colors.length - 1)]);   
    ctx.translate(tile, 0);
    ctx.rotate(-Math.PI / 3);
    drawTriangle(ctx, tile, colors[utils.random(0, colors.length - 1)]);
    ctx.restore();
  }

  function drawTriangle(ctx, tile, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (var i = 0; i < 3; i++) {
        ctx.lineTo(tile, 0);
        ctx.translate(tile, 0);
        ctx.rotate(-2 * Math.PI / 3);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
})(window);