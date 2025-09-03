import * as constants from '../../nonConstants';

const {
  WATER,
  SAND,
  water,
  sand,
  // desert,
  grass_warm,
  // grass_cool,
} = constants;

export type Island = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  elevationX: number;
  elevationY: number;
  elevation: number;
  pixels: Array<[number, number]>;
}

const isIslandWithinMargin = (island: Island, mapSize: number): boolean => {
  if (island.minX < 1 || island.minY < 1 || island.maxX >= mapSize - 1 || island.maxY >= mapSize - 1) {
    return false;
  } else if (island.minX == Infinity || island.minY == Infinity || island.maxX == -Infinity || island.maxY == -Infinity) {
    return false;
  }
  return true;
}

export const findIslands = (grid: number[][], mapSize: number) => {
  const visited = new Set();
  const islands = [];

  const getIslandBoundsAndElevation = (startX: number, startY: number): Island => {
    const stack = [[startX, startY]];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let elevationX = startX;
    let elevationY = startY;
    let elevation = 0;
    const pixels: Array<[number, number]> = [];

    while (stack.length > 0) {
      const [x, y] = stack.pop() ?? [0, 0];
      if (x < 0 || x >= mapSize || y < 0 || y >= mapSize) {
        continue;
      }
      if (visited.has(`${x},${y}`)) {
        continue;
      }
      visited.add(`${x},${y}`);
      if (grid[y][x] > WATER) {
        pixels.push([x, y]);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        if (grid[y][x] > elevation) {
          elevation = grid[y][x];
          elevationX = x;
          elevationY = y;
        }
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
    return { minX, minY, maxX, maxY, elevation, elevationX, elevationY, pixels };
  }

  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      if (!visited.has(`${x},${y}`) && grid[y][x] >= WATER) {
        const island = getIslandBoundsAndElevation(x, y);
        // only consider islands within the bounds of the canvas
        if (isIslandWithinMargin(island, mapSize)) {
          console.log(`Found island at (${island.minX},${island.minY}) to (${island.maxX},${island.maxY}) with elevation ${island.elevation} at (${island.elevationX},${island.elevationY}), size ${island.pixels.length}`);
          islands.push(island);
        }
      }
    }
  }

  return islands;
};

export const drawIslands = (
  ctx: CanvasRenderingContext2D,
  islands: Island[],
  noiseGrid: number[][],
  mapSize: number,
) => {
  // create a mapSize x mapSize 2d array initialized to 0
  console.log('mapSize:', mapSize, typeof mapSize);
  const finalNoise = Array.from({ length: mapSize }, () => (new Array(mapSize)).fill(0));
  const dt = finalNoise.reduce((acc, row) => acc + row.join(',') + '\n', '');
  console.log(dt);
  console.log('mapSize:', mapSize);
  console.log(`Drawing ${islands.length} islands`);
  for (const island of islands) {
    for (const [x, y] of island.pixels) {
      const c = noiseGrid[y][x];
      if (c <= WATER) {
        ctx.fillStyle = water;
      } else if (c <= SAND) {
        ctx.fillStyle = sand;
        finalNoise[y][x] = c;
      } else {
        ctx.fillStyle = grass_warm;
        finalNoise[y][x] = c;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return finalNoise;
};
