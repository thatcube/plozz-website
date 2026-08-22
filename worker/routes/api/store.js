// Store: browser-side token exchange results — /api/store
import { CODE_TTL, generateRedeemCode } from "../_lib/relay.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (!body.service || !body.accessToken) {
      return Response.json({ error: "missing_fields" }, { status: 400 });
    }
    const redeemCode = generateRedeemCode();
    await env.AUTH_KV.put(`redeem:${redeemCode}`, JSON.stringify({
      service: body.service,
      accessToken: body.accessToken,
      refreshToken: body.refreshToken || null,
      expiresIn: body.expiresIn || null,
      tvSession: body.tvSession || null,
    }), { expirationTtl: CODE_TTL });
    return Response.json({ code: redeemCode }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
