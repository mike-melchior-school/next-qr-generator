import QRCode from "qrcode";

function sanitizeTitle(title: string) {
  return title
    .replace(/[\\/*?:"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Simple YouTube title fetcher (no ytdl-core)
async function fetchYouTubeTitle(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/<title>(.*?)<\/title>/i);
  let title = match ? match[1].replace(" - YouTube", "").trim() : "Unknown_Video";
  return sanitizeTitle(title);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return new Response("Missing ?url=", { status: 400 });

  try {
    const title = await fetchYouTubeTitle(url);
    // const qrDataUrl = await QRCode.toDataURL(url); // will default to png
    const qrDataUrl = await QRCode.toDataURL(url, { type: "image/jpeg", rendererOpts: { quality: 0.9 } });


    return Response.json({ title, qrDataUrl });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
