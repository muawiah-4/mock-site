export type DialOption = { id: string; label: string; hex: string };
export type StrapOption = { id: "bracelet" | "leather" | "rubber"; label: string; color: string };
export type SizeOption = { id: string; label: string; scale: number };

export const DIAL_OPTIONS: DialOption[] = [
  { id: "blue", label: "PRX Blue", hex: "#16324c" },
  { id: "black", label: "Onyx Black", hex: "#101112" },
  { id: "silver", label: "Silver Sunray", hex: "#c7ccce" },
  { id: "green", label: "Racing Green", hex: "#193c30" },
  { id: "mop", label: "Mother-of-Pearl White", hex: "#eae7e1" },
];

export const STRAP_OPTIONS: StrapOption[] = [
  { id: "bracelet", label: "Steel Bracelet", color: "#c9cdcf" },
  { id: "leather", label: "Leather Strap", color: "#1b1b1d" },
  { id: "rubber", label: "Rubber Strap", color: "#1b1b1d" },
];

export const SIZE_OPTIONS: SizeOption[] = [
  { id: "35", label: "35mm", scale: 0.86 },
  { id: "40", label: "40mm", scale: 1 },
];

export type Collection = {
  id: string;
  name: string;
  tagline: string;
  description: string;
};

export const COLLECTIONS: Collection[] = [
  {
    id: "prx",
    name: "PRX",
    tagline: "The icon, reengineered",
    description:
      "The 1970s integrated-bracelet silhouette that started it all, rebuilt with a modern Swiss automatic movement.",
  },
  {
    id: "gentleman",
    name: "Gentleman",
    tagline: "Classic elegance, worn daily",
    description: "A thin, round dress watch built for the boardroom and everything after it.",
  },
  {
    id: "seastar",
    name: "Seastar",
    tagline: "Built for depth",
    description: "A dive-rated tool watch with a unidirectional bezel and 300m of water resistance.",
  },
  {
    id: "everytime",
    name: "Everytime",
    tagline: "Minimal, always",
    description: "An ultra-thin, distraction-free dial designed to disappear under a cuff.",
  },
  {
    id: "t-touch",
    name: "T-Touch",
    tagline: "Technical precision",
    description: "A tactile-sapphire hybrid — altimeter, compass, and chronograph in one analog case.",
  },
  {
    id: "heritage",
    name: "Heritage",
    tagline: "Vintage, reborn",
    description: "Archive-inspired cases and dials, reissued with contemporary movements.",
  },
];

const dial = (id: string) => DIAL_OPTIONS.find((d) => d.id === id)!;
const strap = (id: StrapOption["id"]) => STRAP_OPTIONS.find((s) => s.id === id)!;
const size = (id: string) => SIZE_OPTIONS.find((s) => s.id === id)!;

export type WatchVariant = {
  slug: string;
  name: string;
  collectionId: string;
  price: number;
  dial: DialOption;
  strap: StrapOption;
  size: SizeOption;
  blurb: string;
  /** Path under /public, or null if real photography hasn't been supplied yet. */
  heroImage: string | null;
  specs: {
    movement: string;
    caseDiameter: string;
    waterResistance: string;
    crystal: string;
    material: string;
    bracelet: string;
    powerReserve?: string;
  };
};

export const CATALOG: WatchVariant[] = [
  {
    slug: "prx-powermatic-80-blue",
    name: "PRX Powermatic 80",
    collectionId: "prx",
    price: 1150,
    dial: dial("blue"),
    strap: strap("bracelet"),
    size: size("40"),
    blurb: "The icon that revived the 1970s integrated-bracelet silhouette, now automatic.",
    heroImage: "/watches/prx-blue-powermatic-flat.jpg",
    specs: {
      movement: "Swiss Automatic, Powermatic 80",
      caseDiameter: "40mm",
      waterResistance: "100m / 10 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed & polished stainless steel",
      bracelet: "Integrated steel, quick-release",
      powerReserve: "Up to 80 hours",
    },
  },
  {
    slug: "prx-powermatic-80-black",
    name: "PRX Powermatic 80",
    collectionId: "prx",
    price: 1150,
    dial: dial("black"),
    strap: strap("bracelet"),
    size: size("40"),
    blurb: "Onyx-black sunray dial for a sharper, more graphic read on the wrist.",
    heroImage: "/watches/prx-black-flat.jpg",
    specs: {
      movement: "Swiss Automatic, Powermatic 80",
      caseDiameter: "40mm",
      waterResistance: "100m / 10 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed & polished stainless steel",
      bracelet: "Integrated steel, quick-release",
      powerReserve: "Up to 80 hours",
    },
  },
  {
    slug: "prx-quartz-mop-35",
    name: "PRX Quartz",
    collectionId: "prx",
    price: 495,
    dial: dial("mop"),
    strap: strap("bracelet"),
    size: size("35"),
    blurb: "A mother-of-pearl dial gives the compact 35mm quartz reference a soft, luminous finish.",
    heroImage: "/watches/prx-mop-white.jpg",
    specs: {
      movement: "Swiss Quartz",
      caseDiameter: "35mm",
      waterResistance: "100m / 10 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed & polished stainless steel",
      bracelet: "Integrated steel, quick-release",
    },
  },
  {
    slug: "prx-quartz-blue-35",
    name: "PRX Quartz",
    collectionId: "prx",
    price: 525,
    dial: dial("blue"),
    strap: strap("bracelet"),
    size: size("35"),
    blurb: "The compact 35mm quartz reference in the brand's signature blue — precise, everyday, unmistakably PRX.",
    heroImage: "/watches/prx-blue-quartz-flat.jpg",
    specs: {
      movement: "Swiss Quartz",
      caseDiameter: "35mm",
      waterResistance: "100m / 10 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed & polished stainless steel",
      bracelet: "Integrated steel, quick-release",
    },
  },
  {
    slug: "prx-powermatic-80-green",
    name: "PRX Powermatic 80",
    collectionId: "prx",
    price: 1075,
    dial: dial("green"),
    strap: strap("bracelet"),
    size: size("40"),
    blurb: "Racing-green textured dial on the integrated steel bracelet — the quieter, dressier PRX.",
    heroImage: "/watches/prx-green-bracelet.jpg",
    specs: {
      movement: "Swiss Automatic, Powermatic 80",
      caseDiameter: "40mm",
      waterResistance: "100m / 10 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed & polished stainless steel",
      bracelet: "Integrated steel, quick-release",
      powerReserve: "Up to 80 hours",
    },
  },
  {
    slug: "gentleman-powermatic-80",
    name: "Gentleman Powermatic 80 Silicium",
    collectionId: "gentleman",
    price: 925,
    dial: dial("black"),
    strap: strap("bracelet"),
    size: size("40"),
    blurb: "A thin, classic round case on a polished steel bracelet, with a silicon hairspring for daily precision.",
    heroImage: "/watches/gentleman-powermatic-80.jpg",
    specs: {
      movement: "Swiss Automatic, Powermatic 80 Silicium",
      caseDiameter: "40mm",
      waterResistance: "100m / 10 bar",
      crystal: "Domed scratch-resistant sapphire",
      material: "Polished & brushed stainless steel",
      bracelet: "Steel bracelet",
      powerReserve: "Up to 80 hours",
    },
  },
  {
    slug: "seastar-1000-chronograph",
    name: "Seastar 1000 Chronograph",
    collectionId: "seastar",
    price: 595,
    dial: dial("blue"),
    strap: strap("bracelet"),
    size: size("40"),
    blurb: "A dive-rated chronograph with a unidirectional bezel and 300m of water resistance.",
    heroImage: "/watches/seastar-1000-chrono.jpg",
    specs: {
      movement: "Swiss Quartz Chronograph",
      caseDiameter: "45.5mm",
      waterResistance: "300m / 30 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Stainless steel, unidirectional dive bezel",
      bracelet: "Stainless steel mesh bracelet",
    },
  },
  {
    slug: "everytime-30",
    name: "Everytime 30",
    collectionId: "everytime",
    price: 375,
    dial: dial("silver"),
    strap: strap("bracelet"),
    size: size("35"),
    blurb: "An ultra-thin, distraction-free dial on a fine-linked steel bracelet.",
    heroImage: "/watches/everytime-30.jpg",
    specs: {
      movement: "Swiss Quartz",
      caseDiameter: "30mm",
      waterResistance: "30m / 3 bar",
      crystal: "Scratch-resistant sapphire",
      material: "Brushed stainless steel",
      bracelet: "Steel bracelet",
    },
  },
  {
    slug: "t-touch-connect-solar",
    name: "T-Touch Connect Solar",
    collectionId: "t-touch",
    price: 995,
    dial: dial("black"),
    strap: strap("rubber"),
    size: size("40"),
    blurb: "Altimeter, compass, and chronograph — a tactile-sapphire hybrid that never needs a battery change.",
    heroImage: "/watches/t-touch-connect.jpg",
    specs: {
      movement: "Swiss Quartz, Solar",
      caseDiameter: "45mm",
      waterResistance: "100m / 10 bar",
      crystal: "Tactile sapphire",
      material: "Titanium",
      bracelet: "Rubber strap",
    },
  },
  {
    slug: "heritage-visodate",
    name: "Heritage Visodate",
    collectionId: "heritage",
    price: 745,
    dial: dial("silver"),
    strap: strap("leather"),
    size: size("40"),
    blurb: "Archive-inspired case and dial from the 1950s, reissued with a contemporary automatic movement.",
    heroImage: null,
    specs: {
      movement: "Swiss Automatic",
      caseDiameter: "40mm",
      waterResistance: "50m / 5 bar",
      crystal: "Domed scratch-resistant sapphire",
      material: "Polished stainless steel",
      bracelet: "Cognac leather strap",
      powerReserve: "Up to 38 hours",
    },
  },
];

export function getVariant(slug: string): WatchVariant | undefined {
  return CATALOG.find((v) => v.slug === slug);
}

export function getCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function variantsForCollection(collectionId: string): WatchVariant[] {
  return CATALOG.filter((v) => v.collectionId === collectionId);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value
  );
}
