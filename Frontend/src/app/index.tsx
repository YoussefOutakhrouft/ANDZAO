import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Trees, Plus, Minus, Sprout } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import api from '../api/api';

const MOCK_PROVINCES = [
  { id: '1', name: 'Essaouira', description: 'Province côtière réputée pour ses forêts d\'arganiers denses et sa contribution historique au commerce de l\'huile d\'argane.' },
  { id: '2', name: 'Agadir Idaoutanan', description: 'Province caractérisée par une forte concentration de coopératives de transformation et d\'exportation d\'huile d\'argane.' },
  { id: '3', name: 'Taroudant', description: 'La plus vaste province agricole possédant les plus grandes plaines d\'arganiers de la région Souss-Massa.' },
  { id: '4', name: 'Chtouka Ait Baha', description: 'Zone de montagne et de plaine au savoir-faire ancestral dans l\'exploitation et la préservation de l\'arganier.' },
  { id: '5', name: 'Tiznit', description: 'Province historique abritant des zones emblématiques comme Anzi, Tafraout et Tiznit Centre.' },
  { id: '6', name: 'Sidi Ifni', description: 'Province côtière aride propice au développement d\'arganiers sauvages extrêmement robustes.' },
  { id: '7', name: 'Guelmim', description: 'Porte du Sahara, représentant la limite méridionale de l\'arganeraie marocaine avec des enjeux d\'adaptation climatique.' }
];

export default function AppIndex() {
  const [activeTab, setActiveTab] = useState<'amont' | 'agriculture'>('amont');
  const [provinces, setProvinces] = useState<any[]>(MOCK_PROVINCES);
  const [openProvinceId, setOpenProvinceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les provinces depuis le backend
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await api.getProvinces();
        if (data && data.length > 0) {
          // Mapper les données du backend
          const mapped = data.map((p: any) => ({
            id: String(p.id),
            name: p.nom,
            description: p.description
          }));
          setProvinces(mapped);
        }
      } catch (error) {
        console.warn("Impossible de charger les provinces depuis le backend, utilisation des données locales.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const toggleProvince = (id: string) => {
    setOpenProvinceId(openProvinceId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Barre de Menu Principale (Navbar Générale) */}
      <View style={styles.navbar}>
        <View style={styles.brandRow}>
          <Trees size={22} color={Colors.primary} />
          <Text style={styles.brandText}>PROJET ANDZOA</Text>
        </View>
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navButton, activeTab === 'amont' && styles.navButtonActive]}
            onPress={() => setActiveTab('amont')}
          >
            <Text style={[styles.navButtonText, activeTab === 'amont' && styles.navButtonTextActive]}>
              Organisation de l'amont de la filière d'Argan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, activeTab === 'agriculture' && styles.navButtonActive]}
            onPress={() => setActiveTab('agriculture')}
          >
            <Text style={[styles.navButtonText, activeTab === 'agriculture' && styles.navButtonTextActive]}>
              Agriculture
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'amont' ? (
          <View style={styles.pageContent}>
            {/* Section 1 : Description générale de la filière */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>Organisation de l'amont de la filière d'Argan</Text>
              <View style={styles.heroCard}>
                <Text style={styles.heroText}>
                  La filière de l'Arganier (Argania spinosa) constitue un pilier socio-économique et écologique majeur au Maroc, principalement dans la réserve de biosphère de l'arganeraie (UNESCO). L'organisation de l'amont de la filière se concentre sur la préservation de la ressource forestière, la réglementation des droits de cueillette, le développement des coopératives locales de collecte et de concassage, et la valorisation équitable du travail des femmes rurales. Cette plateforme fournit les indicateurs de production, les cours des prix ainsi que le suivi des projets d'Unités Centrales de Concassage d'Argan (UCCA) à travers les 7 provinces de l'aire de répartition de l'arganier.
                </Text>
              </View>
            </View>

            {/* Section 2 : Déclinaison Territoriale (Les 7 Provinces) */}
            <View style={styles.provinceSection}>
              <Text style={styles.sectionTitle}>Déclinaison Territoriale – Les 7 Provinces</Text>
              
              <View style={styles.accordionContainer}>
                {provinces.map((province) => {
                  const isOpen = openProvinceId === province.id;
                  return (
                    <View key={province.id} style={styles.accordionItem}>
                      <TouchableOpacity
                        style={[styles.accordionHeader, isOpen && styles.accordionHeaderOpen]}
                        onPress={() => toggleProvince(province.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.provinceName, isOpen && styles.provinceNameActive]}>
                          {province.name}
                        </Text>
                        <View style={[styles.iconContainer, isOpen && styles.iconContainerOpen]}>
                          {isOpen ? (
                            <Minus size={18} color="#FFFFFF" />
                          ) : (
                            <Plus size={18} color={Colors.primary} />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      {isOpen && (
                        <View style={styles.accordionBody}>
                          <Text style={styles.provinceDesc}>{province.description}</Text>
                          <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => router.push({ pathname: '/province/[id]', params: { id: province.id } })}
                          >
                            <Text style={styles.detailsButtonText}>Accéder aux détails de la Province</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : (
          /* Page Agriculture (Template) */
          <View style={styles.templatePage}>
            <Sprout size={64} color={Colors.primary} style={styles.templateIcon} />
            <Text style={styles.templateTitle}>Module Agriculture</Text>
            <Text style={styles.templateSubtitle}>En cours de développement</Text>
            <View style={styles.templateCard}>
              <Text style={styles.templateText}>
                Cette section contiendra les outils d'analyse et de suivi des pratiques agricoles liées à la domestication de l'arganier, notamment les projets de vergers d'arganiers modernes, les techniques d'irrigation économe en eau, le suivi agronomique des parcelles de culture et le soutien technique aux agriculteurs de la région.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D2DDD2',
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      },
    }),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E4620',
    letterSpacing: 0.5,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  navButtonActive: {
    backgroundColor: '#1E4620',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A6B5A',
  },
  navButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageContent: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  heroSection: {
    gap: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C281C',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D2DDD2',
  },
  heroText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#5A6B5A',
    textAlign: 'justify',
  },
  provinceSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C281C',
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  accordionHeaderOpen: {
    backgroundColor: '#FAFAF5',
    borderBottomWidth: 1,
    borderBottomColor: '#D2DDD2',
  },
  provinceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E4620',
  },
  provinceNameActive: {
    fontWeight: '700',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EFE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerOpen: {
    backgroundColor: '#1E4620',
  },
  accordionBody: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  provinceDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6B5A',
  },
  detailsButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5A2B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  templatePage: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    textAlign: 'center',
  },
  templateIcon: {
    marginBottom: 20,
  },
  templateTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E4620',
    marginBottom: 6,
  },
  templateSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5A2B',
    marginBottom: 24,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  },
  templateText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6B5A',
    textAlign: 'center',
  },
});
