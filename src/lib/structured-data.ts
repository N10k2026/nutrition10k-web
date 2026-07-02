/**
 * JSON-LD structured data for SEO.
 * Adapted from n10k-store for Nutrition 10K supplements brand.
 */

import { PRODUCTS } from '@/data/products';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from './site-config';

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nutrition 10K',
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/brand/logo.png`,
    sameAs: [
      'https://www.instagram.com/nutrition10k/',
    ],
    foundingDate: '2025',
    knowsAbout: ['Nutrición', 'Pérdida de peso', 'Suplementos', 'Bienestar'],
  };
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-VE',
  };
}

export function getItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de productos Nutrition 10K',
    itemListElement: PRODUCTS.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      description: product.tagline,
    })),
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
