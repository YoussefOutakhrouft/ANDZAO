import React from "react";
import { View, Text } from "react-native";
import DataTable from "react-data-table-component";
import { Colors } from "@/constants/theme";

type DataTabProps = {
  province: any;
};

export default function DataTab({ province }: DataTabProps) {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    // appel API simple – l'URL dépend du backend Spring
    fetch(`http://localhost:8080/api/province/${province?.id}/production`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, [province?.id]);

  const columns = [
    { name: "Année", selector: (row: any) => row.year, sortable: true },
    {
      name: "Production (t)",
      selector: (row: any) => row.production,
      sortable: true,
    },
    {
      name: "Prix (€/t)",
      selector: (row: any) => row.price,
      sortable: true,
    },
    {
      name: "Tendance",
      cell: (row: any) => (
        <Text
          style={{
            color:
              row.trendDirection === "up"
                ? Colors.success
                : row.trendDirection === "down"
                ? "#D32F2F"
                : Colors.textSecondary,
          }}
        >
          {row.trendDirection === "up"
            ? "▲"
            : row.trendDirection === "down"
            ? "▼"
            : "●"}{" "}
          {row.trend}
        </Text>
      ),
    },
  ];

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">
        Données arganières – {province?.name}
      </Text>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        dense
        customStyles={{
          header: { style: { backgroundColor: Colors.cardBackground } },
          rows: {
            style: { backgroundColor: Colors.cardBackground },
          },
        }}
      />
    </View>
  );
}