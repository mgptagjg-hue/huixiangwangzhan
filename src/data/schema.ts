import { articles, type Article } from "./articles";
import { dongfengDolicaModels } from "./dongfengDolicaModels";
import type { NewsArticle } from "./news";
import { CORE_FAQS, NAV_ITEMS, SERVICE_ITEMS, SITE, STORE_IMAGES } from "./site";

const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();
const storeImageUrls = [
  absoluteUrl(STORE_IMAGES.storeAndTrucks.src),
  absoluteUrl(STORE_IMAGES.storefront.src)
];

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: SITE.contact.streetAddress,
  addressLocality: "湖州市长兴县",
  addressRegion: "浙江省",
  addressCountry: "CN"
};

const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "17:00"
  }
];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.name,
    alternateName: SITE.storeName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo-huixiang.png"),
    image: storeImageUrls,
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
    alternateName: SITE.storeName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo-huixiang.png"),
    image: storeImageUrls,
    photo: [
      {
        "@type": "ImageObject",
        contentUrl: storeImageUrls[0],
        caption: "辉祥汽贸门店与现车实景，湖州长兴货车销售与商用车服务",
        representativeOfPage: true
      },
      {
        "@type": "ImageObject",
        contentUrl: storeImageUrls[1],
        caption: "辉祥汽贸真实门头，长兴辉祥汽车贸易有限公司实体经营门店"
      }
    ],
    description: SITE.description,
    telephone: SITE.contact.phone,
    address: postalAddress,
    openingHours: "Mo-Su 08:00-17:00",
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

export function newsArticleSchema(article: NewsArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    keywords: article.keywords.join(", "),
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: absoluteUrl("/logo-huixiang.png")
    },
    image: article.cover ? absoluteUrl(article.cover) : absoluteUrl("/images/vehicles/hero-3d-truck.png"),
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
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

export function dolicaModelItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "东风多利卡系列车型配置参考",
    description:
      "长兴辉祥汽贸整理东风多利卡 D5、D6-M、K6-M、K6-L 和东风多利卡王者归来系列常见配置，供湖州长兴货车用户选车参考。",
    itemListElement: dongfengDolicaModels.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/trucks#${model.id}`),
      item: {
        "@type": "Product",
        name: model.name,
        brand: "东风多利卡",
        category: model.series,
        description: model.sellingPoint,
        additionalProperty: [
          { "@type": "PropertyValue", name: "驾驶室大小", value: model.cabSize },
          { "@type": "PropertyValue", name: "发动机", value: model.engine },
          { "@type": "PropertyValue", name: "马力", value: model.horsepower },
          { "@type": "PropertyValue", name: "变速箱", value: model.gearbox },
          { "@type": "PropertyValue", name: "车厢尺寸", value: model.cargoSize },
          { "@type": "PropertyValue", name: "可咨询颜色", value: model.colors.join("、") },
          { "@type": "PropertyValue", name: "适合场景", value: model.suggestedUse.join("、") }
        ]
      }
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
