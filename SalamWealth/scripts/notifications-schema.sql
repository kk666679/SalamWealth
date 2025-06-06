-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL, -- success, warning, info, payment, investment, zakat
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Insert sample notifications for demo
INSERT INTO notifications (user_id, type, title, message, action_url, read) VALUES
  ((SELECT id FROM users LIMIT 1), 'success', 'Welcome to SalamWealth!', 'Your account has been successfully created. Start exploring our Shariah-compliant financial services.', '/dashboard', false),
  ((SELECT id FROM users LIMIT 1), 'payment', 'Payment Reminder', 'Your financing payment of RM1,250 is due on 15th January 2024.', '/financing/payments', false),
  ((SELECT id FROM users LIMIT 1), 'investment', 'ASB Dividend Declared', 'ASB has declared a dividend of 5.5% for 2023. Your dividend will be automatically reinvested.', '/investment/asb', true),
  ((SELECT id FROM users LIMIT 1), 'zakat', 'Zakat Calculation Ready', 'Your annual zakat calculation is ready. Amount due: RM1,130.', '/calculator/zakat', false);
