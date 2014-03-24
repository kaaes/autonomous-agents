var utils = {
  random: function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  },

  rad: function(angle) {
    return angle * Math.PI/180;
  },

  normalize: function(value, range) {
  	return value / range;
  },

  denormalize: function(value, range, precision) {
  	precision = precision || 1;
  	return Math.round((value * range) / precision) * precision;
  },

  map: function(value, fromMin, fromMax, toMin, toMax, opt_precision) {
  	var precision = opt_precision || 1;
  	var fromRange = fromMax - fromMin;
  	var fromValue = value - fromMin;

  	var normalized = fromValue / fromRange;

  	var toRange = toMax - toMin;
  	var toValue = normalized * toRange;

  	return toValue + toMin;
  }
};

// (function() {
// 	console.log(utils.map(1, 0, 5, 0, 10) === 2);
// 	console.log(utils.map(0.1, 0, 5, 0, 10) === 0.2);
// 	console.log(utils.map(3, 1, 5, 0, 4) === 2);
// 	console.log(utils.map(0.01, 0, 1, 0, 1000) === 10);
// })();