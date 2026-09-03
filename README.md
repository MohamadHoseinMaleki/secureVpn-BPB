# 🔒 secureVpn - Custom BPB Panel

نسخه سفارشی‌شده از **BPB Worker Panel** برای **secureVpn**

## تغییرات اصلی

- نام کانفیگ‌ها با پیشوند **secureVpn** + پرچم/لوکیشن خودکار
- کاهش تعداد کانفیگ به حدود ۱۰–۱۳ تا بهترین‌ها (پینگ پایین و کار روی همه نت‌ها)
- حذف متن‌های تصادفی و BPB از remarkها

## نحوه استفاده (ساده‌ترین راه)

چون نسخه رسمی BPB از Wizard نصب می‌شه و سورس obfuscate شده، بهترین روش عملی اینه:

### روش ۱: تنظیمات پنل فعلی (بدون فورک کامل)

۱. وارد پنل خودت شو  
۲. این تنظیمات رو اعمال کن:

**Common**
- Enabling IPv6 → **خاموش**

**VLESS - Trojan**
- فقط **VLESS** فعال باشه (Trojan خاموش)
- Portها: فقط ۴۴۳ و حداکثر ۱–۲ پورت TLS دیگه
- Clean IP/Domains: فقط ۳–۵ تا بهترین IP با latency پایین
- Proxy IP: ۱–۳ تا Proxy IP خوب

بعد Apply بزن و ساب رو رفرش کن. تعداد کانفیگ‌ها به حدود ۱۰–۱۳ تا می‌رسه.

### روش ۲: تغییر remarkها (اسم کانفیگ)

تابع اصلی تولید اسم کانفیگ اینجاست:

`src/cores/utils.ts` → تابع `generateRemark`

نسخه سفارشی برای secureVpn:

```ts
export function generateRemark(
    index: number,
    port: number,
    address: string,
    protocol: string,
    domain: string,
    isFragment: boolean,
    isChain: boolean
): string {
    const { cleanIPs, customCdnAddrs, customDomain, upstreamParams: { upstreamServer } } = getSettings();

    const chainSign = isChain ? '🔗 ' : '';
    const protoSign = protocol === _VL_ ? 'VLESS' : 'Trojan';

    const fragmentSign = isFragment ? 'F ' : '';
    const customDomainSign = domain === customDomain ? 'D ' : '';
    const customCdnSign = customCdnAddrs.includes(address) ? 'C ' : '';
    const configType = `${fragmentSign}${customDomainSign}${customCdnSign}`;

    let addressType = '';
    if (cleanIPs.includes(address)) addressType = 'Clean';
    else if (isDomain(address)) addressType = 'Domain';
    else if (isIPv4(address)) addressType = 'IPv4';
    else if (isIPv6(address)) addressType = 'IPv6';

    // پرچم و لوکیشن ساده (بعداً می‌تونی کامل‌تر کنی)
    const flag = getSimpleFlag(address);

    if (address === upstreamServer) {
        return `${flag} secureVpn ${index} | Upstream ${chainSign}${protoSign}`;
    }

    return `${flag} secureVpn ${index} | ${addressType} : ${port} ${chainSign}${configType}`;
}

function getSimpleFlag(address: string): string {
    // فعلاً ساده — بعداً می‌تونی بر اساس IP واقعی پرچم کشور بذاری
    if (address.includes('workers.dev') || isDomain(address)) return '🌐';
    if (isIPv6(address)) return '🔷';
    return '🔹';
}
```

و برای Best Ping و بقیه:

- `💦 Best Ping` → `🔒 secureVpn Best Ping 🚀`
- `💦 Smart Fragment` → `🔒 secureVpn Smart Fragment 🧠`
- Profile-Title ساب → `secureVpn`

## فایل‌های مهم برای تغییر

| فایل | توضیح |
|------|--------|
| `src/cores/utils.ts` | تابع `generateRemark` |
| `src/cores/xray/configs.ts` | نام Best Ping و Smart Fragment و Warp |
| `src/cores/common.ts` | Profile-Title ساب Raw |
| جاهای دیگه که `_project_` یا `💦` دارن | اسم پروژه |

## نکته مهم

نسخه ۵.۱.۱ فقط با **BPB Wizard** نصب می‌شه و سورس داخل Worker obfuscate شده.  
برای داشتن نسخه کاملاً سفارشی باید:

1. این ریپو رو فورک کنی یا کلون کنی
2. تغییرات بالا رو اعمال کنی
3. `npm install && npm run build` بزنی
4. فایل `worker.js` ساخته‌شده رو دستی روی Cloudflare Worker بذاری

یا صبر کن تا نسخه کامل build-شده اینجا آماده بشه.

## وضعیت فعلی

- ریپو ساخته شد
- راهنما و کد تغییر remark آماده است
- برای build کامل و دیپلوی خودکار بعداً ادامه می‌دیم

---

ساخته‌شده برای **secureVpn**  
بر اساس [BPB-Worker-Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel)
