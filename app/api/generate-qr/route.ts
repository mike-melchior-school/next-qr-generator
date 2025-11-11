import QRCode from "qrcode";

function sanitizeTitle(title: string) {
    return title
        .replace(/[\\/*?:"<>|]/g, "_")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
}

async function fetchYouTubeTitle(url: string) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedUrl);
  if (!res.ok) throw new Error("Failed to fetch title from oEmbed");
  const data = await res.json();
  return sanitizeTitle(data.title || "Unknown_Video");
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) return new Response("Missing ?url=", { status: 400 });

    try {
        const title = await fetchYouTubeTitle(url);
        const qrDataUrl = await QRCode.toDataURL(url); // will default to png

        return Response.json({ title, qrDataUrl });
    } catch (err: any) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
