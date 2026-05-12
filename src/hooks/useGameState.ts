
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Resources, Building } from '../types/game';
import { INITIAL_BUILDINGS, TIERS } from '../constants/gameData';
import { INITIAL_TECHS } from '../constants/techData';

const TICK_RATE = 1000; // 1 second
const SAVE_KEY = 'aeon_settlement_save';

const INITIAL_STATE: GameState = {
  resources: {
    wood: 20,
    stone: 0,
    food: 20,
    gold: 0,
    population: 0,
    science: 0,
  },
  buildings: INITIAL_BUILDINGS,
  techs: INITIAL_TECHS,
  tier: 0,
  startTime: Date.now(),
  lastTick: Date.now(),
  logs: ['Your people have found a suitable place to camp.'],
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const lastTick = parsed.lastTick || Date.now();
        const now = Date.now();
        const secondsPassed = Math.floor((now - lastTick) / 1000);
        
        // This is a simplified offline progress, will apply on first mount
        return { ...INITIAL_STATE, ...parsed, lastTick: now, offlineSeconds: secondsPassed };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const addLog = useCallback((msg: string) => {
    setState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 50)
    }));
  }, []);

  const calculateProduction = useCallback((buildings: Record<string, Building>) => {
    const production: Partial<Resources> = {};
    Object.values(buildings).forEach(b => {
      if (b.produces) {
        Object.entries(b.produces).forEach(([res, val]) => {
          const key = res as keyof Resources;
          production[key] = (production[key] || 0) + val * b.count;
        });
      }
    });
    return production;
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      const production = calculateProduction(prev.buildings);
      const newResources = { ...prev.resources };
      
      // Efficiency check (starving people work slower)
      const efficiency = prev.resources.food <= 0 && prev.resources.population > 0 ? 0.2 : 1.0;

      // Update resources
      Object.entries(production).forEach(([res, val]) => {
        const key = res as keyof Resources;
        newResources[key] += val * efficiency;
      });

      // Food consumption (0.1 per population)
      const currentPop = newResources.population;
      const foodNeeded = currentPop * 0.1;
      newResources.food = Math.max(0, newResources.food - foodNeeded);

      if (prev.resources.food > 0 && newResources.food <= 0 && currentPop > 0) {
        addLog("Warning: Food supplies have run out! Production has slowed to 20%.");
      }

      // Starvation check
      if (newResources.food <= 0 && currentPop > 0) {
        // Starvation logic could go here
      }

      // Check Tier progression
      let newTier = prev.tier;
      if (TIERS[prev.tier + 1] && currentPop >= TIERS[prev.tier + 1].minPop) {
        newTier += 1;
        // Logic for tier up log will be handled outside to avoid multiple logs
      }

      return {
        ...prev,
        resources: newResources,
        tier: newTier,
        lastTick: Date.now(),
      };
    });
  }, [calculateProduction]);

  useEffect(() => {
    const interval = setInterval(tick, TICK_RATE);
    return () => clearInterval(interval);
  }, [tick]);

  // Auto-save
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  const buyBuilding = (id: string) => {
    setState(prev => {
      const building = prev.buildings[id];
      if (!building) return prev;

      // Check costs
      const canAfford = Object.entries(building.baseCost).every(([res, cost]) => {
        const key = res as keyof Resources;
        const currentCost = cost * Math.pow(building.costMultiplier, building.count);
        return prev.resources[key] >= currentCost;
      });

      if (!canAfford) return prev;

      const newResources = { ...prev.resources };
      Object.entries(building.baseCost).forEach(([res, cost]) => {
        const key = res as keyof Resources;
        const currentCost = cost * Math.pow(building.costMultiplier, building.count);
        newResources[key] -= currentCost;
      });

      const newBuildings = {
        ...prev.buildings,
        [id]: { ...building, count: building.count + 1 }
      };

      // Update population if building has capacity
      if (building.capacity?.population) {
         newResources.population += building.capacity.population;
      }

      return {
        ...prev,
        resources: newResources,
        buildings: newBuildings,
      };
    });
  };

  const researchTech = (id: string) => {
    setState(prev => {
      const tech = prev.techs.find(t => t.id === id);
      if (!tech || tech.unlocked || prev.resources.science < tech.cost) return prev;

      const newResources = { ...prev.resources, science: prev.resources.science - tech.cost };
      const newTechs = prev.techs.map(t => t.id === id ? { ...t, unlocked: true } : t);
      
      return {
        ...prev,
        resources: newResources,
        techs: newTechs,
        logs: [`Research complete: ${tech.name}`, ...prev.logs]
      };
    });
  };

  const manualGather = (resource: keyof Resources, amount: number) => {
    setState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [resource]: prev.resources[resource] + amount
      }
    }));
  };

  // Handle offline progress
  useEffect(() => {
    if (state.offlineSeconds && state.offlineSeconds > 5) {
      const seconds = state.offlineSeconds;
      const production = calculateProduction(state.buildings);
      
      setState(prev => {
        const newResources = { ...prev.resources };
        Object.entries(production).forEach(([res, val]) => {
          const key = res as keyof Resources;
          newResources[key] += val * seconds;
        });

        // Limit food consumption offline to not kill everyone immediately
        const currentPop = newResources.population;
        const foodNeeded = currentPop * 0.1 * seconds;
        newResources.food = Math.max(0, newResources.food - foodNeeded);

        return {
          ...prev,
          resources: newResources,
          offlineSeconds: 0,
          logs: [`While you were away for ${Math.floor(seconds / 60)} minutes, your people worked hard.`, ...prev.logs]
        };
      });
    }
  }, []); // Only run once on mount

  return {
    state,
    buyBuilding,
    researchTech,
    manualGather,
    addLog
  };
}
