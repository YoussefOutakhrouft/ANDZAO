import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Layers } from 'lucide-react-native';
import { MAP_CENTER, ARGAN_FOREST_POLYGON, ASSOCIATION_MARKER_COORD } from '@/constants/MockData';
import { Colors } from '@/constants/theme';

interface MapComponentProps {
  onForestSelect: () => void;
  onAssociationSelect: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapComponent({
  onForestSelect,
  onAssociationSelect,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<{ standard: any; satellite: any }>({ standard: null, satellite: null });
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const colors = Colors;

  // Injecter Leaflet CSS et JS
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Charger CSS
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Charger JS
    const scriptId = 'leaflet-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      // Si le script existe déjà mais L n'est pas encore prêt, on vérifie périodiquement
      const interval = setInterval(() => {
        if (window.L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialiser la carte Leaflet
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;

    // Initialisation de la carte centrée sur le Maroc Souss-Massa
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([MAP_CENTER.latitude, MAP_CENTER.longitude], 13);

    mapRef.current = map;

    // Ajouter le contrôle de zoom en bas à gauche
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Définir les couches de tuiles (Standard & Satellite)
    const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    });

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    layersRef.current = {
      standard: standardLayer,
      satellite: satelliteLayer,
    };

    // Par défaut, activer le fond de carte standard
    standardLayer.addTo(map);

    // Dessiner le polygone de la forêt d'arganiers
    const polygonCoords = ARGAN_FOREST_POLYGON.map((coord) => [coord.latitude, coord.longitude]);
    const polygon = L.polygon(polygonCoords, {
      fillColor: 'rgba(46, 125, 50, 0.4)', // Vert argan translucide
      color: 'rgb(27, 94, 32)',           // Vert sapin opaque
      weight: 3,
      fillOpacity: 0.4,
    }).addTo(map);

    polygon.on('click', (e: any) => {
      L.DomEvent.stopPropagation(e);
      onForestSelect();
    });

    // Créer une icône de marqueur personnalisée (Style de groupe d'utilisateurs "users")
    const customIcon = L.divIcon({
      html: `
        <div style="
          background-color: ${colors.primary};
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2.5px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          color: #FFFFFF;
          cursor: pointer;
          transform: translate(-3px, -3px);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      `,
      className: 'custom-argan-marker',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    // Ajouter le marqueur au centre géométrique (Centroïde)
    const marker = L.marker([ASSOCIATION_MARKER_COORD.latitude, ASSOCIATION_MARKER_COORD.longitude], {
      icon: customIcon,
    }).addTo(map);

    // Configurer le Callout (Bulle d'info popup)
    marker.bindPopup(
      `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        padding: 4px;
        text-align: center;
      ">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: ${colors.text};">Coopérative Féminine Tighanimine</h4>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: ${colors.textSecondary};">Association d'Arganeraie</p>
        <button id="leaflet-callout-btn" style="
          background-color: ${colors.secondary};
          color: #FFFFFF;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          transition: background-color 0.2s;
        ">
          Voir détails
        </button>
      </div>
    `,
      {
        closeButton: false,
        minWidth: 200,
        className: 'custom-leaflet-popup',
      }
    );

    // Gérer l'action de clic sur le bouton de la bulle d'info
    map.on('popupopen', () => {
      const btn = document.getElementById('leaflet-callout-btn');
      if (btn) {
        btn.onclick = (e) => {
          e.stopPropagation();
          onAssociationSelect();
          map.closePopup();
        };
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Gérer le changement de type de carte (Satellite/Standard)
  useEffect(() => {
    if (!mapRef.current || !layersRef.current.standard || !layersRef.current.satellite) return;

    const map = mapRef.current;
    if (mapType === 'satellite') {
      map.removeLayer(layersRef.current.standard);
      layersRef.current.satellite.addTo(map);
    } else {
      map.removeLayer(layersRef.current.satellite);
      layersRef.current.standard.addTo(map);
    }
  }, [mapType]);

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  return (
    <View style={styles.container}>
      {/* Conteneur DOM pour Leaflet */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {!leafletLoaded && (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement de la carte arganier...
          </Text>
        </View>
      )}

      {/* Bouton de sélection du type de carte */}
      {leafletLoaded && (
        <TouchableOpacity
          style={[
            styles.layerButton,
            { backgroundColor: colors.cardBackground, shadowColor: colors.text },
          ]}
          onPress={toggleMapType}
          activeOpacity={0.8}
        >
          <Layers size={18} color={colors.primary} />
          <Text style={[styles.layerButtonText, { color: colors.text }]}>
            {mapType === 'standard' ? 'Satellite' : 'Carte'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
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
    zIndex: 1000, // Important pour le Web par-dessus Leaflet
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    gap: 6,
  },
  layerButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
