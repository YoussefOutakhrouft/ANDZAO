package com.andzoa.repository;

import com.andzoa.model.PrixChronologie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrixChronologieRepository extends JpaRepository<PrixChronologie, Long> {
    List<PrixChronologie> findByPerimetreId(Long perimetreId);
}
