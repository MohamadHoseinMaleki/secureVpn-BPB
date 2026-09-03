#!/usr/bin/env node
/**
 * روی worker.js بیلدشده اعمال می‌شود.
 * node scripts/patch-branding.js dist/worker.js deploy/worker.js
 */
const fs = require("fs");
const path = require("path");

const input = process.argv[2] || "dist/worker.js";
const output = process.argv[3] || "deploy/worker.js";

if (!fs.existsSync(input)) {
  console.error("Input not found:", input);
  process.exit(1);
}

let code = fs.readFileSync(input, "utf8");
const before = code;

const pairs = [
  [/💦 \$\{_project_\} Raw/g, "secureVpn"],
  [/💦 BPB Panel Raw/g, "secureVpn"],
  [/💦 BPB Raw/g, "secureVpn"],
  [/BPB Panel/g, "secureVpn"],
  [/"BPB"/g, '"secureVpn"'],
  [/atob\('QlBC'\)/g, "'secureVpn'"],
  [/atob\('YnBi'\)/g, "'secureVpn'"],
  [/💦 \$\{chainSign\}Best Ping[^`]*🚀/g, "secureVpn Best Ping"],
  [/💦 Best Ping/g, "secureVpn Best Ping"],
  [/💦 🔗 Best Ping/g, "secureVpn Best Ping"],
  [/filename=BPB/g, "filename=secureVpn"],
  [/filename=bpb/g, "filename=secureVpn"],
];

let n = 0;
for (const [re, to] of pairs) {
  const next = code.replace(re, to);
  if (next !== code) n++;
  code = next;
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, code);
console.log("Wrote", output, "size", fs.statSync(output).size, "groups", n, "changed", code !== before);
