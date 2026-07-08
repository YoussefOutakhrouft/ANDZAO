import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

interface ProvinceMapProps {
  provinceName: string;
  perimeters: any[];
  onSelectPerimeter: (perimId: string) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function ProvinceMap({ provinceName, perimeters, onSelectPerimeter }: ProvinceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const colors = Colors;

  // Center coordinate mapping for each province
  const getProvinceCenter = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('tiznit')) return { lat: 29.6975, lng: -9.3752, zoom: 9 };
    if (norm.includes('essaouira')) return { lat: 31.5125, lng: -9.77, zoom: 10 };
    if (norm.includes('agadir')) return { lat: 30.4278, lng: -9.5981, zoom: 10 };
    if (norm.includes('taroudant')) return { lat: 30.4703, lng: -8.877, zoom: 9 };
    if (norm.includes('chtouka')) return { lat: 30.0716, lng: -9.1498, zoom: 10 };
    if (norm.includes('sidi ifni')) return { lat: 29.3797, lng: -10.173, zoom: 10 };
    if (norm.includes('guelmim')) return { lat: 28.9864, lng: -10.0574, zoom: 10 };
    return { lat: 30.0, lng: -9.5, zoom: 8 }; // Fallback
  };

  // Inject Leaflet CSS & JS
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const scriptId = 'leaflet-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize and Render Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;
    const center = getProvinceCenter(provinceName);

    // If map already exists, remove it first to rebuild on province change
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
    }).setView([center.lat, center.lng], center.zoom);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const isTiznit = provinceName.toLowerCase().includes('tiznit');

    // 1. Draw boundary contour
    if (isTiznit) {
      // Red boundary contour for Tiznit
      const tiznitContour = [
        [29.90, -9.90],
        [29.98, -9.60],
        [29.80, -9.15],
        [29.85, -8.70],
        [29.45, -8.80],
        [29.30, -9.25],
        [29.35, -9.75],
        [29.50, -9.85],
      ];
      L.polygon(tiznitContour, {
        color: '#DC2626', // Red
        weight: 3,
        fillColor: 'transparent',
        fillOpacity: 0
      }).addTo(map).bindTooltip("Contour Global - Province de Tiznit", { permanent: false, direction: "top" });
    } else {
      // General mock contour in green for other provinces
      const lat = center.lat;
      const lng = center.lng;
      const genericContour = [
        [lat + 0.25, lng - 0.25],
        [lat + 0.25, lng + 0.25],
        [lat - 0.25, lng + 0.25],
        [lat - 0.25, lng - 0.25]
      ];
      L.polygon(genericContour, {
        color: '#059669', // Emerald
        weight: 2,
        dashArray: '5, 5',
        fillColor: 'transparent',
      }).addTo(map);
    }

    // 2. Draw perimeters as precise polygons with distinct colors
    const tiznitPerimData = [
      {
        name: "Tiznit (Centre)",
        polygon: [
          [29.74, -9.82],
          [29.76, -9.62],
          [29.65, -9.58],
          [29.60, -9.70],
          [29.64, -9.84]
        ],
        color: "#10B981", // Green
        desc: "Périmètre central englobant les plaines littorales. Principal centre de conditionnement et d'exportation de la province de Tiznit."
      },
      {
        name: "Anzi",
        polygon: [
          [29.68, -9.58],
          [29.71, -9.35],
          [29.58, -9.30],
          [29.54, -9.42],
          [29.60, -9.58]
        ],
        color: "#78350F", // Brown
        desc: "Zone de piémont de l'Anti-Atlas caractérisée par une forte densité d'arganiers sauvages et une tradition séculaire de récolte collective."
      },
      {
        name: "Tafraout",
        polygon: [
          [29.78, -9.15],
          [29.83, -8.90],
          [29.65, -8.84],
          [29.60, -9.00],
          [29.66, -9.18]
        ],
        color: "#F59E0B", // Orange/Amber
        desc: "Périmètre d'altitude abritant des arganiers résistants au froid de montagne. Production à forte valeur ajoutée gustative et cosmétique."
      }
    ];

    if (isTiznit) {
      tiznitPerimData.forEach((pData, index) => {
        // Find matching perimeter in dynamic list to get the real ID
        const matched = perimeters.find(p => p.nom.toLowerCase().includes(pData.name.split(' ')[0].toLowerCase()));
        const pId = matched ? matched.id : String(index + 1);

        const polygon = L.polygon(pData.polygon, {
          color: pData.color,
          weight: 2,
          fillColor: pData.color,
          fillOpacity: 0.3,
        }).addTo(map);

        polygon.bindPopup(`
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; max-width: 250px; line-height: 1.4;">
            <h4 style="margin: 0 0 6px 0; color: #1E4620; font-size: 14px; font-weight: 700; border-bottom: 2px solid ${pData.color}; padding-bottom: 4px;">Périmètre : ${pData.name}</h4>
            <p style="margin: 6px 0; font-size: 12px; color: #4B5563; text-align: justify;">${pData.desc}</p>
            <button id="btn-perim-${pId}" style="
              background-color: #1E4620;
              color: white; border: none; padding: 8px 12px;
              border-radius: 6px; font-weight: 600; font-size: 11px;
              cursor: pointer; width: 100%; margin-top: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              transition: background-color 0.2s;
            ">Accéder aux données du Périmètre</button>
          </div>
        `);

        polygon.on('popupopen', () => {
          const btn = document.getElementById(`btn-perim-${pId}`);
          if (btn) {
            btn.onclick = () => {
              onSelectPerimeter(pId);
              map.closePopup();
            };
          }
        });
      });

      // 3. Detailed Coopératives (Pins) for Tiznit
      const coopData = [
        {
          name: "Coopérative Féminine Amal Anzi",
          lat: 29.62,
          lng: -9.36,
          activity: "Extraction d'huile d'argane vierge et cosmétique",
          capacity: "18 tonnes / an d'amandons de haute qualité",
          founded: "2014",
          members: "68 femmes rurales adhérentes",
          labels: "IGP Argane, Bio (Ecocert), ONSSA",
          social: "Financement d'un centre d'alphabétisation local et autonomisation financière des familles de la commune d'Anzi.",
          contact: "+212 5 28 89 12 34 | contact@amal-anzi.org"
        },
        {
          name: "Coopérative El Joud Tafraout",
          lat: 29.71,
          lng: -8.96,
          activity: "Valorisation cosmétique et production d'huile alimentaire de haute qualité",
          capacity: "12 tonnes / an",
          founded: "2011",
          members: "45 femmes de montagne",
          labels: "Bio (USDA Organic), IGP Argane, ONSSA",
          social: "Soutien scolaire aux enfants des adhérentes et promotion de l'arganiculture durable de montagne.",
          contact: "+212 5 28 86 43 21 | eljoud.tafraout@gmail.com"
        },
        {
          name: "Coopérative Tiznit Centre",
          lat: 29.68,
          lng: -9.70,
          activity: "Traitement, conditionnement final, étiquetage et vente",
          capacity: "30 tonnes d'huile conditionnée / an",
          founded: "2008",
          members: "120 femmes du milieu rural",
          labels: "Ecocert, IGP Argane, ONSSA, Commerce Équitable (FairTSA)",
          social: "Centre de formation professionnelle aux métiers de la valorisation des produits du terroir et couverture médicale.",
          contact: "+212 5 28 82 11 22 | contact@argan-tiznit.ma"
        }
      ];

      coopData.forEach(coop => {
        const marker = L.marker([coop.lat, coop.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 8px; width: 280px; line-height: 1.4; color: #1F2937;">
            <h4 style="margin: 0 0 6px 0; color: #8B5A2B; font-size: 14px; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px;">🏡 ${coop.name}</h4>
            <div style="font-size: 12px; margin-bottom: 6px;">
              <p style="margin: 3px 0;"><b>Activité :</b> ${coop.activity}</p>
              <p style="margin: 3px 0;"><b>Capacité :</b> ${coop.capacity}</p>
              <p style="margin: 3px 0;"><b>Membres :</b> ${coop.members} (fondée en ${coop.founded})</p>
              <p style="margin: 3px 0;"><b>Certifications :</b> <span style="background-color: #E8EFE8; color: #1E4620; padding: 2px 4px; border-radius: 4px; font-size: 10px; font-weight: 600;">${coop.labels}</span></p>
              <p style="margin: 6px 0 3px 0; padding-top: 4px; border-top: 1px dashed #E5E7EB; color: #4B5563; font-style: italic;"><b>Impact Social :</b> ${coop.social}</p>
            </div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 6px;">📞 Contact : ${coop.contact}</div>
          </div>
        `);
      });

    } else {
      // Precise polygons for other provinces (generic multi-sided polygons instead of circles)
      perimeters.forEach((p, index) => {
        const offsetLat = (index - 0.5) * 0.12;
        const offsetLng = (index - 0.5) * 0.08;
        const pColor = index === 0 ? "#10B981" : index === 1 ? "#78350F" : "#F59E0B";

        const lat = center.lat + offsetLat;
        const lng = center.lng + offsetLng;

        // Custom polygon vertices to make it look organic
        const customPolygon = [
          [lat + 0.08, lng - 0.06],
          [lat + 0.09, lng + 0.05],
          [lat - 0.03, lng + 0.08],
          [lat - 0.07, lng - 0.01],
          [lat - 0.02, lng - 0.07]
        ];

        const polygon = L.polygon(customPolygon, {
          color: pColor,
          weight: 2,
          fillColor: pColor,
          fillOpacity: 0.25,
        }).addTo(map);

        polygon.bindPopup(`
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; max-width: 240px; line-height: 1.4;">
            <h4 style="margin: 0 0 6px 0; color: #1E4620; font-size: 13px; font-weight: 700; border-bottom: 2px solid ${pColor}; padding-bottom: 4px;">Périmètre : ${p.nom}</h4>
            <p style="margin: 6px 0; font-size: 11px; color: #4B5563;">Périmètre de collecte et valorisation durable d'arganes pour la province de ${provinceName}.</p>
            <button id="btn-perim-${p.id}" style="
              background-color: #1E4620;
              color: white; border: none; padding: 6px 12px;
              border-radius: 4px; font-weight: 600; font-size: 10px;
              cursor: pointer; width: 100%; margin-top: 6px;
            ">Accéder aux données du Périmètre</button>
          </div>
        `);

        polygon.on('popupopen', () => {
          const btn = document.getElementById(`btn-perim-${p.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectPerimeter(p.id);
              map.closePopup();
            };
          }
        });

        // Add a mock cooperative pin
        L.marker([lat + 0.02, lng - 0.02]).addTo(map).bindPopup(`
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 8px; width: 250px; line-height: 1.4;">
            <h4 style="margin: 0 0 4px 0; color: #8B5A2B; font-size: 13px; font-weight: 700; border-bottom: 1px solid #E5E7EB; padding-bottom: 2px;">🏡 Coopérative Locale de ${p.nom}</h4>
            <p style="margin: 3px 0; font-size: 11px;"><b>Activité :</b> Concassage artisanal et extraction d'huile d'argane pure</p>
            <p style="margin: 3px 0; font-size: 11px;"><b>Capacité :</b> 10 tonnes / an</p>
            <p style="margin: 3px 0; font-size: 11px;"><b>Membres :</b> 35 femmes rurales associées</p>
            <p style="margin: 3px 0; font-size: 11px;"><b>Impact :</b> Valorisation locale et structuration socio-économique.</p>
          </div>
        `);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, provinceName, perimeters]);

  return (
    <View style={styles.container}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
      {!leafletLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement de la carte interactive...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2DDD2',
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
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
});
