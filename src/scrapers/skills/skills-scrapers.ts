import axios from 'axios';
import cheerio from 'cheerio';
import { dir, doesDataFolderExist, storeData } from '../../utils/files';

const url = 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/support-skills';

export async function getSkills() {
  try {
    doesDataFolderExist();

    await axios(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const skillTable = $('#searchable-table > tr');

        skillTable.each(async (index, element) => {
          const name = $(element).find('td:nth-child(1) > a').text();
          const description = $(element).find('td:nth-child(2)').text();

          const skill = {
            name,
            description
          };

          storeData(`${dir}/skills/${skill.name}.json`, skill);
        });
      })
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
}


