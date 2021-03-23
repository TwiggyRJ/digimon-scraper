import { Digimon } from './interfaces/interfaces';
import getConnection from './utils/database';
import { dir, readAllFiles } from './utils/files';

export async function seedAllDigimon(isDev: boolean) {
  try {
    const connection = getConnection();

    const data = await readAllFiles(dir);

    if (Array.isArray(data)) {
      data.forEach((item: Digimon, index: number) => {
        console.log(`${item.name}, ${index}, ${item.description}`);
        connection.query('INSERT INTO digimon SET ?', { name: item.name, description: item.description, number: item.number, stage: item.stage, attribute: item.attribute, type: item.type, memoryUsage: item.memoryUsage, equipmentSlot: item.equipmentSlot }, (error, result) => {
          if (error) throw error;

          console.log(result);
        });
      });
    }
  } catch (error) {
    console.info(error);
  }
}