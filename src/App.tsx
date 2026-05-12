
import { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import ResourceBar from './components/ResourceBar';
import BuildingCard from './components/BuildingCard';
import GameLog from './components/GameLog';
import Visualizer from './components/Visualizer';
import { TIERS } from './constants/gameData';
import { Pickaxe, Trees, Utensils, Info, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';
import ResearchList from './components/ResearchList';

function App() {
  const { state, buyBuilding, researchTech, manualGather, addLog } = useGameState();
  const [activeTab, setActiveTab] = useState<'buildings' | 'town' | 'research'>('buildings');
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('aeon_intro_seen'));

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem('aeon_intro_seen', 'true');
  };

  // Watch for tier ups
  useEffect(() => {
    if (state.tier > 0) {
      addLog(`Success! Your settlement has evolved into a ${TIERS[state.tier].name}!`);
    }
  }, [state.tier]); // Removed addLog from deps to prevent loops if it changes, though it shouldn't

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* Intro Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-amber-50 p-8 rounded-3xl max-w-lg shadow-2xl border-4 border-amber-900 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-900" />
            <h2 className="text-3xl font-black text-amber-950 mb-4 uppercase italic">Welcome, Founder</h2>
            <div className="space-y-4 text-stone-800 font-serif leading-relaxed">
              <p>
                You stand before a wild, untamed frontier. Your task is simple yet monumental: guide your people from a simple camp to a thriving metropolis.
              </p>
              <p>
                Resources are scarce. Begin by gathering wood and food manually. Build tents to house your people, and as your population grows, new technologies and management tools will become available.
              </p>
              <p className="font-bold text-amber-900">
                Time moves forward. Even when you are away, your settlement will continue to produce, provided your people are fed.
              </p>
            </div>
            <button 
              onClick={closeIntro}
              className="mt-8 w-full py-4 bg-amber-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-amber-800 transition-all shadow-lg active:scale-95"
            >
              Found Settlement
            </button>
          </motion.div>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-amber-900 text-amber-50 p-6 flex justify-between items-center shadow-lg border-b-4 border-amber-950">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Aeon Settlement</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 bg-amber-700 rounded text-xs font-bold uppercase tracking-widest">
              Level {state.tier + 1}
            </span>
            <span className="text-amber-200/80 font-serif italic">
              {TIERS[state.tier].name}
            </span>
          </div>
        </div>
        
        <div className="hidden md:block text-right">
          <p className="text-xs uppercase font-bold text-amber-400">Founded</p>
          <p className="font-mono text-sm">{new Date(state.startTime).toLocaleDateString()}</p>
        </div>
      </header>

      {/* Primary Resource Bar */}
      <ResourceBar resources={state.resources} />

      {/* Net Production Overlay */}
      <div className="bg-amber-100/50 border-b border-amber-200 px-6 py-2 flex items-center justify-center space-x-6 text-[10px] font-bold uppercase text-amber-900/60 overflow-x-auto whitespace-nowrap">
        <span>Net / Sec:</span>
        <span className="flex items-center gap-1">
          <Utensils className="w-3 h-3" /> Food: {(Object.values(state.buildings).reduce((acc, b) => acc + (b.produces?.food || 0) * b.count, 0) - state.resources.population * 0.1).toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <Trees className="w-3 h-3" /> Wood: {Object.values(state.buildings).reduce((acc, b) => acc + (b.produces?.wood || 0) * b.count, 0).toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <Pickaxe className="w-3 h-3" /> Stone: {Object.values(state.buildings).reduce((acc, b) => acc + (b.produces?.stone || 0) * b.count, 0).toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
           Gold: {Object.values(state.buildings).reduce((acc, b) => acc + (b.produces?.gold || 0) * b.count, 0).toFixed(1)}
        </span>
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Expansion & Visualizer */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-stone-200">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900">
               <Info className="w-5 h-5" />
               Settlement View
             </h2>
             <Visualizer buildings={state.buildings} />
             
             <div className="mt-6 grid grid-cols-3 gap-2">
                <button 
                  onClick={() => manualGather('food', 1)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors shadow-sm"
                >
                  <Utensils className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Gather</span>
                </button>
                <button 
                  onClick={() => manualGather('wood', 1)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors shadow-sm"
                >
                  <Trees className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Chop</span>
                </button>
                <button 
                  onClick={() => manualGather('stone', 1)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Pickaxe className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Mine</span>
                </button>
             </div>
          </div>

          <GameLog logs={state.logs} />
        </div>

        {/* Right Column: Actions & Buildings */}
        <div className="lg:col-span-8">
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setActiveTab('buildings')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === 'buildings' ? 'bg-amber-900 text-white shadow-lg' : 'bg-white text-amber-900 hover:bg-amber-50'
              }`}
            >
              Infrastructure
            </button>
            <button 
              onClick={() => setActiveTab('town')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === 'town' ? 'bg-amber-900 text-white shadow-lg' : 'bg-white text-amber-900 hover:bg-amber-50'
              }`}
            >
              Management
            </button>
            <button 
              onClick={() => setActiveTab('research')}
              className={`px-6 py-2 rounded-full font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'research' ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Beaker className="w-4 h-4" />
              <span>Research</span>
            </button>
          </div>

          {activeTab === 'buildings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(state.buildings).map((building) => {
                // Requirement Check
                const meetsBuildings = !building.requirements?.buildings || 
                  Object.entries(building.requirements.buildings).every(([reqId, count]) => 
                    state.buildings[reqId].count >= count
                  );
                const meetsTier = !building.requirements?.tier || state.tier >= building.requirements.tier;

                if (!meetsBuildings || !meetsTier) return null;

                return (
                  <BuildingCard 
                    key={building.id}
                    building={building}
                    onBuy={buyBuilding}
                    currentResources={state.resources}
                  />
                );
              })}
            </div>
          )}

          {activeTab === 'research' && (
            <ResearchList 
              techs={state.techs}
              science={state.resources.science}
              onResearch={researchTech}
            />
          )}

          {activeTab === 'town' && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200 text-center">
              <div className="mb-6 inline-block p-4 bg-amber-50 rounded-full">
                <Info className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-black text-amber-950 mb-2">Town Management</h2>
              <p className="text-stone-600 mb-8 max-w-md mx-auto font-serif">
                Advanced management features like taxation, laws, and festivals will unlock as your population reaches the Town tier.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 grayscale pointer-events-none">
                <div className="p-4 border-2 border-dashed border-stone-300 rounded-xl">
                  <p className="font-bold">Tax Rate</p>
                  <p className="text-sm text-stone-500 italic">Locked</p>
                </div>
                <div className="p-4 border-2 border-dashed border-stone-300 rounded-xl">
                  <p className="font-bold">Social Laws</p>
                  <p className="text-sm text-stone-500 italic">Locked</p>
                </div>
                <div className="p-4 border-2 border-dashed border-stone-300 rounded-xl">
                  <p className="font-bold">Cultural Festivals</p>
                  <p className="text-sm text-stone-500 italic">Locked</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      <footer className="mt-12 p-8 border-t border-stone-200 text-center text-stone-400 text-sm">
        <p>Aeon Settlement &copy; 2024 - A journey through the ages.</p>
        <p className="mt-2 font-mono uppercase tracking-widest text-[10px]">Autosave enabled</p>
      </footer>
    </div>
  );
}

export default App;
