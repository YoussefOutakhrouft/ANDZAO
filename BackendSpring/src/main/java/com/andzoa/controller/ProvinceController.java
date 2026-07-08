package com.andzoa.controller;

import com.andzoa.model.Province;
import com.andzoa.model.Perimetre;
import com.andzoa.repository.ProvinceRepository;
import com.andzoa.repository.PerimetreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/provinces")
@CrossOrigin(origins = "*")
public class ProvinceController {

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private PerimetreRepository perimetreRepository;

    @GetMapping
    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Province getProvinceById(@PathVariable Long id) {
        return provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Province not found: " + id));
    }

    @GetMapping("/{id}/perimetres")
    public List<Perimetre> getPerimetresByProvince(@PathVariable Long id) {
        return perimetreRepository.findByProvinceId(id);
    }
}
