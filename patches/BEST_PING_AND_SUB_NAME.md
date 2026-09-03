# تغییرات اجباری برای اسم ساب + Best Ping

## 1) اسم سابسکریپشن (Profile-Title)

فایل: `src/cores/common.ts`

پیدا کن:
```ts
'Profile-Title': `base64:${base64EncodeUtf8(`💦 ${_project_} Raw`)}`,
```

بگذار:
```ts
'Profile-Title': `base64:${base64EncodeUtf8(`secureVpn`)}`,
```

هر جای دیگر که `Profile-Title` یا عنوان ساب با BPB ساخته می‌شود را هم به `secureVpn` تغییر بده.

## 2) ثابت پروژه

فایل: `src/settings/settings.ts` (یا جایی که `_project_` تعریف شده)

```ts
_project_: 'secureVpn',
_project_SM_: 'secureVpn',
```

(اگر `atob('QlBC')` دیدی همان BPB است → عوض کن)

## 3) Best Ping remarks

فایل‌ها:
- `src/cores/xray/configs.ts`
- `src/cores/clash/configs.ts`
- `src/cores/sing-box/configs.ts`

جایگزین‌ها:

| قبل | بعد |
|------|------|
| `💦 ${chainSign}Best Ping ${configType}🚀` | `secureVpn Best Ping` |
| `💦 Best Ping` | `secureVpn Best Ping` |
| `💦 Warp... Best Ping` | `Warp Best Ping` |
| `💦 WoW... Best Ping` | `WoW Best Ping` |

## 4) generateRemark + getConfigAddresses

از `patches/utils-functions.ts` کپی کن داخل `src/cores/utils.ts`
