package com.andzoa.model;

import jakarta.persistence.*;

@Entity
@Table(name = "prix_chronologie")
public class PrixChronologie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer annee;
    private Integer mois;
    private Double prixMinimum;
    private Double prixMaximum;
    private String marchePrincipal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "perimetre_id", nullable = false)
    private Perimetre perimetre;

    public PrixChronologie() {}

    public PrixChronologie(Integer annee, Integer mois, Double prixMinimum, Double prixMaximum, String marchePrincipal, Perimetre perimetre) {
        this.annee = annee;
        this.mois = mois;
        this.prixMinimum = prixMinimum;
        this.prixMaximum = prixMaximum;
        this.marchePrincipal = marchePrincipal;
        this.perimetre = perimetre;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getAnnee() { return annee; }
    public void setAnnee(Integer annee) { this.annee = annee; }
    public Integer getMois() { return mois; }
    public void setMois(Integer mois) { this.mois = mois; }
    public Double getPrixMinimum() { return prixMinimum; }
    public void setPrixMinimum(Double prixMinimum) { this.prixMinimum = prixMinimum; }
    public Double getPrixMaximum() { return prixMaximum; }
    public void setPrixMaximum(Double prixMaximum) { this.prixMaximum = prixMaximum; }
    public String getMarchePrincipal() { return marchePrincipal; }
    public void setMarchePrincipal(String marchePrincipal) { this.marchePrincipal = marchePrincipal; }
    public Perimetre getPerimetre() { return perimetre; }
    public void setPerimetre(Perimetre perimetre) { this.perimetre = perimetre; }
}
