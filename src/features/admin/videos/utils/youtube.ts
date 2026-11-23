const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Returns the 11-character video id from any common YouTube link, or null. */
export function getYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | null = null;

  if (host === "youtu.be") {
    id = parts[0] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parts[0] === "watch") id = url.searchParams.get("v");
    else if (["shorts", "embed", "live", "v"].includes(parts[0])) id = parts[1] ?? null;
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}

export function youtubeThumb(
  id: string,
  quality: "maxresdefault" | "hqdefault" = "maxresdefault",
): string {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

/** The short link stored in Firestore. */
export function youtubeShortLink(id: string): string {
  return `https://youtu.be/${id}`;
}