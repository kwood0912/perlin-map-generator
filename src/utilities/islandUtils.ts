import * as constants from '../constants';

const {
  WATER,
  SHALLOW,
  SHALLOWER,
  SHALLOWEST,
  SAND,
  LIGHT_GRASS,
  water,
  shallow,
  shallowest_sand,
  shallowest_tundra,
  shallower_sand,
  shallower_tundra,
  sand_warm,
  sand_cool,
  desert,
  snow,
  lightGrass_warm,
  lightGrass_cool,
  grass_warm,
  grass_cool,
} = constants;
export type Island = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  elevationX: number;
  elevationY: number;
  elevation: number;
}

const isIslandWithinMargin = (island: Island, mapSize: number): boolean => {
  if (island.minX < 1 || island.minY < 1 || island.maxX >= mapSize - 1 || island.maxY >= mapSize - 1) {
    return false;
  }
  return true;
}

export const findIslands = (grid: number[][], mapSize: number) => {
  const visited = new Set();
  const islands = [];
  const islandsFragments = [];

  const getIslandBoundsAndElevation = (startX: number, startY: number): Island => {
    const stack = [[startX, startY]];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let elevationX = startX;
    let elevationY = startY;
    let elevation = 0;

    while (stack.length > 0) {
      const [x, y] = stack.pop() ?? [0, 0];
      if (x < 0 || x >= mapSize || y < 0 || y >= mapSize) {
        continue;
      }
      if (visited.has(`${x},${y}`)) {
        continue;
      }
      visited.add(`${x},${y}`);
      if (grid[y][x] >= WATER) {
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
    return { minX, minY, maxX, maxY, elevation, elevationX, elevationY };
  }

  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      if (!visited.has(`${x},${y}`) && grid[y][x] >= WATER) {
        const island = getIslandBoundsAndElevation(x, y);
        // only consider islands within the bounds of the canvas
        if (isIslandWithinMargin(island, mapSize)) {
          islands.push(island);
        } else {
          // use nearest neighbor to remove any island fragments that are too close to the edge
          // but still get rendered due to being within the bounds of another island
          islandsFragments.push(island);
        }
      }
    }
  }

  return {
    islands,
    islandsFragments
  };
};

export const drawIslands = (
  ctx: CanvasRenderingContext2D,
  islands: Island[],
  noiseGrid: number[][]
) => {
  for (const island of islands) {
    const midY = Math.floor((island.minY + island.maxY) / 2);
    for (let y = island.minY; y <= island.maxY; y++) {
      for (let x = island.minX; x <= island.maxX; x++) {
        const c = noiseGrid[y][x];
        if (c < WATER) {
          ctx.fillStyle = water;
        } else if (c <= SHALLOW) {
          ctx.fillStyle = shallow;
        } else if (c <= SHALLOWER) {
          if (midY < 400 || midY > 1600) {
            ctx.fillStyle = shallower_tundra;
          } else {
            ctx.fillStyle = shallower_sand;
          }
        } else if (c <= SHALLOWEST) {
          if (midY < 400 || midY > 1600) {
            ctx.fillStyle = shallowest_tundra;
          } else {
            ctx.fillStyle = shallowest_sand;
          }
        } else if (c <= SAND) {
          if (midY < 400 || midY > 1600) {
            ctx.fillStyle = snow;
          } else if (midY < 600 || midY > 1400) {
            ctx.fillStyle = sand_cool;
          } else {
            ctx.fillStyle = sand_warm; // desert is same as warm sand
          }
        } else if (c <= LIGHT_GRASS) {
          if (midY < 400 || midY > 1600) {
            ctx.fillStyle = snow;
          } else if (midY < 600 || midY > 1400) {
            ctx.fillStyle = lightGrass_cool;
          } else if (midY < 800 || midY > 1200) {
            ctx.fillStyle = lightGrass_warm;
          } else {
            ctx.fillStyle = desert; // desert is same as warm sand
          }
        } else {
          if (midY < 400 || midY > 1600) {
            ctx.fillStyle = snow;
          } else if (midY < 600 || midY > 1400) {
            ctx.fillStyle = grass_cool;
          } else if (midY < 800 || midY > 1200) {
            ctx.fillStyle = grass_warm;
          } else {
            ctx.fillStyle = desert;
          }
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

const doesIslandFragmentOverlap = (island: Island, fragment: Island): boolean => {
  return !(island.minX > fragment.maxX || island.maxX < fragment.minX ||
           island.minY > fragment.maxY || island.maxY < fragment.minY);
};

export const scrubIslandFragments = (
  ctx: CanvasRenderingContext2D,
  islands: Island[],
  islandsFragments: Island[],
) => {
  for (const fragment of islandsFragments) {
    const overlapping = islands.some(island => doesIslandFragmentOverlap(island, fragment));
    if (overlapping) {
      // start at the elevation point and fill outwards
      ctx.fillStyle = constants.water;
      
    }
  }
}
