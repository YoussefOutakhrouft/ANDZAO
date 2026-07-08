import { useState } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import api from "../api/api";

const [provinces, setProvinces] = useState<Array<{id:string; name:string}>>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProvinces = async () => {
    try {
      const data = await api.getProvinces();
      const list = data.provinces.map((p:any) => ({ id: p.id, name: p.name }));
      setProvinces(list);
    } catch (e) {
      console.error("Failed to load provinces", e);
    } finally {
      setLoading(false);
    }
  };
  fetchProvinces();
}, []);


export default function ProvinceAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {provinces.map(p => (
        <div key={p.id} className="border rounded-lg bg-surface shadow-sm overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition"
            onClick={() => toggle(p.id)}
          >
            <span className="text-lg font-medium text-primary">{p.name}</span>
            {openId === p.id ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {openId === p.id && (
            <div className="p-4 border-t bg-white animate-fade-in">
              <p className="text-gray-700 mb-4">
                <em>{p.name} – brief description of its role in the Argan value chain.</em>
              </p>
              <button
                onClick={() => navigate(`/province/${p.id}`)}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/80 transition"
              >
                Accéder aux détails de la Province
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
