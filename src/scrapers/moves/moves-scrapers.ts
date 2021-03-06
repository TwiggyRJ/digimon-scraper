import cheerio from 'cheerio';
import { Attribute, MoveType } from '../../interfaces/interfaces';
import { delay, instance, randomInteger } from '../../utils/axios';
import { getAttribute, getType } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

interface Move {
  name: string;
  icon: string;
  attribute: Attribute;
  type: MoveType;
  spCost: number;
  power: number;
  inheritable: boolean;
  description: string;
}

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/moves';

export function getIcon(image: string): string {
  if (image.includes('water-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/water.png';
  } else if (image.includes('support-enhancement-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/support-stat-enhancement.png';
  } else if (image.includes('plant-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/plant.png';
  } else if (image.includes('light-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/light.png';
  } else if (image.includes('wind-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/wind.png';
  } else if (image.includes('neutral-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/neutral.png';
  } else if (image.includes('earth-icon')) {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/earth.png';
  } else if ('support-icon') {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/support.png';
  } else if ('electric-icon') {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/electric.png';
  } else if ('fire-icon') {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/fire.png';
  } else if ('dark-icon') {
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/dark.png';
  }
  
  return 'none';
}

export function getMoveType(type: string): MoveType {
  switch (type) {
    case 'Support':
      return MoveType.support;

    case 'Physical':
      return MoveType.physical;

    case 'Magic':
      return MoveType.magic;
  
    default:
      return MoveType.physical;
  }
}

export async function getMoves(isDev: boolean) {
  try {
    doesDataFolderExist();

    const response = await instance(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const movesTable = $('#searchable-table > tr');
    const moveToGet: Move[] = [];
    const moveUrls: Array<string | undefined> = [];

    console.log(`moves in total: ${movesTable.length}`);

    movesTable.each(async (index, element) => {
      if (isDev) {
        if (index > 20) return false;
      }

      const iconUrl = $(element).find('td:nth-child(1) > img').attr('src');
      const name = $(element).find('td:nth-child(2) > a').text();
      const url = $(element).find('td:nth-child(2) > a').attr('href');
      const attribute = $(element).find('td:nth-child(3)').text();
      const type = $(element).find('td:nth-child(4)').text();
      const sp = $(element).find('td:nth-child(5)').text();
      const power = $(element).find('td:nth-child(6)').text();
      const inheritable = $(element).find('td:nth-child(7)').text();
      
      const icon = getIcon(iconUrl || '');

      moveToGet.push({
        name,
        icon,
        attribute: getAttribute(attribute),
        type: getMoveType(type),
        spCost: Number(sp),
        power: Number(power),
        inheritable: inheritable !== '-',
        description: '',
      });

      moveUrls.push(url);
    });

    let promise = Promise.resolve();
    moveToGet.forEach((move: Move, index) => {
      new Promise(resolve => setTimeout(resolve, 1500 * index)).then(() => getMoveDescriptionAsync(move, moveUrls[index]))
    });

    await Promise.resolve(promise);
    console.info('Operation Complete');
  } catch (error) {
    console.error(error);
  }
}

export async function getMoveDescriptionAsync(move: Move, moveUrl?: string): Promise<void> {
  try {

    if (moveUrl) {
      const response = await instance(moveUrl);
      const html = response.data;
      const $: cheerio.Root = cheerio.load(html);
      const description = $('h3:contains("In-game description")').next().find('p').text();

      storeData(`${dir}/moves/${move.name}.json`, { ...move, description });
    } else {
      storeData(`${dir}/moves/${move.name}.json`, move);
    }
  } catch (error) {
    console.error(error);
  }
}
