/**
 * App color palette (light theme only).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  text: '#1C281C',
  background: '#F8FAF6',
  backgroundElement: '#E8EFE8',
  backgroundSelected: '#D0DFD0',
  textSecondary: '#5A6B5A',
  primary: '#2E7D32', // Vert Argan
  secondary: '#C5A029', // Or/Huile
  accent: '#8B5A2B', // Marron Terreux
  border: '#D2DDD2',
  cardBackground: '#FFFFFF',
  success: '#2E7D32',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
