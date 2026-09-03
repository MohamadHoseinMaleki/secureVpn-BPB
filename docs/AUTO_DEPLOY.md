# دیپلوی خودکار — فقط همین ریپو

ریپو: https://github.com/MohamadHoseinMaleki/secureVpn-BPB

## نکته BPB v5

نصب اول فقط با Wizard.  
آپدیت بعدی Worker با Actions همین ریپو.

## Secrets (یک‌بار در همین ریپو)

| Secret | توضیح |
|--------|--------|
| CLOUDFLARE_API_TOKEN | توکن Edit Workers |
| CLOUDFLARE_ACCOUNT_ID | Account ID |
| CF_WORKER_NAME | اسم Worker پنل |

## جریان

1. Wizard → پنل بالا می‌آید
2. `deploy/worker.js` را بگذار (با `patch-branding.js`)
3. `git push` → Actions دیپلوی می‌کند

## TCP Fast Open

در پنل **خاموش**.
