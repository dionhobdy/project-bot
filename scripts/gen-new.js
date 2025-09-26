document.addEventListener('DOMContentLoaded', () => {
    // nodejs module imports
    const fs = require('fs');
    const path = require('path');

    // create a random number generator that returns a random number between 1 and user input
    const rng = (max) => { return Math.floor(Math.random() * max) + 1; };

    // define the file paths for adds.txt and teas.txt
    const addsPath = path.join(__dirname, '../lists/adds.txt');
    const teasPath = path.join(__dirname, '../lists/teas.txt');

        /*

        ISSUE CATCH IN CASE OF ERROR
        1. Check if the file path does not exist.
        2. Indicate in console that the file is not found in file path.
        3. Stop the script after indication.

    */

    // check if the adds.txt and teas.txt file paths do not exit.
    if (!fs.existsSync(addsPath)) {
        console.error(`adds.txt not found at: ${addsPath}`);
        return; // this line will stop the script.
    }

    if (!fs.existsSync(teasPath)) {
        console.error(`teas.txt not found at: ${teasPath}`);
        return; // this line will stop the script.
    }

    /*
        CONVERT EACH LIST INTO AN ARRAY
        1. Declare readFileSync variables for each list.
        2. Split the list by newline.
    */

    // import the lists via fs.readFileSync
    const addsList = fs.readFileSync(addsPath, 'utf-8');
    const teasList = fs.readFileSync(teasPath, 'utf-8');

    // split each list into an array
    const addsArray = addsList.split(/\r?\n/).filter(line => line.trim() !== '');
    const teasArray = teasList.split(/\r?\n/).filter(line => line.trim() !== '');

    /*

        GENERATE A RANDOM BOBA ORDER
        1. Create empty arrays for the teas and adds.
        2. Determine if the order will consist of 1 or 2 teas/adds.
        3. Check for and replace duplicate array elements.
        4. Push random teas and adds to their respective arrays.
    
    */

    // create empty arrays for the teas and adds
    var teasRes = [];
    var addsRes = [];

    // determine if the order will consist of 1 or 2 teas/adds
    var numTeas = rng(2);
    var numAdds = rng(2);

    // push random teas to the teasRes array
    for (let i = 0; i < numTeas; i++) { teasRes.push(teasArray[rng(teasArray.length) - 1]); }
    // push random adds to the addsRes array
    for (let i = 0; i < numAdds; i++) { addsRes.push(addsArray[rng(addsArray.length) - 1]); }

    // UNCOMMENT THE CONSOLE.LOG LINE TO TEST THE SCRIPT IN CONSOLE
    // console.log(`${teasRes.join(' + ')} with ${addsRes.join(' + ')}`);

    /*
        OUTPUT THE RESULTS
        1. Output the results to component ids gen-1, gen-2, gen-3 and gen-4.

    */

    // select element by their ids and set text content to results.
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
    
    setText('gen-1', teasRes[0] || '');
    setText('gen-2', teasRes[1] || '');
    setText('gen-3', addsRes[0] || '');
    setText('gen-4', addsRes[1] || '');
    
    // ...existing selection behavior handled in review.js
    
    // SAVE HANDLER: when the save icon is clicked, save the generated teas and adds
    const saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            try {
                // determine star rating by counting filled stars
                const starEls = document.querySelectorAll('.star');
                let rating = 0;
                starEls.forEach(st => { if (st.classList.contains('filled')) rating++; });

                // collect the generated items as arrays
                const teasToSave = [];
                if (teasRes[0]) teasToSave.push(teasRes[0]);
                if (teasRes[1]) teasToSave.push(teasRes[1]);

                const addsToSave = [];
                if (addsRes[0]) addsToSave.push(addsRes[0]);
                if (addsRes[1]) addsToSave.push(addsRes[1]);

                // choose target file based on rating (1-5). If rating is 0, use adds.txt/teas.txt? We'll skip saving.
                if (rating >= 1 && rating <= 5) {
                    const targetFile = path.join(__dirname, '../lists', `${rating}star.txt`);

                    // Prepare JSON object to write: { teas: [...], adds: [...] }
                    const entry = JSON.stringify({ teas: teasToSave, adds: addsToSave });

                    // Ensure file exists and append entry as a new line
                    if (!fs.existsSync(targetFile)) {
                        // create file with the new entry
                        fs.writeFileSync(targetFile, entry + '\n', 'utf8');
                    } else {
                        fs.appendFileSync(targetFile, entry + '\n', 'utf8');
                    }

                    // Optionally also append to general lists (adds.txt and teas.txt)
                    // Append each additive and tea to their respective files if not already present
                    try {
                        // read existing teas and adds
                        const existingTeas = fs.readFileSync(teasPath, 'utf8').split(/\r?\n/).filter(l => l.trim() !== '');
                        const existingAdds = fs.readFileSync(addsPath, 'utf8').split(/\r?\n/).filter(l => l.trim() !== '');

                        teasToSave.forEach(t => {
                            if (!existingTeas.includes(t)) fs.appendFileSync(teasPath, t + '\n', 'utf8');
                        });
                        addsToSave.forEach(a => {
                            if (!existingAdds.includes(a)) fs.appendFileSync(addsPath, a + '\n', 'utf8');
                        });
                    } catch (err) {
                        console.error('Error updating teas/adds lists:', err);
                    }

                    // Provide feedback
                    console.log(`Saved entry to ${rating}star.txt`);
                } else {
                    console.log('No star rating selected; not saving.');
                }
            } catch (err) {
                console.error('Error saving generated item:', err);
            }
        });
    }

    
});