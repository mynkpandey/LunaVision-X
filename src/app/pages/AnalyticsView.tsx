import React from 'react';
import { useAppStore } from '../store';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

const mockTimeSeriesData = Array.from({ length: 20 }).map((_, i) => ({
  time: `T-${20 - i}`,
  reflectance: 0.1 + Math.random() * 0.4 + (i > 15 ? 0.3 : 0),
  temperature: 40 + Math.random() * 10 - (i > 15 ? 20 : 0),
}));

export function AnalyticsView() {
  const { metrics, currentStage } = useAppStore();

  if (currentStage === 'idle') {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4 text-muted-foreground">
        <Activity className="w-16 h-16 opacity-20" />
        <p>Awaiting analytical telemetry...</p>
      </div>
    );
  }

  const iceProb = metrics.iceProbability || 87.4;
  
  const pieData = [
    { name: 'Ice Confirmed', value: iceProb },
    { name: 'Regolith', value: 100 - iceProb },
  ];
  const COLORS = ['#00E5FF', '#1A2436'];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-light tracking-widest text-lunar-white mb-8 uppercase">
        Scientific Telemetry
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-midnight-blue border border-border/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Thermometer className="w-16 h-16" /></div>
          <p className="text-sm text-muted-foreground font-mono mb-2">PSR TEMPERATURE</p>
          <p className="text-4xl font-light text-lunar-white">38<span className="text-xl text-muted-foreground"> K</span></p>
          <p className="text-xs text-neon-cyan mt-4">Stable within shadowed region</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-midnight-blue border border-border/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert className="w-16 h-16" /></div>
          <p className="text-sm text-muted-foreground font-mono mb-2">AI CONFIDENCE</p>
          <p className="text-4xl font-light text-neon-cyan">{(metrics.textureConfidence || 95.2)}<span className="text-xl text-muted-foreground">%</span></p>
          <p className="text-xs text-muted-foreground mt-4">Based on GLCM + U-Net</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-midnight-blue border border-border/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
          <p className="text-sm text-muted-foreground font-mono mb-2">SIGNAL TO NOISE (SNR)</p>
          <p className="text-4xl font-light text-sci-purple">42.8<span className="text-xl text-muted-foreground"> dB</span></p>
          <p className="text-xs text-muted-foreground mt-4">Post CLAHE processing</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-midnight-blue border border-border/50 rounded-xl p-6 h-80">
          <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase">Ice Probability Distribution</h3>
          <ResponsiveContainer w-full h-full>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#07111F', border: '1px solid #1A2436', borderRadius: '8px' }}
                itemStyle={{ color: '#EAF4FF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-midnight-blue border border-border/50 rounded-xl p-6 h-80">
          <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase">Reflectance Profile Sweep</h3>
          <ResponsiveContainer w-full h-full>
            <AreaChart data={mockTimeSeriesData}>
              <defs>
                <linearGradient id="colorRef" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2436" vertical={false} />
              <XAxis dataKey="time" stroke="#8B9BB4" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B9BB4" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#07111F', border: '1px solid #1A2436', borderRadius: '8px' }}
                labelStyle={{ color: '#8B9BB4' }}
              />
              <Area type="monotone" dataKey="reflectance" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRef)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
