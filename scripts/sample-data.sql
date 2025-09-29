-- Insert sample users
INSERT INTO users (id, mykad_id, full_name, email, phone, address, bumiputera_status, password_hash)
VALUES
  ('11111111-1111-1111-1111-111111111111', '901010101010', 'Ahmad bin Abdullah', 'ahmad@example.com', '+60123456789', 'Jalan Bukit Bintang, Kuala Lumpur', TRUE, '$2a$12$K8GpVzD.W/XpJnFnk2xYz.r5hPRYbcVvYrOUVGWIiVwY6jQOGjzaO'),
  ('22222222-2222-2222-2222-222222222222', '920202020202', 'Siti binti Rahman', 'siti@example.com', '+60198765432', 'Jalan Ampang, Kuala Lumpur', TRUE, '$2a$12$K8GpVzD.W/XpJnFnk2xYz.r5hPRYbcVvYrOUVGWIiVwY6jQOGjzaO'),
  ('33333333-3333-3333-3333-333333333333', '930303030303', 'Raj Kumar', 'raj@example.com', '+60123123123', 'Jalan Masjid India, Kuala Lumpur', FALSE, '$2a$12$K8GpVzD.W/XpJnFnk2xYz.r5hPRYbcVvYrOUVGWIiVwY6jQOGjzaO'),
  ('44444444-4444-4444-4444-444444444444', '940404040404', 'Mei Ling Tan', 'mei@example.com', '+60145454545', 'Jalan Petaling, Kuala Lumpur', FALSE, '$2a$12$K8GpVzD.W/XpJnFnk2xYz.r5hPRYbcVvYrOUVGWIiVwY6jQOGjzaO'),
  ('55555555-5555-5555-5555-555555555555', '950505050505', 'Mohammed bin Ismail', 'mohammed@example.com', '+60167676767', 'Jalan Tun Razak, Kuala Lumpur', TRUE, '$2a$12$K8GpVzD.W/XpJnFnk2xYz.r5hPRYbcVvYrOUVGWIiVwY6jQOGjzaO');

-- Insert sample financing applications
INSERT INTO financing_applications (user_id, financing_type, amount, term_months, profit_rate, purpose, status, monthly_payment, takaful_included, shariah_contract_type)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'personal', 50000.00, 60, 3.5, 'Home renovation', 'approved', 916.67, TRUE, 'bai_al_inah'),
  ('22222222-2222-2222-2222-222222222222', 'education', 30000.00, 48, 2.5, 'Masters degree', 'pending', 677.08, TRUE, 'qardh_hasan'),
  ('33333333-3333-3333-3333-333333333333', 'sme', 100000.00, 84, 4.0, 'Business expansion', 'approved', 1428.57, TRUE, 'ijarah'),
  ('44444444-4444-4444-4444-444444444444', 'personal', 20000.00, 36, 3.8, 'Wedding expenses', 'rejected', 601.85, FALSE, 'bai_al_inah'),
  ('55555555-5555-5555-5555-555555555555', 'sme', 75000.00, 60, 3.9, 'Equipment purchase', 'disbursed', 1362.50, TRUE, 'ijarah');

-- Insert sample investment accounts
INSERT INTO investment_accounts (user_id, investment_type, amount, current_value, profit_rate, halal_certified, risk_rating)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'asb', 10000.00, 10650.00, 6.5, TRUE, 2),
  ('11111111-1111-1111-1111-111111111111', 'sukuk', 25000.00, 26125.00, 4.5, TRUE, 3),
  ('22222222-2222-2222-2222-222222222222', 'gold', 15000.00, 16200.00, 8.0, TRUE, 4),
  ('33333333-3333-3333-3333-333333333333', 'robo_advisory', 50000.00, 53500.00, 7.0, TRUE, 4),
  ('44444444-4444-4444-4444-444444444444', 'sukuk', 30000.00, 31200.00, 4.0, TRUE, 3),
  ('55555555-5555-5555-5555-555555555555', 'asb', 20000.00, 21300.00, 6.5, TRUE, 2);

-- Insert sample transactions
INSERT INTO transactions (user_id, transaction_type, amount, description, reference_id, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'deposit', 5000.00, 'Initial deposit', 'DEP12345', 'completed'),
  ('11111111-1111-1111-1111-111111111111', 'investment', 10000.00, 'ASB investment', 'INV12345', 'completed'),
  ('22222222-2222-2222-2222-222222222222', 'deposit', 10000.00, 'Initial deposit', 'DEP23456', 'completed'),
  ('22222222-2222-2222-2222-222222222222', 'withdrawal', 2000.00, 'Emergency withdrawal', 'WIT12345', 'completed'),
  ('33333333-3333-3333-3333-333333333333', 'payment', 1428.57, 'Financing payment', 'PAY12345', 'completed'),
  ('44444444-4444-4444-4444-444444444444', 'zakat', 1250.00, 'Annual zakat payment', 'ZAK12345', 'completed'),
  ('55555555-5555-5555-5555-555555555555', 'deposit', 15000.00, 'Business capital', 'DEP34567', 'completed');

-- Insert sample zakat calculations
INSERT INTO zakat_calculations (user_id, cash, savings, investments, gold, debts, total_wealth, zakat_amount, payment_status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 10000.00, 25000.00, 35650.00, 5000.00, 15000.00, 60650.00, 1516.25, 'paid'),
  ('22222222-2222-2222-2222-222222222222', 5000.00, 15000.00, 16200.00, 10000.00, 5000.00, 41200.00, 1030.00, 'unpaid'),
  ('55555555-5555-5555-5555-555555555555', 20000.00, 30000.00, 21300.00, 0.00, 10000.00, 61300.00, 1532.50, 'paid');

-- Insert sample EPF integration data
INSERT INTO epf_integration (user_id, epf_number, account_1_balance, account_2_balance)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'EPF12345678', 120000.00, 30000.00),
  ('22222222-2222-2222-2222-222222222222', 'EPF23456789', 85000.00, 25000.00),
  ('33333333-3333-3333-3333-333333333333', 'EPF34567890', 150000.00, 40000.00);

-- Insert sample mosque data
INSERT INTO mosque_data (name, address, latitude, longitude, prayer_times)
VALUES
  ('Masjid Negara', 'Jalan Perdana, 50480 Kuala Lumpur', 3.1425, 101.6865, '{"fajr": "5:45", "dhuhr": "13:15", "asr": "16:30", "maghrib": "19:20", "isha": "20:35"}'),
  ('Masjid Jamek', 'Jalan Tun Perak, 50050 Kuala Lumpur', 3.1497, 101.6958, '{"fajr": "5:46", "dhuhr": "13:15", "asr": "16:30", "maghrib": "19:20", "isha": "20:35"}'),
  ('Masjid Wilayah Persekutuan', 'Jalan Duta, 50480 Kuala Lumpur', 3.1708, 101.6775, '{"fajr": "5:45", "dhuhr": "13:15", "asr": "16:30", "maghrib": "19:20", "isha": "20:35"}');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, read, action_url)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Financing Approved', 'Your personal financing application has been approved!', 'financing', FALSE, '/dashboard/financing'),
  ('11111111-1111-1111-1111-111111111111', 'ASB Dividend', 'ASB has announced a 5.5% dividend for this year', 'investment', TRUE, '/dashboard/investments'),
  ('22222222-2222-2222-2222-222222222222', 'Application Update', 'Your education financing is under review', 'financing', FALSE, '/dashboard/financing'),
  ('33333333-3333-3333-3333-333333333333', 'Payment Due', 'Your monthly financing payment is due in 3 days', 'financing', FALSE, '/dashboard/payments'),
  ('44444444-4444-4444-4444-444444444444', 'Zakat Reminder', 'It\'s time to calculate your annual zakat', 'zakat', FALSE, '/zakat-calculator'),
  ('55555555-5555-5555-5555-555555555555', 'Prayer Time', 'Maghrib prayer time in 15 minutes', 'prayer', TRUE, NULL);

-- Insert sample sessions for NextAuth
INSERT INTO sessions (id, user_id, expires, session_token)
VALUES
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', NOW() + INTERVAL '7 days', 'session_token_1'),
  ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '7 days', 'session_token_2');

-- Insert sample accounts for NextAuth
INSERT INTO accounts (id, user_id, provider_type, provider_id, provider_account_id)
VALUES
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'credentials', 'credentials', 'ahmad@example.com'),
  ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'credentials', 'credentials', 'siti@example.com');
