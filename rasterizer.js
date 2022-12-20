class Rasterizer {
  constructor(opts) {
    this.framebuffer = opts.framebuffer;
  }

  parse(input) {
    this.framebuffer.clear();
    console.log("Rasterizer input:\n" + input);

    // separate vertex, point, line, and face definitions
    const lines = input.split(';').map(l => l.trim());
    const vLines = lines.filter(l => l.startsWith("v"));
    const pLines = lines.filter(l => l.startsWith("p"));
    const lLines = lines.filter(l => l.startsWith("l"));
    const tLines = lines.filter(l => l.startsWith("t"));

    // parse vertices
    let V = [];
    vLines.forEach(vLine => {
      const p = vLine.split(',');
      // parse x, y, r, g, b and push into vertices
      const x = parseFloat(p[1]);
      const y = parseFloat(p[2]);
      const r = parseFloat(p[3]);
      const g = parseFloat(p[4]);
      const b = parseFloat(p[5]);
      V.push([x, y, [r, g, b]]);
    });

    // parse triangle definitions
    tLines.forEach(tLine => {
      const p = tLine.split(',');
      const v1 = parseInt(p[1]);
      const v2 = parseInt(p[2]);
      const v3 = parseInt(p[3]);
      console.log("Drawing triangle: " + p);
      this.drawTriangle(V[v1], V[v2], V[v3]);
    });

    // parse line definitions
    lLines.forEach(lLine => {
      const p = lLine.split(',');
      const v1 = parseInt(p[1]);
      const v2 = parseInt(p[2]);
      console.log("Drawing line: " + p);
      this.drawLine(V[v1], V[v2]);
    });

    // parse point definitions
    pLines.forEach(pLine => {
      const p = pLine.split(',');
      const v1 = parseInt(p[1]);
      console.log("Drawing point: " + p);
      const v = V[v1];
      this.setPixel(Math.floor(v[0]), Math.floor(v[1]), v[2]);
    });
  }

  setPixel(x, y, color) {
    this.framebuffer.setPixel(x, y, color);
  }
}

export { Rasterizer };
