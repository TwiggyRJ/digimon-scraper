import {
    Attribute,
    Stage,
    Type,
    ItemCategory,
    AvailableAt,
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

        case 'Equipment':
            return ItemCategory.equipment;

        case 'Farm Goods':
            return ItemCategory.farmGoods;

        case 'Key Item':
            return ItemCategory.keyItem;

        default:
            return ItemCategory.consumable;
    }
}

export function getAvailability(rawValue: string): AvailableAt | null {
    switch (rawValue) {
        case 'Chapter 2':
            return AvailableAt.chapterTwo;

        case 'Chapter 3':
            return AvailableAt.chapterThree;

        case 'Chapter 4':
            return AvailableAt.chapterFour;

        case 'Chapter 5':
            return AvailableAt.chapterFive;

        case 'Chapter 6':
            return AvailableAt.chapterSix;

        case 'Chapter 7':
            return AvailableAt.chapterSeven;

        case 'Chapter 8':
            return AvailableAt.chapterEight;

        case 'Chapter 9':
            return AvailableAt.chapterNine;

        case 'Chapter 10':
            return AvailableAt.chapterTen;

        case 'Chapter 11':
            return AvailableAt.chapterEleven;

        case 'Chapter 12':
            return AvailableAt.chapterTwelve;

        case 'Chapter 13':
            return AvailableAt.chapterThirteen;

        case 'Chapter 14':
            return AvailableAt.chapterFourteen;

        case 'Chapter 15':
            return AvailableAt.chapterFifteen;

        case 'Chapter 16':
            return AvailableAt.chapterSixteen;

        case 'Chapter 17':
            return AvailableAt.chapterSeventeen;

        case 'Chapter 18':
            return AvailableAt.chapterEighteen;

        case 'Chapter 19':
            return AvailableAt.chapterNineteen;

        case 'Chapter 20':
            return AvailableAt.chapterTwenty;

        case 'Post-Game':
            return AvailableAt.postGame;

        default:
            return null;
    }
}