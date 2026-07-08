package com.andzoa.controller;

import com.andzoa.model.*;
import com.andzoa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/perimetres")
@CrossOrigin(origins = "*")
public class PerimetreController {

    @Autowired
    private PerimetreRepository perimetreRepository;

    @Autowired
    private PrixChronologieRepository prixChronologieRepository;

    @Autowired
    private TraderRepository traderRepository;

    @Autowired
    private ProjetUCCARepository projetUCCARepository;

    @GetMapping("/{id}/donnees-arganerie")
    public Map<String, Object> getDonneesArganerie(@PathVariable Long id) {
        Perimetre perimetre = perimetreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perimetre not found: " + id));

        List<PrixChronologie> prices = prixChronologieRepository.findByPerimetreId(id);
        List<Trader> traders = traderRepository.findByPerimetreId(id);

        Map<String, Object> response = new HashMap<>();
        response.put("id", perimetre.getId());
        response.put("nom", perimetre.getNom());
        response.put("productionAnnuelle", perimetre.getProductionAnnuelle());
        response.put("prixChronologies", prices);
        response.put("traders", traders);

        return response;
    }

    @GetMapping("/{id}/projets-ucca")
    public List<ProjetUCCA> getProjetsUcca(@PathVariable Long id) {
        return projetUCCARepository.findByPerimetreId(id);
    }
}
