// ─── Spice / serving / priority options ──────────────────────────────────────
export const SPICE_LEVELS  = ['Mild', 'Medium', 'Hot', 'Extra Hot']
export const SERVING_SIZES = ['Quarter', 'Half', 'Full', 'Double']

export const PRIORITIES = [
  { value: 1, label: 'High',   color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 2, label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 3, label: 'Low',    color: 'bg-gray-100 text-gray-600 border-gray-200' },
]

// ─── Customize rules per section / dish type ──────────────────────────────────
// First matching rule wins. Falls back to DEFAULT_CUSTOMIZE_CONFIG.
export const CUSTOMIZE_RULES = [
  {
    match: ['beverage', 'drink', 'juice', 'tea', 'coffee', 'mojito', 'jaljeera', 'shikanji',
            'colada', 'cooler', 'shots', 'aerated', 'mineral water', 'milk shake'],
    config: { spice: false, serving: false, priority: false, notes: true },
  },
  {
    match: ['soup', 'shorba', 'manchow', 'minestrone'],
    config: { spice: true, serving: false, priority: true, notes: true },
  },
  {
    match: ['salad', 'chaat', 'raita', 'yogurt', 'achar', 'pickle', 'papad', 'onion',
            'accompaniment', 'fruit', 'kimchi', 'sprout', 'lacha', 'sirka'],
    config: { spice: false, serving: false, priority: false, notes: true },
  },
  {
    match: ['bread', 'roti', 'naan', 'paratha', 'kulcha', 'missi', 'phulka'],
    config: {
      spice: false, serving: true,
      servingSizes: ['2 pcs', '4 pcs', '6 pcs', 'Full Basket'],
      priority: true, notes: true,
    },
  },
  {
    match: ['rice', 'biryani', 'salan', 'pulao'],
    config: {
      spice: true, serving: true,
      servingSizes: ['Half', 'Full', 'Double'],
      priority: true, notes: true,
    },
  },
  {
    match: ['sweet', 'dessert', 'halwa', 'kheer', 'jamun', 'jalebi', 'kulfi',
            'ice cream', 'rasmalai', 'pastry', 'ghevar', 'rabri'],
    config: {
      spice: false, serving: true,
      servingSizes: ['1 pc', '2 pcs', '4 pcs', 'Regular', 'Large'],
      priority: true, notes: true,
    },
  },
  {
    match: ['live', 'teppanyaki', 'assembly', 'phera', 'dim-sum', 'dim sum',
            'bruschetta', 'vol-au-vent', 'crostini', 'shawarma'],
    config: { spice: false, serving: false, priority: false, notes: true },
  },
  {
    match: ['pasta', 'italian', 'continental', 'risotto', 'garlic bread'],
    config: {
      spice: true, spiceLevels: ['Mild', 'Medium'],
      serving: true, servingSizes: ['Regular', 'Large'],
      priority: true, notes: true,
    },
  },
  {
    match: ['chinese', 'asian', 'noodle', 'manchurian', 'szechuan', 'schezwan',
            'hakka', 'fried rice', 'kung pao'],
    config: {
      spice: true, spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      serving: true, servingSizes: ['Half', 'Full', 'Double'],
      priority: true, notes: true,
    },
  },
  {
    match: ['snack', 'starter', 'pass around', 'tikka', 'kebab', 'kabab', 'chaap',
            'spring roll', 'potato', 'golden coin', 'idli', 'moonglet'],
    config: {
      spice: true, serving: true,
      servingSizes: ['Quarter', 'Half', 'Full'],
      priority: true, notes: true,
    },
  },
  {
    match: ['main course', 'curry', 'paneer', 'dal', 'kadhi', 'chole', 'aloo',
            'gobhi', 'chicken', 'mutton', 'fish', 'butter chicken', 'rogan',
            'subz', 'kofta', 'malai', 'handi', 'dhaba'],
    config: {
      spice: true, serving: true,
      servingSizes: ['Quarter', 'Half', 'Full', 'Double'],
      priority: true, notes: true,
    },
  },
]

export const DEFAULT_CUSTOMIZE_CONFIG = {
  spice: true, serving: true, servingSizes: SERVING_SIZES, priority: true, notes: true,
}

// ─── Smart default selections per section keyword ────────────────────────────
export const DEFAULT_PER_SECTION = 3

export const SECTION_DEFAULTS = {
  beverage:        ['Mineral Water Bottles 250ml', 'Coke', 'Sprite', 'Aerated Drinks', 'Jaljeera', 'Shikanji'],
  drink:           ['Mineral Water Bottles 250ml', 'Coke', 'Sprite'],
  snack:           ['Paneer Tikka Shashlik', 'Honey Chilly Potato', 'Honey Chilli Potatoes', 'Golden Coin', 'Afghani Malai Chaap'],
  'pass around':   ['Paneer Tikka Shashlik', 'Honey Chilli Potatoes', 'Honey Chilly Potato', 'Golden Coin'],
  'non-vegetarian':['Murgh Malai Tikka', 'Mutton Seekh Kabab', 'Amritsari Fish', 'Lahori Fish Tikka'],
  chaat:           ['Golgappe with varieties of water (Ambala Style)', 'Crispy Aloo Tikki (Agra Style)', 'Bhalla Papdi (Haridwar Style)'],
  soup:            ['Tamatar Dhaniya Ka Shorba', 'Sweet Corn Soup', 'Veg Manchow Soup', 'Cream of Tomato', 'Lemon Coriander Soup'],
  salad:           ['Ever-Green Salad', 'Ambria Garden Salad', 'Aloo Chana Chaat', 'Sirka Pyaaz', 'Lacha Onions'],
  accompaniment:   ['Mixed Vegetable Raita', 'Achar', 'Roasted Papad'],
  yogurt:          ['Mixed Vegetable Raita', 'Boondi Raita', 'Plain Yogurt'],
  'main course':   ['Paneer Lababdar', "Dal-E-Ambria (Chef's Special)", 'Dum Aloo Kashmiri', 'Gobhi Masala', 'Palak Paneer'],
  'indian cuisine':['Paneer Lababdar', "Dal-E-Ambria (Chef's Special)", 'Dum Aloo Kashmiri'],
  'butter chicken':['Butter Chicken'],
  'non-veg':       ['Butter Chicken', 'Mutton Rogan Josh', 'Dhaba Chicken'],
  live:            ['Dal Tadka With Tawa Phulka', 'Assorted Vegetables On Tawa', 'Lucknowi Delicacy Galouti Kabab'],
  bread:           ['Tandoori Roti', 'Plain & Butter Naan', 'Plain / Butter / Garlic Naan', 'Laccha Paratha', 'Lachha Paratha'],
  roti:            ['Tandoori Roti', 'Plain & Butter Naan'],
  naan:            ['Plain & Butter Naan', 'Plain / Butter / Garlic Naan', 'Tandoori Roti'],
  paratha:         ['Laccha Paratha', 'Lachha Paratha', 'Tandoori Roti'],
  rice:            ['Steamed Rice', 'Hyderabadi Subz Dum Biryani', 'Hyderabadi Chicken Dum Biryani', 'Chicken Dum Biryani'],
  biryani:         ['Hyderabadi Subz Dum Biryani', 'Hyderabadi Chicken Dum Biryani', 'Chicken Dum Biryani', 'Steamed Rice'],
  'pan asian':     ['Vegetable Hakka Noodles', 'Garlic Onion Fried Rice', 'Veg Manchurian'],
  chinese:         ['Vegetable Hakka Noodles', 'Garlic Onion Fried Rice', 'Veg Manchurian Gravy', 'Sliced Chicken in Szechuan Sauce'],
  teppanyaki:      ['Sautéed Vegetables', 'Tossed With', 'Served With'],
  italian:         ['Choice of Whole Wheat Pasta', 'Choice of Sauces', 'Served With Garlic Bread'],
  pasta:           ['Choice of Whole Wheat Pasta', 'Choice of Sauces'],
  continental:     ['Butter Lemon Fish'],
  sweet:           ['Gulab Jamun', 'Moong Dal Halwa', 'Gulab Kheer', 'Nano Jalebi With Rabri-Live'],
  dessert:         ['Gulab Jamun', 'Assorted Ice Cream', 'Ice-Cream Parlor', 'Gulab Kheer'],
  halwa:           ['Moong Dal Halwa (Live)', 'Gajar Halwa / Beetroot Halwa (Seasonal)'],
  'ice cream':     ['Assorted Ice Cream', 'Ice-Cream Parlor'],
  kulfi:           ['Tilla Kulfi (Live)'],
  cold:            ['Gulab Kheer', 'Kesari Rasmalai', 'Assorted Pastries', 'Ice-Cream Parlor'],
  hot:             ['Gulab Jamun', 'Nano Jalebi With Rabri-Live', 'Moong Dal Halwa (Live)'],
  tea:             ['Tea', 'Coffee'],
  coffee:          ['Coffee', 'Tea'],
  fruit:           ['5 Indian & 5 Imported Fruits'],
  assembly:        ['Assembly Menu'],
  phera:           ['Phera Menu'],
}

// ─── Crockery / serving-ware subtitle per section ────────────────────────────
// Maps a section name (lowercase contains) → human-readable serving ware label
export const CROCKERY_MAP = [
  { match: ['beverage', 'drink', 'juice', 'tea', 'coffee', 'hot beverage'], label: 'Standard Glass Tumblers' },
  { match: ['chaat', 'golgappe'],                                            label: 'Chaat Paper Plates' },
  { match: ['fruit counter'],                                                label: 'Fruit Display Platter' },
  { match: ['pass around', 'snack', 'starter', 'pre-dining'],                label: 'Stainless Steel Platter' },
  { match: ['live counter', 'teppanyaki', 'italian', 'continental', 'pasta'],label: 'Live Counter Plates' },
  { match: ['soup'],                                                          label: 'Ceramic Soup Bowl' },
  { match: ['salad'],                                                         label: 'Standard Steel Thali' },
  { match: ['accompaniment', 'yogurt', 'raita'],                             label: 'Standard Steel Thali' },
  { match: ['main course', 'indian cuisine', 'non-veg', 'non veg'],          label: 'Standard Steel Thali' },
  { match: ['rice', 'biryani'],                                               label: 'Standard Steel Thali' },
  { match: ['bread', 'roti', 'naan', 'paratha'],                             label: 'Standard Steel Thali' },
  { match: ['pan asian', 'chinese', 'asian'],                                 label: 'Standard Steel Thali' },
  { match: ['sweet', 'dessert', 'halwa', 'cold dessert', 'hot dessert'],     label: 'Steel Dessert Bowl' },
  { match: ['assembly', 'phera'],                                             label: 'Disposable Setup' },
]

/** Return the serving-ware subtitle for a section name */
export function sectionCrockery(name) {
  const n = name.toLowerCase()
  for (const rule of CROCKERY_MAP) {
    if (rule.match.some(kw => n.includes(kw))) return rule.label
  }
  return 'Standard Steel Thali'
}

// ─── Pure helper functions ────────────────────────────────────────────────────

/** Unique item key used as a map key throughout the menu state */
export function itemKey(secIdx, itemIdx) {
  return `${secIdx}__${itemIdx}`
}

/** Return the PRIORITIES entry for a priority value (defaults to Medium) */
export function priorityMeta(val) {
  return PRIORITIES.find(p => p.value === val) ?? PRIORITIES[1]
}

/** Return a colour code for a menu section (used to render a dot) */
export function sectionColor(name) {
  const n = name.toLowerCase()
  if (n.includes('beverage') || n.includes('drink') || n.includes('juice') || n.includes('tea') || n.includes('coffee')) return '#38bdf8' // sky
  if (n.includes('chaat') || n.includes('golgappe'))  return '#fb923c' // orange
  if (n.includes('soup'))    return '#f97316' // amber-orange
  if (n.includes('salad'))   return '#4ade80' // green
  if (n.includes('snack') || n.includes('pass around') || n.includes('starter')) return '#facc15' // yellow
  if (n.includes('bread') || n.includes('roti') || n.includes('naan') || n.includes('paratha')) return '#d4a96a' // wheat
  if (n.includes('rice') || n.includes('biryani'))   return '#fbbf24' // gold
  if (n.includes('dessert') || n.includes('sweet') || n.includes('halwa') || n.includes('ice cream')) return '#f472b6' // pink
  if (n.includes('non-veg') || n.includes('non veg') || n.includes('chicken') || n.includes('mutton') || n.includes('fish')) return '#f87171' // red
  if (n.includes('veg') || n.includes('paneer') || n.includes('dal') || n.includes('subz')) return '#86efac' // light-green
  if (n.includes('live') || n.includes('teppanyaki') || n.includes('counter')) return '#a78bfa' // purple
  if (n.includes('pasta') || n.includes('italian') || n.includes('continental')) return '#fdba74' // peach
  if (n.includes('asian') || n.includes('chinese') || n.includes('noodle')) return '#67e8f9' // cyan
  if (n.includes('fruit'))   return '#f9a8d4' // rose
  if (n.includes('accompaniment') || n.includes('yogurt') || n.includes('raita')) return '#e2e8f0' // white-ish
  if (n.includes('symphony') || n.includes('indi')) return '#c9a84c' // gold
  if (n.includes('assembly') || n.includes('phera')) return '#94a3b8' // slate
  return '#c9a84c' // default gold
}

/** Return a coloured dot element (as inline style object) for a section — replaces emoji */
export function sectionIcon(name) {
  return sectionColor(name)
}

/** Returns true when a section name indicates non-veg content */
export function isNonVegSection(name) {
  const n = name.toLowerCase()
  return n.includes('non-veg') || n.includes('non veg') || n.includes('nonveg')
}

/** Resolve the per-item customize config (spice/serving/priority/notes toggles) */
export function getCustomizeConfig(sectionName = '', itemName = '') {
  const haystack = `${sectionName} ${itemName}`.toLowerCase()
  for (const rule of CUSTOMIZE_RULES) {
    if (rule.match.some(kw => haystack.includes(kw))) {
      return {
        ...DEFAULT_CUSTOMIZE_CONFIG,
        ...rule.config,
        spiceLevels:     rule.config.spiceLevels  ?? SPICE_LEVELS,
        servingSizes:    rule.config.servingSizes  ?? SERVING_SIZES,
        notesPlaceholder: '',
      }
    }
  }
  return { ...DEFAULT_CUSTOMIZE_CONFIG, spiceLevels: SPICE_LEVELS, servingSizes: SERVING_SIZES, notesPlaceholder: '' }
}
