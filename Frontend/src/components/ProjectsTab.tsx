import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import EconomicCard from "./EconomicCard";

type ProjectsTabProps = {
  province: any;
};

export default function ProjectsTab({ province }: ProjectsTabProps) {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("http://localhost:8080/api/projects")
      .then((r) => r.json())
      .then((list) =>
        // filtrer par province si besoin
        setProjects(
          province?.id
            ? list.filter((p: any) => p.provinceId === province.id)
            : list
        )
      )
      .catch(() => setProjects([]));
  }, [province?.id]);

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">
        Projets UCCA – {province?.name ?? "Toutes les provinces"}
      </Text>
      <ScrollView className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <EconomicCard
            key={p.id}
            title={p.name}
            value={`${p.progress}%`}
            trend={p.status}
            trendDirection={
              p.status === "En cours"
                ? "up"
                : p.status === "Retard"
                ? "down"
                : "stable"
            }
            icon={<Text className="text-xl">🏗️</Text>}
          >
            <View className="mt-2">
              <Text className="text-sm text-gray-600">{p.description}</Text>
            </View>
            <TouchableOpacity
              className="mt-3 bg-secondary py-1 px-3 rounded-md self-start"
              onPress={() => setSelected(p)}
            >
              <Text className="text-white text-sm">Détails</Text>
            </TouchableOpacity>
          </EconomicCard>
        ))}
      </ScrollView>

      {/* Modal détail du projet */}
      {selected && (
        <Modal transparent={true} animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center p-4">
            <View className="w-full max-w-md bg-cardBackground rounded-xl p-6">
              <Text className="text-xl font-bold mb-2">{selected.name}</Text>
              <Text className="mb-4">{selected.description}</Text>
              <Text>
                <Text className="font-semibold">Statut : </Text>
                {selected.status}
              </Text>
              <Text>
                <Text className="font-semibold">Progression : </Text>
                {selected.progress}%
              </Text>
              <TouchableOpacity
                className="mt-4 bg-primary py-2 px-4 rounded-md self-end"
                onPress={() => setSelected(null)}
              >
                <Text className="text-white text-center">Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}