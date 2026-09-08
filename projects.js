let currentCategory = 'all';

  // Category Tab Filter Functionality
  function filterCategory(category, element) {
    currentCategory = category;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    element.classList.add('active-tab');

    applyFilters();
  }

  // Unified Filtering (Search + Category)
  function applyFilters() {
    const query = document.getElementById('projectSearch').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesSearch = text.includes(query);
      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Search Filtering Listener
  document.getElementById('projectSearch').addEventListener('input', applyFilters);
