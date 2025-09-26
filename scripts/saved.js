document.addEventListener('DOMContentLoaded', () => {
    const fs = require('fs');
    const path = require('path');

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    const ratingSelect = document.getElementById('rating-select');
    const loadBtn = document.getElementById('load-saved');

    const loadRandomSaved = (rating) => {
        const filePath = path.join(__dirname, '..', 'lists', `${rating}star.txt`);
        if (!fs.existsSync(filePath)) {
            console.log('No saved list for that rating.');
            setText('gen-1', ''); setText('gen-2', ''); setText('gen-3', ''); setText('gen-4', '');
            return;
        }
        const data = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(l => l.trim() !== '');
        if (data.length === 0) {
            console.log('No saved entries in file.');
            setText('gen-1', ''); setText('gen-2', ''); setText('gen-3', ''); setText('gen-4', '');
            return;
        }
        const randomLine = data[Math.floor(Math.random() * data.length)];
        try {
            const obj = JSON.parse(randomLine);
            const teas = Array.isArray(obj.teas) ? obj.teas : [];
            const adds = Array.isArray(obj.adds) ? obj.adds : [];
            setText('gen-1', teas[0] || '');
            setText('gen-2', teas[1] || '');
            setText('gen-3', adds[0] || '');
            setText('gen-4', adds[1] || '');
        } catch (err) {
            console.error('Failed to parse saved entry:', err);
        }
    }

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            const rating = ratingSelect.value || '3';
            loadRandomSaved(rating);
        });
    }

    // auto-load current selection
    if (ratingSelect) loadRandomSaved(ratingSelect.value || '3');
});
