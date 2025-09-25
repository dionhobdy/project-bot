'use strict';

// import internal modules
const { addProject, currentProject, newProject } = require('./projects/projects.js');
const { timer } = require('./timer/timer.js');

// import external modules
const { fgColorHex } = require('terminal-text-color');
const prompts = require('prompts');
const say = require('say');

// print application title
console.log(fgColorHex('b4edd8'), `

░       ░░░       ░░░░      ░░░        ░░        ░░░      ░░░        ░░       ░░░░      ░░░        ░
▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒
▓       ▓▓▓       ▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓▓▓  ▓▓      ▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓       ▓▓▓  ▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓
█  ████████  ███  ███  ████  ██  ████  ██  ████████  ████  █████  █████  ████  ██  ████  █████  ████
█  ████████  ████  ███      ████      ███        ███      ██████  █████       ████      ██████  ████
Fortune Cookie's Cousin
By Dion Hobdy
[ https://github.com/dionhobdy ]
`);

let x;
let ifState = () => {
    if (x == 0) {
        newProject();
    } else if (x == 1) {
        currentProject();
    } else if (x == 2) {
        addProject();
    } else if (x == 3) {
        timer();
    }
}

let menu = () => {
    (async () => {
        const response = await prompts({
            // set prompt type to select, which enables the user to select options.
            type: 'select',
            name: 'value',
            message: 'select option',
            // display function names and descript functions that are not named after difficulty setting.
            choices: [
                { title: 'New Project', description: 'Randomly outputs a project from the master list.'},
                { title: 'Current Project', description: 'Displays the current project and set the status of the project.'},
                { title: 'Add Project', description: 'Enables the user to add a project to the master list.'},
                { title: 'Timer Mode', description: 'Sets a timer for the user based on time options.'}
            ],
            // set the cursor automatically to the first function. whichi is indexed at 0.
            initial: 0
        });
        // print the prompt as response variable.
        console.log(response);
        // create a obj that hold a key/value pair for each option.
        x = response.value;
        ifState();
    })();
}

console.log('Welcome to Project Bot! Please select an option.');
say.speak('Welcome to Project Bot! Please select an option.');


// return menu function to initialize the application.
menu();
