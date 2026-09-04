# secureVpn-BPB

## واقعیت مهم (BPB v5.1.1)

طبق مستندات رسمی:

> This version can only be deployed using ONE-CLICK online BPB Wizard  
> **manual deployment does not work on this release.**

کد پنل بدون `EMBEDED_SETTINGS` (که فقط Wizard می‌گذارد) بالا نمی‌آید.  
به همین خاطر هر بار `worker.js` پنل را با بیلد/پچ جایگزین کردیم، این خطا آمد:

`can only be installed using BPB Wizard`

### نتیجه
- **پنل را دست نزن** — همان نصب Wizard + Rollback فعلی درست است.
- اسم `secureVpn` را با یک **Worker جدا** روی لینک ساب اعمال می‌کنیم (نه روی خود پنل).

پنل تو:
https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/panel

---

## چه کارهایی از پنل انجام شد

- فقط VLESS / پورت 443 / IPv6 Off / TCP Fast Open Off  
→ تعداد کانفیگ کمتر، پینگ بهتر روی همه نت‌ها

## اسم ساب و کانفیگ = Worker بازنویس

فایل: [`sub-rewriter/worker.js`](sub-rewriter/worker.js)

این Worker:
1. ساب BPB را می‌گیرد
2. اسم هر کانفیگ را تمیز می‌کند → `secureVpn | ...`
3. عنوان پروفایل را `secureVpn` می‌گذارد
4. به کلاینت می‌دهد

راهنما: [`docs/SUB_REWRITER.md`](docs/SUB_REWRITER.md)
