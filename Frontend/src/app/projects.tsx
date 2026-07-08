import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

// Project data type definition
type Project = {
  id: string;
  name: string;
  date: string;
  perimeter: string;
  cooperative: string;
  description: string;
};

// Example projects data
const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Projet Arganier A',
    date: '2023-05-12',
    perimeter: '20 ha',
    cooperative: 'Coopérative du Sud',
    description: "Développement durable d’une zone d’arganiers avec intégration de systèmes d’irrigation et formation des agriculteurs.",
  },
  {
    id: '2',
    name: 'Projet Arganier B',
    date: '2024-01-20',
    perimeter: '35 ha',
    cooperative: 'Coopérative du Nord',
    description: "Programme d’expansion de la culture d’arganier incluant la mise en place d’une coopération locale pour la commercialisation.",
  },
  {
    id: '3',
    name: 'Projet Arganier C',
    date: '2025-03-08',
    perimeter: '12 ha',
    cooperative: 'Coopérative du Centre',
    description: "Initiative communautaire visant à revitaliser les arganiers traditionnels avec un suivi biologique.",
  },
];

export default function ProjectsScreen() {
  const themeColors = Colors;
  const [selected, setSelected] = useState<Project | null>(null);

  // Styles generated inside component so themeColors is in scope
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    pageHeader: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: themeColors.border,
    },
    pageTitle: { fontSize: 22, fontWeight: '800', color: themeColors.text, letterSpacing: -0.5 },
    pageSubtitle: { fontSize: 13, color: themeColors.textSecondary, marginTop: 2, fontWeight: '500' },
    listContent: { padding: 16, paddingBottom: 24 },
    item: {
      padding: 12,
      marginBottom: 12,
      backgroundColor: themeColors.cardBackground,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: { fontSize: 16, fontWeight: '600', color: themeColors.text },
    subtitle: { fontSize: 12, color: themeColors.textSecondary, marginTop: 4 },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      backgroundColor: themeColors.cardBackground,
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: themeColors.text, marginBottom: 8 },
    modalText: { fontSize: 14, color: themeColors.textSecondary, marginBottom: 4 },
    modalDescription: { fontSize: 14, color: themeColors.text, marginTop: 12, lineHeight: 20 },
    closeBtn: {
      marginTop: 16,
      alignSelf: 'flex-end',
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: themeColors.primary,
      borderRadius: 6,
    },
    closeBtnText: { color: '#fff', fontWeight: '600' },
  });

  const renderItem = ({ item }: { item: Project }) => (
    <Pressable onPress={() => setSelected(item)} style={styles.item} accessibilityLabel={`Projet ${item.name}`}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>Date: {item.date}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Projets</Text>
        <Text style={styles.pageSubtitle}>Initiatives arganiers en cours</Text>
      </View>
      <FlatList
        data={PROJECTS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      {selected && (
        <Modal visible animationType="slide" transparent onRequestClose={() => setSelected(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selected.name}</Text>
              <Text style={styles.modalText}>Date: {selected.date}</Text>
              <Text style={styles.modalText}>Périmètre: {selected.perimeter}</Text>
              <Text style={styles.modalText}>Coopérative: {selected.cooperative}</Text>
              <Text style={styles.modalDescription}>{selected.description}</Text>
              <Pressable onPress={() => setSelected(null)} style={styles.closeBtn} accessibilityLabel="Fermer le détail du projet">
                <Text style={styles.closeBtnText}>Fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
