# 🔒 secureVpn-BPB (Complete Code Customization)

## ریپوهای مرتبط
- فورک سفارشی: https://github.com/MohamadHoseinMaleki/BPB-Worker-Panel
- این ریپو (مستندات + پچ): https://github.com/MohamadHoseinMaleki/secureVpn-BPB

## تغییرات اعمال‌شده در کد

### 1. برند و اسم پروژه
- `_project_` = **secureVpn**
- `_project_SM_` = **securevpn**

### 2. فرمت اسم کانفیگ‌ها (generateRemark)
مثال:
- `☁️ secureVpn-1 | CF-Worker :443`
- `✨ secureVpn-2 | speedtest.net :443`
- `🔹 secureVpn-3 | IPv4 :443`
- `🔷 secureVpn-4 | IPv6 :443 [F]`
- `🔒 secureVpn Best Ping 🚀`

### 3. محدودیت تعداد (حدود ~10-13)
- دامنه + حداکثر 2×IPv4 + 1×IPv6 + 4×Clean IP
- پیش‌فرض: فقط **VLESS** + پورت **443** + **IPv6 خاموش**

### 4. فایل‌های پچ
فولدر `patches/` شامل فایل‌های کامل جایگزین شده است.

### 5. وضعیت کامیت روی فورک
- `src/settings/settings.ts` ✅ کامیت شد
- `src/cores/common.ts` ✅ کامیت شد
- بقیه فایل‌ها: از `patches/` کپی کن به فورک

## Build
```bash
git clone https://github.com/MohamadHoseinMaleki/BPB-Worker-Panel.git
cd BPB-Worker-Panel
# copy remaining patches from secureVpn-BPB/patches into src/...
npm install && npm run build
```
