export const generateBinaryFile = (noiseGrid: number[][], fileName = "world.bin") => {
  const rows = noiseGrid.length;
  const cols = noiseGrid[0].length;
  const buffer = new ArrayBuffer(rows * cols * 2);
  const view = new DataView(buffer);

  let offset = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = Math.max(0, Math.min(65535, Math.round(noiseGrid[y][x]))); // clamp just in case
      view.setUint16(offset, value, true); // true = little-endian
      offset += 2;
    }
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  document.removeChild(a);
};

const colorToTileMap: Record<string, number> = {
  X3C5E8B: 0, // deepest water
  X4F8FBA: 1, // shallow water
  X73BED3: 2, // shallower water
  XD0DA91: 3, // shallowest sand
  XC8E6E6: 4, // shallowest tundra
  XE8C170: 5, // sand
  XEBEDE9: 6, // snow tundra
  XA8CA58: 7, // light grass
  X75A743: 8, // grass
  X468232: 9, // light alpine grass
  X25562E: 10, // alpine grass
};

// Convert RGB to hex string (e.g. 66CCFF → "X66CCFF")
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0').toUpperCase();
  return 'X' + toHex(r) + toHex(g) + toHex(b);
}

function colorToTileIndex(r: number, g: number, b: number): number {
  const hex = rgbToHex(r, g, b);
  const tileIndex = colorToTileMap[hex];
  return tileIndex !== undefined ? tileIndex : -1;
}

// Main export function
export const downloadCanvasAsBinary = (ctx: CanvasRenderingContext2D, fileName = "world.bin") => {
  const {width, height} = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const buffer = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const tileIndex = colorToTileIndex(r, g, b);
      buffer[y * width + x] = tileIndex;
    }
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}

