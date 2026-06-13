package com.hosteliq.repository;

import com.hosteliq.entity.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByHostelId(Long hostelId);
    List<Analytics> findBySnapshotDate(LocalDate snapshotDate);
}
