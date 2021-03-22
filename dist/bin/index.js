#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
var package_json_1 = __importDefault(require("../package.json"));
var all_digimon_scraper_1 = require("../all-digimon-scraper");
clear_1.default();
console.log(chalk_1.default.red(figlet_1.default.textSync('Digimon Scraper', { horizontalLayout: 'full' })));
console.log('A CLI to scrape and collection information about digimon in Digimon Story: Cyber Sleuth');
var devOption = {
    type: 'list',
    name: 'dev',
    message: 'Are you testing this function?',
    choices: ['Yes', 'No'],
};
function renderDigimonOptions() {
    return inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'digimon',
            message: 'Single or all of them?',
            choices: ['All', 'Single']
        },
        devOption
    ]).then(function (answers) {
        switch (answers.digimon) {
            case 'All':
                all_digimon_scraper_1.getDigimon(answers.dev === 'Yes');
                break;
            default:
                break;
        }
    });
}
function handleIndexPrompt(answers) {
    switch (answers.index) {
        case 'Get Digimon':
            renderDigimonOptions();
            break;
        case 'Info':
            console.group();
            console.info('About: CLI for scraping data');
            console.info('Created 2021');
            console.info("Version: " + package_json_1.default.version);
            console.groupEnd();
        default:
            break;
    }
}
inquirer_1.default.prompt({
    type: 'rawlist',
    name: 'index',
    message: 'What would you like to do today',
    choices: ['Get Digimon', 'Get Moves', 'Info']
}).then(handleIndexPrompt);
