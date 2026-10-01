import { site } from "@/lib/site";
import type { Listing } from "@/lib/properties/types";

/**
 * Structured data pro detail nabídky. Jen s WebPage a BreadcrumbList by
 * Google nevěděl, že se dívá na nemovitost.
 */
export function realEstateListingSchema(listing: Listing) {
  const url = `${site.url}/nemovitosti/${listing.slug}`;

  const availability =
    listing.state === "sold"
      ? "https://schema.org/SoldOut"
      : listing.state === "reserved"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": url,
    url,
    name: listing.seoTitle,
    description: listing.metaDescription || undefined,
    datePosted: listing.updatedAt,
    inLanguage: "cs-CZ",
    image: listing.photos.slice(0, 8).map((p) => p.url),

    about: {
      "@type": listing.kind === "pozemek" ? "Place" : "Residence",
      name: listing.seoTitle,
      ...(listing.area
        ? {
            floorSize: {
              "@type": "QuantitativeValue",
              value: listing.area,
              unitCode: "MTK",
            },
          }
        : {}),
      ...(listing.floor != null ? { floorLevel: String(listing.floor) } : {}),
      address: {
        "@type": "PostalAddress",
        addressCountry: "CZ",
        ...(listing.address ? { streetAddress: listing.address } : {}),
        ...(listing.city ? { addressLocality: listing.city } : {}),
        ...(listing.region ? { addressRegion: listing.region } : {}),
        ...(listing.zip ? { postalCode: listing.zip } : {}),
      },
      ...(listing.coords
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: listing.coords.lat,
              longitude: listing.coords.lng,
            },
          }
        : {}),
    },

    ...(listing.price != null && !listing.priceOnRequest
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: listing.currency,
            availability,
            url,
            seller: {
              "@type": "RealEstateAgent",
              name: site.name,
              telephone: site.phone,
              email: site.email,
              url: site.url,
            },
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${site.url}#agent`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    description: site.description,
    knowsLanguage: "cs",
    parentOrganization: { "@type": "Organization", name: site.company },
    // Profily na sítích — Google podle nich propojí web s osobou
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

/** <script type="application/ld+json"> bez rizika XSS z obsahu. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
