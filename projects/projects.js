'use strict';

// external module calls
const fs = require('fs');
const prompts = require('prompts');
const say = require('say');

// the addProject function allows the user to add a new project to projects.txt
let addProject = async () => {
    say.speak('Please enter the new project details after the prompt.');
    const response = await prompts({ 
        type: 'text',
        name: 'value',
        message: 'Enter the new project details:'
    });

    if (response.value) {
        fs.appendFile('./projects/projects.txt', response.value + '\n', (err) => {
            if (err) {
                console.error('Error writing to projects.txt:', err);
            } else {
                console.log('New project added to projects.txt.');
            }
        });
    }
}


// the currentProject function reads and displays the current project from current.txt
let currentProject = () => {
    say.speak('Fetching the current project details.');
    fs.readFile('./projects/current.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading current.txt:', err);
            return;
        }
        if (data.trim()) {
            console.log(`Current Project: ${data.trim()}`);
        } else {
            console.log('No current project found. Please select "New Project" to generate one.');
        }
    });
}

// the newProject function reads a random project from projects.txt, confirms with the user, and updates current.txt
let newProject = async () => {
    say.speak('Generating a new project for you.');
    // Read all projects
    fs.readFile('./projects/projects.txt', 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading file: ', err);
            return;
        }
        let lines = data.trim().split('\n');
        if (lines.length === 0) {
            console.log('No projects available.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * lines.length);
        const project = lines[randomIndex];
        console.log(`project - ${project}`);

        // Ask user for confirmation
        const response = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Do you want to accept this project?',
            initial: true
        });

        if (response.value) {
            // Remove the accepted project from projects.txt
            lines.splice(randomIndex, 1);
            fs.writeFile('./projects/projects.txt', lines.join('\n') + (lines.length ? '\n' : ''), (err) => {
                if (err) {
                    console.error('Error updating projects.txt:', err);
                } else {
                    console.log('Accepted project removed from projects.txt.');
                }
            });

            // Read current.txt
            fs.readFile('./projects/current.txt', 'utf8', (err, currentData) => {
                let newCurrent = '';
                if (err || !currentData.trim()) {
                    newCurrent = project;
                } else {
                    newCurrent = project;
                }
                fs.writeFile('./projects/current.txt', newCurrent + '\n', (err) => {
                    if (err) {
                        console.error('Error writing to current.txt:', err);
                    } else {
                        console.log('current.txt updated with new project.');
                    }
                });
            });
        } else {
            console.log('Project not accepted.');
        }
    });
}

// export all functions for main.js to call\
exports.currentProject = currentProject
exports.addProject = addProject 
exports.newProject = newProject
