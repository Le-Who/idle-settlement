
import React from 'react';
import { Resources } from '../types/game';
import { Trees, Mountain, Utensils, Coins, Users, Beaker } from 'lucide-react';

interface ResourceBarProps {
  resources: Resources;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => {
  const items = [
    { label: 'Food', value: resources.food, icon: Utensils, color: 'text-orange-500' },
    { label: 'Wood', value: resources.wood, icon: Trees, color: 'text-amber-700' },
    { label: 'Stone', value: resources.stone, icon: Mountain, color: 'text-slate-500' },
    { label: 'Gold', value: resources.gold, icon: Coins, color: 'text-yellow-500' },
    { label: 'Science', value: resources.science, icon: Beaker, color: 'text-blue-500' },
    { label: 'People', value: resources.population, icon: Users, color: 'text-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-amber-50 border-b border-amber-200 shadow-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-amber-100 shadow-inner">
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <div>
            <p className="text-xs text-amber-900/60 font-bold uppercase tracking-wider">{item.label}</p>
            <p className="text-lg font-mono font-bold text-amber-950">
              {Math.floor(item.value).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceBar;
