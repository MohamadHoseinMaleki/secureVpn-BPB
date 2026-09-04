# مسیر امن secureVpn روی BPB 5.1.1

## چرا دیپلوی قبلی ترکید؟

`npm run build` یک Worker بدون `EMBEDED_SETTINGS` می‌سازد.
کد رسمی در `init()` اگر این متغیر نباشد خطا می‌دهد:

> can only be installed using BPB Wizard

## مرحله A — همین الان (بدون کد)

داخل پنل:

| تنظیم | مقدار |
|--------|--------|
| Protocols | فقط **VLESS** |
| Ports | فقط **443** |
| IPv6 | **Off** |
| TCP Fast Open | **Off** |
| Clean IPs | ۲ تا ۴ تا |
| Trojan | Off |

Apply → ساب را رفرش کن. تعداد کانفیگ می‌ریزد سمت ۱۰–۱۳.

## مرحله B — اسم ساب و کانفیگ (پچ جراحی)

1. Cloudflare → Worker `rcnf9ofm8yrbsdx1` → **Edit code**
2. **کل** کد را کپی کن در فایل محلی مثلاً:
   `C:\Users\PARSE\Documents\secureVpn-BPB\wizard-worker.js`
3. پچ را اجرا کن:

```powershell
cd C:\Users\PARSE\Documents\secureVpn-BPB
git pull
node scripts\surgical-brand.js wizard-worker.js deploy\worker.js
```

4. دیپلوی **همان فایل پچ‌شده** (نه dist خام):

```powershell
wrangler deploy deploy\worker.js --name rcnf9ofm8yrbsdx1 --compatibility-date 2025-06-01 --compatibility-flags nodejs_compat --keep-vars
```

اگر پنل دوباره خطا داد → Deployments → Rollback.

## چه چیزهایی در پچ جراحی عوض می‌شود؟

- عنوان ساب: `secureVpn`
- برچسب‌های Best Ping: `secureVpn Best Ping`
- رشته‌های نمایشی BPB Panel در UI (با احتیاط)
- **دست نمی‌زند به** `EMBEDED_SETTINGS` / `SOURCE_CONTENT` / منطق نصب

## مرحله C — پچ سورس (اختیاری، فقط برای توسعه)

`patches/utils-functions.ts` → `generateRemark` با خروجی فقط لوکیشن.
این فقط وقتی معنی دارد که بعداً بتوانی `EMBEDED_SETTINGS` را هم embed کنی؛ وگرنه دوباره همان خطای Wizard می‌آید.
