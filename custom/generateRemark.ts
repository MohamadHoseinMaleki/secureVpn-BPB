// نسخه سفارشی generateRemark برای secureVpn
// این فایل رو داخل src/cores/utils.ts جایگزین تابع اصلی کن

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
    const configType = `${fragmentSign}${customDomainSign}${customCdnSign}`.trim();

    let addressType = '';
    if (cleanIPs.includes(address)) addressType = 'Clean';
    else if (isDomain(address)) addressType = 'Domain';
    else if (isIPv4(address)) addressType = 'IPv4';
    else if (isIPv6(address)) addressType = 'IPv6';

    const flag = getSimpleFlag(address);

    if (address === upstreamServer) {
        return `${flag} secureVpn ${index} | Upstream ${chainSign}${protoSign}`;
    }

    const typePart = configType ? ` ${configType}` : '';
    return `${flag} secureVpn ${index} | ${addressType} : ${port}${typePart}${chainSign ? ' ' + chainSign : ''}`;
}

function getSimpleFlag(address: string): string {
    if (address.includes('workers.dev') || isDomain(address)) return '🌐';
    if (isIPv6(address)) return '🔷';
    return '🔹';
}

// مثال خروجی:
// 🌐 secureVpn 1 | Domain : 443
// 🔹 secureVpn 2 | IPv4 : 443
// 🔷 secureVpn 3 | IPv6 : 443 F
// 🔗 secureVpn 4 | Clean : 443
