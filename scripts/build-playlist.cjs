const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/MSI/.gemini/antigravity-ide/brain/26c75ebc-fc91-446e-b9b5-6d8d28fefe2a/.system_generated/tasks/task-139.log';
const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n').filter(Boolean);

const tracks = [];

for (const line of lines) {
  try {
    const data = JSON.parse(line);
    if (!data.notFound && data.title && data.albumArt) {
      const q = encodeURIComponent(data.title + ' ' + data.artist);
      tracks.push({
        title: data.title,
        artist: data.artist,
        albumArt: data.albumArt,
        spotifyUrl: 'https://open.spotify.com/search/' + q,
        durationSec: data.durationSec || 210,
      });
    }
  } catch (e) {}
}

tracks.push({
  title: 'That Girl (feat. Veegee) [Ye Remix]',
  artist: 'Olly Murs',
  albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/29/94/b2/2994b2cd-5936-9081-4311-88dfc4d08e96/dj.sxjwuycl.jpg/600x600bb.jpg',
  spotifyUrl: 'https://open.spotify.com/search/That%20Girl%20Olly%20Murs',
  durationSec: 177,
});

tracks.push({
  title: "Don't Call Me Up",
  artist: 'Mabel',
  albumArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/87/0c/2f/870c2f51-6495-ec45-b054-fb57f0177335/18UMGIM59599.rgb.jpg/600x600bb.jpg',
  spotifyUrl: 'https://open.spotify.com/search/Don%27t%20Call%20Me%20Up%20Mabel',
  durationSec: 178,
});

tracks.unshift({
  title: 'Dalada Mal',
  artist: 'JANANA, Kesavan Thangavadivel',
  albumArt: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022aedf730e42717b5421a780d',
  spotifyUrl: 'https://open.spotify.com/track/2C79E1YaRzT0Aum0YDstpE',
  durationSec: 192,
});

const outDir = path.resolve('src/features/about/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = `export interface FeaturedTrack {
  title: string;
  artist: string;
  albumArt: string;
  spotifyUrl: string;
  durationSec: number;
}

export const FEATURED_TRACKS: FeaturedTrack[] = ${JSON.stringify(tracks, null, 2)};
`;

fs.writeFileSync(path.join(outDir, 'playlist.ts'), content, 'utf8');
console.log('Successfully wrote', tracks.length, 'tracks to src/features/about/data/playlist.ts');
