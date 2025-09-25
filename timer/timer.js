'use strict';

// external module calls
const fs = require('fs').promises;
const path = require('path');
const prompts = require('prompts');
const say = require('say');
const { exec } = require('child_process');

// Path to radios.txt (one level up from this file)
const radiosPath = path.join(__dirname, '..', 'radios.txt');

// the timer function enables the user to set a 15, 30 or 60 minute timer and then notifies the user that the time is up after the set time.
let timer = async () => {
    // Read radios and pick a random station now (so suggestion shows before the timer)
    let randomStationLocal = null;
    try {
        const data = await fs.readFile(radiosPath, 'utf8');
        const lines = data.trim() ? data.trim().split(/\r?\n/) : [];
        if (lines.length > 0) {
            const randomIndex = Math.floor(Math.random() * lines.length);
            randomStationLocal = lines[randomIndex].trim();
            console.log(`Suggested radio station: ${randomStationLocal}`);
        } else {
            console.log('No radio stations available.');
        }
    } catch (err) {
        console.error('Could not read radios.txt:', err.message);
    }

    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Select timer duration:',
        choices: [
            { title: '15 minutes', value: 15 },
            { title: '30 minutes', value: 30 },
            { title: '60 minutes', value: 60 }
        ]
    });

    // Return a Promise that resolves when the timeout completes
    return new Promise((resolve) => {
        // Ensure response.value exists (user didn't cancel). If canceled, default to 0 minutes so resolves quickly.
        const minutes = (response && typeof response.value === 'number') ? response.value : 0;

        setTimeout(() => {
            process.stdout.write('\x07\x07\x07');
            say.speak('Time is up! Take a break or start a new project.');
            console.log('Time is up! Take a break or start a new project.');

            if (randomStationLocal) {
                // If it looks like a URL, try to open it in the default browser (Windows/Mac/Linux)
                if (/^https?:\/\//i.test(randomStationLocal)) {
                    if (process.platform === 'win32') {
                        // start "" "url"
                        exec(`start "" "${randomStationLocal}"`, (err) => {
                            if (err) console.error('Failed to open URL:', err.message);
                        });
                    } else if (process.platform === 'darwin') {
                        exec(`open "${randomStationLocal}"`, (err) => {
                            if (err) console.error('Failed to open URL:', err.message);
                        });
                    } else {
                        // linux
                        exec(`xdg-open "${randomStationLocal}"`, (err) => {
                            if (err) console.error('Failed to open URL:', err.message);
                        });
                    }
                }
            } else {
                console.log('No radio station available to suggest.');
            }

            resolve();
        }, minutes * 60 * 1000); // convert minutes to milliseconds
    });
};

// export the timer function for main.js to call
exports.timer = timer