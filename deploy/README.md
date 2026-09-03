# دیپلوی خودکار secureVpn

## واقعیت مهم درباره BPB v5

نسخه ۵.x **اولین نصب** را فقط از طریق **BPB Wizard** قبول می‌کند.
بعد از نصب اول، می‌توانی Worker را با این پکیج **خودکار آپدیت** کنی.

## مسیر پیشنهادی (یک‌بار دستی، بعد خودکار)

### مرحله ۱ — نصب اول (فقط یک بار)
1. برو به: https://wizard.bpb-panel.workers.dev
2. پنل را با Cloudflare خودت بساز
3. اسم Worker و دامنه را یادداشت کن

### مرحله ۲ — Secrets در GitHub (فقط یک بار)
در ریپو `secureVpn-BPB` برو:
**Settings → Secrets and variables → Actions → New repository secret**

این‌ها را اضافه کن:

| Secret | توضیح |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | از Cloudflare → My Profile → API Tokens → Edit Cloudflare Workers |
| `CLOUDFLARE_ACCOUNT_ID` | از سمت راست Dashboard کلودفلر |
| `CF_WORKER_NAME` | اسم دقیق Worker پنل (مثلاً `rcnf9ofm8yrbsdx1` یا هرچی ساختی) |

### مرحله ۳ — worker.js را بگذار
فایل بیلد‌شده را اینجا کپی کن:

```text
deploy/worker.js
```

(بعد از `npm run build` در فورک، یا همان خروجی پچ‌شده)

### مرحله ۴ — Push = Deploy خودکار
هر بار که روی `main` پوش کنی (یا workflow را دستی Run کنی):

```bash
git add deploy/worker.js
git commit -m "update worker"
git push
```

GitHub Actions با Wrangler روی Cloudflare دیپلوی می‌کند.

## دیپلوی دستی بدون Actions (اختیاری)

```bash
cd deploy
npm i -g wrangler
wrangler login
wrangler deploy --name YOUR_WORKER_NAME
```

## TCP Fast Open
در پنل **خاموش** بگذار (پایدارتر روی همه نت‌های ایران).
