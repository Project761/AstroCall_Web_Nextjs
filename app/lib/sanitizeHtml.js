import DOMPurify from "dompurify";

export function sanitizeHtml(html) {
  if (!html) return "";
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  }
  return String(html);
}
