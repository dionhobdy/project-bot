// the timer function enables the user to set a 15, 30 or 60 minute timer and then notifies the user that the time is up after the set time.
const prompts = require('prompts');
const say = require('say');

let timer = async () => {
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
    setTimeout(() => {
        process.stdout.write('\x07\x07\x07');
        say.speak('Time is up! Take a break or start a new project.');
        console.log('Time is up! Take a break or start a new project.');
    }, response.value * 60 * 1000); // convert minutes to milliseconds
};

// export the timer function for main.js to call
exports.timer = timer