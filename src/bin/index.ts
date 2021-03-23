#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import appPackage from '../../package.json';
import { getDigimon } from '../scrapers/digimon/all-digimon-scraper';
import { getDigimonMetaData } from '../digimon-scraper';
import { dir, doesDataFolderExist, storeData } from '../utils/files';
import { seedAllDigimon } from '../seeder';

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

async function menuGetDigimon(url: string) {
    const digimon = await getDigimonMetaData(url);
    const file = `${dir}/${digimon.name}.json`;

    console.info(`Saving file to save: ${file}`);
    doesDataFolderExist();
    storeData(file, digimon);
    console.info(`File saved save to: ${file}`);
}

async function renderSingleDigimonUrlOption(isDev: boolean) {
    return inquirer.prompt({
        type: 'editor',
        name: 'url',
        message: 'What is the URL of digimon you wish to get?',
    }).then(async (answers) => {
        const url = answers.url.length > 0 ? answers.url.replace('/(\r\n|\n|\r)/gm', '') : 'https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/262-gallantmon';
        
        if (url.length > 0) {
            await menuGetDigimon(url);
        }
    })
}

async function renderSingleDigimonOption(isDev: boolean) {
    return inquirer.prompt({
        type: 'list',
        name: 'digimon',
        message: 'Single or all of them?',
        choices: ['Kuramon', 'Gallantmon', 'Andromon', 'Leopardmon NX', 'Custom']
    }).then(async (answers) => {
        switch (answers.digimon) {
            case 'Kuramon':
                await menuGetDigimon('https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/1-kuramon');
                break;

            case 'Gallantmon':
                await menuGetDigimon('https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/262-gallantmon');
                break;

            case 'Andromon':
                await menuGetDigimon('https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/144-andromon');
                break;

            case 'Leopardmon NX':
                await menuGetDigimon('https://www.grindosaur.com/en/games/digimon/digimon-story-cyber-sleuth/digimon/339-leopardmon-nx');
                break;

            case 'Custom':
                renderSingleDigimonUrlOption(isDev);
                break;
        
            default:
                renderSingleDigimonUrlOption(isDev);
                break;
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

function renderSeedDigimonOptions() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'seedDigimon',
            message: 'Single or all of them?',
            choices: ['All', 'Single']
        },
        devOption
    ]).then((answers) => {
        switch (answers.seedDigimon) {
            case 'All':
                seedAllDigimon(answers.dev === 'Yes');
                break;

            case 'Single':
                console.info('What?');
                // renderSingleDigimonOption(answers.dev === 'Yes');
                break;

            default:
                break;
        }
    });
}

function renderSeederOptions() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'seeder',
            message: 'Digimon, Moves, Items, Areas or All of them?',
            choices: ['All', 'Digimon', 'Moves', 'Items', 'Areas']
        },
    ]).then((answers) => {
        switch (answers.seeder) {
            case 'All':
                
                break;

            case 'Digimon':
                renderSeedDigimonOptions();
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

        case 'Seed Database':
            renderSeederOptions();
            break;

        default:
            break;
    }
}

inquirer.prompt(
    {
        type: 'rawlist',
        name: 'index',
        message: 'What would you like to do today',
        choices: ['Get Digimon', 'Get Moves', 'Seed Database', 'Info']
    }
).then(handleIndexPrompt);

seedAllDigimon