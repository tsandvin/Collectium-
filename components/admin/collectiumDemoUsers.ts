/**
 * COLLECTIUM FILE HEADER
 *
 * Overskrift:
 * collectiumDemoUsers v20
 *
 * Definering / formal:
 * Demo-/UI-datakilde for admin brukerhaandtering med 20 brukere, realistisk
 * aktivitet, kundekilde/opprinnelse, kundenummer, slette-/bevaringsregel og
 * profilfletting. Skal senere erstattes av MariaDB/API-respons.
 *
 * Berorte sider / routes:
 * - /admin/brukere
 * - /admin/kunde/[userId]
 *
 * Berorte DB-brytere / feature_keys:
 * - admin.users.view
 * - admin.users.edit
 * - admin.users.delete.request
 * - admin.users.delete.personal_data
 * - admin.users.ownership_history.preserve
 * - admin.users.merge_profiles
 * - admin.customer.presentation.view
 * - admin.customer.origin.view
 *
 * Dataretning:
 * MariaDB -> API/backend -> Next.js -> React -> UI
 */

export type Membership = "Free" | "Bronze" | "Silver" | "Gold" | "Platinum";
export type UserStatus = "active" | "suspended" | "pending" | "offline" | "deleted_requested" | "anonymized";
export type KycStatus = "verified" | "pending" | "not_started";
export type Presence = "Admin" | "Paalogget" | "Avlogget";
export type CustomerType = "customer" | "dealer";
export type CustomerOriginType = "organisk" | "forhandler" | "auksjon" | "nettbutikk" | "museum" | "kampanje" | "admin_support" | "import";
export type DeletionMode = "active" | "retained" | "delete_personal_keep_ownership" | "anonymized_keep_ownership";

export type AdminUser = {
  id: string;
  userIdInternal: string;
  customerNumber: string;
  customerCountryCode: string;
  customerNumberYear: number;
  customerNumberSequence: number;
  customerType: CustomerType;
  initials: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  status: UserStatus;
  presence: Presence;
  membership: Membership;
  kyc: KycStatus;
  collectionValue: number;
  objects: number;
  groups: Array<{ name: string; count: number; value: number }>;
  auction: string;
  shop: string;
  collector: string;
  lastOnline: string;
  onlineTodayMin: number;
  onlineMonthMin: number;
  yearlyRevenue: number;
  since: string;
  originType: CustomerOriginType;
  originSource: string;
  originReferrer: string;
  originCampaign: string;
  originDealerId?: string;
  originFirstPage: string;
  originFirstObjectGroup: string;
  originRegisteredChannel: string;
  mostUsedPages: Array<{ page: string; percent: number }>;
  activityByDay: number[];
  supportFlag: string;
  supportOpenCases: number;
  activityLog: string[];
  deletionMode: DeletionMode;
  deletionPreference: "bevar_konto" | "slett_persondata_bevar_eierhistorikk" | "anonymiser_bevar_eierhistorikk";
  ownershipHistoryPolicy: string;
  mergeCandidates: Array<{ userId: string; reason: string; confidence: number }>;
};

export const customerNumberRule = {
  customer: "CT-[LANDSKODE]-[AAR]-[LOEPENUMMER]",
  dealer: "CTD-[LANDSKODE]-[AAR]-[LOEPENUMMER]",
  exampleCustomer: "CT-NO-2026-000001",
  exampleDealer: "CTD-NO-2026-000001",
  note: "user_id er intern teknisk DB-ID. Kundenummer vises paa medlem, faktura, support, avtaler, forhandlerflyt og admin.",
};

export const accountDeletionRule = {
  title: "Bruker som slutter / sletting av konto",
  short: "Persondata kan slettes/anonymiseres ved kundens valg, men eierskapsrekken for objekter bevares.",
  rules: [
    "Standard: konto deaktiveres eller beholdes som avsluttet kunde slik at historikk og supportgrunnlag finnes.",
    "Hvis kunden ber om sletting: slett eller anonymiser personopplysninger som e-post, telefon, adresse og profiltekst.",
    "Eierhistorikk for objekter slettes ikke, fordi det oedelegger proveniens/eierrekke og markeds-/historiedata.",
    "Eierhistorikk kan peke til historisk kundeidentitet, tidligere e-post/navn eller anonymisert eierkode etter valgt personvernmodus.",
    "Hvis kunden angrer senere, kan admin koble ny profil til bevart eierhistorikk etter kontroll av e-post, navn, bosted og samme eiendeler.",
    "Hvis bruker logger inn med ny e-post, men matcher bosted og samme eiendeler, kan admin foreslaa eller gjennomfoere profilfletting.",
  ],
  featureKeys: [
    "admin.users.delete.request",
    "admin.users.delete.personal_data",
    "admin.users.ownership_history.preserve",
    "admin.users.merge_profiles",
  ],
};

const daySets = [
  [30, 44, 20, 58, 42, 74, 61, 86, 38, 70, 54, 92],
  [12, 18, 0, 25, 15, 34, 22, 40, 10, 28, 17, 31],
  [64, 70, 55, 82, 76, 90, 72, 88, 60, 80, 73, 96],
  [7, 12, 5, 10, 0, 18, 6, 11, 4, 9, 0, 13],
  [22, 30, 35, 28, 40, 48, 44, 52, 36, 58, 50, 64],
];

function n(value: number) { return value; }

export const demoUsers: AdminUser[] = [
  {
    id: "92121216", userIdInternal: "USR-000001", customerNumber: "CT-NO-2026-000001", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "customer", initials: "OB", name: "Ola Berg", email: "ola@example.no", phone: "92121216", country: "Norge", address: "Storgata 12, 0155 Oslo", status: "suspended", presence: "Paalogget", membership: "Gold", kyc: "pending", collectionValue: n(128450), objects: 247, groups: [{name:"Sedler",count:128,value:88200},{name:"Mynter",count:96,value:31800},{name:"Dokumenter",count:23,value:8450}], auction: "3 bud", shop: "2 butikkobjekter", collector: "Aktiv samler", lastOnline: "i dag 14:28", onlineTodayMin: 134, onlineMonthMin: 2300, yearlyRevenue: 20000, since: "14.02.2026", originType: "forhandler", originSource: "Invitert av forhandler", originReferrer: "Demo Forhandler", originCampaign: "Vaarkampanje 2026", originDealerId: "CTD-NO-2026-000001", originFirstPage: "/registrering", originFirstObjectGroup: "Sedler", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Katalog",percent:42},{page:"Min samling",percent:28},{page:"Auksjon",percent:18},{page:"Index",percent:12}], activityByDay: daySets[0], supportFlag: "Trenger hjelp i katalogfilter", supportOpenCases: 1, activityLog: ["14:28 aapnet katalog", "14:12 filtrerte Norske sedler", "13:55 la NSNR 23a i oenskeliste", "12:02 forsoekte aa aapne auksjon"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [{userId:"USR-000019",reason:"Samme bosted og samme registrerte 10 kroner 1949 A",confidence:86}],
  },
  {
    id: "10000018", userIdInternal: "USR-000018", customerNumber: "CT-NO-2026-000018", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 18, customerType: "customer", initials: "KH", name: "Kari Hansen", email: "kari@example.no", phone: "10000018", country: "Norge", address: "Fjordveien 4, Bergen", status: "active", presence: "Avlogget", membership: "Silver", kyc: "verified", collectionValue: n(42800), objects: 84, groups: [{name:"Mynter",count:58,value:29400},{name:"Sedler",count:26,value:13400}], auction: "Ingen aktive", shop: "Ingen butikkobjekter", collector: "Privat samling", lastOnline: "i gaar 20:11", onlineTodayMin: 0, onlineMonthMin: 730, yearlyRevenue: 6000, since: "03.01.2026", originType: "organisk", originSource: "Organisk registrering", originReferrer: "Google / soek", originCampaign: "Ingen", originFirstPage: "/", originFirstObjectGroup: "Mynter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Min samling",percent:48},{page:"Katalog",percent:34},{page:"Historie",percent:18}], activityByDay: daySets[1], supportFlag: "Ingen aktiv sak", supportOpenCases: 0, activityLog: ["i gaar 20:11 aapnet Min samling", "i gaar 19:50 lastet opp bilde", "mandag 21:22 redigerte notat"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [],
  },
  {
    id: "ADMIN-001", userIdInternal: "USR-ADMIN-001", customerNumber: "CT-NO-2026-000000", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 0, customerType: "customer", initials: "CA", name: "Collectium Admin", email: "admin@collectium.no", phone: "-", country: "Norge", address: "Collectium system", status: "active", presence: "Admin", membership: "Platinum", kyc: "verified", collectionValue: n(0), objects: 0, groups: [], auction: "Admin", shop: "Admin", collector: "Systembruker", lastOnline: "naa", onlineTodayMin: 242, onlineMonthMin: 6240, yearlyRevenue: 0, since: "01.01.2026", originType: "admin_support", originSource: "Admin-opprettet", originReferrer: "Collectium system", originCampaign: "Intern", originFirstPage: "/admin", originFirstObjectGroup: "System", originRegisteredChannel: "admin", mostUsedPages: [{page:"Admin",percent:62},{page:"Katalog",percent:18},{page:"DB 8.4",percent:20}], activityByDay: daySets[2], supportFlag: "Systembruker", supportOpenCases: 0, activityLog: ["naa aapnet brukeradmin", "14:11 sjekket DB 8.4", "13:02 aapnet adminlogg"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Systembruker kan ikke slettes fra UI.", mergeCandidates: [],
  },
  {
    id: "DEALER-01", userIdInternal: "DLR-000001", customerNumber: "CTD-NO-2026-000001", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "dealer", initials: "DF", name: "Demo Forhandler", email: "demo.forhandler@collectium.no", phone: "90000001", country: "Norge", address: "Forhandlergata 1", status: "active", presence: "Paalogget", membership: "Gold", kyc: "verified", collectionValue: n(0), objects: 0, groups: [{name:"Sedler",count:0,value:0},{name:"Mynter",count:0,value:0}], auction: "Auksjon aktiv", shop: "Nettbutikk aktiv", collector: "Forhandlerkonto", lastOnline: "12.05", onlineTodayMin: 31, onlineMonthMin: 1080, yearlyRevenue: 20000, since: "18.02.2026", originType: "admin_support", originSource: "Forhandlerregistrering", originReferrer: "Admin/support", originCampaign: "Forhandlerpilot 2026", originFirstPage: "/forhandler", originFirstObjectGroup: "Sedler og mynter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Forhandler",percent:44},{page:"Auksjon",percent:34},{page:"Katalog",percent:22}], activityByDay: daySets[4], supportFlag: "Avtale maa kontrolleres", supportOpenCases: 1, activityLog: ["12.05 opprettet auksjonsutkast", "11.05 aapnet forhandlerpanel"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Forhandleravtaler og oppgjoer beholdes etter avtale-/regnskapsregel.", mergeCandidates: [],
  },
  {
    id: "USR-000005", userIdInternal: "USR-000005", customerNumber: "CT-SE-2026-000001", customerCountryCode: "SE", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "customer", initials: "AL", name: "Anna Lind", email: "anna.lind@example.se", phone: "+46700111111", country: "Sverige", address: "Storgatan 8, Stockholm", status: "active", presence: "Avlogget", membership: "Bronze", kyc: "not_started", collectionValue: n(18900), objects: 41, groups: [{name:"Mynter",count:31,value:14200},{name:"Sedler",count:10,value:4700}], auction: "1 bud", shop: "Ingen", collector: "Ny samler", lastOnline: "i dag 09:40", onlineTodayMin: 42, onlineMonthMin: 440, yearlyRevenue: 2388, since: "21.02.2026", originType: "kampanje", originSource: "Rabattkode", originReferrer: "Nyhetsbrev", originCampaign: "Bronze-start 2026", originFirstPage: "/medlemskap", originFirstObjectGroup: "Mynter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Katalog",percent:51},{page:"Medlemskap",percent:20},{page:"Min samling",percent:29}], activityByDay: daySets[1], supportFlag: "Trenger veiledning i samling", supportOpenCases: 1, activityLog: ["09:40 aapnet medlemskap", "09:18 soekte svensk mynt"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [],
  },
  {
    id: "USR-000006", userIdInternal: "USR-000006", customerNumber: "CT-DK-2026-000001", customerCountryCode: "DK", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "customer", initials: "NJ", name: "Niels Jensen", email: "niels@example.dk", phone: "+4522001100", country: "Danmark", address: "Havnevej 6, Aarhus", status: "pending", presence: "Avlogget", membership: "Free", kyc: "not_started", collectionValue: n(0), objects: 0, groups: [], auction: "Ingen", shop: "Ingen", collector: "Ikke startet", lastOnline: "3 dager siden", onlineTodayMin: 0, onlineMonthMin: 85, yearlyRevenue: 0, since: "22.02.2026", originType: "museum", originSource: "Museum/kommune", originReferrer: "Lokal museumsside", originCampaign: "Museum pilot", originFirstPage: "/registrering", originFirstObjectGroup: "Dokumenter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Historie",percent:60},{page:"Katalog",percent:40}], activityByDay: daySets[3], supportFlag: "Venter e-postbekreftelse", supportOpenCases: 0, activityLog: ["registrerte konto", "aapnet historisk-museum modul"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Ingen eierhistorikk registrert enda.", mergeCandidates: [],
  },
  {
    id: "USR-000007", userIdInternal: "USR-000007", customerNumber: "CT-NO-2026-000044", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 44, customerType: "customer", initials: "MR", name: "Maja Ryen", email: "maja.ryen@example.no", phone: "93000044", country: "Norge", address: "Kongens gate 4, Trondheim", status: "deleted_requested", presence: "Avlogget", membership: "Bronze", kyc: "verified", collectionValue: n(76400), objects: 112, groups: [{name:"Sedler",count:66,value:51200},{name:"Mynter",count:46,value:25200}], auction: "Ingen aktive", shop: "1 butikkobjekt", collector: "Avsluttet konto", lastOnline: "12 dager siden", onlineTodayMin: 0, onlineMonthMin: 210, yearlyRevenue: 2388, since: "02.01.2026", originType: "organisk", originSource: "Direkte trafikk", originReferrer: "collectium.no", originCampaign: "Ingen", originFirstPage: "/", originFirstObjectGroup: "Sedler", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Min samling",percent:52},{page:"Katalog",percent:30},{page:"Nettbutikk",percent:18}], activityByDay: daySets[3], supportFlag: "Sletteforespoersel maa behandles", supportOpenCases: 1, activityLog: ["sendte sletteforespoersel", "eksporterte samlingsliste", "aapnet personvern"], deletionMode: "delete_personal_keep_ownership", deletionPreference: "slett_persondata_bevar_eierhistorikk", ownershipHistoryPolicy: "Slett persondata, men behold objekt-eierrekke som historisk eierkode og tidligere e-post/navn i lukket adminlogg.", mergeCandidates: [{userId:"USR-000020",reason:"Samme adresse og overlappende objektliste etter ny e-post",confidence:79}],
  },
  {
    id: "USR-000008", userIdInternal: "USR-000008", customerNumber: "CT-NO-2026-000052", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 52, customerType: "customer", initials: "ES", name: "Erik Solheim", email: "erik@example.no", phone: "94000052", country: "Norge", address: "Sjoegata 10, Tromsoe", status: "active", presence: "Paalogget", membership: "Gold", kyc: "verified", collectionValue: n(342000), objects: 513, groups: [{name:"Mynter",count:302,value:184000},{name:"Sedler",count:211,value:158000}], auction: "9 bud", shop: "4 butikkobjekter", collector: "Aktiv storbruker", lastOnline: "naa", onlineTodayMin: 311, onlineMonthMin: 6120, yearlyRevenue: 20000, since: "05.01.2026", originType: "auksjon", originSource: "Auksjon", originReferrer: "Auksjonslenke", originCampaign: "Haakon VII auksjon", originFirstPage: "/auksjon", originFirstObjectGroup: "Mynter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Auksjon",percent:44},{page:"Katalog",percent:34},{page:"Finans",percent:22}], activityByDay: daySets[2], supportFlag: "Ingen aktiv sak", supportOpenCases: 0, activityLog: ["naa la inn bud", "i dag sjekket trend", "i dag aapnet finans"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [],
  },
  {
    id: "USR-000009", userIdInternal: "USR-000009", customerNumber: "CT-FI-2026-000001", customerCountryCode: "FI", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "customer", initials: "LK", name: "Leena Korhonen", email: "leena@example.fi", phone: "+35840123456", country: "Finland", address: "Museokatu 3, Helsinki", status: "active", presence: "Avlogget", membership: "Silver", kyc: "verified", collectionValue: n(58400), objects: 96, groups: [{name:"Dokumenter",count:45,value:18400},{name:"Mynter",count:51,value:40000}], auction: "Ingen aktive", shop: "Ingen", collector: "Historisk samling", lastOnline: "i gaar", onlineTodayMin: 0, onlineMonthMin: 980, yearlyRevenue: 6000, since: "08.01.2026", originType: "museum", originSource: "Museum/kommune", originReferrer: "Kommunal samling", originCampaign: "Digitalt museum", originFirstPage: "/historie", originFirstObjectGroup: "Dokumenter", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Historie",percent:47},{page:"Katalog",percent:30},{page:"Museum",percent:23}], activityByDay: daySets[1], supportFlag: "Trenger importveiledning", supportOpenCases: 1, activityLog: ["i gaar aapnet museum", "importerte dokumentliste"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [],
  },
  {
    id: "USR-000010", userIdInternal: "USR-000010", customerNumber: "CT-US-2026-000001", customerCountryCode: "US", customerNumberYear: 2026, customerNumberSequence: 1, customerType: "customer", initials: "JM", name: "John Miller", email: "john.miller@example.com", phone: "+12025550101", country: "USA", address: "Maple Street 22, Boston", status: "active", presence: "Avlogget", membership: "Platinum", kyc: "verified", collectionValue: n(1260000), objects: 1210, groups: [{name:"Sedler",count:620,value:760000},{name:"Mynter",count:590,value:500000}], auction: "12 bud", shop: "6 butikkobjekter", collector: "Internasjonal samler", lastOnline: "i dag 06:20", onlineTodayMin: 55, onlineMonthMin: 4200, yearlyRevenue: 50000, since: "12.01.2026", originType: "nettbutikk", originSource: "Nettbutikk", originReferrer: "Objektpresentasjon", originCampaign: "US collectors", originFirstPage: "/objekt/norske_sedler/banknote/23a", originFirstObjectGroup: "Sedler", originRegisteredChannel: "app.collectium.no", mostUsedPages: [{page:"Objekt",percent:38},{page:"Finans",percent:32},{page:"Auksjon",percent:30}], activityByDay: daySets[2], supportFlag: "Valutasporsmaal", supportOpenCases: 1, activityLog: ["06:20 aapnet objekt", "sammenlignet USD/NOK", "la inn bud"], deletionMode: "active", deletionPreference: "bevar_konto", ownershipHistoryPolicy: "Eierhistorikk beholdes med aktiv profil.", mergeCandidates: [],
  },
  {
    id: "USR-000011", userIdInternal: "USR-000011", customerNumber: "CT-NO-2026-000061", customerCountryCode: "NO", customerNumberYear: 2026, customerNumberSequence: 61, customerType: "customer", initials: "TH", name: "Tom Haug", email: "tom.haug@example.no", phone: "95000061", country: "Norge", address: "Dronningens gate 2, Oslo", status: "anonymized", presence: "Avlogget", membership: "Free", kyc: "not_started", collectionValue: n(22000), objects: 37, groups: [{name:"Sedler",count:37,value:22000}], auction: "Ingen", shop: "Ingen", collector: "Historisk eier", lastOnline: "30 dager siden", onlineTodayMin: 0, onlineMonthMin: 0, yearlyRevenue: 0, since: "15.01.2026", originType: "import", originSource: "Importert kunde", originReferrer: "Legacy PHP", originCampaign: "Migrering", originFirstPage: "legacy/import", originFirstObjectGroup: "Sedler", originRegisteredChannel: "import", mostUsedPages: [{page:"Import",percent:100}], activityByDay: [0,0,0,0,0,0,0,0,0,0,0,0], supportFlag: "Profil anonymisert", supportOpenCases: 0, activityLog: ["persondata anonymisert", "eierhistorikk beholdt"], deletionMode: "anonymized_keep_ownership", deletionPreference: "anonymiser_bevar_eierhistorikk", ownershipHistoryPolicy: "Profil er anonymisert. Objekt-eierrekke beholdes for proveniens og markedsdata.", mergeCandidates: [],
  },
];

const moreUsers: AdminUser[] = [
  ["USR-000012","CT-NO-2026-000072","GS","Grete Strand","grete@example.no","Bronze","kampanje",18500,40,"Avlogget"],
  ["USR-000013","CT-NO-2026-000073","HP","Hans Petter","hans@example.no","Free","organisk",0,0,"Avlogget"],
  ["USR-000014","CT-NO-2026-000074","IR","Ingrid Rogn","ingrid@example.no","Silver","forhandler",93000,143,"Paalogget"],
  ["USR-000015","CT-SE-2026-000002","OA","Oskar Andersson","oskar@example.se","Gold","auksjon",210000,300,"Paalogget"],
  ["USR-000016","CT-DK-2026-000002","MF","Mette Friis","mette@example.dk","Bronze","nettbutikk",11900,21,"Avlogget"],
  ["USR-000017","CT-NO-2026-000075","BV","Bjoern Vik","bjorn@example.no","Platinum","forhandler",820000,755,"Paalogget"],
  ["USR-000018","CT-NO-2026-000076","AH","Ane Holm","ane@example.no","Silver","museum",64000,118,"Avlogget"],
  ["USR-000019","CT-NO-2026-000077","OS","Ola Solvik","ola.solvik@example.no","Bronze","organisk",128450,247,"Avlogget"],
  ["USR-000020","CT-NO-2026-000078","MR","Maja Ryen Ny","maja.ny@example.no","Free","admin_support",76400,112,"Paalogget"],
] as unknown as AdminUser[];

export const allDemoUsers: AdminUser[] = [
  ...demoUsers,
  ...moreUsers.map((raw, idx) => {
    const r = raw as unknown as [string,string,string,string,string,Membership,CustomerOriginType,number,number,Presence];
    const [id, customerNumber, initials, name, email, membership, originType, value, objects, presence] = r;
    const country = customerNumber.split("-")[1] || "NO";
    return {
      id,
      userIdInternal: id,
      customerNumber,
      customerCountryCode: country,
      customerNumberYear: 2026,
      customerNumberSequence: Number(customerNumber.split("-").pop()) || idx + 72,
      customerType: "customer",
      initials,
      name,
      email,
      phone: `9${String(6000000 + idx * 3137).slice(0,7)}`,
      country: country === "SE" ? "Sverige" : country === "DK" ? "Danmark" : "Norge",
      address: idx % 2 ? "Samlerveien 8" : "Arkivgata 14",
      status: idx === 8 ? "deleted_requested" : "active",
      presence,
      membership,
      kyc: idx % 3 === 0 ? "pending" : "verified",
      collectionValue: value,
      objects,
      groups: objects ? [{name:"Sedler",count:Math.round(objects*0.55),value:Math.round(value*0.65)},{name:"Mynter",count:Math.round(objects*0.45),value:Math.round(value*0.35)}] : [],
      auction: idx % 2 ? "Ingen aktive" : `${idx + 1} bud`,
      shop: idx % 4 === 0 ? "1 butikkobjekt" : "Ingen",
      collector: objects ? "Aktiv samler" : "Ny bruker",
      lastOnline: presence === "Paalogget" ? "naa" : `${idx + 1} dager siden`,
      onlineTodayMin: presence === "Paalogget" ? 40 + idx * 11 : 0,
      onlineMonthMin: 240 + idx * 195,
      yearlyRevenue: membership === "Platinum" ? 50000 : membership === "Gold" ? 20000 : membership === "Silver" ? 6000 : membership === "Bronze" ? 2388 : 0,
      since: `${String(10 + idx).padStart(2,"0")}.03.2026`,
      originType,
      originSource: originType === "forhandler" ? "Invitert av forhandler" : originType === "museum" ? "Museum/kommune" : originType === "auksjon" ? "Auksjon" : originType === "nettbutikk" ? "Nettbutikk" : originType === "kampanje" ? "Kampanje" : originType === "admin_support" ? "Admin/support" : "Organisk registrering",
      originReferrer: originType === "organisk" ? "Direkte / Google" : originType,
      originCampaign: originType === "kampanje" ? "Vaarkampanje 2026" : "Ingen",
      originFirstPage: originType === "auksjon" ? "/auksjon" : originType === "nettbutikk" ? "/butikk" : "/registrering",
      originFirstObjectGroup: idx % 2 ? "Mynter" : "Sedler",
      originRegisteredChannel: "app.collectium.no",
      mostUsedPages: [{page:"Katalog",percent:40 + idx},{page:"Min samling",percent:30},{page:"Auksjon",percent:30 - idx % 10}],
      activityByDay: daySets[idx % daySets.length],
      supportFlag: idx % 5 === 0 ? "Support bør kontrollere siste filterfeil" : "Ingen aktiv sak",
      supportOpenCases: idx % 5 === 0 ? 1 : 0,
      activityLog: ["aapnet katalog", "viste objektpresentasjon", "oppdaterte samlingsstatus"],
      deletionMode: idx === 8 ? "delete_personal_keep_ownership" : "active",
      deletionPreference: idx === 8 ? "slett_persondata_bevar_eierhistorikk" : "bevar_konto",
      ownershipHistoryPolicy: idx === 8 ? "Slett persondata, men behold eierhistorikk og proveniens." : "Eierhistorikk beholdes med aktiv profil.",
      mergeCandidates: id === "USR-000019" ? [{userId:"92121216",reason:"Samme bosted og samme eiendel",confidence:86}] : id === "USR-000020" ? [{userId:"USR-000007",reason:"Samme bosted og tidligere slettet profil",confidence:79}] : [],
    };
  }),
];

export function formatKr(value: number) {
  return `${new Intl.NumberFormat("nb-NO").format(value)} kr`;
}

export function formatMinutes(value: number) {
  if (value <= 0) return "0 min";
  const h = Math.floor(value / 60);
  const m = value % 60;
  return h ? `${h} t ${m} min` : `${m} min`;
}

export function findDemoUser(userId: string) {
  return allDemoUsers.find((u) => u.id.toLowerCase() === userId.toLowerCase() || u.userIdInternal.toLowerCase() === userId.toLowerCase() || u.customerNumber.toLowerCase() === userId.toLowerCase()) || allDemoUsers[0];
}
