import { catalogueSnapshotSchema } from "@/server/catalogue/schema";
import type {
  BulkPriceTier,
  CareGuide,
  CatalogueSnapshot,
  Category,
  LocalizedText,
  PlaceholderArt,
  Product,
} from "@/server/catalogue/types";

const review = {
  translationStatus: "unverified" as const,
  dataOrigin: "development" as const,
};

const photoAlt: Record<string, LocalizedText> = {
  "rama-tulasi": {
    en: "Green-leaved Rama tulasi growing in a pot",
    ta: "தொட்டியில் வளரும் பச்சை இலை ராம துளசி",
  },
  "krishna-tulasi": {
    en: "Krishna tulasi plants with purple leaves",
    ta: "ஊதா இலைகளுடன் கூடிய கிருஷ்ண துளசிச் செடிகள்",
  },
  mint: {
    en: "Spearmint plant shown for this mint sample",
    ta: "இந்த புதினா மாதிரிக்குக் காட்டப்படும் புதினாச் செடி",
  },
  rosemary: {
    en: "Rosemary shrub with narrow leaves and small blue flowers",
    ta: "குறுகிய இலைகளும் சிறிய நீலப் பூக்களும் உள்ள ரோஸ்மேரிச் செடி",
  },
  lemongrass: {
    en: "A clump of lemongrass",
    ta: "எலுமிச்சைப் புல் கற்றை",
  },
  henna: {
    en: "A young henna plant in a pot",
    ta: "தொட்டியில் உள்ள இளம் மருதாணிச் செடி",
  },
  hibiscus: {
    en: "Red hibiscus flower and leaves",
    ta: "சிவப்பு செம்பருத்திப் பூவும் இலைகளும்",
  },
  senbagam: {
    en: "Orange-yellow senbagam flowers and a leaf",
    ta: "செண்பகத்தின் ஆரஞ்சு-மஞ்சள் பூக்களும் இலையும்",
  },
  guava: {
    en: "Guava leaves and young fruit on the plant",
    ta: "செடியில் இருக்கும் கொய்யா இலைகளும் இளம் கனியும்",
  },
  pomegranate: {
    en: "Pomegranate flower and leaves on the branch",
    ta: "கிளையில் மாதுளைப் பூவும் இலைகளும்",
  },
  mango: {
    en: "A very young mango plant. The variety is not named",
    ta: "மிக இளம் மாச் செடி. வகை பெயரிடப்படவில்லை",
  },
  sapota: {
    en: "A mature sapota tree. The nursery listing is for a young plant",
    ta: "வளர்ந்த சப்போட்டா மரம். நாற்றங்கால் பட்டியல் இளம் செடிக்கு",
  },
  amla: {
    en: "A mature amla tree",
    ta: "வளர்ந்த நெல்லி மரம்",
  },
};

function image(slug: string, art: PlaceholderArt, name: LocalizedText) {
  const alt = photoAlt[slug];
  return {
    id: alt ? `${slug}-photo` : `${slug}-placeholder`,
    alt: alt ?? {
      en: `Photo coming soon for ${name.en}`,
      ta: `${name.ta} — புகைப்படம் விரைவில்`,
    },
    sortOrder: 0,
    storageKey: alt ? `local:/plants/${slug}.webp` : "placeholder:coming-soon",
    art,
  };
}

function plant(input: {
  slug: string;
  categorySlug: string;
  name: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  care: LocalizedText;
  pricePaise: number;
  stockQuantity: number;
  art: PlaceholderArt;
  featuredOrder?: number;
  bulkPriceTiers?: BulkPriceTier[];
}): Product {
  const outOfStock = input.stockQuantity === 0;
  return {
    id: input.slug,
    slug: input.slug,
    categorySlug: input.categorySlug,
    name: input.name,
    summary: input.summary,
    description: input.description,
    care: input.care,
    pricePaise: input.pricePaise,
    stockQuantity: input.stockQuantity,
    availability: outOfStock ? "out_of_stock" : "available",
    featured: input.featuredOrder !== undefined,
    featuredOrder: input.featuredOrder ?? null,
    images: [image(input.slug, input.art, input.name)],
    bulkPriceTiers: input.bulkPriceTiers ?? [],
    translationStatus: review.translationStatus,
    dataOrigin: review.dataOrigin,
  };
}

const categories: Category[] = [
  {
    slug: "herbal-plants",
    name: { en: "Herbal Plants", ta: "மூலிகைச் செடிகள்" },
    description: {
      en: "Herbs for a home courtyard, including tulasi, mint and other plants the nursery plans to grow.",
      ta: "வீட்டு முற்றத்துக்கான துளசி, புதினா உள்ளிட்ட மூலிகைச் செடிகள். இது மாதிரி விளக்கம்.",
    },
    sortOrder: 1,
  },
  {
    slug: "flowering-plants",
    name: { en: "Flowering Plants", ta: "பூச்செடிகள்" },
    description: {
      en: "Flowering plants such as senbagam, hibiscus and other varieties the nursery confirms.",
      ta: "செண்பகம், செம்பருத்தி உள்ளிட்ட பூச்செடிகள். இது மாதிரி விளக்கம்.",
    },
    sortOrder: 2,
  },
  {
    slug: "fruit-plants",
    name: { en: "Fruit Plants", ta: "பழச்செடிகள்" },
    description: {
      en: "Fruit plants for home gardens, from guava and mango to other varieties still being confirmed.",
      ta: "கொய்யா, மா உள்ளிட்ட வீட்டுத் தோட்டப் பழச்செடிகள். இது மாதிரி விளக்கம்.",
    },
    sortOrder: 3,
  },
];

const products: Product[] = [
  plant({
    slug: "rama-tulasi",
    categorySlug: "herbal-plants",
    name: { en: "Rama Tulasi", ta: "ராம துளசி" },
    summary: {
      en: "A bright holy basil grown for daily home use.",
      ta: "தினசரி வீட்டுப் பயன்பாட்டுக்கான துளசி. மாதிரி விளக்கம்.",
    },
    description: {
      en: "Sample listing for a Rama tulasi plant. The nursery will replace this description, price and photograph before publication.",
      ta: "ராம துளசிக்கான மாதிரி பட்டியல். வெளியிடுவதற்கு முன் விளக்கம், விலை மற்றும் படத்தை நாற்றங்கால் மாற்றும்.",
    },
    care: {
      en: "Keep the soil lightly moist and give the plant several hours of sun.",
      ta: "மண்ணை லேசாக ஈரமாக வைத்து, பல மணி நேரம் வெயில் கிடைக்கச் செய்யுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 14900,
    stockQuantity: 24,
    art: "herb",
    featuredOrder: 1,
  }),
  plant({
    slug: "krishna-tulasi",
    categorySlug: "herbal-plants",
    name: { en: "Krishna Tulasi", ta: "கிருஷ்ண துளசி" },
    summary: {
      en: "A purple-tinged holy basil, listed here as development data.",
      ta: "ஊதா நிற இலைகளுடன் கூடிய துளசி. இது மேம்பாட்டுத் தரவு.",
    },
    description: {
      en: "Sample Krishna tulasi listing. Confirm the variety name and pot size with the nursery before sale.",
      ta: "கிருஷ்ண துளசி மாதிரி பட்டியல். விற்பனைக்கு முன் வகைப் பெயரையும் தொட்டி அளவையும் உறுதி செய்யுங்கள்.",
    },
    care: {
      en: "Pinch growing tips if you want a bushier plant, and avoid waterlogged soil.",
      ta: "புதராக வளர நுனிகளைக் கிள்ளி விடுங்கள். நீர் தேங்க விடாதீர்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 16900,
    stockQuantity: 12,
    art: "herb",
  }),
  plant({
    slug: "mint",
    categorySlug: "herbal-plants",
    name: { en: "Mint", ta: "புதினா" },
    summary: {
      en: "A spreading kitchen herb for pots and boxes.",
      ta: "தொட்டிகளுக்கான சமையல் மூலிகை. மாதிரி விளக்கம்.",
    },
    description: {
      en: "Sample mint plant. Roots spread quickly, so the nursery may recommend a separate pot.",
      ta: "புதினா மாதிரிச் செடி. வேர்கள் வேகமாகப் பரவும், அதனால் தனித் தொட்டி பரிந்துரைக்கப்படலாம்.",
    },
    care: {
      en: "Water when the surface dries and harvest stems regularly.",
      ta: "மேற்பரப்பு காய்ந்ததும் நீர் ஊற்றி, தண்டுகளை அடிக்கடி அறுவடை செய்யுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 9900,
    stockQuantity: 30,
    art: "herb",
    featuredOrder: 4,
  }),
  plant({
    slug: "rosemary",
    categorySlug: "herbal-plants",
    name: { en: "Rosemary", ta: "ரோஸ்மேரி" },
    summary: {
      en: "A woody herb with a small sample stock quantity.",
      ta: "குறைந்த மாதிரி இருப்புடன் உள்ள மரமூலிகை.",
    },
    description: {
      en: "Sample rosemary listing used to show a low-stock plant. The quantity is not a live nursery count.",
      ta: "குறைந்த இருப்பு காட்டுவதற்கான ரோஸ்மேரி மாதிரி. இந்த எண்ணிக்கை நேரடி இருப்பு அல்ல.",
    },
    care: {
      en: "Give it sun and let the pot drain. It dislikes constantly wet roots.",
      ta: "வெயில் கொடுத்து, நீர் வடிய விடுங்கள். வேர்கள் எப்போதும் ஈரமாக இருக்கக் கூடாது. மாதிரி குறிப்பு.",
    },
    pricePaise: 17900,
    stockQuantity: 2,
    art: "herb",
  }),
  plant({
    slug: "lemongrass",
    categorySlug: "herbal-plants",
    name: { en: "Lemongrass", ta: "எலுமிச்சைப் புல்" },
    summary: {
      en: "A clumping grass used in the kitchen.",
      ta: "சமையலில் பயன்படும் புல் வகை. மாதிரி விளக்கம்.",
    },
    description: {
      en: "Sample lemongrass plant. Final pot size and price are waiting for the owner.",
      ta: "எலுமிச்சைப் புல் மாதிரிச் செடி. இறுதித் தொட்டி அளவும் விலையும் உரிமையாளர் உறுதிக்குக் காத்திருக்கின்றன.",
    },
    care: {
      en: "Keep it in sun and water deeply, then allow the top of the soil to dry slightly.",
      ta: "வெயிலில் வைத்து ஆழமாக நீர் ஊற்றுங்கள். பின் மண்ணின் மேல் பகுதி சிறிது காய்ந்த பிறகு அடுத்த நீர். மாதிரி குறிப்பு.",
    },
    pricePaise: 8900,
    stockQuantity: 18,
    art: "herb",
  }),
  plant({
    slug: "henna",
    categorySlug: "herbal-plants",
    name: { en: "Henna", ta: "மருதாணி" },
    summary: {
      en: "A shrub grown for its leaves.",
      ta: "இலைகளுக்காக வளர்க்கும் புதர். மாதிரி விளக்கம்.",
    },
    description: {
      en: "Sample henna listing. Care advice here is general and must be checked before it is published as guidance.",
      ta: "மருதாணி மாதிரி பட்டியல். இங்குள்ள பராமரிப்புக் குறிப்பு பொதுவானது; வெளியிடுவதற்கு முன் சரிபார்க்க வேண்டும்.",
    },
    care: {
      en: "Plant it where it receives sun, and protect very young plants from harsh afternoon heat.",
      ta: "வெயில் கிடைக்கும் இடத்தில் நடுங்கள். இளஞ்செடியை கடுமையான மதிய வெயிலிலிருந்து காப்பாற்றுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 12900,
    stockQuantity: 10,
    art: "herb",
  }),
  plant({
    slug: "hibiscus",
    categorySlug: "herbal-plants",
    name: { en: "Hibiscus", ta: "செம்பருத்தி" },
    summary: {
      en: "A familiar hibiscus listed with the herbal range for this sample.",
      ta: "இந்த மாதிரியில் மூலிகை வரிசையில் சேர்க்கப்பட்ட செம்பருத்தி.",
    },
    description: {
      en: "Sample hibiscus plant. The nursery will confirm whether this variety sits with herbal or flowering plants.",
      ta: "செம்பருத்தி மாதிரிச் செடி. இது மூலிகை வரிசையா அல்லது பூ வரிசையா என்பதை நாற்றங்கால் உறுதி செய்யும்.",
    },
    care: {
      en: "Water regularly in hot weather and give the shrub room to branch.",
      ta: "வெப்பமான நாட்களில் தொடர்ந்து நீர் ஊற்றி, கிளைக்க இடம் கொடுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 15900,
    stockQuantity: 15,
    art: "flower",
  }),
  plant({
    slug: "senbagam",
    categorySlug: "flowering-plants",
    name: { en: "Champa (Senbagam)", ta: "செண்பகம்" },
    summary: {
      en: "A fragrant flowering plant from the sample catalogue.",
      ta: "மாதிரிப் பட்டியலின் மணமுள்ள பூச்செடி.",
    },
    description: {
      en: "Sample senbagam listing. Flower colour, fragrance and mature size still need the owner's description.",
      ta: "செண்பக மாதிரி பட்டியல். பூவின் நிறம், மணம் மற்றும் வளர்ந்த அளவுக்கு உரிமையாளர் விளக்கம் தேவை.",
    },
    care: {
      en: "Choose a bright spot and water deeply rather than keeping the leaves constantly wet.",
      ta: "வெளிச்சமான இடத்தைத் தேர்ந்தெடுங்கள். இலைகளை எப்போதும் நனைய விடாமல் ஆழமாக நீர் ஊற்றுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 24900,
    stockQuantity: 8,
    art: "flower",
    featuredOrder: 2,
  }),
  plant({
    slug: "hybrid-hibiscus",
    categorySlug: "flowering-plants",
    name: { en: "Hybrid Hibiscus", ta: "கலப்பின செம்பருத்தி" },
    summary: {
      en: "A flowering hibiscus shown as a featured sample.",
      ta: "சிறப்பு மாதிரியாகக் காட்டப்படும் பூக்கும் செம்பருத்தி.",
    },
    description: {
      en: "Sample hybrid hibiscus. The flower colour on the card is an illustration placeholder, not a photograph of this variety.",
      ta: "கலப்பின செம்பருத்தி மாதிரி. அட்டையிலுள்ள பூ வரைபடம் இந்த வகையின் புகைப்படம் அல்ல.",
    },
    care: {
      en: "Give it sun, regular water and a prune after a flush of flowers if you want a tidier shrub.",
      ta: "வெயில், வழக்கமான நீர் மற்றும் பூத்த பிறகு தேவைப்பட்டால் கத்தரிப்பு கொடுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 19900,
    stockQuantity: 14,
    art: "flower",
    featuredOrder: 3,
  }),
  plant({
    slug: "december-flower",
    categorySlug: "flowering-plants",
    name: { en: "December Flower", ta: "டிசம்பர் பூ" },
    summary: {
      en: "A seasonal flowering plant. The exact variety is not confirmed yet.",
      ta: "பருவப் பூச்செடி. சரியான வகை இன்னும் உறுதி செய்யப்படவில்லை.",
    },
    description: {
      en: "Sample listing using the nursery's name December flower. The botanical variety must be confirmed before this page is treated as a product record.",
      ta: "நாற்றங்கால் சொல்லும் டிசம்பர் பூ என்ற பெயரில் மாதிரி பட்டியல். இதைப் பொருள் பதிவாகக் கருதுவதற்கு முன் தாவர வகையை உறுதி செய்ய வேண்டும்.",
    },
    care: {
      en: "Keep the sample guidance general: bright light and soil that drains.",
      ta: "மாதிரி வழிகாட்டல் பொதுவானது: நல்ல வெளிச்சம் மற்றும் வடியும் மண்.",
    },
    pricePaise: 15900,
    stockQuantity: 9,
    art: "flower",
  }),
  plant({
    slug: "guava",
    categorySlug: "fruit-plants",
    name: { en: "Guava", ta: "கொய்யா" },
    summary: {
      en: "A fruit plant for a home garden, shown with a sample price.",
      ta: "வீட்டுத் தோட்டத்துக்கான பழச்செடி. மாதிரி விலையுடன்.",
    },
    description: {
      en: "Sample guava plant. Variety, graft type and expected fruiting time are not confirmed.",
      ta: "கொய்யா மாதிரிச் செடி. வகை, ஒட்டு முறை மற்றும் காய்க்கும் காலம் உறுதி செய்யப்படவில்லை.",
    },
    care: {
      en: "Plant it in sun, water young plants regularly, and leave space for the canopy.",
      ta: "வெயிலில் நடுங்கள். இளஞ்செடிக்கு வழக்கமாக நீர் ஊற்றி, விதானத்துக்கு இடம் விடுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 29900,
    stockQuantity: 11,
    art: "fruit",
    featuredOrder: 5,
  }),
  plant({
    slug: "pomegranate",
    categorySlug: "fruit-plants",
    name: { en: "Pomegranate", ta: "மாதுளை" },
    summary: {
      en: "A fruiting shrub in the sample catalogue.",
      ta: "மாதிரிப் பட்டியலின் பழப்புதர்.",
    },
    description: {
      en: "Sample pomegranate plant. Sun requirement and pot or ground planting advice will be confirmed by the nursery.",
      ta: "மாதுளை மாதிரிச் செடி. வெயில் தேவையும் தொட்டி அல்லது நில நடவு ஆலோசனையும் நாற்றங்கால் உறுதி செய்யும்.",
    },
    care: {
      en: "Give it a warm, sunny place and do not keep the roots standing in water.",
      ta: "வெப்பமும் வெயிலும் உள்ள இடம் கொடுங்கள். வேர்கள் நீரில் நிற்க விடாதீர்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 34900,
    stockQuantity: 6,
    art: "fruit",
  }),
  plant({
    slug: "mango",
    categorySlug: "fruit-plants",
    name: { en: "Mango", ta: "மா" },
    summary: {
      en: "A sample mango plant with an illustrative bulk tier.",
      ta: "விளக்கத்துக்கான மொத்த விலை அடுக்குடன் உள்ள மா மாதிரிச் செடி.",
    },
    description: {
      en: "Sample mango listing. The variety is intentionally unnamed until the owner confirms what is for sale. The bulk tier is development data, not an approved price.",
      ta: "மா மாதிரி பட்டியல். உரிமையாளர் உறுதி செய்யும் வரை வகை பெயரிடப்படவில்லை. மொத்த விலை அடுக்கு அங்கீகரிக்கப்பட்ட விலை அல்ல.",
    },
    care: {
      en: "Young plants need regular water and protection from strong wind.",
      ta: "இளஞ்செடிகளுக்கு வழக்கமான நீரும் கடுமையான காற்றிலிருந்து பாதுகாப்பும் தேவை. மாதிரி குறிப்பு.",
    },
    pricePaise: 39900,
    stockQuantity: 7,
    art: "fruit",
    featuredOrder: 6,
    bulkPriceTiers: [{ minQuantity: 5, pricePaise: 35900 }],
  }),
  plant({
    slug: "sapota",
    categorySlug: "fruit-plants",
    name: { en: "Sapota", ta: "சப்போட்டா" },
    summary: {
      en: "A tropical fruit plant in the sample set.",
      ta: "மாதிரித் தொகுதியின் வெப்பமண்டலப் பழச்செடி.",
    },
    description: {
      en: "Sample sapota plant. Stock and price are placeholders for layout and search testing.",
      ta: "சப்போட்டா மாதிரிச் செடி. இருப்பு மற்றும் விலை அமைப்பு மற்றும் தேடல் சோதனைக்கான இடமாற்றிகள்.",
    },
    care: {
      en: "Keep young plants watered and give them increasing sun as they establish.",
      ta: "இளஞ்செடிகளுக்கு நீர் ஊற்றி, நிலைபெறும்போது வெயிலைப் படிப்படியாக அதிகரியுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 27900,
    stockQuantity: 5,
    art: "fruit",
  }),
  plant({
    slug: "amla",
    categorySlug: "fruit-plants",
    name: { en: "Amla", ta: "நெல்லி" },
    summary: {
      en: "An amla plant listed so the fruit category has a familiar local name.",
      ta: "பழ வகையில் பழக்கமான பெயராக நெல்லி சேர்க்கப்பட்டுள்ளது.",
    },
    description: {
      en: "Sample amla listing. The nursery still needs to confirm size, price and whether plants are available this season.",
      ta: "நெல்லி மாதிரி பட்டியல். அளவு, விலை மற்றும் இந்தப் பருவத்தில் கிடைக்குமா என்பதை நாற்றங்கால் உறுதி செய்ய வேண்டும்.",
    },
    care: {
      en: "Choose a sunny position and water deeply during dry weeks.",
      ta: "வெயில் மிகுந்த இடத்தைத் தேர்வு செய்து, வறண்ட வாரங்களில் ஆழமாக நீர் ஊற்றுங்கள். மாதிரி குறிப்பு.",
    },
    pricePaise: 24900,
    stockQuantity: 8,
    art: "fruit",
  }),
  plant({
    slug: "fig",
    categorySlug: "fruit-plants",
    name: { en: "Fig", ta: "அத்தி" },
    summary: {
      en: "A fig plant in the development catalogue.",
      ta: "மேம்பாட்டுப் பட்டியலின் அத்திச் செடி.",
    },
    description: {
      en: "Sample fig listing. Handling notes for transport will be added when delivery rules are confirmed.",
      ta: "அத்தி மாதிரி பட்டியல். விநியோக விதிகள் உறுதியானதும் கையாளும் குறிப்புகள் சேர்க்கப்படும்.",
    },
    care: {
      en: "Figs like sun. Let the soil dry a little between waterings once the plant is established.",
      ta: "அத்திக்கு வெயில் பிடிக்கும். செடி நிலைபெற்ற பின் நீர்ப்பாசனங்களுக்கு இடையே மண் சிறிது காய்ந்திருக்கட்டும். மாதிரி குறிப்பு.",
    },
    pricePaise: 28900,
    stockQuantity: 4,
    art: "fruit",
  }),
  plant({
    slug: "water-apple",
    categorySlug: "fruit-plants",
    name: { en: "Water Apple", ta: "நீர் ஆப்பிள்" },
    summary: {
      en: "Included to demonstrate an out-of-stock sample.",
      ta: "இருப்பு இல்லாத மாதிரியைக் காட்ட சேர்க்கப்பட்டுள்ளது.",
    },
    description: {
      en: "Sample water apple with zero stock. The cart must not accept it. The Tamil name is a draft for the owner to correct.",
      ta: "இருப்பு சுழியான நீர் ஆப்பிள் மாதிரி. கூடை இதை ஏற்கக் கூடாது. தமிழ் பெயர் உரிமையாளர் திருத்துவதற்கான வரைவு.",
    },
    care: {
      en: "Care notes will be published with the confirmed variety.",
      ta: "உறுதி செய்யப்பட்ட வகையுடன் பராமரிப்புக் குறிப்புகள் வெளியிடப்படும்.",
    },
    pricePaise: 32900,
    stockQuantity: 0,
    art: "fruit",
  }),
];

const careGuides: CareGuide[] = [
  {
    slug: "watering-new-plants",
    title: { en: "Watering new plants", ta: "புதிய செடிகளுக்கு நீர் ஊற்றுதல்" },
    summary: {
      en: "A short draft about watering plants in the first weeks after they arrive.",
      ta: "செடி வந்த முதல் வாரங்களில் நீர் ஊற்றுவது பற்றிய சிறு வரைவு.",
    },
    body: {
      en: "Check the soil with a finger before watering. If the top feels dry, water until it drains from the pot, then empty any standing water from the saucer.\n\nNew plants usually need more attention than established ones. Hot, windy days dry pots quickly. This guide is a draft and is not a promise about plant survival.",
      ta: "நீர் ஊற்றுவதற்கு முன் விரலால் மண்ணைப் பாருங்கள். மேற்பகுதி காய்ந்திருந்தால், தொட்டியிலிருந்து நீர் வடியும் வரை ஊற்றுங்கள். தட்டில் தேங்கும் நீரைக் காலி செய்யுங்கள்.\n\nபுதிய செடிகளுக்கு நிலைபெற்ற செடிகளை விட அதிக கவனம் தேவை. வெப்பமும் காற்றும் தொட்டிகளை விரைவில் உலர்த்தும். இது வரைவு; செடி பிழைக்கும் என்ற உறுதி அல்ல.",
    },
    sortOrder: 1,
    translationStatus: "unverified",
  },
  {
    slug: "light-and-placement",
    title: { en: "Light and placement", ta: "வெளிச்சமும் இடமும்" },
    summary: {
      en: "How to read the light notes on a plant page.",
      ta: "ஒரு செடிப் பக்கத்திலுள்ள வெளிச்சக் குறிப்பைப் படிப்பது எப்படி.",
    },
    body: {
      en: "A sunny doorway, a bright veranda and deep shade are different places. Match the plant's note rather than moving every pot into the strongest afternoon sun.\n\nLeaves that scorch or stretch are a sign to adjust the spot. The sample products use general notes until the nursery writes variety-specific guidance.",
      ta: "வெயில் மிக்க வாசல், வெளிச்சமான திண்ணை மற்றும் ஆழ்ந்த நிழல் வெவ்வேறு இடங்கள். எல்லாத் தொட்டிகளையும் மதிய வெயிலில் வைக்காமல், செடியின் குறிப்புக்கு ஏற்ப வையுங்கள்.\n\nஇலை கருகுவதும் நீண்டு வளர்வதும் இடத்தை மாற்ற வேண்டும் என்ற அறிகுறி. வகைக்கேற்ற வழிகாட்டலை நாற்றங்கால் எழுதும் வரை மாதிரிச் செடிகளில் பொதுக் குறிப்புகள் உள்ளன.",
    },
    sortOrder: 2,
    translationStatus: "unverified",
  },
  {
    slug: "potting-mix",
    title: { en: "Potting mix", ta: "தொட்டிக் கலவை" },
    summary: {
      en: "A draft introduction to pots that drain.",
      ta: "நீர் வடியும் தொட்டிகள் பற்றிய வரைவு அறிமுகம்.",
    },
    body: {
      en: "Use a pot with drainage holes. A loose mix lets water pass and still holds some moisture. Heavy garden soil alone can stay wet for too long in a container.\n\nThe nursery has not published a required mix or a product for sale on this page. Ask before buying soil or fertiliser in bulk.",
      ta: "வடிகால் துளைகள் உள்ள தொட்டியைப் பயன்படுத்துங்கள். தளர்வான கலவை நீரைக் கடக்க விட்டு, சிறிது ஈரத்தையும் வைத்திருக்கும். தோட்ட மண் மட்டும் கொள்கலனில் நீண்ட நேரம் ஈரமாக இருக்கலாம்.\n\nஇந்தப் பக்கத்தில் கட்டாயக் கலவையையோ விற்பனைப் பொருளையோ நாற்றங்கால் வெளியிடவில்லை. மண் அல்லது உரத்தை மொத்தமாக வாங்குவதற்கு முன் கேளுங்கள்.",
    },
    sortOrder: 3,
    translationStatus: "unverified",
  },
];

export const sampleCatalogue: CatalogueSnapshot = catalogueSnapshotSchema.parse({
  categories,
  products,
  careGuides,
});
