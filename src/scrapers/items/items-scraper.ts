import cheerio from 'cheerio';
import clear from 'clear';
import { AvailableAt, MoveType } from '../../interfaces/interfaces';
import { delay, instance, randomInteger, sleep } from '../../utils/axios';
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
  medalNumber?: number | null;
}

interface GetDataMeta {
  iconUrl: string;
  name: string;
  url: string;
  category: string;
  index: number;
}

enum ItemEffectUnit {
  None = 'none',
  Percentage = 'percentage',
}

export enum ItemEffectTarget {
  Digifarm = 'digifarm',
  Digivice = 'digivice',
  Single = 'single',
  Team = 'team',
}

interface ItemEffect {
  stat: string;
  effect: string | number;
  duration: string;
  target: ItemEffectTarget;
  unit: ItemEffectUnit;
}

const stats = ['ATK', 'DEF', 'INT', 'HP', 'SP', 'SPD', 'EXP', 'EVA', 'ACU', 'CRT', 'CAM'];

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/items';

export function getItemIcon(image: string): string {
  if (image.includes('/1-item-icon')) {
    // HP Pill
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/hp-pill.png';
  } else if (image.includes('/3-item-icon')) {
    // HP Spray
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/hp-spray.png';
  } else if (image.includes('/2-item-icon')) {
    // SP Pill
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/sp-pill.png';
  } else if (image.includes('/4-item-icon')) {
    // SP Spray
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/sp-spray.png';
  } else if (image.includes('/5-item-icon')) {
    // Medical Spray
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/medical-spray.png';
  } else if (image.includes('15-item-icon')) {
    // Revival Capsule
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/revival-pill.png';
  } else if (image.includes('16-item-icon')) {
    // Revival Spray
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/revival-spray.png';
  } else if (image.includes('/6-item-icon')) {
    // Poison Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/poison-recovery.png';
  } else if (image.includes('/7-item-icon')) {
    // Panic Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/panic-recovery.png';
  } else if (image.includes('/8-item-icon')) {
    // Paralysis Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/paralysis-recovery.png';
  } else if (image.includes('/9-item-icon')) {
    // Sleep Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/sleep-recovery.png';
  } else if (image.includes('10-item-icon')) {
    // Stun Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/stun-recovery.png';
  } else if (image.includes('11-item-icon')) {
    // Sprite Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/sprite-recovery.png';
  } else if (image.includes('12-item-icon')) {
    // Bug Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/bug-recovery.png';
  } else if (image.includes('13-item-icon')) {
    // Multi Recovery
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/multi-recovery.png';
  } else if (image.includes('14-item-icon')) {
    // Multi Recovery DX
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/multi-recovery-dx.png';
  } else if (image.includes('17-item-icon')) {
    // Stat Boost
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/stat-boost.png';
  } else if (image.includes('18-item-icon')) {
    // Escape Gate
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/escape-gate.png';
  } else if (image.includes('19-item-icon')) {
    // Brave Point
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/brave-point.png';
  } else if (image.includes('20-item-icon')) {
    // Friendship Point
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/friendship-point.png';
  } else if (image.includes('21-item-icon')) {
    // Digi-Egg
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/digi-egg.png';
  } else if (image.includes('22-item-icon')) {
    // Jewel
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/jewel.png';
  } else if (image.includes('25-item-icon')) {
    // Memory
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/memory-up.png';
  } else if (image.includes('23-item-icon')) {
    // Personality Patch Disk
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/personality-patch-disk.png';
  } else if (image.includes('24-item-icon')) {
    // Stat Restraint
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/stat-restraint.png';
  } else if (image.includes('27-item-icon')) {
    // Digimon Medal
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/digimon-medal.png';
  } else if (image.includes('57-item-icon')) {
    // Exciting Meat
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/exciting-meat.png';
  } else if (image.includes('58-item-icon')) {
    // Best Meat
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/best-meat.png';
  } else if (image.includes('59-item-icon')) {
    // Vigor Mushroom
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/vigor-mushroom.png';
  } else if (image.includes('60-item-icon')) {
    // Mental Melon
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/mental-melon.png';
  } else if (image.includes('61-item-icon')) {
    // Power Pine
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/power-pine.png';
  } else if (image.includes('62-item-icon')) {
    // Aegis Apple
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/aegis-apple.png';
  } else if (image.includes('63-item-icon')) {
    // Clever Carrot
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/clever-carrot.png';
  } else if (image.includes('64-item-icon')) {
    // Boost Banana
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/boost-banana.png';
  } else if (image.includes('65-item-icon')) {
    // Miracle Meat
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/miracle-meat.png';
  } else if (image.includes('28-item-icon')) {
    // Attach Item
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/stat-attachment.png';
  } else if (image.includes('29-item-icon')) {
    // Stat Disk
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/stat-disk.png';
  } else if (image.includes('30-item-icon')) {
    // Master Disk
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/master-disk.png';
  } else if (image.includes('31-item-icon')) {
    // Noise Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/noise-guard.png';
  } else if (image.includes('32-item-icon')) {
    // Flare Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/flare-guard.png';
  } else if (image.includes('33-item-icon')) {
    // Aqua Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/aqua-guard.png';
  } else if (image.includes('34-item-icon')) {
    // Plant Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/plant-guard.png';
  } else if (image.includes('35-item-icon')) {
    // Electric Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/electric-guard.png';
  } else if (image.includes('36-item-icon')) {
    // Sand Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/sand-guard.png';
  } else if (image.includes('37-item-icon')) {
    // Wind Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/wind-guard.png';
  } else if (image.includes('38-item-icon')) {
    // Shine Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/shine-guard.png';
  } else if (image.includes('39-item-icon')) {
    // Dark Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/dark-guard.png';
  } else if (image.includes('40-item-icon')) {
    // Master Guard
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/master-guard.png';
  } else if (image.includes('41-item-icon')) {
    // Poison Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/poison-barrier.png';
  } else if (image.includes('42-item-icon')) {
    // Panic Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/panic-barrier.png';
  } else if (image.includes('43-item-icon')) {
    // Paralysis Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/paralysis-barrier.png';
  } else if (image.includes('44-item-icon')) {
    // Sleep Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/sleep-barrier.png';
  } else if (image.includes('45-item-icon')) {
    // Stun Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/stun-barrier.png';
  } else if (image.includes('46-item-icon')) {
    // Pixel Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/pixel-barrier.png';
  } else if (image.includes('47-item-icon')) {
    // Bug Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/bug-barrier.png';
  } else if (image.includes('48-item-icon')) {
    // Death Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/death-barrier.png';
  } else if (image.includes('49-item-icon')) {
    // Master Barrier
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/master-barrier.png';
  } else if (image.includes('50-item-icon')) {
    // USB
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/equip-items/usb.png';
  } else if (image.includes('26-item-icon')) {
    // Farm Symbol
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/farm-symbol.png';
  } else if (image.includes('55-item-icon')) {
    // Key Item
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/key-item.png';
  } else if (image.includes('51-item-icon')) {
    // Digimon Hat
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/items/digimon-hat.png';
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
      return '-';
  }
}

export async function getItems(isDev: boolean) {
  try {
    doesDataFolderExist();

    const response = await instance(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const itemsTable = $('#searchable-table > tr');

    const itemsToGet: GetDataMeta[] = [];

    await delay(5000);

    itemsTable.each((index, element) => {
      if (isDev) {
        if (index > 10) return false;
      }

      const iconUrl = $(element).find('td:nth-child(1) > img').attr('src');
      const name = $(element).find('td:nth-child(2) > a').text();
      const url = $(element).find('td:nth-child(2) > a').attr('href');
      const category = $(element).find('td:nth-child(4)').text();

      if (!!iconUrl && !!url) {
        itemsToGet.push({
          iconUrl,
          name,
          url,
          category,
          index,
        });
      }
    });

    let promise = Promise.resolve();
    itemsToGet.forEach((item: GetDataMeta, index) => {
      new Promise((resolve) => setTimeout(resolve, 1500 * index)).then(() => getDataAsync(item));
    });

    await Promise.resolve(promise);
    console.info('Operation Complete');
  } catch (error) {
    console.error(error);
    console.groupEnd();
  }
}

function getItemEffect(name: string, itemType: string, description: string) {
  const nameToCheck = name.toLowerCase();
  const itemTypeToCheck = itemType.toLowerCase();
  const effects: ItemEffect[] = [];

  if (itemTypeToCheck === 'consumable' || itemTypeToCheck === 'equipment') {
    let matched = false;
    let restrictedMatch = false;
    const splitDescription = description.split(' ');

    const effect: ItemEffect = {
      stat: '',
      effect: 0,
      duration: itemType === 'Equipment' ? 'permanent-equiped' : 'on-use',
      target: ItemEffectTarget.Single,
      unit: ItemEffectUnit.None,
    };

    if (effects.length === 0) {
      if (nameToCheck === 'aegis apple') {
        restrictedMatch = true;

        effects.push({
          ...effect,
          stat: 'DEF',
          effect: 10,
          duration: 'on-use',
          target: ItemEffectTarget.Digifarm,
          unit: ItemEffectUnit.None,
        });
      } else if (nameToCheck.includes('full')) {
        restrictedMatch = true;

        effects.push({
          ...effect,
          stat: 'revival',
          effect: 100,
          duration: 'on-use',
          target: ItemEffectTarget.Team,
          unit: ItemEffectUnit.Percentage,
        });
      } else if (nameToCheck.includes('medical spray dx')) {
        restrictedMatch = true;

        effects.push({
          ...effect,
          stat: 'HP',
          effect: 100,
          duration: 'on-use',
          target: ItemEffectTarget.Team,
          unit: ItemEffectUnit.Percentage,
        });

        effects.push({
          ...effect,
          stat: 'SP',
          effect: 100,
          duration: 'on-use',
          target: ItemEffectTarget.Team,
          unit: ItemEffectUnit.Percentage,
        });
      } else if (nameToCheck.includes('medical spray')) {
        restrictedMatch = true;

        effects.push({
          ...effect,
          stat: 'HP',
          effect: 50,
          duration: 'on-use',
          target: ItemEffectTarget.Team,
          unit: ItemEffectUnit.Percentage,
        });

        effects.push({
          ...effect,
          stat: 'SP',
          effect: 50,
          duration: 'on-use',
          target: ItemEffectTarget.Team,
          unit: ItemEffectUnit.Percentage,
        });
      } else if (nameToCheck === 'memory up') {
        restrictedMatch = true;
        effects.push({
          ...effect,
          stat: 'MEM',
          effect: 5,
          duration: 'permanent',
          target: ItemEffectTarget.Digivice,
        });
      } else if (nameToCheck === 'memory up dx') {
        restrictedMatch = true;
        effects.push({
          ...effect,
          stat: 'MEM',
          effect: 10,
          duration: 'permanent',
          target: ItemEffectTarget.Digivice,
        });
      }
    }

    if (restrictedMatch === false) {
      splitDescription.forEach((descWord) => {
        stats.forEach((stat) => {
          const match = descWord === stat;
          const wordIndex = splitDescription.findIndex((word) => word === stat);

          if (match) {
            matched = true;
            effect.stat = stat;

            if (stat === 'EVA' || stat === 'HIT' || stat === 'CRT') {
              if (nameToCheck.includes('attach')) {
                const val = splitDescription[wordIndex + 1];
                effects.push({
                  ...effect,
                  effect: Number(val.replace(/%/g, '').replace(/,(?=[^,]*$)/, '')),
                  unit: ItemEffectUnit.Percentage,
                });
              } else if (nameToCheck.includes('boost')) {
                const val = splitDescription[wordIndex + 2];
                effects.push({
                  ...effect,
                  effect: Number(val.replace(/%/g, '').replace(/,(?=[^,]*$)/, '')),
                  duration: '5-turns',
                  unit: ItemEffectUnit.Percentage,
                });
              } else if (nameToCheck.includes('restraint chip a')) {
                effects.push({
                  ...effect,
                  effect: -100,
                  duration: 'permanent',
                });
              } else if (nameToCheck.includes('restraint chip b')) {
                effects.push({
                  ...effect,
                  effect: -10,
                  duration: 'permanent',
                });
              } else if (nameToCheck.includes('restraint chip c')) {
                effects.push({
                  ...effect,
                  effect: -1,
                  duration: 'permanent',
                });
              }
            } else if (nameToCheck.includes('disk')) {
              effects.push({
                ...effect,
                effect: Number(splitDescription[wordIndex + 1].replace(/,(?=[^,]*$)/, '')),
              });
            } else if (nameToCheck.includes('restraint chip a')) {
              effects.push({
                ...effect,
                effect: -100,
                duration: 'permanent',
              });
            } else if (nameToCheck.includes('restraint chip b')) {
              effects.push({
                ...effect,
                effect: -10,
                duration: 'permanent',
              });
            } else if (nameToCheck.includes('restraint chip c')) {
              effects.push({
                ...effect,
                effect: -1,
                duration: 'permanent',
              });
            } else if (nameToCheck.includes('attach')) {
              effects.push({
                ...effect,
                effect: Number(splitDescription[wordIndex + 1].replace(/,(?=[^,]*$)/, '')),
              });
            } else if (nameToCheck.includes('recovery')) {
              effects.push({
                ...effect,
                effect: Number(splitDescription[wordIndex - 1].replace(/,(?=[^,]*$)/, '')),
                duration: 'on-use',
              });
            } else if (nameToCheck.includes('spray a') || nameToCheck.includes('capsule a')) {
              effects.push({
                ...effect,
                effect: 100,
                duration: 'on-use',
                unit: ItemEffectUnit.Percentage,
              });
            } else if (nameToCheck.includes('spray') || nameToCheck.includes('capsule')) {
              effects.push({
                ...effect,
                effect: Number(splitDescription[wordIndex - 1]),
                duration: 'on-use',
              });
            } else if (nameToCheck.includes('boost')) {
              const val = splitDescription[wordIndex + 2];

              effects.push({
                ...effect,
                effect: Number(val.replace(/%/g, '').replace(/,(?=[^,]*$)/, '')),
                duration: '5-turns',
                unit: ItemEffectUnit.Percentage,
              });
            } else if (nameToCheck.includes('brave point')) {
              const val = splitDescription[wordIndex - 1];
              effects.push({
                ...effect,
                effect: Number(val.replace(/,/g, '').replace(/,(?=[^,]*$)/, '')),
                duration: 'permanent',
              });
            } else if (nameToCheck.includes('friendship')) {
              const val = splitDescription[wordIndex + 2];
              effects.push({
                ...effect,
                effect: Number(val.replace(/,/g, '').replace(/,(?=[^,]*$)/, '')),
                duration: 'permanent',
              });
            }
          }
        });
      });
    }
  }

  return effects.length > 0 ? effects : null;
}

async function getDataAsync(args: GetDataMeta) {
  const { iconUrl, name, url, category, index } = args;

  const awaitTime = randomInteger(5, 10) * 1000;

  if (
    index === 100 ||
    index === 200 ||
    index === 300 ||
    index === 400 ||
    index === 500 ||
    index === 600 ||
    index === 700 ||
    index === 800 ||
    index === 900 ||
    index === 1000 ||
    index === 1100 ||
    index === 1200
  ) {
    console.info('We are in the next 100');
    console.info('delaying');
    await delay(10 * 1000);
    console.info('has delayed');
  }

  console.info(name);
  console.info(`Getting Meta delaying by ${awaitTime}`);

  await delay(awaitTime);

  console.info('has delayed');

  const meta = url
    ? await getItemMeta(url || '')
    : {
        description: '',
        price: 0,
        soldAt: [],
        droppedBy: [],
        medalNumber: null,
      };

  const icon = getItemIcon(iconUrl || '');

  const itemEffect = getItemEffect(name, category, meta.description);

  let item: any = {
    name,
    icon,
    category: getItemCategory(category),
    description: meta.description,
    price: meta.price,
    soldAt: meta.soldAt,
    droppedBy: meta.droppedBy,
    medalNumber: meta.medalNumber,
  };

  if (itemEffect) {
    item = {
      ...item,
      effects: itemEffect,
    };
  }

  console.groupEnd();

  storeData(`${dir}/items/${item.name}.json`, item);
}

export async function getItemMeta(itemUrl: string): Promise<Meta> {
  try {
    const response = await instance(itemUrl);
    const html = response.data;
    const $: cheerio.Root = cheerio.load(html);
    const description = $('h3:contains("In-game description")').next().find('p').text();
    const rawPrice = $('.quick-facts-box > .element-overflow > table > tbody > tr')
      .next()
      .find('th:contains("Price")')
      .next()
      .text();
    const medalNumber = $('.quick-facts-box > .element-overflow > table > tbody > tr')
      .next()
      .find('th:contains("Medal No.")')
      .next()
      .text();
    const price = rawPrice.replace(' ¥', '');

    console.log(rawPrice, price);

    const meta: Meta = {
      description,
      price: price ? Number(price) : 0,
      soldAt: [],
      droppedBy: [],
      medalNumber: medalNumber ? Number(medalNumber) : null,
    };

    const elementBoxes = $('.container > .page-wrapper > main > .box');

    elementBoxes.each(async (index, element) => {
      const sectionTitle: string = $(element).prev().find('h2').text();

      if (sectionTitle.includes('sold in')) {
        const soldTable = $(element).find('.element-overflow > table > tbody > tr');

        const soldAt: SoldAt[] = [];

        soldTable.each((rowIndex, row) => {
          const location = $(row).find('td:nth-child(1) > a').text();
          const availableAt = $(row).find('td:nth-child(3)').text();

          soldAt.push({
            location,
            availableAt: getAvailability(availableAt),
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
      droppedBy: [],
    };
  }
}

export async function getItem(itemUrl: string) {
  try {
    doesDataFolderExist();
    const awaitTime = randomInteger(5, 10) * 1000;

    console.info(`Getting item ${itemUrl}`);

    const response = await instance(itemUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const itemsTable = $('.quick-facts-box');

    const iconUrl = $(itemsTable).find('img').attr('src');
    const name = $(itemsTable).find('.element-overflow > table > tbody > tr:nth-child(1) > td').text();
    const category = $(itemsTable).find('.element-overflow > table > tbody > tr:nth-child(2) > td').text();
    const rawPrice = $(itemsTable).find('.element-overflow > table > tbody > tr:nth-child(3) > td').text();
    const price = rawPrice.replace(' ¥', '');

    const meta = itemUrl
      ? await getItemMeta(itemUrl || '')
      : {
          description: '',
          price,
          soldAt: [],
          droppedBy: [],
          medalNumber: null,
        };

    const icon = getItemIcon(iconUrl || '');

    const itemEffect = getItemEffect(name, category, meta.description);

    let item: any = {
      name,
      icon,
      category: getItemCategory(category),
      description: meta.description,
      price: meta.price,
      soldAt: meta.soldAt,
      droppedBy: meta.droppedBy,
      medalNumber: meta.medalNumber,
    };

    if (itemEffect) {
      item = {
        ...item,
        effects: itemEffect,
      };
    }

    console.info(item);

    console.groupEnd();

    storeData(`${dir}/items/${item.name}.json`, item);
    console.info('Operation Complete');
  } catch (error) {
    console.error(error);
    console.groupEnd();
  }
}
