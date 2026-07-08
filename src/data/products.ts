/**
 * Catálogo de productos de Nutrition 10K
 * ----------------------------------------
 * Fuente única de verdad para alimentar la base de datos (seed) y el
 * fallback estático de la API cuando la BD no esté disponible.
 *
 * Estados de ficha técnica:
 *  - 'complete': ficha técnica completa con ingredientes detallados
 *  - 'partial':  tenemos beneficios + modo de empleo, pero sin desglose de ingredientes
 *  - 'pending':  solo info básica de banner/branding
 *
 * Marca: Nutrition 10K — Weight Loss Partners
 * Mercado: Venezuela (es-VE)
 * Producción: Formulado y producido en Estados Unidos
 */

export type FichaStatus = 'complete' | 'partial' | 'pending';

export interface ProductIngredient {
  /** Emoji usado en la ficha técnica original (se renderiza en UI) */
  emoji: string;
  /** Nombre del ingrediente */
  name: string;
  /** Descripción de su función/beneficio */
  description: string;
}

export interface NutritionProduct {
  /** ID estable (no autogenerado por BD). Formato: slug en kebab-case */
  id: string;
  /** Slug URL-friendly */
  slug: string;
  /** Nombre comercial */
  name: string;
  /** Línea de producto / descriptor corto */
  tagline: string;
  /** Descripción larga de marketing */
  description: string;
  /** Categoría para filtros del catálogo */
  category: ProductCategory;
  /** Color de marca del producto (para swatches y acentos) */
  brandColor: string;
  /** Color de marca en formato claro para textos sobre fondo oscuro */
  brandColorFg: string;
  /** Lista de ingredientes activos con su función */
  ingredients: ProductIngredient[];
  /** Modo de empleo (dosis + momento del día) */
  usage: string;
  /** Formato de presentación */
  format: ProductFormat;
  /** Tamaño/tamaño de presentación (para selector de "presentaciones") */
  sizes: string[];
  /** Precios por presentación (label del size → precio en USD). Opcional. */
  sizePricing?: Record<string, number>;
  /** Imágenes específicas por presentación (label del size → array de URLs). Opcional.
   *  Si la presentación seleccionada tiene imágenes aquí, se muestran en la galería
   *  en lugar de las imágenes generales del producto. */
  sizeImages?: Record<string, string[]>;
  /** Beneficios principales (bullets cortos para cards) */
  benefits: string[];
  /** Información nutricional destacada (para proteínas) */
  nutritionFacts?: { label: string; value: string }[];
  /** Badge de "nuevo" */
  isNew?: boolean;
  /** Badge de "más vendido" */
  isBestSeller?: boolean;
  /** Estado de la ficha técnica */
  fichaStatus: FichaStatus;
  /** Imagen principal (TBD — pendiente de recibir assets del cliente) */
  image?: string;
  /** Galería de imágenes (TBD) */
  images?: string[];
  /** Precio en USD (TBD — pendiente de confirmación del cliente) */
  price?: number;
  /** Precio anterior para mostrar descuento (TBD) */
  originalPrice?: number;
  /** Rating promedio (TBD — se calcula desde reseñas) */
  rating?: number;
}

export type ProductCategory =
  | 'Digestión'
  | 'Quemadores'
  | 'Inhibidores'
  | 'Cetogénicos'
  | 'Proteínas'
  | 'Rendimiento'
  | 'Nutracéuticos'
  | 'Longevidad'
  | 'Accesorios';

export type ProductFormat = 'Cápsulas' | 'Cápsulas blandas' | 'Polvo' | 'Líquido' | 'Gomitas';

export const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'Proteínas', label: 'Proteínas' },
  { id: 'Rendimiento', label: 'Rendimiento' },
  { id: 'Quemadores', label: 'Quemadores' },
  { id: 'Digestión', label: 'Digestión' },
  { id: 'Inhibidores', label: 'Inhibidores' },
  { id: 'Cetogénicos', label: 'Cetogénicos' },
  { id: 'Nutracéuticos', label: 'Nutracéuticos' },
  { id: 'Longevidad', label: 'Longevidad' },
  { id: 'Accesorios', label: 'Accesorios' },
];

// ============================================================================
// 1. BYE BYE BELLY — Digestión (ficha completa)
// ============================================================================

export const byeByeBelly: NutritionProduct = {
  id: 'bye-bye-belly',
  slug: 'bye-bye-belly',
  name: 'Bye Bye Belly',
  tagline: 'Reduce la inflamación y mejora tu digestión',
  description:
    'Bye Bye Belly es una fórmula integral para combatir la inflamación abdominal y favorecer una digestión saludable. Combina probióticos, fibra prebiótica y potentes antiinflamatorios naturales como la cúrcuma y el jengibre, potenciados con pimienta negra para una máxima absorción. Formulado y producido en Estados Unidos.',
  category: 'Digestión',
  brandColor: '#9ACD32', // verde amarillo (yellowgreen)
  brandColorFg: '#1A1A1A',
  format: 'Cápsulas',
  image: '/products/bye-bye-belly/ByeByeBelly01.webp',
  images: [
    '/products/bye-bye-belly/ByeByeBelly01.webp',
    '/products/bye-bye-belly/ByeByeBelly02.webp',
    '/products/bye-bye-belly/ByeByeBelly03.webp',
    '/products/bye-bye-belly/ByeByeBelly04.webp',
    '/products/bye-bye-belly/ByeByeBelly05.webp',
    '/products/bye-bye-belly/ByeByeBelly06.webp',
    '/products/bye-bye-belly/ByeByeBelly07.webp',
    '/products/bye-bye-belly/ByeByeBelly08.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 45,
  benefits: [
    'Reduce la inflamación abdominal',
    'Mejora la digestión y el tránsito intestinal',
    'Equilibra la microbiota con probióticos',
    'Apoya la salud cardiovascular y articular',
  ],
  isNew: true,
  isBestSeller: true,
  fichaStatus: 'complete',
  ingredients: [
    {
      emoji: '🧬',
      name: 'Ácido fólico',
      description:
        'Esencial para la producción de glóbulos rojos y la síntesis del ADN.',
    },
    {
      emoji: '🌱',
      name: 'Inulina',
      description: 'Fibra prebiótica que ayuda a mejorar la salud intestinal.',
    },
    {
      emoji: '🦠',
      name: 'Probióticos',
      description:
        'Ayuda a equilibrar la microbiota intestinal, mejorando la digestión y la absorción de nutrientes.',
    },
    {
      emoji: '🫀',
      name: 'Cúrcuma (curcumina)',
      description:
        'Antiinflamatorio y antioxidante que ayuda al funcionamiento intestinal y a la salud cardiovascular.',
    },
    {
      emoji: '🫚',
      name: 'Jengibre',
      description:
        'Excelente diurético natural que ayuda contra el estreñimiento y a reducir la hinchazón.',
    },
    {
      emoji: '🍵',
      name: 'Té verde',
      description:
        'Estimula la producción de enzimas digestivas, desintoxica y aumenta la energía.',
    },
    {
      emoji: '👩🏻',
      name: 'Ácido hialurónico',
      description:
        'Beneficioso para la hidratación de la piel y la salud articular.',
    },
    {
      emoji: '⚫',
      name: 'Pimienta negra',
      description: 'Potencia la absorción de la cúrcuma.',
    },
  ],
  usage: 'Consumir 2 cápsulas luego del desayuno.',
};

// ============================================================================
// 2. CHOCO PUFF — Digestión (ficha completa)
// ============================================================================

export const chocoPuff: NutritionProduct = {
  id: 'choco-puff',
  slug: 'choco-puff',
  name: 'Choco Puff',
  tagline: 'Reduce la flatulencia y neutraliza el olor',
  description:
    'Choco Puff es la fórmula definitiva contra los gases y la flatulencia. Su combinación de carbón activado, probióticos, enzimas digestivas y extractos botánicos (menta, hinojo, jengibre) reduce la producción de gases y neutraliza el olor gracias al cacao. Formulado y producido en Estados Unidos.',
  category: 'Digestión',
  brandColor: '#5C3A21', // marrón cacao
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas',
  image: '/products/choco-puff/ChocoPuff01.webp',
  images: [
    '/products/choco-puff/ChocoPuff01.webp',
    '/products/choco-puff/ChocoPuff02.webp',
    '/products/choco-puff/ChocoPuff03.webp',
    '/products/choco-puff/ChocoPuff04.webp',
    '/products/choco-puff/ChocoPuff05.webp',
    '/products/choco-puff/ChocoPuff06.webp',
    '/products/choco-puff/ChocoPuff07.webp',
    '/products/choco-puff/ChocoPuff08.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 45,
  benefits: [
    'Reduce la flatulencia y los gases',
    'Neutraliza el olor de forma natural',
    'Mejora la digestión de comidas pesadas',
    'Equilibra la microbiota intestinal',
  ],
  isNew: true,
  fichaStatus: 'complete',
  ingredients: [
    {
      emoji: '⚫️',
      name: 'Carbón activado',
      description:
        'Absorbe los gases, toxinas y compuestos que causan el mal olor, ayudando a reducir la flatulencia y a neutralizar el olor.',
    },
    {
      emoji: '🦠',
      name: 'Probióticos',
      description:
        'Equilibra la microbiota intestinal, mejorando la digestión, reduciendo la hinchazón y la producción de gases al metabolizar mejor los alimentos.',
    },
    {
      emoji: '🌱',
      name: 'Menta',
      description:
        'Ayuda a calmar el sistema digestivo y reduce la formación de gases.',
    },
    {
      emoji: '🍃',
      name: 'Hinojo',
      description:
        'Reduce los espasmos intestinales y facilita la expulsión de gases ya formados, aliviando la sensación de hinchazón y presión.',
    },
    {
      emoji: '🍫',
      name: 'Cacao',
      description:
        'Sus compuestos volátiles se liberan con los gases, enmascarando el olor. También ayuda a la salud de la microbiota intestinal.',
    },
    {
      emoji: '✨',
      name: 'Alpha-galactosidase',
      description:
        'Enzima que disminuye la cantidad de carbohidratos que fermentan (frijoles, brócoli, granos enteros), causa principal de la mayoría de los gases e hinchazón.',
    },
    {
      emoji: '🫚',
      name: 'Jengibre',
      description:
        'Ayuda a estimular la digestión, permitiendo que el alimento fluya a través del intestino.',
    },
  ],
  usage:
    'Consumir 2 cápsulas 30 minutos antes de una comida pesada (granos, harinas, vegetales inflamatorios).',
};

// ============================================================================
// 3. KETO 10K — Cetogénicos (ficha parcial, del brand narrative)
// ============================================================================

export const keto10k: NutritionProduct = {
  id: 'keto-10k',
  slug: 'keto-10k',
  name: 'Keto 10K',
  tagline: 'Quemador de grasa con BHB Ketones · Energy Boost',
  description:
    'Keto 10K es un producto trending basado en cetonas (BHB) que propicia la transformación de grasas en energía. Está diseñado para adultos que desean perder peso y no cuentan con el tiempo o la disposición para entrenar de forma constante. Su fórmula permite empezar a quemar grasa extra desde las primeras horas del día. Formulado y producido en Estados Unidos.',
  category: 'Cetogénicos',
  brandColor: '#6A0DAD', // morado
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas',
  image: '/products/keto-10k/Keto01.webp',
  images: [
    '/products/keto-10k/Keto01.webp',
    '/products/keto-10k/Keto02.webp',
    '/products/keto-10k/Keto03.webp',
    '/products/keto-10k/Keto04.webp',
    '/products/keto-10k/Keto05.webp',
    '/products/keto-10k/Keto06.webp',
    '/products/keto-10k/Keto07.webp',
    '/products/keto-10k/Keto08.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 45,
  benefits: [
    'Transforma las grasas en energía',
    'Quema grasa extra desde tempranas horas',
    'Ideal para quienes no pueden entrenar a diario',
    'Apoya la cetosis con BHB Ketones',
  ],
  isBestSeller: true,
  fichaStatus: 'partial',
  ingredients: [
    {
      emoji: '⚡',
      name: 'BHB Ketones',
      description:
        'Cetona exógena que propicia la transformación de grasas en energía en el cuerpo, ayudando a quemar grasa extra desde las primeras horas del día.',
    },
  ],
  usage: 'Pendiente de ficha técnica detallada del cliente.',
};

// ============================================================================
// 4. ALIENS BLOCKER (Carb Blocker) — Inhibidores (ficha parcial)
// ============================================================================

export const aliensBlocker: NutritionProduct = {
  id: 'aliens-blocker',
  slug: 'aliens-blocker',
  name: 'Aliens Blocker',
  tagline: 'Bloqueador de carbohidratos',
  description:
    'Aliens Blocker es un complemento natural ideal para dietas orientadas a bajar de peso. Disminuye la absorción de hidratos de carbono hasta un 75%, reduce el aporte de calorías y transforma la grasa acumulada en energía. Mejora la sensibilidad a la insulina y controla los niveles de azúcar en sangre. Formulado y producido en Estados Unidos.',
  category: 'Inhibidores',
  brandColor: '#4CAF50', // verde lima
  brandColorFg: '#000000',
  format: 'Cápsulas',
  image: '/products/aliens-blocker/Aliens01.webp',
  images: [
    '/products/aliens-blocker/Aliens01.webp',
    '/products/aliens-blocker/Aliens02.webp',
    '/products/aliens-blocker/Aliens03.webp',
    '/products/aliens-blocker/Aliens04.webp',
    '/products/aliens-blocker/Aliens05.webp',
    '/products/aliens-blocker/Aliens06.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 45,
  benefits: [
    'Disminuye la absorción de carbohidratos hasta un 75%',
    'Reduce el aporte de calorías de los alimentos',
    'Transforma la grasa acumulada en energía',
    'Controla los niveles de azúcar en sangre',
  ],
  fichaStatus: 'partial',
  ingredients: [],
  usage:
    'Consumir 2 cápsulas al día antes de una comida fuerte: una antes del almuerzo y otra antes de la cena.',
};

// ============================================================================
// 5. DETOX — Detox (ficha completa — extraída de imagen de ficha técnica)
//    Nombre comercial real: DeTox
//    Serving: 2 cápsulas · 30 servicios · 60 cápsulas totales
// ============================================================================

export const detox: NutritionProduct = {
  id: 'detox',
  slug: 'detox',
  name: 'DeTox',
  tagline: 'Desintoxicación corporal completa · 60 cápsulas · 30 servicios',
  description:
    'DeTox mejora, optimiza y apoya el proceso natural de desintoxicación del cuerpo al disminuir la cantidad de toxinas que ingerimos, además de proveer los nutrientes que el cuerpo necesita para trabajar adecuadamente. Mejora la digestión, evita el estreñimiento y facilita la eliminación de toxinas. Controla valores como el azúcar, el colesterol y los triglicéridos en sangre. Formulado y producido en Estados Unidos.',
  category: 'Quemadores',
  brandColor: '#FFEB3B', // amarillo
  brandColorFg: '#000000',
  format: 'Cápsulas',
  image: '/products/detox/DeTox01.webp',
  images: [
    '/products/detox/DeTox01.webp',
    '/products/detox/DeTox02.webp',
    '/products/detox/DeTox03.webp',
    '/products/detox/DeTox04.webp',
    '/products/detox/DeTox05.webp',
    '/products/detox/DeTox06.webp',
    '/products/detox/DeTox07.webp',
    '/products/detox/DeTox08-SupplementFacts.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 45,
  benefits: [
    'Optimiza el proceso natural de desintoxicación',
    'Mejora la digestión y evita el estreñimiento',
    'Facilita la eliminación de toxinas',
    'Controla azúcar, colesterol y triglicéridos',
  ],
  fichaStatus: 'complete',
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '2 cápsulas' },
    { label: 'Servicios por envase', value: '30' },
  ],
  ingredients: [
    {
      emoji: '💪',
      name: 'L-Carnitine (Carnitine Tartrate)',
      description: '500 mg por servicio. Aminoácido que facilita el transporte de ácidos grasos hacia las mitocondrias para su oxidación, apoyando el metabolismo de grasas.',
    },
    {
      emoji: '⚗️',
      name: 'Chromium (Chromium Picolinate)',
      description: '400 mg por servicio. Mineral que mejora la sensibilidad a la insulina y ayuda a regular los niveles de azúcar en sangre.',
    },
    {
      emoji: '🌾',
      name: 'Psyllium Husks 85% (Plantago Ovata)',
      description: '200 mg por servicio. Fibra natural que mejora el tránsito intestinal, evita el estreñimiento y facilita la eliminación de toxinas.',
    },
    {
      emoji: '🌿',
      name: 'Mezcla patentada (Buckthorn Bark, Aloe Vera, Senna Leaf, Burdock Root, Slippery Elm Root)',
      description: '50 mg de Buckthorn Bark + 50 mg de Coldo Le, más Aloe Vera, Senna Leaf, Burdock Root y Slippery Elm Root. Plantas con propiedades laxantes, depurativas y protectoras de la mucosa intestinal.',
    },
  ],
  usage: 'Consumir 2 cápsulas en la mañana. (Tamaño de servicio: 2 cápsulas · 30 servicios por envase).',
};

// ============================================================================
// 6. CLA 10K — Quemadores (ficha parcial, rico en CLA + Omega 3)
// ============================================================================

export const cla10k: NutritionProduct = {
  id: 'cla-10k',
  slug: 'cla-10k',
  name: 'CLA 10K',
  tagline: 'Ácido Linolénico Conjugado · Rico en Omega 3',
  description:
    'CLA 10K es un producto rico en Omega 3, un ácido graso imprescindible para la función cerebral y cardiaca, además del bienestar general del cuerpo. El CLA (Ácido Linolénico Conjugado) fomenta la reducción de la masa grasa al potenciar el metabolismo de los lípidos, mantiene la masa muscular y regula el azúcar en sangre. Presentado en cápsulas blandas. Formulado y producido en Estados Unidos.',
  category: 'Quemadores',
  brandColor: '#4B5320', // verde militar (army green)
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas blandas',
  image: '/products/cla-10k/CLA10K01.webp',
  images: [
    '/products/cla-10k/CLA10K01.webp',
    '/products/cla-10k/CLA10K02.webp',
    '/products/cla-10k/CLA10K03.webp',
    '/products/cla-10k/CLA10K04.webp',
    '/products/cla-10k/CLA10K05.webp',
    '/products/cla-10k/CLA10K06.webp',
    '/products/cla-10k/CLA10K07.webp',
  ],
  sizes: ['60 cápsulas'],
  price: 40,
  benefits: [
    'Reduce la masa grasa y mantiene la masa muscular',
    'Rico en Omega 3 para la función cerebral y cardiaca',
    'Controla colesterol y triglicéridos (grasa abdominal)',
    'Regula el azúcar en sangre mejorando la sensibilidad a la insulina',
  ],
  isBestSeller: true,
  fichaStatus: 'complete',
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '3 softgels' },
    { label: 'Servicios por envase', value: '30' },
    { label: 'Calorías por servicio', value: '18' },
    { label: 'CLA Oil por servicio', value: '1000 mg' },
    { label: 'Vitamina E por servicio', value: '4 IU' },
  ],
  ingredients: [
    {
      emoji: '💊',
      name: 'Conjugated Linoleic Acid Oil (CLA)',
      description: '1000 mg por servicio (3 softgels). Mezcla de isómeros (Cis y Trans) de un ácido graso poliinsaturado que el cuerpo no puede sintetizar. El isómero Cis mejora la composición corporal y reduce la masa grasa; el isómero Trans tiene beneficios antiinflamatorios y neuroprotectores.',
    },
    {
      emoji: '🐟',
      name: 'Vitamina E (Vitamin E oil)',
      description: '4 IU por servicio (13% del valor diario). Antioxidante que protege los ácidos grasos del CLA de la oxidación y apoya la salud cardiovascular.',
    },
  ],
  usage:
    'Sin entrenar: 1 cápsula en la mañana en ayunas + 1 cápsula antes de dormir. Entrenando: 1 cápsula en la mañana en ayunas + 2 cápsulas de 10 a 15 minutos antes de entrenar. (Tamaño de servicio: 3 softgels · 30 servicios por envase).',
};

// ============================================================================
// 7. MAGIC 10K — Quemadores (pre-entrenamiento con termogénicos, $45)
//    Fuente: sitio antiguo nutrition10k.com/2025/05/13/magic/
// ============================================================================

export const magic10k: NutritionProduct = {
  id: 'magic-10k',
  slug: 'magic-10k',
  name: 'Magic 10K',
  tagline: 'Pre-entrenamiento con matriz energética, nootrópicos y termogénicos',
  description:
    'Magic de Nutrition10k combina ingredientes clave para ofrecer una experiencia de entrenamiento superior. Su matriz energética está diseñada para proporcionar un impulso sostenido, evitando los picos y caídas abruptas. Los componentes enfocados en la fuerza buscan mejorar la potencia muscular y la resistencia durante sesiones intensas. Adicionalmente, su fórmula incluye nootrópicos que promueven la concentración mental y la conexión mente-músculo, permitiendo entrenamientos más focalizados y efectivos. La inclusión de ingredientes termogénicos tiene como objetivo estimular el metabolismo y favorecer la quema de grasa en todo el cuerpo. Formulado y producido en Estados Unidos.',
  category: 'Rendimiento',
  brandColor: '#E30613', // rojo Nutrition 10K
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas',
  image: '/products/magic-10k/Magic01.webp',
  images: [
    '/products/magic-10k/Magic01.webp',
    '/products/magic-10k/Magic02.webp',
    '/products/magic-10k/Magic03.webp',
    '/products/magic-10k/Magic04.webp',
    '/products/magic-10k/Magic05.webp',
  ],
  sizes: ['60 cápsulas'],
  benefits: [
    'Matriz energética de impulso sostenido (sin picos y caídas)',
    'Mejora la potencia muscular y la resistencia',
    'Nootrópicos para concentración mental y conexión mente-músculo',
    'Termogénicos que estimulan el metabolismo y la quema de grasa',
  ],
  isNew: true,
  fichaStatus: 'complete',
  price: 45,
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '2 cápsulas' },
    { label: 'Servicios por envase', value: '30' },
    { label: 'Mezcla patentada', value: '1500 mg' },
  ],
  ingredients: [
    {
      emoji: '🍵',
      name: 'Green Tea Extract (Camellia sinensis)',
      description: 'Antioxidante y termogénico. Estimula el metabolismo de las grasas y aporta energía sostenida.',
    },
    {
      emoji: '☕',
      name: 'Green Coffee Bean Extract + Caffeine Anhydrous',
      description: 'Matriz energética de impulso sostenido que evita los picos y caídas abruptas.',
    },
    {
      emoji: '🫐',
      name: 'Raspberry Ketones',
      description: 'Ayuda a regular el metabolismo de los lípidos y favorece la descomposición de la grasa.',
    },
    {
      emoji: '🫒',
      name: 'Olive Leaf Extract (Olea Europaea)',
      description: 'Antioxidante y cardiovascular. Apoya la salud general del organismo.',
    },
    {
      emoji: '🧠',
      name: 'Bacopa Extract (Bacopa Monnieri)',
      description: 'Nootrópico que promueve la concentración mental y la conexión mente-músculo durante el entrenamiento.',
    },
    {
      emoji: '🍉',
      name: 'Garcinia Cambogia Extract (Garcinia Gummi-gutta)',
      description: 'Inhibe la formación de nueva grasa y ayuda a controlar el apetito.',
    },
    {
      emoji: '🌸',
      name: 'Chrysin (5,7-dihydroxy flavone)',
      description: 'Flavonoide con propiedades antioxidantes que apoya la regulación hormonal.',
    },
    {
      emoji: '🌱',
      name: 'Forskohlii Extract (Coleus Forskohlii, root)',
      description: 'Activa la adenilato ciclasa, favoreciendo la descomposición de grasa y la potencia muscular.',
    },
  ],
  usage: 'Tomar 2 cápsulas al día. (Tamaño de servicio: 2 cápsulas · 30 servicios por envase).',
};

// ============================================================================
// 8. [DESCONTINUADO] ASHWAGANDHA — Eliminado del catálogo (ya no se fabrica)
//     NOTA: La Ashwagandha sigue siendo un ingrediente del producto OMG (#13).
// ============================================================================

// ============================================================================
// 9. WHEY PROTEIN SPACE EDITION (Envase) — Proteínas ($60)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/whey-protein-space-edition/
//     Presentación envase · 28 servicios · 25g proteína/servicio
//     Sabor disponible: SOLO VAINILLA
//     (Los sabores Chocolate y Cookies and Cream se venden en presentación Empaque — ver #10 y #12)
//     (El sabor Fresa fue descontinuado en todas las presentaciones)
// ============================================================================

export const wheyProteinSpaceEditionEnvase: NutritionProduct = {
  id: 'whey-protein-space-edition-envase',
  slug: 'whey-protein-space-edition-envase',
  name: 'Whey Protein Space Edition (Envase) · Vainilla',
  tagline: 'Proteína de suero sabor vainilla · 25g por servicio · 28 servicios',
  description:
    'Eleva tu rendimiento a órbitas superiores con nuestra Whey Protein Space Edition en su presentación Envase de 28 servicios, disponible exclusivamente en sabor vainilla. Diseñada para el atleta y el entusiasta del fitness que busca una recuperación y crecimiento muscular eficientes, esta fórmula de proteína de suero de leche de alta calidad entrega 25 gramos de proteína pura por servicio. Su formulación avanzada se disuelve fácilmente, ofreciendo una manera práctica y deliciosa de integrar proteína de calidad en tu rutina nutricional. Formulado y producido en Estados Unidos.',
  category: 'Proteínas',
  brandColor: '#1E40AF', // azul espacial
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/whey-protein-space-edition/WheyProteinEnvase01.webp',
  images: [
    '/products/whey-protein-space-edition/WheyProteinEnvase01.webp',
    '/products/whey-protein-space-edition/WheyProteinEnvase02.webp',
  ],
  sizes: ['Envase · 28 servicios · Vainilla'],
  benefits: [
    '25 gramos de proteína pura por servicio',
    '28 servicios por envase',
    'Recuperación y crecimiento muscular eficientes',
    'Se disuelve fácilmente, práctica y deliciosa',
    'Presentación Envase disponible exclusivamente en sabor vainilla',
  ],
  isBestSeller: true,
  fichaStatus: 'complete',
  price: 60,
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '1 scoop (32 g)' },
    { label: 'Servicios por envase', value: '28' },
    { label: 'Calorías por servicio', value: '120' },
    { label: 'Proteína por servicio', value: '25 g' },
    { label: 'BCAA por servicio', value: '4.95 g (Leucina 2450 + Isoleucina 1240 + Valina 1260)' },
    { label: 'Glutamina por servicio', value: '4.275 g (Ácido L-Glutámico)' },
    { label: 'Calcio por servicio', value: '200 mg (15% DV)' },
    { label: 'Sodio por servicio', value: '210 mg (9% DV)' },
    { label: 'Potasio por servicio', value: '210 mg (6% DV)' },
    { label: 'Enzimas digestivas', value: '50 mg (proteasa, lactasa, amilasa)' },
  ],
  ingredients: [
    {
      emoji: '🥛',
      name: 'Whey Protein Concentrate',
      description: 'Proteína de suero de leche concentrada, base de la fórmula. 25 g por servicio para recuperación y crecimiento muscular.',
    },
    {
      emoji: '💪',
      name: 'BCAA (L-Leucina 2450mg, L-Isoleucina 1240mg, L-Valina 1260mg)',
      description: 'Aminoácidos ramificados esenciales que optimizan la síntesis proteica y la recuperación muscular.',
    },
    {
      emoji: '🧬',
      name: 'L-Glutamina (4275 mg)',
      description: 'Aminoácido abundante en el músculo que apoya la recuperación y el sistema inmune.',
    },
    {
      emoji: '🦴',
      name: 'Calcio (200 mg)',
      description: 'Mineral esencial para la salud ósea y la contracción muscular (15% DV).',
    },
    {
      emoji: '🧂',
      name: 'Sodio (210 mg)',
      description: 'Electrolito que mantiene el balance de fluidos y la función nerviosa (9% DV).',
    },
    {
      emoji: '⚡',
      name: 'Potasio (210 mg)',
      description: 'Electrolito que apoya la función muscular y la hidratación (6% DV).',
    },
    {
      emoji: '🍃',
      name: 'Digestive Enzyme Blend (50 mg)',
      description: 'Mezcla de enzimas digestivas (proteasa, lactasa, amilasa) que mejora la absorción de la proteína.',
    },
    {
      emoji: '🍦',
      name: 'Sabor vainilla + maltodextrina + xanthan gum + sucralosa',
      description: 'Saborizantes naturales y artificiales, espesantes y edulcorante que aportan el carácter suave y cremoso de la vainilla.',
    },
  ],
  usage:
    'Mezclar 1 scoop (32 g) con agua o leche y consumir después del entrenamiento o como reemplazo de comida. (28 servicios por envase).',
};

// ============================================================================
// 10. WHEY PROTEIN CHOCOLATE — Proteínas (ficha completa con minerales)
//     Presentaciones: Empaque 1 lb / 2 lb / 5 lb · Sobre Sachet (caja de 14 sobres, Space Edition, Zero Sugar)
//     Sabor: Chocolate (la línea Empaque también está disponible en Vainilla #11 y Cookies and Cream #12)
//     Imagen referencia sachet: /public/products/whey-protein-sachet-reference.png
// ============================================================================

export const wheyProteinChocolate: NutritionProduct = {
  id: 'whey-protein-chocolate',
  slug: 'whey-protein-chocolate',
  name: 'Whey Protein Chocolate',
  tagline: 'Proteína de suero sabor chocolate · 25g de proteína por servicio',
  description:
    'Whey Protein de Chocolate está enfocada en el desarrollo y crecimiento muscular, ideal para quienes tienen un plan de acción para generar masa magra. Aporta 25g de proteína, 5.1g de BCAA y 4g de glutamina por servicio, enriquecida con calcio, sodio, hierro y potasio. Formulado y producido en Estados Unidos.',
  category: 'Proteínas',
  brandColor: '#8B5A2B', // marrón claro (tan / cocoa)
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/whey-protein-chocolate/WheyProteinChocolate05.webp',
  images: [
    '/products/whey-protein-chocolate/WheyProteinChocolate05.webp',
    '/products/whey-protein-chocolate/WheyProteinChocolate01.webp',
    '/products/whey-protein-chocolate/WheyProteinChocolate02.webp',
    '/products/whey-protein-chocolate/WheyProteinChocolate03.webp',
    '/products/whey-protein-chocolate/WheyProteinChocolate04.webp',
  ],
  sizes: ['Empaque', 'Sachet · 3 cajas de 14 unidades'],
  price: 60,
  sizePricing: { 'Sachet · 3 cajas de 14 unidades': 105 },
  benefits: [
    'Desarrollo y crecimiento muscular (masa magra)',
    '25g de proteína + 5.1g de BCAA + 4g de glutamina por servicio',
    'Excelente fuente de aminoácidos esenciales',
    'Enriquecida con calcio, sodio, hierro y potasio',
  ],
  fichaStatus: 'complete',
  nutritionFacts: [
    { label: 'Proteína', value: '25 g' },
    { label: 'BCAA', value: '5.1 g' },
    { label: 'Glutamina', value: '4 g' },
  ],
  ingredients: [
    {
      emoji: '🥛',
      name: 'Whey Protein (proteína de suero)',
      description:
        'Uno de los suplementos más usados para el desarrollo y crecimiento muscular. Excelente fuente de aminoácidos esenciales que eleva su concentración en la sangre.',
    },
    {
      emoji: '🍫',
      name: 'Sabor chocolate',
      description: 'Saborizante que aporta el carácter achocolatado al suplemento.',
    },
    {
      emoji: '💪',
      name: 'BCAA (aminoácidos ramificados)',
      description: '5.1 g por servicio. Aminoácidos esenciales para la recuperación y síntesis muscular.',
    },
    {
      emoji: '🧬',
      name: 'Glutamina',
      description: '4 g por servicio. Aminoácido que apoya la recuperación muscular y el sistema inmune.',
    },
    {
      emoji: '🦴',
      name: 'Calcio',
      description: 'Mineral esencial para la salud ósea y la contracción muscular.',
    },
    {
      emoji: '🧂',
      name: 'Sodio',
      description: 'Electrolito que mantiene el balance de fluidos y la función nerviosa.',
    },
    {
      emoji: '🩸',
      name: 'Hierro',
      description: 'Mineral clave para el transporte de oxígeno y la energía.',
    },
    {
      emoji: '⚡',
      name: 'Potasio',
      description: 'Electrolito que apoya la función muscular y la hidratación.',
    },
  ],
  usage:
    'Mezclar 1 servicio con agua o leche y consumir después del entrenamiento o como reemplazo de comida.',
};

// ============================================================================
// 11. WHEY PROTEIN VAINILLA — Proteínas (ficha parcial)
//     Presentaciones: Empaque 1 lb / 2 lb / 5 lb · Sobre Sachet (caja de 14 sobres, Space Edition, Zero Sugar)
//     Sabor: Vainilla (la línea Empaque también está disponible en Chocolate #10 y Cookies and Cream #12)
//     Imagen referencia sachet: /public/products/whey-protein-sachet-reference.png
// ============================================================================

export const wheyProteinVainilla: NutritionProduct = {
  id: 'whey-protein-vainilla',
  slug: 'whey-protein-vainilla',
  name: 'Whey Protein Vainilla',
  tagline: 'Proteína de suero sabor vainilla · 25g de proteína por servicio',
  description:
    'Whey Protein de Vainilla está enfocada en el desarrollo y crecimiento muscular. Aporta 25g de proteína, 5.1g de BCAA y 4g de glutamina por servicio, con el sabor suave y cremoso de la vainilla. Excelente fuente de aminoácidos esenciales que permite sustituir una comida del día si es necesario. Formulado y producido en Estados Unidos.',
  category: 'Proteínas',
  brandColor: '#C19A6B', // vainilla / camel
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/whey-protein-vainilla/WheyProteinVainilla01.webp',
  images: [
    '/products/whey-protein-vainilla/WheyProteinVainilla01.webp',
    '/products/whey-protein-vainilla/WheyProteinVainilla02.webp',
  ],
  sizes: ['Empaque', 'Sachet · 3 cajas de 14 unidades'],
  price: 60,
  sizePricing: { 'Sachet · 3 cajas de 14 unidades': 105 },
  benefits: [
    'Desarrollo y crecimiento muscular (hipertrofia)',
    '25g de proteína + 5.1g de BCAA + 4g de glutamina por servicio',
    'Excelente fuente de aminoácidos esenciales',
    'Sabor suave y cremoso, ideal para mezclar con frutas',
  ],
  isNew: true,
  fichaStatus: 'partial',
  nutritionFacts: [
    { label: 'Proteína', value: '25 g' },
    { label: 'BCAA', value: '5.1 g' },
    { label: 'Glutamina', value: '4 g' },
  ],
  ingredients: [
    {
      emoji: '🥛',
      name: 'Whey Protein (proteína de suero)',
      description:
        'Uno de los suplementos más usados para el desarrollo y crecimiento muscular. Excelente fuente de aminoácidos esenciales que eleva su concentración en la sangre.',
    },
    {
      emoji: '🍦',
      name: 'Sabor vainilla',
      description: 'Saborizante que aporta el carácter suave y cremoso de la vainilla al suplemento.',
    },
    {
      emoji: '💪',
      name: 'BCAA (aminoácidos ramificados)',
      description: '5.1 g por servicio. Aminoácidos esenciales para la recuperación y síntesis muscular.',
    },
    {
      emoji: '🧬',
      name: 'Glutamina',
      description: '4 g por servicio. Aminoácido que apoya la recuperación muscular y el sistema inmune.',
    },
  ],
  usage:
    'Mezclar 1 servicio con agua o leche y consumir después del entrenamiento o como reemplazo de comida.',
};

// ============================================================================
// 12. WHEY PROTEIN COOKIES AND CREAM — Proteínas (ficha parcial)
//     Presentaciones: Empaque 1 lb / 2 lb / 5 lb · Sobre Sachet (caja de 14 sobres, Space Edition, Zero Sugar)
//     Sabor: Cookies and Cream (la línea Empaque también está disponible en Chocolate #10 y Vainilla #11)
//     Imagen referencia sachet: /public/products/whey-protein-sachet-reference.png
// ============================================================================

export const wheyProteinCookiesAndCream: NutritionProduct = {
  id: 'whey-protein-cookies-and-cream',
  slug: 'whey-protein-cookies-and-cream',
  name: 'Whey Protein Cookies and Cream',
  tagline: 'Proteína de suero sabor cookies and cream · 25g de proteína por servicio',
  description:
    'Whey Protein de Cookies and Cream está enfocada en el desarrollo y crecimiento muscular. Aporta 25g de proteína, 5.1g de BCAA y 4g de glutamina por servicio, con el irresistible sabor a galletas con crema. Excelente fuente de aminoácidos esenciales que permite sustituir una comida del día si es necesario. Formulado y producido en Estados Unidos.',
  category: 'Proteínas',
  brandColor: '#6B4F2A', // cookies and cream (galleta)
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/whey-protein-cookies-and-cream/WheyProteinCookies01.webp',
  images: [
    '/products/whey-protein-cookies-and-cream/WheyProteinCookies01.webp',
    '/products/whey-protein-cookies-and-cream/WheyProteinCookies02.webp',
  ],
  sizes: ['Empaque', 'Sachet · 3 cajas de 14 unidades'],
  price: 60,
  sizePricing: { 'Sachet · 3 cajas de 14 unidades': 105 },
  benefits: [
    'Desarrollo y crecimiento muscular (hipertrofia)',
    '25g de proteína + 5.1g de BCAA + 4g de glutamina por servicio',
    'Excelente fuente de aminoácidos esenciales',
    'Irresistible sabor a galletas con crema',
  ],
  isNew: true,
  fichaStatus: 'partial',
  nutritionFacts: [
    { label: 'Proteína', value: '25 g' },
    { label: 'BCAA', value: '5.1 g' },
    { label: 'Glutamina', value: '4 g' },
  ],
  ingredients: [
    {
      emoji: '🥛',
      name: 'Whey Protein (proteína de suero)',
      description:
        'Uno de los suplementos más usados para el desarrollo y crecimiento muscular. Excelente fuente de aminoácidos esenciales que eleva su concentración en la sangre.',
    },
    {
      emoji: '🍪',
      name: 'Sabor cookies and cream',
      description: 'Saborizante que aporta el carácter irresistible de galletas con crema al suplemento.',
    },
    {
      emoji: '💪',
      name: 'BCAA (aminoácidos ramificados)',
      description: '5.1 g por servicio. Aminoácidos esenciales para la recuperación y síntesis muscular.',
    },
    {
      emoji: '🧬',
      name: 'Glutamina',
      description: '4 g por servicio. Aminoácido que apoya la recuperación muscular y el sistema inmune.',
    },
  ],
  usage:
    'Mezclar 1 servicio con agua o leche y consumir después del entrenamiento o como reemplazo de comida.',
};

// ============================================================================
// 13. OMG — Vitaminas/Bienestar integral ($45)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/omg/
// ============================================================================

export const omg: NutritionProduct = {
  id: 'omg',
  slug: 'omg',
  name: 'OMG',
  tagline: 'Bienestar sexual, hormonal y manejo del estrés',
  description:
    'El suplemento OMG de Nutrition10k se presenta como una solución multifacética para el bienestar. Su formulación busca influir positivamente en la esfera sexual, incrementando la libido en ambos sexos a través de la maca, ashwagandha y damiana. Para el manejo del estrés, incorpora componentes que podrían ayudar a promover la calma y el equilibrio emocional. En el ámbito hormonal masculino, apunta a estimular la producción natural de testosterona, lo que puede tener efectos en la energía, la fuerza y la función sexual. Para las mujeres en la etapa de la menopausia, el OMG incluye elementos destinados a aliviar síntomas comunes como los sofocos y las alteraciones del estado de ánimo. Formulado y producido en Estados Unidos.',
  category: 'Nutracéuticos',
  brandColor: '#DB2777', // magenta bienestar
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas',
  image: '/products/omg/OMG01.webp',
  images: [
    '/products/omg/OMG01.webp',
    '/products/omg/OMG02.webp',
    '/products/omg/OMG03.webp',
    '/products/omg/OMG04.webp',
    '/products/omg/OMG05.webp',
    '/products/omg/OMG06.webp',
    '/products/omg/OMG07.webp',
  ],
  sizes: ['60 cápsulas'],
  benefits: [
    'Incrementa la libido en ambos sexos',
    'Manejo del estrés y equilibrio emocional',
    'Estimula la producción natural de testosterona',
    'Alivia síntomas de la menopausia (sofocos, estado de ánimo)',
  ],
  isNew: true,
  fichaStatus: 'complete',
  price: 45,
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '2 cápsulas' },
    { label: 'Servicios por envase', value: '30' },
    { label: 'Ashwagandha por servicio', value: '1000 mg' },
    { label: 'Damiana por servicio', value: '400 mg' },
    { label: 'Maca por servicio', value: '400 mg' },
  ],
  ingredients: [
    {
      emoji: '🌿',
      name: 'Ashwagandha Extract (Withania somnifera, root)',
      description: '1000 mg por servicio. Hierba adaptógena ayurvédica que ayuda al manejo del estrés, reduce el cortisol, promueve la calma y el equilibrio emocional, mejora el sueño y favorece la memoria y la concentración.',
    },
    {
      emoji: '🌼',
      name: 'Damiana Extract (Turnera diffusa, leaf)',
      description: '400 mg por servicio. Planta tradicional usada como afrodisíaco natural y para apoyar el bienestar sexual en ambos sexos.',
    },
    {
      emoji: '🫘',
      name: 'Maca Extract (Lepidium meyenii, root)',
      description: '400 mg por servicio. Planta andina reconocida por incrementar la libido, la energía y la fertilidad en ambos sexos.',
    },
  ],
  usage: 'Tomar 2 cápsulas diarias. (Tamaño de servicio: 2 cápsulas · 30 servicios por envase).',
};

// ============================================================================
// 14. FOREVER — Longevidad/Salud celular ($45)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/forever/
// ============================================================================

export const forever: NutritionProduct = {
  id: 'forever',
  slug: 'forever',
  name: 'Forever',
  tagline: 'Salud celular y longevidad con NMN · Precursor del NAD+',
  description:
    'Forever de Nutrition10k aprovecha el poder del NMN (nicotinamida mononucleótido) para apoyar la salud celular integral. El NMN es un precursor clave del NAD+, una coenzima esencial involucrada en numerosos procesos biológicos, incluyendo la reparación del ADN y la producción de energía. Al aumentar los niveles de NAD+, Forever busca estimular la regeneración celular, lo que potencialmente podría contribuir a una mayor longevidad y a la prevención de enfermedades degenerativas. Además, al optimizar la función mitocondrial, se espera que este suplemento promueva una mayor energía celular y vitalidad general. Formulado y producido en Estados Unidos.',
  category: 'Longevidad',
  brandColor: '#7C3AED', // violeta longevidad
  brandColorFg: '#FFFFFF',
  format: 'Cápsulas',
  image: '/products/forever/Forever01.webp',
  images: [
    '/products/forever/Forever01.webp',
    '/products/forever/Forever02.webp',
    '/products/forever/Forever03.webp',
    '/products/forever/Forever04.webp',
    '/products/forever/Forever05.webp',
    '/products/forever/Forever06.webp',
    '/products/forever/Forever07.webp',
  ],
  sizes: ['60 cápsulas'],
  benefits: [
    'Apoya la salud celular integral',
    'Precursor del NAD+ (reparación del ADN y producción de energía)',
    'Estimula la regeneración celular y la longevidad',
    'Optimiza la función mitocondrial para mayor energía y vitalidad',
  ],
  isNew: true,
  fichaStatus: 'complete',
  price: 45,
  nutritionFacts: [
    { label: 'Tamaño de servicio', value: '2 cápsulas vegetarianas' },
    { label: 'Servicios por envase', value: '30' },
    { label: 'NMN por servicio', value: '450 mg' },
  ],
  ingredients: [
    {
      emoji: '🧬',
      name: 'Nicotinamide Mononucleotide (NMN) — 450 mg',
      description: 'Precursor clave del NAD+, una coenzima esencial involucrada en la reparación del ADN y la producción de energía. Al aumentar los niveles de NAD+, estimula la regeneración celular y optimiza la función mitocondrial para mayor energía y vitalidad.',
    },
  ],
  usage: 'Tomar 2 cápsulas vegetarianas diariamente o según lo indicado por su profesional de la salud. (30 servicios por envase).',
};

// ============================================================================
// 15. CREATINE X-PLOSION EDITION — Rendimiento ($45)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/creatina-x-plosion-edition/
//     Creatina HCL · sabor tropical
// ============================================================================

export const creatineXplosion: NutritionProduct = {
  id: 'creatine-x-plosion-edition',
  slug: 'creatine-x-plosion-edition',
  name: 'Creatine X-Plosion Edition',
  tagline: 'Creatina HCL de rápida absorción · Sabor tropical',
  description:
    'Desata una explosión de fuerza y crecimiento muscular con el delicioso y refrescante sabor tropical de Nutrition 10k Creatine Xplosion Edition. Esta fórmula de vanguardia, a base de creatina HCL de rápida absorción, ha sido diseñada meticulosamente para atletas y entusiastas del fitness que buscan una mejora significativa en su energía y desarrollo muscular. La creatina HCL se caracteriza por su alta biodisponibilidad, lo que facilita una absorción más eficiente y rápida en comparación con otras formas de creatina, permitiéndote experimentar resultados notables en fuerza, potencia y volumen muscular de manera más ágil. Formulado y producido en Estados Unidos.',
  category: 'Rendimiento',
  brandColor: '#F97316', // naranja (orange)
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/creatine-x-plosion/Creatina01.webp',
  images: [
    '/products/creatine-x-plosion/Creatina01.webp',
    '/products/creatine-x-plosion/Creatina02.webp',
    '/products/creatine-x-plosion/Creatina03.webp',
    '/products/creatine-x-plosion/Creatina04.webp',
    '/products/creatine-x-plosion/Creatina05.webp',
    '/products/creatine-x-plosion/Creatina06.webp',
    '/products/creatine-x-plosion/Creatina07.webp',
    '/products/creatine-x-plosion/Creatina08.webp',
    '/products/creatine-x-plosion/Creatina09.webp',
  ],
  sizes: ['Envase · 30 servicios', 'Sachet · 100 unidades'],
  sizePricing: { 'Sachet · 100 unidades': 70 },
  sizeImages: {
    'Sachet · 100 unidades': [
      '/products/creatine-x-plosion/CreatinaSachet01.webp',
      '/products/creatine-x-plosion/CreatinaSachet02.webp',
      '/products/creatine-x-plosion/CreatinaSachet03.webp',
      '/products/creatine-x-plosion/CreatinaSachet04.webp',
      '/products/creatine-x-plosion/CreatinaSachet05.webp',
      '/products/creatine-x-plosion/CreatinaSachet06.webp',
    ],
  },
  benefits: [
    'Creatina HCL de alta biodisponibilidad y rápida absorción',
    'Mejora significativa en fuerza, potencia y volumen muscular',
    'Resultados notables de manera más ágil',
    'Delicioso y refrescante sabor tropical',
  ],
  isNew: true,
  fichaStatus: 'partial',
  price: 45,
  ingredients: [
    {
      emoji: '💪',
      name: 'Creatina HCL (hidrocloruro de creatina)',
      description:
        'Forma de creatina de alta biodisponibilidad que facilita una absorción más eficiente y rápida en comparación con otras formas de creatina, permitiendo resultados notables en fuerza, potencia y volumen muscular de manera más ágil.',
    },
  ],
  usage: 'Pendiente de ficha técnica detallada del cliente (dosis por peso).',
};

// ============================================================================
// 16. AMINOSTACK LIMÓN — Rendimiento ($40)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/aminostack/
//     BCAA + Glutamina + Aminoácidos + Taurina · sabor limón
// ============================================================================

export const aminoStackLimon: NutritionProduct = {
  id: 'aminostack-limon',
  slug: 'aminostack-limon',
  name: 'AminoStack Limón',
  tagline: 'BCAA + Glutamina + Aminoácidos + Taurina · Sabor limón',
  description:
    'Maximiza tu recuperación y rendimiento con AminoStack. Esta fórmula avanzada está diseñada para atletas y entusiastas del fitness que buscan optimizar su recuperación muscular e hidratación durante y después del entrenamiento. AminoStack combina una potente mezcla de aminoácidos esenciales y no esenciales, enriquecida con glutamina para apoyar la reparación muscular y taurina para mejorar el enfoque y la resistencia. Además, su formulación contribuye a una hidratación óptima, permitiéndote superar tus límites y alcanzar tus metas más rápido. Formulado y producido en Estados Unidos.',
  category: 'Rendimiento',
  brandColor: '#CA8A04', // amarillo limón
  brandColorFg: '#000000',
  format: 'Polvo',
  image: '/products/aminostack-limon/AminoStackLemon01.webp',
  images: [
    '/products/aminostack-limon/AminoStackLemon01.webp',
    '/products/aminostack-limon/AminoStackLemon02.webp',
    '/products/aminostack-limon/AminoStackLemon03.webp',
    '/products/aminostack-limon/AminoStackLemon04.webp',
    '/products/aminostack-limon/AminoStackLemon05.webp',
    '/products/aminostack-limon/AminoStackLemon06.webp',
  ],
  sizes: ['Pote · 30 servicios'],
  benefits: [
    'Mezcla de aminoácidos esenciales y no esenciales',
    'Glutamina para la reparación muscular',
    'Taurina para mejorar el enfoque y la resistencia',
    'Contribuye a una hidratación óptima durante el entrenamiento',
  ],
  fichaStatus: 'partial',
  price: 40,
  ingredients: [
    {
      emoji: '💪',
      name: 'BCAA (aminoácidos ramificados)',
      description:
        'Aminoácidos esenciales y no esenciales que optimizan la recuperación muscular.',
    },
    {
      emoji: '🧬',
      name: 'Glutamina',
      description:
        'Aminoácido que apoya la reparación muscular y el sistema inmune.',
    },
    {
      emoji: '🐂',
      name: 'Taurina',
      description:
        'Aminoácido que mejora el enfoque mental y la resistencia durante el entrenamiento.',
    },
  ],
  usage:
    'Consumir durante o después del entrenamiento. Mezclar 1 servicio con agua.',
};

// ============================================================================
// 17. AMINOSTACK FRAMBUESA — Rendimiento ($40)
//     Fuente: sitio antiguo nutrition10k.com/2025/05/13/aminostack-frambuesa/
//     BCAA + Glutamina + Aminoácidos + Taurina · sabor frambuesa
// ============================================================================

export const aminoStackFrambuesa: NutritionProduct = {
  id: 'aminostack-frambuesa',
  slug: 'aminostack-frambuesa',
  name: 'AminoStack Frambuesa',
  tagline: 'BCAA + Glutamina + Aminoácidos + Taurina · Sabor frambuesa',
  description:
    'Maximiza tu recuperación y rendimiento con AminoStack. Esta fórmula avanzada está diseñada para atletas y entusiastas del fitness que buscan optimizar su recuperación muscular e hidratación durante y después del entrenamiento. AminoStack combina una potente mezcla de aminoácidos esenciales y no esenciales, enriquecida con glutamina para apoyar la reparación muscular y taurina para mejorar el enfoque y la resistencia. Además, su formulación contribuye a una hidratación óptima, permitiéndote superar tus límites y alcanzar tus metas más rápido. Formulado y producido en Estados Unidos.',
  category: 'Rendimiento',
  brandColor: '#BE185D', // frambuesa
  brandColorFg: '#FFFFFF',
  format: 'Polvo',
  image: '/products/aminostack-frambuesa/AminoStackF01.webp',
  images: [
    '/products/aminostack-frambuesa/AminoStackF01.webp',
    '/products/aminostack-frambuesa/AminoStackF02.webp',
    '/products/aminostack-frambuesa/AminoStackF04.webp',
    '/products/aminostack-frambuesa/AminoStackF05.webp',
    '/products/aminostack-frambuesa/AminoStackF06.webp',
    '/products/aminostack-frambuesa/AminoStackF07.webp',
    '/products/aminostack-frambuesa/AminoStackF08.webp',
  ],
  sizes: ['Pote · 30 servicios'],
  benefits: [
    'Mezcla de aminoácidos esenciales y no esenciales',
    'Glutamina para la reparación muscular',
    'Taurina para mejorar el enfoque y la resistencia',
    'Contribuye a una hidratación óptima durante el entrenamiento',
  ],
  fichaStatus: 'partial',
  price: 40,
  ingredients: [
    {
      emoji: '💪',
      name: 'BCAA (aminoácidos ramificados)',
      description:
        'Aminoácidos esenciales y no esenciales que optimizan la recuperación muscular.',
    },
    {
      emoji: '🧬',
      name: 'Glutamina',
      description:
        'Aminoácido que apoya la reparación muscular y el sistema inmune.',
    },
    {
      emoji: '🐂',
      name: 'Taurina',
      description:
        'Aminoácido que mejora el enfoque mental y la resistencia durante el entrenamiento.',
    },
  ],
  usage:
    'Consumir durante o después del entrenamiento. Mezclar 1 servicio con agua.',
};

// ============================================================================
// CATÁLOGO EXPORTADO
// ============================================================================

export const PRODUCTS: NutritionProduct[] = [
  byeByeBelly,
  chocoPuff,
  keto10k,
  aliensBlocker,
  detox,
  cla10k,
  magic10k,
  wheyProteinSpaceEditionEnvase,
  wheyProteinChocolate,
  wheyProteinVainilla,
  wheyProteinCookiesAndCream,
  omg,
  forever,
  creatineXplosion,
  aminoStackLimon,
  aminoStackFrambuesa,
];

/** Productos con ficha técnica completa (ingredientes detallados) */
export const COMPLETE_PRODUCTS = PRODUCTS.filter(
  (p) => p.fichaStatus === 'complete',
);

/** Productos con ficha parcial (beneficios + uso, sin desglose de ingredientes) */
export const PARTIAL_PRODUCTS = PRODUCTS.filter(
  (p) => p.fichaStatus === 'partial',
);

/** Productos pendientes de ficha técnica */
export const PENDING_PRODUCTS = PRODUCTS.filter(
  (p) => p.fichaStatus === 'pending',
);

/** Helper para buscar por slug */
export function getProductBySlug(slug: string): NutritionProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Helper para filtrar por categoría */
export function getProductsByCategory(
  category: ProductCategory,
): NutritionProduct[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** Cuenta de productos por categoría (para pills de filtro con conteo) */
export function getCategoryCounts(): Record<ProductCategory, number> {
  const counts = {} as Record<ProductCategory, number>;
  for (const cat of CATEGORIES) {
    counts[cat.id] = PRODUCTS.filter((p) => p.category === cat.id).length;
  }
  return counts;
}
