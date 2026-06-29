// AniList: Implicit grant landing page — /auth/anilist/callback
// AniList redirects here with #access_token=... (fragment is JS-only), so we
// serve a page that reads it and POSTs it back to /api/store.
import { anilistImplicitPage } from "../../_lib/relay.js";

export async function onRequestGet() {
  return new Response(anilistImplicitPage(), {
    headers: { "Content-Type": "text/html" }
  });
}
