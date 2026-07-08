import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Package,
  TrendingUp,
  Globe,
  Briefcase,
  Phone,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

import EconomicCard from '@/components/EconomicCard';
import { MiniBarChart, MiniLineChart, MiniPieChart } from '@/components/MiniCharts';
import { MOCK_ECONOMIC_DATA } from '@/constants/MockData';
import { Colors, MaxContentWidth } from '@/constants/theme';

export default function AffiyachScreen() {
  const { theme } = useTheme();
  const colors = Colors; // using flat palette; fallback if needed

  const handleContactTrader = (traderName: string, phone: string) => {
    const contactMessage = `Négociant : ${traderName}\nTéléphone : ${phone}\nStatut : Certifié Conforme`;
    if (Platform.OS === 'web') {
      window.alert(contactMessage);
    } else {
      Alert.alert("Contacter le Négociant", contactMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Scroll View principal centré */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Titre principal */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Marché d'Affiyach</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Données économiques & Négociations - Filière Argane
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* 1. Carte Production */}
          <EconomicCard
            title={MOCK_ECONOMIC_DATA.production.title}
            value={MOCK_ECONOMIC_DATA.production.value}
            icon={<Package size={20} color={colors.primary} />}
          >
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              {MOCK_ECONOMIC_DATA.production.description}
            </Text>
            <MiniBarChart data={MOCK_ECONOMIC_DATA.production.history} />
          </EconomicCard>

          {/* 2. Carte Prix */}
          <EconomicCard
            title={MOCK_ECONOMIC_DATA.price.title}
            value={MOCK_ECONOMIC_DATA.price.value}
            trend={MOCK_ECONOMIC_DATA.price.trend}
            trendDirection={MOCK_ECONOMIC_DATA.price.trendDirection}
            icon={<TrendingUp size={20} color={colors.secondary} />}
          >
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Prix moyen constaté au litre d'huile d'argan pressée à froid.
            </Text>
            <MiniLineChart data={MOCK_ECONOMIC_DATA.price.history} />
          </EconomicCard>

          {/* 3. Carte Marché */}
          <EconomicCard
            title={MOCK_ECONOMIC_DATA.market.title}
            value={MOCK_ECONOMIC_DATA.market.value}
            icon={<Globe size={20} color={colors.accent} />}
          >
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Répartition des ventes (marché domestique vs exportations internationales).
            </Text>
            <MiniPieChart shares={MOCK_ECONOMIC_DATA.market.shares} />
          </EconomicCard>

          {/* 4. Carte Les Traders (Négociants) */}
          <EconomicCard
            title="Les Traders"
            value={`${MOCK_ECONOMIC_DATA.traders.length} Certifiés`}
            icon={<Briefcase size={20} color={colors.text} />}
          >
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Négociants agréés pour l'exportation et le commerce équitable de l'argane.
            </Text>
            
            <View style={styles.tradersList}>
              {MOCK_ECONOMIC_DATA.traders.map((trader) => (
                <View
                  key={trader.id}
                  style={[
                    styles.traderRow,
                    {
                      backgroundColor: colors.backgroundElement,
                      borderColor: colors?.border ?? '#D2DDD2',
                    },
                  ]}
                >
                  <View style={styles.traderMeta}>
                    <View style={styles.traderTitleRow}>
                      <Text style={[styles.traderName, { color: colors.text }]}>
                        {trader.name}
                      </Text>
                      {trader.certified && (
                        <CheckCircle2 size={14} color={colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.traderLoc, { color: colors.textSecondary }]}>
                      {trader.location}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.contactButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleContactTrader(trader.name, trader.phone)}
                    activeOpacity={0.8}
                  >
                    <Phone size={12} color="#FFFFFF" />
                    <Text style={styles.contactButtonText}>Contacter</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </EconomicCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginBottom: 20,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    fontWeight: '400',
  },
  tradersList: {
    marginTop: 12,
    gap: 10,
  },
  traderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  traderMeta: {
    flex: 1,
  },
  traderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  traderName: {
    fontSize: 14,
    fontWeight: '700',
  },
  traderLoc: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
