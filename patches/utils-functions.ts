// فقط برای توسعهٔ سورس — روی BPB v5 بدون EMBEDED_SETTINGS دیپلوی نکن.
// خروجی اسم کانفیگ: فقط لوکیشن

export async function getConfigAddresses(domain: string, isFragment: boolean): Promise<string[]> {
    const { enableIPv6, customCdnAddrs, cleanIPs } = getSettings();
    const { ipv4, ipv6 } = await resolveDNS(domain, !enableIPv6);

    const limitedClean = cleanIPs.slice(0, 4);
    const limitedV4 = ipv4.slice(0, 2);
    const limitedV6 = enableIPv6 ? ipv6.slice(0, 1).map((ip: string) => `[${ip}]`) : [];

    const addrs = [domain, ...limitedV4, ...limitedV6, ...limitedClean];
    const seen = new Set<string>();
    const unique = addrs.filter((a) => {
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
    const { cleanIPs, customCdnAddrs, upstreamParams: { upstreamServer } } = getSettings();

    if (address === upstreamServer) return isChain ? "🔗 Upstream" : "Upstream";

    if (cleanIPs.includes(address) || customCdnAddrs.includes(address)) {
        if (isDomain(address)) return `✨ ${address.replace(/^www\./, "")}`;
        return "✨ Clean IP";
    }

    if (isDomain(address)) {
        if (address.includes("workers.dev") || address.includes("pages.dev")) return "☁️ Cloudflare";
        return `🌍 ${address.split(".")[0] || address}`;
    }

    if (isIPv6(address)) return "🔷 IPv6";
    if (isIPv4(address)) return "🔹 IPv4";
    return `🌐 ${index}`;
}
