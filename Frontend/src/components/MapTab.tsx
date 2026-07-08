import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import MapComponent from "./MapComponent";

import provincesData from "../data/provinces.json";

export default function MapTab({ province }: MapTabProps) {
  const [visible, setVisible] = React.useState(true);
  const currentProvince = provincesData.provinces.find(p => p.id === province?.id);
  const perimeters = currentProvince?.perimetres || [];
  const [visible, setVisible] = React.useState(true);

  // le composant MapComponent attend deux callbacks
  const onForestSelect = () => {
    alert(`Forêt d'Argan dans la province ${province?.name}`);
  };
  const onAssociationSelect = () => {
    alert(`Association d'Arganeraie dans ${province?.name}`);
  };

  return (
    <>
      {visible && (
        <Modal transparent={true} animationType="fade">
          <View className="flex-1 bg-black/30 justify-center items-center">
            <View className="w-11/12 h-4/5 bg-white rounded-xl overflow-hidden">
              <MapComponent
                onForestSelect={onForestSelect}
                onAssociationSelect={onAssociationSelect}
              />
              <TouchableOpacity
                className="absolute top-2 right-2 p-2 bg-primary rounded-full"
                onPress={() => setVisible(false)}
              >
                <Text className="text-white font-bold">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <View className="p-4">
        <Text className="text-lg font-semibold mb-2">
          Carte interactive de {province?.name}
        </Text>
        <TouchableOpacity
          className="bg-primary py-2 px-4 rounded-md"
          onPress={() => setVisible(true)}
        >
          <Text className="text-white text-center">Ouvrir la carte</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}