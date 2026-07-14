/**
 * Static seed data for the MenuItem collection.
 * Imported by server.js on startup (upserted, never duplicated).
 */
export const SEED_MENU_ITEMS = [
  // ── BOTH tiers — Veg ──────────────────────────────────────────────────────
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled in a tandoor with spiced yogurt coating.',
    price: '₹220', category: 'Starter', menuTier: 'both', isVeg: true,
    spiceLevels: ['Mild', 'Medium', 'Hot'], portionSizes: ['Quarter', 'Half', 'Full'],
    tags: ['Tandoor', 'Crowd favorite'], gradient: 'from-orange-400 via-amber-500 to-yellow-600', available: true,
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils simmered overnight with butter and cream.',
    price: '₹180', category: 'Main Course', menuTier: 'both', isVeg: true,
    spiceLevels: ['Mild', 'Medium'], portionSizes: ['Half', 'Full'],
    tags: ['Signature', 'Comfort food'], gradient: 'from-red-800 via-rose-700 to-amber-800', available: true,
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup.',
    price: '₹120', category: 'Dessert', menuTier: 'both', isVeg: true,
    spiceLevels: [], portionSizes: ['2 pcs', '4 pcs'],
    tags: ['Sweet', 'Classic'], gradient: 'from-amber-700 via-orange-600 to-rose-600', available: true,
  },
  // ── STANDARD — Veg ────────────────────────────────────────────────────────
  {
    id: 'veg-biryani',
    name: 'Veg Dum Biryani',
    description: 'Fragrant basmati rice layered with seasonal vegetables and whole spices, slow-cooked in dum style.',
    price: '₹200', category: 'Rice', menuTier: 'standard', isVeg: true,
    spiceLevels: ['Mild', 'Medium', 'Hot'], portionSizes: ['Half', 'Full'],
    tags: ['Dum cooked', 'Aromatic'], gradient: 'from-yellow-600 via-amber-600 to-orange-700', available: true,
  },
  {
    id: 'masala-chaas',
    name: 'Masala Chaas',
    description: 'Chilled spiced buttermilk with cumin, ginger, and fresh coriander.',
    price: '₹60', category: 'Beverage', menuTier: 'standard', isVeg: true,
    spiceLevels: ['Mild', 'Tangy'], portionSizes: ['Glass', 'Jug'],
    tags: ['Refreshing', 'Light'], gradient: 'from-teal-400 via-cyan-500 to-sky-600', available: true,
  },
  // ── BOTH tiers — Non-Veg ─────────────────────────────────────────────────
  {
    id: 'chicken-tikka',
    name: 'Chicken Tikka',
    description: 'Boneless chicken pieces marinated in spiced yogurt, char-grilled in a clay oven.',
    price: '₹280', category: 'Starter', menuTier: 'both', isVeg: false,
    spiceLevels: ['Mild', 'Medium', 'Hot'], portionSizes: ['Quarter', 'Half', 'Full'],
    tags: ['Tandoor', 'Bestseller'], gradient: 'from-red-600 via-orange-600 to-amber-500', available: true,
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, velvety tomato-cream sauce with aromatic spices.',
    price: '₹320', category: 'Main Course', menuTier: 'both', isVeg: false,
    spiceLevels: ['Mild', 'Medium'], portionSizes: ['Half', 'Full'],
    tags: ['Creamy', 'Signature'], gradient: 'from-orange-500 via-amber-500 to-yellow-500', available: true,
  },
  // ── STANDARD — Non-Veg ───────────────────────────────────────────────────
  {
    id: 'chicken-biryani',
    name: 'Chicken Dum Biryani',
    description: 'Long-grain basmati rice layered with spiced chicken and caramelised onions, sealed and slow-cooked.',
    price: '₹280', category: 'Rice', menuTier: 'standard', isVeg: false,
    spiceLevels: ['Medium', 'Hot'], portionSizes: ['Half', 'Full'],
    tags: ['Dum cooked', 'Event ready'], gradient: 'from-yellow-700 via-amber-600 to-red-700', available: true,
  },
  // ── PREMIUM — Veg ────────────────────────────────────────────────────────
  {
    id: 'truffle-mushroom-risotto',
    name: 'Truffle Mushroom Risotto',
    description: 'Arborio rice slow-cooked with wild mushrooms, finished with black truffle oil and aged parmesan.',
    price: '₹480', category: 'Main Course', menuTier: 'premium', isVeg: true,
    spiceLevels: ['Mild'], portionSizes: ['Regular', 'Large'],
    tags: ['Gourmet', 'Italian'], gradient: 'from-slate-700 via-stone-600 to-amber-700', available: true,
  },
  {
    id: 'hara-bhara-kebab',
    name: 'Hara Bhara Kebab',
    description: 'Spinach, peas, and potato patties with herbs, served with mint chutney.',
    price: '₹240', category: 'Starter', menuTier: 'premium', isVeg: true,
    spiceLevels: ['Mild', 'Medium'], portionSizes: ['4 pcs', '8 pcs'],
    tags: ['Healthy', 'Green'], gradient: 'from-emerald-500 via-green-600 to-teal-700', available: true,
  },
  {
    id: 'shahi-paneer',
    name: 'Shahi Paneer',
    description: 'Royal cottage cheese in a luxurious cashew-saffron gravy with cardamom cream.',
    price: '₹380', category: 'Main Course', menuTier: 'premium', isVeg: true,
    spiceLevels: ['Mild', 'Medium'], portionSizes: ['Half', 'Full'],
    tags: ['Saffron', 'Royal'], gradient: 'from-yellow-500 via-amber-400 to-orange-500', available: true,
  },
  {
    id: 'rasmalai',
    name: 'Rasmalai',
    description: 'Soft paneer discs soaked in chilled saffron-cardamom milk, garnished with pistachios.',
    price: '₹180', category: 'Dessert', menuTier: 'premium', isVeg: true,
    spiceLevels: [], portionSizes: ['2 pcs', '4 pcs'],
    tags: ['Chilled', 'Festive'], gradient: 'from-yellow-300 via-amber-300 to-orange-400', available: true,
  },
  // ── PREMIUM — Non-Veg ────────────────────────────────────────────────────
  {
    id: 'lamb-raan',
    name: 'Slow Roasted Lamb Raan',
    description: 'Whole leg of lamb marinated 24 hours in aromatic spices, slow-roasted until fall-off-the-bone tender.',
    price: '₹780', category: 'Main Course', menuTier: 'premium', isVeg: false,
    spiceLevels: ['Medium', 'Hot'], portionSizes: ['Half', 'Full'],
    tags: ['Signature', 'Large format'], gradient: 'from-red-900 via-rose-800 to-amber-800', available: true,
  },
  {
    id: 'prawn-malai-curry',
    name: 'Prawn Malai Curry',
    description: 'Tiger prawns in a delicate coconut-milk curry with subtle mustard and turmeric.',
    price: '₹580', category: 'Main Course', menuTier: 'premium', isVeg: false,
    spiceLevels: ['Mild', 'Medium'], portionSizes: ['Half', 'Full'],
    tags: ['Seafood', 'Coastal'], gradient: 'from-yellow-600 via-amber-500 to-orange-400', available: true,
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Dum Biryani',
    description: 'Tender mutton slow-cooked with aged basmati, caramelised onions, and premium whole spices.',
    price: '₹420', category: 'Rice', menuTier: 'premium', isVeg: false,
    spiceLevels: ['Medium', 'Hot'], portionSizes: ['Half', 'Full'],
    tags: ['Premium', 'Dum cooked'], gradient: 'from-amber-800 via-orange-700 to-red-800', available: true,
  },
  {
    id: 'chicken-shorba',
    name: 'Chicken Shorba',
    description: 'Slow-simmered chicken broth with whole spices, finished with cream and fresh herbs.',
    price: '₹160', category: 'Starter', menuTier: 'premium', isVeg: false,
    spiceLevels: ['Mild'], portionSizes: ['Bowl'],
    tags: ['Soup', 'Warming'], gradient: 'from-amber-600 via-yellow-600 to-lime-700', available: true,
  },
]
