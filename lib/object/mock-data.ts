// lib/object/mock-data.ts
//
// Mock that mirrors the data in the user's HTML draft.
// In production replace with real DB/service calls from the server layer.

import type { ObjectKey, ObjectPresentationData } from "./types";

const SRC = {
  object: "ct_v_catalog_objects_resolved",
  images: "ct_v_catalog_object_images_resolved",
  market: "ct_v_catalog_market_summary",
  yearContext: "ct_v_catalog_year_context",
  relations: "ct_v_catalog_relations",
  userCollection: "ct_user_collection_objects",
  userNotes: "ct_user_collection_object_notes",
  userFiles: "ct_user_collection_object_files",
  userSpecs: "ct_user_collection_object_specs",
  sharing: "ct_object_share_links",
  titles: "ct_v_catalog_object_titles",
};

export function mockObjectData(key: ObjectKey): ObjectPresentationData {
  return {
    object_key: key,
    identity: {
      title: "100 kroner · 1. utgave · 1877 · Standardutgave · Seddelpapir",
      sourceCatalogNumber: { value: "NS 1 459", source: SRC.object },
      localCatalogNumber: { value: "NS 1 459", source: SRC.object },
      pickCatalogNumber: { value: "NS 1 459", source: SRC.object },
      denomination: { value: "100 kroner", source: SRC.object },
      objectYear: { value: "1872–1905", source: SRC.object },
      publicationYear: { value: "1872–1905", source: SRC.object },
      country: { value: null, source: SRC.object },
      objectTypeLabel: "Seddel",
    },
    issue: {
      denominationIssue: { value: "100 kroner", source: SRC.object },
      litra: { value: null, source: SRC.object },
      variantType: { value: null, source: SRC.object },
      releaseYear: { value: "1872–1905", source: SRC.object },
      productionEndYear: { value: "1872–1905", source: SRC.object },
    },
    people: {
      signature: { value: "Winge/Getz", source: SRC.relations },
      leftPortraitSubject: { value: null, source: SRC.object },
      rightPortraitSubject: { value: null, source: SRC.object },
      ruler: { value: "Oscar II", source: SRC.relations },
      historicalRuler: { value: "Oscar II", source: SRC.relations },
      motif: { value: "Riksvåpen", source: SRC.relations },
    },
    rarity: {
      estimatedByQuantity: { value: "Sjelden", source: SRC.object },
      catalogAssessment: { value: "Sjelden", source: SRC.object },
      denominationGroupCount: { value: "100 kroner", source: SRC.object },
      issueLitraRarityQuantity: { value: "Sjelden", source: SRC.object },
      signatureQuantity: { value: "Winge/Getz", source: SRC.object },
      destroyedQuantity: { value: null, source: SRC.object },
    },
    images: {
      byMode: {
        // In production these are URLs from ct_v_catalog_object_images_resolved
        forside: undefined,
        bakside: undefined,
        gjennomlysning_forside: undefined,
        gjennomlysning_bakside: undefined,
        variant_forside: undefined,
        variant_bakside: undefined,
        detalj: undefined,
      },
      source: SRC.images,
    },
    market: {
      marketGrades: {
        "08 VG": { value: "15 000 NOK", source: SRC.market },
        "15 CF": { value: "15 000 NOK", source: SRC.market },
        "25 VF": { value: "15 000 NOK", source: SRC.market },
        "35 CVF": { value: "15 000 NOK", source: SRC.market },
        "45 XF": { value: "15 000 NOK", source: SRC.market },
        "53 AUNC": { value: "15 000 NOK", source: SRC.market },
        "60 UNC": { value: "15 000 NOK", source: SRC.market },
        "63 CUNC": { value: "15 000 NOK", source: SRC.market },
        "65 GUNC": { value: "15 000 NOK", source: SRC.market },
        "67 SGUNC": { value: "15 000 NOK", source: SRC.market },
      },
      headlineValue: { value: "15 000 NOK", source: SRC.market },
      trend: { value: null, source: SRC.market },
      liquidity: { value: null, source: SRC.market },
      auction: { value: null, source: SRC.market },
      shop: { value: null, source: SRC.market },
      lastSold: { value: null, source: SRC.market },
    },
    yearContext: {
      publicationYear: { value: "1872–1905", source: SRC.yearContext },
      relatedBanknoteYearCount: { value: "1872–1905", source: SRC.yearContext },
      banknoteCatalogYear: { value: "1872–1905", source: SRC.yearContext },
      purchasingPowerValue: { value: "15 000 NOK", source: SRC.yearContext },
      inflation: { value: null, source: SRC.yearContext },

      averageSalary: { value: null, source: SRC.yearContext },
      nominalSalaryGrowth: { value: null, source: SRC.yearContext },
      annualPriceGrowthPercent: { value: "15 000 NOK", source: SRC.yearContext },
      realSalaryGrowth: { value: null, source: SRC.yearContext },
      population: { value: null, source: SRC.yearContext },
      populationChange10YearCount: { value: "1872–1905", source: SRC.yearContext },

      lendingRateNorway: { value: null, source: SRC.yearContext },
      usdGoldPrice: { value: "15 000 NOK", source: SRC.yearContext },
      usdSilverPrice: { value: "15 000 NOK", source: SRC.yearContext },
      sekRate: { value: null, source: SRC.yearContext },
      dkkRate: { value: null, source: SRC.yearContext },

      financialEvent: { value: null, source: SRC.yearContext },
      stateBudgetFocus: { value: null, source: SRC.yearContext },
      historicalYearEvents: { value: "1872–1905", source: SRC.yearContext },
      primeMinister: { value: null, source: SRC.yearContext },
      political_party: { value: null, source: SRC.yearContext },
      financeMinister: { value: null, source: SRC.yearContext },
      historicalUnionPeriod: { value: "1872–1905", source: SRC.yearContext },
    },
    relations: [
      {
        relation_type: "ruler",
        label: "Konge / regent: Oscar II",
        description: "Vis konge, periode og objekter gruppert etter type",
        action_key: "relation.ruler.open",
        href: "/relasjon/konge/oscar-ii",
      },
      {
        relation_type: "signature",
        label: "Signaturperson: Winge / Getz",
        description: "Vis signaturperiode og objekter med samme signatur",
        action_key: "relation.signature.open",
      },
      {
        relation_type: "motif",
        label: "Motiv/person: Riksvåpen",
        description: "Vis motiv/person og egne objektlister",
        action_key: "relation.motif.open",
      },
      {
        relation_type: "issue",
        label: "Utgave: 1. utgave",
        description: "Vis alle objekter i samme utgave",
        action_key: "relation.issue.open",
      },
    ],
    collection: {
      isInCollection: false,
      isWishlist: false,
      isFavorite: false,
      purchase: {
        date: { value: null, source: SRC.userCollection },
        place: { value: null, source: SRC.userCollection },
        seller: { value: null, source: SRC.userCollection },
        price: { value: null, source: SRC.userCollection },
        currency: "NOK",
      },
      quality: {
        grade: { value: null, source: SRC.userCollection },
        detailedGrade: { value: null, source: SRC.userCollection },
        location: { value: null, source: SRC.userCollection },
        visibility: { value: null, source: SRC.userCollection },
      },
      notes: {
        latest: { value: null, source: SRC.userNotes },
        source: SRC.userNotes,
      },
      files: {
        receipt: { value: null, source: SRC.userFiles },
        ownPhotos: { value: null, source: SRC.userFiles },
        obverseScan: { value: null, source: SRC.userFiles },
        reverseScan: { value: null, source: SRC.userFiles },
      },
      ownSpecs: [
        "Papirfølelse",
        "Hjørner",
        "Farge",
        "Vannmerke",
        "Proveniens",
        "Egen tagg",
      ].map((label) => ({
        label,
        value: { value: null, source: SRC.userSpecs },
      })),
    },
    sharing: {
      defaultHours: 12,
      history: [],
      source: SRC.sharing,
    },
  };
}
