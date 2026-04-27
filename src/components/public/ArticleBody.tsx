import sanitizeHtml from "sanitize-html";

const ALLOWED: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "strong", "em", "u", "s",
    "h2", "h3", "h4",
    "ul", "ol", "li",
    "a", "blockquote", "hr", "br",
    "img", "figure", "figcaption",
    "code", "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["https", "http"],
};

export default function ArticleBody({ html }: { html: string }) {
  const clean = sanitizeHtml(html, ALLOWED);
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-brand-red"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
