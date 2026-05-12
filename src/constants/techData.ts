
export interface Tech {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  onUnlock: string; // Key of the building it unlocks or a global effect
}

export const INITIAL_TECHS: Tech[] = [
  {
    id: 'agriculture',
    name: 'Advanced Agriculture',
    description: 'Improves food production by 50%.',
    cost: 100,
    unlocked: false,
    onUnlock: 'effect_food_boost'
  },
  {
    id: 'masonry',
    name: 'Masonry',
    description: 'Unlocks advanced stone buildings.',
    cost: 250,
    unlocked: false,
    onUnlock: 'unlock_stone_mason'
  },
  {
    id: 'commerce',
    name: 'Commerce',
    description: 'Unlocks the Market building.',
    cost: 500,
    unlocked: false,
    onUnlock: 'unlock_market'
  }
];
