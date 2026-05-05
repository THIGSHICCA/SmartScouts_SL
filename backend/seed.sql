-- seed.sql: Complete 2022 Sri Lanka Scout Progression Data

-- 1. Insert Badges
INSERT INTO badges (name, description, total_requirements) VALUES
('Scout Membership Badge', 'Fundamental scouting skills, promise, and law.', 14),
('Scout Award', 'Second stage focusing on community, national symbols, and outdoor skills.', 24),
('Chief Commissioner''s Award', 'Advanced proficiency in scouting skills and district-level projects.', 24),
('Prime Minister''s Scout Award', 'High-level adventure and technical skills leading to the Bushman''s Thong.', 22),
('President''s Scout Award', 'The pinnacle of Scouting in Sri Lanka. Focuses on leadership and national service.', 13);

-- 2. Scout Membership Badge (14 Requirements)
INSERT INTO badge_requirements (badge_id, requirement_text, order_number) VALUES
(1, 'Recite and understand the Scout Promise and Law', 1),
(1, 'Sing the National Anthem alone and know its history', 2),
(1, 'Demonstrate Scout Sign, Salute, and Left-hand shake', 3),
(1, 'Know the life history of the Founder, Lord Baden Powell', 4),
(1, 'Understand and act upon Whistle and Hand signals', 5),
(1, 'Tie and explain uses of Reef Knot, Sheet Bend, Clove Hitch, Sheep Shank, and Bowline', 6),
(1, 'Demonstrate Smartness and Good Order (Attention, At Ease, Turns)', 7),
(1, 'Start maintaining a personal Scout Log Book', 8),
(1, 'Demonstrate simple health habits and personal hygiene', 9),
(1, 'Safe from Harm: Know parent contacts and emergency procedures', 10),
(1, 'Open and maintain a personal Savings Account (Thrift)', 11),
(1, 'Perform a "Good Deed" every day', 12),
(1, 'First Aid: Clean and dress a simple wound', 13),
(1, 'Conduct a 500m Treasure Hunt using Wood Craft signs', 14);

-- 3. Scout Award (24 Requirements)
INSERT INTO badge_requirements (badge_id, requirement_text, order_number) VALUES
(2, 'Brief history of the Scout Movement in Sri Lanka', 1),
(2, 'Understand symbols and meaning of the National Flag', 2),
(2, 'Apply health guidelines for epidemics/pandemics', 3),
(2, 'Demonstrate correct posture for standing, walking, and sitting', 4),
(2, 'Understand bad effects of smoking and substance abuse', 5),
(2, 'Prepare for and participate in a Flag Hoisting ceremony', 6),
(2, 'Know the area within a 0.5km radius of home', 7),
(2, 'Participate in two outdoor activities (Nature ramble/Hike)', 8),
(2, 'Understand organic fertilizer and plant/protect a tree', 9),
(2, 'Safe from Harm: Help a younger scout contact parents', 10),
(2, 'Master Knots: Fisherman’s, Man harness, Timber hitch, and Square lashing', 11),
(2, 'Pioneering: Make a Trestle and Portable flag mast', 12),
(2, 'Compass: Show 16 directions and read map conventional signs', 13),
(2, 'Perform the 6 B.P. Exercises daily', 14),
(2, 'Sense Training: Complete Kim’s Game (Vision/Smell/Touch)', 15),
(2, 'Identify 15 common useful trees and their locations', 16),
(2, 'March 50 meters correctly with the Patrol', 17),
(2, 'IT Literacy: Basic knowledge of input/output devices', 18),
(2, 'IT Literacy: Knowledge about basic storage methods', 19),
(2, 'Link Language: Learn alphabet and 15 words in two other languages', 20),
(2, 'First Aid: Explain D.R.S.A.B.C and Recovery Position', 21),
(2, 'Good Habits: 1-hour Community Service project with Patrol', 22),
(2, 'Complete two nights of camping in a tent', 23),
(2, 'Complete a One Day Hike of 12km', 24);

-- 4. Chief Commissioner''s Award (24 Requirements)
INSERT INTO badge_requirements (badge_id, requirement_text, order_number) VALUES
(3, 'Continue maintaining a savings account (Thrift level 2)', 1),
(3, 'Demonstrate proficiency in one Art or Hobby (Singing/Drawing/Acting)', 2),
(3, 'Master Knots: Fireman’s Chair, Rolling Hitch, and Sail maker’s whipping', 3),
(3, 'Maintain and safely use LP gas cookers and different fire places', 4),
(3, 'Pioneering Project: Build camp gateways or utility gadgets', 5),
(3, 'Identify human/animal tracks and make a plaster cast', 6),
(3, 'Compass & Mapping: Create a rough map to scale with GPS', 7),
(3, 'Estimation of Heights, Lengths, and Weights using multiple methods', 8),
(3, 'Safely use and maintain Hand axe, saw, and knife', 9),
(3, 'Observe and collect data on 10 common birds', 10),
(3, 'Swim 50 meters or earn an alternate proficiency badge', 11),
(3, 'March 100 meters correctly while saluting (Eyes Right)', 12),
(3, 'Plan a Patrol activity for social health awareness', 13),
(3, 'Know the Highway Code and motor traffic rules', 14),
(3, 'IT Literacy: Word processing, spreadsheets, and internet safety', 15),
(3, 'Draw a sketch map of area within 1km radius of home', 16),
(3, 'Explain the Vision and Mission of SLSA and WOSM', 17),
(3, 'First Aid: Handle shock, fainting, burns, and use of AED', 18),
(3, 'Safe from Harm: Handle school and home emergency situations', 19),
(3, 'Environment: Understand and apply the 10R method', 20),
(3, 'Link Language: Construct 20 simple sentences in other languages', 21),
(3, 'Complete a week-end camp of at least two nights', 22),
(3, 'Complete the District Commissioner’s Hike (One Night and 22km)', 23),
(3, 'Understand requirements for Sea/Air scouts (Phonetic Alphabet)', 24);

-- 5. Prime Minister''s Scout Award (22 Requirements)
INSERT INTO badge_requirements (badge_id, requirement_text, order_number) VALUES
(4, 'Teach the Scout Promise and Law to a new recruit', 1),
(4, 'Know the structure of WOSM and its 6 regions', 2),
(4, 'Maintain Savings Account and increase regular savings (Thrift 3)', 3),
(4, 'Write an essay on Protection of Public Property', 4),
(4, 'Demonstrate progress in a selected Art or Hobby', 5),
(4, 'Perform Backwoodsman Cooking with the Patrol', 6),
(4, 'Demonstrate Back, Eye, and Short Splicing of ropes', 7),
(4, 'Master Pioneering: Handybilly, pulley systems, and hold-fasts', 8),
(4, 'Pitch, clean, and pack a wall tent properly', 9),
(4, 'Smartness: March 100m while saluting and carrying staff', 10),
(4, 'Prepare a balanced meal for a scout-aged person', 11),
(4, 'Understand Productivity concepts (5S and Quality Circles)', 12),
(4, 'IT Literacy: Create and use a personal email address', 13),
(4, 'Perform a 2-minute self-introduction in 3 languages', 14),
(4, 'Mapping: Forward bearings and Triangulation', 15),
(4, 'Repair and maintain complex camping equipment', 16),
(4, 'Complete Adventure Skills (Tarzan Jump, Rope/Tree climb)', 17),
(4, 'Understand and apply basic Time Management concepts', 18),
(4, 'Safe from Harm: Help lost children and know child helplines', 19),
(4, 'Complete four nights of camping (staggered or stretch)', 20),
(4, 'Complete a 6-hour Community Service Project', 21),
(4, 'Make your own Bushman’s Thong in presence of ADC', 22);

-- 6. President''s Scout Award (13 Requirements)
INSERT INTO badge_requirements (badge_id, requirement_text, order_number) VALUES
(5, 'Present a drama or challenge based on the Scout Promise or Law', 1),
(5, 'Maintain a detailed Log Book for at least 2 years and 6 months', 2),
(5, 'Create an original artistic or literary work', 3),
(5, 'Train a Scout or Patrol for requirements of Scout/Chief Commissioner Awards', 4),
(5, 'Take leadership in organizing and conducting a pioneering project', 5),
(5, 'Leadership in Emergencies: Handle an accident or natural disaster', 6),
(5, 'Train a Scout about health habits for Membership Badge', 7),
(5, 'IT Literacy: Prepare and present a 5-minute PowerPoint', 8),
(5, 'Give a 3-minute speech in a Link Language', 9),
(5, 'Safe from Harm: Rules for risk assessment and bullying prevention', 10),
(5, 'Organize a short hike (max 1km) with skills and challenges', 11),
(5, 'Organize a Community Service Project (72 man-hours)', 12),
(5, 'Complete four nights of camping after Bushman’s Thong', 13);

-- 7. Initial Users
INSERT INTO users (name, email, password_hash, role) VALUES
('Alex Scout', 'alex@example.com', 'pbkdf2:sha256:...', 'scout'),
('John Leader', 'john@example.com', 'pbkdf2:sha256:...', 'leader');
