window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame;

function AnimationFrame(frameCallback, deferStart) {
	if (!requestAnimationFrame || !cancelRequestAnimationFrame) {
		throw new Error('Animation frame support required!');
	}

  this._raf = null;

  this.running = false;

	this.frameCallback = frameCallback.bind(this);
  this.run = this.run.bind(this);
	this.stop = this.stop.bind(this);

  if (!deferStart) {
    this.start();
  }
}

AnimationFrame.prototype.run = function() {
	this.frameCallback();
  if (this.running) {
	 this._raf = requestAnimationFrame(this.run);
  }
};

AnimationFrame.prototype.start = function() {
  this.running = true;
  this.run();
};

AnimationFrame.prototype.stop = function() {
  this.running = false;
};
