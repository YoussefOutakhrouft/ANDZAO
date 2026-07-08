package com.andzoa.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "perimetre")
public class Perimetre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String coordinates;

    private Double productionAnnuelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    @OneToMany(mappedBy = "perimetre", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PrixChronologie> prixChronologies;

    @OneToMany(mappedBy = "perimetre", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Trader> traders;

    @OneToMany(mappedBy = "perimetre", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ProjetUCCA> projetsUcca;

    public Perimetre() {}

    public Perimetre(String nom, String coordinates, Double productionAnnuelle, Province province) {
        this.nom = nom;
        this.coordinates = coordinates;
        this.productionAnnuelle = productionAnnuelle;
        this.province = province;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }
    public Double getProductionAnnuelle() { return productionAnnuelle; }
    public void setProductionAnnuelle(Double productionAnnuelle) { this.productionAnnuelle = productionAnnuelle; }
    public Province getProvince() { return province; }
    public void setProvince(Province province) { this.province = province; }
    public List<PrixChronologie> getPrixChronologies() { return prixChronologies; }
    public void setPrixChronologies(List<PrixChronologie> prixChronologies) { this.prixChronologies = prixChronologies; }
    public List<Trader> getTraders() { return traders; }
    public void setTraders(List<Trader> traders) { this.traders = traders; }
    public List<ProjetUCCA> getProjetsUcca() { return projetsUcca; }
    public void setProjetsUcca(List<ProjetUCCA> projetsUcca) { this.projetsUcca = projetsUcca; }
}
