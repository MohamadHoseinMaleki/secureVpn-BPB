# چرا دیپلوی روی Worker پنل شکست خورد؟

کد رسمی BPB 5.1.1:

```js
if (env.UUID || env.TR_PASS || typeof EMBEDED_SETTINGS === 'undefined') {
  throw new Error('BPB Panel v5 can only be installed using BPB Wizard...');
}
```

`EMBEDED_SETTINGS` را **فقط BPB Wizard** داخل اسکریپت می‌گذارد.

- `npm run build` → بدون embed → خطا
- کپی + پچ + `wrangler deploy` (حتی با `--no-bundle`) → اگر embed از بین برود یا bundle خراب کند → خطا
- مستندات رسمی: manual deploy روی v5 کار نمی‌کند

راه‌حل امن: پنل را دست نزن؛ ساب را با Worker جدا بازنویسی کن.
