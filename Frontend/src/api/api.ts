import axios from "axios";

const isWeb = typeof window !== 'undefined';
const baseURL = isWeb && window.location.hostname.includes('loca.lt')
  ? "https://andzoa-api-hp.loca.lt"
  : "http://localhost:8080";

const client = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Bypass-Tunnel-Reminder": "true",
  }
});

export default {
  // List all provinces
  getProvinces: async () => {
    const { data } = await client.get("/api/provinces");
    return data;
  },

  // Get a single province
  getProvince: async (id: string) => {
    const { data } = await client.get(`/api/provinces/${id}`);
    return data;
  },

  // Get perimeters of a province
  getPerimetres: async (provinceId: string) => {
    const { data } = await client.get(`/api/provinces/${provinceId}/perimetres`);
    return data;
  },

  // Get arganerie data (production, prices, traders) for a perimeter
  getDonneesArganerie: async (perimeterId: string) => {
    const { data } = await client.get(`/api/perimetres/${perimeterId}/donnees-arganerie`);
    return data;
  },

  // Get projects UCCA for a perimeter
  getProjetsUcca: async (perimeterId: string) => {
    const { data } = await client.get(`/api/perimetres/${perimeterId}/projets-ucca`);
    return data;
  }
};
