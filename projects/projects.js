'use strict';

// external module calls
const fs = require('fs').promises;
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
        try {
            // Ensure the projects directory and file exist and that the file ends with a newline
            const filePath = './projects/projects.txt';
            let existing = '';
            try {
                existing = await fs.readFile(filePath, 'utf8');
            } catch (e) {
                // file might not exist; we'll create it when writing
                existing = '';
            }

            // If the file doesn't end with a newline and isn't empty, add one before appending
            const needsLeadingNewline = existing && !existing.endsWith('\n');
            const prefix = needsLeadingNewline ? '\n' : '';

            await fs.appendFile(filePath, prefix + response.value + '\n');
            console.log('New project added to projects.txt.');
        } catch (err) {
            console.error('Error writing to projects.txt:', err);
        }
    }
}


// the currentProject function reads and displays the current project from current.txt
let currentProject = async () => {
    say.speak('Fetching the current project details.');
    try {
        const data = await fs.readFile('./projects/current.txt', 'utf8');
        if (data && data.trim()) {
            console.log(`Current Project: ${data.trim()}`);
        } else {
            console.log('No current project found. Please select "New Project" to generate one.');
        }
    } catch (err) {
        console.error('Error reading current.txt:', err);
    }
}

// the newProject function reads a random project from projects.txt, confirms with the user, and updates current.txt
let newProject = async () => {
    say.speak('Generating a new project for you.');
    try {
        const data = await fs.readFile('./projects/projects.txt', 'utf8');
        let lines = data.trim() ? data.trim().split('\n') : [];
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
            try {
                await fs.writeFile('./projects/projects.txt', lines.join('\n') + (lines.length ? '\n' : ''));
                console.log('Accepted project removed from projects.txt.');
            } catch (err) {
                console.error('Error updating projects.txt:', err);
            }

            // Update current.txt with the accepted project
            try {
                await fs.writeFile('./projects/current.txt', project + '\n');
                console.log('current.txt updated with new project.');
            } catch (err) {
                console.error('Error writing to current.txt:', err);
            }
        } else {
            console.log('Project not accepted.');
        }
    } catch (err) {
        console.error('Error reading file: ', err);
    }
}

// export all functions for main.js to call
exports.currentProject = currentProject
exports.addProject = addProject 
exports.newProject = newProject
