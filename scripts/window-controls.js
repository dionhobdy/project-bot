const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  try {
    const controls = document.querySelectorAll('.win-control');
    controls.forEach((el) => {
      // Determine action from alt text or data-action attribute
      const action = (el.getAttribute('data-action') || el.alt || '').toLowerCase();
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        if (action.includes('min')) {
          ipcRenderer.send('window-minimize');
        } else if (action.includes('max')) {
          ipcRenderer.send('window-maximize');
        } else if (action.includes('close')) {
          ipcRenderer.send('window-close');
        } else {
          // Fallback: if element has id patterns
          const id = el.id || '';
          if (id.includes('min')) ipcRenderer.send('window-minimize');
          else if (id.includes('max')) ipcRenderer.send('window-maximize');
          else if (id.includes('close')) ipcRenderer.send('window-close');
        }
      });
    });
  } catch (err) {
    console.error('window-controls error:', err);
  }
});
