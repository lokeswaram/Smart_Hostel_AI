-- ============================================================
-- HOSTELIQ – Complete PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────
-- USERS (auth table for all roles)
-- ──────────────────────────────────────────────
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(30) NOT NULL CHECK (role IN ('ROLE_STUDENT','ROLE_WARDEN','ROLE_ADMIN','ROLE_PARENT')),
    full_name   VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- HOSTELS
-- ──────────────────────────────────────────────
CREATE TABLE hostels (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    code        VARCHAR(20) UNIQUE NOT NULL,
    type        VARCHAR(10) CHECK (type IN ('BOYS','GIRLS','CO_ED')),
    total_rooms INT DEFAULT 0,
    warden_id   BIGINT REFERENCES users(id),
    address     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ROOMS
-- ──────────────────────────────────────────────
CREATE TABLE rooms (
    id          BIGSERIAL PRIMARY KEY,
    hostel_id   BIGINT NOT NULL REFERENCES hostels(id),
    room_number VARCHAR(20) NOT NULL,
    block       VARCHAR(10),
    floor       INT,
    capacity    INT DEFAULT 2,
    occupied    INT DEFAULT 0,
    room_type   VARCHAR(20) CHECK (room_type IN ('SINGLE','DOUBLE','TRIPLE','DORMITORY')),
    status      VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','FULL','MAINTENANCE')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hostel_id, room_number)
);

-- ──────────────────────────────────────────────
-- STUDENTS (extended profile)
-- ──────────────────────────────────────────────
CREATE TABLE students (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT UNIQUE NOT NULL REFERENCES users(id),
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
    user_id     BIGINT UNIQUE NOT NULL REFERENCES users(id),
    student_id  BIGINT NOT NULL REFERENCES students(id),
    relation    VARCHAR(50) DEFAULT 'PARENT',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ROOM ASSIGNMENTS
-- ──────────────────────────────────────────────
CREATE TABLE room_assignments (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id),
    room_id     BIGINT NOT NULL REFERENCES rooms(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vacated_at  TIMESTAMP,
    is_active   BOOLEAN DEFAULT TRUE
);

-- ──────────────────────────────────────────────
-- COMPLAINTS
-- ──────────────────────────────────────────────
CREATE TABLE complaints (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    room_id         BIGINT REFERENCES rooms(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(50) DEFAULT 'OTHER' CHECK (category IN ('ELECTRICAL','CLEANING','FOOD','PLUMBING','WIFI','FURNITURE','OTHER')),
    priority        VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
    status          VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED','CLOSED')),
    ai_category     VARCHAR(50),
    ai_priority     VARCHAR(10),
    ai_eta_hours    INT,
    ai_confidence   FLOAT,
    assigned_to     BIGINT REFERENCES users(id),
    resolved_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- COMPLAINT COMMENTS
-- ──────────────────────────────────────────────
CREATE TABLE complaint_comments (
    id              BIGSERIAL PRIMARY KEY,
    complaint_id    BIGINT NOT NULL REFERENCES complaints(id),
    user_id         BIGINT NOT NULL REFERENCES users(id),
    comment         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- LEAVE REQUESTS
-- ──────────────────────────────────────────────
CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    reason          TEXT NOT NULL,
    leave_from      DATE NOT NULL,
    leave_to        DATE NOT NULL,
    destination     VARCHAR(255),
    contact_during_leave VARCHAR(20),
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','CANCELLED')),
    approved_by     BIGINT REFERENCES users(id),
    approved_at     TIMESTAMP,
    remarks         TEXT,
    qr_code         TEXT,
    parent_notified BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- GATE PASS
-- ──────────────────────────────────────────────
CREATE TABLE gate_pass (
    id              BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT UNIQUE REFERENCES leave_requests(id),
    student_id      BIGINT NOT NULL REFERENCES students(id),
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
-- VISITOR LOGS (parents visiting)
-- ──────────────────────────────────────────────
CREATE TABLE visitor_logs (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    visitor_name    VARCHAR(255) NOT NULL,
    visitor_phone   VARCHAR(20),
    relation        VARCHAR(50),
    purpose         TEXT,
    check_in_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_out_time  TIMESTAMP,
    approved_by     BIGINT REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN','CHECKED_OUT','REJECTED')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- MESS FEEDBACK
-- ──────────────────────────────────────────────
CREATE TABLE mess_feedback (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id),
    meal_type   VARCHAR(20) CHECK (meal_type IN ('BREAKFAST','LUNCH','SNACKS','DINNER')),
    rating      INT CHECK (rating BETWEEN 1 AND 5),
    feedback    TEXT,
    date        DATE DEFAULT CURRENT_DATE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- MESS SCHEDULE
-- ──────────────────────────────────────────────
CREATE TABLE mess_schedule (
    id          BIGSERIAL PRIMARY KEY,
    hostel_id   BIGINT REFERENCES hostels(id),
    day_of_week VARCHAR(15) NOT NULL,
    meal_type   VARCHAR(20) CHECK (meal_type IN ('BREAKFAST','LUNCH','SNACKS','DINNER')),
    menu        TEXT,
    timing      VARCHAR(50)
);

-- ──────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    type        VARCHAR(30) DEFAULT 'INFO' CHECK (type IN ('INFO','WARNING','ALERT','SUCCESS')),
    is_read     BOOLEAN DEFAULT FALSE,
    ref_type    VARCHAR(50),
    ref_id      BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- ANALYTICS SNAPSHOTS
-- ──────────────────────────────────────────────
CREATE TABLE analytics (
    id                  BIGSERIAL PRIMARY KEY,
    hostel_id           BIGINT REFERENCES hostels(id),
    snapshot_date       DATE DEFAULT CURRENT_DATE,
    total_students      INT DEFAULT 0,
    total_rooms         INT DEFAULT 0,
    occupied_rooms      INT DEFAULT 0,
    open_complaints     INT DEFAULT 0,
    resolved_complaints INT DEFAULT 0,
    pending_leaves      INT DEFAULT 0,
    approved_leaves     INT DEFAULT 0,
    mess_avg_rating     FLOAT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────
-- AUDIT LOGS
-- ──────────────────────────────────────────────
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id),
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
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_leave_student ON leave_requests(student_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_room_assignments_active ON room_assignments(student_id, is_active);
CREATE INDEX idx_gate_pass_code ON gate_pass(pass_code);
CREATE INDEX idx_visitor_student ON visitor_logs(student_id);
