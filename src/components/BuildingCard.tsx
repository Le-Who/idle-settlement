
import React from 'react';
import { Building, Resources } from '../types/game';
import { motion } from 'framer-motion';
import { Trees, Mountain, Utensils, Home, Factory, Coins, Beaker, Pickaxe, Store } from 'lucide-react';

interface BuildingCardProps {
  building: Building;
  onBuy: (id: string) => void;
  currentResources: Resources;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building, onBuy, currentResources }) => {
  const getCost = (_res: keyof Resources, base: number) => {
    return Math.floor(base * Math.pow(building.costMultiplier, building.count));
  };

  const canAfford = Object.entries(building.baseCost).every(([res, cost]) => {
    return currentResources[res as keyof Resources] >= getCost(res as keyof Resources, cost!);
  });

  const Icon = () => {
    switch(building.id) {
      case 'tent': return <Home className="w-6 h-6 text-indigo-500" />;
      case 'woodcutter': return <Trees className="w-6 h-6 text-amber-700" />;
      case 'gatherer': return <Utensils className="w-6 h-6 text-orange-500" />;
      case 'quarry': return <Mountain className="w-6 h-6 text-slate-500" />;
      case 'farm': return <Factory className="w-6 h-6 text-green-600" />;
      case 'market': return <Coins className="w-6 h-6 text-yellow-500" />;
      case 'academy': return <Beaker className="w-6 h-6 text-blue-500" />;
      case 'stone_mason': return <Pickaxe className="w-6 h-6 text-slate-700" />;
      case 'granary': return <Store className="w-6 h-6 text-orange-700" />;
      default: return <Home className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border-2 transition-all ${
        canAfford ? 'border-amber-200 bg-white shadow-md' : 'border-gray-200 bg-gray-50 opacity-80'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Icon />
          </div>
          <div>
            <h3 className="font-bold text-amber-950">{building.name}</h3>
            <p className="text-xs text-amber-800/60 leading-tight">{building.description}</p>
          </div>
        </div>
        <div className="bg-amber-100 px-2 py-1 rounded text-sm font-bold text-amber-900">
          x{building.count}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {Object.entries(building.baseCost).map(([res, cost]) => (
            <div key={res} className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1 ${
              currentResources[res as keyof Resources] >= getCost(res as keyof Resources, cost!)
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <span className="capitalize">{res}:</span>
              <span>{getCost(res as keyof Resources, cost!)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onBuy(building.id)}
          disabled={!canAfford}
          className={`w-full py-2 rounded-lg font-bold transition-all ${
            canAfford 
              ? 'bg-amber-600 text-white hover:bg-amber-700 active:scale-95' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Construct
        </button>
      </div>
    </motion.div>
  );
};

export default BuildingCard;
