import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { useAppStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Upload, SlidersHorizontal, Map, 
  Layers, PieChart, Activity, Settings, LayoutDashboard,
  Terminal as TerminalIcon, FileText, Mountain
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// Sidebar Component
// ----------------------------------------------------------------------
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload OHRC', icon: Upload },
  { path: '/enhancement', label: 'Enhancement', icon: SlidersHorizontal },
  { path: '/ice-detection', label: 'Ice Detection', icon: Map },
  { path: '/analysis', label: 'Texture & Seg', icon: Layers },
  { path: '/terrain', label: '3D Terrain', icon: Mountain },
  { path: '/analytics', label: 'Analytics', icon: PieChart },
  { path: '/reports', label: 'AI Reports', icon: FileText },
];

function Sidebar() {
  const { isSidebarOpen } = useAppStore();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 72 }}
      className="h-full bg-midnight-blue border-r border-border/50 flex flex-col z-20 shrink-0 overflow-hidden relative"
    >
      <div className="p-4 h-16 flex items-center border-b border-border/50 gap-3 shrink-0">
        <Rocket className="w-8 h-8 text-neon-cyan shrink-0 animate-pulse" />
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg tracking-wider text-lunar-white whitespace-nowrap"
            >
              LunaVision<span className="text-neon-cyan">-X</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 relative group overflow-hidden",
              isActive ? "bg-neon-cyan/10 text-neon-cyan" : "text-muted-foreground hover:bg-white/5 hover:text-lunar-white"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-0 w-1 h-full bg-neon-cyan shadow-[0_0_10px_#00E5FF]" />
                )}
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", isActive ? "drop-shadow-[0_0_8px_#00E5FF]" : "group-hover:scale-110")} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50 mt-auto">
         <NavLink to="/settings" className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 group overflow-hidden",
              isActive ? "bg-neon-cyan/10 text-neon-cyan" : "text-muted-foreground hover:bg-white/5 hover:text-lunar-white"
            )}>
           <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
         </NavLink>
      </div>
    </motion.aside>
  );
}

// ----------------------------------------------------------------------
// Telemetry Header Component
// ----------------------------------------------------------------------
function TelemetryHeader() {
  const { currentStage } = useAppStore();
  
  return (
    <header className="h-16 bg-midnight-blue border-b border-border/50 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
       <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sci-purple animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">SYS_STATUS:</span>
            <span className={cn(
              "text-xs font-mono font-bold uppercase tracking-widest",
              currentStage === 'idle' ? "text-muted-foreground" :
              currentStage === 'uploading' ? "text-electric-blue" :
              currentStage === 'processing' ? "text-sci-purple animate-pulse" :
              "text-neon-cyan drop-shadow-[0_0_5px_#00E5FF]"
            )}>
              {currentStage === 'idle' ? 'STANDBY' : currentStage}
            </span>
          </div>
          <div className="h-4 w-px bg-border/50" />
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground font-mono tracking-widest">MISSION:</span>
             <span className="text-xs text-lunar-white font-mono font-bold tracking-widest">CH-2/OHRC/PSR-99</span>
          </div>
       </div>

       <div className="flex items-center gap-4">
          <div className="text-right">
             <div className="text-xs text-muted-foreground font-mono">UTC CLOCK</div>
             <div className="text-sm text-neon-cyan font-mono font-bold">{new Date().toISOString().split('T')[1].split('.')[0]} Z</div>
          </div>
          <div className="w-10 h-10 rounded-full border border-neon-cyan/30 flex items-center justify-center bg-black/50 overflow-hidden relative">
             <div className="absolute inset-0 bg-neon-cyan/20 animate-ping" />
             <Rocket className="w-5 h-5 text-neon-cyan relative z-10" />
          </div>
       </div>
    </header>
  );
}

// ----------------------------------------------------------------------
// Terminal Component
// ----------------------------------------------------------------------
function Terminal() {
  const { terminalLogs } = useAppStore();
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  return (
    <div className="h-48 bg-space-black border-t border-border/50 flex flex-col shrink-0 font-mono text-xs relative z-20">
      <div className="h-8 bg-midnight-blue border-b border-border/50 flex items-center px-4 gap-2 text-muted-foreground uppercase tracking-widest text-[10px]">
        <TerminalIcon className="w-3 h-3" />
        AI Scientific Terminal v4.2
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {terminalLogs.map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            key={i} 
            className="flex gap-3"
          >
            <span className="text-muted-foreground shrink-0">[{log.time}]</span>
            <span className={cn(
              log.type === 'info' && "text-lunar-white/80",
              log.type === 'success' && "text-neon-cyan drop-shadow-[0_0_2px_#00E5FF]",
              log.type === 'warn' && "text-yellow-400",
              log.type === 'error' && "text-red-500",
            )}>
              {log.msg}
            </span>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Layout Component
// ----------------------------------------------------------------------
export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-space-black text-foreground overflow-hidden selection:bg-neon-cyan/30">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_100%)] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0" />

      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        <TelemetryHeader />
        
        <div className="flex-1 overflow-auto relative custom-scrollbar">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="h-full"
             >
               <Outlet />
             </motion.div>
           </AnimatePresence>
        </div>

        <Terminal />
      </main>
    </div>
  );
}
