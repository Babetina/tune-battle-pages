export async function onRequestGet({ request, params }) {
  const pathSegments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  if (!pathSegments.length) {
    return new Response("Not found", { status: 404 });
  }

  const deezerPath = pathSegments.map(segment => encodeURIComponent(segment)).join("/");
  const requestUrl = new URL(request.url);
  const upstreamUrl = `https://api.deezer.com/${deezerPath}${requestUrl.search}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" }
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch {
    return new Response(JSON.stringify({
      error: { message: "Deezer service is temporarily unavailable" }
    }), {
      status: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}
