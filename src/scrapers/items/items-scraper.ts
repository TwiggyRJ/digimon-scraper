import cheerio from 'cheerio';
import clear from 'clear';
import { AvailableAt, MoveType } from '../../interfaces/interfaces';
import { delay, instance, randomInteger } from '../../utils/axios';
import { getAttribute, getAvailability, getType } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

interface SoldAt {
  location: string;
  availableAt: AvailableAt | null;
}

interface DroppedBy {
  name: string;
  location: string;
}

interface Meta {
  description: string;
  price: number;
  soldAt: SoldAt[];
  droppedBy: string[];
}

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/items';

export function getItemIcon(image: string): string {
  if (image.includes('1-item-icon')) {
    // HP Pill
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/hp-pill.png';
  } else if (image.includes('3-item-icon')) {
    // HP Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/hp-spray.png';
  } else if (image.includes('2-item-icon')) {
    // SP Pill
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/sp-pill.png';
  } else if (image.includes('4-item-icon')) {
    // SP Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/sp-spray.png';
  } else if (image.includes('5-item-icon')) {
    // Medical Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/medical-spray.png';
  } else if (image.includes('15-item-icon')) {
    // Revival Capsule
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/revival-pill.png';
  } else if (image.includes('16-item-icon')) {
    // Revival Spray
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/revival-spray.png';
  } else if ('6-item-icon') {
    // Poison Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/poison-recovery.png';
  } else if ('7-item-icon') {
    // Panic Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/panic-recovery.png';
  } else if ('8-item-icon') {
    // Paralysis Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/paralysis-recovery.png';
  } else if ('9-item-icon') {
    // Sleep Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/sleep-recovery.png';
  } else if ('10-item-icon') {
    // Stun Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/stun-recovery.png';
  } else if ('11-item-icon') {
    // Sprite Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/sprite-recovery.png';
  } else if ('12-item-icon') {
    // Bug Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/bug-recovery.png';
  } else if ('13-item-icon') {
    // Multi Recovery
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/multi-recovery.png';
  } else if ('14-item-icon') {
    // Multi Recovery DX
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/multi-recovery-dx.png';
  } else if ('17-item-icon') {
    // Stat Boost
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/stat-boost.png';
  } else if ('18-item-icon') {
    // Escape Gate
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/escape-gate.png';
  } else if ('19-item-icon') {
    // Brave Point
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/brave-point.png';
  } else if ('20-item-icon') {
    // Friendship Point
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/friendship-point.png';
  } else if ('21-item-icon') {
    // Digi-Egg
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/digi-egg.png';
  } else if ('22-item-icon') {
    // Jewel
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/jewel.png';
  } else if ('25-item-icon') {
    // Memory
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/memory-up.png';
  } else if ('23-item-icon') {
    // Personality Patch Disk
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/personality-patch-disk.png';
  } else if ('24-item-icon') {
    // Stat Restraint
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/stat-restraint.png';
  } else if ('27-item-icon') {
    // Digimon Medal
    return 'https://digimon-assets.s3.eu-west-2.amazonaws.com/items/digimon-medal.png';
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

    await instance(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const itemsTable = $('#searchable-table > tr');

        itemsTable.each(async (index, element) => {
          if (isDev) {
            if (index > 20) return false;
          }

          const iconUrl = $(element).find('td:nth-child(1) > img').attr('src');
          const name = $(element).find('td:nth-child(2) > a').text();
          const url = $(element).find('td:nth-child(2) > a').attr('href');
          const category = $(element).find('td:nth-child(4)').text();

          const awaitTime = (randomInteger(5, 20) * 1000);

          await delay(awaitTime);


          const meta = url ? await getItemMeta(url) : {
            description: '',
            price: 0,
            soldAt: [],
            droppedBy: []
          };

          await delay(awaitTime);

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
    const response = await instance(moveUrl);
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
            availableAt: getAvailability(availableAt)
          });
        });

        meta.soldAt = soldAt;
      }

      if (sectionTitle.includes('dropped by')) {
        const droppedTable = $(element).find('.element-overflow > table > tbody > tr');

        const droppedBy: string[] = [];

        droppedTable.each((rowIndex, row) => {
          const name = $(row).find('td:nth-child(2) > a').text();
          const location = $(row).find('td:nth-child(6) > a').text();

          if (droppedBy.includes(name) === false) {
            droppedBy.push(name);
          }
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
