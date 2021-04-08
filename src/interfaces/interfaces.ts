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

export enum MoveType {
    magic = 'magic',
    support = 'support',
    physical = 'physical'
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
    equipment = 'equipment',
    farmGoods = 'farm-goods',
    keyItem = 'key-item',
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
    location: string;
    dropExp: number;
    dropYen: number;
}

export interface Moves {
    name: string;
    levelAcquired: number;
}

export interface Drop {
    name: string;
    category: ItemCategory;
    dropLocation: string;
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
    additionalConditions: string | null;
}

export interface DigimonMeta {
    digivolutionConditions: DigivolutionConditions | null;
    digivolutionPotential: string[];
    digivolutionHistory: string[];
    drops: Drop[];
    moves: Moves[];
    typeEffectiveness: TypeEffectiveness[] | null;
    spawnLocations: SpawnLocation[];
    stats: Stats[];
    supportSkill: string;
}

export interface Digimon extends DigimonMeta {
    name: string;
    description: string;
    image: string;
    number: number
    stage: Stage;
    attribute: Attribute;
    type: Type;
    memoryUsage: number;
    equipmentSlot: number;
    dropExp: number;
    dropMoney: number;
}

export enum AvailableAt {
    chapterTwo = 'chapter-2',
    chapterThree = 'chapter-3',
    chapterFour = 'chapter-4',
    chapterFive = 'chapter-5',
    chapterSix = 'chapter-6',
    chapterSeven = 'chapter-7',
    chapterEight = 'chapter-8',
    chapterNine = 'chapter-9',
    chapterTen = 'chapter-10',
    chapterEleven = 'chapter-11',
    chapterTwelve = 'chapter-12',
    chapterThirteen = 'chapter-13',
    chapterFourteen = 'chapter-14',
    chapterFifteen = 'chapter-15',
    chapterSixteen = 'chapter-16',
    chapterSeventeen = 'chapter-17',
    chapterEighteen = 'chapter-18',
    chapterNineteen = 'chapter-19',
    chapterTwenty = 'chapter-20',
    postGame = 'post-game'
}
