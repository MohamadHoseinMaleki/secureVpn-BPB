# secureVpn-BPB

**تنها ریپوی این پروژه:** https://github.com/MohamadHoseinMaleki/secureVpn-BPB

همه چیز همین‌جاست (پچ، دیپلوی، اسکریپت، مستندات). ریپوی دومی وجود ندارد.

---

## چی داخلشه

| بخش | مسیر |
|------|------|
| پچ اسم کانفیگ‌ها (`generateRemark`) | `patches/utils-functions.ts` |
| پچ برند روی worker بیلد‌شده | `scripts/patch-branding.js` |
| دیپلوی خودکار | `.github/workflows/deploy.yml` + `deploy/` |
| راهنمای دیپلوی | `docs/AUTO_DEPLOY.md` |

---

## نصب و دیپلوی (خلاصه)

1. **نصب اول پنل** فقط با Wizard: https://wizard.bpb-panel.workers.dev  
   (محدودیت رسمی BPB v5)

2. در GitHub این Secrets را بگذار:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CF_WORKER_NAME`

3. فایل `worker.js` را پچ کن و بگذار داخل `deploy/`:

```bash
git clone https://github.com/MohamadHoseinMaleki/secureVpn-BPB.git
cd secureVpn-BPB
node scripts/patch-branding.js /path/to/worker.js deploy/worker.js
git add deploy/worker.js
git commit -m "deploy worker"
git push
```

بعد از push، تب Actions دیپلوی را انجام می‌دهد.

جزئیات: [docs/AUTO_DEPLOY.md](docs/AUTO_DEPLOY.md)

---

## تنظیمات پنل برای پینگ بهتر

- Protocol: فقط VLESS
- Port: فقط 443
- IPv6: Off
- **TCP Fast Open: Off**
- Clean IP: ۲–۴ تا
- Fingerprint: chrome یا randomized

---

## اسم کانفیگ‌ها (هدف)

- `secureVpn-1 | CF-Worker :443`
- `secureVpn Best Ping`
- عنوان ساب: `secureVpn`
