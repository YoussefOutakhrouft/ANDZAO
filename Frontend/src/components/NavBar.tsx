import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-primary text-white flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-semibold">ANDZOA – Argan Value Chain</h1>
      <div className="space-x-4">
        <Link
          to="/"
          className="bg-secondary hover:bg-secondary/80 text-white py-2 px-4 rounded transition"
        >
          Organisation de l'amont de la filière d'Argan
        </Link>
        {/* The second button will be dynamically set by the UI when a province is selected */}
        <Link
          to="/province/1"
          className="bg-secondary hover:bg-secondary/80 text-white py-2 px-4 rounded transition"
        >
          Détails Province
        </Link>
      </div>
    </nav>
  );
}
