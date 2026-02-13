// This script runs on every webpage to enable highlighting
console.log('Readpoint content script starting...');

let colorButtons = null;
let selectedText = '';
let isClickingButton = false;

// Listen for text selection
document.addEventListener('mouseup', (e) => {
  console.log('Mouseup event fired');
  
  // CRITICAL: Don't re-trigger if we're clicking our own buttons
  if (isClickingButton)
     {
    console.log('isClickingButton is true, returning');
    return;
  }
  if (e.target.closest('.readpoint-color-buttons')) {
    console.log('Clicked on color buttons, returning');
    return;
  }
  
  const cursorX = e.clientX;
  const cursorY = e.clientY;
  
  // Small delay to ensure selection is complete
  setTimeout(() => {
    selectedText = window.getSelection().toString().trim();
    console.log('Selected text:', selectedText, 'Length:', selectedText.length);
  
    // Remove old buttons if they exist
    if (colorButtons) {
      colorButtons.remove();
      colorButtons = null;
    }
    
    // Only show buttons if text is selected
    if (selectedText.length > 0) {
      console.log('Showing buttons at', cursorX, cursorY);
      showColorButtons(cursorX, cursorY);
    } else {
      console.log('No text selected');
    }
  }, 10);
});

// Click anywhere to hide buttons (but not on the buttons themselves)
document.addEventListener('mousedown', (e) => {
  if (colorButtons && !colorButtons.contains(e.target)) {
    colorButtons.remove();
    colorButtons = null;
  }
});

function showColorButtons(x, y) {
  console.log('showColorButtons called with x:', x, 'y:', y);
  
  // Create container for buttons
  colorButtons = document.createElement('div');
  colorButtons.className = 'readpoint-color-buttons';
  
  // Position near the cursor (use fixed positioning)
  colorButtons.style.position = 'fixed';
  colorButtons.style.left = x + 'px';
  colorButtons.style.top = (y - 60) + 'px';
  colorButtons.style.zIndex = '999999';
  
  // Define the 4 color categories
  const categories = [
    { name: 'important', color: '#ffd700', label: 'Important', letter: 'I' },
    { name: 'question', color: '#ff6b6b', label: 'Question', letter: '?' },
    { name: 'definition', color: '#4ecdc4', label: 'Definition', letter: 'D' },
    { name: 'quote', color: '#95e1d3', label: 'Quote', letter: 'Q' }
  ];
  
  // Create a button for each category
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'readpoint-color-btn';
    btn.style.backgroundColor = cat.color;
    btn.style.position = 'relative';
    btn.title = cat.label;
    btn.textContent = cat.letter;
    
    // Use mousedown with flag to prevent jumping
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // Set flag to prevent mouseup from re-triggering
      isClickingButton = true;
      
      saveHighlight(selectedText, cat.name, cat.color);
      
      if (colorButtons) {
        colorButtons.remove();
        colorButtons = null;
      }
      
      // Reset flag after a short delay
      setTimeout(() => {
        isClickingButton = false;
      }, 100);
      
      return false;
    });
    
    colorButtons.appendChild(btn);
  });
  
  console.log('Appending buttons to body');
  document.body.appendChild(colorButtons);
  console.log('Buttons appended successfully');
}

function saveHighlight(text, category, color) {
  console.log('Saving highlight:', { text, category, color });
  
  const highlight = {
    text: text,
    category: category,
    color: color,
    url: window.location.href,
    pageTitle: document.title,
    timestamp: new Date().toISOString(),
    dateString: new Date().toLocaleDateString(),
    timeString: new Date().toLocaleTimeString()
  };
  
  // Get existing highlights from storage
  chrome.storage.local.get({ highlights: [] }, (data) => {
    const highlights = data.highlights;
    highlights.push(highlight);
    
    console.log('Total highlights:', highlights.length);
    
    // Save back to storage
    chrome.storage.local.set({ highlights: highlights }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
      } else {
        console.log('Highlight saved successfully!');
        showSaveConfirmation(color);
      }
    });
  });
}

function showSaveConfirmation(color) {
  const confirmation = document.createElement('div');
  confirmation.className = 'readpoint-confirmation';
  confirmation.textContent = '✓ Saved!';
  confirmation.style.backgroundColor = color;
  confirmation.style.position = 'fixed';
  confirmation.style.top = '20px';
  confirmation.style.right = '20px';
  confirmation.style.padding = '12px 20px';
  confirmation.style.borderRadius = '6px';
  confirmation.style.color = '#333';
  confirmation.style.fontWeight = 'bold';
  confirmation.style.fontSize = '14px';
  confirmation.style.zIndex = '999999';
  confirmation.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
  
  document.body.appendChild(confirmation);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    confirmation.remove();
  }, 2000);
};

console.log('Readpoint content script loaded!');