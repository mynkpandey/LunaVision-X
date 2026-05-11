import React from 'react';
import { useAppStore } from '../store';
import { Upload as UploadIcon, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { analyzeImage } from '../imageAnalysis';

export function UploadView() {
  const {
    currentStage,
    uploadedImage,
    setUploadedImage,
    clearUploadedImage,
    setDetectionRegions,
    setMetrics,
    setStage,
    addLog,
  } = useAppStore();
  const [dragActive, setDragActive] = React.useState(false);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setUploadedImage(selectedFile);
    setDetectionRegions([]);
    setStage('uploading');
    addLog(`OHRC Imagery uploaded: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`, 'success');
  };

  const startProcessing = async () => {
    if (!uploadedImage) return;

    setStage('processing');
    addLog('INITIATING PROCESSING PIPELINE...', 'info');

    setTimeout(() => addLog('OpenCV: Applying CLAHE enhancement on uploaded frame...', 'info'), 900);
    setTimeout(() => addLog('OpenCV: Local contrast normalization complete.', 'success'), 1800);
    setTimeout(() => addLog('Detection engine: Scoring reflective regions from uploaded image...', 'info'), 2600);

    try {
      const result = await analyzeImage(uploadedImage.url);

      setMetrics(result.metrics);
      setDetectionRegions(result.regions);

      setTimeout(() => {
        addLog(`DETECTION COMPLETE. ${result.regions.length} candidate regions found in ${uploadedImage.name}.`, 'success');
        setStage('complete');
        navigate('/enhancement');
      }, 3200);
    } catch (error) {
      addLog(
        error instanceof Error ? error.message : 'Detection failed on the uploaded image.',
        'error',
      );
      setStage('complete');
    }
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-light tracking-widest text-lunar-white mb-8 uppercase text-center">
          Secure Uplink
        </h2>

        <div 
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive ? 'border-neon-cyan bg-neon-cyan/5 scale-[1.02]' : 'border-border/50 bg-midnight-blue/50 hover:border-electric-blue/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="hidden" 
            id="file-upload" 
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              <motion.label 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-space-black border border-border/50 flex items-center justify-center mb-6 shadow-inner">
                  <UploadIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-lunar-white mb-2">Drag & Drop OHRC Imagery</h3>
                <p className="text-sm text-muted-foreground mb-6">Support for TIFF, PNG, JPG up to 500MB</p>
                <span className="px-6 py-2 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm font-medium border border-neon-cyan/20 hover:bg-neon-cyan hover:text-space-black transition-colors">
                  Browse Files
                </span>
              </motion.label>
            ) : (
              <motion.div 
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-space-black border border-neon-cyan/50 flex items-center justify-center mb-6 overflow-hidden relative">
                    <img
                      src={uploadedImage.url}
                      alt={uploadedImage.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-neon-cyan/20" />
                    <ImageIcon className="relative z-10 w-10 h-10 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                  </div>
                  <button 
                    onClick={() => {
                      clearUploadedImage();
                      setStage('idle');
                    }}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-medium text-lunar-white mb-2">{uploadedImage.name}</h3>
                <p className="text-sm text-neon-cyan mb-8">
                  <CheckCircle className="w-4 h-4 inline-block mr-1 align-text-bottom" />
                  Ready for pipeline
                </p>

                <button 
                  onClick={startProcessing}
                  disabled={currentStage === 'processing'}
                  className={`px-8 py-3 rounded-md text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${
                    currentStage === 'processing' 
                      ? 'bg-midnight-blue text-muted-foreground border border-border cursor-not-allowed'
                      : 'bg-neon-cyan text-space-black hover:bg-white hover:text-space-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  }`}
                >
                  {currentStage === 'processing' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Initiate Analysis'
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
