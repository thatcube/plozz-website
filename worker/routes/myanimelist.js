// MAL: Start auth — /myanimelist
import { BASE_URL, CODE_TTL, generateCodeVerifier, randomString } from "./_lib/relay.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const codeVerifier = generateCodeVerifier();
  const sessionId = randomString(32);
  // The TV passes its own 32-char session so the redeem code is bound to it.
  const tvSession = url.searchParams.get("s") || null;

  // Store PKCE verifier in KV (needed for callback)
  await env.AUTH_KV.put(`session:${sessionId}`, JSON.stringify({
    service: "mal",
    codeVerifier,
    tvSession,
    createdAt: Date.now(),
  }), { expirationTtl: CODE_TTL });

  // Redirect to MAL authorize
  const malAuthURL = new URL("https://myanimelist.net/v1/oauth2/authorize");
  malAuthURL.searchParams.set("response_type", "code");
  malAuthURL.searchParams.set("client_id", env.MAL_CLIENT_ID);
  malAuthURL.searchParams.set("code_challenge", codeVerifier);
  malAuthURL.searchParams.set("code_challenge_method", "plain");
  malAuthURL.searchParams.set("redirect_uri", `${BASE_URL}/auth/mal/callback`);
  malAuthURL.searchParams.set("state", sessionId);

  return Response.redirect(malAuthURL.toString(), 302);
}
