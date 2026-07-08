import { Tab } from "@headlessui/react";
import MapTab from "./MapTab";
import DataTab from "./DataTab";
import ProjectsTab from "./ProjectsTab";

export default function ProvinceTabs({ province }: { province: any }) {
  const tabs = [
    { name: "Carte de la province", component: <MapTab province={province} /> },
    { name: "Données de l'arganerie", component: <DataTab province={province} /> },
    { name: "Projet de construction des UCCA", component: <ProjectsTab province={province} /> }
  ];

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 border-b">
        {tabs.map((t) => (
          <Tab
            key={t.name}
            className={({ selected }) =>
              `px-4 py-2 rounded-t ${
                selected
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`
            }
          >
            {t.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((t) => (
          <Tab.Panel key={t.name}>{t.component}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
