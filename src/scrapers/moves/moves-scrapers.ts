import cheerio from 'cheerio';
import { Attribute, MoveType } from '../../interfaces/interfaces';
import { delay, instance, randomInteger } from '../../utils/axios';
import { getAttribute, getType } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

enum MoveTarget {
  SingleEnemy = 'single-enemy',
  SingleFriendly = 'single-friendly',
  MultipleEnemy = 'multiple-enemy',
  MultipleFriendly = 'multiple-friendly',
}

enum MoveEffectUnit {
  None = 'none',
  Percentage = 'percentage',
}

enum MoveEffectType {
  Buff = 'buff',
  Debuff = 'debuff',
}

enum MoveStat {
  Absorb = 'absorb',
  Accuracy = 'accuracy',
  Attack = 'attack',
  Critical = 'critical',
  Damage = 'damage',
  Defence = 'defence',
  Evasion = 'evasion',
  Intelligence = 'intelligence',
  Stun = 'stun',
  Speed = 'speed',
  All = 'all',
  AllPositive = 'all-positive',
  AllNegative = 'all-negative',
  Killing = 'killing',
  Undefined = '',
}

interface MoveEffect {
  effect: MoveStat[];
  effectValue: string | number;
  effectChance?: number;
  duration: number;
  type: MoveEffectType;
  target: MoveTarget;
  unit: MoveEffectUnit;
}

interface Move {
  name: string;
  icon: string;
  attribute: Attribute;
  type: MoveType;
  spCost: number;
  power: number;
  signature: boolean;
  description: string;
  target: MoveTarget;
  penetrating: boolean;
  penetrates?: string;
  alwaysHits: boolean;
  hits: number;
  accuracy: number;
}

function getEffectedStat(description: string): MoveStat {
  if (description.includes('ATK')) {
    return MoveStat.Attack;
  } else if (description.includes('ACC') || description.includes('ACU')) {
    return MoveStat.Accuracy;
  } else if (description.includes('CRIT') || description.includes('CRT')) {
    return MoveStat.Critical;
  } else if (description.includes('DEF')) {
    return MoveStat.Defence;
  } else if (description.includes('EVA')) {
    return MoveStat.Evasion;
  } else if (description.includes('INT')) {
    return MoveStat.Intelligence;
  } else if (description.includes('SPD')) {
    return MoveStat.Speed;
  } else if (description.includes('base stat boosts')) {
    return MoveStat.AllPositive;
  } else if (description.includes('abnormal status')) {
    return MoveStat.AllNegative;
  } else if (description.includes('stun')) {
    return MoveStat.Stun;
  }

  return MoveStat.Undefined;
}

function getAttackHitsCount(description: string): number {
  const words = description.split(' ');
  if (description.includes('physical attacks')) {
    const physicalIndex = words.findIndex((el) => el === 'physical');

    if (physicalIndex !== -1 && words[physicalIndex + 1].includes('attacks')) {
      return Number(words[physicalIndex - 1]);
    }
  }

  if (description.includes('magic attacks')) {
    const magicalIndex = words.findIndex((el) => el === 'magic');

    if (magicalIndex !== -1 && words[magicalIndex + 1].includes('attacks')) {
      return Number(words[magicalIndex - 1]);
    }
  }

  return 1;
}

function getAttackAccuracy(description: string): number {
  if (description.includes('% accuracy')) {
    const words = description.split(' ');
    const accuracyIndex = words.findIndex((el) => el.includes('accuracy'));
    const accuracyRaw = words[accuracyIndex - 1].split('%')[0];
    const accuracy = Number(accuracyRaw ?? 100);

    return accuracy;
  }

  return 100;
}

function getEffectStats(description: string) {
  const words = description.split(' ');
  const wordsWithPercent = words.filter((el) => el.includes('%'));

  if (wordsWithPercent.length > 1) {
    const chanceIndex = words.findIndex((el) => el === 'chance');
    const valueIndex = words.findIndex((el, index) => el.includes('%') && index !== chanceIndex - 1);
    const chance = Number(words[chanceIndex - 1].split('%')[0]);
    const value = words[valueIndex] ? Number(words[valueIndex].split('%')[0]) : 0;

    return {
      effectChance: chance,
      effectValue: value,
      unit: MoveEffectUnit.Percentage,
    };
  }

  const valueIndex = words.findIndex((el) => el.includes('%'));
  const value = words[valueIndex] ? words[valueIndex].split('%')[0] : 0;

  return {
    effectValue: value,
  };
}

function getEffectTarget(description: string, existingTarget: MoveTarget): MoveTarget {
  if (description.includes('absorb')) {
    return MoveTarget.SingleFriendly;
  } else if (description.includes('abnormal status')) {
    return MoveTarget.SingleFriendly;
  }

  return existingTarget;
}

function getTarget(description: string) {
  if (description.includes('all enemies') || description.includes('all foes')) {
    return MoveTarget.MultipleEnemy;
  } else if (description.includes('all battle members') || description.includes('party members')) {
    return MoveTarget.MultipleFriendly;
  } else if (description.includes('enemy')) {
    return MoveTarget.SingleEnemy;
  } else if (description.includes('battle member') || description.includes('party member')) {
    return MoveTarget.SingleFriendly;
  }

  return MoveTarget.SingleEnemy;
}

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/moves';

export function getIcon(image: string): string {
  if (image.includes('water-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/water.png';
  } else if (image.includes('support-enhancement-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/support-stat-enhancement.png';
  } else if (image.includes('plant-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/plant.png';
  } else if (image.includes('light-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/light.png';
  } else if (image.includes('wind-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/wind.png';
  } else if (image.includes('neutral-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/neutral.png';
  } else if (image.includes('earth-icon')) {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/earth.png';
  } else if ('support-icon') {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/support.png';
  } else if ('electric-icon') {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/electric.png';
  } else if ('fire-icon') {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/fire.png';
  } else if ('dark-icon') {
    return 'https://twiggyrj-digidex-assets.s3.eu-west-2.amazonaws.com/moves/dark.png';
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
      const name = $(element).find('td:nth-child(2) > a').text();

      if (false) {
        if (index > 7 && name !== 'Wolkenapalm III') return false;
      }

      const iconUrl = $(element).find('td:nth-child(1) > img').attr('src');

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
        signature: inheritable === '-',
        description: '',
        target: MoveTarget.SingleEnemy,
        penetrating: false,
        alwaysHits: false,
        hits: 1,
        accuracy: 100,
      });

      moveUrls.push(url);
    });

    let promise = Promise.resolve();
    moveToGet.forEach((move: Move, index) => {
      new Promise((resolve) => setTimeout(resolve, 1500 * index)).then(() =>
        getMoveDescriptionAsync(move, moveUrls[index])
      );
    });

    await Promise.resolve(promise);
    console.info('Operation Complete');
  } catch (error) {
    console.error(error);
  }
}

export async function getMoveDescriptionAsync(move: Move, moveUrl?: string): Promise<void> {
  try {
    const awaitTime = randomInteger(8, 25) * 1000;

    if (moveUrl) {
      await delay(awaitTime);

      const response = await instance(moveUrl);
      const html = response.data;
      const $: cheerio.Root = cheerio.load(html);
      const description = $('h3:contains("In-game description")').next().find('p').text();
      const formattedDescription = description.toLowerCase();
      const target = getTarget(formattedDescription);

      await delay(awaitTime);
      const effects: MoveEffect[] = [];

      if (
        move.name.toLowerCase().includes('charge') ||
        (move.name.toLowerCase().includes('break') && move.name.toLowerCase().includes('Chrono') === false)
      ) {
        const type = move.name.includes('charge') ? MoveEffectType.Buff : MoveEffectType.Debuff;
        const effect = formattedDescription.match(/\d+/g) as RegExpMatchArray;

        effects.push({
          effect: [getEffectedStat(description)],
          effectValue: Number(effect[0]),
          duration: 5,
          type,
          target,
          unit: formattedDescription.includes('%') ? MoveEffectUnit.Percentage : MoveEffectUnit.None,
        });
      } else if (formattedDescription.includes('doubles damage output')) {
        effects.push({
          effect: [MoveStat.Damage],
          effectValue: 200,
          duration: 1,
          type: MoveEffectType.Buff,
          target: MoveTarget.SingleFriendly,
          unit: MoveEffectUnit.Percentage,
        });
      } else if (formattedDescription.includes('absorb')) {
        const words = description.split(' ');
        const wordsWithPercent = words.filter((el) => el.includes('%'));
        const word = wordsWithPercent[0];
        const value = Number(word.split('%')[0]);

        effects.push({
          effect: [MoveStat.Absorb],
          effectValue: value,
          duration: 1,
          type: MoveEffectType.Buff,
          target: MoveTarget.SingleFriendly,
          unit: MoveEffectUnit.Percentage,
        });
      } else {
        const splitDescription = description.split('.');

        splitDescription.forEach((descriptionSegment: string) => {
          if (descriptionSegment !== '') {
            const effect = getEffectedStat(descriptionSegment);

            if (effect !== MoveStat.Undefined && effect !== MoveStat.Attack && effect !== MoveStat.Damage) {
              const words = descriptionSegment.split(',');
              const effectKeysRaw = words.map((word) => getEffectedStat(word));
              const effectKeys = effectKeysRaw.filter((value, index, arr) => value !== MoveStat.Undefined);

              const positiveFilters = ['absorb', 'increase', 'abnormal'];
              const negativeFilters = ['reduc', 'target'];
              const isPositive = positiveFilters.filter((item) => descriptionSegment.includes(item));
              const isNegative = negativeFilters.filter((item) => descriptionSegment.includes(item));

              const stats = getEffectStats(descriptionSegment);

              effects.push({
                effect: effectKeys,
                effectValue: stats.effectValue,
                effectChance: stats.effectChance,
                duration: descriptionSegment.includes('poison') ? 5 : 1,
                type: isPositive.length >= 1 || isNegative.length === 0 ? MoveEffectType.Buff : MoveEffectType.Debuff,
                target: getEffectTarget(descriptionSegment, target),
                unit: stats.unit ?? MoveEffectUnit.None,
              });
            }
          }
        });
      }

      const penetrating = description.split(' ').filter((word) => word.includes('penetrating'));
      const penetrates = penetrating.length > 0 ? getEffectedStat(penetrating[0].split('-')[0]) : undefined;
      let penetratingModifier = '';

      if (penetrating.length > 0) {
        if (description.includes('extra strong')) {
          penetratingModifier = 'extra-strong';
        } else if (description.includes('strong')) {
          penetratingModifier = 'strong';
        } else {
          penetratingModifier = 'medium';
        }
      }

      storeData(`${dir}/moves/${move.name}.json`, {
        ...move,
        description,
        target,
        accuracy: getAttackAccuracy(formattedDescription),
        penetrating: penetrates !== undefined,
        penetrates,
        penetratingModifier,
        alwaysHits: formattedDescription.includes('always hits') || move.type === MoveType.support,
        hits: getAttackHitsCount(formattedDescription),
        effects,
      });
    } else {
      await delay(awaitTime);
      storeData(`${dir}/moves/${move.name}.json`, move);
    }
  } catch (error) {
    console.error(error);
  }
}
