// Load data from JSON file
let insightsData = [];

fetch('insights-data.json')
    .then(response => response.json())
    .then(data => {
        insightsData = data.insights;
        renderCategories();
        rendercontents(insightsData);
    })
    .catch(error => console.error('Error loading data:', error));


// Render categories with counts
function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categoryCounts = {};
    
    insightsData.forEach(insight => {
        categoryCounts[insight.category] = (categoryCounts[insight.category] || 0) + 1;
    });
    
    let categoriesHTML = '';
    for (const [category, count] of Object.entries(categoryCounts)) {
        categoriesHTML += `
            <div class="category-item">
                <input type="checkbox" id="cat-${category}" value="${category}" onchange="filterItems()">
                <label for="cat-${category}">${category} <span class="category-count">(${count})</span></label>
            </div>
        `;
    }
    
    categoriesContainer.innerHTML = categoriesHTML;
}

// Render content list
function rendercontents(contents) {
    const contentList = document.getElementById('content-list');
    
    if (contents.length === 0) {
        contentList.innerHTML = '<p>No contents found matching your criteria.</p>';
        return;
    }
    
    let contentsHTML = '';
    contents.forEach(content => {
        contentsHTML += `
            <div class="content-card" onclick="openContent('${content.embedUrl}', '${content.title}')">
                <div class="content-title">${content.title}</div>
                <div class="content-description">${content.description}</div>
                <div class="content-meta">
                    ${content.meta.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
    });
    
    contentList.innerHTML = contentsHTML;
}

// Filter contents based on search and categories
function filterItems() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('#categories input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    let filtered = insightsData.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchTerm) || 
                            content.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategories.length === 0 || 
                              selectedCategories.includes(content.category);
        
        return matchesSearch && matchesCategory;
    });
    
    // Apply current sort
    const sortValue = document.getElementById('sort').value;
    sortItems(filtered, sortValue);
}

// Sort contents
function sortItems(contents = null, sortValue = null) {
    if (!sortValue) {
        sortValue = document.getElementById('sort').value;
    }
    
    const contentsToSort = contents || insightsData;
    let sorted;
    
    if (sortValue === 'title') {
        sorted = [...contentsToSort].sort((a, b) => a.title.localeCompare(b.title));
    } else {
        sorted = [...contentsToSort].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    if (!contents) {
        rendercontents(sorted);
    } else {
        rendercontents(sorted);
    }
}

// Open content in modal
function openContent(url, title) {
    const modal = document.getElementById('content-modal');
    const frame = document.getElementById('content-frame');
    
    frame.src = url;
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('content-modal');
    const frame = document.getElementById('content-frame');
    
    frame.src = '';
    document.body.style.overflow = 'auto';
    modal.style.display = 'none';
}

// Toggle sidebar collapse
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}