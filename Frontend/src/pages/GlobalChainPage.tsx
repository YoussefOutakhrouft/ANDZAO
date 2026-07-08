import { Link } from "react-router-dom";

export default function GlobalChainPage() {
  return (
    <section className="space-y-8">
      {/* Header placeholder */}
      <header className="text-center py-8">
        <h2 className="text-3xl font-bold text-primary">
          Organisation de l'amont de la filière d'Argan
        </h2>
        <p className="mt-2 text-gray-700">
          <em>Global description of the Argan value chain goes here.</em>
        </p>
      </header>

      {/* Territorial Breakdown */}
      <ProvinceAccordion />
    </section>
  );
}
