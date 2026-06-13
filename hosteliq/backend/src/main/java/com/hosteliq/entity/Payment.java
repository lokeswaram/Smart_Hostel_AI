package com.hosteliq.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; // UPI, CARD, NET_BANKING

    @Column(name = "transaction_ref", nullable = false, unique = true)
    private String transactionRef;

    @Column(nullable = false)
    private String status = "SUCCESS"; // PENDING, SUCCESS, FAILED

    @Column(name = "payment_date")
    private LocalDateTime paymentDate = LocalDateTime.now();

    public Payment() {
    }

    public Payment(Long id, Invoice invoice, Student student, BigDecimal amount, String paymentMethod, String transactionRef, String status, LocalDateTime paymentDate) {
        this.id = id;
        this.invoice = invoice;
        this.student = student;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionRef = transactionRef;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    // Builder class
    public static class PaymentBuilder {
        private Long id;
        private Invoice invoice;
        private Student student;
        private BigDecimal amount;
        private String paymentMethod;
        private String transactionRef;
        private String status = "SUCCESS";
        private LocalDateTime paymentDate = LocalDateTime.now();

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder invoice(Invoice invoice) { this.invoice = invoice; return this; }
        public PaymentBuilder student(Student student) { this.student = student; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentBuilder transactionRef(String transactionRef) { this.transactionRef = transactionRef; return this; }
        public PaymentBuilder status(String status) { this.status = status; return this; }
        public PaymentBuilder paymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; return this; }

        public Payment build() {
            return new Payment(id, invoice, student, amount, paymentMethod, transactionRef, status, paymentDate);
        }
    }
}
