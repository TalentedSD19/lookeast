export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-brand-red"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
