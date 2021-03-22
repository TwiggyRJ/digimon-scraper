#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import appPackage from '../../package.json';
import { getDigimon } from '../all-digimon-scraper';
import { getDigimonMetaData } from '../digimon-scraper';
import { dir, doesDataFolderExist, storeData } from '../utils/files';

clear();
console.log(chalk.red(
    figlet.textSync('Digimon Scraper', { horizontalLayout: 'full' })
));

console.log('A CLI to scrape and collection information about digimon in Digimon Story: Cyber Sleuth');

const devOption = {
    type: 'list',
    name: 'dev',
    message: 'Are you testing this function?',
    choices: ['Yes', 'No'],
};

async function renderSingleDigimonOption(isDev: boolean) {
    return inquirer.prompt({
        type: 'editor',
        name: 'url',
        message: 'What is the URL of digimon you wish to get?',
    }).then(async (answers) => {
        const url = answers.url.length > 0 ? answers.url.replace('/(\r\n|\n|\r)/gm', '') : 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/262-gallantmon';
        
        if (url.length > 0) {
            const digimon = await getDigimonMetaData(url);
            const file = `${dir}/${digimon.name}.json`;

            console.info(`Saving file to save: ${file}`);
            doesDataFolderExist();
            storeData(file, digimon);
            console.info(`File saved save to: ${file}`);
        }
    })
}

function renderDigimonOptions() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'digimon',
            message: 'Single or all of them?',
            choices: ['All', 'Single']
        },
        devOption
    ]).then((answers) => {
        console.info(answers)
        switch (answers.digimon) {
            case 'All':
                getDigimon(answers.dev === 'Yes');
                break;

            case 'Single':
                console.info('What?');
                renderSingleDigimonOption(answers.dev === 'Yes');
                break;
        
            default:
                break;
        }
    });
}

function handleIndexPrompt(answers: any) {
    switch (answers.index) {
        case 'Get Digimon':
            renderDigimonOptions();
            break;
    
        case 'Info':
            console.group();
            console.info('About: CLI for scraping data');
            console.info('Created 2021');
            console.info(`Version: ${appPackage.version}`);
            console.groupEnd();
        default:
            break;
    }
}

inquirer.prompt(
    {
        type: 'rawlist',
        name: 'index',
        message: 'What would you like to do today',
        choices: ['Get Digimon', 'Get Moves', 'Info']
    }
).then(handleIndexPrompt);