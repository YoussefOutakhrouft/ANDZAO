import React from 'react';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabListProps,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map, BarChart3, Briefcase, Trees } from 'lucide-react-native';

import { Colors, Spacing } from '@/constants/theme';

type TabName = 'index' | 'affiyach' | 'projects';

const TAB_ICONS = {
  index: Map,
  affiyach: Briefcase,
  projects: BarChart3,
} as const;

interface TopTabButtonProps extends React.PropsWithChildren, TabTriggerSlotProps {
  tabName: TabName;
}

const TopTabButton = React.forwardRef<View, TopTabButtonProps>(
  ({ children, isFocused, tabName, ...props }, ref) => {
    const Icon = TAB_ICONS[tabName];

    return (
      <Pressable
        ref={ref}
        {...props}
        style={({ pressed }) => [
          styles.tabButton,
          {
            backgroundColor: isFocused ? Colors.primary + '20' : 'transparent',
            borderColor: isFocused ? Colors.primary : 'transparent',
          },
          pressed && styles.pressed,
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
      >
        <Icon size={15} color={isFocused ? Colors.primary : Colors.textSecondary} />
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? Colors.primary : Colors.textSecondary },
            isFocused && styles.tabLabelActive,
          ]}
        >
          {children}
        </Text>
      </Pressable>
    );
  },
);
TopTabButton.displayName = 'TopTabButton';

function TopTabList(props: TabListProps) {
  return (
    <SafeAreaView
      {...props}
      edges={['top']}
      style={[
        styles.headerSafeArea,
        {
          backgroundColor: Colors.cardBackground,
          borderBottomColor: Colors.border,
        },
        Platform.OS === 'web' && styles.headerSticky,
        props.style,
      ]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: Colors.primary + '18' }]}>
            <Trees size={18} color={Colors.primary} />
          </View>
          <Text style={[styles.brandText, { color: Colors.text }]}>Argane</Text>
        </View>

        <View style={styles.tabsRow}>{props.children}</View>
      </View>
    </SafeAreaView>
  );
}

export default function AppTabs() {
  return (
    <Tabs style={[styles.tabsRoot, { backgroundColor: Colors.background }]}>
      <TabList asChild>
        <TopTabList>
          <TabTrigger name="index" href="/" asChild>
            <TopTabButton tabName="index">Carte</TopTabButton>
          </TabTrigger>
          <TabTrigger name="affiyach" href="/affiyach" asChild>
            <TopTabButton tabName="affiyach">Affiyach</TopTabButton>
          </TabTrigger>
          <TabTrigger name="projects" href="/projects" asChild>
            <TopTabButton tabName="projects">Projets</TopTabButton>
          </TabTrigger>
        </TopTabList>
      </TabList>
      <TabSlot style={styles.tabSlot} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabsRoot: {
    flex: 1,
  },
  tabSlot: {
    flex: 1,
  },
  headerSafeArea: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSticky: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContainer: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
