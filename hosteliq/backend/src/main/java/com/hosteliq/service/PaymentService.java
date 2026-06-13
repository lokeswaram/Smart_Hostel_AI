package com.hosteliq.service;

import com.hosteliq.entity.Invoice;
import com.hosteliq.entity.Payment;
import com.hosteliq.entity.Student;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.InvoiceRepository;
import com.hosteliq.repository.PaymentRepository;
import com.hosteliq.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<Invoice> getInvoicesByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        return invoiceRepository.findByStudentId(student.getId());
    }

    public List<Payment> getPaymentsByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        return paymentRepository.findByStudentId(student.getId());
    }

    @Transactional
    public Payment processPayment(Long studentUserId, Long invoiceId, String paymentMethod) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if ("PAID".equals(invoice.getStatus())) {
            throw new RuntimeException("Invoice is already paid.");
        }

        // Create mock transaction reference
        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        Payment payment = Payment.builder()
                .invoice(invoice)
                .student(student)
                .amount(invoice.getAmount())
                .paymentMethod(paymentMethod)
                .transactionRef(transactionRef)
                .status("SUCCESS")
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Mark invoice as PAID
        invoice.setStatus("PAID");
        invoice.setUpdatedAt(LocalDateTime.now());
        invoiceRepository.save(invoice);

        return savedPayment;
    }
}
