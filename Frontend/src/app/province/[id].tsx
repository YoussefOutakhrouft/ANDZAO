import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Home, MapPin, Package, Award, ArrowLeft, Calendar, FileText, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import api from '../../api/api';
import ProvinceMap from '../../components/ProvinceMap';

// Mocks locales pour assurer le fonctionnement immédiat et hors-ligne (Fallback)
const MOCK_PROVINCES = [
  { id: '1', name: 'Essaouira' },
  { id: '2', name: 'Agadir Idaoutanan' },
  { id: '3', name: 'Taroudant' },
  { id: '4', name: 'Chtouka Ait Baha' },
  { id: '5', name: 'Tiznit' },
  { id: '6', name: 'Sidi Ifni' },
  { id: '7', name: 'Guelmim' }
];

const MOCK_PERIMETRES: Record<string, any[]> = {
  '5': [ // Tiznit
    { id: '1', nom: 'Anzi', productionAnnuelle: 180.0 },
    { id: '2', nom: 'Tafraout', productionAnnuelle: 95.0 },
    { id: '3', nom: 'Tiznit (Centre)', productionAnnuelle: 120.0 }
  ]
};

const MOCK_DONNEES_ARGANERIE: Record<string, any> = {
  '1': { // Anzi
    prixChronologies: [
      { id: 1, annee: 2023, mois: 1, prixMinimum: 300.0, prixMaximum: 350.0, marchePrincipal: 'Marché Hebdomadaire Local' },
      { id: 2, annee: 2023, mois: 6, prixMinimum: 320.0, prixMaximum: 380.0, marchePrincipal: 'Marché de Gros Tiznit' },
      { id: 3, annee: 2023, mois: 12, prixMinimum: 340.0, prixMaximum: 390.0, marchePrincipal: 'Marché de Gros Tiznit' },
      { id: 4, annee: 2024, mois: 1, prixMinimum: 350.0, prixMaximum: 400.0, marchePrincipal: 'Marché Direct' },
      { id: 5, annee: 2024, mois: 5, prixMinimum: 360.0, prixMaximum: 420.0, marchePrincipal: 'Marché de Gros Tiznit' }
    ],
    traders: [
      { id: 1, nom: 'Youssef Bennouna', marchesCode: 'Anzi, Agadir, Casablanca', email: 'youssef.bennouna@argantrade.ma', telephone: '+212 5 28 33 44 55' }
    ]
  },
  '2': { // Tafraout
    prixChronologies: [
      { id: 6, annee: 2023, mois: 1, prixMinimum: 290.0, prixMaximum: 340.0, marchePrincipal: 'Marché Local' },
      { id: 7, annee: 2024, mois: 1, prixMinimum: 340.0, prixMaximum: 390.0, marchePrincipal: 'Marché Direct' }
    ],
    traders: [
      { id: 2, nom: 'Leila Mansouri', marchesCode: 'Tafraout, Casablanca, Export', email: 'leila.mansouri@atlasoils.com', telephone: '+212 5 22 99 88 77' }
    ]
  },
  '3': { // Tiznit Centre
    prixChronologies: [
      { id: 8, annee: 2023, mois: 1, prixMinimum: 310.0, prixMaximum: 360.0, marchePrincipal: 'Marché de Gros Tiznit' },
      { id: 9, annee: 2024, mois: 1, prixMinimum: 360.0, prixMaximum: 410.0, marchePrincipal: 'Marché de Gros Tiznit' }
    ],
    traders: [
      { id: 3, nom: 'Amal Ait Baha', marchesCode: 'Tiznit, Agadir, Local', email: 'amal@tighanimine.org', telephone: '+212 6 61 23 45 67' }
    ]
  }
};

const MOCK_PROJETS_UCCA: Record<string, any[]> = {
  '1': [ // Anzi
    {
      id: '1',
      nomProjet: 'UCCA Anzi Nord',
      description: 'Construction d\'une unité moderne de concassage mécanique pour réduire la pénibilité du travail des femmes et augmenter le rendement d\'extraction de l\'huile d\'argane.',
      dateIdentification: '2023-03-15',
      approvisionnement: 'Collecte directe auprès des coopératives agricoles et des cueilleuses de la commune d\'Anzi.',
      ecoulement: 'Canal court vers les coopératives cosmétiques d\'Agadir et exportateur agréé.',
      cooperativesEncadrantes: 'Coopérative Féminine Tighanimine, Association d\'Anzi',
      duree: '18 mois'
    }
  ],
  '2': [ // Tafraout
    {
      id: '2',
      nomProjet: 'UCCA Tafraout Montagne',
      description: 'Mise en place d\'une unité pilote de concassage et de stockage des amandons adaptée aux zones accidentées de montagne pour les coopératives locales.',
      dateIdentification: '2024-01-10',
      approvisionnement: 'Récolte forestière sur les pentes de l\'Anti-Atlas autour de Tafraout.',
      ecoulement: 'Commercialisation sous label d\'origine (IGP Argane) pour les herboristeries de luxe et l\'agro-tourisme.',
      cooperativesEncadrantes: 'Coopérative Féminine Tafraout',
      duree: '12 mois'
    }
  ],
  '3': [ // Tiznit Centre
    {
      id: '3',
      nomProjet: 'UCCA Tiznit Centre',
      description: 'Projet d\'extension de l\'unité de traitement centrale pour y ajouter une ligne d\'emballage et de conditionnement aux normes d\'exportation.',
      dateIdentification: '2023-08-20',
      approvisionnement: 'Apport de matière première depuis les périmètres limitrophes de la province de Tiznit.',
      ecoulement: 'Réseaux de grande distribution nationaux et circuits d\'exportation bio vers l\'Europe.',
      cooperativesEncadrantes: 'Coopérative Tiznit Argan, GIE Souss-Massa',
      duree: '24 mois'
    }
  ]
};

// Component: ProductionChart
function ProductionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(p => p.productionAnnuelle || 50), 10);
  const chartHeight = data.length * 45 + 30;

  return (
    <View style={{ backgroundColor: '#FFFFFF', padding: 18, borderRadius: 10, borderWidth: 1, borderColor: '#D2DDD2', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E4620', marginBottom: 4 }}>
        📈 Quantité de Production Annuelle Estimée
      </Text>
      <Text style={{ fontSize: 12, color: '#5A6B5A', marginBottom: 16 }}>
        Comparatif de la récolte d'argane en tonnes par périmètre pour la province active.
      </Text>
      <svg width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
        {data.map((perim, idx) => {
          const prod = perim.productionAnnuelle || 0;
          const pct = Math.min((prod / maxVal) * 100, 100);
          const barWidth = `${pct * 0.7}%`; // scale to leave room for text
          const y = idx * 45 + 10;
          return (
            <g key={perim.id || idx}>
              <text x="110" y={y + 14} fill="#1E4620" fontSize="12" fontWeight="600" textAnchor="end">
                {perim.nom}
              </text>
              <rect x="120" y={y} width="70%" height="20" fill="#F3F4F6" rx="4" ry="4" />
              <rect x="120" y={y} width={barWidth} height="20" fill="url(#emeraldGrad)" rx="4" ry="4" />
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              <text x={`calc(128px + ${barWidth})`} y={y + 14} fill="#047857" fontSize="12" fontWeight="700">
                {prod} tonnes
              </text>
            </g>
          );
        })}
      </svg>
    </View>
  );
}

// Component: PriceChart
function PriceChart({ prices, year }: { prices: any[], year: string }) {
  const yearPrices = prices
    .filter(p => String(p.annee) === year)
    .sort((a, b) => a.mois - b.mois);

  if (yearPrices.length === 0) {
    return (
      <View style={{ padding: 16, backgroundColor: '#FAFAF5', borderRadius: 8, borderWidth: 1, borderColor: '#D2DDD2', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>Aucune donnée de prix disponible pour {year}</Text>
      </View>
    );
  }

  const allMins = yearPrices.map(p => p.prixMinimum);
  const allMaxs = yearPrices.map(p => p.prixMaximum);
  const absoluteMin = Math.max(Math.min(...allMins) - 20, 0);
  const absoluteMax = Math.max(...allMaxs) + 20;
  const range = absoluteMax - absoluteMin;

  const chartHeight = 160;
  const chartWidth = 520;
  const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jlt", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  return (
    <View style={{ backgroundColor: '#FAFAF5', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D2DDD2', marginTop: 14 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#8B5A2B', marginBottom: 4 }}>
        📈 Évolution Mensuelle des Prix (MAD/Litre) en {year}
      </Text>
      <Text style={{ fontSize: 11, color: '#5A6B5A', marginBottom: 12 }}>
        Diagramme des fourchettes constatées par mois (prix minimum et maximum de l'huile d'argane).
      </Text>

      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: 6 }}>
        <svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible', margin: '0 auto', display: 'block' }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = 15 + ratio * 100;
            const priceVal = Math.round(absoluteMax - ratio * range);
            return (
              <g key={idx}>
                <line x1="45" y1={y} x2={chartWidth - 10} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3,3" />
                <text x="35" y={y + 4} fill="#9CA3AF" fontSize="10" fontWeight="600" textAnchor="end">
                  {priceVal}
                </text>
              </g>
            );
          })}

          {yearPrices.map((price, idx) => {
            const x = 55 + idx * 38;
            const yMax = 15 + ((absoluteMax - price.prixMaximum) / range) * 100;
            const yMin = 15 + ((absoluteMax - price.prixMinimum) / range) * 100;
            const colHeight = Math.max(yMin - yMax, 6);

            return (
              <g key={price.id || idx}>
                <line x1={x + 11} y1="15" x2={x + 11} y2="115" stroke="#F3F4F6" strokeWidth="1" />
                <rect
                  x={x}
                  y={yMax}
                  width="22"
                  height={colHeight}
                  fill="url(#bronzeGrad)"
                  rx="3"
                  ry="3"
                />
                <text x={x + 11} y={yMax - 4} fill="#1E4620" fontSize="9" fontWeight="700" textAnchor="middle">
                  {Math.round(price.prixMaximum)}
                </text>
                <text x={x + 11} y={yMin + 11} fill="#8B5A2B" fontSize="9" fontWeight="700" textAnchor="middle">
                  {Math.round(price.prixMinimum)}
                </text>
                <text x={x + 11} y="138" fill="#5A6B5A" fontSize="10" fontWeight="700" textAnchor="middle">
                  {monthLabels[price.mois - 1]}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="bronzeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5A2B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </View>
  );
}

export default function ProvinceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = Colors;

  const [activeTab, setActiveTab] = useState<'carte' | 'donnees' | 'projets'>('carte');
  const [province, setProvince] = useState<any>(null);
  const [perimeters, setPerimeters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Accordéon strict des périmètres (Pour Onglet 2 et 3)
  const [openPerimId, setOpenPerimId] = useState<string | null>(null);

  // Données dynamiques du périmètre sélectionné
  const [selectedPerimData, setSelectedPerimData] = useState<any>(null);
  const [selectedPerimProjets, setSelectedPerimProjets] = useState<any[]>([]);
  const [loadingPerimData, setLoadingPerimData] = useState(false);

  // Filtre Prix par Année/Mois
  const [filterYear, setFilterYear] = useState<string>('2024');
  const [filterMonth, setFilterMonth] = useState<string>('1');

  // Projet UCCA sélectionné pour affichage des détails
  const [selectedProjet, setSelectedProjet] = useState<any>(null);

  // Charger les détails de la province
  useEffect(() => {
    const loadProvinceData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Tenter de charger depuis l'API
        const provData = await api.getProvince(id);
        const perimsData = await api.getPerimetres(id);

        setProvince({ id: String(provData.id), name: provData.nom });
        setPerimeters(perimsData.map((p: any) => ({
          id: String(p.id),
          nom: p.nom,
          productionAnnuelle: p.productionAnnuelle
        })));
      } catch (error) {
        console.warn("Impossible de charger les données province du backend, fallback local.", error);
        // Fallback local
        const matchedProv = MOCK_PROVINCES.find(p => p.id === id);
        setProvince(matchedProv || { id, name: `Province ${id}` });
        
        // Perimètres
        const matchedPerims = MOCK_PERIMETRES[id] || [
          { id: `${id}1`, nom: `Périmètre ${id}-A`, productionAnnuelle: 110.0 },
          { id: `${id}2`, nom: `Périmètre ${id}-B`, productionAnnuelle: 85.0 }
        ];
        setPerimeters(matchedPerims);
      } finally {
        setLoading(false);
      }
    };
    loadProvinceData();
  }, [id]);

  // Charger les données d'un périmètre lorsqu'on l'ouvre dans l'accordéon
  useEffect(() => {
    if (!openPerimId) return;

    const loadPerimDetails = async () => {
      setLoadingPerimData(true);
      try {
        const arganerie = await api.getDonneesArganerie(openPerimId);
        const projets = await api.getProjetsUcca(openPerimId);
        
        setSelectedPerimData(arganerie);
        setSelectedPerimProjets(projets);
      } catch (error) {
        console.warn("Impossible de charger les données du périmètre du backend, fallback local.", error);
        // Fallback local
        const localArganerie = MOCK_DONNEES_ARGANERIE[openPerimId] || {
          prixChronologies: [
            { id: 101, annee: 2024, mois: 1, prixMinimum: 320.0, prixMaximum: 380.0, marchePrincipal: 'Marché Local' }
          ],
          traders: [
            { id: 101, nom: 'Trader Fictif', marchesCode: 'Local', email: 'contact@trader.ma', telephone: '+212 6 00 00 00 00' }
          ]
        };
        const localProjets = MOCK_PROJETS_UCCA[openPerimId] || [
          {
            id: 'mock-proj',
            nomProjet: 'UCCA Projet Exemple',
            description: 'Description du projet exemple dans ce périmètre.',
            dateIdentification: '2024-01-01',
            approvisionnement: 'Ressources locales',
            ecoulement: 'Marché national',
            cooperativesEncadrantes: 'Coopérative Locale',
            duree: '12 mois'
          }
        ];
        // S'assurer qu'on garde les propriétés du périmètre actuel
        const perimObj = perimeters.find(p => p.id === openPerimId);
        setSelectedPerimData({
          id: openPerimId,
          nom: perimObj ? perimObj.nom : 'Périmètre',
          productionAnnuelle: perimObj ? perimObj.productionAnnuelle : 100.0,
          prixChronologies: localArganerie.prixChronologies,
          traders: localArganerie.traders
        });
        setSelectedPerimProjets(localProjets);
      } finally {
        setLoadingPerimData(false);
      }
    };

    loadPerimDetails();
  }, [openPerimId]);

  const handleSelectPerimeterFromMap = (perimId: string) => {
    setActiveTab('donnees');
    setOpenPerimId(perimId);
  };

  const togglePerimeter = (perimId: string) => {
    setOpenPerimId(openPerimId === perimId ? null : perimId);
    setSelectedProjet(null); // Reset detail projet
  };

  // Filtrer les prix chronologiques selon Année/Mois
  const getFilteredPrices = () => {
    if (!selectedPerimData || !selectedPerimData.prixChronologies) return [];
    return selectedPerimData.prixChronologies.filter((p: any) => 
      String(p.annee) === filterYear && String(p.mois) === filterMonth
    );
  };

  // Trouver prix le plus bas et élevé sur tout l'historique
  const getExtremePrices = () => {
    if (!selectedPerimData || !selectedPerimData.prixChronologies || selectedPerimData.prixChronologies.length === 0) {
      return { min: 0, max: 0 };
    }
    const pricesMin = selectedPerimData.prixChronologies.map((p: any) => p.prixMinimum);
    const pricesMax = selectedPerimData.prixChronologies.map((p: any) => p.prixMaximum);
    return {
      min: Math.min(...pricesMin),
      max: Math.max(...pricesMax)
    };
  };

  const extremePrices = getExtremePrices();
  const filteredPrices = getFilteredPrices();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement des détails de la province...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête / Titre Dynamique de la province */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Organisation de l'amont de la filière d'Argane (Province : {province?.name})
        </Text>
      </View>

      {/* Sous-barre de menu à 4 onglets */}
      <View style={styles.subNavbar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'carte' && styles.tabButtonActive]}
          onPress={() => setActiveTab('carte')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'carte' && styles.tabButtonTextActive]}>
            Carte de la Province
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'donnees' && styles.tabButtonActive]}
          onPress={() => setActiveTab('donnees')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'donnees' && styles.tabButtonTextActive]}>
            Données de l'arganerie
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'projets' && styles.tabButtonActive]}
          onPress={() => setActiveTab('projets')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'projets' && styles.tabButtonTextActive]}>
            Projet de construction des UCCA
          </Text>
        </TouchableOpacity>
        
        {/* Onglet 4 : Bouton Home de retour direct */}
        <TouchableOpacity
          style={styles.homeTabButton}
          onPress={() => router.replace('/')}
          title="Retour au menu principal"
        >
          <Home size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Zone d'affichage du contenu selon l'onglet actif */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          
          {/* 📑 Onglet 1 : Carte de la Province */}
          {activeTab === 'carte' && (
            <View style={styles.tabContent}>
              <ProvinceMap
                provinceName={province?.name || ''}
                perimeters={perimeters}
                onSelectPerimeter={handleSelectPerimeterFromMap}
              />
              <View style={styles.mapInfoCard}>
                <MapPin size={18} color={colors.accent} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapInfoTitle}>Interaction Carte</Text>
                  <Text style={styles.mapInfoText}>
                    La carte ci-dessus délimite les périmètres clés de la province. Au clic sur un périmètre ou sur le marqueur d'une coopérative, vous pouvez voir les informations clés et naviguer vers ses données détaillées.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 📑 Onglet 2 : Données de l'arganerie */}
          {activeTab === 'donnees' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Données d'Arganerie par Périmètre</Text>
              
              {/* Diagramme de Production Globale */}
              <ProductionChart data={perimeters} />

              <View style={styles.accordionContainer}>
                {perimeters.map((perim) => {
                  const isOpen = openPerimId === perim.id;
                  return (
                    <View key={perim.id} style={styles.accordionItem}>
                      <TouchableOpacity
                        style={[styles.accordionHeader, isOpen && styles.accordionHeaderOpen]}
                        onPress={() => togglePerimeter(perim.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.accordionTitleText, isOpen && styles.accordionTitleTextActive]}>
                          Périmètre : {perim.nom}
                        </Text>
                        <Text style={styles.accordionToggleSign}>{isOpen ? '−' : '+'}</Text>
                      </TouchableOpacity>

                      {isOpen && (
                        <View style={styles.accordionBody}>
                          {loadingPerimData ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                          ) : selectedPerimData ? (
                            <View style={styles.arganDataContainer}>
                              
                              {/* 1. Production Annuelle */}
                              <View style={styles.productionCard}>
                                <Package size={22} color={colors.primary} />
                                <View>
                                  <Text style={styles.dataLabel}>Production Annuelle Estimée</Text>
                                  <Text style={styles.productionValue}>
                                    {selectedPerimData.productionAnnuelle} tonnes d'arganes
                                  </Text>
                                </View>
                              </View>

                              {/* 2. Section Prix & Filtres */}
                              <View style={styles.priceSection}>
                                <Text style={styles.subSectionTitle}>Suivi des Prix de l'Huile (MAD/Litre)</Text>
                                
                                <View style={styles.filterRow}>
                                  <View style={styles.filterField}>
                                    <Text style={styles.filterLabel}>Année</Text>
                                    <select
                                      value={filterYear}
                                      onChange={(e) => setFilterYear(e.target.value)}
                                      style={styles.dropdownSelect}
                                    >
                                      <option value="2023">2023</option>
                                      <option value="2024">2024</option>
                                      <option value="2025">2025</option>
                                    </select>
                                  </View>

                                  <View style={styles.filterField}>
                                    <Text style={styles.filterLabel}>Mois</Text>
                                    <select
                                      value={filterMonth}
                                      onChange={(e) => setFilterMonth(e.target.value)}
                                      style={styles.dropdownSelect}
                                    >
                                      <option value="1">Janvier</option>
                                      <option value="2">Février</option>
                                      <option value="3">Mars</option>
                                      <option value="4">Avril</option>
                                      <option value="5">Mai</option>
                                      <option value="6">Juin</option>
                                      <option value="7">Juillet</option>
                                      <option value="8">Août</option>
                                      <option value="9">Septembre</option>
                                      <option value="10">Octobre</option>
                                      <option value="11">Novembre</option>
                                      <option value="12">Décembre</option>
                                    </select>
                                  </View>
                                </View>

                                {/* Indicateurs Visuels Prix Max/Min Globaux */}
                                <View style={styles.extremePricesRow}>
                                  <View style={[styles.extremePriceCard, { borderLeftColor: '#EF4444' }]}>
                                    <Text style={styles.extremePriceLabel}>Prix le plus bas constaté</Text>
                                    <Text style={[styles.extremePriceValue, { color: '#EF4444' }]}>
                                      {extremePrices.min > 0 ? `${extremePrices.min} MAD` : '--'}
                                    </Text>
                                  </View>
                                  <View style={[styles.extremePriceCard, { borderLeftColor: '#10B981' }]}>
                                    <Text style={styles.extremePriceLabel}>Prix le plus élevé constaté</Text>
                                    <Text style={[styles.extremePriceValue, { color: '#10B981' }]}>
                                      {extremePrices.max > 0 ? `${extremePrices.max} MAD` : '--'}
                                    </Text>
                                  </View>
                                </View>

                                {/* Prix pour le filtre sélectionné */}
                                <View style={styles.filteredPriceResult}>
                                  <Text style={styles.filteredPriceTitle}>
                                    Prix enregistré pour le filtre ({filterMonth}/{filterYear}) :
                                  </Text>
                                  {filteredPrices.length > 0 ? (
                                    filteredPrices.map((p: any, idx: number) => (
                                      <View key={p.id || idx} style={styles.priceDetailItem}>
                                        <Text style={styles.priceDetailText}>
                                          Fourchette : <Text style={{ fontWeight: '700' }}>{p.prixMinimum} - {p.prixMaximum} MAD / L</Text>
                                        </Text>
                                        <Text style={styles.priceDetailMarket}>
                                          <b>Marché de vente :</b> {p.marchePrincipal}
                                        </Text>
                                      </View>
                                    ))
                                  ) : (
                                    <Text style={styles.noDataText}>Aucun prix enregistré pour cette période.</Text>
                                  )}
                                </View>

                                {/* Diagramme d'évolution mensuelle des prix de l'huile */}
                                <PriceChart prices={selectedPerimData.prixChronologies} year={filterYear} />
                              </View>

                              {/* 3. Tableau des Négociants (Traders) */}
                              <View style={styles.tradersSection}>
                                <Text style={styles.subSectionTitle}>Tableau des Négociants (Courtiers)</Text>
                                {selectedPerimData.traders && selectedPerimData.traders.length > 0 ? (
                                  <div style={{ overflowX: 'auto', width: '100%' }}>
                                    <table style={styles.table}>
                                      <thead>
                                        <tr style={styles.tableHeaderRow}>
                                          <th style={styles.tableTh}>Nom</th>
                                          <th style={styles.tableTh}>Marchés fréquentés</th>
                                          <th style={styles.tableTh}>E-mail</th>
                                          <th style={styles.tableTh}>Téléphone</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedPerimData.traders.map((trader: any) => (
                                          <tr key={trader.id} style={styles.tableRow}>
                                            <td style={styles.tableTd}><b>{trader.nom}</b></td>
                                            <td style={styles.tableTd}>{trader.marchesCode}</td>
                                            <td style={styles.tableTd}>{trader.email}</td>
                                            <td style={styles.tableTd}>{trader.telephone}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <Text style={styles.noDataText}>Aucun courtier actif répertorié dans ce périmètre.</Text>
                                )}
                              </View>

                            </View>
                          ) : (
                            <Text style={styles.noDataText}>Erreur lors du chargement des données.</Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 📑 Onglet 3 : Projet de construction des UCCA */}
          {activeTab === 'projets' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Projets d'UCCA (Unités Centrales de Concassage)</Text>
              
              <View style={styles.accordionContainer}>
                {perimeters.map((perim) => {
                  const isOpen = openPerimId === perim.id;
                  return (
                    <View key={perim.id} style={styles.accordionItem}>
                      <TouchableOpacity
                        style={[styles.accordionHeader, isOpen && styles.accordionHeaderOpen]}
                        onPress={() => togglePerimeter(perim.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.accordionTitleText, isOpen && styles.accordionTitleTextActive]}>
                          Projets dans : {perim.nom}
                        </Text>
                        <Text style={styles.accordionToggleSign}>{isOpen ? '−' : '+'}</Text>
                      </TouchableOpacity>

                      {isOpen && (
                        <View style={styles.accordionBody}>
                          {loadingPerimData ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                          ) : selectedPerimProjets && selectedPerimProjets.length > 0 ? (
                            <View style={styles.projectsLayout}>
                              <View style={styles.projectsListSide}>
                                <Text style={styles.listSideTitle}>Liste des UCCA</Text>
                                {selectedPerimProjets.map((proj) => (
                                  <TouchableOpacity
                                    key={proj.id}
                                    style={[styles.projectListItem, selectedProjet?.id === proj.id && styles.projectListItemActive]}
                                    onPress={() => setSelectedProjet(proj)}
                                  >
                                    <Text style={[styles.projectListItemName, selectedProjet?.id === proj.id && styles.projectListItemNameActive]}>
                                      {proj.nomProjet}
                                    </Text>
                                    <Text style={styles.projectListItemDuration}>Durée : {proj.duree}</Text>
                                  </TouchableOpacity>
                                ))}
                              </View>

                              {/* Détails du projet UCCA sélectionné */}
                              <View style={styles.projectDetailSide}>
                                {selectedProjet ? (
                                  <View style={styles.projectDetailCard}>
                                    <Text style={styles.projectDetailTitle}>{selectedProjet.nomProjet}</Text>
                                    
                                    <View style={styles.detailRow}>
                                      <FileText size={16} color={colors.primary} style={{ marginTop: 2 }} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Description</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.description}</Text>
                                      </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                      <Calendar size={16} color={colors.primary} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Date d'identification</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.dateIdentification}</Text>
                                      </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                      <Package size={16} color={colors.primary} style={{ marginTop: 2 }} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Approvisionnement (Matières premières)</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.approvisionnement}</Text>
                                      </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                      <Award size={16} color={colors.primary} style={{ marginTop: 2 }} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Écoulement (Vente/Distribution)</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.ecoulement}</Text>
                                      </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                      <User size={16} color={colors.primary} style={{ marginTop: 2 }} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Coopératives encadrantes</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.cooperativesEncadrantes}</Text>
                                      </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                      <Calendar size={16} color={colors.primary} />
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.detailLabel}>Durée estimée</Text>
                                        <Text style={styles.detailValue}>{selectedProjet.duree}</Text>
                                      </View>
                                    </View>
                                  </View>
                                ) : (
                                  <View style={styles.noProjectSelected}>
                                    <Text style={styles.noProjectSelectedText}>
                                      Sélectionnez un projet à gauche pour afficher l'intégralité de ses détails.
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          ) : (
                            <Text style={styles.noDataText}>Aucun projet UCCA planifié dans ce périmètre.</Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF5',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#5A6B5A',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E4620',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  subNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D2DDD2',
    gap: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#8B5A2B',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  homeTabButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E4620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentWrapper: {
    maxWidth: 950,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tabContent: {
    gap: 20,
  },
  mapInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2DDD2',
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },
  mapInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E4620',
    marginBottom: 4,
  },
  mapInfoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5A6B5A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C281C',
    marginBottom: 4,
  },
  accordionContainer: {
    gap: 12,
  },
  accordionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
  },
  accordionHeaderOpen: {
    backgroundColor: '#FAFAF5',
    borderBottomWidth: 1,
    borderBottomColor: '#D2DDD2',
  },
  accordionTitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E4620',
  },
  accordionTitleTextActive: {
    fontWeight: '700',
  },
  accordionToggleSign: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  accordionBody: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  noDataText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  arganDataContainer: {
    gap: 20,
  },
  productionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFE8',
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A6B5A',
    textTransform: 'uppercase',
  },
  productionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E4620',
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C281C',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterField: {
    flex: 1,
    gap: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A6B5A',
  },
  dropdownSelect: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    backgroundColor: '#FAFAF5',
    fontSize: 13,
    fontFamily: 'sans-serif',
    color: '#1C281C',
  },
  extremePricesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  extremePriceCard: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    borderLeftWidth: 4,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  extremePriceLabel: {
    fontSize: 11,
    color: '#5A6B5A',
  },
  extremePriceValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  filteredPriceResult: {
    backgroundColor: '#FAFAF5',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    marginTop: 6,
  },
  filteredPriceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A6B5A',
    marginBottom: 6,
  },
  priceDetailItem: {
    gap: 2,
  },
  priceDetailText: {
    fontSize: 14,
    color: '#1C281C',
  },
  priceDetailMarket: {
    fontSize: 12,
    color: '#5A6B5A',
    marginTop: 2,
  },
  tradersSection: {
    gap: 10,
  },
  table: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D2DDD2',
  },
  tableHeaderRow: {
    backgroundColor: '#1E4620',
  },
  tableTh: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    textAlign: 'left',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableTd: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#1C281C',
  },
  projectsLayout: {
    flexDirection: 'row',
    gap: 16,
    ...Platform.select({
      web: {
        display: 'flex',
      },
    }),
  },
  projectsListSide: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingRight: 12,
    gap: 8,
  },
  listSideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A6B5A',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  projectListItem: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#FAFAF5',
    borderWidth: 1,
    borderColor: '#D2DDD2',
  },
  projectListItemActive: {
    backgroundColor: '#E8EFE8',
    borderColor: '#1E4620',
  },
  projectListItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E4620',
  },
  projectListItemNameActive: {
    fontWeight: '700',
  },
  projectListItemDuration: {
    fontSize: 11,
    color: '#5A6B5A',
    marginTop: 2,
  },
  projectDetailSide: {
    width: '65%',
    paddingLeft: 4,
  },
  projectDetailCard: {
    backgroundColor: '#FAFAF5',
    borderWidth: 1,
    borderColor: '#D2DDD2',
    borderRadius: 8,
    padding: 16,
    gap: 14,
  },
  projectDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E4620',
    borderBottomWidth: 1,
    borderBottomColor: '#D2DDD2',
    paddingBottom: 6,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5A2B',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1C281C',
    marginTop: 2,
  },
  noProjectSelected: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#FAFAF5',
  },
  noProjectSelectedText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
