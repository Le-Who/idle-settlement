
export type ResourceType = 'wood' | 'stone' | 'food' | 'gold' | 'population' | 'science';

export interface Resources {
  wood: number;
  stone: number;
  food: number;
  gold: number;
  population: number;
  science: number;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: Partial<Resources>;
  costMultiplier: number;
  count: number;
  produces?: Partial<Resources>;
  consumes?: Partial<Resources>;
  capacity?: Partial<Resources>;
  requirements?: {
    buildings?: Record<string, number>;
    resources?: Partial<Resources>;
    tier?: number;
  };
}

import { Tech } from '../constants/techData';

export interface GameState {
  resources: Resources;
  buildings: Record<string, Building>;
  techs: Tech[];
  tier: number;
  startTime: number;
  lastTick: number;
  logs: string[];
  offlineSeconds?: number;
}
