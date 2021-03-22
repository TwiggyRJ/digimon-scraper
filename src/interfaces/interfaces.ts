export enum Effectiveness {
    strength = 'strength',
    weakness = 'weakness'
}

export enum Type {
    data = 'data',
    free = 'free',
    vaccine = 'vaccine',
    virus = 'virus',
}

export enum Attribute {
    dark = 'dark',
    earth = 'earth',
    electric = 'electric',
    fire = 'fire',
    light = 'light',
    neutral = 'neutral',
    plant = 'plant',
    water = 'water',
    wind = 'wind'
}

export enum Stage {
    trainingLower = 'training-lower',
    trainingUpper = 'training-upper',
    rookie = 'rookie',
    champion = 'champion',
    ultimate = 'ultimate',
    mega = 'mega',
    ultra = 'ultra',
    armor = 'armor'
}

export enum ItemCategory {
    consumable = 'consumable',
    medal = 'medal',
}

export interface TypeEffectiveness {
    effectiveness: Effectiveness;
    type: string;
}

export interface SupportSkill {
    title: string;
    description: string;
    url: string;
}

export interface Stats {
    name: string;
    value: number;
    maxValue: number;
}

export interface SpawnLocation {
    area: {
        name: string;
        url: string;
    };
    dropExp: number;
    dropYen: number;
    zone: {
        name: string;
        url: string;
    }
}

export interface Moves {
    name: string;
    levelAcquired: number;
    attribute: Attribute;
    type: Type;
    spCost: number;
    power: number;
    skillType: string;
    url: string;
}

export interface Drop {
    name: string;
    category: ItemCategory;
    dropArea: {
        name: string;
        url: string;
    };
    unlocks: string;
    zone: {
        name: string;
        url: string;
    }
}

export interface DigivolutionRoute {
    name: string;
    stage: Stage;
    attribute: Attribute;
    type: Type;
}

export interface DigivolutionConditions {
    level: number | null;
    attack: number | null;
    defence: number | null;
    hp: number | null;
    intelligence: number | null;
    sp: number | null;
    speed: number | null;
    ability: number | null;
    camaraderie: number | null;
    additionalRequirements: string | null;
}

export interface DigimonMeta {
    digivolutionConditions: DigivolutionConditions | null;
    digivolutionPotential: DigivolutionRoute[];
    digivolutionHistory: DigivolutionRoute[];
    drops: Drop[];
    moves: Moves[];
    typeEffectiveness: TypeEffectiveness[] | null;
    spawnLocations: SpawnLocation[];
    stats: Stats[];
    supportSkill: SupportSkill;
}

export interface Digimon extends DigimonMeta {
    name: string;
    number: number
    stage: Stage;
    attribute: Attribute;
    type: Type;
    memoryUsage: number;
    equipmentSlot: number;
}