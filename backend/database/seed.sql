INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Admin User', 'admin@example.com', '+919999999999', '$2a$12$7QJ8iSI6nQ1ZJWRt9F8pUuSCDskKhODhb/yy/RRX6YqnZnfvD4nI6', 'admin'),
('Demo Customer', 'customer@example.com', '+918888888888', '$2a$12$7QJ8iSI6nQ1ZJWRt9F8pUuSCDskKhODhb/yy/RRX6YqnZnfvD4nI6', 'customer');

INSERT INTO categories (category_name) VALUES
('Electronics'), ('Fashion'), ('Home'), ('Beauty'), ('Sports');

INSERT INTO products (name, description, specifications, price, discount_percent, stock, image, images, category_id, is_featured, is_best_seller) VALUES
('Nova X1 Wireless Headphones', 'Active noise cancelling headphones with 40 hour battery life.', JSON_OBJECT('battery','40 hours','connectivity','Bluetooth 5.3','warranty','1 year'), 4999, 12, 42, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900'), 1, true, true),
('AeroFit Smart Watch', 'Fitness watch with AMOLED display, SpO2, GPS, and UPI-ready NFC.', JSON_OBJECT('display','AMOLED','water_resistance','5 ATM','gps','Built-in'), 6999, 10, 35, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900'), 1, true, false),
('Everyday Cotton Hoodie', 'Soft mid-weight hoodie for travel, lounging, and daily wear.', JSON_OBJECT('fabric','Cotton blend','fit','Regular','care','Machine wash'), 1799, 15, 80, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900'), 2, false, true),
('Ceramic Dinner Set', 'Six place matte ceramic dinner set with microwave safe finish.', JSON_OBJECT('pieces','24','material','Ceramic','finish','Matte'), 3499, 8, 25, 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=900'), 3, true, false),
('GlowCare Vitamin C Serum', 'Lightweight serum for brighter, even-looking skin.', JSON_OBJECT('volume','30ml','skin_type','All','paraben_free','Yes'), 899, 5, 120, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900'), 4, false, true),
('StridePro Running Shoes', 'Responsive road running shoes with breathable knit upper.', JSON_OBJECT('drop','8mm','upper','Knit','use','Road running'), 4299, 18, 50, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'), 5, true, true),
('LumaLite Desk Lamp', 'Adjustable LED desk lamp for focused work and reading.', JSON_OBJECT('brightness','800 lumens','power','10W'), 1599, 10, 28, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900'), 3, true, false),
('AeroPack Travel Backpack', 'Lightweight travel backpack with laptop sleeve and water resistance.', JSON_OBJECT('capacity','25L','material','Polyester'), 2499, 12, 33, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'), 2, true, false),
('PureGlow Face Roller', 'Facial roller for a calming skincare routine.', JSON_OBJECT('type','Stone','use','Face'), 799, 8, 60, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900'), 4, false, true),
('FlexiMesh Gym Bag', 'Durable gym bag with separate shoe pocket and water bottle holder.', JSON_OBJECT('capacity','35L','compartments','3'), 1899, 14, 22, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900'), 5, true, false),
('Nova Mini Bluetooth Speaker', 'Portable speaker with deep bass and 12-hour battery life.', JSON_OBJECT('battery','12 hours','connectivity','Bluetooth 5.0'), 2299, 9, 40, 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=900'), 1, false, true),
('CloudSoft Throw Blanket', 'Ultra-soft throw blanket for cozy evenings and travel.', JSON_OBJECT('fabric','Fleece','size','150x200'), 1299, 10, 55, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900'), 3, true, false),
('FitLite Resistance Bands', 'Compact resistance bands for home workouts and travel.', JSON_OBJECT('set','5 bands','material','Latex'), 999, 7, 70, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900'), 5, false, true),
('Velora Makeup Organizer', 'Elegant organizer for cosmetics, brushes, and daily essentials.', JSON_OBJECT('compartments','6','material','ABS'), 1499, 11, 26, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900', JSON_ARRAY('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900'), 4, true, false);

INSERT INTO user_addresses (user_id, label, line1, line2, city, state, postal_code) VALUES
(2, 'Home', '221 Market Street', '', 'Bengaluru', 'Karnataka', '560001');

INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Excellent audio and comfortable fit.'),
(2, 3, 4, 'Very soft and true to size.'),
(2, 6, 5, 'Good cushioning for daily runs.');

INSERT INTO coupons (code, discount_percent, active, expires_at) VALUES
('WELCOME10', 10, true, DATE_ADD(NOW(), INTERVAL 90 DAY)),
('FESTIVE15', 15, true, DATE_ADD(NOW(), INTERVAL 30 DAY));
