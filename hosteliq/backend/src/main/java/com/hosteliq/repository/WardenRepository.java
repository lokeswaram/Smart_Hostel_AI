package com.hosteliq.repository;

import com.hosteliq.entity.Warden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WardenRepository extends JpaRepository<Warden, Long> {
    Optional<Warden> findByUserId(Long userId);
    List<Warden> findByHostelId(Long hostelId);
}
