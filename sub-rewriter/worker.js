/**
 * secureVpn Subscription Rewriter
 * Fetches a BPB (or any) subscription and rewrites config names + profile title.
 * Does NOT touch the BPB panel worker.
 *
 * Usage:
 *   https://YOUR_WORKER.workers.dev/?url=<encoded-subscription-url>
 */

const PROFILE_NAME = "secureVpn";

export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);

    if (reqUrl.pathname === "/" && !reqUrl.searchParams.get("url")) {
      return new Response(
        [
          "secureVpn Sub Rewriter",
          "",
          "Use: /?url=ENCODED_SUBSCRIPTION_URL",
          "Example: /?url=https%3A%2F%2Fexample.workers.dev%2Fpath%2Fsub",
        ].join("\n"),
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const target = reqUrl.searchParams.get("url");
    if (!target) {
      return new Response("Missing ?url=", { status: 400 });
    }

    let subUrl;
    try {
      subUrl = new URL(target);
    } catch {
      return new Response("Invalid url param", { status: 400 });
    }

    // Only allow http(s)
    if (subUrl.protocol !== "https:" && subUrl.protocol !== "http:") {
      return new Response("Only http/https subscriptions allowed", { status: 400 });
    }

    let upstream;
    try {
      upstream = await fetch(subUrl.toString(), {
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "secureVpn-rewriter",
          Accept: "*/*",
        },
        cf: { cacheTtl: 60, cacheEverything: false },
      });
    } catch (e) {
      return new Response("Failed to fetch subscription: " + String(e), { status: 502 });
    }

    if (!upstream.ok) {
      return new Response("Upstream status " + upstream.status, { status: 502 });
    }

    const raw = await upstream.text();
    const { lines, wasBase64 } = normalizeToLines(raw);
    const rewritten = lines.map((line, i) => rewriteLine(line, i + 1)).filter(Boolean);
    let body = rewritten.join("\n");
    if (wasBase64) {
      body = btoa(unescape(encodeURIComponent(body)));
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    headers.set(
      "Profile-Title",
      "base64:" + btoa(unescape(encodeURIComponent(PROFILE_NAME)))
    );
    headers.set("Content-Disposition", 'attachment; filename="secureVpn.txt"');

    // Pass through subscription-userinfo if present
    const sui = upstream.headers.get("subscription-userinfo");
    if (sui) headers.set("subscription-userinfo", sui);

    return new Response(body, { status: 200, headers });
  },
};

function normalizeToLines(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [], wasBase64: false };

  // Already looks like share links
  if (/^(vless|vmess|trojan|ss|ssr|wireguard|hysteria):\/\//im.test(trimmed)) {
    return {
      lines: trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
      wasBase64: false,
    };
  }

  // Try base64
  try {
    const decoded = decodeURIComponent(escape(atob(trimmed.replace(/\s/g, ""))));
    if (/^(vless|vmess|trojan|ss):\/\//im.test(decoded) || decoded.includes("://")) {
      return {
        lines: decoded.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
        wasBase64: true,
      };
    }
  } catch {
    /* not base64 */
  }

  return {
    lines: trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
    wasBase64: false,
  };
}

function rewriteLine(line, index) {
  if (!line || line.startsWith("#")) return line;

  // vless/trojan/ss with #remark
  const hash = line.indexOf("#");
  if (hash !== -1 && /^(vless|trojan|ss|hy2|hysteria2|tuic):\/\//i.test(line)) {
    const base = line.slice(0, hash);
    const oldRemark = safeDecode(line.slice(hash + 1));
    const name = buildName(oldRemark, index, line);
    return base + "#" + encodeURIComponent(name);
  }

  // vmess base64 json
  if (/^vmess:\/\//i.test(line)) {
    try {
      const b64 = line.replace(/^vmess:\/\//i, "").trim();
      const json = JSON.parse(decodeURIComponent(escape(atob(b64))));
      const old = json.ps || json.remark || "";
      json.ps = buildName(String(old), index, line);
      const out =
        "vmess://" +
        btoa(unescape(encodeURIComponent(JSON.stringify(json))));
      return out;
    } catch {
      return line;
    }
  }

  return line;
}

function buildName(oldRemark, index, line) {
  const loc = guessLocation(oldRemark, line);
  // User asked: clean names — secureVpn + location only
  return loc ? `secureVpn | ${loc}` : `secureVpn | ${index}`;
}

function guessLocation(remark, line) {
  const r = (remark || "").trim();

  // Common BPB patterns
  // 💦 1. VLESS - Domain : 443
  let m = r.match(/Clean\s*IP/i);
  if (m) return "Clean IP";

  m = r.match(/\bDomain\b/i);
  if (m) return "Cloudflare";

  m = r.match(/\bIPv6\b/i);
  if (m) return "IPv6";

  m = r.match(/\bIPv4\b/i);
  if (m) return "IPv4";

  m = r.match(/Upstream/i);
  if (m) return "Upstream";

  m = r.match(/Best\s*Ping/i);
  if (m) return "Best Ping";

  // If remark already short and useful, strip BPB noise
  let cleaned = r
    .replace(/💦/g, "")
    .replace(/BPB\s*Panel/gi, "")
    .replace(/\bVLESS\b/gi, "")
    .replace(/\bTrojan\b/gi, "")
    .replace(/\bVMESS\b/gi, "")
    .replace(/\d+\./g, "")
    .replace(/\s*-\s*/g, " ")
    .replace(/\s*:\s*\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned && cleaned.length <= 40) return cleaned;

  // Hostname from URL
  try {
    const proto = line.match(/^(vless|trojan|ss):\/\//i);
    if (proto) {
      const without = line.split("#")[0];
      const hostMatch = without.match(/@([^:?/]+)/) || without.match(/:\/\/([^:?/]+)/);
      if (hostMatch) {
        const host = hostMatch[1];
        if (host.includes("workers.dev") || host.includes("pages.dev")) return "Cloudflare";
        return host.replace(/^www\./, "");
      }
    }
  } catch {
    /* ignore */
  }

  return "";
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    try {
      return decodeURIComponent(s.replace(/\+/g, " "));
    } catch {
      return s;
    }
  }
}
