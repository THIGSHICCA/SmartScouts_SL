-- -- =============================================================
-- -- SmartScouts SL — seed_badges.sql
-- -- Complete Sri Lanka Scout Syllabus 2022
-- -- Source: Scout's Progress Record Book (Tamil/English)
-- -- =============================================================

-- -- =============================================================
-- -- TROOP
-- -- =============================================================
-- INSERT INTO troops (id, name, district) VALUES
-- (1, 'Demo Scout Group', 'Colombo');

-- -- =============================================================
-- -- BADGES  (5 award levels)
-- -- =============================================================
-- INSERT INTO badges (id, name, description, level_order, min_training_months, total_requirements) VALUES
-- (1, 'Scout Membership Badge',       'Foundational scouting skills — promise, law, safety, and basic skills.',                               1, 3,  14),
-- (2, 'Scout Award',                  'Second stage covering national identity, outdoor activities, and community.',                          2, 6,  24),
-- (3, 'Chief Commissioner''s Award',  'Advanced skills in pioneering, mapping, health, environment, and district hiking.',                   3, 9,  24),
-- (4, 'Prime Minister''s Scout Award','High-level adventure, leadership, and technical skills leading to Bushman''s Thong.',                 4, 9,  22),
-- (5, 'President''s Scout Award',     'The pinnacle of Sri Lanka Scouting — leadership, service, and community projects.',                   5, 9,  13);

-- -- =============================================================
-- -- BADGE 1 — SCOUT MEMBERSHIP BADGE
-- -- =============================================================

-- -- Top-level requirements
-- INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, order_number) VALUES
-- (1,  1, NULL, 'Scout Promise and Scout Law',                                                    1),
-- (2,  1, NULL, 'National Anthem',                                                                2),
-- (3,  1, NULL, 'Scout Sign and Methods of Saluting',                                             3),
-- (4,  1, NULL, 'Founder of the Scout Movement',                                                  4),
-- (5,  1, NULL, 'Scout Whistle and Hand Signals',                                                 5),
-- (6,  1, NULL, 'Knots and Whipping 1',                                                           6),
-- (7,  1, NULL, 'Smartness and Good Order 1',                                                     7),
-- (8,  1, NULL, 'Log Book 1',                                                                     8),
-- (9,  1, NULL, 'Simple Health Habits 1',                                                         9),
-- (10, 1, NULL, 'Safe from Harm 7',                                                               10),
-- (11, 1, NULL, 'Thrift — Savings Account 1',                                                     11),
-- (12, 1, NULL, 'Good Habits 1',                                                                  12),
-- (13, 1, NULL, 'First Aid 1',                                                                    13),
-- (14, 1, NULL, 'Wood Craft Signs — 500m Treasure Hunt',                                          14);

-- -- Sub-tasks: Req 1 — Scout Promise and Scout Law
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 1, 'Recite the Scout Promise by memory',                                   1),
-- (1, 1, 'Recite the Scout Law by memory',                                       2),
-- (1, 1, 'Know the meaning of the Scout Promise',                                3),
-- (1, 1, 'Know the meaning of the Scout Law',                                    4),
-- (1, 1, 'Use the Scout Promise and Law in day-to-day life',                     5),
-- (1, 1, 'Know what to do when taking the Scout Promise',                        6),
-- (1, 1, 'Understand that the Scout Promise is the basis of Scouting',           7);

-- -- Sub-tasks: Req 2 — National Anthem
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 2, 'Sing the National Anthem alone',                                       1),
-- (1, 2, 'Know what should be done when singing the National Anthem',            2),
-- (1, 2, 'Know the Composer and the history of the National Anthem',             3),
-- (1, 2, 'Know the meaning of the National Anthem',                              4);

-- -- Sub-tasks: Req 3 — Scout Sign and Saluting
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 3, 'Know the meaning of the Scout sign, salute, and left-hand shake',      1),
-- (1, 3, 'Make the Scout sign used for the salute with the hand',                2),
-- (1, 3, 'Know when to use the sign and salute',                                 3),
-- (1, 3, 'Know when to salute',                                                  4);

-- -- Sub-tasks: Req 4 — Founder
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 4, 'Know the important life events of Lord Baden Powell',                  1),
-- (1, 4, 'Know BP''s birth, childhood, and early life',                          2),
-- (1, 4, 'Know life prior to scouting, origin of scouting, milestones',          3),
-- (1, 4, 'Know the Founder of Sri Lanka Scouting and the year started',          4);

-- -- Sub-tasks: Req 5 — Whistle and Hand Signals
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 5, 'Whistle: Silence / Attention / Await my next signal',                  1),
-- (1, 5, 'Whistle: Rally Call (Assemble)',                                        2),
-- (1, 5, 'Whistle: Disperse / Spread out',                                        3),
-- (1, 5, 'Whistle: Danger',                                                       4),
-- (1, 5, 'Whistle: Calling Patrol Leaders',                                       5),
-- (1, 5, 'Hand signals: Horse Shoe formation',                                    6),
-- (1, 5, 'Hand signals: Parallel Lines',                                          7),
-- (1, 5, 'Hand signals: Closed Columns',                                          8),
-- (1, 5, 'Hand signals: Open Columns',                                            9),
-- (1, 5, 'Hand signals: Open Square / Open Box',                                  10),
-- (1, 5, 'Hand signals: Circle formation',                                        11),
-- (1, 5, 'Hand signals: Straight line shoulder to shoulder by patrols',           12);

-- -- Sub-tasks: Req 6 — Knots and Whipping 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 6, 'Reef Knot — know how to tie and explain its use',                      1),
-- (1, 6, 'Sheet Bend — know how to tie and explain its use',                     2),
-- (1, 6, 'Clove Hitch — know how to tie and explain its use',                    3),
-- (1, 6, 'Sheep Shank — know how to tie and explain its use',                    4),
-- (1, 6, 'Bowline — know how to tie and explain its use',                        5),
-- (1, 6, 'Round Turn and Two Half Hitches — know how to tie and explain',        6),
-- (1, 6, 'Simple Whipping the end of a rope',                                    7);

-- -- Sub-tasks: Req 7 — Smartness and Good Order 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 7, 'Attention / Alert position',                                           1),
-- (1, 7, 'At Ease position',                                                     2),
-- (1, 7, 'Right Turn',                                                           3),
-- (1, 7, 'Left Turn',                                                            4),
-- (1, 7, 'About Turn',                                                           5),
-- (1, 7, 'Salute',                                                               6),
-- (1, 7, 'Disperse',                                                             7);

-- -- Sub-tasks: Req 8 — Log Book 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 8, 'Start maintaining a personal daily log book',                          1),
-- (1, 8, 'Understand that the Log Book should be the story of Scout life',       2);

-- -- Sub-tasks: Req 9 — Simple Health Habits 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 9, 'Know simple rules of health',                                          1),
-- (1, 9, 'Practically apply health habits in daily life',                        2);

-- -- Sub-tasks: Req 10 — Safe from Harm 7
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 10, 'Know own and parents address and telephone numbers',                   1),
-- (1, 10, 'Walk alone in a permanent route under parental guidance',              2),
-- (1, 10, 'Recognize different types of harm and know how to protect from them',  3);

-- -- Sub-tasks: Req 11 — Thrift
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 11, 'Know what thrift is',                                                 1),
-- (1, 11, 'Open or maintain a savings account',                                  2);

-- -- Sub-tasks: Req 12 — Good Habits 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 12, 'Do a good deed every day',                                            1);

-- -- Sub-tasks: Req 13 — First Aid 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 13, 'Know the purpose of giving First Aid',                                1),
-- (1, 13, 'Know how to clean and dress a simple wound',                          2);

-- -- Sub-tasks: Req 14 — Wood Craft Signs
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (1, 14, 'Know and identify Wood Craft signs',                                  1),
-- (1, 14, 'Complete a 500m treasure hunt using Wood Craft signs with obstacles', 2);

-- -- =============================================================
-- -- BADGE 2 — SCOUT AWARD
-- -- =============================================================

-- INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, order_number) VALUES
-- (101, 2, NULL, 'Scout Movement in Sri Lanka',                                  1),
-- (102, 2, NULL, 'National Flag and National Symbols',                           2),
-- (103, 2, NULL, 'Simple Health Habits 2',                                       3),
-- (104, 2, NULL, 'Correct Posture and Habits',                                   4),
-- (105, 2, NULL, 'Social Health 1',                                              5),
-- (106, 2, NULL, 'Preparation for Flag Break / Hoisting',                        6),
-- (107, 2, NULL, 'Knowledge of the Area Around 1 (½ km)',                        7),
-- (108, 2, NULL, 'Outdoor Activity (two activities)',                            8),
-- (109, 2, NULL, 'Environment Protection for Sustainability',                    9),
-- (110, 2, NULL, 'Safe from Harm 8',                                             10),
-- (111, 2, NULL, 'Knots and Lashing 2',                                          11),
-- (112, 2, NULL, 'Pioneering Work 1',                                            12),
-- (113, 2, NULL, 'Compass and Mapping 1',                                        13),
-- (114, 2, NULL, 'B.P. Exercises',                                               14),
-- (115, 2, NULL, 'Sense Training',                                               15),
-- (116, 2, NULL, 'Fifteen Common Trees',                                         16),
-- (117, 2, NULL, 'Smartness and Good Order 2',                                   17),
-- (118, 2, NULL, 'First Aid 2',                                                  18),
-- (119, 2, NULL, 'IT Literacy 1',                                                19),
-- (120, 2, NULL, 'Link Language Skills 1',                                       20),
-- (121, 2, NULL, 'Good Habits 2',                                                21),
-- (122, 2, NULL, 'Two Nights Camping',                                           22),
-- (123, 2, NULL, 'One Day Hike of 12km',                                         23),
-- (124, 2, NULL, 'Requirements for Sea Scouts and Air Scouts',                   24);

-- -- Sub-tasks: Req 101 — Scout Movement in Sri Lanka
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 101, 'Know in brief the history of the Scout Movement in Sri Lanka',        1);

-- -- Sub-tasks: Req 102 — National Flag and Symbols
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 102, 'Know the structure, basic meaning, and symbols of the National Flag', 1),
-- (2, 102, 'Know about the National Sport',                                       2),
-- (2, 102, 'Know the National Flower',                                            3),
-- (2, 102, 'Know the National Tree',                                              4),
-- (2, 102, 'Know the National Bird',                                              5),
-- (2, 102, 'Know the Government Crest',                                           6);

-- -- Sub-tasks: Req 103 — Simple Health Habits 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 103, 'Know the importance of applying health guidelines during an epidemic/pandemic', 1);

-- -- Sub-tasks: Req 104 — Correct Posture and Habits
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 104, 'Understand correct methods of Standing',                              1),
-- (2, 104, 'Understand correct methods of Walking',                               2),
-- (2, 104, 'Understand correct methods of Sitting',                               3),
-- (2, 104, 'Understand correct methods of Carrying a weight',                     4),
-- (2, 104, 'Understand correct methods of Sleeping',                              5),
-- (2, 104, 'Know General Smartness norms',                                        6),
-- (2, 104, 'Getting permission before entering a room',                           7),
-- (2, 104, 'Thanking others correctly',                                           8),
-- (2, 104, 'Apologizing correctly',                                               9),
-- (2, 104, 'Not being proud (humility)',                                          10);

-- -- Sub-tasks: Req 105 — Social Health 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 105, 'Understand bad effects of smoking',                                   1),
-- (2, 105, 'Understand bad effects of consumption of alcohol',                    2),
-- (2, 105, 'Understand bad effects of substance abuse (drug use)',                3),
-- (2, 105, 'Understand bad effects of chewing betel',                             4),
-- (2, 105, 'Make a poster OR speech of 5 minutes OR essay of 200 words OR poem of 4 verses on prevention of one of the above', 5);

-- -- Sub-tasks: Req 106 — Flag Break
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 106, 'Be able to prepare a flag break',                                     1),
-- (2, 106, 'Be able to prepare a flag hoisting ceremony',                         2);

-- -- Sub-tasks: Req 107 — Know the Area 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 107, 'Know the area within a radius of ½ km from the Scout''s home',       1),
-- (2, 107, 'Direct a stranger to important places indicating distances and directions', 2);

-- -- Sub-tasks: Req 108 — Outdoor Activity
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 108, 'Actively take part in two of: Nature ramble, Bird watching, Exploring archaeological/historical places, One day hike with Patrol, or Any similar activity', 1);

-- -- Sub-tasks: Req 109 — Environment Protection
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 109, 'Understand bad effects of chemical fertilizers, pesticides, and weedicides', 1),
-- (2, 109, 'Understand benefits of using organic fertilizer',                     2),
-- (2, 109, 'Collect information and make a verbal report on organic fertilizer',  3),
-- (2, 109, 'Understand the basics of making a compost pit',                       4),
-- (2, 109, 'Plant a tree, maintain and protect it',                               5);

-- -- Sub-tasks: Req 110 — Safe from Harm 8
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 110, 'Help a younger scout contact his/her parents',                        1),
-- (2, 110, 'Know the Emergency Ambulance and Emergency Police numbers',           2),
-- (2, 110, 'Know the different areas of Safety',                                  3),
-- (2, 110, 'Know methods of reporting abuse or harassment to the Patrol',         4),
-- (2, 110, 'Know what to do if you get lost',                                     5);

-- -- Sub-tasks: Req 111 — Knots and Lashing 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 111, 'Fisherman''s Knot — tie and explain practical use',                  1),
-- (2, 111, 'Man Harness Knot — tie and explain practical use',                   2),
-- (2, 111, 'Timber Hitch — tie and explain practical use',                       3),
-- (2, 111, 'Tie Knot — tie and explain practical use',                           4),
-- (2, 111, 'Square Lashing — tie and explain practical use',                     5),
-- (2, 111, 'Diagonal Lashing — tie and explain practical use',                   6),
-- (2, 111, 'Sheer Lashing — tie and explain practical use',                      7);

-- -- Sub-tasks: Req 112 — Pioneering Work 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 112, 'Make a Trestle',                                                      1),
-- (2, 112, 'Make a Portable Flag Mast',                                           2),
-- (2, 112, 'Know about the parts of a rope',                                      3);

-- -- Sub-tasks: Req 113 — Compass and Mapping 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 113, 'Know how a magnetic compass works',                                   1),
-- (2, 113, 'Show the basic 16 directions on a compass',                           2),
-- (2, 113, 'Show the key elements of a map',                                      3),
-- (2, 113, 'Know the conventional signs of a map',                                4),
-- (2, 113, 'Know how to use GPS (Global Positioning System)',                     5);

-- -- Sub-tasks: Req 114 — BP Exercises
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 114, 'Maintain a healthy body as part of daily routine with the 6 exercises introduced by Lord Baden Powell', 1);

-- -- Sub-tasks: Req 115 — Sense Training
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 115, 'Kim''s Game — Vision',                                                1),
-- (2, 115, 'Smell, touch, taste, and hearing training',                           2);

-- -- Sub-tasks: Req 116 — Fifteen Common Trees
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 116, 'Identify 15 useful trees',                                            1),
-- (2, 116, 'Mention the location of these trees',                                 2),
-- (2, 116, 'Mention the botanical name of these trees',                           3);

-- -- Sub-tasks: Req 117 — Smartness and Good Order 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 117, 'March 50 metres correctly with the Patrol',                           1),
-- (2, 117, 'Squad drill including marking time',                                  2),
-- (2, 117, 'Drills with the staff',                                               3);

-- -- Sub-tasks: Req 118 — First Aid 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 118, 'Explain what D.R.S.A.B.C. stands for',                               1),
-- (2, 118, 'Put an unconscious person in the Recovery Position',                  2),
-- (2, 118, 'Explain how CPR (Cardiopulmonary Resuscitation) is given',            3),
-- (2, 118, 'Demonstrate three methods of carrying a casualty with help of another', 4),
-- (2, 118, 'Demonstrate the Fireman''s Lift',                                    5);

-- -- Sub-tasks: Req 119 — IT Literacy 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 119, 'Basic knowledge on key input/output devices of a computer',           1),
-- (2, 119, 'Knowledge about basic usage of a computer',                           2),
-- (2, 119, 'Knowledge about basic storage methods of information',                3);

-- -- Sub-tasks: Req 120 — Link Language Skills 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 120, 'Learn the alphabet of two languages',                                 1),
-- (2, 120, 'Learn at least 15 words used in day-to-day life in all three languages', 2);

-- -- Sub-tasks: Req 121 — Good Habits 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 121, 'Get involved in a small-scale Community Service project with Patrol (at least one hour)', 1),
-- (2, 121, 'Write at least 5 sentences about the service in the Log Book',        2);

-- -- Sub-tasks: Req 122 — Two Nights Camping
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 122, 'Have two nights camping experience (in tent)',                        1),
-- (2, 122, 'Make a fire using firewood and only two match sticks',                2),
-- (2, 122, 'Make tea for the Patrol using the campfire',                          3);

-- -- Sub-tasks: Req 123 — One Day Hike 12km
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 123, 'Complete a one day hike of 12km',                                     1);

-- -- Sub-tasks: Req 124 — Sea/Air Scouts
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (2, 124, 'Sea Scouts: Explain parts of a ship (Aft, Fore Castle, Port, Starboard)', 1),
-- (2, 124, 'Sea Scouts: Explain why the Phonetic Alphabet is used by Seamen',    2),
-- (2, 124, 'Air Scouts: Understand and explain Fuselage, Tail, Main plane, Port and Starboard', 3),
-- (2, 124, 'Air Scouts: Know the difference between Ground Speed and Air Speed', 4),
-- (2, 124, 'Air Scouts: Know how wind is used in take-off and landing',          5);

-- -- =============================================================
-- -- BADGE 3 — CHIEF COMMISSIONER'S AWARD
-- -- =============================================================

-- INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, order_number) VALUES
-- (201, 3, NULL, 'Thrift — Savings Account 2',                                   1),
-- (202, 3, NULL, 'Skills in Art and Hobbies 1',                                  2),
-- (203, 3, NULL, 'Knots and Whipping 3',                                         3),
-- (204, 3, NULL, 'Types of Fire Places and LP Gas Safety',                       4),
-- (205, 3, NULL, 'Pioneering Project 2',                                         5),
-- (206, 3, NULL, 'Tracks — Identification and Plaster Casts',                    6),
-- (207, 3, NULL, 'Compass and Mapping 2',                                        7),
-- (208, 3, NULL, 'Estimation of Heights, Lengths, and Weights',                  8),
-- (209, 3, NULL, 'Use of Different Tools',                                       9),
-- (210, 3, NULL, 'Ten Common Birds',                                             10),
-- (211, 3, NULL, 'Swimming 50m or Alternate Skill',                              11),
-- (212, 3, NULL, 'Smartness and Good Order 3',                                   12),
-- (213, 3, NULL, 'Social Health 2',                                              13),
-- (214, 3, NULL, 'Highway Code',                                                 14),
-- (215, 3, NULL, 'IT Literacy 2',                                                15),
-- (216, 3, NULL, 'Knowledge of the Area Around 2 (1 km sketch map)',             16),
-- (217, 3, NULL, 'Scout Vision and Mission',                                     17),
-- (218, 3, NULL, 'First Aid 3',                                                  18),
-- (219, 3, NULL, 'Safe from Harm 9',                                             19),
-- (220, 3, NULL, 'Environment Protection Activity — 10R Method',                 20),
-- (221, 3, NULL, 'Link Language Skills 2',                                       21),
-- (222, 3, NULL, 'Two Nights Week-end Camping',                                  22),
-- (223, 3, NULL, 'District Commissioner''s Hike (22km, one night)',              23),
-- (224, 3, NULL, 'Requirements for Sea Scouts and Air Scouts',                   24);

-- -- Sub-tasks: Req 201 — Thrift 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 201, 'Continue to maintain the savings account',                            1);

-- -- Sub-tasks: Req 202 — Art and Hobbies 1
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 202, 'Show ability in one of: Singing, Playing a musical instrument, Music Composing', 1),
-- (3, 202, 'OR show ability in: Dancing, Acting',                                2),
-- (3, 202, 'OR show ability in: Drawing, Painting, Sculpturing',                  3),
-- (3, 202, 'OR show ability in: Graphic Designing, Video Editing, Animations, PowerPoint Presentations', 4),
-- (3, 202, 'OR show ability in any other hobby',                                  5);

-- -- Sub-tasks: Req 203 — Knots and Whipping 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 203, 'Fireman''s Chair Knot — tie and explain practical use',              1),
-- (3, 203, 'Rolling Hitch — tie and explain practical use',                      2),
-- (3, 203, 'Double Sheet Bend — tie and explain practical use',                  3),
-- (3, 203, 'Bowline on a Bight — tie and explain practical use',                 4),
-- (3, 203, 'Highwayman''s Hitch — tie and explain practical use',               5),
-- (3, 203, 'Sail Maker''s Whipping — demonstrate',                               6);

-- -- Sub-tasks: Req 204 — Fire Places
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 204, 'Maintain and safely use LP Gas cookers',                              1),
-- (3, 204, 'Know dangers and safety precautions for LP gas',                      2),
-- (3, 204, 'Know the uses of Altar Fire',                                         3),
-- (3, 204, 'Know the uses of Star Fire',                                          4),
-- (3, 204, 'Know the uses of Tripod Fire',                                        5),
-- (3, 204, 'Know the uses of Crane Fire',                                         6),
-- (3, 204, 'Know the uses of Reflector Fire',                                     7),
-- (3, 204, 'Know the uses of Trench Fire',                                        8);

-- -- Sub-tasks: Req 205 — Pioneering Project 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 205, 'Know what is meant by a Pioneering project in Scouting',             1),
-- (3, 205, 'Know basic skills necessary for a Pioneering project',               2),
-- (3, 205, 'Know different types of ropes',                                       3),
-- (3, 205, 'Know how to care, protect, and store ropes',                          4),
-- (3, 205, 'Construct a Tripod structure',                                        5),
-- (3, 205, 'Construct a Trestle structure',                                       6),
-- (3, 205, 'Construct an A-Frame structure',                                      7),
-- (3, 205, 'Take part in building camp gateways and camp utility gadgets',        8);

-- -- Sub-tasks: Req 206 — Tracks
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 206, 'Identify parts of a human footprint, shoe print, animal and bird footprints', 1),
-- (3, 206, 'Observe footprints on different surfaces and explain what caused them', 2),
-- (3, 206, 'Make plaster casts of footprints using Plaster of Paris',             3),
-- (3, 206, 'Know tracking as given in Camp Fire Yarn No. 12',                     4);

-- -- Sub-tasks: Req 207 — Compass and Mapping 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 207, 'Set a map correctly',                                                  1),
-- (3, 207, 'Make a rough map to scale using a compass or GPS',                    2);

-- -- Sub-tasks: Req 208 — Estimation
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 208, 'Know the length of the Scout''s hand, fingers, and foot for measurements', 1),
-- (3, 208, 'Use the Shadow method to estimate a height',                           2),
-- (3, 208, 'Use the 10:1 method to estimate a height',                            3),
-- (3, 208, 'Use one other method to estimate a height',                           4),
-- (3, 208, 'Use Triangle method or Napoleon method to estimate a length',         5),
-- (3, 208, 'Estimate a weight',                                                   6);

-- -- Sub-tasks: Req 209 — Use of Different Tools
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 209, 'Safely use and maintain a Hand Axe',                                  1),
-- (3, 209, 'Safely use and maintain a Saw',                                       2),
-- (3, 209, 'Safely use and maintain a Knife',                                     3),
-- (3, 209, 'Safely use and maintain a Hammer',                                    4),
-- (3, 209, 'Safely use and maintain a Mallet',                                    5);

-- -- Sub-tasks: Req 210 — Ten Common Birds
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 210, 'Observe 10 types of birds',                                           1),
-- (3, 210, 'Collect data on colours, body sizes, and warbling sounds of 10 birds',2),
-- (3, 210, 'Record habitat, colour of eggs, shape of feet, and shape of beaks',   3);

-- -- Sub-tasks: Req 211 — Swimming / Alternate Skill
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 211, 'Swim 50 metres (compulsory for Sea Scouts)',                          1),
-- (3, 211, 'OR win one badge from Farmer, Explorer, or Education Group',          2),
-- (3, 211, 'OR win Sportsman / Senior Sportsman or Athlete / Senior Athlete badge', 3),
-- (3, 211, 'Air Scouts may do a badge from the Airman Group instead',             4);

-- -- Sub-tasks: Req 212 — Smartness and Good Order 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 212, 'March 100 metres correctly with the Patrol while saluting and eyes right', 1),
-- (3, 212, 'Participate in a squad giving a street line or guard of honour',       2);

-- -- Sub-tasks: Req 213 — Social Health 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 213, 'Plan and carry out a Patrol activity preventing Smoking',             1),
-- (3, 213, 'Plan and carry out a Patrol activity preventing Use of Alcohol',      2),
-- (3, 213, 'Plan and carry out a Patrol activity preventing Drug Abuse',          3);

-- -- Sub-tasks: Req 214 — Highway Code
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 214, 'Know the Highway Code as indicated in the rules of the Department of Motor Traffic', 1);

-- -- Sub-tasks: Req 215 — IT Literacy 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 215, 'Basic knowledge on word processing',                                  1),
-- (3, 215, 'Basic knowledge on spreadsheets',                                     2),
-- (3, 215, 'Know safety precautions when using the internet',                     3),
-- (3, 215, 'Know the etiquette when using the internet',                          4);

-- -- Sub-tasks: Req 216 — Knowledge of Area 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 216, 'Draw a rough sketch map of the area within 1km radius from the Scout''s home', 1);

-- -- Sub-tasks: Req 217 — Scout Vision and Mission
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 217, 'Write or explain the Vision/Purpose statement of the Sri Lanka Scout Association', 1),
-- (3, 217, 'Write or explain the Mission statement of the World Scout Organisation', 2);

-- -- Sub-tasks: Req 218 — First Aid 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 218, 'Give First Aid for Shock',                                            1),
-- (3, 218, 'Give First Aid for Fainting',                                         2),
-- (3, 218, 'Give First Aid for Bleeding from the nose',                           3),
-- (3, 218, 'Give First Aid for Stings and Bites',                                 4),
-- (3, 218, 'Give First Aid for Minor Cuts',                                       5),
-- (3, 218, 'Give First Aid for Burns',                                            6),
-- (3, 218, 'Give First Aid for Scalding',                                         7),
-- (3, 218, 'Give First Aid for Drowning',                                         8),
-- (3, 218, 'Give First Aid for Control of sudden Fire',                           9),
-- (3, 218, 'Give First Aid for Electric Shock',                                   10),
-- (3, 218, 'Know when and where AED (Automated External Defibrillator) is used',  11);

-- -- Sub-tasks: Req 219 — Safe from Harm 9
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 219, 'Help a lost child by calling his/her parents',                        1),
-- (3, 219, 'Know how to tell someone if you are in trouble',                      2),
-- (3, 219, 'Know the Emergency Ambulance, Police, and Fire Rescue numbers',       3),
-- (3, 219, 'Be aware of School Emergency Procedures',                             4),
-- (3, 219, 'Know how to handle emergency situations at home',                     5),
-- (3, 219, 'Know risky behaviour and how to prevent it in the Troop',             6);

-- -- Sub-tasks: Req 220 — 10R Environment
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 220, 'Refuse — know this method and apply it',                              1),
-- (3, 220, 'Reduce — know this method and apply it',                              2),
-- (3, 220, 'Reuse — know this method and apply it',                               3),
-- (3, 220, 'Repair — know this method and apply it',                              4),
-- (3, 220, 'Replace — know this method and apply it',                             5),
-- (3, 220, 'Recycle — know this method and apply it',                             6),
-- (3, 220, 'Rethink — know this method and apply it',                             7),
-- (3, 220, 'Remember — know this method and apply it',                            8),
-- (3, 220, 'Repeat — know this method and apply it',                              9),
-- (3, 220, 'Reject — know this method and apply it',                              10),
-- (3, 220, 'Collect data on 10R and be able to explain',                          11);

-- -- Sub-tasks: Req 221 — Link Language Skills 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 221, 'Construct 20 simple sentences using the other two languages (not Scout''s own language)', 1);

-- -- Sub-tasks: Req 222 — Two Nights Weekend Camping
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 222, 'Take part in a week-end camp with the Patrol or Troop of at least two nights', 1);

-- -- Sub-tasks: Req 223 — DC Hike
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 223, 'Complete DC''s Hike (one night and 22km) after completing requirements 1 to 22', 1),
-- (3, 223, 'Complete DC''s Hike before the age of 14 years and 6 months (Junior Scout)', 2);

-- -- Sub-tasks: Req 224 — Sea/Air Scouts (CCA)
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (3, 224, 'Sea Scouts: Demonstrate Running Bowline and Blackwell Hitch',         1),
-- (3, 224, 'Sea Scouts: Understand the Phonetic Alphabet',                        2),
-- (3, 224, 'Air Scouts: Understand and demonstrate the Phonetic Alphabet',        3);

-- -- =============================================================
-- -- BADGE 4 — PRIME MINISTER'S SCOUT AWARD
-- -- =============================================================

-- INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, order_number) VALUES
-- (301, 4, NULL, 'Scout Promise and Scout Law 2',                                 1),
-- (302, 4, NULL, 'Structure of the WOSM',                                        2),
-- (303, 4, NULL, 'Thrift — Savings Account 3',                                   3),
-- (304, 4, NULL, 'Public Consciousness and Protection of Public Property',        4),
-- (305, 4, NULL, 'Skills in Arts and Hobbies 2',                                 5),
-- (306, 4, NULL, 'Backwoodsman Cooking',                                         6),
-- (307, 4, NULL, 'Splicing (Rope Splicing)',                                     7),
-- (308, 4, NULL, 'Pioneering 3',                                                 8),
-- (309, 4, NULL, 'Tents and Other Equipment',                                    9),
-- (310, 4, NULL, 'Smartness and Good Order 4',                                   10),
-- (311, 4, NULL, 'Balanced Meal',                                                11),
-- (312, 4, NULL, 'Productivity Concept',                                         12),
-- (313, 4, NULL, 'IT Literacy 3',                                                13),
-- (314, 4, NULL, 'Link Language Skills 3',                                       14),
-- (315, 4, NULL, 'Compass and Mapping 3',                                        15),
-- (316, 4, NULL, 'Camp Equipment',                                               16),
-- (317, 4, NULL, 'Adventure Skills',                                             17),
-- (318, 4, NULL, 'Time Management',                                              18),
-- (319, 4, NULL, 'Safe from Harm 10',                                            19),
-- (320, 4, NULL, 'Four Nights Camping',                                          20),
-- (321, 4, NULL, 'Community Service Project (6 hours)',                          21),
-- (322, 4, NULL, 'Make the Bushman''s Thong',                                   22);

-- -- Sub-tasks: Req 301 — Scout Promise and Law 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 301, 'Have a better understanding of the Scout Law and the Scout Promise',  1),
-- (4, 301, 'Teach the Scout Promise and the Scout Law to a new recruit',          2);

-- -- Sub-tasks: Req 302 — WOSM Structure
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 302, 'Know the basic structure of the World Organisation of the Scout Movement (WOSM)', 1),
-- (4, 302, 'Know about the 6 Scout regions',                                      2),
-- (4, 302, 'Know about the Asia Pacific Region',                                  3),
-- (4, 302, 'Know about International Scouting',                                   4);

-- -- Sub-tasks: Req 303 — Thrift 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 303, 'Continue to maintain the savings account and increase regular savings', 1);

-- -- Sub-tasks: Req 304 — Public Property
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 304, 'Understand the bad effects of anti-social acts',                      1),
-- (4, 304, 'Collect data about this theme from known adults and mass media',      2),
-- (4, 304, 'Write an essay according to the Scout Law and Scout Promise with photographs', 3);

-- -- Sub-tasks: Req 305 — Arts and Hobbies 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 305, 'Show progress in Art or Hobbies from Chief Commissioner''s Award level', 1),
-- (4, 305, 'Take part in a Variety Entertainment, Art Exhibition, or Public Show', 2),
-- (4, 305, 'OR present the Scout''s skill in the selected field to the Troop',    3);

-- -- Sub-tasks: Req 306 — Backwoodsman Cooking
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 306, 'Do Backwoodsman Cooking with the Patrol (without utensils)',          1);

-- -- Sub-tasks: Req 307 — Splicing
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 307, 'Back Splicing',                                                       1),
-- (4, 307, 'Eye Splicing',                                                        2),
-- (4, 307, 'Short Splicing',                                                      3);

-- -- Sub-tasks: Req 308 — Pioneering 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 308, 'Straining of ropes',                                                  1),
-- (4, 308, 'Hold fasts',                                                          2),
-- (4, 308, 'Anchorages',                                                          3),
-- (4, 308, 'Handy Billy — use of pulleys with rope',                              4),
-- (4, 308, 'Pulley system',                                                       5),
-- (4, 308, 'Actively involved in pioneering projects with the Patrol',            6);

-- -- Sub-tasks: Req 309 — Tents and Equipment
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 309, 'Name the parts of a wall tent',                                       1),
-- (4, 309, 'Pitch a tent with the help of the Patrol',                            2),
-- (4, 309, 'Remove and clean a tent',                                             3),
-- (4, 309, 'Properly fold and pack a tent',                                       4);

-- -- Sub-tasks: Req 310 — Smartness 4
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 310, 'March 100 metres correctly',                                          1),
-- (4, 310, 'Mark time while marching',                                            2),
-- (4, 310, 'Halt',                                                                3),
-- (4, 310, 'Carry the staff or flag while marching',                              4),
-- (4, 310, 'Salute while marching',                                               5);

-- -- Sub-tasks: Req 311 — Balanced Meal
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 311, 'Collect data about preparing a balanced meal',                        1),
-- (4, 311, 'Prepare a balanced meal for a person of the Scout''s age',            2),
-- (4, 311, 'Know the dangers of eating junk/fast food',                           3);

-- -- Sub-tasks: Req 312 — Productivity Concepts
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 312, 'Quality Circle — know the concept',                                   1),
-- (4, 312, '5S methodology — know the concept',                                   2),
-- (4, 312, 'Suggestion Schemes (Group Kaizen) — know the concept',               3);

-- -- Sub-tasks: Req 313 — IT Literacy 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 313, 'Basic knowledge on PowerPoint presentations and animations',          1),
-- (4, 313, 'Create a personal e-mail address and use it',                         2),
-- (4, 313, 'Optional: Register at www.scout.org website',                         3);

-- -- Sub-tasks: Req 314 — Link Language Skills 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 314, 'Do a self-introduction in all three languages in at least 2 minutes',  1),
-- (4, 314, 'Ability to write Name, Address, Country, School name, and Hobbies in all three languages', 2);

-- -- Sub-tasks: Req 315 — Compass and Mapping 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 315, 'Get a Forward Bearing using the compass',                             1),
-- (4, 315, 'Triangulation — Resection and Intersection',                          2),
-- (4, 315, 'Identify the Scout''s position using a map and triangulation',        3),
-- (4, 315, 'Identify landmarks visible using the map',                            4),
-- (4, 315, 'Know how to plot a hike route using contour lines',                   5);

-- -- Sub-tasks: Req 316 — Camp Equipment
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 316, 'Properly use camping equipment such as tents',                        1),
-- (4, 316, 'Know how to repair, clean, and maintain camping equipment',           2);

-- -- Sub-tasks: Req 317 — Adventure Skills
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 317, 'Tarzan Jump',                                                         1),
-- (4, 317, 'Rope Climbing',                                                       2),
-- (4, 317, 'Tree Climbing',                                                       3),
-- (4, 317, 'Crossing a Commando Bridge',                                          4),
-- (4, 317, 'Crossing a Monkey Bridge',                                            5),
-- (4, 317, 'Crossing the tope (Athura)',                                          6),
-- (4, 317, 'Rock Climbing — three perfect grips',                                 7),
-- (4, 317, 'Know how to use the Bowline and Bowline on a Bight for adventure activities', 8),
-- (4, 317, 'Know how to prepare for an Adventure Hike, Expedition, and Safety Precautions', 9),
-- (4, 317, 'Complete at least four of the above adventure activities',            10);

-- -- Sub-tasks: Req 318 — Time Management
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 318, 'Understand basic Time Management concepts',                           1);

-- -- Sub-tasks: Req 319 — Safe from Harm 10
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 319, 'Know how to help lost children by calling their parents',             1),
-- (4, 319, 'Know what to do if parents are not contactable',                      2),
-- (4, 319, 'Know what to do if no one answers when you are in trouble',           3),
-- (4, 319, 'Know TP numbers: Emergency Ambulance, Police, Fire Rescue, and Child Helpline', 4),
-- (4, 319, 'Explain how to improve psychological health',                         5),
-- (4, 319, 'Explain three good safety strategies for situations in the syllabus', 6);

-- -- Sub-tasks: Req 320 — Four Nights Camping
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 320, 'Have four nights camping experience (at a stretch or staggered basis)', 1);

-- -- Sub-tasks: Req 321 — Community Service (6 hours)
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 321, 'Get involved in a Community Service Project organized by school or any organization for at least 6 hours', 1),
-- (4, 321, 'OR identify a student weak in studies and carry out an improvement programme',  2),
-- (4, 321, 'OR observe a Development Project',                                    3),
-- (4, 321, 'OR complete requirements for Scouts of the World Award under Better World Framework', 4);

-- -- Sub-tasks: Req 322 — Bushman's Thong
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (4, 322, 'Make the Bushman''s Thong in the presence of the ADC (Programme)',    1),
-- (4, 322, 'Complete this after all requirements of the Prime Minister''s Scout Award including Proficiency Badges', 2);

-- -- =============================================================
-- -- BADGE 5 — PRESIDENT'S SCOUT AWARD
-- -- =============================================================

-- INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, order_number) VALUES
-- (401, 5, NULL, 'Scout Promise and Scout Law 3',                                  1),
-- (402, 5, NULL, 'Log Book 2',                                                    2),
-- (403, 5, NULL, 'Skills in Art and Hobbies 3',                                   3),
-- (404, 5, NULL, 'Scout Craft — Training Others',                                 4),
-- (405, 5, NULL, 'Pioneering Project 4',                                          5),
-- (406, 5, NULL, 'Leadership in Emergencies and Natural Disasters',               6),
-- (407, 5, NULL, 'Health Habits — Training Others',                               7),
-- (408, 5, NULL, 'IT Literacy 4',                                                 8),
-- (409, 5, NULL, 'Link Language Skills 4',                                        9),
-- (410, 5, NULL, 'Safe from Harm 11',                                             10),
-- (411, 5, NULL, 'Organising a Hike with Scout Skills and Challenges',            11),
-- (412, 5, NULL, 'Community Service Project (72 man-hours)',                      12),
-- (413, 5, NULL, 'Four Nights Camping after Bushman''s Thong',                   13);

-- -- Sub-tasks: Req 401 — Scout Promise and Law 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 401, 'Present one of the Games/Challenges/Acts based on the Scout Promise or Scout Law', 1),
-- (5, 401, 'Make a speech to the Patrol based on two sections of the Scout Law',  2);

-- -- Sub-tasks: Req 402 — Log Book 2
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 402, 'Should have records of at least 2 years and 6 months preceding the President Scout interview', 1);

-- -- Sub-tasks: Req 403 — Art and Hobbies 3
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 403, 'Create an original artistic or literary work',                        1);

-- -- Sub-tasks: Req 404 — Scout Craft Training
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 404, 'Train a Scout or Patrol on three requirements for the Scout Award',   1),
-- (5, 404, 'Train a Scout or Patrol on three requirements for the Chief Commissioner''s Award', 2);

-- -- Sub-tasks: Req 405 — Pioneering 4
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 405, 'Take leadership in organising and conducting a pioneering project',   1);

-- -- Sub-tasks: Req 406 — Leadership in Emergencies
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 406, 'Provide leadership when an accident or natural disaster occurs',      1),
-- (5, 406, 'Render First Aid during the emergency leadership exercise',           2);

-- -- Sub-tasks: Req 407 — Health Habits Training
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 407, 'Train a Scout about health habits necessary for the Membership Badge', 1);

-- -- Sub-tasks: Req 408 — IT Literacy 4
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 408, 'Type 15 words used in day-to-day activities in a language other than Scout''s own language', 1),
-- (5, 408, 'Prepare a PowerPoint Presentation to be presented in 5 minutes following syllabus guidelines', 2);

-- -- Sub-tasks: Req 409 — Link Language Skills 4
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 409, 'Give a 3-minute speech on any topic in one language other than Scout''s own language', 1),
-- (5, 409, 'PowerPoint presentations can be used',                                2);

-- -- Sub-tasks: Req 410 — Safe from Harm 11
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 410, 'Know basic rules of assessing risk',                                  1),
-- (5, 410, 'Know how to help someone who is being bullied or harassed',           2),
-- (5, 410, 'Know safety in school building and for Scout activities',             3),
-- (5, 410, 'Know fire safety',                                                    4),
-- (5, 410, 'Know safety in Mountains, Rivers, or Jungles as relevant to home town', 5),
-- (5, 410, 'Know rules for healthy living',                                       6),
-- (5, 410, 'Know what Integrity is and how to develop it',                        7);

-- -- Sub-tasks: Req 411 — Organising a Hike
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 411, 'Organise a short hike of maximum 1km using Wood Craft signs',         1),
-- (5, 411, 'Include Scout Skills and Challenges in the hike',                     2);

-- -- Sub-tasks: Req 412 — Community Service Project 72 hrs
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 412, 'Organise a Community Service Project with at least 72 man-hours',     1);

-- -- Sub-tasks: Req 413 — Four Nights Camping (Post Bushman's Thong)
-- INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, order_number) VALUES
-- (5, 413, 'Complete four nights camping after completing the Bushman''s Thong requirements', 1),
-- (5, 413, 'Camping can be at a stretch or on a staggered basis',                  2);

-- -- =============================================================
-- -- UPDATE total_requirements COUNT
-- -- =============================================================
-- UPDATE badges SET total_requirements = (
--     SELECT COUNT(*) FROM badge_requirements
--     WHERE badge_id = badges.id AND parent_id IS NULL
-- );

-- -- =============================================================
-- -- PROFICIENCY BADGES — Junior Scouts
-- -- =============================================================

-- INSERT INTO proficiency_badges (code, name, group_name, scout_level) VALUES
-- -- A. Public Service Group
-- ('JA-1',  'Linguist',         'Public Service Group', 'junior'),
-- ('JA-2',  'Missioner',        'Public Service Group', 'junior'),
-- ('JA-3',  'Fire-Fighter',     'Public Service Group', 'junior'),
-- ('JA-4',  'Signaller',        'Public Service Group', 'junior'),
-- ('JA-5',  'Cyclist',          'Public Service Group', 'junior'),
-- ('JA-6',  'Guide',            'Public Service Group', 'junior'),
-- ('JA-7',  'First Aid',        'Public Service Group', 'junior'),
-- ('JA-8',  'Life Saver',       'Public Service Group', 'junior'),
-- ('JA-9',  'Coxswain',         'Public Service Group', 'junior'),
-- ('JA-10', 'Jobman',           'Public Service Group', 'junior'),
-- -- B. Camp Craft Group
-- ('JB-1',  'Camper',           'Camp Craft Group', 'junior'),
-- ('JB-2',  'Cook',             'Camp Craft Group', 'junior'),
-- ('JB-3',  'Woodcraftsman',    'Camp Craft Group', 'junior'),
-- ('JB-4',  'Pioneer',          'Camp Craft Group', 'junior'),
-- ('JB-5',  'Backwoodsman',     'Camp Craft Group', 'junior'),
-- -- C. Education Group
-- ('JC-1',  'Reader',           'Education Group', 'junior'),
-- ('JC-2',  'Speaker',          'Education Group', 'junior'),
-- ('JC-3',  'Scholar',          'Education Group', 'junior'),
-- ('JC-4',  'Scribe',           'Education Group', 'junior'),
-- -- D. Sports Group
-- ('JD-1',  'Athlete',          'Sports Group', 'junior'),
-- ('JD-2',  'Swimmer',          'Sports Group', 'junior'),
-- ('JD-3',  'Sportsman',        'Sports Group', 'junior'),
-- ('JD-4',  'Rider',            'Sports Group', 'junior'),
-- -- E. Social Group
-- ('JE-1',  'Pen-Friend',       'Social Group', 'junior'),
-- ('JE-2',  'Junior Organiser', 'Social Group', 'junior'),
-- -- F. Culture Group
-- ('JF-1',  'Designer',         'Culture Group', 'junior'),
-- ('JF-2',  'Music Maker',      'Culture Group', 'junior'),
-- ('JF-3',  'Actor',            'Culture Group', 'junior'),
-- ('JF-4',  'Modeller',         'Culture Group', 'junior'),
-- ('JF-5',  'Dancer',           'Culture Group', 'junior'),
-- -- G. Farmer Group
-- ('JG-1',  'Woodman',          'Farmer Group', 'junior'),
-- ('JG-2',  'Gardener',         'Farmer Group', 'junior'),
-- ('JG-3',  'Angler',           'Farmer Group', 'junior'),
-- ('JG-4',  'Small-Holder',     'Farmer Group', 'junior'),
-- ('JG-5',  'Herbalist',        'Farmer Group', 'junior'),
-- -- H. New Explorer Group
-- ('JH-1',  'Observer',         'New Explorer Group', 'junior'),
-- ('JH-2',  'Stalker',          'New Explorer Group', 'junior'),
-- ('JH-3',  'Map Maker',        'New Explorer Group', 'junior'),
-- ('JH-4',  'Starman',          'New Explorer Group', 'junior'),
-- ('JH-5',  'Weatherman',       'New Explorer Group', 'junior'),
-- ('JH-6',  'Explorer',         'New Explorer Group', 'junior'),
-- -- I. Seaman Group
-- ('JI-1',  'Boatswain''s Mate','Seaman Group', 'junior'),
-- ('JI-2',  'Oarsman',          'Seaman Group', 'junior'),
-- ('JI-3',  'Canoeist',         'Seaman Group', 'junior'),
-- -- J. Airman Group
-- ('JJ-1',  'Aircraft Modeller','Airman Group', 'junior'),
-- ('JJ-2',  'Glider',           'Airman Group', 'junior'),
-- ('JJ-3',  'Air Spotter',      'Airman Group', 'junior'),
-- ('JJ-4',  'Air Apprentice',   'Airman Group', 'junior'),
-- -- K. Practical Science Group
-- ('JK-1',  'Wireless Man',     'Practical Science Group', 'junior'),
-- ('JK-2',  'Hand Worker',      'Practical Science Group', 'junior'),
-- ('JK-3',  'Cameraman',        'Practical Science Group', 'junior'),
-- ('JK-4',  'Energy Manager',   'Practical Science Group', 'junior'),
-- -- L. Hobbies Group
-- ('JL-1',  'Stamp Collector',  'Hobbies Group', 'junior'),
-- ('JL-2',  'Junior Collector', 'Hobbies Group', 'junior'),
-- ('JL-3',  'Junior Saver',     'Hobbies Group', 'junior'),
-- -- M. Family Life Education Group
-- ('JM-1',  'Junior Happy Home','Family Life Education Group', 'junior');

-- -- =============================================================
-- -- PROFICIENCY BADGES — Senior Scouts
-- -- =============================================================

-- INSERT INTO proficiency_badges (code, name, group_name, scout_level) VALUES
-- -- A. Public Service Group
-- ('SA-1',  'Interpreter',        'Public Service Group', 'senior'),
-- ('SA-2',  'Public Health',      'Public Service Group', 'senior'),
-- ('SA-3',  'Fireman',            'Public Service Group', 'senior'),
-- ('SA-4',  'Leading Signaller',  'Public Service Group', 'senior'),
-- ('SA-5',  'Dispatch Rider',     'Public Service Group', 'senior'),
-- ('SA-6',  'Path Finder',        'Public Service Group', 'senior'),
-- ('SA-7',  'Ambulance',          'Public Service Group', 'senior'),
-- ('SA-8',  'Rescuer',            'Public Service Group', 'senior'),
-- ('SA-9',  'Pilot',              'Public Service Group', 'senior'),
-- ('SA-10', 'Handyman',           'Public Service Group', 'senior'),
-- ('SA-11', 'Civics',             'Public Service Group', 'senior'),
-- ('SA-12', 'Conservation',       'Public Service Group', 'senior'),
-- -- B. Camp Craft Group
-- ('SB-1',  'Camp Warden',        'Camp Craft Group', 'senior'),
-- ('SB-2',  'Master Cook',        'Camp Craft Group', 'senior'),
-- ('SB-3',  'Naturalist',         'Camp Craft Group', 'senior'),
-- ('SB-4',  'Senior Pioneer',     'Camp Craft Group', 'senior'),
-- ('SB-5',  'Venturer',           'Camp Craft Group', 'senior'),
-- ('SB-6',  'Quarter Master',     'Camp Craft Group', 'senior'),
-- -- C. Education Group
-- ('SC-1',  'Bookman',            'Education Group', 'senior'),
-- ('SC-2',  'Orator',             'Education Group', 'senior'),
-- ('SC-3',  'Senior Scholar',     'Education Group', 'senior'),
-- ('SC-4',  'Clerk',              'Education Group', 'senior'),
-- ('SC-5',  'Typist',             'Education Group', 'senior'),
-- ('SC-6',  'Journalist',         'Education Group', 'senior'),
-- -- D. Sports Group
-- ('SD-1',  'Senior Athlete',     'Sports Group', 'senior'),
-- ('SD-2',  'Master Swimmer',     'Sports Group', 'senior'),
-- ('SD-3',  'Master Sportsman',   'Sports Group', 'senior'),
-- ('SD-4',  'Horseman',           'Sports Group', 'senior'),
-- ('SD-5',  'Archery',            'Sports Group', 'senior'),
-- -- E. Social Group
-- ('SE-1',  'World Friendship',   'Social Group', 'senior'),
-- ('SE-2',  'Organiser',          'Social Group', 'senior'),
-- -- F. Culture Group
-- ('SF-1',  'Artist',             'Culture Group', 'senior'),
-- ('SF-2',  'Musician',           'Culture Group', 'senior'),
-- ('SF-3',  'Play Actor',         'Culture Group', 'senior'),
-- ('SF-4',  'Sculptor',           'Culture Group', 'senior'),
-- ('SF-5',  'Folk Dancer',        'Culture Group', 'senior'),
-- -- G. Farmer Group
-- ('SG-1',  'Forester',           'Farmer Group', 'senior'),
-- ('SG-2',  'Horticulturist',     'Farmer Group', 'senior'),
-- ('SG-3',  'Fisherman',          'Farmer Group', 'senior'),
-- ('SG-4',  'Poultryman',         'Farmer Group', 'senior'),
-- ('SG-5',  'Dairyman',           'Farmer Group', 'senior'),
-- ('SG-6',  'Paddy Cultivator',   'Farmer Group', 'senior'),
-- -- H. Explorer Group
-- ('SH-1',  'Tracker',            'Explorer Group', 'senior'),
-- ('SH-2',  'Hiker',              'Explorer Group', 'senior'),
-- ('SH-3',  'Surveyor',           'Explorer Group', 'senior'),
-- ('SH-4',  'Astronomer',         'Explorer Group', 'senior'),
-- ('SH-5',  'Meteorologist',      'Explorer Group', 'senior'),
-- ('SH-6',  'Senior Explorer',    'Explorer Group', 'senior'),
-- ('SH-7',  'Archeologist',       'Explorer Group', 'senior'),
-- -- I. Seaman Group
-- ('SI-1',  'Boatswain',          'Seaman Group', 'senior'),
-- ('SI-2',  '6-Oar Helmsman',     'Seaman Group', 'senior'),
-- ('SI-3',  'Master Canoeist',    'Seaman Group', 'senior'),
-- -- J. Airman Group
-- ('SJ-1',  'Aircraft Constructor','Airman Group', 'senior'),
-- ('SJ-2',  'Glider Pilot',       'Airman Group', 'senior'),
-- ('SJ-3',  'Air Observer',       'Airman Group', 'senior'),
-- ('SJ-4',  'Air Mechanic',       'Airman Group', 'senior'),
-- ('SJ-5',  'Air Navigator',      'Airman Group', 'senior'),
-- -- K. Practical Science Group
-- ('SK-1',  'Radio Mechanic',     'Practical Science Group', 'senior'),
-- ('SK-2',  'Handicraftsman',     'Practical Science Group', 'senior'),
-- ('SK-3',  'Photographer',       'Practical Science Group', 'senior'),
-- ('SK-4',  'Electrician',        'Practical Science Group', 'senior'),
-- ('SK-5',  'Motor Mechanic',     'Practical Science Group', 'senior'),
-- ('SK-6',  'Energy Conservator', 'Practical Science Group', 'senior'),
-- -- L. Hobbies Group
-- ('SL-1',  'Philatelist',        'Hobbies Group', 'senior'),
-- ('SL-2',  'Outstanding Collector','Hobbies Group', 'senior'),
-- ('SL-3',  'Senior Saver',       'Hobbies Group', 'senior'),
-- -- M. Family Life Education Group
-- ('SM-1',  'Senior Happy Home',  'Family Life Education Group', 'senior');

-- -- =============================================================
-- -- INTERNATIONAL BADGES (both levels)
-- -- =============================================================
-- INSERT INTO proficiency_badges (code, name, group_name, scout_level) VALUES
-- ('BWF-1', 'Messengers of Peace (MoP)',         'International Badges', 'both'),
-- ('BWF-2', 'Scouts of the World Award (SWA)',   'International Badges', 'both'),
-- ('BWF-3', 'Patrimonito Scout Badge',           'International Badges', 'both'),
-- ('BWF-4', 'Champions for Nature Challenge',    'International Badges', 'both'),
-- ('BWF-5', 'Tide Turners Plastic Challenge',    'International Badges', 'both'),
-- ('BWF-6', 'Scouts Go Solar Challenge',         'International Badges', 'both'),
-- ('BWF-7', 'Dialogue for Peace',                'International Badges', 'both');

-- -- =============================================================
-- -- SEED USERS (demo only — passwords are bcrypt hashed in prod)
-- -- =============================================================
-- INSERT INTO troops (id, name, district) VALUES
-- (2, 'Colombo Central Scout Group', 'Colombo'),
-- (3, 'Kandy District Scout Group',  'Kandy')
-- ON CONFLICT DO NOTHING;

-- INSERT INTO users (name, email, password_hash, role, troop_id) VALUES
-- ('Demo Scout',  'scout@smartscouts.sl',  '$2b$12$placeholder_hash', 'scout',  1),
-- ('Demo Leader', 'leader@smartscouts.sl', '$2b$12$placeholder_hash', 'leader', 1);