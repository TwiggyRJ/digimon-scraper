// digimon-scraper.ts
import cheerio from 'cheerio';
import { getDigimonMetaData } from './digimon-scraper';
import { Digimon, DigimonMeta } from '../../interfaces/interfaces';
import { getAttribute, getStage, getType } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';
import { delay, instance, randomInteger } from '../../utils/axios';

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon';

interface GetDataMeta {
  name: string;
  number: number;
  stage: string;
  attribute: string;
  type: string;
  memoryUsage: number;
  equipmentSlot: number;
  url: string;
}

export async function getDigimon(isDev: boolean) {
  try {
    doesDataFolderExist();

    const response = await instance(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const digimonTable = $('#searchable-table > tr');
    const digimonToGet: GetDataMeta[] = [];

    console.log(`Digimon in total: ${digimonTable.length}`);

    digimonTable.each(async (index, element) => {
      if (isDev) {
        if (index > 20) {
          return false;
        }
      }

      const name = $(element).find('td:nth-child(3) > a').text();
      const number = $(element).find('td:nth-child(1)').text();
      const stage = $(element).find('td:nth-child(4)').text();
      const attribute = $(element).find('td:nth-child(5)').text();
      const type = $(element).find('td:nth-child(6)').text();
      const memoryUsage = $(element).find('td:nth-child(7)').text();
      const equipmentSlot = $(element).find('td:nth-child(8)').text();
      const url = $(element).find('td:nth-child(3) > a').attr('href');

      if (!!url) {
        digimonToGet.push({
          name,
          number: Number(number),
          stage: getStage(stage),
          attribute: getAttribute(attribute),
          type: getType(type),
          memoryUsage: Number(memoryUsage),
          equipmentSlot: Number(equipmentSlot),
          url
        });
      }
    });

    let promise = Promise.resolve();
    digimonToGet.forEach((digimon: GetDataMeta, index) => {
      new Promise(resolve => setTimeout(resolve, 1500 * index)).then(() => getDataAsync(digimon))
    });

    await Promise.resolve(promise);
    console.info('Operation Complete');
  } catch (error) {
    console.error(error);
  }
}

async function getDataAsync(args: GetDataMeta) {
  const {
    name,
    number,
    stage,
    type,
    attribute,
    memoryUsage,
    equipmentSlot,
    url
  } = args;

  const imageBaseUrl = 'https://digimon-assets.s3.eu-west-2.amazonaws.com/digimon/';
  const image = `${imageBaseUrl}${number}_${name.toLowerCase()}.png`;

  let vals: any = {
    description: '',
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

  const awaitTime = (randomInteger(5, 20) * 1000);

  await delay(awaitTime);

  vals = await getDigimonMetaData(url || '');

  await delay(awaitTime);

  const digimon: Digimon = {
    ...vals,
    name,
    image,
    number,
    stage,
    attribute,
    type,
    memoryUsage,
    equipmentSlot
  };

  storeData(`${dir}/digimon/${digimon.number}_${digimon.name}.json`, digimon);
}
