const fs = require('fs');
const https = require('https');

function searchYouTube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const match = body.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
          resolve(match ? match[1] : null);
        });
      }
    );
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function run() {
  const playlist = fs.readFileSync('src/features/about/data/playlist.ts', 'utf8');
  const items = [];
  const regex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(playlist)) !== null) {
    items.push({ title: m[1], artist: m[2] });
  }

  console.log(`Processing ${items.length} tracks...`);
  const ytMap = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const q = `${item.title} ${item.artist} audio`;
    const id = await searchYouTube(q);
    ytMap[item.title] = id;
    console.log(`[${i + 1}/${items.length}] ${item.title} -> ${id}`);
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync('scripts/youtube-ids.json', JSON.stringify(ytMap, null, 2), 'utf8');
  console.log('Saved to scripts/youtube-ids.json');
}

run();
