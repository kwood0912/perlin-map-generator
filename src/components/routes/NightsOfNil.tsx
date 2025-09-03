import { useRef } from "react";
import PerlinNoise from "../../classes/PerlinNoise";
import * as constants from "../../pbConstants";
import { drawIslands, findIslands } from "../../utilities/nightsofnil/islandUtils";
import { generateBinaryFile } from "../../utilities/nightsofnil/downloadUtils";
import { ConfigForm } from "../ConfigForm";

export default function NightsOfNil() {
  const noiseGrid = useRef<number[][]>([]);
  const finalNoise = useRef<number[][]>([]);

  const generateWorld = (
    seed: string,
    mapSize: number,
    frequency: number
  ) => {
    mapSize = Number(mapSize);
    const ctx = configureCanvas(mapSize);
    if (ctx) {
      const perlin = new PerlinNoise(seed);
      console.log(`Generating world with seed ${seed}, mapSize ${mapSize}, frequency ${frequency}`);
      ctx.fillStyle = constants.water;
      ctx.fillRect(0, 0, mapSize, mapSize);
      const resolution = mapSize / frequency;
      const numPixels = frequency / resolution;
      let px = 0;
      let py = 0;

      for (let y = 0; y < frequency; y += numPixels / frequency) {
        noiseGrid.current[py] = [];
        for (let x = 0; x < frequency; x += numPixels / frequency) {
          const p = perlin.get(x, y);
          let c = Math.round(p * 100);
          c += 50;
          c = Math.max(0, Math.min(c, 100)); // clamp to [0, 100]
          noiseGrid.current[py][px] = c;
          px++;
        }
        px = 0;
        py++;
      }
      const islands = findIslands(noiseGrid.current, mapSize);
      finalNoise.current = drawIslands(ctx, islands, noiseGrid.current, mapSize);
    }
  };

  const configureCanvas = (mapSize: number) => {
    const cnvs = document.getElementById('cnvs') as HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    if (cnvs) {
      cnvs.width = mapSize;
      cnvs.height = mapSize;
      ctx = cnvs.getContext('2d');
      console.log(`Configured canvas context`);
    }
    return ctx;
  };

  return (
    <div className='container-fluid' style={{ height: '100vh', backgroundColor: 'tan' }}>
      <div className='row h-100'>
        <div className='col-2 h-100 pt-2' style={{ backgroundColor: 'beige', borderRight: '2px solid brown' }}>
          <h2 className='text-center'>Nights of Nil</h2>
          <p className="text-center">Island Generator Tool</p>
          <ConfigForm
            onSubmit={(config) => {
              console.log(`submitted form ${JSON.stringify(config, null, 2)}`);
              generateWorld(config.seed, config.mapSize, config.frequency);
            }}
          />
          <div className='mt-3'>
            <button
              className='btn btn-info d-block w-100'
              onClick={() => {
                generateBinaryFile(finalNoise.current, 'world.bin');
              }}
            >
              Download Binary
            </button>
          </div>
        </div>
        <div className='col-10 d-flex justify-content-center align-items-center' style={{ overflow: 'hidden' }}>
          <canvas
            id='cnvs'
            style={{
              width: 800,
              height: 'auto', 
              maxWidth: '100%', 
              maxHeight: '100%', 
              display: 'block',
            }}
          >
          </canvas>
        </div>
      </div>
    </div>
  )
}
