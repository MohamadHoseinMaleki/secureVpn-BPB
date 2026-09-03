# دیپلوی خودکار secureVpn — راهنمای کامل

## محدودیت BPB v5.1.1

طبق RELEASE رسمی:

> This version can only be deployed using ONE-CLICK online BPB Wizard  
> manual deployment ... do not work on this release.

یعنی:
- **نصب اول** → فقط Wizard
- **آپدیت بعدی Worker** → با این ریپو + Wrangler/Actions ممکن است

اگر بعد از آپدیت Worker پنل خراب شد، از History کلودفلر نسخه قبل را برگردان.

## Secrets لازم (یک‌بار)

1. Cloudflare API Token با دسترسی Edit Workers
2. Account ID
3. اسم دقیق Worker پنل

در GitHub:
`Settings → Secrets → Actions`

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CF_WORKER_NAME`

## جریان کار

```
Wizard (یک‌بار) → پنل بالا می‌آید
        ↓
سورس/پچ secureVpn → build → deploy/worker.js
        ↓
git push → GitHub Actions → wrangler deploy
        ↓
پنل با اسم secureVpn و تعداد کمتر کانفیگ
```

## تنظیمات پنل برای پینگ بهتر (همه نت‌ها)

| تنظیم | مقدار |
|--------|--------|
| Protocol | فقط VLESS |
| Ports | فقط 443 |
| IPv6 | Off |
| TCP Fast Open | **Off** |
| Clean IP | ۲ تا ۴ تا تست‌شده |
| Fingerprint | chrome / randomized |
| Fragment | فقط اگر نت خاص لازم داشت |

## اسم کانفیگ‌ها

با پچ `generateRemark`:
- `secureVpn-1 | CF-Worker :443`
- `secureVpn Best Ping`

با `patch-branding.js` روی فایل بیلد:
- جایگزینی رشته‌های BPB / Best Ping باقی‌مانده
