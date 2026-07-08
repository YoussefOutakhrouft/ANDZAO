package com.andzoa.repository;

import com.andzoa.model.Perimetre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerimetreRepository extends JpaRepository<Perimetre, Long> {
    List<Perimetre> findByProvinceId(Long provinceId);
}
