# Cleanup script — run once from the project root to remove unused files
Set-Location "c:\xampp\htdocs\gara_yaka_portfolio"

# ── Root unused files ─────────────────────────────────────────────────────────
Remove-Item -Force -ErrorAction SilentlyContinue @(
  "mockup_a.html",
  "mockup_b.html",
  "scratch_debug.spec.ts",
  "knip-output.txt",
  "knip-output-utf8.txt"
)

# ── Unused src files ──────────────────────────────────────────────────────────
Remove-Item -Force -ErrorAction SilentlyContinue @(
  "src\registry\spell-ui\signature.tsx",
  "src\components\ui\dotm-square-4.tsx",
  "src\components\dotmatrix-loader.css",
  "src\lib\dotmatrix-core.tsx",
  "src\lib\dotmatrix-hooks.ts"
)

# ── Remove now-empty registry dir ─────────────────────────────────────────────
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "src\registry"

# ── Update npm packages (prune removed deps from lock file) ───────────────────
npm install

Write-Host "Cleanup complete!" -ForegroundColor Green
