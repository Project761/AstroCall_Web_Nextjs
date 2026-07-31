/**
 * Server-safe JSON-LD injector. Use in page.js / layout server components.
 */
export default function JsonLd({ data }) {
  if (!data) return null;
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data["@graph"]
      ? data
      : data["@context"]
        ? data
        : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
