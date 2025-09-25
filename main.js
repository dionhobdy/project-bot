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

// Make ifState async so we can await each option when needed
let ifState = async () => {
    if (x == 0) {
        await newProject();
    } else if (x == 1) {
        await currentProject();
    } else if (x == 2) {
        await addProject();
    } else if (x == 3) {
        await timer();
    }
}

// main menu loop - keeps showing the menu until the user explicitly chooses to exit
let menu = async () => {
    let shouldExit = false;
    while (!shouldExit) {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Select option',
            choices: [
                { title: 'New Project', description: 'Randomly outputs a project from the master list.'},
                { title: 'Current Project', description: 'Displays the current project and set the status of the project.'},
                { title: 'Add Project', description: 'Enables the user to add a project to the master list.'},
                { title: 'Timer Mode', description: 'Sets a timer for the user based on time options.'},
                { title: 'Exit', description: 'Close the application.'}
            ],
            initial: 0
        });

        // If user cancels (Ctrl+C or Esc), prompts returns undefined; treat that as Exit
        if (!response || typeof response.value === 'undefined') {
            shouldExit = true;
            break;
        }

        x = response.value;

        // If the user selected the Exit option (which we placed last), break the loop
        if (x === 4) {
            shouldExit = true;
            break;
        }

        // Call the selected function and wait for it to finish if it returns a Promise
        try {
            await ifState();
        } catch (err) {
            console.error('Error while executing option:', err);
        }

        console.log('\nReturning to main menu...');
    }

    console.log('Exiting Project Bot. Goodbye!');
    say.speak('Exiting Project Bot. Goodbye!');
    process.exit(0);
}

console.log('Welcome to Project Bot! Please select an option.');
say.speak('Welcome to Project Bot!');

// start the menu loop
menu();
