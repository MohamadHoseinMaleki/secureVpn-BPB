export async function getConfigAddresses(domain: string, isFragment: boolean): Promise<string[]> {
    const { enableIPv6, customCdnAddrs, cleanIPs } = getSettings();
    const { ipv4, ipv6 } = await resolveDNS(domain, !enableIPv6);

    // secureVpn: limit addresses so total configs stay ~10-13 on typical settings
    const limitedClean = cleanIPs.slice(0, 4);
    const limitedV4 = ipv4.slice(0, 2);
    const limitedV6 = enableIPv6 ? ipv6.slice(0, 1).map((ip: string) => `[${ip}]`) : [];

    const addrs = [
        domain,
        ...limitedV4,
        ...limitedV6,
        ...limitedClean
    ];

    // dedupe while preserving order
    const seen = new Set<string>();
    const unique = addrs.filter(a => {
        if (!a || seen.has(a)) return false;
        seen.add(a);
        return true;
    });

    return unique.concatIf(!isFragment, customCdnAddrs.slice(0, 2));
}

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

    const tags: string[] = [];
    if (isFragment) tags.push('F');
    if (domain === customDomain) tags.push('D');
    if (customCdnAddrs.includes(address)) tags.push('C');
    const tagStr = tags.length ? ` [${tags.join('')}]` : '';

    let location = 'Global';
    let flag = '🌐';
    if (address === upstreamServer) {
        location = 'Upstream';
        flag = '🔗';
    } else if (cleanIPs.includes(address)) {
        location = isDomain(address) ? address.replace(/^www\./, '') : 'Clean';
        flag = '✨';
    } else if (isDomain(address)) {
        if (address.includes('workers.dev') || address.includes('pages.dev')) {
            location = 'CF-Worker';
            flag = '☁️';
        } else {
            location = address.split('.')[0] || 'Domain';
            flag = '🌍';
        }
    } else if (isIPv6(address)) {
        location = 'IPv6';
        flag = '🔷';
    } else if (isIPv4(address)) {
        location = 'IPv4';
        flag = '🔹';
    }

    const chain = chainSign ? ' 🔗' : '';
    return `${flag} secureVpn-${index} | ${location} :${port}${tagStr}${chain}`;
}
