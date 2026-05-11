import type { DetectionRegion } from './store';

export interface ImageAnalysisResult {
  regions: DetectionRegion[];
  metrics: {
    iceProbability: number;
    reflectiveIntensity: number;
    textureConfidence: number;
    psnr: number;
    ssim: number;
    snr: number;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image for analysis.'));
    image.src = src;
  });
}

export async function analyzeImage(src: string): Promise<ImageAnalysisResult> {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Canvas context unavailable for analysis.');
  }

  const longestSide = Math.max(image.width, image.height) || 1;
  const scale = 256 / longestSide;
  const width = Math.max(32, Math.round(image.width * scale));
  const height = Math.max(32, Math.round(image.height * scale));

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const brightness = new Float32Array(width * height);
  let sum = 0;

  for (let i = 0; i < brightness.length; i += 1) {
    const base = i * 4;
    const value = data[base] * 0.299 + data[base + 1] * 0.587 + data[base + 2] * 0.114;
    brightness[i] = value;
    sum += value;
  }

  const mean = sum / brightness.length;
  let variance = 0;
  let brightPixelCount = 0;

  for (const value of brightness) {
    const delta = value - mean;
    variance += delta * delta;
    if (value > mean + 24) {
      brightPixelCount += 1;
    }
  }

  const stdDev = Math.sqrt(variance / brightness.length);
  const brightRatio = brightPixelCount / brightness.length;

  const gridCols = 6;
  const gridRows = 6;
  const cellWidth = width / gridCols;
  const cellHeight = height / gridRows;
  const candidates: DetectionRegion[] = [];

  for (let row = 0; row < gridRows; row += 1) {
    for (let col = 0; col < gridCols; col += 1) {
      const startX = Math.floor(col * cellWidth);
      const startY = Math.floor(row * cellHeight);
      const endX = Math.min(width, Math.floor((col + 1) * cellWidth));
      const endY = Math.min(height, Math.floor((row + 1) * cellHeight));

      let cellSum = 0;
      let cellMax = 0;
      let pixelCount = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const value = brightness[y * width + x];
          cellSum += value;
          cellMax = Math.max(cellMax, value);
          pixelCount += 1;
        }
      }

      const average = cellSum / Math.max(1, pixelCount);
      const score = clamp(((average - mean) / Math.max(1, stdDev)) * 0.6 + cellMax / 255, 0, 2);

      candidates.push({
        id: `${row}-${col}`,
        x: startX / width,
        y: startY / height,
        width: (endX - startX) / width,
        height: (endY - startY) / height,
        score,
      });
    }
  }

  const regions = candidates
    .sort((a, b) => b.score - a.score)
    .filter((region, index, all) =>
      all
        .slice(0, index)
        .every((picked) => Math.abs(region.x - picked.x) > 0.12 || Math.abs(region.y - picked.y) > 0.12),
    )
    .slice(0, 3)
    .map((region, index) => ({
      ...region,
      id: `region-${index + 1}`,
      score: Number((region.score * 50).toFixed(1)),
    }));

  const iceProbability = clamp(brightRatio * 180 + stdDev * 0.18, 5, 96);
  const reflectiveIntensity = clamp((mean / 255) * 100 + stdDev * 0.12, 8, 98);
  const textureConfidence = clamp(55 + stdDev * 0.5, 40, 98);
  const snr = clamp(12 + stdDev * 0.25, 10, 48);
  const psnr = clamp(18 + (255 - stdDev) * 0.08, 20, 42);
  const ssim = clamp(0.68 + stdDev / 600, 0.68, 0.98);

  return {
    regions,
    metrics: {
      iceProbability: Number(iceProbability.toFixed(1)),
      reflectiveIntensity: Number(reflectiveIntensity.toFixed(1)),
      textureConfidence: Number(textureConfidence.toFixed(1)),
      psnr: Number(psnr.toFixed(1)),
      ssim: Number(ssim.toFixed(2)),
      snr: Number(snr.toFixed(1)),
    },
  };
}
