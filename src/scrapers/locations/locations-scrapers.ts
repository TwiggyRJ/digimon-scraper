import cheerio from 'cheerio';
import { instance } from '../../utils/axios';
import { getAvailability } from '../../utils/converters';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/areas';

export async function getLocations(isDev: boolean) {
  try {
    doesDataFolderExist();

    await instance(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const areasTable = $('#searchable-table > tr');

        areasTable.each(async (index, element) => {
          const name = $(element).find('td:nth-child(1) > a').text();
          const url = $(element).find('td:nth-child(1) > a').attr('href');
          const parent = $(element).find('td:nth-child(2)').text();
          const availableAt = $(element).find('td:nth-child(3)').text();

          const location = {
            name: name === 'Shibuja' ? 'Shibuya' : name,
            parent: parent === 'Shibuja' ? 'Shibuya' : parent,
            availableAt: getAvailability(availableAt),
          };

          storeData(`${dir}/locations/${location.name}.json`, location);
        });
      })
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
}

