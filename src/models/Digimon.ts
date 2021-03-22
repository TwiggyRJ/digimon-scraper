import { Attribute, Digimon as IDigimon, Stage, Type } from '../interfaces/interfaces';

export class Digimon implements IDigimon {
    name = '';
    number = 0;
    stage = Stage.trainingLower;
    attribute = Attribute.free;
    type = Type.neutral;
    memoryUsage = 2;
    equipmentSlot = 0;
    digivolutionConditions = null;
    digivolutionHistory = [];
    digivolutionPotential = [];
    drops = [];
    moves = [];
    typeEffectiveness = null;
    spawnLocations = [];
    stats = [];
    supportSkill = {
        title: '',
        description: '',
        url: ''
    }

    constructor(name: string, number: string | number, stage: Stage, type: Type) {
        this.name = name;
        this.number = Number(number);
        this.stage = stage;
        this.type = type;
    }
}