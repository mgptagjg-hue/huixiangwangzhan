import { articles, type Article } from "./articles";
import { CORE_FAQS, NAV_ITEMS, SERVICE_ITEMS, SITE } from "./site";

const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: SITE.contact.address,
  addressLocality: "湖州市长兴县",
  addressRegion: "浙江省",
  addressCountry: "CN"
};

const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:30",
    closes: "17:30"
  }
];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: absoluteUrl("/logo-huixiang.png"),
    description: SITE.description,
    foundingDate: SITE.foundedDate,
    telephone: SITE.contact.phone,
    address: postalAddress,
    areaServed: SITE.serviceAreas,
    knowsAbout: [...SITE.mainBrands, ...SITE.mainVehicleTypes, ...SITE.mainServices],
    sameAs: [SITE.contact.mapUrl]
  };
}

export function autoDealerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE.url,
    logo: absoluteUrl("/logo-huixiang.png"),
    image: absoluteUrl("/images/vehicles/hero-3d-truck.png"),
    description: SITE.description,
    telephone: SITE.contact.phone,
    address: postalAddress,
    openingHours: "Mo-Su 08:30-17:30",
    openingHoursSpecification,
    areaServed: SITE.serviceAreas,
    brand: SITE.mainBrands,
    serviceType: SITE.mainServices,
    makesOffer: SERVICE_ITEMS.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.note
      },
      availability: "https://schema.org/InStoreOnly"
    }))
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE.name}官网`,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "zh-CN",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: absoluteUrl("/logo-huixiang.png")
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/guides?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href)
    }))
  };
}

export function faqSchema(faqs = CORE_FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: absoluteUrl("/logo-huixiang.png")
    },
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    inLanguage: "zh-CN"
  };
}

export function pageArticleSchema(page: {
  title: string;
  description: string;
  path: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.updatedAt ?? SITE.updatedAt,
    dateModified: page.updatedAt ?? SITE.updatedAt,
    author: {
      "@type": "Organization",
      name: SITE.name
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: absoluteUrl("/logo-huixiang.png")
    },
    mainEntityOfPage: absoluteUrl(page.path),
    inLanguage: "zh-CN"
  };
}

export function itemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/guides/${article.slug}`),
      name: article.title
    }))
  };
}

export function siteNavigationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "网站主要栏目",
    itemListElement: NAV_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: absoluteUrl(item.href)
    }))
  };
}
