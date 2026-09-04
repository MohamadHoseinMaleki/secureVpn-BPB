# نصب Worker بازنویس ساب (secureVpn)

پنل BPB دست‌نخورده می‌ماند. فقط یک Worker **جدید و کوچک** می‌سازی.

## ۱) لینک ساب خام پنل را بردار

از پنل یک لینک ساب بگیر (مثلاً Normal / Raw برای v2rayNG).

مثال شکل:
```text
https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/sub/...
```

کل URL را کپی کن.

## ۲) Worker جدید در Cloudflare

1. Workers & Pages → **Create** → Worker
2. اسم مثلاً: `securevpn-sub`
3. Edit code → **همه کد پیش‌فرض را پاک کن**
4. محتوای فایل `sub-rewriter/worker.js` را Paste کن
5. Deploy

## ۳) لینک نهایی برای مشتری / ربات

```text
https://securevpn-sub.<ساب‌دامین-تو>.workers.dev/?url=ENCODED_BPB_SUB_URL
```

`ENCODED_BPB_SUB_URL` = لینک ساب پنل که با `encodeURIComponent` کد شده.

### ساخت سریع در مرورگر (Console)

```js
const sub = "اینجا_لینک_ساب_پنل";
console.log("https://securevpn-sub.YOUR_SUBDOMAIN.workers.dev/?url=" + encodeURIComponent(sub));
```

یا در PowerShell:

```powershell
$sub = "لینک_ساب_پنل"
$base = "https://securevpn-sub.YOUR_SUBDOMAIN.workers.dev"
Write-Output "$base/?url=$([uri]::EscapeDataString($sub))"
```

## ۴) تست

همان لینک نهایی را در v2rayNG / Streisand اضافه کن.  
باید ببینی:
- اسم پروفایل/ساب: **secureVpn**
- اسم کانفیگ‌ها کوتاه‌تر با پیشوند secureVpn

## نکات

- اگر ساب base64 باشد، اسکریپت خودش decode/encode می‌کند.
- پنل و KV و Wizard دست نمی‌خورند.
- هر وقت کانفیگ پنل عوض شد، همان لینک بازنویس را رفرش کن.
