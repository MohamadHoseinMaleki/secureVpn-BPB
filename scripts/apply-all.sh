#!/usr/bin/env bash
# یک‌جا: کلون فورک → اعمال پچ‌ها → بیلد → پچ برند → کپی به deploy/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${TMPDIR:-/tmp}/secureVpn-build-$$"

echo "==> Clone fork"
rm -rf "$WORK"
git clone --depth 1 https://github.com/MohamadHoseinMaleki/BPB-Worker-Panel.git "$WORK" || {
  echo "فورک پیدا نشد. اول فورک رسمی را بساز یا آدرس را درست کن."
  exit 1
}

cd "$WORK"

echo "==> Apply source patches if present"
if [ -f "$ROOT/patches/utils-functions.ts" ]; then
  # فقط راهنما — کاربر باید دو تابع را دستی جایگزین کند اگر هنوز نشده
  echo "Patch file available at: $ROOT/patches/utils-functions.ts"
  echo "Copy generateRemark + getConfigAddresses into src/cores/utils.ts if not already."
fi

echo "==> npm install & build"
npm install
npm run build

BUILT=""
for c in dist/worker.js build/worker.js worker.js; do
  if [ -f "$c" ]; then BUILT="$c"; break; fi
done

if [ -z "$BUILT" ]; then
  echo "worker.js بعد از بیلد پیدا نشد. خروجی بیلد را چک کن."
  ls -la
  exit 1
fi

echo "==> Branding patch"
mkdir -p "$ROOT/deploy"
node "$ROOT/scripts/patch-branding.js" "$BUILT" "$ROOT/deploy/worker.js"

echo "==> Done: $ROOT/deploy/worker.js"
echo "حالا git add/commit/push کن تا Actions دیپلوی کند."
