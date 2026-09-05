/**
 * secureVpn Subscription Rewriter
 * Usage: https://YOUR_WORKER.workers.dev/?url=<encoded-sub-url>
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
      subUrl.hash = ""; // fragment is client-only; never send to origin
    } catch {
      return new Response("Invalid url param", { status: 400 });
    }

    if (subUrl.protocol !== "https:" && subUrl.protocol !== "http:") {
      return new Response("Only http/https subscriptions allowed", { status: 400 });
    }

    const cleanTarget = subUrl.toString();
    const ua =
      request.headers.get("User-Agent") ||
      "v2rayNG/1.10.23";

    const { text, status, via } = await fetchSubscription(cleanTarget, ua);

    if (text == null) {
      return new Response(
        [
          "Failed to fetch subscription",
          "upstream_status: " + status,
          "via: " + via,
          "target: " + cleanTarget,
        ].join("\n"),
        { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const { lines, wasBase64 } = normalizeToLines(text);
    const rewritten = lines.map((line, i) => rewriteLine(line, i + 1)).filter(Boolean);
    let body = rewritten.join("\n");
    if (wasBase64) {
      body = base64Encode(body);
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    headers.set("Profile-Title", "base64:" + base64Encode(PROFILE_NAME));
    headers.set("Content-Disposition", 'attachment; filename="secureVpn.txt"');
    headers.set("X-Rewriter-Via", via);

    return new Response(body, { status: 200, headers });
  },
};

async function fetchSubscription(target, ua) {
  // 1) Direct
  let r = await tryFetch(target, ua);
  if (r.ok && r.text && r.text.length > 20) {
    return { text: r.text, status: r.status, via: "direct" };
  }

  // 2) Fallback proxies (worker-to-workers.dev often returns 404)
  const proxies = [
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(target),
    "https://corsproxy.io/?" + encodeURIComponent(target),
  ];

  for (const p of proxies) {
    r = await tryFetch(p, ua);
    if (r.ok && r.text && r.text.length > 20 && !looksLikeHtmlError(r.text)) {
      return { text: r.text, status: r.status, via: p.split("?")[0] };
    }
  }

  return { text: null, status: r?.status ?? 0, via: "all-failed" };
}

async function tryFetch(url, ua) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": ua,
        Accept: "*/*",
      },
      redirect: "follow",
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch (e) {
    return { ok: false, status: 0, text: String(e) };
  }
}

function looksLikeHtmlError(t) {
  const s = t.slice(0, 200).toLowerCase();
  return s.includes("<html") || s.includes("<!doctype") || s.includes("error code");
}

function normalizeToLines(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { lines: [], wasBase64: false };

  if (/^(vless|vmess|trojan|ss|ssr|wireguard|hysteria):\/\//im.test(trimmed)) {
    return {
      lines: trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
      wasBase64: false,
    };
  }

  try {
    const decoded = base64Decode(trimmed.replace(/\s/g, ""));
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

  const hash = line.indexOf("#");
  if (hash !== -1 && /^(vless|trojan|ss|hy2|hysteria2|tuic):\/\//i.test(line)) {
    const base = line.slice(0, hash);
    const oldRemark = safeDecode(line.slice(hash + 1));
    const name = buildName(oldRemark, index, line);
    return base + "#" + encodeURIComponent(name);
  }

  if (/^vmess:\/\//i.test(line)) {
    try {
      const b64 = line.replace(/^vmess:\/\//i, "").trim();
      const json = JSON.parse(base64Decode(b64));
      const old = json.ps || json.remark || "";
      json.ps = buildName(String(old), index, line);
      return "vmess://" + base64Encode(JSON.stringify(json));
    } catch {
      return line;
    }
  }

  return line;
}

function buildName(oldRemark, index, line) {
  const loc = guessLocation(oldRemark, line);
  return loc ? `secureVpn | ${loc}` : `secureVpn | ${index}`;
}

function guessLocation(remark, line) {
  const r = (remark || "").trim();
  if (/Clean\s*IP/i.test(r)) return "Clean IP";
  if (/\bDomain\b/i.test(r)) return "Cloudflare";
  if (/\bIPv6\b/i.test(r)) return "IPv6";
  if (/\bIPv4\b/i.test(r)) return "IPv4";
  if (/Upstream/i.test(r)) return "Upstream";
  if (/Best\s*Ping/i.test(r)) return "Best Ping";

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

  try {
    const without = line.split("#")[0];
    const hostMatch = without.match(/@([^:?/]+)/) || without.match(/:\/\/([^:?/]+)/);
    if (hostMatch) {
      const host = hostMatch[1];
      if (host.includes("workers.dev") || host.includes("pages.dev")) return "Cloudflare";
      return host.replace(/^www\./, "");
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
    return s;
  }
}

function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(b64) {
  return decodeURIComponent(escape(atob(b64)));
}
