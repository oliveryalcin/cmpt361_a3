class Framebuffer {
  constructor(opts) {
    // how many "pixels" fit in the length of the canvas
    this.pixelsWide = opts.pixelsWide;
    // initialize context and shader program
    this.canvas = opts.canvas;
    this.gl = this.canvas.getContext('webgl');
    // initialize buffer to contain pixel colors
    this.buffer = new Array(opts.pixelsWide * opts.pixelsWide);
    this.buffer.fill(null);

    // check for gl context
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }
    this.shaderSetUp(this.gl);
  }

  shaderSetUp(gl) {
    let vertProgram =
      'attribute vec3 vPosition;' +
      'attribute vec4 vColor;' +
      'varying vec4 fColor;' +
      'void main() {' +
        ' gl_Position = vec4(vPosition, 1.0);' +
        ' fColor = vColor;' +
      '}';

    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertProgram);
    gl.compileShader(vertShader);

    let fragProgram =
      'precision mediump float;' +
      'varying vec4 fColor;' +
      'void main() {' +
        ' gl_FragColor = fColor;' +
      '}';

    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragProgram);
    gl.compileShader(fragShader);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertShader);
    gl.attachShader(this.shaderProgram, fragShader);
    gl.linkProgram(this.shaderProgram);
    gl.useProgram(this.shaderProgram);
  }

  bindVertexBuffers(gl, vertices, colors) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vPositionLoc = gl.getAttribLocation(this.shaderProgram, "vPosition");
    gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let vColorLoc = gl.getAttribLocation(this.shaderProgram, "vColor");
    gl.vertexAttribPointer(vColorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorLoc);
  }

  // takes in x and y coordinates and an array of float r/g/b values and sets given pixel to given color
  setPixel(x, y, color) {
    console.assert(Number.isInteger(x) && Number.isInteger(y), "non-integer pixel coordinates: " + x + "," + y);
    console.assert(x >= 0 && x < this.pixelsWide, "invalid x coordinate: " + x);
    console.assert(y >= 0 && y < this.pixelsWide, "invalid y coordinate: " + y);
    this.buffer[y * this.pixelsWide + x] = color;
  }

  display() {
    let V = [];  // vertex positions array
    let C = [];  // vertex colors array
    let w = this.pixelsWide;
    for (let x = 0; x < w; ++x) {
      for (let y = 0; y < w; ++y) {
        const color = this.buffer[y * w + x];
        if (color) {
          V.push(x / w * 2 - 1, y / w * -2 + 1, 0.0);
          V.push(x / w * 2 - 1, (y + 1) / w * -2 + 1, 0.0);
          V.push((x + 1) / w * 2 - 1, (y + 1) / w * -2 + 1, 0.0);
          V.push(x / w * 2 - 1, y / w * -2 + 1, 0.0);
          V.push((x + 1) / w * 2 - 1, y / w * -2 + 1, 0.0);
          V.push((x + 1) / w * 2 - 1, (y + 1) / w * -2 + 1, 0.0);

          for (let i = 0; i < 6; i++) {
            C.push(...color);
          }
        }
      }
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.bindVertexBuffers(this.gl, V, C);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, V.length / 3);
  }

  clear() {
    this.buffer.fill(null);
    this.gl.clearColor(0.9, 0.9, 0.9, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  saveImage(filename) {
    filename = filename || "image.png"
    const dataUrl = this.canvas.toDataURL();
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}

export { Framebuffer };
