
import React from 'react';
import { Building } from '../types/game';
import { motion } from 'framer-motion';

interface VisualizerProps {
  buildings: Record<string, Building>;
}

const Visualizer: React.FC<VisualizerProps> = ({ buildings }) => {
  // We'll generate a grid of "plots"
  const grid = Array.from({ length: 100 }, (_, i) => i);
  
  // Calculate how many of each building to show (clamped for performance)
  const renderList: string[] = [];
  Object.entries(buildings).forEach(([id, b]) => {
    for (let i = 0; i < Math.min(b.count, 10); i++) {
      renderList.push(id);
    }
  });

  // Shuffle or deterministic placement based on index
  const getBuildingAt = (index: number) => {
    // Simple logic: if index < renderList.length, show building
    if (index < renderList.length) {
      return renderList[index];
    }
    return null;
  };

  return (
    <div className="relative w-full aspect-square bg-emerald-100 rounded-3xl border-8 border-amber-900/10 overflow-hidden shadow-2xl">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20">
        {grid.map(i => (
          <div key={i} className="border border-emerald-300" />
        ))}
      </div>

      {/* Buildings */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 p-4 gap-2">
        {grid.map(i => {
          const type = getBuildingAt(i);
          if (!type) return <div key={i} />;
          
          return (
            <motion.div
              key={`${type}-${i}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`rounded-sm flex items-center justify-center shadow-lg transform rotate-45 ${
                type === 'tent' ? 'bg-indigo-400' :
                type === 'woodcutter' ? 'bg-amber-800' :
                type === 'gatherer' ? 'bg-orange-400' :
                type === 'quarry' ? 'bg-slate-500' :
                type === 'farm' ? 'bg-green-600' :
                type === 'market' ? 'bg-yellow-500' :
                type === 'academy' ? 'bg-blue-500' :
                type === 'stone_mason' ? 'bg-slate-700' :
                type === 'granary' ? 'bg-orange-700' :
                'bg-amber-200'
              }`}
            >
              <div className="-rotate-45 text-[8px] font-bold text-white uppercase">
                {type[0]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Nature Decorations */}
      <div className="absolute top-4 right-4 text-emerald-800/20 pointer-events-none">
        <div className="text-4xl">🌲</div>
        <div className="text-4xl ml-8 -mt-4">🌲</div>
      </div>
      <div className="absolute bottom-10 left-10 text-emerald-800/20 pointer-events-none">
        <div className="text-4xl">⛰️</div>
      </div>
    </div>
  );
};

export default Visualizer;
