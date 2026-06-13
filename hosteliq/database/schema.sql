-- ============================================================
-- HOSTELIQ – Complete PostgreSQL Schema (Production & Hackathon Ready)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────
-- ROLES
-- ──────────────────────────────────────────────
CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL
);

-- Insert roles immediately
INSERT INTO roles (name) VALUES 
('ROLE_STUDENT'), 
('ROLE_PARENT'), 
('ROLE_WARDEN'), 
('ROLE_SECURITY'), 
('ROLE_ADMIN');

-- ──────────────────────────────────────────────
-- USERS
-- ──────────────────────────────────────────────
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER ROLES MAPPING
CREATE TABLE user_roles (
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id     BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ──────────────────────────────────────────────
-- HOSTELS
-- ──────────────────────────────────────────────
CREATE TABLE hostels (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    code        VARCHAR(20) UNIQUE NOT NULL,
    type        VARCHAR(10) CHECK (type IN ('BOYS','GIRLS','CO_ED')),
    address     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- BLOCKS (Inside Hostels)
-- ──────────────────────────────────────────────
CREATE TABLE blocks (
    id          BIGSERIAL PRIMARY KEY,
    hostel_id   BIGINT NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    name        VARCHAR(50) NOT NULL,
    total_floors INT DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hostel_id, name)
);

-- ──────────────────────────────────────────────
-- ROOMS (Inside Blocks)
-- ──────────────────────────────────────────────
CREATE TABLE rooms (
    id          BIGSERIAL PRIMARY KEY,
    block_id    BIGINT NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor       INT NOT NULL,
    room_type   VARCHAR(20) CHECK (room_type IN ('SINGLE','DOUBLE','TRIPLE','DORMITORY')),
    status      VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','FULL','MAINTENANCE')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(block_id, room_number)
);

-- ──────────────────────────────────────────────
-- BEDS (Inside Rooms)
-- ──────────────────────────────────────────────
CREATE TABLE beds (
    id          BIGSERIAL PRIMARY KEY,
    room_id     BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    bed_number  VARCHAR(10) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, bed_number)
);

-- ──────────────────────────────────────────────
-- STUDENTS
-- ──────────────────────────────────────────────
CREATE TABLE students (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_no   VARCHAR(50) UNIQUE NOT NULL,
    course          VARCHAR(100),
    year            INT,
    department      VARCHAR(100),
    dob             DATE,
    gender          VARCHAR(10),
    emergency_contact VARCHAR(20),
    parent_name     VARCHAR(255),
    parent_phone    VARCHAR(20),
    parent_email    VARCHAR(255),
    address         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- PARENTS
-- ──────────────────────────────────────────────
CREATE TABLE parents (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id  BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relation    VARCHAR(50) DEFAULT 'PARENT',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- WARDENS (Explicit link to block/hostel)
-- ──────────────────────────────────────────────
CREATE TABLE wardens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hostel_id   BIGINT REFERENCES hostels(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ALLOCATIONS
-- ──────────────────────────────────────────────
CREATE TABLE allocations (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    bed_id      BIGINT NOT NULL REFERENCES beds(id) ON DELETE CASCADE,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vacated_at  TIMESTAMP,
    is_active   BOOLEAN DEFAULT TRUE,
    UNIQUE(student_id, is_active)
);

-- ──────────────────────────────────────────────
-- COMPLAINTS
-- ──────────────────────────────────────────────
CREATE TABLE complaints (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    room_id         BIGINT REFERENCES rooms(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(50) DEFAULT 'OTHER' CHECK (category IN ('ELECTRICAL','WATER','MESS','CLEANING','FURNITURE','OTHER')),
    priority        VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
    status          VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED')),
    ai_category     VARCHAR(50),
    ai_priority     VARCHAR(10),
    ai_eta_hours    INT,
    ai_confidence   FLOAT,
    assigned_to     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    resolved_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- LEAVE REQUESTS
-- ──────────────────────────────────────────────
CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    reason          TEXT NOT NULL,
    leave_from      DATE NOT NULL,
    leave_to        DATE NOT NULL,
    destination     VARCHAR(255),
    contact_during_leave VARCHAR(20),
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED')),
    approved_by     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- GATE PASS
-- ──────────────────────────────────────────────
CREATE TABLE gate_pass (
    id              BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT UNIQUE REFERENCES leave_requests(id) ON DELETE CASCADE,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    pass_code       VARCHAR(100) UNIQUE NOT NULL,
    qr_data         TEXT NOT NULL,
    valid_from      TIMESTAMP NOT NULL,
    valid_until     TIMESTAMP NOT NULL,
    exit_scanned_at TIMESTAMP,
    entry_scanned_at TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','USED','EXPIRED','REVOKED')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- VISITOR LOGS
-- ──────────────────────────────────────────────
CREATE TABLE visitor_logs (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    visitor_name    VARCHAR(255) NOT NULL,
    visitor_phone   VARCHAR(20),
    relation        VARCHAR(50),
    purpose         TEXT,
    check_in_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_out_time  TIMESTAMP,
    approved_by     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status          VARCHAR(20) DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN','CHECKED_OUT','REJECTED')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- INVOICES (Billing details)
-- ──────────────────────────────────────────────
CREATE TABLE invoices (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    due_date        DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','OVERDUE')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- PAYMENTS (Payment transactions)
-- ──────────────────────────────────────────────
CREATE TABLE payments (
    id              BIGSERIAL PRIMARY KEY,
    invoice_id      BIGINT UNIQUE NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount          DECIMAL(10,2) NOT NULL,
    payment_method  VARCHAR(50) NOT NULL CHECK (payment_method IN ('UPI','CARD','NET_BANKING')),
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    status          VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('PENDING','SUCCESS','FAILED')),
    payment_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- TRANSACTIONS & RECEIPTS
-- ──────────────────────────────────────────────
CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    payment_id      BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    amount          DECIMAL(10,2) NOT NULL,
    type            VARCHAR(20) CHECK (type IN ('CREDIT','DEBIT')),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipts (
    id              BIGSERIAL PRIMARY KEY,
    payment_id      BIGINT UNIQUE NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number  VARCHAR(100) UNIQUE NOT NULL,
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ELECTRICITY USAGE
-- ──────────────────────────────────────────────
CREATE TABLE electricity_usage (
    id              BIGSERIAL PRIMARY KEY,
    room_id         BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    month           VARCHAR(20) NOT NULL,
    year            INT NOT NULL,
    units_consumed  DECIMAL(10,2) NOT NULL,
    bill_amount     DECIMAL(10,2) NOT NULL,
    is_billed       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, month, year)
);

-- ──────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    message         TEXT NOT NULL,
    type            VARCHAR(30) DEFAULT 'INFO' CHECK (type IN ('INFO','WARNING','ALERT','SUCCESS')),
    is_read         BOOLEAN DEFAULT FALSE,
    ref_type        VARCHAR(50),
    ref_id          BIGINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ANALYTICS SNAPSHOTS
-- ──────────────────────────────────────────────
CREATE TABLE analytics (
    id                  BIGSERIAL PRIMARY KEY,
    hostel_id           BIGINT REFERENCES hostels(id) ON DELETE CASCADE,
    snapshot_date       DATE DEFAULT CURRENT_DATE,
    total_students      INT DEFAULT 0,
    total_rooms         INT DEFAULT 0,
    occupied_rooms      INT DEFAULT 0,
    open_complaints     INT DEFAULT 0,
    resolved_complaints INT DEFAULT 0,
    pending_leaves      INT DEFAULT 0,
    approved_leaves     INT DEFAULT 0,
    revenue_collected   DECIMAL(12,2) DEFAULT 0.0,
    pending_revenue     DECIMAL(12,2) DEFAULT 0.0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- AUDIT LOGS
-- ──────────────────────────────────────────────
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   BIGINT,
    old_value   JSONB,
    new_value   JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────
CREATE INDEX idx_complaints_student ON complaints(student_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_leave_student ON leave_requests(student_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_gate_pass_code ON gate_pass(pass_code);
