export const generateBinaryFile = (noiseGrid: number[][], fileName = "world.bin") => {
  const rows = noiseGrid.length;
  const cols = noiseGrid[0].length;
  const buffer = new ArrayBuffer(rows * cols);
  const view = new DataView(buffer);

  let offset = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = Math.max(0, Math.min(255, Math.round(noiseGrid[y][x]))); // clamp just in case
      view.setUint8(offset, value);
      offset += 1;
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

