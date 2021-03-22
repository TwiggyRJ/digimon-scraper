// digimon-scraper.ts
import axios from 'axios';
import cheerio from 'cheerio';
import { getDigimonMetaData } from './digimon-scraper';
import { Digimon, DigimonMeta } from './interfaces/interfaces';
import { getAttribute, getStage, getType } from './utils/converters';
import { dir, doesDataFolderExist, storeData } from './utils/files';

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon';

export async function getDigimon(isDev: boolean) {
    try {
        doesDataFolderExist();
        
        await axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const digimonTable = $('#searchable-table > tr');
            const digimons: any[] = [];

            console.log(`Digimon in total: ${digimonTable.length}`);

            digimonTable.each(async (index, element) => {
                const name = $(element).find('td:nth-child(3) > a').text();
                const number = $(element).find('td:nth-child(1)').text();
                const stage = $(element).find('td:nth-child(4)').text();
                const attribute = $(element).find('td:nth-child(5)').text();
                const type = $(element).find('td:nth-child(6)').text();
                const memoryUsage = $(element).find('td:nth-child(7)').text();
                const equipmentSlot = $(element).find('td:nth-child(8)').text();
                const url = $(element).find('td:nth-child(3) > a').attr('href');

                let vals: DigimonMeta = {
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

                if (isDev) {
                    if (index < 2) {
                        vals = await getDigimonMetaData(url || '');
                    }
                } else {
                    vals = await getDigimonMetaData(url || '');
                }

                const digimon: Digimon = {
                    ...vals,
                    name,
                    number: Number(number),
                    stage: getStage(stage),
                    attribute: getAttribute(attribute),
                    type: getType(type),
                    memoryUsage: Number(memoryUsage),
                    equipmentSlot: Number(equipmentSlot)
                };

                console.log(digimon);

                storeData(`${dir}/${digimon.name}.json`, digimon);
                digimons.push(digimon);
            });

            storeData(`${dir}/digimon.json`, JSON.stringify(digimons));
        })
        .catch(console.error);
    } catch (error) {
        console.error(error);
    }
}


