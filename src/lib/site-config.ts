/** Public site URL for metadata, canonical, OG and JSON-LD. Override via env in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://nutrition10k.com';

export const SITE_NAME = 'Nutrition 10K | Weight Loss Partners';
export const SITE_SHORT_NAME = 'N10K';
export const SITE_DESCRIPTION =
  'Nutrition 10K — Weight Loss Partners. Tu aliado para la pérdida de peso y el aumento de tu autoestima. Productos nutricionales de la más alta calidad, formulados y producidos en Estados Unidos. Logra tu cambio.';
export const SITE_OG_DESCRIPTION =
  'Logra tu cambio. Productos nutricionales formulados en EE. UU. para una transformación integral.';
export const SITE_LOCALE = 'es_VE';
export const SITE_OG_IMAGE = '/brand/banner-horizontal.jpg';

/** WhatsApp number for checkout and support (Venezuela). */
export const WHATSAPP_NUMBER = '584122880228';

/** Instagram handle (without @). */
export const INSTAGRAM_HANDLE = 'nutrition10k';
export const INSTAGRAM_URL = 'https://www.instagram.com/nutrition10k/';
