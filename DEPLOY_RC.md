# دیپلوی روی Worker واقعی: rcnf9ofm8yrbsdx1

پنل:
https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/panel

## روی ویندوز (PowerShell)

```powershell
cd C:\Users\PARSE\Documents\secureVpn-BPB

# 1) پچ‌های patches را روی src اعمال کن (utils + common + Best Ping)
# 2) بیلد
npm run build

# 3) پچ رشته‌های باقی‌مانده روی خروجی
node scripts\patch-branding.js dist\worker.js deploy\worker.js

# 4) دیپلوی روی همان Worker پنل
cd deploy
wrangler deploy --name rcnf9ofm8yrbsdx1 --compatibility-date 2025-06-01 --compatibility-flags nodejs_compat
```

اگر `deploy\worker.js` نبود:
```powershell
wrangler deploy dist\worker.js --name rcnf9ofm8yrbsdx1 --compatibility-date 2025-06-01 --compatibility-flags nodejs_compat
```

بعد از دیپلوی:
1. پنل را Ctrl+F5 بزن
2. ساب را دوباره کپی کن (کش کلاینت را رفرش کن)
3. اسم ساب باید secureVpn باشد
4. اسم کانفیگ‌ها فقط لوکیشن (مثل Cloudflare / دامنه Clean)

اگر پنل خراب شد → Cloudflare → Worker rcnf9ofm8yrbsdx1 → Deployments → نسخه قبل را Rollback کن.
