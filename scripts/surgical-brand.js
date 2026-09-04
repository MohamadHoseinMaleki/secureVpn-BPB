#!/usr/bin/env node
/**
 * پچ جراحی روی worker.js که از Cloudflare (نصب Wizard) دانلود شده.
 * EMBEDED_SETTINGS / SOURCE_CONTENT را دست نمی‌زند.
 *
 * Usage:
 *   node scripts/surgical-brand.js wizard-worker.js deploy/worker.js
 */
import fs from "fs";
import path from "path";

const input = process.argv[2];
const output = process.argv[3] || "deploy/worker.js";

if (!input || !fs.existsSync(input)) {
  console.error("Usage: node scripts/surgical-brand.js <wizard-worker.js> [output]");
  process.exit(1);
}

let code = fs.readFileSync(input, "utf8");
const size0 = code.length;

// Guard: must look like a Wizard-installed worker
const hasEmbed =
  code.includes("EMBEDED_SETTINGS") ||
  code.includes("SOURCE_CONTENT") ||
  code.includes("EmbededSettings") ||
  code.includes("accID");

if (!hasEmbed) {
  console.error("ERROR: این فایل شبیه worker نصب‌شده با Wizard نیست.");
  console.error("از Cloudflare → Edit code کل کد را کپی کن، نه خروجی npm run build.");
  process.exit(1);
}

// Do NOT replace atob('QlBC') globally if it breaks internal checks —
// only replace human-visible subscription / remark style strings.

const pairs = [
  // Profile / sub titles
  [/💦 \$\{_project_\} Raw/g, "secureVpn"],
  [/💦 BPB Panel Raw/g, "secureVpn"],
  [/💦 BPB Raw/g, "secureVpn"],
  [/base64:\$\{[^}]*BPB Panel[^}]*\}/g, null], // skip complex

  // UI title fragments (safe display strings)
  [/BPB Panel(?=v\d|\s*v\d|<)/g, "secureVpn"],
  [/>BPB Panel</g, ">secureVpn<"],
  [/"BPB Panel"/g, '"secureVpn"'],

  // Best Ping labels
  [/💦 Best Ping/g, "secureVpn Best Ping"],
  [/💦 🔗 Best Ping/g, "secureVpn Best Ping"],
  [/💦 \$\{chainSign\}Best Ping/g, "secureVpn Best Ping"],

  // Common remark prefix from generateRemark (minified may still hold template parts)
  [/💦 \$\{index\}\. /g, ""],
  [/Upstream Proxy/g, "Upstream"],
  [/- Domain : /g, " | Domain :"],
  [/- Clean IP : /g, " | Clean :"],
  [/- IPv4 : /g, " | IPv4 :"],
  [/- IPv6 : /g, " | IPv6 :"],

  // Download filenames
  [/filename=BPB/gi, "filename=secureVpn"],
  [/filename=bpb/g, "filename=secureVpn"],
];

let applied = 0;
for (const [re, to] of pairs) {
  if (to === null) continue;
  const next = code.replace(re, to);
  if (next !== code) {
    applied++;
    code = next;
  }
}

// Soft: project display via known base64 BPB only in string form "BPB" next to Panel already handled.
// Avoid replacing atob('QlBC') — that is _project_ and used widely; changing it rewrote the Wizard error before.

if (code.includes("SOURCE_CONTENT") && !code.includes("SOURCE_CONTENT")) {
  console.error("FATAL: SOURCE_CONTENT lost");
  process.exit(1);
}

// Ensure we didn't strip EMBED markers
if (
  !(code.includes("EMBEDED_SETTINGS") || code.includes("SOURCE_CONTENT") || code.includes("accID"))
) {
  console.error("FATAL: embed markers disappeared after patch");
  process.exit(1);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, code);
console.log("OK surgical patch");
console.log("  in :", input, size0);
console.log("  out:", output, code.length);
console.log("  replacement groups applied:", applied);
console.log("Next:");
console.log(
  "  wrangler deploy " +
    output +
    " --name rcnf9ofm8yrbsdx1 --compatibility-date 2025-06-01 --compatibility-flags nodejs_compat --keep-vars"
);
