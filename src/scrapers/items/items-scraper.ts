import axios from 'axios';
import cheerio from 'cheerio';
import clear from 'clear';
import { MoveType } from '../../interfaces/interfaces';
import { getAttribute, getType } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

interface SoldAt {
  location: string;
  availableAt: string;
}

interface DroppedBy {
  name: string;
  location: string;
}

interface Meta {
  description: string;
  price: number;
  soldAt: SoldAt[];
  droppedBy: DroppedBy[];
}

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/items';

export function getItemIcon(image: string): string {
  if (image.includes('1-item-icon')) {
    // HP Pill
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/water.png';
  } else if (image.includes('3-item-icon')) {
    // HP Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/support-stat-enhancement.png';
  } else if (image.includes('2-item-icon')) {
    // SP Pill
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/plant.png';
  } else if (image.includes('4-item-icon')) {
    // SP Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/light.png';
  } else if (image.includes('5-item-icon')) {
    // Medical Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/wind.png';
  } else if (image.includes('15-item-icon')) {
    // Revival Capsule
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/moves/neutral.png';
  } else if (image.includes('16-item-icon')) {
    // Revival Spray
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

export function getItemCategory(category: string) {
  switch (category) {
    case 'Consumable':
      return 'consumable';
  
    case 'Equipment':
      return 'equipment';

    case 'Farm Goods':
      return 'farm-goods';

    case 'Key Item':
      return 'key-item';

    case 'Medal':
      return 'medal';

    default:
      return '-'
  }
}

export async function getItems(isDev: boolean) {
  try {
    doesDataFolderExist();

    await axios(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const itemsTable = $('#searchable-table > tr');

        itemsTable.each(async (index, element) => {
          if (isDev) {
            if (index > 3) return false;
          }

          const iconUrl = $(element).find('td:nth-child(1) > img').attr('src');
          const name = $(element).find('td:nth-child(2) > a').text();
          const url = $(element).find('td:nth-child(2) > a').attr('href');
          const category = $(element).find('td:nth-child(4)').text();

          const meta = url ? await getItemMeta(url) : {
            description: '',
            price: 0,
            soldAt: [],
            droppedBy: []
          };

          setTimeout(() => { }, 10000);

          const icon = getItemIcon(iconUrl || '');

          const item = {
            name,
            icon,
            category: getItemCategory(category),
            description: meta.description,
            price: meta.price,
            soldAt: meta.soldAt,
            droppedBy: meta.droppedBy
          };

          storeData(`${dir}/items/${item.name}.json`, item);
        });
      })
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
}

export async function getItemMeta(moveUrl: string): Promise<Meta> {
  try {
    const response = await axios(moveUrl);
    const html = response.data;
    const $: cheerio.Root = cheerio.load(html);
    const description = $('h3:contains("In-game description")').next().find('p').text();
    const rawPrice = $('.quick-facts-box > .element-overflow > table > tbody > tr').next().find('th:contains("Price")').next().text();
    const price = rawPrice.replace(' ¥', '');

    const meta: Meta = {
      description,
      price: price ? Number(price) : 0,
      soldAt: [],
      droppedBy: []
    };

    const elementBoxes = $('.container > .page-wrapper > main > .box');

    elementBoxes.each(async(index, element) => {
      const sectionTitle: string = $(element).prev().find('h2').text();

      if (sectionTitle.includes('sold in')) {
        const soldTable = $(element).find('.element-overflow > table > tbody > tr');

        const soldAt: SoldAt[] = [];

        soldTable.each((rowIndex, row) => {
          const location = $(row).find('td:nth-child(1) > a').text();
          const availableAt = $(row).find('td:nth-child(3)').text();

          soldAt.push({
            location,
            availableAt
          });
        });

        meta.soldAt = soldAt;
      }

      if (sectionTitle.includes('dropped by')) {
        const droppedTable = $(element).find('.element-overflow > table > tbody > tr');

        const droppedBy: DroppedBy[] = [];

        droppedTable.each((rowIndex, row) => {
          const name = $(row).find('td:nth-child(2) > a').text();
          const location = $(row).find('td:nth-child(6) > a').text();

          droppedBy.push({
            name,
            location,
          });
        });

        meta.droppedBy = droppedBy;
      }
    });

    return meta;
  } catch (error) {
    console.error(error);
    return {
      description: '',
      price: 0,
      soldAt: [],
      droppedBy: []
    };
  }
}
