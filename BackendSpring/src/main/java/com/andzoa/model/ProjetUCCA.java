package com.andzoa.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projet_ucca")
public class ProjetUCCA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomProjet;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dateIdentification;

    @Column(columnDefinition = "TEXT")
    private String approvisionnement;

    @Column(columnDefinition = "TEXT")
    private String ecoulement;

    @Column(columnDefinition = "TEXT")
    private String cooperativesEncadrantes;

    private String duree;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "perimetre_id", nullable = false)
    private Perimetre perimetre;

    public ProjetUCCA() {}

    public ProjetUCCA(String nomProjet, String description, LocalDate dateIdentification, String approvisionnement, String ecoulement, String cooperativesEncadrantes, String duree, Perimetre perimetre) {
        this.nomProjet = nomProjet;
        this.description = description;
        this.dateIdentification = dateIdentification;
        this.approvisionnement = approvisionnement;
        this.ecoulement = ecoulement;
        this.cooperativesEncadrantes = cooperativesEncadrantes;
        this.duree = duree;
        this.perimetre = perimetre;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomProjet() { return nomProjet; }
    public void setNomProjet(String nomProjet) { this.nomProjet = nomProjet; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDateIdentification() { return dateIdentification; }
    public void setDateIdentification(LocalDate dateIdentification) { this.dateIdentification = dateIdentification; }
    public String getApprovisionnement() { return approvisionnement; }
    public void setApprovisionnement(String approvisionnement) { this.approvisionnement = approvisionnement; }
    public String getEcoulement() { return ecoulement; }
    public void setEcoulement(String ecoulement) { this.ecoulement = ecoulement; }
    public String getCooperativesEncadrantes() { return cooperativesEncadrantes; }
    public void setCooperativesEncadrantes(String cooperativesEncadrantes) { this.cooperativesEncadrantes = cooperativesEncadrantes; }
    public String getDuree() { return duree; }
    public void setDuree(String duree) { this.duree = duree; }
    public Perimetre getPerimetre() { return perimetre; }
    public void setPerimetre(Perimetre perimetre) { this.perimetre = perimetre; }
}
