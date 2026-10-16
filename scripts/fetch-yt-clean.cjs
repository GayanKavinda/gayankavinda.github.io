const fs = require('fs');

const playlistContent = fs.readFileSync('src/features/about/data/playlist.ts', 'utf8');
const regex = /"title":\s*"([^"]+)",\s*"artist":\s*"([^"]+)"/g;
let match;
const tracks = [];
while ((match = regex.exec(playlistContent)) !== null) {
  tracks.push({ title: match[1], artist: match[2] });
}

console.log('Loaded', tracks.length, 'tracks.');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function findIds() {
  const map = {};
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i];
    const q = t.title + ' ' + t.artist;
    try {
      const res = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const html = await res.text();
      const m = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (m) {
        map[t.title] = m[1];
        console.log(`[${i + 1}/${tracks.length}] ${t.title} => ${m[1]}`);
      } else {
        console.log(`[${i + 1}/${tracks.length}] ${t.title} => none`);
      }
    } catch (e) {
      console.log(`[${i + 1}/${tracks.length}] ${t.title} => err ${e.message}`);
    }
    await sleep(250);
  }
  fs.writeFileSync('scripts/yt-results.json', JSON.stringify(map, null, 2), 'utf8');
  console.log('Done! Saved to scripts/yt-results.json');
}

findIds();
