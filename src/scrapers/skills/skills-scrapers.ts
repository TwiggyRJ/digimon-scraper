import cheerio from 'cheerio';
import { instance } from '../../utils/axios';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

enum SkillTarget {
  Caster = 'caster',
  Party = 'party'
}

enum SkillStat {
  Absorb = 'absorb',
  Accuracy = 'accuracy',
  Attack = 'attack',
  BadAffinity = 'bad-affinity',
  Critical = 'critical',
  Combos = 'combos',
  DamageOutput = 'damage-output',
  DamageOutputHolyKnight = 'damage-output-holy-knight',
  DamageInput = 'damage-input',
  Defence = 'defence',
  Evasion = 'evasion',
  Earth = 'earth',
  Fire = 'fire',
  Light = 'light',
  Dark = 'dark',
  Water = 'water',
  Wind = 'wind',
  Electric = 'electric',
  Plant = 'plant',
  Neutral = 'neutral',
  Intelligence = 'intelligence',
  InstantKill = 'instant-kill',
  InstantDeath = 'instant-death',
  HP = 'hp',
  HPRecoveryEffects = 'hp-recovery-effects',
  HPRestore = 'hp-restore',
  MaxHP = 'max-hp',
  Scan = 'scan',
  Sleep = 'sleep',
  SP = 'sp',
  Stun = 'stun',
  Speed = 'speed',
  StatBoost = 'stat-boost',
  StopFatal = 'stop-fatal',
  All = 'all',
  Preventable = 'preventable',
  Yen = 'yen',
  Ultimate = 'ultimate-stage',
  Mega = 'mega-stage',
  AlwaysEscape = 'always-escape',
  Confusion = 'confusion',
  Dotting = 'dotting',
  Paralysis = 'paralysis',
  Poison = 'poison',
  Undefined = '',
}

enum Preventable {
  Confusion = 'confusion',
  Dotting = 'dotting',
  Paralysis = 'paralysis',
  Poison = 'poison',
  Sleep = 'sleep',
  Stun = 'stun'
}

enum TakesEffect {
  Above = 'above',
  AboveEqual = 'above-equal',
  Below = 'below',
  BelowEqual = 'below-equal',
  Equal = 'equal'
}

interface SkillCondition {
  stat: SkillStat;
  takesEffect?: TakesEffect;
  value?: number;
}

interface SkillEffect {
  effect: SkillStat[];
  target: SkillTarget;
  value: number;
  conditions?: SkillCondition[];
  absorbs?: SkillStat[];
  perTurn?: boolean;
  chance?: number;
}

interface Skill {
  name: string;
  description: string;
  effects: SkillEffect[];
  prevents?: Preventable;
}

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/support-skills';

function getPreventable(description: string) {
  const isPreventable = description.includes('Prevent');

  if (isPreventable) {
    if (description.includes('confusion')) {
      return Preventable.Confusion;
    } else if (description.includes('dotting')) {
      return Preventable.Dotting;
    } else if (description.includes('paralysis')) {
      return Preventable.Paralysis;
    } else if (description.includes('poison')) {
      return Preventable.Poison;
    } else if (description.includes('sleep')) {
      return Preventable.Sleep;
    } else if (description.includes('stun')) {
      return Preventable.Stun;
    }
  }
}

function getEffectedStat(description: string): SkillStat {
  if (description.includes('ATK')) {
    return SkillStat.Attack;
  } else if (description.includes('ACC') || description.includes('ACU')) {
    return SkillStat.Accuracy;
  } else if (description.includes('CRIT') || description.includes('CRT')) {
    return SkillStat.Critical;
  } else if (description.includes('DEF')) {
    return SkillStat.Defence;
  } else if (description.includes('EVA')) {
    return SkillStat.Evasion;
  } else if (description.includes('INT')) {
    return SkillStat.Intelligence;
  } else if (description.includes('SPD')) {
    return SkillStat.Speed;
  } else if (description.includes('HP')) {
    return SkillStat.HP;
  } else if (description.includes('Max HP')) {
    return SkillStat.MaxHP;
  } else if (description.includes('SP')) {
    return SkillStat.SP;
  } else if (description.includes('stun')) {
    return SkillStat.Stun;
  } else if (description.includes('scan')) {
    return SkillStat.Scan;
  } else if (description.includes('Light')) {
    return SkillStat.Light;
  } else if (description.includes('Dark')) {
    return SkillStat.Dark;
  } else if (description.includes('Fire')) {
    return SkillStat.Fire;
  } else if (description.includes('Earth')) {
    return SkillStat.Earth;
  } else if (description.includes('Water')) {
    return SkillStat.Water;
  } else if (description.includes('Plant')) {
    return SkillStat.Plant;
  } else if (description.includes('Electric')) {
    return SkillStat.Electric;
  } else if (description.includes('Neutral')) {
    return SkillStat.Neutral;
  } else if (description.includes('Wind')) {
    return SkillStat.Wind;
  } else if (description.includes('combos')) {
    return SkillStat.Combos;
  } else if (description.includes('sleep')) {
    return SkillStat.Sleep;
  } else if (description.includes('killing')) {
    return SkillStat.InstantKill;
  } else if (description.includes('Death')) {
    return SkillStat.InstantDeath;
  } else if (description.includes('dotting')) {
    return SkillStat.Dotting;
  }

  return SkillStat.Undefined;
}

export async function getSkills() {
  try {
    doesDataFolderExist();

    await instance(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const skillTable = $('#searchable-table > tr');

        skillTable.each(async (index, element) => {
          const name = $(element).find('td:nth-child(1) > a').text();
          const description = $(element).find('td:nth-child(2)').text();

          const effects: SkillEffect[] = [];

          if (name === "Aus Generics") {
            effects.push({
              effect: [SkillStat.Speed, SkillStat.Evasion],
              target: SkillTarget.Party,
              value: 25,
              conditions: [{
                stat: SkillStat.HP,
                takesEffect: TakesEffect.Below,
                value: 25
              }]
            });
          } else if (name === "Backwater Camp") {
            effects.push(
              ...[
                {
                  effect: [SkillStat.DamageOutput],
                  target: SkillTarget.Party,
                  value: 20,
                },
                {
                  effect: [SkillStat.DamageInput],
                  target: SkillTarget.Party,
                  value: 20,
                }
              ]
            );
          } else if (name === "Battle Sense") {
            effects.push({
              effect: [SkillStat.Attack],
              target: SkillTarget.Party,
              value: 50,
              conditions: [{
                stat: SkillStat.HP,
                takesEffect: TakesEffect.Below,
                value: 10
              }]
            });
          } else if (name === "Blast Digivolution") {
            effects.push({
              effect: [SkillStat.DamageInput],
              target: SkillTarget.Party,
              value: 10,
            });
          } else if (name === "Blaster") {
            effects.push(
              ...[
                {
                  effect: [SkillStat.Attack],
                  target: SkillTarget.Party,
                  value: 10,
                },
                {
                  absorbs: [SkillStat.HP],
                  effect: [SkillStat.Absorb],
                  target: SkillTarget.Party,
                  value: 30,
                }
              ]
            );
          } else if (name === "Counter-Attack") {
            effects.push({
              effect: [SkillStat.DamageOutputHolyKnight],
              target: SkillTarget.Party,
              value: 50,
            });
          } else if (name === "Hermitic Loner") {
            effects.push({
              effect: [SkillStat.DamageOutputHolyKnight],
              target: SkillTarget.Party,
              value: 50,
            });
          } else if (name === "Caledfwlch Dive") {
            effects.push(
              ...[
                {
                  effect: [SkillStat.Accuracy, SkillStat.Evasion],
                  target: SkillTarget.Party,
                  value: 5,
                },
                {
                  effect: [SkillStat.Critical],
                  target: SkillTarget.Party,
                  value: 10,
                }
              ]
            );
          } else if (name === "Destiny") {
            effects.push({
              effect: [SkillStat.MaxHP, SkillStat.SP],
              target: SkillTarget.Party,
              value: 3,
            });
          } else if (name.includes('Disposition')) {
            effects.push({
              effect: [SkillStat.StopFatal],
              target: SkillTarget.Party,
              value: 1,
              conditions: [{ stat: SkillStat.HP, takesEffect: TakesEffect.Above, value: 50 }]
            });
          } else if (name === 'Holy Knight') {
            effects.push(...[
              {
                effect: [SkillStat.Speed],
                target: SkillTarget.Party,
                value: 10,
              },
              {
                effect: [SkillStat.Fire, SkillStat.Light],
                target: SkillTarget.Party,
                value: 10,
              }
            ]);
          } else if (name === 'Holy Salvation') {
            effects.push({
              effect: [SkillStat.DamageInput],
              target: SkillTarget.Party,
              value: 15,
              conditions: [{ stat: SkillStat.BadAffinity, takesEffect: TakesEffect.Equal, value: 1 }]
            });
          } else if (name === 'Gekirin') {
            effects.push(
              ...[
                {
                  effect: [SkillStat.Attack],
                  target: SkillTarget.Party,
                  value: 50,
                  chance: 5,
                  conditions: [{ stat: SkillStat.DamageInput }]
                },
                {
                  effect: [SkillStat.Defence],
                  target: SkillTarget.Party,
                  value: -50,
                  chance: 5,
                  conditions: [{ stat: SkillStat.DamageInput }]
                }
              ]
            );
          } else if (name === 'Gluttony') {
            effects.push(
              ...[
                {
                  effect: [SkillStat.MaxHP],
                  target: SkillTarget.Party,
                  value: -5,
                  perTurn: true,
                },
                {
                  effect: [SkillStat.Attack],
                  target: SkillTarget.Party,
                  value: 5,
                  perTurn: true,
                }
              ]
            );
          } else if (name === 'Envy') {
            effects.push({
              effect: [SkillStat.DamageOutput],
              target: SkillTarget.Party,
              value: 15,
              conditions: [{ stat: SkillStat.Mega, takesEffect: TakesEffect.AboveEqual, value: 1 }]
            });
          } else if (name === 'Millionare') {
            effects.push({
              effect: [SkillStat.Yen],
              target: SkillTarget.Party,
              value: 5,
            });
          } else if (name === "Holy Ring") {
            effects.push({
              effect: [SkillStat.HPRecoveryEffects],
              target: SkillTarget.Party,
              value: 20,
            });
          } else if (name === 'Human Spirit') {
            effects.push(...[
              {
                effect: [SkillStat.Speed],
                target: SkillTarget.Party,
                value: 20,
              },
              {
                effect: [SkillStat.HP],
                target: SkillTarget.Party,
                value: -10,
              }
            ]);
          } else if (name === 'Furious Howl') {
            effects.push({
              effect: [SkillStat.InstantKill],
              target: SkillTarget.Party,
              value: 30,
              conditions: [{ stat: SkillStat.Ultimate, takesEffect: TakesEffect.Below, value: 1 }]
            });
          } else if (name === 'Pride') {
            effects.push({
              effect: [
                SkillStat.Light,
                SkillStat.Dark,
                SkillStat.Fire,
                SkillStat.Earth,
                SkillStat.Electric,
                SkillStat.Plant,
                SkillStat.Water,
                SkillStat.Wind,
              ],
              target: SkillTarget.Party,
              value: 5,
            });
          } else if (name === "Parallel World Tactician") {
            effects.push(
              ...[
                {
                  effect: [SkillStat.Light, SkillStat.Dark],
                  target: SkillTarget.Party,
                  value: 10,
                },
                {
                  effect: [SkillStat.HPRecoveryEffects],
                  target: SkillTarget.Party,
                  value: 10,
                }
              ]
            );
          } else if (name === 'Tifaret') {
            effects.push(
              ...[
                {
                  effect: [SkillStat.HPRestore],
                  target: SkillTarget.Party,
                  value: 5,
                  perTurn: true,
                },
                {
                  absorbs: [SkillStat.HP],
                  effect: [SkillStat.Absorb],
                  target: SkillTarget.Party,
                  value: 20,
                }
              ]
            );
          } else if (name === 'Wrath') {
            effects.push({
              effect: [SkillStat.Intelligence],
              target: SkillTarget.Party,
              value: 50,
              conditions: [{ stat: SkillStat.HP, takesEffect: TakesEffect.Below, value: 25 }]
            });
          } else if (name === 'To Fight Another Day') {
            effects.push({
              effect: [SkillStat.AlwaysEscape],
              target: SkillTarget.Party,
              value: 1,
            });
          } else if (name === 'Utopia') {
            effects.push(
              ...[
                {
                  effect: [SkillStat.InstantDeath],
                  target: SkillTarget.Party,
                  value: -50,
                },
                {
                  effect: [SkillStat.Critical],
                  target: SkillTarget.Party,
                  value: 10,
                }
              ]
            );
          } else if (name === 'Unwavering Defense') {
            effects.push(
              ...[
                {
                  effect: [SkillStat.Evasion],
                  target: SkillTarget.Party,
                  value: -15,
                },
                {
                  effect: [SkillStat.DamageInput],
                  target: SkillTarget.Party,
                  value: -15,
                }
              ]
            );
          } else {
            if (description.includes('absor')) {
              const words = description.split(' ');
              const absorbsStats = words.map(getEffectedStat).filter(stat => stat !== SkillStat.Undefined);

              if (absorbsStats.length > 0) {
                const wordsWithPercent = words.filter(el => el.includes('%'));
                const word = wordsWithPercent[0];
                const value = word ? Number(word.split('%')[0]) : 0;

                effects.push({
                  absorbs: absorbsStats,
                  effect: [SkillStat.Absorb],
                  target: SkillTarget.Party,
                  value,
                });
              }
            } else if (description.includes('stat boost')) {
              const effectStats = [SkillStat.StatBoost];
              const words = description.split(' ');
              const wordsWithPercent = words.filter(el => el.includes('%'));
              const word = wordsWithPercent[0];
              const value = word ? Number(word.split('%')[0]) : 0;

              effects.push({
                effect: effectStats,
                target: SkillTarget.Party,
                value,
              });
            } else if (description.includes('educes damage receive')) {
              const effectStats = [SkillStat.DamageInput];
              const words = description.split(' ');
              const wordsWithPercent = words.filter(el => el.includes('%'));
              const word = wordsWithPercent[0];
              const value = word ? Number(`-${word.split('%')[0]}`) : 0;

              effects.push({
                effect: effectStats,
                target: SkillTarget.Party,
                value,
              });
            } else if (description.includes(',') && description.includes('and') && description.includes('educes') && description.includes('ncreases')) {
              const parts = description.split(',');

              parts.forEach((part) => {
                const words = part.split(' ');
                const effectStats = words.map(getEffectedStat).filter(stat => stat !== SkillStat.Undefined);
                const target = part.includes('caster') ? SkillTarget.Caster : SkillTarget.Party;

                if (effectStats.length > 0) {
                  const wordsWithPercent = words.filter(el => el.includes('%'));
                  const word = wordsWithPercent[0];
                  const value = word ? Number(word.split('%')[0]) : 0;

                  effects.push({
                    effect: effectStats,
                    target,
                    value,
                  });
                }
              });
            } else {
              const words = description.split(' ');
              const effectStats = words.map(getEffectedStat).filter(stat => stat !== SkillStat.Undefined);
              const target = description.includes('caster') ? SkillTarget.Caster : SkillTarget.Party;

              if (effectStats.length > 0) {
                const wordsWithPercent = words.filter(el => el.includes('%'));
                const word = wordsWithPercent[0];
                const value = word ? Number(word.split('%')[0]) : 0;

                effects.push({
                  effect: effectStats,
                  target,
                  value,
                });
              }
            }
          }

          const skill: Skill = {
            name,
            description,
            effects,
            prevents: getPreventable(description),
          };

          storeData(`${dir}/skills/${skill.name}.json`, skill);
        });
      })
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
}


