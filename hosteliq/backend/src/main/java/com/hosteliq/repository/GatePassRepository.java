package com.hosteliq.repository;

import com.hosteliq.entity.GatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {
    Optional<GatePass> findByPassCode(String passCode);
    List<GatePass> findByStudentId(Long studentId);
    Optional<GatePass> findByLeaveRequestId(Long leaveRequestId);
}
