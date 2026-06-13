package com.hosteliq.repository;

import com.hosteliq.entity.ElectricityUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ElectricityUsageRepository extends JpaRepository<ElectricityUsage, Long> {
    List<ElectricityUsage> findByRoomId(Long roomId);
    Optional<ElectricityUsage> findByRoomIdAndMonthAndYear(Long roomId, String month, Integer year);
}
