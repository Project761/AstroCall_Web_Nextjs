/**
 * Wraps service landing pages with JSON-LD + passes SEO props to client.
 */
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import ServicePageClient from "@/app/components/policy/ServicePageClient";

export default function ServicePageWithSeo({
  items,
  heroTitle,
  heroSubtitle,
  currentPage,
  seoTitle,
  seoDescription,
  path,
  breadcrumbLabel,
}) {
  return (
    <>
      <PageSeoSchemas
        title={seoTitle}
        description={seoDescription}
        path={path}
        breadcrumbLabel={breadcrumbLabel || currentPage}
      />
      <ServicePageClient
        items={items}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        currentPage={currentPage}
      />
    </>
  );
}
