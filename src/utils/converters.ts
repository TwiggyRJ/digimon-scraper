import {
    Attribute,
    Stage,
    Type,
    ItemCategory,
} from '../interfaces/interfaces';

export function getType(rawValue: string): Type {
    switch (rawValue) {
        case 'Data':
            return Type.data;
        
        case 'Free':
            return Type.free;

        case 'Vaccine':
            return Type.vaccine;

        case 'Virus':
            return Type.virus;
    
        default:
            return Type.free;
    }
}

export function getAttribute(rawValue: string): Attribute {
    switch (rawValue) {
        case 'Dark':
            return Attribute.dark;
        
        case 'Earth':
            return Attribute.earth;

        case 'Electric':
            return Attribute.electric;

        case 'Fire':
            return Attribute.fire;

        case 'Light':
            return Attribute.light;

        case 'Neutral':
            return Attribute.neutral;

        case 'Plant':
            return Attribute.plant;

        case 'Water':
            return Attribute.water;

        case 'Wind':
            return Attribute.wind;
    
        default:
            return Attribute.neutral;
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