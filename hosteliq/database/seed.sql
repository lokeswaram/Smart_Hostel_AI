-- ============================================================
-- HOSTELIQ – Seed Data Generation Script (PostgreSQL)
-- Generates:
-- 5 Wardens, 20 Rooms, 100 Students (with allocations), 
-- Parents, Invoices, Payments, Complaints, Leave Requests, 
-- Visitors, Analytics, etc.
-- ============================================================

-- Clean existing data
TRUNCATE TABLE audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE analytics RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE electricity_usage RESTART IDENTITY CASCADE;
TRUNCATE TABLE receipts RESTART IDENTITY CASCADE;
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE payments RESTART IDENTITY CASCADE;
TRUNCATE TABLE invoices RESTART IDENTITY CASCADE;
TRUNCATE TABLE visitor_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE gate_pass RESTART IDENTITY CASCADE;
TRUNCATE TABLE leave_requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE complaints RESTART IDENTITY CASCADE;
TRUNCATE TABLE allocations RESTART IDENTITY CASCADE;
TRUNCATE TABLE wardens RESTART IDENTITY CASCADE;
TRUNCATE TABLE parents RESTART IDENTITY CASCADE;
TRUNCATE TABLE students RESTART IDENTITY CASCADE;
TRUNCATE TABLE beds RESTART IDENTITY CASCADE;
TRUNCATE TABLE rooms RESTART IDENTITY CASCADE;
TRUNCATE TABLE blocks RESTART IDENTITY CASCADE;
TRUNCATE TABLE hostels RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Re-populate Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_STUDENT'), 
(2, 'ROLE_PARENT'), 
(3, 'ROLE_WARDEN'), 
(4, 'ROLE_SECURITY'), 
(5, 'ROLE_ADMIN')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ──────────────────────────────────────────────
-- 1. ADMINS AND SECURITIES
-- Plain text passwords:
-- admin@hosteliq.com -> Admin@123 ($2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK)
-- security@hosteliq.com -> Security@123 ($2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK)
-- warden@hosteliq.com -> Warden@123 ($2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK)
-- student@hosteliq.com -> Student@123 ($2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- parent@hosteliq.com -> Parent@123 ($2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- ──────────────────────────────────────────────
INSERT INTO users (id, email, password, full_name, phone) VALUES
(1, 'admin@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.9XSHDpZFslO8n2.KsVP9JJPeR5F5u0y', 'Admin User', '9000000001'),
(2, 'security@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve./dCBBQ2/Go3zDzuJ/5pCz303WH0bbmW', 'Main Gate Security', '9000000002');

INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 5), -- Admin
(2, 4); -- Security

-- ──────────────────────────────────────────────
-- 2. HOSTELS & BLOCKS
-- ──────────────────────────────────────────────
INSERT INTO hostels (id, name, code, type, address) VALUES
(1, 'Vivekananda Boys Hostel', 'VBH', 'BOYS', 'Block A/B/C, MUJ Campus, Jaipur'),
(2, 'Saraswati Girls Hostel', 'SGH', 'GIRLS', 'Block D/E, MUJ Campus, Jaipur');

INSERT INTO blocks (id, hostel_id, name, total_floors) VALUES
(1, 1, 'Block A', 3),
(2, 1, 'Block B', 3),
(3, 2, 'Block G', 3);

-- ──────────────────────────────────────────────
-- 3. 5 WARDENS
-- ──────────────────────────────────────────────
INSERT INTO users (id, email, password, full_name, phone) VALUES
(3, 'warden1@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.W7/QBfOv.WrOS8c.BTz.LUPMxChNOIS', 'Dr. Ramesh Sharma', '9000000011'),
(4, 'warden2@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.W7/QBfOv.WrOS8c.BTz.LUPMxChNOIS', 'Dr. Anil Mehta', '9000000012'),
(5, 'warden3@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.W7/QBfOv.WrOS8c.BTz.LUPMxChNOIS', 'Ms. Kavita Rao', '9000000013'),
(6, 'warden4@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.W7/QBfOv.WrOS8c.BTz.LUPMxChNOIS', 'Ms. Sunita Singh', '9000000014'),
(7, 'warden5@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.W7/QBfOv.WrOS8c.BTz.LUPMxChNOIS', 'Mr. Rajesh Verma', '9000000015');

INSERT INTO user_roles (user_id, role_id) VALUES 
(3, 3), (4, 3), (5, 3), (6, 3), (7, 3);

INSERT INTO wardens (user_id, hostel_id) VALUES
(3, 1), -- Ramesh (VBH)
(4, 1), -- Anil (VBH)
(5, 2), -- Kavita (SGH)
(6, 2), -- Sunita (SGH)
(7, NULL);

-- ──────────────────────────────────────────────
-- 4. 20 ROOMS (and their beds)
-- VBH Block A: 10 Rooms (101 to 110) - Double occupancy = 20 beds
-- VBH Block B: 5 Rooms (201 to 205) - Single occupancy = 5 beds
-- SGH Block G: 5 Rooms (101 to 105) - Double occupancy = 10 beds
-- Total Rooms: 20, Total Beds: 35
-- ──────────────────────────────────────────────
DO $$
DECLARE
    r_id BIGINT;
    b_name VARCHAR;
    b_id BIGINT;
    i INT;
    j INT;
BEGIN
    -- VBH Block A
    b_id := 1;
    FOR i IN 1..10 LOOP
        INSERT INTO rooms (block_id, room_number, floor, room_type, status) 
        VALUES (b_id, 'A-' || (100 + i), 1, 'DOUBLE', 'AVAILABLE') RETURNING id INTO r_id;
        
        INSERT INTO beds (room_id, bed_number, is_occupied) VALUES (r_id, 'Bed-1', FALSE);
        INSERT INTO beds (room_id, bed_number, is_occupied) VALUES (r_id, 'Bed-2', FALSE);
    END LOOP;

    -- VBH Block B
    b_id := 2;
    FOR i IN 1..5 LOOP
        INSERT INTO rooms (block_id, room_number, floor, room_type, status) 
        VALUES (b_id, 'B-' || (200 + i), 2, 'SINGLE', 'AVAILABLE') RETURNING id INTO r_id;
        
        INSERT INTO beds (room_id, bed_number, is_occupied) VALUES (r_id, 'Bed-1', FALSE);
    END LOOP;

    -- SGH Block G
    b_id := 3;
    FOR i IN 1..5 LOOP
        INSERT INTO rooms (block_id, room_number, floor, room_type, status) 
        VALUES (b_id, 'G-' || (100 + i), 1, 'DOUBLE', 'AVAILABLE') RETURNING id INTO r_id;
        
        INSERT INTO beds (room_id, bed_number, is_occupied) VALUES (r_id, 'Bed-1', FALSE);
        INSERT INTO beds (room_id, bed_number, is_occupied) VALUES (r_id, 'Bed-2', FALSE);
    END LOOP;
END $$;

-- ──────────────────────────────────────────────
-- 5. 100 STUDENTS & ALLOCATIONS
-- First student is 'student@hosteliq.com' for demo.
-- Next 99 students are generated.
-- ──────────────────────────────────────────────
-- First student: Arjun Mehta
INSERT INTO users (id, email, password, full_name, phone) VALUES
(8, 'student@hosteliq.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Arjun Mehta', '9000000100');
INSERT INTO user_roles (user_id, role_id) VALUES (8, 1);

INSERT INTO students (id, user_id, enrollment_no, course, year, department, gender, parent_name, parent_phone, parent_email) VALUES
(1, 8, '210101001', 'B.Tech CSE', 3, 'Computer Science', 'MALE', 'Suresh Mehta', '9000000200', 'parent@hosteliq.com');

-- Parent user for Arjun
INSERT INTO users (id, email, password, full_name, phone) VALUES
(9, 'parent@hosteliq.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Suresh Mehta', '9000000200');
INSERT INTO user_roles (user_id, role_id) VALUES (9, 2);

INSERT INTO parents (id, user_id, student_id, relation) VALUES
(1, 9, 1, 'FATHER');

-- Reset sequences to prevent duplicate key errors due to manual ID inserts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('students_id_seq', (SELECT MAX(id) FROM students));
SELECT setval('parents_id_seq', (SELECT MAX(id) FROM parents));
SELECT setval('hostels_id_seq', (SELECT MAX(id) FROM hostels));
SELECT setval('blocks_id_seq', (SELECT MAX(id) FROM blocks));
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

-- Loop to generate another 99 students
DO $$
DECLARE
    u_id BIGINT;
    s_id BIGINT;
    bed_rec RECORD;
    i INT;
    first_names VARCHAR[] := ARRAY['Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Anjali', 'Vikram', 'Divya', 'Sandeep', 'Neha', 'Vijay', 'Pooja', 'Karan', 'Kirti', 'Abhishek', 'Ishita', 'Manoj', 'Ritu', 'Deepak', 'Sonia'];
    last_names VARCHAR[] := ARRAY['Sharma', 'Verma', 'Singh', 'Gupta', 'Kumar', 'Joshi', 'Patel', 'Yadav', 'Mishra', 'Choudhary', 'Rao', 'Reddy', 'Nair', 'Sinha', 'Trivedi', 'Bose', 'Das', 'Sen', 'Gill', 'Kapoor'];
    f_name VARCHAR;
    l_name VARCHAR;
    full_name_val VARCHAR;
    email_val VARCHAR;
    gender_val VARCHAR;
    course_val VARCHAR;
    dept_val VARCHAR;
    parent_email_val VARCHAR;
    phone_val VARCHAR;
BEGIN
    FOR i IN 2..100 LOOP
        -- Select random first and last name
        f_name := first_names[1 + floor(random() * 20)];
        l_name := last_names[1 + floor(random() * 20)];
        full_name_val := f_name || ' ' || l_name;
        email_val := lower(f_name) || '.' || lower(l_name) || i || '@hosteliq.com';
        phone_val := '9' || lpad((floor(random() * 900000000)::bigint + 100000000)::text, 9, '0');
        
        -- Determine gender based on first name list elements or alternating
        IF i % 2 = 0 THEN
            gender_val := 'MALE';
        ELSE
            gender_val := 'FEMALE';
        END IF;

        IF gender_val = 'MALE' THEN
            course_val := (ARRAY['B.Tech CSE', 'B.Tech ME', 'B.Tech ECE', 'BCA', 'BBA'])[1 + floor(random() * 5)];
            dept_val := (ARRAY['Computer Science', 'Mechanical Engineering', 'Electronics', 'Computer Applications', 'Business Administration'])[1 + floor(random() * 5)];
        ELSE
            course_val := (ARRAY['B.Tech CSE', 'B.Tech IT', 'BCA', 'B.Arch', 'BBA'])[1 + floor(random() * 5)];
            dept_val := (ARRAY['Computer Science', 'Information Technology', 'Computer Applications', 'Architecture', 'Business Administration'])[1 + floor(random() * 5)];
        END IF;

        parent_email_val := 'parent.' || lower(f_name) || i || '@gmail.com';

        -- Insert User
        INSERT INTO users (email, password, full_name, phone) 
        VALUES (email_val, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', full_name_val, phone_val)
        RETURNING id INTO u_id;

        -- Assign Role Student
        INSERT INTO user_roles (user_id, role_id) VALUES (u_id, 1);

        -- Insert Student
        INSERT INTO students (user_id, enrollment_no, course, year, department, gender, parent_name, parent_phone, parent_email, address)
        VALUES (u_id, '2101' || lpad(i::text, 5, '0'), course_val, 1 + floor(random() * 4), dept_val, gender_val, 
                'Mr. ' || l_name, '9' || lpad((floor(random() * 900000000)::bigint + 100000000)::text, 9, '0'), parent_email_val, 'MUJ Campus, Jaipur')
        RETURNING id INTO s_id;
    END LOOP;
END $$;

-- Allocate students to beds (total beds available: 35, let's assign allocations to students 1 to 30)
DO $$
DECLARE
    student_rec RECORD;
    bed_rec RECORD;
    count INT := 0;
BEGIN
    FOR bed_rec IN SELECT b.id, r.room_type, r.id as room_id FROM beds b JOIN rooms r ON b.room_id = r.id WHERE b.is_occupied = FALSE ORDER BY b.id LOOP
        SELECT s.id INTO student_rec FROM students s 
        LEFT JOIN allocations a ON s.id = a.student_id AND a.is_active = TRUE
        WHERE a.id IS NULL
        ORDER BY s.id ASC
        LIMIT 1;

        IF student_rec.id IS NOT NULL THEN
            -- Allocate
            INSERT INTO allocations (student_id, bed_id, is_active) VALUES (student_rec.id, bed_rec.id, TRUE);
            UPDATE beds SET is_occupied = TRUE WHERE id = bed_rec.id;
            
            count := count + 1;
        END IF;
    END LOOP;

    -- Update room occupancy and status
    UPDATE rooms r
    SET status = CASE 
        WHEN (SELECT COUNT(*) FROM beds b WHERE b.room_id = r.id AND b.is_occupied = TRUE) = (SELECT COUNT(*) FROM beds b WHERE b.room_id = r.id) THEN 'FULL'
        ELSE 'AVAILABLE'
    END;
END $$;

-- ──────────────────────────────────────────────
-- 6. COMPLAINTS (AI insights target)
-- ──────────────────────────────────────────────
INSERT INTO complaints (student_id, room_id, title, description, category, priority, status, ai_category, ai_priority, ai_eta_hours, ai_confidence, created_at)
VALUES 
(1, 1, 'Water heater in Block A bathroom not working', 'The geyser/water heater on floor 1 of block A has been cold for two days now.', 'WATER', 'HIGH', 'IN_PROGRESS', 'WATER', 'HIGH', 12, 0.96, NOW() - INTERVAL '3 days'),
(2, 2, 'Fan makes rattling noise', 'Ceiling fan is spinning very slow and makes loud click sounds.', 'ELECTRICAL', 'MEDIUM', 'OPEN', 'ELECTRICAL', 'MEDIUM', 24, 0.92, NOW() - INTERVAL '1 day'),
(3, 3, 'Mess food is completely uncooked', 'The chole served in today lunch was completely raw, and we had to skip lunch.', 'MESS', 'HIGH', 'OPEN', 'MESS', 'HIGH', 4, 0.94, NOW()),
(4, 4, 'Broke study chair leg', 'The study table chair in my room is missing a screw and one leg is loose.', 'FURNITURE', 'LOW', 'RESOLVED', 'FURNITURE', 'LOW', 48, 0.95, NOW() - INTERVAL '5 days'),
(5, 5, 'WiFi login page not loading', 'Cannot connect to MUJ-Secure network. The portal authentication screen fails to open.', 'OTHER', 'MEDIUM', 'ASSIGNED', 'OTHER', 'MEDIUM', 8, 0.89, NOW() - INTERVAL '12 hours');

-- Add dynamic extra complaints for analytical reporting
DO $$
DECLARE
    i INT;
    s_id BIGINT;
    r_id BIGINT;
    cat VARCHAR;
    prio VARCHAR;
    status_val VARCHAR;
BEGIN
    FOR i IN 1..30 LOOP
        SELECT s.id, (SELECT a.bed_id FROM allocations a WHERE a.student_id = s.id AND a.is_active = TRUE) as b_id INTO s_id, r_id 
        FROM students s 
        OFFSET (floor(random() * 30)) LIMIT 1;
        
        -- Resolve room_id
        SELECT room_id INTO r_id FROM beds WHERE id = r_id;

        cat := (ARRAY['ELECTRICAL', 'WATER', 'MESS', 'CLEANING', 'FURNITURE', 'OTHER'])[1 + floor(random() * 6)];
        prio := (ARRAY['LOW', 'MEDIUM', 'HIGH', 'URGENT'])[1 + floor(random() * 4)];
        status_val := (ARRAY['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])[1 + floor(random() * 5)];

        INSERT INTO complaints (student_id, room_id, title, description, category, priority, status, ai_category, ai_priority, ai_eta_hours, ai_confidence)
        VALUES (s_id, r_id, 'Complaint about ' || lower(cat) || ' issue #' || i, 'Detailed description of a recurring ' || lower(cat) || ' failure in the floor block.', cat, prio, status_val, cat, prio, 12, 0.90);
    END LOOP;
END $$;

-- ──────────────────────────────────────────────
-- 7. LEAVE REQUESTS & GATE PASS
-- ──────────────────────────────────────────────
INSERT INTO leave_requests (id, student_id, reason, leave_from, leave_to, destination, contact_during_leave, status) VALUES
(1, 1, 'End of term vacation', CURRENT_DATE + 5, CURRENT_DATE + 15, 'Delhi, India', '9000000100', 'APPROVED'),
(2, 2, 'Medical emergency at home', CURRENT_DATE - 2, CURRENT_DATE + 3, 'Mumbai, Maharashtra', '9888888888', 'APPROVED'),
(3, 3, 'Weekend outing to local mall', CURRENT_DATE + 1, CURRENT_DATE + 1, 'Jaipur City Mall', '9777777777', 'PENDING');

-- Reset leave_requests sequence after manual inserts
SELECT setval('leave_requests_id_seq', (SELECT MAX(id) FROM leave_requests));

INSERT INTO gate_pass (leave_request_id, student_id, pass_code, qr_data, valid_from, valid_until, status) VALUES
(1, 1, 'GP-VBH-CSE-001', 'https://hosteliq.com/verify/GP-VBH-CSE-001', CURRENT_DATE + 5, CURRENT_DATE + 15, 'ACTIVE'),
(2, 2, 'GP-VBH-ME-002', 'https://hosteliq.com/verify/GP-VBH-ME-002', CURRENT_DATE - 2, CURRENT_DATE + 3, 'USED');

-- ──────────────────────────────────────────────
-- 8. VISITOR LOGS
-- ──────────────────────────────────────────────
INSERT INTO visitor_logs (student_id, visitor_name, visitor_phone, relation, purpose, check_in_time, check_out_time, status) VALUES
(1, 'Suresh Mehta', '9000000200', 'FATHER', 'Delivering books and clothes', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour', 'CHECKED_OUT'),
(2, 'Anita Singh', '9000000777', 'MOTHER', 'Weekend meet and check room', NOW() - INTERVAL '30 minutes', NULL, 'CHECKED_IN');

-- ──────────────────────────────────────────────
-- 9. INVOICES, PAYMENTS, TRANSACTIONS
-- Generate active invoices for term fee & electricity
-- ──────────────────────────────────────────────
DO $$
DECLARE
    student_rec RECORD;
    inv_id BIGINT;
    pay_id BIGINT;
    amount DECIMAL;
    status_val VARCHAR;
BEGIN
    FOR student_rec IN SELECT id, user_id FROM students LOOP
        -- Generate term fee invoice for every student
        amount := (ARRAY[45000.00, 60000.00, 80000.00])[1 + (student_rec.id % 3)];
        status_val := (ARRAY['PENDING', 'PAID', 'OVERDUE'])[1 + (student_rec.id % 3)];

        INSERT INTO invoices (student_id, title, amount, due_date, status)
        VALUES (student_rec.id, 'Hostel Term Fee - Autumn 2026', amount, CURRENT_DATE + 30, status_val)
        RETURNING id INTO inv_id;

        IF status_val = 'PAID' THEN
            -- Add payment
            INSERT INTO payments (invoice_id, student_id, amount, payment_method, transaction_ref, status)
            VALUES (inv_id, student_rec.id, amount, 'UPI', 'TXN-' || student_rec.id || '-' || (1000 + inv_id), 'SUCCESS')
            RETURNING id INTO pay_id;

            -- Add Transaction
            INSERT INTO transactions (payment_id, amount, type, description)
            VALUES (pay_id, amount, 'CREDIT', 'Term Fee Payment for invoice #' || inv_id);

            -- Add Receipt
            INSERT INTO receipts (payment_id, receipt_number, pdf_url)
            VALUES (pay_id, 'REC-2026-' || (10000 + pay_id), 'https://hosteliq.com/receipts/REC-' || pay_id || '.pdf');
        END IF;

        -- Generate monthly electricity bill
        IF student_rec.id % 5 = 0 THEN
            INSERT INTO invoices (student_id, title, amount, due_date, status)
            VALUES (student_rec.id, 'Electricity Bill - May 2026', 1200.00, CURRENT_DATE - 5, 'OVERDUE');
        END IF;
    END LOOP;
END $$;

-- ──────────────────────────────────────────────
-- 10. ANALYTICS SNAPSHOTS (historical data for graphs)
-- ──────────────────────────────────────────────
INSERT INTO analytics (hostel_id, snapshot_date, total_students, total_rooms, occupied_rooms, open_complaints, resolved_complaints, revenue_collected, pending_revenue)
VALUES
(1, CURRENT_DATE - INTERVAL '30 days', 30, 20, 15, 5, 12, 1200000.00, 150000.00),
(1, CURRENT_DATE - INTERVAL '15 days', 30, 20, 15, 8, 20, 1500000.00, 100000.00),
(1, CURRENT_DATE, 30, 20, 15, 3, 35, 1750000.00, 80000.00);

-- Electricity Usage Mock
INSERT INTO electricity_usage (room_id, month, year, units_consumed, bill_amount, is_billed)
VALUES
(1, 'May', 2026, 120.5, 1205.00, TRUE),
(2, 'May', 2026, 95.0, 950.00, TRUE),
(3, 'May', 2026, 150.2, 1502.00, TRUE);

-- Notifications Mock
INSERT INTO notifications (user_id, title, message, type)
VALUES
(8, 'Room Allocated', 'Welcome to Hosteliq! You have been allocated bed Bed-1 in Room A-101.', 'SUCCESS'),
(8, 'Invoice Generated', 'Your Hostel Term Fee invoice for Autumn 2026 has been generated.', 'INFO'),
(9, 'Leave Approved', 'Arjun Mehta leave request from Delhi has been approved by Warden Dr. Ramesh Sharma.', 'SUCCESS');
