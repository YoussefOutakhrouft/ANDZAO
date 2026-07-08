package com.andzoa;

import com.andzoa.model.*;
import com.andzoa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private PerimetreRepository perimetreRepository;

    @Autowired
    private PrixChronologieRepository prixChronologieRepository;

    @Autowired
    private TraderRepository traderRepository;

    @Autowired
    private ProjetUCCARepository projetUCCARepository;

    @Override
    public void run(String... args) throws Exception {
        if (provinceRepository.count() > 0) {
            System.out.println("La base de données contient déjà des données.");
            return;
        }

        System.out.println("Initialisation de la base de données ANDZOA...");

        // 1. Les 7 Provinces
        Province essaouira = new Province("Essaouira", "Province côtière réputée pour ses forêts d'arganiers denses et sa contribution historique au commerce de l'huile d'argane.");
        Province agadir = new Province("Agadir Idaoutanan", "Province caractérisée par une forte concentration de coopératives de transformation et d'exportation d'huile d'argane.");
        Province taroudant = new Province("Taroudant", "La plus vaste province agricole possédant les plus grandes plaines d'arganiers de la région Souss-Massa.");
        Province chtouka = new Province("Chtouka Ait Baha", "Zone de montagne et de plaine au savoir-faire ancestral dans l'exploitation et la préservation de l'arganier.");
        Province tiznit = new Province("Tiznit", "Province historique abritant des zones emblématiques comme Anzi, Tafraout et Tiznit Centre.");
        Province sidiIfni = new Province("Sidi Ifni", "Province côtière aride propice au développement d'arganiers sauvages extrêmement robustes.");
        Province guelmim = new Province("Guelmim", "Porte du Sahara, représentant la limite méridionale de l'arganeraie marocaine avec des enjeux d'adaptation climatique.");

        provinceRepository.saveAll(Arrays.asList(essaouira, agadir, taroudant, chtouka, tiznit, sidiIfni, guelmim));

        // 2. Périmètres pour Tiznit
        Perimetre anzi = new Perimetre("Anzi", "Anzi Coordinates", 180.0, tiznit);
        Perimetre tafraout = new Perimetre("Tafraout", "Tafraout Coordinates", 95.0, tiznit);
        Perimetre tiznitCentre = new Perimetre("Tiznit (Centre)", "Tiznit Centre Coordinates", 120.0, tiznit);

        // Périmètres fictifs d'exemple pour d'autres provinces
        Perimetre essaouiraCentre = new Perimetre("Essaouira Centre", "Essaouira Coordinates", 150.0, essaouira);
        Perimetre agadirCentre = new Perimetre("Agadir Centre", "Agadir Coordinates", 210.0, agadir);
        Perimetre taroudantPlaine = new Perimetre("Taroudant Plaine", "Taroudant Coordinates", 320.0, taroudant);
        Perimetre chtoukaAitBaha = new Perimetre("Aït Baha", "Aït Baha Coordinates", 140.0, chtouka);
        Perimetre sidiIfniCentre = new Perimetre("Sidi Ifni Centre", "Sidi Ifni Coordinates", 80.0, sidiIfni);
        Perimetre guelmimCentre = new Perimetre("Guelmim Centre", "Guelmim Coordinates", 60.0, guelmim);

        perimetreRepository.saveAll(Arrays.asList(anzi, tafraout, tiznitCentre, essaouiraCentre, agadirCentre, taroudantPlaine, chtoukaAitBaha, sidiIfniCentre, guelmimCentre));

        // 3. Chronologie des Prix pour les périmètres de Tiznit (2023, 2024 et 2025)
        // Pour chaque périmètre, nous insérons un historique complet sur 12 mois pour enrichir les diagrammes
        List<Perimetre> tiznitPerims = Arrays.asList(anzi, tafraout, tiznitCentre);
        for (Perimetre p : tiznitPerims) {
            double baseMin = p.getNom().contains("Tafraout") ? 340.0 : p.getNom().contains("Centre") ? 310.0 : 280.0;
            double baseMax = p.getNom().contains("Tafraout") ? 410.0 : p.getNom().contains("Centre") ? 380.0 : 340.0;
            String marche = p.getNom().contains("Tafraout") ? "Marché Régional d'Altitude Tafraout" : p.getNom().contains("Centre") ? "Souk Tiznit Centre" : "Marché Hebdomadaire Local d'Anzi";

            // 2023
            for (int month = 1; month <= 12; month++) {
                double trend = month * 3.5; // Légère hausse saisonnière
                prixChronologieRepository.save(new PrixChronologie(2023, month, baseMin + trend, baseMax + trend, marche, p));
            }
            // 2024
            for (int month = 1; month <= 12; month++) {
                double trend = month * 4.0; // Hausse
                prixChronologieRepository.save(new PrixChronologie(2024, month, baseMin + 30.0 + trend, baseMax + 35.0 + trend, marche, p));
            }
            // 2025
            for (int month = 1; month <= 12; month++) {
                double trend = month * 4.5;
                prixChronologieRepository.save(new PrixChronologie(2025, month, baseMin + 60.0 + trend, baseMax + 70.0 + trend, marche, p));
            }
        }

        // Chronologie des Prix pour d'autres périmètres
        prixChronologieRepository.save(new PrixChronologie(2024, 1, 320.0, 370.0, "Marché Essaouira", essaouiraCentre));
        prixChronologieRepository.save(new PrixChronologie(2024, 1, 380.0, 430.0, "Marché Agadir", agadirCentre));

        // 4. Traders
        traderRepository.save(new Trader("Youssef Bennouna", "Anzi, Agadir, Casablanca", "youssef.bennouna@argantrade.ma", "+212 5 28 33 44 55", anzi));
        traderRepository.save(new Trader("Leila Mansouri", "Tafraout, Casablanca, Export", "leila.mansouri@atlasoils.com", "+212 5 22 99 88 77", tafraout));
        traderRepository.save(new Trader("Amal Ait Baha", "Tiznit, Agadir, Local", "amal@tighanimine.org", "+212 6 61 23 45 67", tiznitCentre));

        // 5. Projets UCCA
        projetUCCARepository.save(new ProjetUCCA(
                "UCCA Anzi Nord",
                "Construction d'une unité moderne de concassage mécanique pour réduire la pénibilité du travail des femmes et augmenter le rendement d'extraction de l'huile d'argane.",
                LocalDate.of(2023, 3, 15),
                "Collecte directe auprès des coopératives agricoles et des cueilleuses de la commune d'Anzi.",
                "Canal court vers les coopératives cosmétiques d'Agadir et exportateur agréé.",
                "Coopérative Féminine Tighanimine, Association d'Anzi pour le Développement",
                "18 mois",
                anzi
        ));

        projetUCCARepository.save(new ProjetUCCA(
                "UCCA Tafraout Montagne",
                "Mise en place d'une unité pilote de concassage et de stockage des amandons adaptée aux zones accidentées de montagne pour les coopératives locales.",
                LocalDate.of(2024, 1, 10),
                "Récolte forestière sur les pentes de l'Anti-Atlas autour de Tafraout.",
                "Commercialisation sous label d'origine (IGP Argane) pour les herboristeries de luxe et l'agro-tourisme.",
                "Coopérative Féminine Tafraout, Union des Coopératives de l'Anti-Atlas",
                "12 mois",
                tafraout
        ));

        projetUCCARepository.save(new ProjetUCCA(
                "UCCA Tiznit Centre",
                "Projet d'extension de l'unité de traitement centrale pour y ajouter une ligne d'emballage et de conditionnement aux normes d'exportation.",
                LocalDate.of(2023, 8, 20),
                "Apport de matière première depuis les périmètres limitrophes de la province de Tiznit.",
                "Réseaux de grande distribution nationaux et circuits d'exportation bio vers l'Europe.",
                "Coopérative Tiznit Argan, Groupement d'Intérêt Économique (GIE) Souss-Massa",
                "24 mois",
                tiznitCentre
        ));

        projetUCCARepository.save(new ProjetUCCA(
                "UCCA Essaouira Littoral",
                "Mise en place d'une unité coopérative de concassage et de tri de l'argane littorale, intégrant une presse d'extraction solaire.",
                LocalDate.of(2023, 5, 12),
                "Récolte sur les dunes et plaines côtières d'Essaouira.",
                "Huile alimentaire et cosmétique certifiée pour le marché touristique local et export.",
                "Coopérative Féminine Mogador, Union des Femmes Productrices d'Essaouira",
                "15 mois",
                essaouiraCentre
        ));

        projetUCCARepository.save(new ProjetUCCA(
                "UCCA Agadir Souss",
                "Création d'un centre régional de valorisation de l'argane avec laboratoire de contrôle qualité intégré pour la certification biologique.",
                LocalDate.of(2024, 2, 18),
                "Collecte globale auprès des coopératives de la vallée de l'Idaoutanan.",
                "Réseaux de cosmétiques biologiques européens et nord-américains.",
                "Coopérative Féminine Amal, Union Souss-Massa",
                "30 mois",
                agadirCentre
        ));

        System.out.println("Initialisation de la base de données ANDZOA terminée avec succès !");
    }
}
