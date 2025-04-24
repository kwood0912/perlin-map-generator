import Rand from 'rand-seed';

class PerlinNoise {
  gradients: Record<string, { x: number; y: number }>;
  rand: Rand;
  seed: string;

  constructor(_seed?: string) {
    this.seed = _seed ?? Math.random().toString(36).substring(2, 15);
    console.log(`PerlinNoise seed: ${this.seed}`);
    this.gradients = {};
    this.rand = new Rand(this.seed);
  }

  randomVector(): { x: number; y: number } {
    const theta = this.rand.next() * 2 * Math.PI;
    return { x: Math.cos(theta), y: Math.sin(theta) };
  }

  dotProductGrid(x: number, y: number, vx: number, vy: number): number {
    const d_vect = { x: x - vx, y: y - vy };

    let g_vect = this.gradients[`[${vx},${vy}]`];
    if (!g_vect) {
      g_vect = this.randomVector();
      this.gradients[`[${vx},${vy}]`] = g_vect;
    }

    return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
  }

  smootherStep(x: number): number {
    return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
  }

  interpolate(x: number, a: number, b: number): number {
    return a + this.smootherStep(x) * (b - a);
  }

  get(x: number, y: number): number {
    const xf = Math.floor(x);
    const yf = Math.floor(y);

    // Interpolate
    const tl = this.dotProductGrid(x, y, xf, yf);
    const tr = this.dotProductGrid(x, y, xf + 1, yf);
    const bl = this.dotProductGrid(x, y, xf, yf + 1);
    const br = this.dotProductGrid(x, y, xf + 1, yf + 1);

    const xt = this.interpolate(x - xf, tl, tr);
    const xb = this.interpolate(x - xf, bl, br);
    const v = this.interpolate(y - yf, xt, xb);

    return v;
  }
}

export default PerlinNoise;