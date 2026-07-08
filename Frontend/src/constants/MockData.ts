export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ForestInfo {
  id: string;
  name: string;
  surface: string;
  status: string;
  description: string;
  elevation: string;
  treeCount: string;
  region: string;
}

export interface AssociationInfo {
  name: string;
  founded: string;
  members: number;
  products: string[];
  certifications: string[];
  impact: string;
  phone: string;
}

export interface EconomicData {
  production: {
    title: string;
    value: string;
    description: string;
    history: { year: string; amount: number }[];
  };
  price: {
    title: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down' | 'stable';
    history: number[];
  };
  market: {
    title: string;
    value: string;
    shares: { label: string; percentage: number; color: string }[];
  };
  traders: {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
    certified: boolean;
  }[];
}

// Région Souss-Massa, Maroc - Autour de Aït Baha
export const MAP_CENTER = {
  latitude: 30.0716,
  longitude: -9.1498,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Polygone réaliste entourant la zone forestière d'arganiers d'Aït Baha
export const ARGAN_FOREST_POLYGON: Coordinate[] = [
  { latitude: 30.088, longitude: -9.165 },
  { latitude: 30.092, longitude: -9.142 },
  { latitude: 30.075, longitude: -9.128 },
  { latitude: 30.052, longitude: -9.146 },
  { latitude: 30.061, longitude: -9.171 },
];

// Centroïde géométrique du polygone pour positionner le marqueur d'association
export const ASSOCIATION_MARKER_COORD: Coordinate = {
  latitude: 30.0736,
  longitude: -9.1504,
};

// Détails de la forêt cliquée (Modal)
export const MOCK_FOREST_INFO: ForestInfo = {
  id: 'ait-baha-1',
  name: "Forêt d'Argane d'Aït Baha",
  surface: "1 200 Hectares",
  status: "Zone Protégée (UNESCO Biosphère)",
  description: "Cette zone abrite certains des arganiers sauvages les plus denses et anciens de la région Souss-Massa. La forêt fait l'objet d'un plan de conservation et de régénération stricte, géré conjointement avec les populations locales.",
  elevation: "550m - 720m d'altitude",
  treeCount: "Environ 150 000 arbres",
  region: "Province de Chtouka-Aït Baha, Maroc",
};

// Détails de l'association au centre
export const MOCK_ASSOCIATION_INFO: AssociationInfo = {
  name: "Coopérative Féminine Tighanimine",
  founded: "2007",
  members: 68,
  products: ["Huile d'argan cosmétique", "Huile d'argan alimentaire bio", "Amlou artisanal"],
  certifications: ["Fairtrade (Commerce Équitable)", "Ecocert Bio", "IGP Argane du Maroc"],
  impact: "Garantit des revenus stables et équitables à plus de 60 femmes rurales, finançant des cours d'alphabétisation et l'accès à la santé pour leurs familles.",
  phone: "+212 5 28 84 12 34",
};

// Données économiques d'Affiyach
export const MOCK_ECONOMIC_DATA: EconomicData = {
  production: {
    title: "Production Annuelle",
    value: "4 500 Tonnes (2023)",
    description: "Rendement cumulé des coopératives de la province.",
    history: [
      { year: "2020", amount: 3600 },
      { year: "2021", amount: 4100 },
      { year: "2022", amount: 3850 },
      { year: "2023", amount: 4500 },
    ],
  },
  price: {
    title: "Prix Moyen de l'Huile (Litre)",
    value: "350 MAD / L",
    trend: "+5.2% ce mois",
    trendDirection: 'up',
    history: [310, 325, 330, 328, 335, 350], // Derniers 6 mois
  },
  market: {
    title: "Marchés de Destination",
    value: "65% Exportation",
    shares: [
      { label: "Export (Europe)", percentage: 40, color: "#2E7D32" }, // Vert argan
      { label: "Export (USA/Asie)", percentage: 25, color: "#C5A029" }, // Doré huile
      { label: "Marché Local", percentage: 35, color: "#8B5A2B" }, // Brun terre
    ],
  },
  traders: [
    {
      id: "trader-1",
      firstName: "Youssef",
      lastName: "Bennouna",
      name: "Youssef Bennouna",
      location: "Zone Industrielle Tassila, Agadir",
      phone: "+212 5 28 33 44 55",
      email: "youssef.bennouna@argantrade.ma",
      perimeters: ["Tassila industrial zone", "Agadir market"],
      transactionCount: 124,
      certified: true,
    },
    {
      id: "trader-2",
      firstName: "Leila",
      lastName: "Mansouri",
      name: "Leila Mansouri",
      location: "Port de Casablanca, Bureau C-4",
      phone: "+212 5 22 99 88 77",
      email: "leila.mansouri@atlasoils.com",
      perimeters: ["Casablanca port", "International export"],
      transactionCount: 98,
      certified: true,
    },
    {
      id: "trader-3",
      firstName: "Amal",
      lastName: "Ait Baha",
      name: "Amal Ait Baha",
      location: "Commune d'Aït Baha",
      phone: "+212 6 61 23 45 67",
      email: "amal@tighanimine.org",
      perimeters: ["Aït Baha commune", "Local market"],
      transactionCount: 57,
      certified: true,
    },
  ],
};
// Project data structures
export interface ProjectInfo {
  id: string;
  name: string;
  identificationDate: string; // e.g., YYYY-MM-DD
  perimeter: string; // description of area
  cooperative: string;
  description: string;
}

export const MOCK_PROJECTS: ProjectInfo[] = [
  {
    id: 'proj-1',
    name: 'Reforestation Aït Baha',
    identificationDate: '2022-03-15',
    perimeter: '50 ha autour du secteur nord',
    cooperative: 'Coopérative Féminine Tighanimine',
    description: "Plantation de 30 000 jeunes arganiers pour restaurer la zone dégradée et renforcer la biodiversité.",
  },
  {
    id: 'proj-2',
    name: 'Production d’huile biologique',
    identificationDate: '2023-06-01',
    perimeter: '30 ha – site de transformation',
    cooperative: 'Coopérative Tighanimine (Direct)',
    description: "Mise en place d’un laboratoire de pressage d’huile d’argan certifié bio, soutien aux femmes productrices.",
  },
  {
    id: 'proj-3',
    name: 'Écotourisme durable',
    identificationDate: '2024-01-20',
    perimeter: '15 km² de sentiers balisés',
    cooperative: 'Coopérative Féminine Tighanimine',
    description: "Création de circuits de visite guidée, ateliers traditionnels et points d’observation pour valoriser le patrimoine naturel.",
  },
];

