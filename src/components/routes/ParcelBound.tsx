import { useEffect, useRef, useState } from "react";
import PerlinNoise from "../../classes/PerlinNoise";
import * as constants from "../../pbConstants";
import { drawIslands, findIslands } from "../../utilities/parcelbound/islandUtils";
import { ConfigForm } from "../ConfigForm";
import { downloadCanvasAsBinary } from "../../utilities/parcelbound/downloadUtils";

export default function ParcelBound() {
  const noiseGrid = useRef<number[][]>([]);
  const [seed, setSeed] = useState<string>('3nywolsp75h');
  const [mapSize, setMapSize] = useState<number>(2000);
  const [frequency, setFrequency] = useState<number>(9);
  const [perlin, setPerlin] = useState<PerlinNoise>(new PerlinNoise(seed));
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    const cnvs = document.getElementById('cnvs') as HTMLCanvasElement;  
    if (cnvs) {
      cnvs.width = mapSize;
      cnvs.height = mapSize;
      const ctx = cnvs.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }
    setPerlin(new PerlinNoise(seed));
  }, [mapSize, seed]);

  useEffect(() => {
    if (context) {
      context.fillStyle = constants.water;
      context.fillRect(0, 0, mapSize, mapSize);
      const resolution = mapSize / frequency;
      const numPixels = frequency / resolution;
      let px = 0;
      let py = 0;
      for (let y = 0; y < frequency; y += numPixels / frequency) {
        noiseGrid.current[py] = [];
        for (let x = 0; x < frequency; x += numPixels / frequency) {
          const p = perlin.get(x, y);
          let c = Math.round(p * 1000);
          c += 500;
          c = Math.max(0, Math.min(c, 1000));
          noiseGrid.current[py][px] = c;
          px++;
        }
        px = 0;
        py++;
      }
      const islands = findIslands(noiseGrid.current, mapSize);
      drawIslands(context, islands, noiseGrid.current);
    }
  }, [context, mapSize, frequency, perlin]);

  return (
    <div className='container-fluid' style={{ height: '100vh', backgroundColor: 'tan' }}>
      <div className='row h-100'>
        <div className='col-2 h-100 pt-2' style={{ backgroundColor: 'beige', borderRight: '2px solid brown' }}>
          <h2 className='text-center'>Parcelbound</h2>
          <p className="text-center">Island Generator Tool</p>
          <ConfigForm
            mapSize={mapSize}
            frequency={frequency}
            seed={seed}
            onSubmit={(config) => {
              setSeed(config.seed);
              setMapSize(config.mapSize);
              setFrequency(config.frequency);
              setPerlin(new PerlinNoise(config.seed));
              console.log(`New seed: ${config.seed}`);
            }}
          />
          <div className='mt-3'>
            <button
              className='btn btn-info d-block w-100'
              onClick={() => {
                if (context) {
                  downloadCanvasAsBinary(context, 'world.bin');
                }
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