package com.andzoa.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trader")
public class Trader {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String marchesCode;
    private String email;
    private String telephone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "perimetre_id", nullable = false)
    private Perimetre perimetre;

    public Trader() {}

    public Trader(String nom, String marchesCode, String email, String telephone, Perimetre perimetre) {
        this.nom = nom;
        this.marchesCode = marchesCode;
        this.email = email;
        this.telephone = telephone;
        this.perimetre = perimetre;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getMarchesCode() { return marchesCode; }
    public void setMarchesCode(String marchesCode) { this.marchesCode = marchesCode; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public Perimetre getPerimetre() { return perimetre; }
    public void setPerimetre(Perimetre perimetre) { this.perimetre = perimetre; }
}
