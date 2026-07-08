import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import ProvinceTabs from "../components/ProvinceTabs";

export default function ProvinceDashboard() {
  const { provinceId } = useParams<{ provinceId: string }>();
  const { data: province, isLoading } = useQuery([
    "province",
    provinceId
  ], () => api.getProvinceDetails(provinceId!));

  if (isLoading) return <p className="text-center py-8">Loading…</p>;

  return (
    <section className="space-y-6">
      <header className="text-center py-4">
        <h2 className="text-2xl font-semibold text-primary">
          Organisation de l'amont de la filière d'Argan (Province de {province?.name})
        </h2>
      </header>

      <ProvinceTabs province={province!} />
    </section>
  );
}
