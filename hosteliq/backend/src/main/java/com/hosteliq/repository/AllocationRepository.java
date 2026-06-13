package com.hosteliq.repository;

import com.hosteliq.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByStudentIdAndIsActive(Long studentId, Boolean isActive);
    List<Allocation> findByBedIdAndIsActive(Long bedId, Boolean isActive);
}
