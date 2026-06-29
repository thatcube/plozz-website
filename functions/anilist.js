// AniList: Start auth (implicit grant) — /anilist
import { CODE_TTL } from "./_lib/relay.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const aniAuthURL = new URL("https://anilist.co/api/v2/oauth/authorize");
  aniAuthURL.searchParams.set("client_id", env.ANILIST_CLIENT_ID);
  aniAuthURL.searchParams.set("response_type", "token");

  // AniList's redirect_uri is fixed, so the TV session can't ride the query.
  // Stash it in a short-lived same-domain cookie the callback page reads back.
  const tvSession = url.searchParams.get("s");
  const headers = { Location: aniAuthURL.toString() };
  if (tvSession && /^[A-Za-z0-9]{8,64}$/.test(tvSession)) {
    headers["Set-Cookie"] =
      `tv_session=${tvSession}; Max-Age=${CODE_TTL}; Path=/; Secure; SameSite=Lax`;
  }
  return new Response(null, { status: 302, headers });
}
