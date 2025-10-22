document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('news-list');
  if (!list) {
    return;
  }

  const feedUrl = 'https://feeds.feedburner.com/TheHackersNews';
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;

  fetch(proxyUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'application/xml');
      const items = Array.from(doc.querySelectorAll('item')).slice(0, 5);

      if (!items.length) {
        throw new Error('Aucun article trouvé');
      }

      const fragment = document.createDocumentFragment();

      items.forEach((item) => {
        const title = item.querySelector('title')?.textContent?.trim() || 'Article';
        const link = item.querySelector('link')?.textContent?.trim() || '#';
        const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';

        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.textContent = title;
        anchor.target = '_blank';
        anchor.rel = 'noopener';

        li.appendChild(anchor);

        if (pubDate) {
          const time = document.createElement('time');
          const date = new Date(pubDate);
          if (!Number.isNaN(date.getTime())) {
            time.dateTime = date.toISOString();
            time.textContent = date.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            li.appendChild(time);
          }
        }

        fragment.appendChild(li);
      });

      list.innerHTML = '';
      list.appendChild(fragment);
    })
    .catch(() => {
      list.innerHTML = '<li>Impossible de charger les actualités pour le moment.</li>';
    });
});
