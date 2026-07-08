import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';

interface EconomicCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export default function EconomicCard({
  title,
  value,
  trend,
  trendDirection,
  icon,
  children,
}: EconomicCardProps) {
  const colors = Colors;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          shadowColor: colors.text,
        },
      ]}
    >
      {/* En-tête de la Carte */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{title}</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{value}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundElement }]}>
          {icon}
        </View>
      </View>

      {/* Contenu personnalisé (Graphiques, Listes, etc.) */}
      {children && <View style={styles.cardContent}>{children}</View>}

      {/* Pied de carte avec badge de tendance */}
      {trend && (
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor:
                  trendDirection === 'up'
                    ? colors.success + '20'
                    : trendDirection === 'down'
                    ? '#D32F2F20'
                    : colors.backgroundElement,
              },
            ]}
          >
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    trendDirection === 'up'
                      ? colors.success
                      : trendDirection === 'down'
                      ? '#D32F2F'
                      : colors.textSecondary,
                },
              ]}
            >
              {trendDirection === 'up' ? '▲' : trendDirection === 'down' ? '▼' : '●'} {trend}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    marginTop: 14,
    width: '100%',
  },
  cardFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
