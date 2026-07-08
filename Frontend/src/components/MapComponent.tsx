import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Polygon, Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Layers, Users } from 'lucide-react-native';
import { MAP_CENTER, ARGAN_FOREST_POLYGON, ASSOCIATION_MARKER_COORD } from '@/constants/MockData';
import { Colors } from '@/constants/theme';

interface MapComponentProps {
  onForestSelect: () => void;
  onAssociationSelect: () => void;
}

export default function MapComponent({
  onForestSelect,
  onAssociationSelect,
}: MapComponentProps) {
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const colors = Colors;

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={MAP_CENTER}
        mapType={mapType}
      >
        {/* Polygone de la forêt d'arganiers */}
        <Polygon
          coordinates={ARGAN_FOREST_POLYGON}
          fillColor="rgba(46, 125, 50, 0.4)" // Vert argan translucide
          strokeColor="rgb(27, 94, 32)"     // Vert sapin opaque
          strokeWidth={3}
          tappable={true}
          onPress={onForestSelect}
        />

        {/* Marqueur de l'association au centre */}
        <Marker coordinate={ASSOCIATION_MARKER_COORD}>
          <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
            <Users size={18} color="#FFFFFF" />
          </View>
          
          <Callout tooltip onPress={onAssociationSelect}>
            <View style={[styles.calloutContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.calloutTitle, { color: colors.text }]}>
                Coopérative Féminine Tighanimine
              </Text>
              <Text style={[styles.calloutSubtitle, { color: colors.textSecondary }]}>
                Association d'Arganeraie
              </Text>
              <TouchableOpacity style={[styles.calloutButton, { backgroundColor: colors.secondary }]}>
                <Text style={styles.calloutButtonText}>Voir détails</Text>
              </TouchableOpacity>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* Bouton de sélection du type de carte */}
      <TouchableOpacity
        style={[
          styles.layerButton,
          { backgroundColor: colors.cardBackground, shadowColor: colors.text },
        ]}
        onPress={toggleMapType}
        activeOpacity={0.8}
      >
        <Layers size={20} color={colors.primary} />
        <Text style={[styles.layerButtonText, { color: colors.text }]}>
          {mapType === 'standard' ? 'Satellite' : 'Carte'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  layerButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 6,
  },
  layerButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calloutContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  calloutSubtitle: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  calloutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  calloutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});
