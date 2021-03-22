// digimon-scraper.ts
import axios from 'axios';
import cheerio from 'cheerio';

import {
    Drop,
    Effectiveness,
    DigivolutionConditions,
    DigivolutionRoute,
    Moves,
    SpawnLocation,
    Stats,
    SupportSkill,
    TypeEffectiveness,
    DigimonMeta,
    Digimon,
    Stage,
    Attribute,
    Type
} from './interfaces/interfaces';
import { getAttribute, getItemCategory, getStage, getType } from './utils/converters';

let urls = [
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/339-leopardmon-nx',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/1-kuramon',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/238-grandracmon',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/144-andromon'
];

function getSupportSkill(element: cheerio.Element, $: cheerio.Root): SupportSkill {
    const supportSkillTable = $(element).find('table.table-no-stretch.center > tbody > tr');
    const supportSkillTitle = $(supportSkillTable).find('td:nth-child(1)').text();
    const supportSkillUrl = $(supportSkillTable).find('td:nth-child(1) > a').attr('href');
    const supportSkillDescription = $(supportSkillTable).find('td:nth-child(2)').text();

    const supportSkill: SupportSkill = {
        title: supportSkillTitle,
        description: supportSkillDescription,
        url: supportSkillUrl || ''
    };

    return supportSkill;
}

function handleElementBoxOne(element: cheerio.Element, $: cheerio.Root) {
    const elements = $(element).find('.element-overflow');

    const digimon = getBaseDigimon(elements[0], $);

    if (elements.length > 2) {
        const typeEffectivenessTable = $(elements[1]).find('table.table-no-stretch.center > tbody > tr');
        const typeEffectiveness: TypeEffectiveness[] = [];

        typeEffectivenessTable.each((index: number, typing: cheerio.Element) => {
            const key = $(typing).find('td:nth-child(1)').text();
            const type = $(typing).find('td:nth-child(2)').text();
            let effectiveness = Effectiveness.weakness;

            if (key === 'Strong against:') {
                effectiveness = Effectiveness.strength;
            }

            const digimonEffectiveness: TypeEffectiveness = {
                effectiveness,
                type
            };

            typeEffectiveness.push(digimonEffectiveness);
        });

        const supportSkill = getSupportSkill(elements[2], $);

        return {
            ...digimon,
            typeEffectiveness,
            supportSkill
        }
    } else {
        const supportSkill = getSupportSkill(elements[1], $);

        return {
            ...digimon,
            typeEffectiveness: null,
            supportSkill
        }
    }
}

function getBaseDigimon(element: cheerio.Element, $: cheerio.Root) {
    const digimonTable = $(element).find('table.table.info-table > tbody > tr');

    const digimon = {
        name: '',
        number: 0,
        stage: Stage.trainingLower,
        attribute: Attribute.free,
        type: Type.neutral,
        memoryUsage: 0,
        equipmentSlot: 0,
    };

    digimonTable.each((index: number, row: cheerio.Element) => {
        const key = $(row).find('th').text();
        const value = $(row).find('td').text();
        switch (key) {
            case 'Name':
                digimon.name = value;
                break;
            
            case 'Stage':
                digimon.stage = getStage(value);
                break;

            case 'Attribute':
                digimon.attribute = getAttribute(value);
                break;

            case 'Type':
                digimon.type = getType(value);
                break;

            case 'Memory':
                digimon.memoryUsage = Number(value);
                break;

            case 'Equipment':
                digimon.equipmentSlot = Number(value);
                break;
        
            default:
                break;
        }
    });

    return digimon;
}

function getBaseStats(element: cheerio.Element, $: cheerio.Root): Stats[] {
    const table = $(element).find('.element-overflow > table > tbody > tr');
    const stats: Stats[] = [];

    table.each((index: number, row: cheerio.Element) => {
        if (index > 0) {
            const name = $(row).find('th:nth-child(1)').text();
            const value = $(row).find('td:nth-child(2)').text();
            const maxValue = $(row).find('td:nth-child(4)').text();

            const stat: Stats = {
                name,
                value: Number(value),
                maxValue: Number(maxValue)
            };

            stats.push(stat);
        }
    });

    return stats;
}

function getDigivolutions(element: cheerio.Element, $: cheerio.Root): DigivolutionRoute[] {
    const table = $(element).find('.element-overflow > table > tbody > tr');
    const digivolutions: DigivolutionRoute[] = [];

    table.each((index: number, row: cheerio.Element) => {
        const name = $(row).find('td:nth-child(2) > a').text();
        const stage = $(row).find('td:nth-child(3)').text();
        const attribute = $(row).find('td:nth-child(4)').text();
        const type = $(row).find('td:nth-child(5)').text();

        const digivolution: DigivolutionRoute = {
            name,
            stage: getStage(stage),
            attribute: getAttribute(attribute),
            type: getType(type)
        };

        digivolutions.push(digivolution);
    });

    return digivolutions;
}

function getSpawnLocations(element: cheerio.Element, $: cheerio.Root): SpawnLocation[] {
    const table = $(element).find('.element-overflow > table > tbody > tr');
    const spawnLocations: SpawnLocation[] = [];

    table.each((index: number, row: cheerio.Element) => {
        const rawYen = $(row).find('td:nth-child(3)').text();
        const yen = `${rawYen.replace(' ¥', '')}`;
        const exp = $(row).find('td:nth-child(4)').text();
        const area = $(row).find('td:nth-child(5) > a').text();
        const areaUrl = $(row).find('td:nth-child(5) > a').attr('href');
        const zone = $(row).find('td:nth-child(6) > a').text();
        const zoneUrl = $(row).find('td:nth-child(6) > a').attr('href');

        const spawnLocation: SpawnLocation = {
            dropYen: Number(yen),
            dropExp: Number(exp),
            area: {
                name: area,
                url: areaUrl || ''
            },
            zone: {
                name: zone,
                url: zoneUrl || ''
            }
        };

        spawnLocations.push(spawnLocation);
    });

    return spawnLocations;
}

function getMoves(element: cheerio.Element, $: cheerio.Root): Moves[] {
    const table = $(element).find('.element-overflow > table > tbody > tr');
    const moves: Moves[] = [];

    table.each((index: number, row: cheerio.Element) => {
        const name = $(row).find('td:nth-child(2) > a').text();
        const url = $(row).find('td:nth-child(2) > a').attr('href');
        const level = $(row).find('td:nth-child(3)').text();
        const attribute = $(row).find('td:nth-child(4)').text();
        const type = $(row).find('td:nth-child(5)').text();
        const spCost = $(row).find('td:nth-child(6)').text();
        const power = $(row).find('td:nth-child(7)').text();
        const skillType = $(row).find('td:nth-child(8)').text();

        const move: Moves = {
            name,
            levelAcquired: Number(level),
            attribute: getAttribute(attribute),
            type: getType(type),
            spCost: Number(spCost),
            power: Number(power),
            skillType,
            url: url || ''
        };

        moves.push(move);
    });

    return moves;
}

function getDrops(element: cheerio.Element, $: cheerio.Root): Drop[] {
    const table = $(element).find('.element-overflow > table > tbody > tr');
    const drops: Drop[] = [];

    table.each((index: number, row: cheerio.Element) => {
        const name = $(row).find('td:nth-child(2) > a').text();
        const category = $(row).find('td:nth-child(3)').text();
        const area = $(row).find('td:nth-child(4) > a').text();
        const areaUrl = $(row).find('td:nth-child(4) > a').attr('href');
        const unlocks = $(row).find('td:nth-child(5)').text();
        const zone = $(row).find('td:nth-child(6) > a').text();
        const zoneUrl = $(row).find('td:nth-child(6) > a').attr('href');

        const drop: Drop = {
            name,
            category: getItemCategory(category),
            dropArea: {
                name: area,
                url: areaUrl || ''
            },
            unlocks,
            zone: {
                name: zone,
                url: zoneUrl || ''
            }
        };

        drops.push(drop);
    });

    return drops;
}

function getDigivolutionConditions(element: cheerio.Element, $: cheerio.Root): DigivolutionConditions {
    const table = $(element).find('.element-overflow > table > tbody > tr');

    const level = $(table).find('td:nth-child(1)').text();
    const attack = $(table).find('td:nth-child(2)').text();
    const defence = $(table).find('td:nth-child(3)').text();
    const hp = $(table).find('td:nth-child(4)').text();
    const intelligence = $(table).find('td:nth-child(5)').text();
    const sp = $(table).find('td:nth-child(6)').text();
    const speed = $(table).find('td:nth-child(7)').text();
    const ability = $(table).find('td:nth-child(8)').text();
    const camaraderie = $(table).find('td:nth-child(9)').text();
    const additionalRequirements = $(table).find('td:nth-child(10)').text();

    const digivolutionConditions: DigivolutionConditions = {
        level: level === '-' ? null : Number(level),
        attack: attack === '-' ? null : Number(attack),
        defence: defence === '-' ? null : Number(defence),
        hp: hp === '-' ? null : Number(hp),
        intelligence: intelligence === '-' ? null : Number(intelligence),
        sp: sp === '-' ? null : Number(sp),
        speed: speed === '-' ? null : Number(speed),
        ability: ability === '-' ? null : Number(ability),
        camaraderie: camaraderie === '-' ? null : Number(camaraderie),
        additionalRequirements: additionalRequirements === '-' ? null : additionalRequirements,
    };

    return digivolutionConditions;
}

export async function getDigimonMetaData(digimonUrl: string): Promise<Digimon> {
    const digimon: Digimon = {
        name: '',
        number: 0,
        stage: Stage.trainingLower,
        attribute: Attribute.free,
        type: Type.neutral,
        memoryUsage: 2,
        equipmentSlot: 0,
        digivolutionConditions: null,
        digivolutionPotential: [],
        digivolutionHistory: [],
        drops: [],
        moves: [],
        typeEffectiveness: null,
        spawnLocations: [],
        stats: [],
        supportSkill: {
            title: '',
            description: '',
            url: ''
        }
    };

    await axios(digimonUrl)
        .then(response => {
            const html = response.data;
            const $: cheerio.Root = cheerio.load(html);
            const elementBoxes = $('.container > .page-wrapper > main > .box');

            console.log(elementBoxes.length)

            if (elementBoxes.length === 5) {
                elementBoxes.each((index: number, element: cheerio.Element) => {
                    switch (index) {
                        case 0:
                            const vals = handleElementBoxOne(element, $);
                            digimon.name = vals.name;
                            digimon.number = vals.number;
                            digimon.stage = vals.stage;
                            digimon.attribute = vals.attribute;
                            digimon.type = vals.type;
                            digimon.memoryUsage = vals.memoryUsage;
                            digimon.equipmentSlot = vals.equipmentSlot;
                            digimon.typeEffectiveness = vals.typeEffectiveness;
                            digimon.supportSkill = vals.supportSkill;
                            break;
        
                        case 1:
                            const stats = getBaseStats(element, $);
                            digimon.stats = stats;
                            break;

                        case 3:
                            const moves = getMoves(element, $);
                            digimon.moves = moves;
                            break;
                    
                        default:
                            break;
                    }
                });
            } else if (elementBoxes.length === 6) {
                elementBoxes.each((index: number, element: cheerio.Element) => {
                    switch (index) {
                        case 0:
                            const vals = handleElementBoxOne(element, $);
                            digimon.name = vals.name;
                            digimon.number = vals.number;
                            digimon.stage = vals.stage;
                            digimon.attribute = vals.attribute;
                            digimon.type = vals.type;
                            digimon.memoryUsage = vals.memoryUsage;
                            digimon.equipmentSlot = vals.equipmentSlot;
                            digimon.typeEffectiveness = vals.typeEffectiveness;
                            digimon.supportSkill = vals.supportSkill;
                            break;
        
                        case 1:
                            const stats = getBaseStats(element, $);
                            digimon.stats = stats;
                            break;

                        case 2:
                            const conditions = getDigivolutionConditions(element, $);
                            digimon.digivolutionConditions = conditions;
                            break;

                        case 3:
                            const digivolutions = getDigivolutions(element, $);
                            digimon.digivolutionPotential = digivolutions;
                            break;

                        case 4:
                            const moves = getMoves(element, $);
                            digimon.moves = moves;
                            break;
                    
                        default:
                            break;
                    }
                });
            } else if (elementBoxes.length === 7) {
                elementBoxes.each((index: number, element: cheerio.Element) => {
                    switch (index) {
                        case 0:
                            const vals = handleElementBoxOne(element, $);
                            digimon.name = vals.name;
                            digimon.number = vals.number;
                            digimon.stage = vals.stage;
                            digimon.attribute = vals.attribute;
                            digimon.type = vals.type;
                            digimon.memoryUsage = vals.memoryUsage;
                            digimon.equipmentSlot = vals.equipmentSlot;
                            digimon.typeEffectiveness = vals.typeEffectiveness;
                            digimon.supportSkill = vals.supportSkill;
                            break;
        
                        case 1:
                            const stats = getBaseStats(element, $);
                            digimon.stats = stats;
                            break;

                        case 2:
                            const digivolutions = getDigivolutions(element, $);
                            digimon.digivolutionPotential = digivolutions;
                            break;

                        case 3:
                            const moves = getMoves(element, $);
                            digimon.moves = moves;
                            break;

                        case 4:
                            const spawnLocations = getSpawnLocations(element, $);
                            digimon.spawnLocations = spawnLocations;
                            break;
                        
                        case 5:
                            const drops = getDrops(element, $);
                            digimon.drops = drops;
                            break;
                    
                        default:
                            break;
                    }
                });
            } else if (elementBoxes.length === 9) {
                elementBoxes.each((index: number, element: cheerio.Element) => {
                    switch (index) {
                        case 0:
                            const vals = handleElementBoxOne(element, $);
                            digimon.name = vals.name;
                            digimon.number = vals.number;
                            digimon.stage = vals.stage;
                            digimon.attribute = vals.attribute;
                            digimon.type = vals.type;
                            digimon.memoryUsage = vals.memoryUsage;
                            digimon.equipmentSlot = vals.equipmentSlot;
                            digimon.typeEffectiveness = vals.typeEffectiveness;
                            digimon.supportSkill = vals.supportSkill;
                            break;
        
                        case 1:
                            const stats = getBaseStats(element, $);
                            digimon.stats = stats;
                            break;

                        case 2:
                            const conditions = getDigivolutionConditions(element, $);
                            digimon.digivolutionConditions = conditions;
                            break;

                        case 3:
                            const digivolutionHistory = getDigivolutions(element, $);

                            if (Array.isArray(digivolutionHistory)) {
                                digimon.digivolutionHistory = digivolutionHistory;
                            }
                            
                            break;

                        case 4:
                            const digivolutions = getDigivolutions(element, $);

                            if (Array.isArray(digivolutions)) {
                                digimon.digivolutionPotential = digivolutions;
                            }

                            break;

                        case 5:
                            const moves = getMoves(element, $);
                            digimon.moves = moves;
                            break;

                        case 6:
                            const spawnLocations = getSpawnLocations(element, $);
                            digimon.spawnLocations = spawnLocations;
                            break;
                        
                        case 7:
                            const drops = getDrops(element, $);
                            digimon.drops = drops;
                            break;
                    
                        default:
                            break;
                    }
                });
            }
            
            console.log(digimon);

        })
        .catch(console.error);

    return digimon;
}
