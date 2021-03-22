"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDigimonMetaData = void 0;
// digimon-scraper.ts
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var interfaces_1 = require("./interfaces");
var urls = [
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/339-leopardmon-nx',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/1-kuramon',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/238-grandracmon',
    'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/144-andromon'
];
function getAttribute(rawValue) {
    switch (rawValue) {
        case 'Data':
            return interfaces_1.Attribute.data;
        case 'Free':
            return interfaces_1.Attribute.free;
        case 'Vaccine':
            return interfaces_1.Attribute.vaccine;
        case 'Virus':
            return interfaces_1.Attribute.virus;
        default:
            return interfaces_1.Attribute.free;
    }
}
function getType(rawValue) {
    switch (rawValue) {
        case 'Dark':
            return interfaces_1.Type.dark;
        case 'Earth':
            return interfaces_1.Type.earth;
        case 'Electric':
            return interfaces_1.Type.electric;
        case 'Fire':
            return interfaces_1.Type.fire;
        case 'Light':
            return interfaces_1.Type.light;
        case 'Neutral':
            return interfaces_1.Type.neutral;
        case 'Plant':
            return interfaces_1.Type.plant;
        case 'Water':
            return interfaces_1.Type.water;
        case 'Wind':
            return interfaces_1.Type.wind;
        default:
            return interfaces_1.Type.neutral;
    }
}
function getStage(rawValue) {
    switch (rawValue) {
        case 'Training 1':
            return interfaces_1.Stage.trainingLower;
        case 'Training 2':
            return interfaces_1.Stage.trainingUpper;
        case 'Rookie':
            return interfaces_1.Stage.rookie;
        case 'Champion':
            return interfaces_1.Stage.champion;
        case 'Ultimate':
            return interfaces_1.Stage.ultimate;
        case 'Mega':
            return interfaces_1.Stage.mega;
        case 'Ultra':
            return interfaces_1.Stage.ultra;
        case 'Armor':
            return interfaces_1.Stage.armor;
        default:
            return interfaces_1.Stage.trainingLower;
    }
}
function getItemCategory(rawValue) {
    switch (rawValue) {
        case 'Consumable':
            return interfaces_1.ItemCategory.consumable;
        case 'Medal':
            return interfaces_1.ItemCategory.medal;
        default:
            return interfaces_1.ItemCategory.consumable;
    }
}
function getSupportSkill(element, $) {
    var supportSkillTable = $(element).find('table.table-no-stretch.center > tbody > tr');
    var supportSkillTitle = $(supportSkillTable).find('td:nth-child(1)').text();
    var supportSkillUrl = $(supportSkillTable).find('td:nth-child(1) > a').attr('href');
    var supportSkillDescription = $(supportSkillTable).find('td:nth-child(2)').text();
    var supportSkill = {
        title: supportSkillTitle,
        description: supportSkillDescription,
        url: supportSkillUrl || ''
    };
    return supportSkill;
}
function handleElementBoxOne(element, $) {
    var elements = $(element).find('.element-overflow');
    if (elements.length > 2) {
        var typeEffectivenessTable = $(elements[1]).find('table.table-no-stretch.center > tbody > tr');
        var typeEffectiveness_1 = [];
        typeEffectivenessTable.each(function (index, typing) {
            var key = $(typing).find('td:nth-child(1)').text();
            var type = $(typing).find('td:nth-child(2)').text();
            var effectiveness = interfaces_1.Effectiveness.weakness;
            if (key === 'Strong against:') {
                effectiveness = interfaces_1.Effectiveness.strength;
            }
            var digimonEffectiveness = {
                effectiveness: effectiveness,
                type: type
            };
            typeEffectiveness_1.push(digimonEffectiveness);
        });
        var supportSkill = getSupportSkill(elements[2], $);
        return {
            typeEffectiveness: typeEffectiveness_1,
            supportSkill: supportSkill
        };
    }
    else {
        var supportSkill = getSupportSkill(elements[1], $);
        return {
            typeEffectiveness: null,
            supportSkill: supportSkill
        };
    }
}
function getBaseStats(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var stats = [];
    table.each(function (index, row) {
        if (index > 0) {
            var name_1 = $(row).find('th:nth-child(1)').text();
            var value = $(row).find('td:nth-child(2)').text();
            var maxValue = $(row).find('td:nth-child(4)').text();
            var stat = {
                name: name_1,
                value: Number(value),
                maxValue: Number(maxValue)
            };
            stats.push(stat);
        }
    });
    return stats;
}
function getEvolvesTo(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var digivolutions = [];
    table.each(function (index, row) {
        var name = $(row).find('td:nth-child(2) > a').text();
        var stage = $(row).find('td:nth-child(3)').text();
        var attribute = $(row).find('td:nth-child(4)').text();
        var type = $(row).find('td:nth-child(5)').text();
        var digivolution = {
            name: name,
            stage: getStage(stage),
            attribute: getAttribute(attribute),
            type: getType(type)
        };
        digivolutions.push(digivolution);
    });
    return digivolutions;
}
function getSpawnLocations(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var spawnLocations = [];
    table.each(function (index, row) {
        var rawYen = $(row).find('td:nth-child(3)').text();
        var yen = "" + rawYen.replace(' ¥', '');
        var exp = $(row).find('td:nth-child(4)').text();
        var area = $(row).find('td:nth-child(5) > a').text();
        var areaUrl = $(row).find('td:nth-child(5) > a').attr('href');
        var zone = $(row).find('td:nth-child(6) > a').text();
        var zoneUrl = $(row).find('td:nth-child(6) > a').attr('href');
        var spawnLocation = {
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
function getMoves(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var moves = [];
    table.each(function (index, row) {
        var name = $(row).find('td:nth-child(2) > a').text();
        var url = $(row).find('td:nth-child(2) > a').attr('href');
        var level = $(row).find('td:nth-child(3)').text();
        var attribute = $(row).find('td:nth-child(4)').text();
        var type = $(row).find('td:nth-child(5)').text();
        var spCost = $(row).find('td:nth-child(6)').text();
        var power = $(row).find('td:nth-child(7)').text();
        var skillType = $(row).find('td:nth-child(8)').text();
        var move = {
            name: name,
            levelAcquired: Number(level),
            attribute: getAttribute(attribute),
            type: getType(type),
            spCost: Number(spCost),
            power: Number(power),
            skillType: skillType,
            url: url || ''
        };
        moves.push(move);
    });
    return moves;
}
function getDrops(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var drops = [];
    table.each(function (index, row) {
        var name = $(row).find('td:nth-child(2) > a').text();
        var category = $(row).find('td:nth-child(3)').text();
        var area = $(row).find('td:nth-child(4) > a').text();
        var areaUrl = $(row).find('td:nth-child(4) > a').attr('href');
        var unlocks = $(row).find('td:nth-child(5)').text();
        var zone = $(row).find('td:nth-child(6) > a').text();
        var zoneUrl = $(row).find('td:nth-child(6) > a').attr('href');
        var drop = {
            name: name,
            category: getItemCategory(category),
            dropArea: {
                name: area,
                url: areaUrl || ''
            },
            unlocks: unlocks,
            zone: {
                name: zone,
                url: zoneUrl || ''
            }
        };
        drops.push(drop);
    });
    return drops;
}
function getDigivolutionConditions(element, $) {
    var table = $(element).find('.element-overflow > table > tbody > tr');
    var level = $(table).find('td:nth-child(1)').text();
    var attack = $(table).find('td:nth-child(2)').text();
    var defence = $(table).find('td:nth-child(3)').text();
    var hp = $(table).find('td:nth-child(4)').text();
    var intelligence = $(table).find('td:nth-child(5)').text();
    var sp = $(table).find('td:nth-child(6)').text();
    var speed = $(table).find('td:nth-child(7)').text();
    var ability = $(table).find('td:nth-child(8)').text();
    var camaraderie = $(table).find('td:nth-child(9)').text();
    var additionalRequirements = $(table).find('td:nth-child(10)').text();
    var digivolutionConditions = {
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
function getDigimonMetaData(digimonUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var digimon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    digimon = {
                        digivolutionConditions: null,
                        digivolutionRoutes: [],
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
                    return [4 /*yield*/, axios_1.default(digimonUrl)
                            .then(function (response) {
                            var html = response.data;
                            var $ = cheerio_1.default.load(html);
                            var elementBoxes = $('.container > .page-wrapper > main > .box');
                            if (elementBoxes.length === 5) {
                                elementBoxes.each(function (index, element) {
                                    switch (index) {
                                        case 0:
                                            var vals = handleElementBoxOne(element, $);
                                            digimon.typeEffectiveness = vals.typeEffectiveness;
                                            digimon.supportSkill = vals.supportSkill;
                                            break;
                                        case 1:
                                            var stats = getBaseStats(element, $);
                                            digimon.stats = stats;
                                            break;
                                        case 3:
                                            var moves = getMoves(element, $);
                                            digimon.moves = moves;
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                            else if (elementBoxes.length === 6) {
                                elementBoxes.each(function (index, element) {
                                    switch (index) {
                                        case 0:
                                            var vals = handleElementBoxOne(element, $);
                                            digimon.typeEffectiveness = vals.typeEffectiveness;
                                            digimon.supportSkill = vals.supportSkill;
                                            break;
                                        case 1:
                                            var stats = getBaseStats(element, $);
                                            digimon.stats = stats;
                                            break;
                                        case 2:
                                            var conditions = getDigivolutionConditions(element, $);
                                            digimon.digivolutionConditions = conditions;
                                            break;
                                        case 3:
                                            var digivolutions = getEvolvesTo(element, $);
                                            digimon.digivolutionRoutes = digivolutions;
                                            break;
                                        case 4:
                                            var moves = getMoves(element, $);
                                            digimon.moves = moves;
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                            else if (elementBoxes.length === 7) {
                                elementBoxes.each(function (index, element) {
                                    switch (index) {
                                        case 0:
                                            var vals = handleElementBoxOne(element, $);
                                            digimon.typeEffectiveness = vals.typeEffectiveness;
                                            digimon.supportSkill = vals.supportSkill;
                                            break;
                                        case 1:
                                            var stats = getBaseStats(element, $);
                                            digimon.stats = stats;
                                            break;
                                        case 2:
                                            var digivolutions = getEvolvesTo(element, $);
                                            digimon.digivolutionRoutes = digivolutions;
                                            break;
                                        case 3:
                                            var moves = getMoves(element, $);
                                            digimon.moves = moves;
                                            break;
                                        case 4:
                                            var spawnLocations = getSpawnLocations(element, $);
                                            digimon.spawnLocations = spawnLocations;
                                            break;
                                        case 5:
                                            var drops = getDrops(element, $);
                                            digimon.drops = drops;
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                            console.log(digimon);
                        })
                            .catch(console.error)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, digimon];
            }
        });
    });
}
exports.getDigimonMetaData = getDigimonMetaData;
