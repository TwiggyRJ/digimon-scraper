// digimon-scraper.ts
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { getDigimonMetaData } from './digimon-scraper';

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon';
const dir = './data';

function storeData(path: string, data: any) {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

export async function getDigimon(isDev: boolean) {
    try {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
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

                let vals = {};

                if (isDev) {
                    if (index < 2) {
                        vals = await getDigimonMetaData(url || '');
                    }
                } else {
                    vals = await getDigimonMetaData(url || '');
                }

                const digimon: any = {
                    vals: vals,
                    name,
                    number,
                    stage,
                    attribute,
                    type,
                    memoryUsage,
                    equipmentSlot
                };

                console.log(digimon);

                storeData(`data/${digimon.name}.json`, digimon);
                digimons.push(digimon);
            });

            storeData(`data/digimon.json`, JSON.stringify(digimons));
        })
        .catch(console.error);
    } catch (error) {
        console.error(error);
    }
}


