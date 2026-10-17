export type ImageCredit = {
  photographer: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
};

const credits: Record<string, ImageCredit> = {
  "local:/plants/rama-tulasi.webp": {
    photographer: "Satheesh Sankaran",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Holy_Basil_or_Rama_Thulasi_plant_leaves.jpg",
  },
  "local:/plants/krishna-tulasi.webp": {
    photographer: "Diamante Phi",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Holy_Basil(Krishna;Ocimum_tenuiflorum).jpg",
  },
  "local:/plants/mint.webp": {
    photographer: "Forest & Kim Starr",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Starr_080607-7278_Mentha_x_spicata.jpg",
  },
  "local:/plants/rosemary.webp": {
    photographer: "Christian Ferrer",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rosmarinus_officinalis_in_Vieussan.jpg",
  },
  "local:/plants/lemongrass.webp": {
    photographer: "Obsidian Soul",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tanglad_(lemongrass,_Cymbopogon_citratus)_-_Philippines.jpg",
  },
  "local:/plants/henna.webp": {
    photographer: "235uranium",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Small_Lawsonia_inermis_Plant.png",
  },
  "local:/plants/hibiscus.webp": {
    photographer: "Alvesgaspar",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hibiscus_August_2012-2.jpg",
  },
  "local:/plants/senbagam.webp": {
    photographer: "Yercaud-elango",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Michelia_champaca-1-yelagiri-vellore-India.jpg",
  },
  "local:/plants/guava.webp": {
    photographer: "Kristof Zyskowski & Yulia Bereshpolova",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Myrtaceae-_Psidium_guajava_(guava)_-_40592026925.jpg",
  },
  "local:/plants/pomegranate.webp": {
    photographer: "Alvesgaspar",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Punica_April_2011-1.jpg",
  },
  "local:/plants/mango.webp": {
    photographer: "Biswarup Ganguly",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mango_Plant_6509.JPG",
  },
  "local:/plants/sapota.webp": {
    photographer: "Richard Stanway",
    license: "Public domain",
    licenseUrl: null,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sapodilla_tree.jpg",
  },
  "local:/plants/amla.webp": {
    photographer: "Adityamadhav83",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amla_tree_(Phyllanthus_emblica)_at_Vivekananda_Park_in_Kakinada.jpg",
  },
};

export const categoryCoverSlug = {
  "herbal-plants": "rama-tulasi",
  "flowering-plants": "senbagam",
  "fruit-plants": "mango",
} as const;

export function imageCreditFor(storageKey: string): ImageCredit | null {
  return credits[storageKey] ?? null;
}

export function isLocalPhoto(storageKey: string | undefined): boolean {
  return storageKey?.startsWith("local:/plants/") ?? false;
}
