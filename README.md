# secureVpn-BPB

**یک ریپو:** https://github.com/MohamadHoseinMaleki/secureVpn-BPB

## هدف
- نام ساب: **secureVpn**
- نام کانفیگ‌ها: **فقط لوکیشن** (بدون متن اضافه BPB)
- حدود ۱۰–۱۳ کانفیگ
- دیپلوی روی Worker: **`rcnf9ofm8yrbsdx1`**

## پنل
https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/panel

## کار روی سیستم خودت

1. پچ‌ها را از `patches/` روی `src/` اعمال کن — راهنما: `patches/BEST_PING_AND_SUB_NAME.md`
2. `npm run build`
3. `node scripts/patch-branding.js dist/worker.js deploy/worker.js`
4. دیپلوی:

```powershell
wrangler deploy deploy/worker.js --name rcnf9ofm8yrbsdx1 --compatibility-date 2025-06-01 --compatibility-flags nodejs_compat
```

جزئیات: [DEPLOY_RC.md](DEPLOY_RC.md)

## TCP Fast Open
در پنل **خاموش**.
