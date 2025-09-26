document.addEventListener('DOMContentLoaded', () => {
    const newBtn = document.querySelector('#new');
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            window.location.href = 'pages/new.html';
        });
    }

    const savedBtn = document.querySelector('#saved');
    if (savedBtn) {
        savedBtn.addEventListener('click', () => {
            window.location.href = 'pages/saved.html';
        });
    }

    // Support multiple back button ids used across pages (e.g. #back, #back-saved)
    const backBtn = document.querySelector('#back') || document.querySelector('#back-saved') || document.querySelector('#back-new');
    if (backBtn) {
        // Ensure BACK is visually above overlays and can receive clicks
        try {
            backBtn.style.zIndex = '1000';
            backBtn.style.position = backBtn.style.position || 'relative';
            backBtn.style.pointerEvents = 'auto';
        } catch (e) {}

        backBtn.addEventListener('click', () => {
            // If we are inside the pages folder (URL contains /pages/), go up one level
            if (window.location.pathname.includes('/pages/')) {
                window.location.href = '../index.html';
            } else {
                // otherwise assume index.html is in the same folder
                window.location.href = 'index.html';
            }
        });

        // Temporary debug helper: log clicks and element under pointer to console. Keep enabled for now.
        const DEBUG_CLICKS = true;
        if (DEBUG_CLICKS) {
            document.addEventListener('click', (e) => {
                const el = document.elementFromPoint(e.clientX, e.clientY);
                console.log('[DEBUG CLICK] coords:', e.clientX, e.clientY, 'event.target:', e.target, 'elementFromPoint:', el);
            }, true);
        }
    }
});