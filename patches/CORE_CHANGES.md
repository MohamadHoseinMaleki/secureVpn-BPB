# تغییرات کد secureVpn

همه چیز داخل **همین یک ریپو** است.

## فایل اصلی پچ

`patches/utils-functions.ts`

شامل:
1. `getConfigAddresses` — محدود کردن آدرس‌ها (~۱۰–۱۳ کانفیگ)
2. `generateRemark` — اسم‌ها به فرمت:
   - `☁️ secureVpn-1 | CF-Worker :443`
   - `✨ secureVpn-2 | Clean :443`
   - `🔹 secureVpn-3 | IPv4 :443`

## اسکریپت برند روی بیلد

```bash
node scripts/patch-branding.js input-worker.js deploy/worker.js
```

رشته‌های BPB / Best Ping را به secureVpn عوض می‌کند.
