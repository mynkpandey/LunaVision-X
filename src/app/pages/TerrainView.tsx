import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { Mountain } from 'lucide-react';

function TerrainMesh({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use the image as both texture and displacement map for a quick hacky 3D effect
  const texture = useTexture(imageUrl);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} receiveShadow castShadow>
      <planeGeometry args={[10, 10, 256, 256]} />
      <meshStandardMaterial 
        map={texture} 
        displacementMap={texture}
        displacementScale={2.5}
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

function IceDeposits({
  regions,
}: {
  regions: { id: string; x: number; y: number; width: number; height: number; score: number }[];
}) {
  const points = useMemo(() => {
    const pts = regions.map((region) => {
      const x = (region.x + region.width / 2 - 0.5) * 8;
      const y = (region.y + region.height / 2 - 0.5) * 8;
      const z = 1.5 + region.score * 0.02;

      return new THREE.Vector3(x, y, z);
    });

    return pts;
  }, [regions]);

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
           <sphereGeometry args={[0.05, 16, 16]} />
           <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} />
           <pointLight color="#00E5FF" intensity={0.5} distance={2} />
        </mesh>
      ))}
    </group>
  );
}

export function TerrainView() {
  const { currentStage, uploadedImage, detectionRegions, metrics } = useAppStore();

  if (currentStage === 'idle' || !uploadedImage) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-muted-foreground">
        <Mountain className="w-16 h-16 opacity-20" />
        <p>Awaiting terrain telemetry...</p>
      </div>
    );
  }

  return (
    <div className="h-full relative w-full bg-[#020408]">
      <div className="absolute top-6 left-6 z-10 bg-black/50 p-4 border border-border/50 rounded-lg backdrop-blur-md">
         <h3 className="text-neon-cyan font-mono text-sm uppercase mb-2">Topographical Analysis</h3>
         <div className="text-xs text-muted-foreground font-mono space-y-1">
            <p>ELEVATION: -4.2km to 1.1km</p>
            <p>SLOPE MAX: 32°</p>
            <p>ICE DETECTIONS: {detectionRegions.length} Regions</p>
            <p>REFLECTANCE: {metrics.reflectiveIntensity.toFixed(1)}%</p>
         </div>
      </div>

      <Canvas shadows camera={{ position: [0, 2, 8], fov: 60 }}>
        <color attach="background" args={['#020408']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.1} />
        <directionalLight 
          position={[5, 5, -5]} 
          intensity={1.5} 
          castShadow 
          color="#EAF4FF"
        />
        {/* Fill light to simulate secondary reflection */}
        <pointLight position={[-5, 2, 5]} intensity={0.2} color="#7C4DFF" />
        
        <React.Suspense fallback={null}>
           <TerrainMesh imageUrl={uploadedImage.url} />
           <IceDeposits regions={detectionRegions} />
        </React.Suspense>
        
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          minDistance={3} 
          maxDistance={12} 
        />
      </Canvas>
    </div>
  );
}
