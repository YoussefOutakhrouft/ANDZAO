package com.andzoa.repository;

import com.andzoa.model.ProjetUCCA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjetUCCARepository extends JpaRepository<ProjetUCCA, Long> {
    List<ProjetUCCA> findByPerimetreId(Long perimetreId);
}
