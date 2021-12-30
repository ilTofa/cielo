var audioContext = new AudioContext();
var bufferSize = 4096;
var pinkNoise = (function () {
  var b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
  node.onaudioprocess = function (e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = white * 0.115926;
    }
  };
  return node;
})();

pinkNoise.connect(audioContext.destination);
setTimeout(function () {
  pinkNoise.disconnect(audioContext.destination);
}, 4000);

var canvas = null;
var context = null;
var time = 0;
var intervalId = 0;

var makeNoise = function () {
  var imgd = context.createImageData(canvas.width, canvas.height);
  var pix = imgd.data;

  for (var i = 0, n = pix.length; i < n; i += 4) {
    var c = 7 + Math.sin(i / 50000 + time / 7); // A sine wave of the form sin(ax + bt)
    pix[i] = pix[i + 1] = pix[i + 2] = 40 * Math.random() * c; // Set a random gray
    pix[i + 3] = 255; // 100% opaque
  }

  context.putImageData(imgd, 0, 0);
  time = (time + 1) % canvas.height;
};

var setup = function () {
  canvas = document.getElementById("tv");
  context = canvas.getContext("2d");
};

window.onload = function () {
  setup();
  intervalId = setInterval(makeNoise, 75);
};
