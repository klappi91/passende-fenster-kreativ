/**
 * Bilinear interpolation over the 200 mm price-point grid.
 *
 * DB layout: article_price_points has (article_id, group_id, width_mm, height_mm, base_price_cents)
 * with a 200 mm raster. For arbitrary (w, h) we pick the 4 surrounding grid
 * corners and linearly blend. If any corner is missing we fall back to the
 * nearest available point and set a warning.
 */

export type PricePoint = { width_mm: number; height_mm: number; base_price_cents: number };

export type PriceInterpolationResult = {
  base_price_cents: number;
  base_price_eur: number;
  interpolated: boolean;
  warning?: string;
  used_points: Array<{ w: number; h: number; price_cents: number }>;
  clamped_w?: number;
  clamped_h?: number;
};

const STEP = 200;

function quantizeDown(v: number): number {
  return Math.floor(v / STEP) * STEP;
}
function quantizeUp(v: number): number {
  return Math.ceil(v / STEP) * STEP;
}

/**
 * Pure fn: takes the *full list of price points* for one article+group and a
 * query (w, h). Returns the interpolated price. Does not touch the DB.
 */
export function interpolatePrice(
  points: PricePoint[],
  w: number,
  h: number
): PriceInterpolationResult | null {
  if (!points.length) return null;

  // Bounds of raster
  const widths = new Set(points.map((p) => p.width_mm));
  const heights = new Set(points.map((p) => p.height_mm));
  const minW = Math.min(...widths);
  const maxW = Math.max(...widths);
  const minH = Math.min(...heights);
  const maxH = Math.max(...heights);

  let warning: string | undefined;
  let clampedW: number | undefined;
  let clampedH: number | undefined;

  const origW = w;
  const origH = h;

  if (w < minW) {
    clampedW = minW;
    w = minW;
    warning = `width ${origW}mm below raster min ${minW}mm — clamped`;
  } else if (w > maxW) {
    clampedW = maxW;
    w = maxW;
    warning = `width ${origW}mm above raster max ${maxW}mm — clamped`;
  }
  if (h < minH) {
    clampedH = minH;
    h = minH;
    warning = (warning ? warning + "; " : "") + `height ${origH}mm below raster min ${minH}mm — clamped`;
  } else if (h > maxH) {
    clampedH = maxH;
    h = maxH;
    warning = (warning ? warning + "; " : "") + `height ${origH}mm above raster max ${maxH}mm — clamped`;
  }

  // Grid corners (clamped into raster)
  const w0 = Math.max(minW, Math.min(maxW, quantizeDown(w)));
  let w1 = Math.max(minW, Math.min(maxW, quantizeUp(w)));
  const h0 = Math.max(minH, Math.min(maxH, quantizeDown(h)));
  let h1 = Math.max(minH, Math.min(maxH, quantizeUp(h)));
  if (w0 === w1 && w1 + STEP <= maxW) w1 = w1 + STEP;
  if (h0 === h1 && h1 + STEP <= maxH) h1 = h1 + STEP;

  // Build lookup
  const key = (x: number, y: number) => `${x}x${y}`;
  const priceByCoord = new Map<string, number>();
  for (const p of points) priceByCoord.set(key(p.width_mm, p.height_mm), p.base_price_cents);

  const corners: Array<{ w: number; h: number; price: number | undefined }> = [
    { w: w0, h: h0, price: priceByCoord.get(key(w0, h0)) },
    { w: w1, h: h0, price: priceByCoord.get(key(w1, h0)) },
    { w: w0, h: h1, price: priceByCoord.get(key(w0, h1)) },
    { w: w1, h: h1, price: priceByCoord.get(key(w1, h1)) },
  ];

  // Fallback for missing corners: nearest neighbour by manhattan distance
  const missing = corners.filter((c) => c.price === undefined);
  if (missing.length) {
    warning = (warning ? warning + "; " : "") +
      `missing ${missing.length} raster corner(s), used nearest-neighbour fallback`;
    for (const c of missing) {
      let best: PricePoint | null = null;
      let bestD = Infinity;
      for (const p of points) {
        const d = Math.abs(p.width_mm - c.w) + Math.abs(p.height_mm - c.h);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      if (best) c.price = best.base_price_cents;
    }
  }

  if (corners.some((c) => c.price === undefined)) {
    return null;
  }

  const [p00, p10, p01, p11] = corners.map((c) => c.price!) as [number, number, number, number];

  const tx = w1 === w0 ? 0 : (w - w0) / (w1 - w0);
  const ty = h1 === h0 ? 0 : (h - h0) / (h1 - h0);

  const priceCents =
    p00 * (1 - tx) * (1 - ty) +
    p10 * tx * (1 - ty) +
    p01 * (1 - tx) * ty +
    p11 * tx * ty;

  const rounded = Math.round(priceCents);
  const onRaster = origW % STEP === 0 && origH % STEP === 0 && clampedW === undefined && clampedH === undefined;

  return {
    base_price_cents: rounded,
    base_price_eur: Math.round(rounded) / 100,
    interpolated: !onRaster,
    warning,
    used_points: corners.map((c) => ({ w: c.w, h: c.h, price_cents: c.price! })),
    clamped_w: clampedW,
    clamped_h: clampedH,
  };
}
