import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/theme';

// ==========================================
// 1. MiniBarChart (Production Annuelle)
// ==========================================
interface BarChartProps {
  data: { year: string; amount: number }[];
}

export function MiniBarChart({ data }: BarChartProps) {
  const colors = Colors;

  const svgHeight = 130;
  const svgWidth = 280;
  const paddingBottom = 24;
  const paddingTop = 20;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  
  const amounts = data.map((d) => d.amount);
  const maxAmount = Math.max(...amounts) * 1.1; // 10% de marge en haut

  const barWidth = 32;
  const totalBarSpace = svgWidth / data.length;

  return (
    <View style={styles.chartWrapper}>
      <Svg height={svgHeight} width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <Defs>
          <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity={0.4} />
          </LinearGradient>
        </Defs>

        {data.map((item, index) => {
          const x = index * totalBarSpace + (totalBarSpace - barWidth) / 2;
          const barHeight = (item.amount / maxAmount) * chartHeight;
          const y = svgHeight - paddingBottom - barHeight;

          return (
            <React.Fragment key={index}>
              {/* Le rectangle de la barre */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill="url(#barGrad)"
              />
              
              {/* Valeur numérique au-dessus de la barre */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fill={colors.text}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                {item.amount}
              </SvgText>

              {/* Libellé de l'année en dessous */}
              <SvgText
                x={x + barWidth / 2}
                y={svgHeight - 6}
                fill={colors.textSecondary}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.year}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

// ==========================================
// 2. MiniLineChart (Prix Moyen de l'Huile)
// ==========================================
interface LineChartProps {
  data: number[];
}

export function MiniLineChart({ data }: LineChartProps) {
  const colors = Colors;

  const svgHeight = 70;
  const svgWidth = 280;
  const chartHeight = svgHeight - 10;
  
  const minVal = Math.min(...data) * 0.95; // 5% marge basse
  const maxVal = Math.max(...data) * 1.05; // 5% marge haute
  const range = maxVal - minVal;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * svgWidth;
    const y = svgHeight - 5 - ((val - minVal) / range) * chartHeight;
    return { x, y };
  });

  // Construire le chemin SVG pour la ligne
  const linePath = points.reduce(
    (path, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`),
    ''
  );

  // Construire le chemin fermé pour le remplissage du gradient en dessous
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <View style={styles.chartWrapper}>
      <Svg height={svgHeight} width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.secondary} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={colors.secondary} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>

        {/* Gradient sous la ligne */}
        <Path d={areaPath} fill="url(#lineGrad)" />

        {/* Ligne principale du graphe */}
        <Path
          d={linePath}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cercle sur le dernier point (valeur actuelle) */}
        {points.length > 0 && (
          <Circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={5}
            fill={colors.secondary}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        )}
      </Svg>
    </View>
  );
}

// ==========================================
// 3. MiniPieChart (Parts de Marché / Donut)
// ==========================================
interface PieChartProps {
  shares: { label: string; percentage: number; color: string }[];
}

export function MiniPieChart({ shares }: PieChartProps) {
  const colors = Colors;

  const size = 90;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <View style={styles.pieContainer}>
      {/* Cercle Donut SVG */}
      <View style={styles.pieSvgContainer}>
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Cercle d'arrière-plan discret */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.backgroundElement}
            strokeWidth={strokeWidth}
          />

          {shares.map((segment, index) => {
            const strokeDashoffset = circumference - (segment.percentage / 100) * circumference;
            const rotation = (accumulatedPercentage * 3.6) - 90; // Convertit pourcentage en degrés, tourne de -90deg (haut)
            accumulatedPercentage += segment.percentage;

            return (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        {/* Texte central (Somme) */}
        <View style={styles.pieCenterText}>
          <Text style={[styles.centerTextValue, { color: colors.text }]}>100%</Text>
        </View>
      </View>

      {/* Légende colorée */}
      <View style={styles.legendContainer}>
        {shares.map((item, index) => (
          <View key={index} style={styles.legendRow}>
            <View style={[styles.legendIndicator, { backgroundColor: item.color }]} />
            <Text style={[styles.legendLabel, { color: colors.text }]} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={[styles.legendValue, { color: colors.textSecondary }]}>
              {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginVertical: 8,
    width: '100%',
  },
  pieSvgContainer: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  pieCenterText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  legendContainer: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
