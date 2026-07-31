import JsonLd from "./JsonLd";
import { buildPublicPageSchemas } from "@/app/lib/seo";

/**
 * Drop-in WebPage + BreadcrumbList JSON-LD for static marketing pages.
 */
export default function PageSeoSchemas({ title, description, path, breadcrumbLabel }) {
  const schema = buildPublicPageSchemas({ title, description, path, breadcrumbLabel });
  return <JsonLd data={schema} />;
}
