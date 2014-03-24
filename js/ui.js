(function(global) {
  'use strict';

  var patternCanvas = App.elements.patternCanvas;
  var agentsCanvas = App.elements.agentsCanvas;
  var flowCanvas = App.elements.flowCanvas;

  var parent = App.elements.canvasesParent;

  var width = window.innerWidth;
  var height = window.innerHeight;

  patternCanvas.width = width;
  patternCanvas.height = height;

  agentsCanvas.width = width;
  agentsCanvas.height = height;

  flowCanvas.width = width;
  flowCanvas.height = height;

  parent.addEventListener('mousemove', function(evt) {
    App.Agents.onMouseMove(evt);
  });

  parent.addEventListener('mousedown', function(evt) {
    App.Agents.onMouseDown(evt);
  });

  parent.addEventListener('mouseup', function(evt) {
    App.Agents.onMouseUp(evt);
  });

  var controls = App.elements.forceControls;

  var names = Object.keys(controls);
  names.forEach(function(f) {
    controls[f].value = App.Agents.forces[f];
    controls[f].addEventListener('change', function(evt) {
      App.Agents.forces[f] = parseInt(this.value, 10) || 0;
    });
  });

  var showFlow = App.elements.showFlowField;
  showFlow.addEventListener('change', function(evt) {
    if (this.checked) {
      App.FlowField.draw();
    } else {
      App.FlowField.clear();
    }
  });

  App.Pattern.init(patternCanvas.getContext('2d'), width, height);
  App.FlowField.init(flowCanvas.getContext('2d'), width, height);
  App.Agents.init(agentsCanvas.getContext('2d'), width, height);
})(window);