// MAL: Callback — /auth/mal/callback
import { BASE_URL, CODE_TTL, generateRedeemCode, successPage, errorPage } from "../../_lib/relay.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response(errorPage("Missing authorization code."), {
      status: 400, headers: { "Content-Type": "text/html" }
    });
  }

  // Retrieve session
  const sessionData = await env.AUTH_KV.get(`session:${state}`, "json");
  if (!sessionData) {
    return new Response(errorPage("Session expired. Please try again from your TV."), {
      status: 410, headers: { "Content-Type": "text/html" }
    });
  }

  // Exchange code for token
  const tokenResp = await fetch("https://myanimelist.net/v1/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.MAL_CLIENT_ID,
      client_secret: env.MAL_CLIENT_SECRET,
      code,
      code_verifier: sessionData.codeVerifier,
      redirect_uri: `${BASE_URL}/auth/mal/callback`,
    }),
  });

  if (!tokenResp.ok) {
    const errBody = await tokenResp.text();
    return new Response(errorPage(`Token exchange failed: ${errBody}`), {
      status: 502, headers: { "Content-Type": "text/html" }
    });
  }

  const tokens = await tokenResp.json();

  // Generate short redeem code and store tokens, bound to the TV's session.
  const redeemCode = generateRedeemCode();
  await env.AUTH_KV.put(`redeem:${redeemCode}`, JSON.stringify({
    service: "mal",
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
    tvSession: sessionData.tvSession || null,
  }), { expirationTtl: CODE_TTL });

  // Clean up session
  await env.AUTH_KV.delete(`session:${state}`);

  return new Response(successPage(redeemCode, "mal"), {
    headers: { "Content-Type": "text/html" }
  });
}
