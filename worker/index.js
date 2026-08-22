/**
 * The site's one Worker.
 *
 * Static assets are served ahead of this script, so it only ever runs for a
 * path that isn't a file in dist/ — which is exactly the set of auth-relay
 * routes below. Everything else is handled before the request reaches here.
 *
 * These routes used to be Pages Functions, where the file's path in a
 * functions/ directory was its URL and an exported onRequestGet was its GET
 * handler. Workers have one entry point instead, so the mapping that used to
 * be implied by the directory tree is written out here.
 *
 * The handlers themselves are unchanged. They only ever destructured
 * `{ request, env }` off the Pages context, so passing an object with those
 * two fields keeps them working as they are — and a token relay with live
 * OAuth callbacks registered at two providers is not the place to take
 * liberties.
 */
import * as anilist from "./routes/anilist.js";
import * as myanimelist from "./routes/myanimelist.js";
import * as anilistCallback from "./routes/auth/anilist/callback.js";
import * as malCallback from "./routes/auth/mal/callback.js";
import * as store from "./routes/api/store.js";
import * as redeem from "./routes/api/redeem.js";

/** Path to module, matching the old file-based routes exactly. */
const ROUTES = {
  "/anilist": anilist,
  "/myanimelist": myanimelist,
  "/auth/anilist/callback": anilistCallback,
  "/auth/mal/callback": malCallback,
  "/api/store": store,
  "/api/redeem": redeem,
};

/** Method to the export Pages would have called for it. */
const HANDLERS = {
  GET: "onRequestGet",
  POST: "onRequestPost",
  OPTIONS: "onRequestOptions",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    /* Pages treated /anilist and /anilist/ as the same route. Trailing slashes
       are stripped so a client that adds one still lands somewhere. */
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const route = ROUTES[path];

    if (route) {
      const handler = route[HANDLERS[request.method]];
      if (handler) return handler({ request, env, ctx });

      /* A known path with an unsupported method is a 405, not a 404: the
         difference matters to anything reading the response programmatically. */
      const allowed = Object.entries(HANDLERS)
        .filter(([, name]) => route[name])
        .map(([method]) => method);
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: allowed.join(", ") },
      });
    }

    /* Not a relay route and not a file. Hand back the site's own 404 page so a
       mistyped URL looks like the rest of the site rather than a bare string,
       and keep the status honest for anything crawling it.

       Asked for by its canonical path rather than /404.html: html_handling
       redirects the extension form to the extensionless one, so fetching the
       file by name returns a redirect whose body is empty — which is how this
       first shipped a blank 404 carrying a stray Location header. */
    const page = await env.ASSETS.fetch(new URL("/404", url));

    /* Only the content headers travel. Copying the asset response wholesale
       would bring anything the assets layer attached for a 200 along with it. */
    const headers = new Headers();
    const type = page.headers.get("content-type");
    if (type) headers.set("content-type", type);

    return new Response(page.body, { status: 404, headers });
  },
};
