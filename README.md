# secureVpn-BPB

پنل واقعی تو (بعد از Rollback):
https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/panel

Worker: `rcnf9ofm8yrbsdx1`

## قانون طلایی BPB v5

```text
if (env.UUID || env.TR_PASS || typeof EMBEDED_SETTINGS === 'undefined') {
  throw new Error('... only installed using BPB Wizard ...');
}
```

یعنی **بیلد تمیز از سورس + wrangler** پنل را می‌شکند، چون `EMBEDED_SETTINGS` فقط موقع نصب Wizard داخل Worker می‌آید.

### کار درست
1. پنل را با Wizard نگه دار (Rollback کردی — خوب است)
2. تعداد کانفیگ و پینگ را از **تنظیمات پنل** کم کن
3. برای اسم ساب/کانفیگ: فقط روی **همان worker.js دانلود‌شده از Cloudflare** پچ جراحی بزن (نه بیلد خام)

جزئیات: [docs/SAFE_PATH.md](docs/SAFE_PATH.md)
