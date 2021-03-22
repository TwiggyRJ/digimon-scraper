import {
    Attribute,
    Stage,
    Type,
    ItemCategory,
} from '../interfaces/interfaces';

export function getAttribute(rawValue: string): Attribute {
    switch (rawValue) {
        case 'Data':
            return Attribute.data;
        
        case 'Free':
            return Attribute.free;

        case 'Vaccine':
            return Attribute.vaccine;

        case 'Virus':
            return Attribute.virus;
    
        default:
            return Attribute.free;
    }
}

export function getType(rawValue: string): Type {
    switch (rawValue) {
        case 'Dark':
            return Type.dark;
        
        case 'Earth':
            return Type.earth;

        case 'Electric':
            return Type.electric;

        case 'Fire':
            return Type.fire;

        case 'Light':
            return Type.light;

        case 'Neutral':
            return Type.neutral;

        case 'Plant':
            return Type.plant;

        case 'Water':
            return Type.water;

        case 'Wind':
            return Type.wind;
    
        default:
            return Type.neutral;
    }
}

export function getStage(rawValue: string): Stage {
    switch (rawValue) {
        case 'Training 1':
            return Stage.trainingLower;
        
        case 'Training 2':
            return Stage.trainingUpper;

        case 'Rookie':
            return Stage.rookie;

        case 'Champion':
            return Stage.champion;

        case 'Ultimate':
            return Stage.ultimate;

        case 'Mega':
            return Stage.mega;

        case 'Ultra':
            return Stage.ultra;

        case 'Armor':
            return Stage.armor;
    
        default:
            return Stage.trainingLower;
    }
}

export function getItemCategory(rawValue: string): ItemCategory {
    switch (rawValue) {
        case 'Consumable':
            return ItemCategory.consumable
    
        case 'Medal':
            return ItemCategory.medal;

        default:
            return ItemCategory.consumable;
    }
}