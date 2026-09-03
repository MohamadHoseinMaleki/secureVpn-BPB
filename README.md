# 🔒 secureVpn-BPB

سفارشی‌سازی کامل پنل BPB برای **secureVpn**:
- اسم کانفیگ‌ها: `secureVpn` + لوکیشن/فلگ خودکار
- حدود **۱۰–۱۳** کانفیگ بهتر (نه ۲۴ تا)
- بهینه‌سازی برای پینگ پایین روی **همه نت‌ها**
- **دیپلوی خودکار** با GitHub Actions + Wrangler

ریپو: https://github.com/MohamadHoseinMaleki/secureVpn-BPB

---

## واقعیت مهم (بخوان)

**BPB v5.1.1** اولین نصب را فقط از **Wizard** می‌پذیرد:
https://wizard.bpb-panel.workers.dev

بعد از نصب اول، با این ریپو می‌توانی Worker را **خودکار آپدیت** کنی (بدون کپی‌پیست دستی در داشبورد).

---

## راه‌اندازی سریع دیپلوی خودکار

### ۱) نصب اول پنل (یک‌بار)
با Wizard پنل را بساز و اسم Worker را یادداشت کن.

### ۲) Secrets در GitHub (یک‌بار)
`Settings → Secrets and variables → Actions`:

| Secret | مقدار |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | توکن با دسترسی Workers |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID کلودفلر |
| `CF_WORKER_NAME` | اسم Worker پنل |

### ۳) گذاشتن worker.js
فایل بیلد‌شده/پچ‌شده را بگذار:

```bash
# اگر از قبل worker.js داری:
node scripts/patch-branding.js /path/to/your/worker.js deploy/worker.js

git add deploy/worker.js
git commit -m "deploy: secureVpn worker"
git push
```

بعد از push، تب **Actions** را ببین — باید Deploy سبز شود.

جزئیات: [docs/AUTO_DEPLOY.md](docs/AUTO_DEPLOY.md) و [deploy/README.md](deploy/README.md)

---

## تغییرات کد

| مورد | وضعیت |
|------|--------|
| برند `secureVpn` | پچ + اسکریپت branding |
| `generateRemark` (اسم کانفیگ) | `patches/utils-functions.ts` |
| محدودیت تعداد آدرس | همان پچ |
| Profile-Title ساب | secureVpn |
| TCP Fast Open | در پنل **خاموش** |

### فرمت اسم نمونه
- `☁️ secureVpn-1 | CF-Worker :443`
- `✨ secureVpn-2 | speedtest.net :443`
- `🔒 secureVpn Best Ping 🚀`

---

## TCP Fast Open

**خاموش بگذار.** روی خیلی از نت‌های ایران پایداری بهتری می‌دهد.

---

## ساختار ریپو

```
secureVpn-BPB/
├── deploy/
│   ├── wrangler.toml      # تنظیمات Wrangler
│   ├── worker.js          # (تو اضافه می‌کنی — بعد از بیلد/پچ)
│   └── README.md
├── scripts/
│   ├── patch-branding.js  # جایگزینی BPB → secureVpn روی فایل بیلد
│   └── apply-all.sh
├── patches/
│   └── utils-functions.ts # generateRemark + getConfigAddresses
├── custom/
├── docs/
│   └── AUTO_DEPLOY.md
└── .github/workflows/
    └── deploy.yml         # دیپلوی خودکار با push
```

---

## نکته برای مشتری / ربات

1. یک‌بار Wizard → پنل آماده
2. worker سفارشی از این ریپو دیپلوی شود
3. تنظیمات پنل (VLESS، ۴۴۳، IPv6 off، Clean IP کم)
4. ربات فقط لینک ساب `secureVpn` را به مشتری بدهد
