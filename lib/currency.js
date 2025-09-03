// Currency utilities and configuration - Comprehensive list of all major world currencies
export const SUPPORTED_CURRENCIES = {
  // Major Global Currencies
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    country: "United States",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    country: "European Union",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    country: "United Kingdom",
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    flag: "🇯🇵",
    country: "Japan",
  },
  CHF: {
    code: "CHF",
    symbol: "Fr",
    name: "Swiss Franc",
    flag: "🇨🇭",
    country: "Switzerland",
  },

  // Asia-Pacific
  CNY: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    flag: "🇨🇳",
    country: "China",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    country: "India",
  },
  KRW: {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    flag: "🇰🇷",
    country: "South Korea",
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    flag: "🇸🇬",
    country: "Singapore",
  },
  HKD: {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    flag: "🇭🇰",
    country: "Hong Kong",
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "��",
    country: "Australia",
  },
  NZD: {
    code: "NZD",
    symbol: "NZ$",
    name: "New Zealand Dollar",
    flag: "🇳🇿",
    country: "New Zealand",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    country: "Canada",
  },

  // Middle East & Africa
  AED: {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    country: "United Arab Emirates",
  },
  SAR: {
    code: "SAR",
    symbol: "﷼",
    name: "Saudi Riyal",
    flag: "��",
    country: "Saudi Arabia",
  },
  QAR: {
    code: "QAR",
    symbol: "﷼",
    name: "Qatari Riyal",
    flag: "🇶🇦",
    country: "Qatar",
  },
  KWD: {
    code: "KWD",
    symbol: "د.ك",
    name: "Kuwaiti Dinar",
    flag: "🇰🇼",
    country: "Kuwait",
  },
  BHD: {
    code: "BHD",
    symbol: ".د.ب",
    name: "Bahraini Dinar",
    flag: "�🇭",
    country: "Bahrain",
  },
  OMR: {
    code: "OMR",
    symbol: "﷼",
    name: "Omani Rial",
    flag: "🇴🇲",
    country: "Oman",
  },
  ILS: {
    code: "ILS",
    symbol: "₪",
    name: "Israeli Shekel",
    flag: "��",
    country: "Israel",
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    flag: "��",
    country: "South Africa",
  },
  EGP: {
    code: "EGP",
    symbol: "£",
    name: "Egyptian Pound",
    flag: "🇪🇬",
    country: "Egypt",
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    flag: "�🇬",
    country: "Nigeria",
  },

  // Europe
  NOK: {
    code: "NOK",
    symbol: "kr",
    name: "Norwegian Krone",
    flag: "🇳🇴",
    country: "Norway",
  },
  SEK: {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    flag: "🇸🇪",
    country: "Sweden",
  },
  DKK: {
    code: "DKK",
    symbol: "kr",
    name: "Danish Krone",
    flag: "🇩🇰",
    country: "Denmark",
  },
  PLN: {
    code: "PLN",
    symbol: "zł",
    name: "Polish Zloty",
    flag: "��",
    country: "Poland",
  },
  CZK: {
    code: "CZK",
    symbol: "Kč",
    name: "Czech Koruna",
    flag: "🇨🇿",
    country: "Czech Republic",
  },
  HUF: {
    code: "HUF",
    symbol: "Ft",
    name: "Hungarian Forint",
    flag: "🇭🇺",
    country: "Hungary",
  },
  RON: {
    code: "RON",
    symbol: "lei",
    name: "Romanian Leu",
    flag: "🇷🇴",
    country: "Romania",
  },
  BGN: {
    code: "BGN",
    symbol: "лв",
    name: "Bulgarian Lev",
    flag: "🇧🇬",
    country: "Bulgaria",
  },
  HRK: {
    code: "HRK",
    symbol: "kn",
    name: "Croatian Kuna",
    flag: "🇭🇷",
    country: "Croatia",
  },
  RSD: {
    code: "RSD",
    symbol: "дин",
    name: "Serbian Dinar",
    flag: "🇷🇸",
    country: "Serbia",
  },
  RUB: {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    flag: "🇷🇺",
    country: "Russia",
  },
  UAH: {
    code: "UAH",
    symbol: "₴",
    name: "Ukrainian Hryvnia",
    flag: "��",
    country: "Ukraine",
  },
  TRY: {
    code: "TRY",
    symbol: "₺",
    name: "Turkish Lira",
    flag: "🇹🇷",
    country: "Turkey",
  },

  // Americas
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    flag: "🇧🇷",
    country: "Brazil",
  },
  MXN: {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    flag: "🇲🇽",
    country: "Mexico",
  },
  ARS: {
    code: "ARS",
    symbol: "$",
    name: "Argentine Peso",
    flag: "🇦🇷",
    country: "Argentina",
  },
  CLP: {
    code: "CLP",
    symbol: "$",
    name: "Chilean Peso",
    flag: "🇨🇱",
    country: "Chile",
  },
  COP: {
    code: "COP",
    symbol: "$",
    name: "Colombian Peso",
    flag: "🇨🇴",
    country: "Colombia",
  },
  PEN: {
    code: "PEN",
    symbol: "S/",
    name: "Peruvian Sol",
    flag: "�🇪",
    country: "Peru",
  },
  UYU: {
    code: "UYU",
    symbol: "$",
    name: "Uruguayan Peso",
    flag: "🇺🇾",
    country: "Uruguay",
  },

  // Asia Extended
  THB: {
    code: "THB",
    symbol: "฿",
    name: "Thai Baht",
    flag: "🇹🇭",
    country: "Thailand",
  },
  MYR: {
    code: "MYR",
    symbol: "RM",
    name: "Malaysian Ringgit",
    flag: "🇲🇾",
    country: "Malaysia",
  },
  IDR: {
    code: "IDR",
    symbol: "Rp",
    name: "Indonesian Rupiah",
    flag: "🇮🇩",
    country: "Indonesia",
  },
  PHP: {
    code: "PHP",
    symbol: "₱",
    name: "Philippine Peso",
    flag: "��",
    country: "Philippines",
  },
  VND: {
    code: "VND",
    symbol: "₫",
    name: "Vietnamese Dong",
    flag: "🇻🇳",
    country: "Vietnam",
  },
  PKR: {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
    flag: "🇵🇰",
    country: "Pakistan",
  },
  BDT: {
    code: "BDT",
    symbol: "৳",
    name: "Bangladeshi Taka",
    flag: "🇧🇩",
    country: "Bangladesh",
  },
  LKR: {
    code: "LKR",
    symbol: "₨",
    name: "Sri Lankan Rupee",
    flag: "�🇰",
    country: "Sri Lanka",
  },
  MMK: {
    code: "MMK",
    symbol: "K",
    name: "Myanmar Kyat",
    flag: "🇲🇲",
    country: "Myanmar",
  },
  KHR: {
    code: "KHR",
    symbol: "៛",
    name: "Cambodian Riel",
    flag: "🇰🇭",
    country: "Cambodia",
  },
  LAK: {
    code: "LAK",
    symbol: "₭",
    name: "Lao Kip",
    flag: "🇱🇦",
    country: "Laos",
  },

  // Africa Extended
  KES: {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan Shilling",
    flag: "🇰🇪",
    country: "Kenya",
  },
  UGX: {
    code: "UGX",
    symbol: "USh",
    name: "Ugandan Shilling",
    flag: "��",
    country: "Uganda",
  },
  TZS: {
    code: "TZS",
    symbol: "TSh",
    name: "Tanzanian Shilling",
    flag: "🇹🇿",
    country: "Tanzania",
  },
  ETB: {
    code: "ETB",
    symbol: "Br",
    name: "Ethiopian Birr",
    flag: "🇪🇹",
    country: "Ethiopia",
  },
  GHS: {
    code: "GHS",
    symbol: "₵",
    name: "Ghanaian Cedi",
    flag: "🇬🇭",
    country: "Ghana",
  },
  XOF: {
    code: "XOF",
    symbol: "Fr",
    name: "West African Franc",
    flag: "🌍",
    country: "West Africa",
  },
  XAF: {
    code: "XAF",
    symbol: "Fr",
    name: "Central African Franc",
    flag: "🌍",
    country: "Central Africa",
  },
  MAD: {
    code: "MAD",
    symbol: "د.م.",
    name: "Moroccan Dirham",
    flag: "🇲🇦",
    country: "Morocco",
  },
  TND: {
    code: "TND",
    symbol: "د.ت",
    name: "Tunisian Dinar",
    flag: "��",
    country: "Tunisia",
  },
  DZD: {
    code: "DZD",
    symbol: "د.ج",
    name: "Algerian Dinar",
    flag: "🇩🇿",
    country: "Algeria",
  },

  // Other Notable Currencies
  ISK: {
    code: "ISK",
    symbol: "kr",
    name: "Icelandic Krona",
    flag: "🇮🇸",
    country: "Iceland",
  },
  TWD: {
    code: "TWD",
    symbol: "NT$",
    name: "Taiwan Dollar",
    flag: "🇹🇼",
    country: "Taiwan",
  },
  MNT: {
    code: "MNT",
    symbol: "₮",
    name: "Mongolian Tugrik",
    flag: "🇲🇳",
    country: "Mongolia",
  },
  KZT: {
    code: "KZT",
    symbol: "₸",
    name: "Kazakhstani Tenge",
    flag: "🇰🇿",
    country: "Kazakhstan",
  },
  UZS: {
    code: "UZS",
    symbol: "soʻm",
    name: "Uzbekistani Som",
    flag: "🇺🇿",
    country: "Uzbekistan",
  },

  // Caribbean & Pacific
  BBD: {
    code: "BBD",
    symbol: "$",
    name: "Barbadian Dollar",
    flag: "🇧🇧",
    country: "Barbados",
  },
  BMD: {
    code: "BMD",
    symbol: "$",
    name: "Bermudian Dollar",
    flag: "🇧🇲",
    country: "Bermuda",
  },
  BND: {
    code: "BND",
    symbol: "$",
    name: "Brunei Dollar",
    flag: "🇧🇳",
    country: "Brunei",
  },
  FJD: {
    code: "FJD",
    symbol: "$",
    name: "Fijian Dollar",
    flag: "🇫🇯",
    country: "Fiji",
  },
  JMD: {
    code: "JMD",
    symbol: "$",
    name: "Jamaican Dollar",
    flag: "��",
    country: "Jamaica",
  },
  TTD: {
    code: "TTD",
    symbol: "$",
    name: "Trinidad Dollar",
    flag: "🇹🇹",
    country: "Trinidad & Tobago",
  },

  // Popular user preference currencies (first 20 for selector dropdown)
};

// Popular currencies for user preference selection (shown first in dropdowns)
export const POPULAR_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CNY",
  "INR",
  "KRW",
  "SGD",
  "HKD",
  "AUD",
  "NZD",
  "CAD",
  "AED",
  "SAR",
  "NOK",
  "SEK",
  "DKK",
  "BRL",
  "MXN",
];

// Extended currency metadata for currencies not in SUPPORTED_CURRENCIES but available in API
const EXTENDED_CURRENCY_METADATA = {
  AFN: {
    code: "AFN",
    symbol: "؋",
    name: "Afghan Afghani",
    flag: "🇦🇫",
    country: "Afghanistan",
  },
  ALL: {
    code: "ALL",
    symbol: "L",
    name: "Albanian Lek",
    flag: "🇦🇱",
    country: "Albania",
  },
  AMD: {
    code: "AMD",
    symbol: "֏",
    name: "Armenian Dram",
    flag: "🇦🇲",
    country: "Armenia",
  },
  ANG: {
    code: "ANG",
    symbol: "ƒ",
    name: "Netherlands Antillean Guilder",
    flag: "🇦🇼",
    country: "Netherlands Antilles",
  },
  AOA: {
    code: "AOA",
    symbol: "Kz",
    name: "Angolan Kwanza",
    flag: "🇦🇴",
    country: "Angola",
  },
  AWG: {
    code: "AWG",
    symbol: "ƒ",
    name: "Aruban Florin",
    flag: "🇦🇼",
    country: "Aruba",
  },
  AZN: {
    code: "AZN",
    symbol: "₼",
    name: "Azerbaijani Manat",
    flag: "🇦🇿",
    country: "Azerbaijan",
  },
  BAM: {
    code: "BAM",
    symbol: "КМ",
    name: "Bosnia-Herzegovina Convertible Mark",
    flag: "🇧🇦",
    country: "Bosnia and Herzegovina",
  },
  BIF: {
    code: "BIF",
    symbol: "Fr",
    name: "Burundian Franc",
    flag: "🇧🇮",
    country: "Burundi",
  },
  BOB: {
    code: "BOB",
    symbol: "$b",
    name: "Bolivian Boliviano",
    flag: "🇧🇴",
    country: "Bolivia",
  },
  BSD: {
    code: "BSD",
    symbol: "$",
    name: "Bahamian Dollar",
    flag: "🇧🇸",
    country: "Bahamas",
  },
  BTN: {
    code: "BTN",
    symbol: "Nu.",
    name: "Bhutanese Ngultrum",
    flag: "🇧🇹",
    country: "Bhutan",
  },
  BWP: {
    code: "BWP",
    symbol: "P",
    name: "Botswanan Pula",
    flag: "🇧🇼",
    country: "Botswana",
  },
  BYN: {
    code: "BYN",
    symbol: "Br",
    name: "Belarusian Ruble",
    flag: "🇧🇾",
    country: "Belarus",
  },
  BZD: {
    code: "BZD",
    symbol: "BZ$",
    name: "Belize Dollar",
    flag: "🇧🇿",
    country: "Belize",
  },
  CDF: {
    code: "CDF",
    symbol: "Fr",
    name: "Congolese Franc",
    flag: "🇨🇩",
    country: "Democratic Republic of the Congo",
  },
  CRC: {
    code: "CRC",
    symbol: "₡",
    name: "Costa Rican Colón",
    flag: "🇨🇷",
    country: "Costa Rica",
  },
  CUP: {
    code: "CUP",
    symbol: "₱",
    name: "Cuban Peso",
    flag: "🇨🇺",
    country: "Cuba",
  },
  CVE: {
    code: "CVE",
    symbol: "$",
    name: "Cape Verdean Escudo",
    flag: "🇨🇻",
    country: "Cape Verde",
  },
  DJF: {
    code: "DJF",
    symbol: "Fr",
    name: "Djiboutian Franc",
    flag: "🇩🇯",
    country: "Djibouti",
  },
  DOP: {
    code: "DOP",
    symbol: "RD$",
    name: "Dominican Peso",
    flag: "🇩🇴",
    country: "Dominican Republic",
  },
  ERN: {
    code: "ERN",
    symbol: "Nfk",
    name: "Eritrean Nakfa",
    flag: "🇪🇷",
    country: "Eritrea",
  },
  FKP: {
    code: "FKP",
    symbol: "£",
    name: "Falkland Islands Pound",
    flag: "🇫🇰",
    country: "Falkland Islands",
  },
  FOK: {
    code: "FOK",
    symbol: "kr",
    name: "Faroese Króna",
    flag: "🇫🇴",
    country: "Faroe Islands",
  },
  GEL: {
    code: "GEL",
    symbol: "₾",
    name: "Georgian Lari",
    flag: "🇬🇪",
    country: "Georgia",
  },
  GGP: {
    code: "GGP",
    symbol: "£",
    name: "Guernsey Pound",
    flag: "🇬🇬",
    country: "Guernsey",
  },
  GIP: {
    code: "GIP",
    symbol: "£",
    name: "Gibraltar Pound",
    flag: "🇬🇮",
    country: "Gibraltar",
  },
  GMD: {
    code: "GMD",
    symbol: "D",
    name: "Gambian Dalasi",
    flag: "🇬🇲",
    country: "Gambia",
  },
  GNF: {
    code: "GNF",
    symbol: "Fr",
    name: "Guinean Franc",
    flag: "🇬🇳",
    country: "Guinea",
  },
  GTQ: {
    code: "GTQ",
    symbol: "Q",
    name: "Guatemalan Quetzal",
    flag: "🇬🇹",
    country: "Guatemala",
  },
  GYD: {
    code: "GYD",
    symbol: "$",
    name: "Guyanese Dollar",
    flag: "🇬🇾",
    country: "Guyana",
  },
  HNL: {
    code: "HNL",
    symbol: "L",
    name: "Honduran Lempira",
    flag: "🇭🇳",
    country: "Honduras",
  },
  HTG: {
    code: "HTG",
    symbol: "G",
    name: "Haitian Gourde",
    flag: "🇭🇹",
    country: "Haiti",
  },
  IMP: {
    code: "IMP",
    symbol: "£",
    name: "Isle of Man Pound",
    flag: "🇮🇲",
    country: "Isle of Man",
  },
  IQD: {
    code: "IQD",
    symbol: "ع.د",
    name: "Iraqi Dinar",
    flag: "🇮🇶",
    country: "Iraq",
  },
  IRR: {
    code: "IRR",
    symbol: "﷼",
    name: "Iranian Rial",
    flag: "🇮🇷",
    country: "Iran",
  },
  JEP: {
    code: "JEP",
    symbol: "£",
    name: "Jersey Pound",
    flag: "🇯🇪",
    country: "Jersey",
  },
  JOD: {
    code: "JOD",
    symbol: "د.ا",
    name: "Jordanian Dinar",
    flag: "🇯🇴",
    country: "Jordan",
  },
  KGS: {
    code: "KGS",
    symbol: "лв",
    name: "Kyrgystani Som",
    flag: "🇰🇬",
    country: "Kyrgyzstan",
  },
  KID: {
    code: "KID",
    symbol: "$",
    name: "Kiribati Dollar",
    flag: "🇰🇮",
    country: "Kiribati",
  },
  KMF: {
    code: "KMF",
    symbol: "Fr",
    name: "Comorian Franc",
    flag: "🇰🇲",
    country: "Comoros",
  },
  KYD: {
    code: "KYD",
    symbol: "$",
    name: "Cayman Islands Dollar",
    flag: "🇰🇾",
    country: "Cayman Islands",
  },
  LBP: {
    code: "LBP",
    symbol: "£",
    name: "Lebanese Pound",
    flag: "🇱🇧",
    country: "Lebanon",
  },
  LRD: {
    code: "LRD",
    symbol: "$",
    name: "Liberian Dollar",
    flag: "🇱🇷",
    country: "Liberia",
  },
  LSL: {
    code: "LSL",
    symbol: "M",
    name: "Lesotho Loti",
    flag: "🇱🇸",
    country: "Lesotho",
  },
  LYD: {
    code: "LYD",
    symbol: "ل.د",
    name: "Libyan Dinar",
    flag: "🇱🇾",
    country: "Libya",
  },
  MDL: {
    code: "MDL",
    symbol: "L",
    name: "Moldovan Leu",
    flag: "🇲🇩",
    country: "Moldova",
  },
  MGA: {
    code: "MGA",
    symbol: "Ar",
    name: "Malagasy Ariary",
    flag: "🇲🇬",
    country: "Madagascar",
  },
  MKD: {
    code: "MKD",
    symbol: "ден",
    name: "Macedonian Denar",
    flag: "🇲🇰",
    country: "North Macedonia",
  },
  MOP: {
    code: "MOP",
    symbol: "MOP$",
    name: "Macanese Pataca",
    flag: "🇲🇴",
    country: "Macao",
  },
  MRU: {
    code: "MRU",
    symbol: "UM",
    name: "Mauritanian Ouguiya",
    flag: "🇲🇷",
    country: "Mauritania",
  },
  MUR: {
    code: "MUR",
    symbol: "₨",
    name: "Mauritian Rupee",
    flag: "🇲🇺",
    country: "Mauritius",
  },
  MVR: {
    code: "MVR",
    symbol: "Rf",
    name: "Maldivian Rufiyaa",
    flag: "🇲🇻",
    country: "Maldives",
  },
  MWK: {
    code: "MWK",
    symbol: "MK",
    name: "Malawian Kwacha",
    flag: "🇲🇼",
    country: "Malawi",
  },
  MZN: {
    code: "MZN",
    symbol: "MT",
    name: "Mozambican Metical",
    flag: "🇲🇿",
    country: "Mozambique",
  },
  NAD: {
    code: "NAD",
    symbol: "$",
    name: "Namibian Dollar",
    flag: "🇳🇦",
    country: "Namibia",
  },
  NIO: {
    code: "NIO",
    symbol: "C$",
    name: "Nicaraguan Córdoba",
    flag: "🇳🇮",
    country: "Nicaragua",
  },
  NPR: {
    code: "NPR",
    symbol: "₨",
    name: "Nepalese Rupee",
    flag: "🇳🇵",
    country: "Nepal",
  },
  PAB: {
    code: "PAB",
    symbol: "B/.",
    name: "Panamanian Balboa",
    flag: "🇵🇦",
    country: "Panama",
  },
  PGK: {
    code: "PGK",
    symbol: "K",
    name: "Papua New Guinean Kina",
    flag: "🇵🇬",
    country: "Papua New Guinea",
  },
  PYG: {
    code: "PYG",
    symbol: "Gs",
    name: "Paraguayan Guarani",
    flag: "🇵🇾",
    country: "Paraguay",
  },
  RWF: {
    code: "RWF",
    symbol: "R₣",
    name: "Rwandan Franc",
    flag: "🇷🇼",
    country: "Rwanda",
  },
  SBD: {
    code: "SBD",
    symbol: "$",
    name: "Solomon Islands Dollar",
    flag: "🇸🇧",
    country: "Solomon Islands",
  },
  SCR: {
    code: "SCR",
    symbol: "₨",
    name: "Seychellois Rupee",
    flag: "🇸🇨",
    country: "Seychelles",
  },
  SDG: {
    code: "SDG",
    symbol: "ج.س.",
    name: "Sudanese Pound",
    flag: "🇸🇩",
    country: "Sudan",
  },
  SHP: {
    code: "SHP",
    symbol: "£",
    name: "Saint Helena Pound",
    flag: "🇸🇭",
    country: "Saint Helena",
  },
  SLE: {
    code: "SLE",
    symbol: "Le",
    name: "Sierra Leonean Leone",
    flag: "🇸🇱",
    country: "Sierra Leone",
  },
  SLL: {
    code: "SLL",
    symbol: "Le",
    name: "Sierra Leonean Leone (Old)",
    flag: "🇸🇱",
    country: "Sierra Leone",
  },
  SOS: {
    code: "SOS",
    symbol: "S",
    name: "Somali Shilling",
    flag: "🇸🇴",
    country: "Somalia",
  },
  SRD: {
    code: "SRD",
    symbol: "$",
    name: "Surinamese Dollar",
    flag: "🇸🇷",
    country: "Suriname",
  },
  SSP: {
    code: "SSP",
    symbol: "£",
    name: "South Sudanese Pound",
    flag: "🇸🇸",
    country: "South Sudan",
  },
  STN: {
    code: "STN",
    symbol: "Db",
    name: "São Tomé and Príncipe Dobra",
    flag: "🇸🇹",
    country: "São Tomé and Príncipe",
  },
  SYP: {
    code: "SYP",
    symbol: "£",
    name: "Syrian Pound",
    flag: "🇸🇾",
    country: "Syria",
  },
  SZL: {
    code: "SZL",
    symbol: "E",
    name: "Swazi Lilangeni",
    flag: "🇸🇿",
    country: "Eswatini",
  },
  TJS: {
    code: "TJS",
    symbol: "SM",
    name: "Tajikistani Somoni",
    flag: "🇹🇯",
    country: "Tajikistan",
  },
  TMT: {
    code: "TMT",
    symbol: "T",
    name: "Turkmenistani Manat",
    flag: "🇹🇲",
    country: "Turkmenistan",
  },
  TOP: {
    code: "TOP",
    symbol: "T$",
    name: "Tongan Pa'anga",
    flag: "🇹🇴",
    country: "Tonga",
  },
  TVD: {
    code: "TVD",
    symbol: "$",
    name: "Tuvaluan Dollar",
    flag: "🇹🇻",
    country: "Tuvalu",
  },
  VES: {
    code: "VES",
    symbol: "Bs",
    name: "Venezuelan Bolívar",
    flag: "🇻🇪",
    country: "Venezuela",
  },
  VUV: {
    code: "VUV",
    symbol: "Vt",
    name: "Vanuatu Vatu",
    flag: "🇻🇺",
    country: "Vanuatu",
  },
  WST: {
    code: "WST",
    symbol: "WS$",
    name: "Samoan Tala",
    flag: "🇼🇸",
    country: "Samoa",
  },
  XCD: {
    code: "XCD",
    symbol: "$",
    name: "East Caribbean Dollar",
    flag: "🏴",
    country: "Eastern Caribbean",
  },
  XCG: {
    code: "XCG",
    symbol: "$",
    name: "Caribbean Guilder",
    flag: "🏴",
    country: "Caribbean",
  },
  XDR: {
    code: "XDR",
    symbol: "SDR",
    name: "Special Drawing Rights",
    flag: "🌐",
    country: "International Monetary Fund",
  },
  XPF: {
    code: "XPF",
    symbol: "₣",
    name: "CFP Franc",
    flag: "🇵🇫",
    country: "French Polynesia",
  },
  YER: {
    code: "YER",
    symbol: "﷼",
    name: "Yemeni Rial",
    flag: "🇾🇪",
    country: "Yemen",
  },
  ZMW: {
    code: "ZMW",
    symbol: "ZK",
    name: "Zambian Kwacha",
    flag: "🇿🇲",
    country: "Zambia",
  },
  ZWL: {
    code: "ZWL",
    symbol: "Z$",
    name: "Zimbabwean Dollar",
    flag: "🇿🇼",
    country: "Zimbabwe",
  },
};

// Dynamically get all available currencies from the API response
export const getAllAvailableCurrencies = (apiRates) => {
  if (!apiRates) return SUPPORTED_CURRENCIES;

  const availableCurrencies = {};

  // Add all supported currencies that exist in API response
  Object.keys(SUPPORTED_CURRENCIES).forEach((code) => {
    if (apiRates[code] !== undefined) {
      availableCurrencies[code] = SUPPORTED_CURRENCIES[code];
    }
  });

  // Add currencies from API that we don't have in SUPPORTED_CURRENCIES but have extended metadata
  Object.keys(apiRates).forEach((code) => {
    if (!availableCurrencies[code] && EXTENDED_CURRENCY_METADATA[code]) {
      availableCurrencies[code] = EXTENDED_CURRENCY_METADATA[code];
    }
  });

  // Add any remaining currencies from API with basic metadata
  Object.keys(apiRates).forEach((code) => {
    if (!availableCurrencies[code]) {
      // Create basic metadata for completely unknown currencies
      availableCurrencies[code] = {
        code: code,
        symbol: code,
        name: `${code} Currency`,
        flag: "🌐",
        country: "Other",
      };
    }
  });

  return availableCurrencies;
};

export const DEFAULT_CURRENCY = "USD";

// Free exchange rate API (no auth required, 1500 requests/month)
const EXCHANGE_API_BASE = "https://api.exchangerate-api.com/v4/latest";

// Cache for exchange rates (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let rateCache = null;
let cacheTimestamp = null;

/**
 * Fetch exchange rates from API with caching
 * @param {string} baseCurrency - Base currency code
 * @returns {Promise<Object>} Exchange rates object
 */
export async function fetchExchangeRates(baseCurrency = DEFAULT_CURRENCY) {
  const now = Date.now();

  // Return cached data if still valid
  if (rateCache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return rateCache;
  }

  try {
    const response = await fetch(`${EXCHANGE_API_BASE}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    rateCache = data.rates;
    cacheTimestamp = now;

    return data.rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Return cached data if available, even if expired
    if (rateCache) {
      console.warn("Using cached exchange rates due to API failure");
      return rateCache;
    }

    // Fallback rates (approximate values) - Extended to cover more currencies
    console.warn("Using fallback exchange rates");
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      INR: 83.12,
      JPY: 110.0,
      CAD: 1.35,
      AUD: 1.45,
      CHF: 0.92,
      CNY: 7.24,
      KRW: 1310.5,
      SGD: 1.34,
      HKD: 7.8,
      NZD: 1.62,
      SEK: 10.89,
      NOK: 10.64,
      DKK: 6.84,
      BRL: 4.96,
      MXN: 17.12,
      ZAR: 18.75,
      RUB: 74.5,
      AED: 3.67,
      SAR: 3.75,
      QAR: 3.64,
      KWD: 0.306,
      BHD: 0.376,
      OMR: 0.384,
      ILS: 3.38,
      EGP: 48.52,
      NGN: 1527.44,
      PLN: 3.66,
      CZK: 21.03,
      HUF: 339.69,
      RON: 4.36,
      BGN: 1.68,
      HRK: 6.47,
      RSD: 100.62,
      UAH: 41.34,
      TRY: 41.18,
      ARS: 1368.25,
      CLP: 968.53,
      COP: 4015.36,
      PEN: 3.54,
      UYU: 40.04,
      THB: 32.34,
      MYR: 4.23,
      IDR: 16424.06,
      PHP: 57.41,
      VND: 26227.24,
      PKR: 283.72,
      BDT: 121.62,
      LKR: 301.89,
      MMK: 2101.24,
      KHR: 4016.27,
      LAK: 21737.86,
      KES: 129.16,
      UGX: 3529.7,
      TZS: 2489.86,
      ETB: 141.23,
      GHS: 11.95,
      XOF: 563.43,
      XAF: 563.43,
      MAD: 9.04,
      TND: 2.89,
      DZD: 129.74,
      ISK: 123.27,
      TWD: 30.74,
      MNT: 3581.32,
      KZT: 539.48,
      UZS: 12371.92,
      BBD: 2,
      BMD: 1,
      BND: 1.29,
      FJD: 2.26,
      JMD: 160.2,
      TTD: 6.76,
    };
  }
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (fromCurrency === toCurrency) return amount;

  // Convert to USD first, then to target currency
  const usdAmount =
    fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
  const convertedAmount =
    toCurrency === "USD" ? usdAmount : usdAmount * rates[toCurrency];

  return convertedAmount;
}

/**
 * Format currency amount with proper symbol and locale
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {boolean} showCode - Whether to show currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  amount,
  currencyCode = DEFAULT_CURRENCY,
  showCode = false
) {
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  if (!currency) return `${amount.toFixed(2)}`;

  try {
    // Use Intl.NumberFormat for proper locale formatting
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(amount);

    // For some currencies, we prefer our custom symbols
    if (currency.symbol && currency.symbol !== currencyCode) {
      const numericPart = amount.toFixed(2);
      return showCode
        ? `${currency.symbol}${numericPart} ${currencyCode}`
        : `${currency.symbol}${numericPart}`;
    }

    return showCode ? `${formatted} ${currencyCode}` : formatted;
  } catch (error) {
    console.error("Currency formatting error:", error);
    return showCode
      ? `${currency.symbol}${amount.toFixed(2)} ${currencyCode}`
      : `${currency.symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol for a currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode) {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || currencyCode;
}

/**
 * Validate if currency code is supported
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} Whether currency is supported
 */
export function isSupportedCurrency(currencyCode) {
  return currencyCode in SUPPORTED_CURRENCIES;
}
