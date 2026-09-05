# روش قطعی (بدون خطای 502)

از داخل Worker کلودفلر، گرفتن ساب از Worker دیگر روی `workers.dev` اغلب **404** می‌شود.  
از روی ویندوز خودت همان ساب **200** است. پس بازنویسی را روی ویندوز انجام بده.

## روش A — فایل محلی در کلاینت

```powershell
cd C:\Users\PARSE\Documents\secureVpn-BPB
git pull

.\scripts\rewrite-sub.ps1 -SubUrl "https://rcnf9ofm8yrbsdx1.instagram-monitor-bot.workers.dev/4g3vkGn6-0kuc/sub/raw?app=xray"
```

فایل ساخته می‌شود:

`output\securevpn-sub.txt`

در کلاینت (Happ / v2rayNG) اگر پشتیبانی از import فایل دارد، همان را اضافه کن.

## روش B — همان Worker را استاتیک کن (لینک ساب ثابت)

1. اسکریپت بالا را اجرا کن
2. محتوای `output\securevpn-sub.txt` را باز کن و کپی کن
3. در Cloudflare → Worker `autumn-waterfall-dce9` → Edit code این کد را بگذار:

```js
const BODY = `اینجا_محتوای_فایل_را_پیست_کن`;

export default {
  async fetch() {
    return new Response(BODY, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Profile-Title": "base64:" + btoa("secureVpn"),
        "Cache-Control": "no-store",
      },
    });
  },
};
```

4. Deploy

لینک ساب برای مشتری فقط این می‌شود (بدون `?url=`):

```text
https://autumn-waterfall-dce9.instagram-monitor-bot.workers.dev/
```

هر وقت کانفیگ پنل عوض شد، دوباره `rewrite-sub.ps1` را بزن و محتوا را در Worker عوض کن.
