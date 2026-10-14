// scripts/get-spotify-token.mjs
// Run ONCE: node scripts/get-spotify-token.mjs
// It will open your browser, catch the callback, and print your refresh token.

import http from 'http';
import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const CLIENT_ID     = 'ee1a91cea14641fcb644d1c02aa7b662';
const CLIENT_SECRET = '9b901b4f4a20479292accdc00464806c';
const REDIRECT_URI  = 'http://127.0.0.1:8888/callback';
const SCOPES        = 'user-read-currently-playing user-read-recently-played';

const authUrl =
  `https://accounts.spotify.com/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:8888');
  if (url.pathname !== '/callback') { res.end(); return; }

  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(400); res.end('Missing code — try again.');
    return;
  }

  // Exchange code for tokens
  const b64 = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI });

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${b64}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await resp.json();

  if (data.error) {
    res.writeHead(500); res.end(`Error: ${JSON.stringify(data)}`);
    console.error('\n❌  Spotify error:', data);
    server.close();
    return;
  }

  // Write refresh token into .env
  const envPath = resolve('.env');
  let envContent = readFileSync(envPath, 'utf-8');
  envContent = envContent.replace(
    /VITE_SPOTIFY_REFRESH_TOKEN=.*/,
    `VITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`
  );
  writeFileSync(envPath, envContent, 'utf-8');

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html><body style="font-family:monospace;padding:2rem;background:#0a0a0f;color:#fff">
      <h2 style="color:#1DB954">✅ Refresh token saved to .env!</h2>
      <p>Refresh token: <code style="color:#1DB954">${data.refresh_token}</code></p>
      <p style="color:#888">You can close this tab now.</p>
    </body></html>
  `);

  console.log('\n✅  Done! Refresh token saved to .env:');
  console.log(`    VITE_SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
  console.log('\n   Restart your dev server (Ctrl+C then npm run dev) to pick it up.\n');

  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('\n🎵  Spotify OAuth — opening browser...');
  console.log(`    Auth URL: ${authUrl}\n`);
  // Open browser cross-platform
  const cmd = process.platform === 'win32' ? `start "" "${authUrl}"` : `open "${authUrl}"`;
  exec(cmd);
});
