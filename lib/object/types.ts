// lib/object/types.ts
//
// Full type contract for the object presentation page.
// Matches the data shape used in the HTML draft at
// collectium.no/app1/collectium-katalog-objekt-view.html.
//
// Resolved from DB 8.4 views:
//   ct_v_catalog_objects_resolved
//   ct_v_catalog_object_images_resolved
//   ct_v_catalog_market_summary
//   ct_v_catalog_year_context
//   ct_v_catalog_relations
//   ct_user_collection_objects
//   ct_user_collection_object_notes
//   ct_user_collection_object_files
//   ct_object_share_links

/* ----------------------------------------------------------------
 * Identifier
 * ---------------------------------------------------------------- */

export type ObjectGroup = "banknote" | "coin" | "collectible";

export type ObjectKey = {
  source_key: string;            // e.g. "norske_sedler"
  object_group: ObjectGroup;
  object_id: number;
};

export type Segment = "samler" | "historie" | "finans" | "minsamling";

export type ViewMode = "horizontal" | "museum" | "compact";

/* ----------------------------------------------------------------
 * Generic field — every value can be missing, and when missing the
 * UI shows "Henter data fra <view_name>" so the user can see exactly
 * where the gap is.
 * ---------------------------------------------------------------- */

export type SourcedValue<T = string> = {
  value: T | null;
  /** Name of the MariaDB view/table this value comes from. */
  source: string;
};

/* ----------------------------------------------------------------
 * Identity (hero / Samler · Identitet)
 * ---------------------------------------------------------------- */

export type ObjectIdentity = {
  title: string;
  sourceCatalogNumber: SourcedValue;
  localCatalogNumber: SourcedValue;
  pickCatalogNumber: SourcedValue;
  denomination: SourcedValue;
  objectYear: SourcedValue;
  publicationYear: SourcedValue;
  country: SourcedValue;
  /** "Seddel" | "Mynt" | "Samleobjekt" */
  objectTypeLabel: string;
};

/* ----------------------------------------------------------------
 * Issue / variant (Samler · Utgave og variant)
 * ---------------------------------------------------------------- */

export type ObjectIssue = {
  denominationIssue: SourcedValue;
  litra: SourcedValue;
  variantType: SourcedValue;
  releaseYear: SourcedValue;
  productionEndYear: SourcedValue;
};

/* ----------------------------------------------------------------
 * People / relations (Historie · Konge, signatur, motiv)
 * ---------------------------------------------------------------- */

export type ObjectPeople = {
  ruler: SourcedValue;
  historicalRuler: SourcedValue;
  signature: SourcedValue;
  leftPortraitSubject: SourcedValue;
  rightPortraitSubject: SourcedValue;
  motif: SourcedValue;
};

/* ----------------------------------------------------------------
 * Rarity (Samler · Raritet og antall)
 * ---------------------------------------------------------------- */

export type ObjectRarity = {
  estimatedByQuantity: SourcedValue;
  catalogAssessment: SourcedValue;
  denominationGroupCount: SourcedValue;
  issueLitraRarityQuantity: SourcedValue;
  signatureQuantity: SourcedValue;
  destroyedQuantity: SourcedValue;
};

/* ----------------------------------------------------------------
 * Images
 * ---------------------------------------------------------------- */

export type ObjectImages = {
  /** All resolved image URLs by mode key. */
  byMode: Partial<Record<ImageMode, string>>;
  source: string;
};

export type ImageMode =
  | "forside"
  | "bakside"
  | "gjennomlysning_forside"
  | "gjennomlysning_bakside"
  | "variant_forside"
  | "variant_bakside"
  | "detalj";

/* ----------------------------------------------------------------
 * Market (Finans)
 * ---------------------------------------------------------------- */

/** Grade codes used by Collectium — international + Norwegian. */
export type GradeCode =
  | "08 VG" | "15 CF" | "25 VF" | "35 CVF" | "45 XF"
  | "53 AUNC" | "60 UNC" | "63 CUNC" | "65 GUNC" | "67 SGUNC";

export type ObjectMarket = {
  /** Per-grade values for the bar chart */
  marketGrades: Partial<Record<GradeCode, SourcedValue>>;
  /** Headline (single) values shown in the hero */
  headlineValue: SourcedValue;
  trend: SourcedValue;
  liquidity: SourcedValue;
  auction: SourcedValue;
  shop: SourcedValue;
  lastSold: SourcedValue;
};

/* ----------------------------------------------------------------
 * Year context (Finans · Publiseringsår, lønn, valuta, hendelser)
 * ---------------------------------------------------------------- */

export type ObjectYearContext = {
  publicationYear: SourcedValue;
  relatedBanknoteYearCount: SourcedValue;
  banknoteCatalogYear: SourcedValue;
  purchasingPowerValue: SourcedValue;
  inflation: SourcedValue;

  averageSalary: SourcedValue;
  nominalSalaryGrowth: SourcedValue;
  annualPriceGrowthPercent: SourcedValue;
  realSalaryGrowth: SourcedValue;
  population: SourcedValue;
  populationChange10YearCount: SourcedValue;

  lendingRateNorway: SourcedValue;
  usdGoldPrice: SourcedValue;
  usdSilverPrice: SourcedValue;
  sekRate: SourcedValue;
  dkkRate: SourcedValue;

  financialEvent: SourcedValue;
  stateBudgetFocus: SourcedValue;
  historicalYearEvents: SourcedValue;
  primeMinister: SourcedValue;
  political_party: SourcedValue;
  financeMinister: SourcedValue;
  historicalUnionPeriod: SourcedValue;
};

/* ----------------------------------------------------------------
 * Related objects / relation links (Historie · Relasjoner)
 * ---------------------------------------------------------------- */

export type ObjectRelationLink = {
  /** "ruler" | "signature" | "motif" | "issue" | "period" | "material" */
  relation_type: string;
  /** Display label, e.g. "Konge / regent: Oscar II" */
  label: string;
  /** One-line description */
  description: string;
  /** action key to feed handleAction (DB 8.4 feature_key) */
  action_key: string;
  /** Optional href to the relation page */
  href?: string;
};

/* ----------------------------------------------------------------
 * User's own collection slice (Min Samling)
 * ---------------------------------------------------------------- */

export type ObjectCollection = {
  isInCollection: boolean;
  isWishlist: boolean;
  isFavorite: boolean;

  purchase: {
    date: SourcedValue;
    place: SourcedValue;
    seller: SourcedValue;
    price: SourcedValue<number>;
    currency: string;
  };

  quality: {
    grade: SourcedValue;
    detailedGrade: SourcedValue;
    location: SourcedValue;
    visibility: SourcedValue;
  };

  notes: {
    latest: SourcedValue;
    source: string;
  };

  files: {
    receipt: SourcedValue;
    ownPhotos: SourcedValue;
    obverseScan: SourcedValue;
    reverseScan: SourcedValue;
  };

  /** User's free-form specs — paperfeel, corners, watermark... */
  ownSpecs: Array<{ label: string; value: SourcedValue }>;
};

/* ----------------------------------------------------------------
 * Sharing
 * ---------------------------------------------------------------- */

export type ObjectSharing = {
  defaultHours: 6 | 12 | 18 | 24 | 48;
  history: Array<{
    created_at: string;
    expires_at: string;
    recipient_count: number;
    revoked: boolean;
  }>;
  source: string;
};

/* ----------------------------------------------------------------
 * Top-level resolved data
 * ---------------------------------------------------------------- */

export type ObjectPresentationData = {
  object_key: ObjectKey;
  identity: ObjectIdentity;
  issue: ObjectIssue;
  people: ObjectPeople;
  rarity: ObjectRarity;
  images: ObjectImages;
  market: ObjectMarket;
  yearContext: ObjectYearContext;
  relations: ObjectRelationLink[];
  collection: ObjectCollection;
  sharing: ObjectSharing;
};

/* ----------------------------------------------------------------
 * Action handlers — every interactive control on the page is wired
 * here. Map each to a DB 8.4 feature_key + action_route.
 * ---------------------------------------------------------------- */

export type ObjectViewHandlers = {
  /** feature: collection.wishlist.toggle */
  onWishlistToggle?: (key: ObjectKey, next: boolean) => void | Promise<void>;
  /** feature: collection.favorite.toggle */
  onFavoriteToggle?: (key: ObjectKey, next: boolean) => void | Promise<void>;
  /** feature: collection.item.add */
  onAddToCollection?: (key: ObjectKey) => void | Promise<void>;
  /** feature: object.share.create */
  onShareCreate?: (key: ObjectKey, hours: number) => Promise<{ url: string }>;
  /** feature: object.compare */
  onCompare?: (key: ObjectKey) => void;
  /** feature: object.relations.view */
  onOpenRelation?: (key: ObjectKey, relation: ObjectRelationLink) => void;
  /** feature: collection.note.save */
  onSaveNote?: (key: ObjectKey, text: string) => Promise<void>;
  /** feature: collection.spec.update */
  onUpdateSpec?: (key: ObjectKey, label: string, value: string) => Promise<void>;
};
