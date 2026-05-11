import { create } from 'zustand';

export type AnalysisStage = 'idle' | 'uploading' | 'processing' | 'complete';
export type ViewLayer = 'raw' | 'enhanced' | 'texture' | 'segmentation' | 'heatmap' | 'elevation';

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface DetectionRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Analysis State
  currentStage: AnalysisStage;
  setStage: (stage: AnalysisStage) => void;
  
  // Workspace State
  activeLayer: ViewLayer;
  setActiveLayer: (layer: ViewLayer) => void;

  // Uploaded image state
  uploadedImage: UploadedImage | null;
  setUploadedImage: (file: File) => void;
  clearUploadedImage: () => void;
  detectionRegions: DetectionRegion[];
  setDetectionRegions: (regions: DetectionRegion[]) => void;
  
  // Metrics (Mock Data)
  metrics: {
    iceProbability: number;
    reflectiveIntensity: number;
    textureConfidence: number;
    psnr: number;
    ssim: number;
    snr: number;
  };
  setMetrics: (metrics: Partial<AppState['metrics']>) => void;
  
  // Logs
  terminalLogs: { time: string; msg: string; type: 'info' | 'warn' | 'success' | 'error' }[];
  addLog: (msg: string, type?: 'info' | 'warn' | 'success' | 'error') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  currentStage: 'idle',
  setStage: (stage) => set({ currentStage: stage }),
  
  activeLayer: 'raw',
  setActiveLayer: (layer) => set({ activeLayer: layer }),

  uploadedImage: null,
  setUploadedImage: (file) =>
    set((state) => {
      if (state.uploadedImage?.url.startsWith('blob:')) {
        URL.revokeObjectURL(state.uploadedImage.url);
      }

      return {
        uploadedImage: {
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
        },
      };
    }),
  clearUploadedImage: () =>
    set((state) => {
      if (state.uploadedImage?.url.startsWith('blob:')) {
        URL.revokeObjectURL(state.uploadedImage.url);
      }

      return {
        uploadedImage: null,
        detectionRegions: [],
      };
    }),
  detectionRegions: [],
  setDetectionRegions: (regions) => set({ detectionRegions: regions }),
  
  metrics: {
    iceProbability: 0,
    reflectiveIntensity: 0,
    textureConfidence: 0,
    psnr: 0,
    ssim: 0,
    snr: 0,
  },
  setMetrics: (newMetrics) => set((state) => ({ metrics: { ...state.metrics, ...newMetrics } })),
  
  terminalLogs: [
    { time: new Date().toLocaleTimeString(), msg: 'SYSTEM INITIALIZED. AWAITING OHRC TELEMETRY.', type: 'info' }
  ],
  addLog: (msg, type = 'info') => set((state) => ({
    terminalLogs: [...state.terminalLogs, { time: new Date().toLocaleTimeString(), msg, type }]
  }))
}));
