import { Attribute, Digimon, Type } from './interfaces/interfaces';
import getConnection from './utils/database';
import { dir, readAllFiles } from './utils/files';

export async function seedAllDigimon(isDev: boolean) {
  try {
    const connection = getConnection();

    const data = await readAllFiles(`${dir}/digimon`);

    if (Array.isArray(data)) {
      data.forEach((item: Digimon, index: number) => {
        console.log(item.supportSkill)
        connection.query(`SELECT id FROM support_skills WHERE name = '${item.supportSkill}' LIMIT 1`, (error, topResult: any[]) => {
          if (error) throw error;

          console.log(topResult[0].id)

          connection.query('INSERT INTO digimon SET ?', {
            name: item.name,
            description: item.description,
            number: item.number,
            stage: item.stage,
            attribute: item.attribute,
            type: item.type,
            memoryUsage: item.memoryUsage,
            equipmentSlot: item.equipmentSlot,
            supportSkillId: topResult[0].id
          }, (error, result) => {
            if (error) throw error;

            console.log(result);
          });

          
        });
      });
    }
  } catch (error) {
    console.info(error);
  }
}

export async function seedAllSkills() {
  try {
    const connection = getConnection();

    const data = await readAllFiles(`${dir}/skills`);

    if (Array.isArray(data)) {
      data.forEach((item: { name: string; description: string }, index: number) => {
        connection.query('INSERT INTO support_skills SET ?', {
          name: item.name,
          description: item.description,
        }, (error, result) => {
          if (error) throw error;

          console.log(result);
        });
      });
    }
  } catch (error) {
    console.info(error);
  }
}

export async function seedAttributeEffectiveness() {
  try {
    const connection = getConnection();
    const effectiveness: Array<{ name: Attribute, strength: Attribute, weakness: Attribute }> = [
      { name: Attribute.dark, strength: Attribute.dark, weakness: Attribute.light },
      { name: Attribute.light, strength: Attribute.light, weakness: Attribute.dark },
      { name: Attribute.earth, strength: Attribute.electric, weakness: Attribute.wind },
      { name: Attribute.electric, strength: Attribute.wind, weakness: Attribute.earth },
      { name: Attribute.wind, strength: Attribute.earth, weakness: Attribute.electric },
      { name: Attribute.water, strength: Attribute.fire, weakness: Attribute.plant },
      { name: Attribute.fire, strength: Attribute.plant, weakness: Attribute.water },
      { name: Attribute.plant, strength: Attribute.water, weakness: Attribute.fire },
    ];

    effectiveness.forEach((attributeEffectiveness: { name: Attribute, strength: Attribute, weakness: Attribute }) => {
      connection.query('INSERT INTO attribute_effectiveness SET ?', {
        name: attributeEffectiveness.name,
        strength: attributeEffectiveness.strength,
        weakness: attributeEffectiveness.weakness
      }, (error, result) => {
        if (error) throw error;

        console.log(result);
      });
    });
  } catch (error) {
    console.info(error);
  }
}

export async function seedTypeEffectiveness() {
  try {
    const connection = getConnection();
    const effectiveness: Array<{ name: Type, strength: Type, weakness: Type }> = [
      { name: Type.data, strength: Type.vaccine, weakness: Type.virus },
      { name: Type.vaccine, strength: Type.virus, weakness: Type.data },
      { name: Type.virus, strength: Type.data, weakness: Type.vaccine },
    ];

    effectiveness.forEach((typeEffectiveness: { name: Type, strength: Type, weakness: Type }) => {
      connection.query('INSERT INTO type_effectiveness SET ?', {
        name: typeEffectiveness.name,
        strength: typeEffectiveness.strength,
        weakness: typeEffectiveness.weakness
      }, (error, result) => {
        if (error) throw error;

        console.log(result);
      });
    });
  } catch (error) {
    console.info(error);
  }
}