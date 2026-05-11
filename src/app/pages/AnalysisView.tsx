import React from 'react';
import { useAppStore, type ViewLayer } from '../store';
import { motion } from 'motion/react';
import { Layers, Image as ImageIcon, Sparkles, Map, Target, Thermometer } from 'lucide-react';
import { cn } from '../Layout';

const layerOptions: { id: ViewLayer; label: string; icon: React.ElementType; filter: string }[] = [
  { id: 'raw', label: 'Raw OHRC', icon: ImageIcon, filter: 'grayscale(100%) brightness(0.8)' },
  { id: 'enhanced', label: 'CLAHE Enhanced', icon: Sparkles, filter: 'grayscale(100%) contrast(1.5) brightness(1.2)' },
  { id: 'texture', label: 'GLCM Texture', icon: Layers, filter: 'grayscale(100%) contrast(2) invert(1) hue-rotate(180deg)' },
  { id: 'segmentation', label: 'Watershed Seg', icon: Target, filter: 'grayscale(100%) contrast(1.5) sepia(1) hue-rotate(220deg) saturate(3)' },
  { id: 'heatmap', label: 'Ice Probability', icon: Thermometer, filter: 'grayscale(100%) contrast(1.5) sepia(1) hue-rotate(300deg) saturate(5)' },
];

export function AnalysisView() {
  const { activeLayer, setActiveLayer, currentStage, uploadedImage, detectionRegions, metrics } = useAppStore();
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(Math.max(0.5, z - e.deltaY * 0.001), 3));
  };

  const activeFilter = layerOptions.find(l => l.id === activeLayer)?.filter || 'none';

  if (currentStage === 'idle' || !uploadedImage) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-muted-foreground">
        <Map className="w-16 h-16 opacity-20" />
        <p>No telemetry data loaded. Please upload OHRC imagery first.</p>
      </div>
    );
  }

  const primaryRegion = detectionRegions[0];

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden relative">
      {/* Tools Sidebar */}
      <div className="w-full md:w-64 bg-midnight-blue border-r border-border/50 shrink-0 p-4 flex flex-col gap-6 z-10 shadow-xl">
        <div>
          <h3 className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-3 h-3" />
            Active Layer
          </h3>
          <div className="space-y-2">
            {layerOptions.map(layer => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-300",
                  activeLayer === layer.id 
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-lunar-white border border-transparent"
                )}
              >
                <layer.icon className="w-4 h-4" />
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
           <h3 className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-widest">Image Controls</h3>
           <div className="space-y-4">
              <div className="rounded-md border border-border/50 bg-space-black/40 p-3 text-xs font-mono text-muted-foreground space-y-1">
                <p className="truncate">FILE: {uploadedImage.name}</p>
                <p>ICE SCORE: {metrics.iceProbability.toFixed(1)}%</p>
                <p>REGIONS: {detectionRegions.length}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground flex justify-between mb-1">
                  <span>Zoom Level</span>
                  <span>{(zoom * 100).toFixed(0)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0.5" max="3" step="0.1" 
                  value={zoom} 
                  onChange={e => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-neon-cyan"
                />
              </div>
           </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div 
        ref={containerRef}
        className="flex-1 bg-[#020408] relative overflow-hidden flex items-center justify-center cursor-crosshair"
        onWheel={handleWheel}
      >
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiPjxsaW5lIHgxPSIwIiB5MT0iMjAiIHgyPSI0MCIgeTI9IjIwIi8+PGxpbmUgeDE9IjIwIiB5MT0iMCIgeDI9IjIwIiB5Mj0iNDAiLz48L2c+PC9zdmc+')] opacity-50 z-0" />
        
        {/* Radar Sweep Effect */}
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-[spin_10s_linear_infinite] opacity-10">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-neon-cyan origin-right" />
        </div>

        <motion.div
          animate={{ scale: zoom, x: pan.x, y: pan.y }}
          drag
          dragConstraints={containerRef}
          className="relative z-0 w-full max-w-[800px]"
        >
          <img 
            src={uploadedImage.url}
            alt={uploadedImage.name}
            className="w-full rounded-lg shadow-2xl transition-all duration-700 pointer-events-none mix-blend-screen"
            style={{ filter: activeFilter }}
          />

          {/* Holographic UI Overlays on Image */}
          {activeLayer === 'segmentation' && (
            detectionRegions.map((region) => (
              <div
                key={region.id}
                className="absolute border border-sci-purple/80 bg-sci-purple/20 shadow-[0_0_18px_rgba(124,77,255,0.35)]"
                style={{
                  left: `${region.x * 100}%`,
                  top: `${region.y * 100}%`,
                  width: `${region.width * 100}%`,
                  height: `${region.height * 100}%`,
                }}
              />
            ))
          )}
          {activeLayer === 'heatmap' && (
            detectionRegions.map((region) => (
              <div
                key={region.id}
                className="absolute blur-md mix-blend-screen"
                style={{
                  left: `${region.x * 100}%`,
                  top: `${region.y * 100}%`,
                  width: `${region.width * 100}%`,
                  height: `${region.height * 100}%`,
                  background: `radial-gradient(circle, rgba(255,0,0,${Math.min(region.score / 60, 0.9)}) 0%, rgba(255,255,0,0.45) 55%, transparent 100%)`,
                }}
              />
            ))
          )}
          
          {/* Target Reticle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-neon-cyan/50 rounded-full pointer-events-none flex items-center justify-center opacity-50">
            <div className="w-1 h-1 bg-neon-cyan rounded-full" />
            <div className="absolute top-0 w-px h-2 bg-neon-cyan" />
            <div className="absolute bottom-0 w-px h-2 bg-neon-cyan" />
            <div className="absolute left-0 w-2 h-px bg-neon-cyan" />
            <div className="absolute right-0 w-2 h-px bg-neon-cyan" />
          </div>
        </motion.div>

        {/* HUD Elements */}
        <div className="absolute top-4 left-4 font-mono text-[10px] text-neon-cyan/70 space-y-1 pointer-events-none">
          <p>LAT: 89.9°S</p>
          <p>LON: 120.4°W</p>
          <p>ALT: 100km</p>
          <p>RES: 0.25m/px</p>
          {primaryRegion && <p>PRIMARY ROI: {(primaryRegion.score).toFixed(1)}</p>}
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neon-cyan/70 text-right pointer-events-none">
          <p>FILTER: {activeLayer.toUpperCase()}</p>
          <p>ENHANCEMENT: CLAHE</p>
          <p>REFLECTANCE: {metrics.reflectiveIntensity.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
