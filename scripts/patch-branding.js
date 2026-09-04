#!/usr/bin/env node
/**
 * فقط برای خروجی npm run build — روی پنل v5 به‌تنهایی کافی نیست.
 * برای Worker واقعی از scripts/surgical-brand.js استفاده کن.
 */
import fs from "fs";
import path from "path";

console.error("DEPRECATED for live panel.");
console.error("Use: node scripts/surgical-brand.js wizard-worker.js deploy/worker.js");
process.exit(1);
