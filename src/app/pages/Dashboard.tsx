import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Satellite, Activity, Target } from 'lucide-react';
import { NavLink } from 'react-router';

export function Dashboard() {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center relative">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
       
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="text-center z-10 max-w-3xl"
       >
         <div className="inline-flex items-center justify-center p-4 rounded-full bg-midnight-blue border border-neon-cyan/30 mb-8 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <Rocket className="w-12 h-12 text-neon-cyan" />
         </div>
         <h1 className="text-5xl font-bold tracking-tight mb-4 text-lunar-white">
           LunaVision<span className="text-neon-cyan">-X</span>
         </h1>
         <p className="text-xl text-muted-foreground mb-12 font-light">
           AI-Assisted Ice Detection & Mapping in Permanently Shadowed Lunar Regions using Chandrayaan-2 OHRC Imagery.
         </p>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Start Analysis', icon: Target, path: '/upload', color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30' },
              { label: 'View Terrain', icon: Satellite, path: '/terrain', color: 'text-sci-purple', bg: 'bg-sci-purple/10', border: 'border-sci-purple/30' },
              { label: 'Live Telemetry', icon: Activity, path: '/analytics', color: 'text-electric-blue', bg: 'bg-electric-blue/10', border: 'border-electric-blue/30' },
            ].map((btn, i) => (
               <NavLink key={i} to={btn.path}>
                 <motion.div 
                   whileHover={{ y: -5, scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className={`p-6 rounded-xl border ${btn.border} ${btn.bg} backdrop-blur-sm flex flex-col items-center gap-4 cursor-pointer transition-colors hover:bg-white/5`}
                 >
                   <btn.icon className={`w-8 h-8 ${btn.color}`} />
                   <span className="font-medium text-sm text-lunar-white">{btn.label}</span>
                 </motion.div>
               </NavLink>
            ))}
         </div>
       </motion.div>
    </div>
  );
}
