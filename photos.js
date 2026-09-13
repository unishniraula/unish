document.addEventListener('DOMContentLoaded', () => {
  const username = 'bhar_dwaj.0';
  const photosGrid = document.getElementById('photosGrid');
  const tabButtons = document.querySelectorAll('.tab-btn');

  let allPhotosData = [];

  // 1. Fetch Instagram Photos via Public RSS Bridge
  async function fetchInstagramPhotos() {
    try {
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/instagram/user/${username}`);
      const data = await response.json();

      if (data.status === 'ok' && data.items.length > 0) {
        allPhotosData = data.items.map((item, index) => {
          // Extract direct image URL from post content HTML
          const imgMatch = item.content ? item.content.match(/src="([^"]+)"/) : null;
          const imgSrc = imgMatch ? imgMatch[1] : (item.thumbnail || `https://picsum.photos/seed/${username}${index}/600/600`);

          // Categorize by hashtag detection, falling back to alternating pattern
          const text = (item.title || '').toLowerCase();
          let category = 'personal';
          if (text.includes('#work') || text.includes('#project') || text.includes('#prof') || text.includes('#portfolio')) {
            category = 'professional';
          } else if (!text.includes('#personal') && index % 2 !== 0) {
            category = 'professional';
          }

          return {
            id: index,
            title: item.title || `Post by @${username}`,
            image: imgSrc,
            link: item.link || `https://instagram.com/${username}`,
            category: category
          };
        });
        renderGallery(allPhotosData);
      } else {
        renderFallbackGallery();
      }
    } catch (error) {
      console.warn('Instagram bridge unavailable; loading fallback gallery.', error);
      renderFallbackGallery();
    }
  }

  // 2. Render Gallery Items into DOM
  function renderGallery(items) {
    photosGrid.innerHTML = '';

    if (items.length === 0) {
      photosGrid.innerHTML = `<div class="gallery-loading">No photos found in this category.</div>`;
      return;
    }

    items.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.setAttribute('data-category', photo.category);

      const isProf = photo.category === 'professional';
      const badgeClass = isProf ? 'badge-professional' : 'badge-personal';
      const badgeLabel = isProf ? 'Professional' : 'Personal';

      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${photo.image}" alt="Photo by @${username}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${username}${photo.id || 1}/600/600';">
          <span class="gallery-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="gallery-info">
          <p class="gallery-caption">${photo.title}</p>
          <a href="${photo.link}" target="_blank" rel="noopener noreferrer" class="gallery-link">
            View on Instagram →
          </a>
        </div>
      `;
      photosGrid.appendChild(card);
    });
  }

  // 3. Updated Fallback Preview
  function renderFallbackGallery() {
    allPhotosData = [
      {
        id: 1,
        title: "Instagram Post 1 (@bhar_dwaj.0)",
        image: "https://cdn.phototourl.com/free/2026-09-13-0b300ab6-17c3-490c-a47a-1fbc89857a3b.webp", // Displays placeholder image until live API token is added
        link: "https://www.instagram.com/p/DcJCdOaCLFq/?img_index=1&stkn=MWRzeTh4bWNrOThxcw==",
        category: "personal"
      },
    ];

    renderGallery(allPhotosData);
  }

  // 4. Tab Filtering Listener
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.getAttribute('data-category');

      if (selectedCategory === 'all') {
        renderGallery(allPhotosData);
      } else {
        const filtered = allPhotosData.filter(photo => photo.category === selectedCategory);
        renderGallery(filtered);
      }
    });
  });

  // Initialize gallery
  fetchInstagramPhotos();
});