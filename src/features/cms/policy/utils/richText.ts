/**
 * Tiny, safe formatting for policy pages. No HTML is ever stored or rendered,
 * so nothing a user types can run as code.
 *
 *   ## Heading          bold section heading
 *   ### Sub-heading     bold smaller heading
 *   - item              bullet point
 *   **bold text**       bold
 *   [label](address)    clickable link
 *
 * Old plain-text policies keep working: they simply have none of these marks.
 */

export type Inline =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "link"; text: string; href: string; external: boolean };

export type Block =
  | { type: "heading"; level: 2 | 3; children: Inline[] }
  | { type: "list"; items: Inline[][] }
  | { type: "paragraph"; lines: Inline[][] };

export interface SafeLink {
  href: string;
  external: boolean;
}

/** Only web, mail, phone and on-site addresses are allowed as links. */
export function safeLink(raw: string): SafeLink | null {
  const url = raw.trim();
  if (!url) return null;

  if (/^https?:\/\/\S+$/i.test(url)) return { href: url, external: true };
  if (/^www\.\S+\.\S+$/i.test(url)) return { href: `https://${url}`, external: true };
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(url)) return { href: url, external: true };
  if (/^tel:\+?[\d\s-]+$/i.test(url)) return { href: url.replace(/\s/g, ""), external: true };
  if (/^\/(?!\/)\S*$/.test(url)) return { href: url, external: false };

  return null;
}

const INLINE = /\*\*([^*]+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(line: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;

  for (const m of line.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push({ type: "text", text: line.slice(last, start) });

    if (m[1] !== undefined) {
      out.push({ type: "bold", text: m[1] });
    } else {
      const link = safeLink(m[3]);
      out.push(
        link
          ? { type: "link", text: m[2], ...link }
          : { type: "text", text: m[0] }, // unsafe address: show as plain text
      );
    }
    last = start + m[0].length;
  }

  if (last < line.length) out.push({ type: "text", text: line.slice(last) });
  return out;
}

export function parseRichText(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");

  let paragraph: Inline[][] = [];
  let list: Inline[][] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);

    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        children: parseInline(heading[2]),
      });
    } else if (bullet) {
      flushParagraph();
      list.push(parseInline(bullet[1]));
    } else {
      flushList();
      paragraph.push(parseInline(line));
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}