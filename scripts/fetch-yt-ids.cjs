const fs = require('fs');

async function getYoutubeIds() {
  const content = fs.readFileSync('src/features/about/data/playlist.ts', 'utf8');
  const trackRegex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"/g;
  let match;
  const list = [];
  while ((match = trackRegex.exec(content)) !== null) {
    list.push({ title: match[1], artist: match[2] });
  }

  console.log('Found', list.length, 'tracks in playlist.ts');
  const results = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const q = item.title + ' ' + item.artist;
    try {
      const res = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' audio'));
      const html = await res.text();
      const m = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
      if (m) {
        results[item.title] = m[1];
        console.log(`[${i+1}/${list.length}]`, item.title, '=>', m[1]);
      } else {
        console.log(`[${i+1}/${list.length}]`, item.title, '=> NOT FOUND');
      }
    } catch (e) {
      console.error(item.title, e.message);
    }
  }

  fs.writeFileSync('scripts/youtube-ids.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved all YouTube IDs to scripts/youtube-ids.json');
}

getYoutubeIds();
