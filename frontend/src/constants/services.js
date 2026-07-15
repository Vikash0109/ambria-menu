// ─── Pricing ──────────────────────────────────────────────────────────────────
export const WAITER_PRICE_EACH = 100   // ₹100 per waiter

// ─── Staffing ratios ──────────────────────────────────────────────────────────
export const RATIOS = [
  { id: '1:5',  label: '1 : 5',  guestsPerWaiter: 5  },
  { id: '1:10', label: '1 : 10', guestsPerWaiter: 10 },
  { id: '1:15', label: '1 : 15', guestsPerWaiter: 15 },
]
export const DEFAULT_RATIO = '1:10'

// ─── Outfit catalogue ─────────────────────────────────────────────────────────
// isDefault → included in package at no extra cost
// price     → add-on charge per outfit per waiter
export const OUTFITS = [
  { id: 'kurta-white',   label: 'White Kurta',    color: '#f5f0e8', price: 0,   isDefault: true  },
  { id: 'kurta-black',   label: 'Black Sherwani', color: '#2d2d2d', price: 150, isDefault: false },
  { id: 'vest-gold',     label: 'Gold Waistcoat', color: '#c8902e', price: 200, isDefault: false },
  { id: 'suit-navy',     label: 'Navy Suit',       color: '#1e3a5f', price: 250, isDefault: false },
  { id: 'pathani-beige', label: 'Beige Pathani',  color: '#d4c5a9', price: 180, isDefault: false },
  { id: 'indo-maroon',   label: 'Maroon Indo',    color: '#800000', price: 175, isDefault: false },
]

/** Returns the price of an outfit by id */
export function outfitPrice(id) {
  return OUTFITS.find(o => o.id === id)?.price ?? 0
}

// ─── Crockery plate types ─────────────────────────────────────────────────────
// isDefault → included in package (shown as "INCLUDED")
// price     → additional per-guest charge on top of the base (steel)
export const DEFAULT_PLATE_ID = 'steel'

export const PLATE_OPTIONS = [
  {
    id:          'steel',
    label:       'Standard Steel Thali',
    shortLabel:  'Steel',
    icon:        'steel',
    description: 'Classic stainless steel thali & cutlery',
    price:       0,
    isDefault:   true,
  },
  {
    id:          'ceramic',
    label:       'Premium Ceramic',
    shortLabel:  'Ceramic',
    icon:        'ceramic',
    description: 'Glazed ceramic dinnerware, wedding buffet style',
    price:       40,
    isDefault:   false,
  },
  {
    id:          'bone-china',
    label:       'Bone China',
    shortLabel:  'Bone China',
    icon:        'bone-china',
    description: 'Fine bone china with gold rim detailing',
    price:       75,
    isDefault:   false,
  },
  {
    id:          'melamine',
    label:       'Melamine',
    shortLabel:  'Melamine',
    icon:        'melamine',
    description: 'Durable melamine set, ideal for outdoor events',
    price:       20,
    isDefault:   false,
  },
  {
    id:          'disposable',
    label:       'Disposable',
    shortLabel:  'Disposable',
    icon:        'disposable',
    description: 'Eco-friendly single-use plates & cutlery',
    price:       0,
    isDefault:   false,
  },
]

// ─── Per-station crockery catalogue ──────────────────────────────────────────
// Each station type maps to its own set of tableware options.
// The first option is always the default (INCLUDED).

export const STATION_CROCKERY = {
  // ── Chaat / Street food stations ─────────────────────────────────────────
  chaat: [
    { id: 'pattal-donna',    label: 'Pattal & Donna',       description: 'Traditional leaf plates & bowls — rustic and eco-friendly',     price: 0,  isDefault: true  },
    { id: 'earthen-kulhad',  label: 'Earthen Kulhad Set',   description: 'Clay plates and kulhads for an authentic street-style touch',    price: 20, isDefault: false },
    { id: 'steel-chaat',     label: 'Steel Chaat Set',      description: 'Classic stainless steel chaat plates & katoris',                price: 15, isDefault: false },
    { id: 'silver-chaat',    label: 'Silver-Finish Chaat Set', description: 'Premium silver-finish plates for an elevated chaat counter',  price: 45, isDefault: false },
  ],
  // ── Main course / general ─────────────────────────────────────────────────
  main: [
    { id: 'steel',           label: 'Standard Steel Thali', description: 'Classic stainless steel thali & cutlery',                       price: 0,  isDefault: true  },
    { id: 'ceramic',         label: 'Premium Ceramic',      description: 'Glazed ceramic dinnerware, wedding buffet style',               price: 40, isDefault: false },
    { id: 'bone-china',      label: 'Bone China',           description: 'Fine bone china with gold rim detailing',                       price: 75, isDefault: false },
    { id: 'royal-silver',    label: 'Royal Silverware',     description: 'Silver-plated cutlery & serving ware, royal wedding look',      price: 120, isDefault: false },
  ],
  // ── Beverages ─────────────────────────────────────────────────────────────
  beverage: [
    { id: 'glass-standard',  label: 'Standard Glass Tumblers', description: 'Classic clear glass tumblers for the drinks counter',       price: 0,  isDefault: true  },
    { id: 'kulhad-glass',    label: 'Kulhad Glasses',       description: 'Earthen kulhad glasses for an authentic desi touch',           price: 20, isDefault: false },
    { id: 'copper-glass',    label: 'Copper Glasses',       description: 'Traditional copper glasses, said to add a royal charm',        price: 30, isDefault: false },
    { id: 'crystal-glass',   label: 'Crystal Glassware',    description: 'Elegant crystal-cut glasses for a premium bar setup',         price: 65, isDefault: false },
  ],
  // ── Soup / Starters ───────────────────────────────────────────────────────
  soup: [
    { id: 'ceramic-bowl',    label: 'Ceramic Soup Bowl',    description: 'Glazed ceramic bowls with saucers, clean and elegant',         price: 0,  isDefault: true  },
    { id: 'bone-china-bowl', label: 'Bone China Bowl',      description: 'Fine bone china soup bowls with gold rim',                     price: 35, isDefault: false },
    { id: 'kulhad-soup',     label: 'Earthen Kulhad',       description: 'Rustic earthen cups for a traditional soup experience',        price: 10, isDefault: false },
    { id: 'copper-bowl',     label: 'Copper Bowl',          description: 'Polished copper bowls for a premium presentation',             price: 50, isDefault: false },
  ],
  // ── Dessert ───────────────────────────────────────────────────────────────
  dessert: [
    { id: 'steel-dessert',   label: 'Steel Dessert Bowl',   description: 'Classic steel katoris and plates for desserts',                price: 0,  isDefault: true  },
    { id: 'ceramic-dessert', label: 'Ceramic Dessert Set',  description: 'Glazed ceramic dessert plates & bowls',                        price: 25, isDefault: false },
    { id: 'bone-china-dessert', label: 'Bone China Dessert', description: 'Fine bone china dessert set with gold accents',               price: 60, isDefault: false },
    { id: 'disposable-eco',  label: 'Eco Disposable',       description: 'Compostable eco-friendly dessert cups & plates',               price: 5,  isDefault: false },
  ],
}

/** Map a section name to a crockery category key */
export function crockeryTypeForSection(sectionName) {
  const n = sectionName.toLowerCase()
  if (n.includes('beverage') || n.includes('drink') || n.includes('juice') || n.includes('tea') || n.includes('coffee')) return 'beverage'
  if (n.includes('soup'))   return 'soup'
  if (n.includes('chaat') || n.includes('golgappe') || n.includes('street')) return 'chaat'
  if (n.includes('dessert') || n.includes('sweet') || n.includes('halwa') || n.includes('ice cream')) return 'dessert'
  return 'main'
}

/** Get the options array for a given section name */
export function plateOptionsForSection(sectionName) {
  const key = crockeryTypeForSection(sectionName)
  return STATION_CROCKERY[key]
}

/** Get default plate id for a given section */
export function defaultPlateForSection(sectionName) {
  return plateOptionsForSection(sectionName)[0].id
}

/** Get price for a specific plate id under a given section */
export function platePriceForSection(sectionName, plateId) {
  return plateOptionsForSection(sectionName).find(p => p.id === plateId)?.price ?? 0
}

// nonVegOnly: true → hidden for veg preference
export const VENDORS = [
  { id: 'mcdonalds',   label: "McDonald's",  price: 5000, color: '#DA291C', nonVegOnly: false, logo: '/vendors/mcdonalds.svg'   },
  { id: 'dominos',     label: "Domino's",    price: 4000, color: '#006491', nonVegOnly: false, logo: '/vendors/dominos.svg'     },
  { id: 'haldirams',   label: 'Haldirams',   price: 3500, color: '#C8131A', nonVegOnly: false, logo: '/vendors/haldirams.svg'   },
  { id: 'bikanervala', label: 'Bikanervala', price: 3000, color: '#E31837', nonVegOnly: false, logo: '/vendors/bikanervala.svg' },
  { id: 'subway',      label: 'Subway',      price: 3500, color: '#008C15', nonVegOnly: false, logo: '/vendors/subway.png'      },
  { id: 'kfc',         label: 'KFC',         price: 5500, color: '#E4002B', nonVegOnly: true,  logo: '/vendors/kfc.svg'         },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function waiterCountForRatio(guests, ratioId) {
  const ratio = RATIOS.find(r => r.id === ratioId) ?? RATIOS[1]
  return Math.max(1, Math.ceil(guests / ratio.guestsPerWaiter))
}

export function waiterCharge(count) {
  return count * WAITER_PRICE_EACH
}

export function platePrice(plateId) {
  return PLATE_OPTIONS.find(p => p.id === plateId)?.price ?? 0
}

/** Reads unique section names from the feast-selected-items sessionStorage key. */
export function getSectionsFromSaved() {
  try {
    const items = JSON.parse(window.sessionStorage.getItem('feast-selected-items') || '[]')
    const seen = new Set()
    const sections = []
    for (const item of items) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category)
        sections.push(item.category)
      }
    }
    return sections
  } catch {
    return []
  }
}
