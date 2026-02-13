let allHighlights = [];
let currentFilter = 'all';

// Load highlights when popup opens
document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded!');
  loadHighlights();
  setupFilterButtons();
});

function loadHighlights() {
  chrome.storage.local.get({ highlights: [] }, (data) => {
    console.log('Loaded from storage:', data.highlights);
    allHighlights = data.highlights;
    updateCountBadge();
    displayHighlights();
  });
}

function updateCountBadge() {
  const countElement = document.getElementById('totalCount');
  countElement.textContent = allHighlights.length;
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Update current filter
      currentFilter = btn.dataset.filter;
      
      // Refresh display
      displayHighlights();
    });
  });
}

function displayHighlights() {
  const container = document.getElementById('highlightsContainer');
  
  // Filter highlights based on current filter
  let filteredHighlights = allHighlights;
  if (currentFilter !== 'all') {
    filteredHighlights = allHighlights.filter(h => h.category === currentFilter);
  }
  
  console.log('Displaying highlights:', filteredHighlights.length);
  
  // Show empty state if no highlights
  if (filteredHighlights.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">^-^</div>
        <p><strong>${currentFilter === 'all' ? 'No highlights yet!' : 'No ' + currentFilter + ' highlights'}</strong></p>
        <p style="font-size: 11px; margin-top: 8px; color: #999;">
          Select text on any webpage and click a color button to save it.
        </p>
      </div>
    `;
    return;
  }
  
  // Display highlights (most recent first)
  container.innerHTML = '';
  const reversed = [...filteredHighlights].reverse();
  
  reversed.forEach((highlight, index) => {
    // Find the original index in the full array
    const originalIndex = allHighlights.indexOf(filteredHighlights[filteredHighlights.length - 1 - index]);
    const card = createHighlightCard(highlight, originalIndex);
    container.appendChild(card);
  });
}

function createHighlightCard(highlight, originalIndex) {
  const card = document.createElement('div');
  card.className = 'highlight-card';
  card.style.borderLeftColor = highlight.color || '#ccc';
  
  // Truncate text if too long
  const displayText = highlight.text.length > 150 
    ? highlight.text.substring(0, 150) + '...' 
    : highlight.text;
  
  card.innerHTML = `
    <div class="highlight-text">"${displayText}"</div>
    <div class="highlight-meta">
      <div class="highlight-time">${highlight.dateString || 'Unknown date'}</div>
      <div class="highlight-actions">
        <button class="action-btn copy-btn" data-text="${highlight.text}">
          Copy
        </button>
        <button class="action-btn visit-btn" data-url="${highlight.url || '#'}">
          Visit
        </button>
        <button class="action-btn delete-btn" data-index="${originalIndex}">
          Delete
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const visitBtn = card.querySelector('.visit-btn');
  visitBtn.addEventListener('click', () => {
    if (highlight.url && highlight.url !== '#') {
      chrome.tabs.create({ url: highlight.url });
    }
  });
  
  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    deleteHighlight(originalIndex);
  });
  
  const copyBtn = card.querySelector('.copy-btn');
  copyBtn.addEventListener('click', () => {
    copyToClipboard(highlight.text, copyBtn);
  });
  
  return card;
}
function deleteHighlight(index) {
  console.log('Deleting highlight at index:', index);
  
  allHighlights.splice(index, 1);
  
  console.log('Remaining highlights:', allHighlights.length);
  chrome.storage.local.set({ highlights: allHighlights }, () => {
    updateCountBadge();
    displayHighlights();
  });
}

function copyToClipboard(text, button) {
  // Copy text to clipboard
  navigator.clipboard.writeText(text).then(() => {
    // Show success feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.color = '#4CAF50';
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.style.color = '#4CAF50';
    }, 2000);
    
    console.log('Text copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text:', err);
    alert('Failed to copy text');
  });
}
// Debug: Log when popup script loads
console.log('Readpoint popup script loaded');