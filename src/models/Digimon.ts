import { Attribute, Digimon as IDigimon, Stage, Type } from '../interfaces/interfaces';

export class Digimon implements IDigimon {
    name = '';
    description = '';
    number = 0;
    stage = Stage.trainingLower;
    type = Type.free;
    attribute = Attribute.neutral;
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
    supportSkill = ''
}