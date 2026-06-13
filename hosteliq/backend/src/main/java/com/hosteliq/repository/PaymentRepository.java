package com.hosteliq.repository;

import com.hosteliq.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    Optional<Payment> findByInvoiceId(Long invoiceId);
    Optional<Payment> findByTransactionRef(String transactionRef);
}
