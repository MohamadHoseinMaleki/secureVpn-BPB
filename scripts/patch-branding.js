#!/usr/bin/env node
/**
 * secureVpn branding patcher
 * روی worker.js بیلد‌شده (مینفی‌شده) اعمال می‌شود.
 *
 * استفاده:
 *   node scripts/patch-branding.js input.js deploy/worker.js
 */

const fs = require("fs");
const path = require("path");

const input = process.argv[2] || "worker.js";
const output = process.argv[3] || "deploy/worker.js";

if (!fs.existsSync(input)) {
  console.error("Input not found:", input);
  process.exit(1);
}

let code = fs.readFileSync(input, "utf8");

const replacements = [
  // Project names
  [/_project_\s*=\s*["']BPB Panel["']/g, '_project_="secureVpn"'],
  [/_project_SM_\s*=\s*["']BPB["']/g, '_project_SM_="secureVpn"'],
  [/"BPB Panel"/g, '"secureVpn"'],
  [/"BPB"/g, '"secureVpn"'],

  // Profile titles / hashes already partially patched in some builds
  [/Profile-Title.*?BPB/g, (m) => m.replace(/BPB/g, "secureVpn")],

  // Common remark prefixes
  [/💦 Best Ping/g, "🔒 secureVpn Best Ping"],
  [/💦 🔗 Best Ping/g, "🔗 secureVpn Best Ping"],
  [/💦 Best Ping D/g, "🔒 secureVpn Best Ping D"],
  [/💦 🔗 Best Ping D/g, "🔗 secureVpn Best Ping D"],
  [/💦 Smart Fragment/g, "🧠 secureVpn Smart Fragment"],
  [/💦 🔗 Smart Fragment/g, "🧠 secureVpn Smart Fragment"],

  // Filename headers
  [/filename=BPB/g, "filename=secureVpn"],
  [/filename=\$\{_project_SM_\}/g, "filename=${_project_SM_}"],
];

let count = 0;
for (const [from, to] of replacements) {
  const before = code;
  code = code.replace(from, to);
  if (code !== before) count++;
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, code, "utf8");

console.log("Patched →", output);
console.log("Replacement groups applied:", count);
console.log("Size:", fs.statSync(output).size, "bytes");
