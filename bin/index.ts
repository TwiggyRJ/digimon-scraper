#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

import appPackage from '../package.json';
import { getDigimon } from '../all-digimon-scraper';

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
        switch (answers.digimon) {
            case 'All':
                getDigimon(answers.dev === 'Yes');
                break;
        
            default:
                break;
        }
    })
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