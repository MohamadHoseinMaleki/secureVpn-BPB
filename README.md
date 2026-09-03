# secureVpn

**یک ریپو — همه چیز اینجاست.**

https://github.com/MohamadHoseinMaleki/secureVpn-BPB

سفارشی‌سازی BPB برای secureVpn:
- اسم کانفیگ: `secureVpn-1 | CF-Worker :443` + فلگ لوکیشن
- تعداد کانفیگ حدود ۱۰–۱۳ (نه ۲۴)
- پچ برند + دیپلوی خودکار با GitHub Actions

---

## ساختار

```
secureVpn-BPB/
├── patches/          ← پچ‌های سورس (generateRemark + محدودیت آدرس)
├── scripts/          ← پچ برند روی worker.js بیلد‌شده
├── deploy/           ← wrangler + worker.js نهایی
├── docs/             ← راهنما
└── .github/workflows ← دیپلوی خودکار
```

---

## کار سریع

### ۱) نصب اول پنل (یک‌بار)
https://wizard.bpb-panel.workers.dev

### ۲) Secrets در همین ریپو (یک‌بار)
Settings → Secrets → Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CF_WORKER_NAME`  ← اسم Worker پنلت

### ۳) worker.js

```bash
git clone https://github.com/MohamadHoseinMaleki/secureVpn-BPB.git
cd secureVpn-BPB

# فایل بیلد/خروجی خودت:
node scripts/patch-branding.js /path/to/worker.js deploy/worker.js

git add deploy/worker.js
git commit -m "deploy worker"
git push
```

تب Actions → Deploy خودکار روی Cloudflare.

---

## تنظیمات پنل (پینگ بهتر — همه نت‌ها)

| مورد | مقدار |
|------|--------|
| Protocol | فقط VLESS |
| Port | فقط 443 |
| IPv6 | Off |
| TCP Fast Open | **Off** |
| Clean IP | ۲–۴ تا |
| Fingerprint | chrome / randomized |

---

## پچ‌های کد

- `patches/utils-functions.ts` → `generateRemark` + `getConfigAddresses`
- `scripts/patch-branding.js` → BPB → secureVpn روی فایل بیلد

جزئیات دیپلوی: [docs/AUTO_DEPLOY.md](docs/AUTO_DEPLOY.md)
