// Redeem: TV calls this to get the token — /api/redeem
import { MAX_REDEEM_FAILS, FAIL_WINDOW } from "../_lib/relay.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return Response.json({ error: "missing_code" }, { status: 400 });
  }

  // Per-IP throttle: a 4-digit code lives 10 min, so cap guesses per client
  // to keep the 10k space infeasible to enumerate before the code expires.
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const failKey = `fail:${ip}`;
  const fails = parseInt((await env.AUTH_KV.get(failKey)) || "0", 10);
  if (fails >= MAX_REDEEM_FAILS) {
    return Response.json({ error: "too_many_attempts" }, { status: 429 });
  }

  const data = await env.AUTH_KV.get(`redeem:${code.toUpperCase()}`, "json");
  if (!data) {
    await env.AUTH_KV.put(failKey, String(fails + 1), { expirationTtl: FAIL_WINDOW });
    return Response.json({ error: "invalid_or_expired" }, { status: 404 });
  }

  // Session binding: if this code was issued for a specific TV session, the
  // redeeming TV must present the matching 32-char sessionId. A guessed
  // 4-digit code is then useless without also knowing the 32-char session.
  if (data.tvSession) {
    const session = url.searchParams.get("session");
    if (session !== data.tvSession) {
      await env.AUTH_KV.put(failKey, String(fails + 1), { expirationTtl: FAIL_WINDOW });
      return Response.json({ error: "invalid_or_expired" }, { status: 404 });
    }
  }

  // One-time use: delete after retrieval; clear the client's fail counter.
  await env.AUTH_KV.delete(`redeem:${code.toUpperCase()}`);
  await env.AUTH_KV.delete(failKey);

  return Response.json(data, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
