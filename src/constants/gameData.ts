
import { Building } from '../types/game';

export const INITIAL_BUILDINGS: Record<string, Building> = {
  tent: {
    id: 'tent',
    name: 'Tent',
    description: 'A primitive shelter. Increases population capacity.',
    baseCost: { wood: 10 },
    costMultiplier: 1.15,
    count: 0,
    capacity: { population: 2 },
  },
  woodcutter: {
    id: 'woodcutter',
    name: 'Woodcutter',
    description: 'Gathers wood from nearby forests.',
    baseCost: { wood: 15, food: 5 },
    costMultiplier: 1.2,
    count: 0,
    produces: { wood: 0.5 },
  },
  gatherer: {
    id: 'gatherer',
    name: 'Gatherer Hut',
    description: 'Finds wild berries and roots.',
    baseCost: { wood: 20 },
    costMultiplier: 1.2,
    count: 0,
    produces: { food: 0.8 },
  },
  quarry: {
    id: 'quarry',
    name: 'Stone Quarry',
    description: 'Extracts stone from the earth.',
    baseCost: { wood: 50, food: 20 },
    costMultiplier: 1.3,
    count: 0,
    produces: { stone: 0.3 },
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    description: 'Cultivated land providing stable food source.',
    baseCost: { wood: 100, stone: 20 },
    costMultiplier: 1.25,
    count: 0,
    produces: { food: 2 },
    requirements: { buildings: { woodcutter: 2 }, tier: 1 }
  },
  market: {
    id: 'market',
    name: 'Market',
    description: 'Allows trade and generates gold.',
    baseCost: { wood: 200, stone: 100 },
    costMultiplier: 1.5,
    count: 0,
    produces: { gold: 0.1 },
    requirements: { buildings: { farm: 1 }, tier: 2 }
  },
  academy: {
    id: 'academy',
    name: 'Academy',
    description: 'A place of learning. Generates science.',
    baseCost: { stone: 500, gold: 100 },
    costMultiplier: 1.6,
    count: 0,
    produces: { science: 0.5 },
    requirements: { buildings: { market: 1 } }
  },
  stone_mason: {
    id: 'stone_mason',
    name: 'Stone Mason',
    description: 'Refines stone for advanced construction.',
    baseCost: { wood: 300, stone: 300 },
    costMultiplier: 1.4,
    count: 0,
    produces: { stone: 2 },
    requirements: { buildings: { quarry: 3 } }
  },
  granary: {
    id: 'granary',
    name: 'Granary',
    description: 'Increases food production efficiency.',
    baseCost: { wood: 500, stone: 200 },
    costMultiplier: 1.3,
    count: 0,
    produces: { food: 5 },
    requirements: { buildings: { farm: 5 } }
  }
};

export const TIERS = [
  { name: 'Nomadic Camp', minPop: 0 },
  { name: 'Settlement', minPop: 10 },
  { name: 'Village', minPop: 50 },
  { name: 'Town', minPop: 200 },
  { name: 'City', minPop: 1000 },
  { name: 'Metropolis', minPop: 5000 },
];
