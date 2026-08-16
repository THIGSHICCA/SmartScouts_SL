-- -- =============================================================
-- -- SmartScouts SL — seed_badges.sql
-- -- Complete Sri Lanka Scout Syllabus 2022
-- -- Source: Scout's Progress Record Book (Tamil/English)
-- -- =============================================================

-- -- =============================================================
-- -- TROOP
-- -- =============================================================
INSERT INTO troops (id, name, district) VALUES
(1, 'Demo Scout Group', 'Colombo');

-- -- =============================================================
-- -- BADGES  (5 award levels)
-- -- =============================================================
INSERT INTO badges (id, name, description, level_order, min_training_months, total_requirements) VALUES
(1, 'Scout Membership Badge',       'Foundational scouting skills — promise, law, safety, and basic skills.',                               1, 3,  14),
(2, 'Scout Award',                  'Second stage covering national identity, outdoor activities, and community.',                          2, 6,  24),
(3, 'Chief Commissioner''s Award',  'Advanced skills in pioneering, mapping, health, environment, and district hiking.',                   3, 9,  24),
(4, 'Prime Minister''s Scout Award','High-level adventure, leadership, and technical skills leading to Bushman''s Thong.',                 4, 9,  22),
(5, 'President''s Scout Award',     'The pinnacle of Sri Lanka Scouting — leadership, service, and community projects.',                   5, 9,  13);

-- -- =============================================================
-- -- BADGE 1 — SCOUT MEMBERSHIP BADGE
-- -- =============================================================

-- -- Top-level requirements
INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1,  1, NULL, 'Scout Promise and Scout Law', 'சாரணர் சத்தியம் மற்றும் சட்டம்', 'බාලදක්ෂ පොරොන්දුව සහ නීතිය', 1),
(2,  1, NULL, 'National Anthem', 'தேசிய கீதம்', 'ජාතික ගීය', 2),
(3,  1, NULL, 'Scout Sign and Methods of Saluting', 'சாரணர் சின்னம் மற்றும் வணக்கம்', 'බාලදක්ෂ ලකුණ සහ ආචාර කිරීම', 3),
(4,  1, NULL, 'Founder of the Scout Movement', 'சாரணர் இயக்கத்தின் நிறுவனர்', 'බාලදක්ෂ ව්‍යාපාරයේ නිර්මාතෘ', 4),
(5,  1, NULL, 'Scout Whistle and Hand Signals', 'சாரணர் விசில் மற்றும் கை சமிக்ஞைகள்', 'බාලදක්ෂ විසිල් සහ අත් සංඥා', 5),
(6,  1, NULL, 'Knots and Whipping 1', 'முடிச்சுகள் 1', 'ගැට 1', 6),
(7,  1, NULL, 'Smartness and Good Order 1', 'சுறுசுறுப்பு மற்றும் நன்னடத்தை 1', 'කඩිසරකම සහ යහපත් හැසිරීම 1', 7),
(8,  1, NULL, 'Log Book 1', 'பதிவேடு 1', 'ලොග් පොත 1', 8),
(9,  1, NULL, 'Simple Health Habits 1', 'எளிய சுகாதார பழக்கங்கள் 1', 'සරල සෞඛ්‍ය පුරුදු 1', 9),
(10, 1, NULL, 'Safe from Harm 7', 'தீங்கிலிருந்து பாதுகாப்பு 7', 'හානියෙන් ආරක්ෂා වීම 7', 10),
(11, 1, NULL, 'Thrift — Savings Account 1', 'சேமிப்பு கணக்கு 1', 'ඉතිරිකිරීමේ ගිණුම 1', 11),
(12, 1, NULL, 'Good Habits 1', 'நல்ல பழக்கங்கள் 1', 'යහපත් පුරුදු 1', 12),
(13, 1, NULL, 'First Aid 1', 'முதலுதவி 1', 'ප්‍රථමාධාර 1', 13),
(14, 1, NULL, 'Wood Craft Signs — 500m Treasure Hunt', 'மர வேலைப்பாட்டு சின்னங்கள்', 'ලී කැටයම් සලකුණු', 14);

-- Jump the sequence to avoid collisions with explicitly inserted IDs
SELECT setval('badge_requirements_id_seq', 1000);

-- -- Sub-tasks: Req 1 — Scout Promise and Scout Law
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 1, 'Recite the Scout Promise by memory', 'சாரணர் வாக்குறுதியை நினைவாற்றலால் சொல்லுங்கள்', 'බාලදක්ෂ පොරොන්දුව මතකයෙන් කියන්න',                                   1),
(1, 1, 'Recite the Scout Law by memory', 'சாரணர் சட்டத்தை நினைவாற்றலால் சொல்லுங்கள்', 'බාලදක්ෂ නීතිය මතකයෙන් කියන්න',                                       2),
(1, 1, 'Know the meaning of the Scout Promise', 'சாரணர் வாக்குறுதியின் அர்த்தத்தை அறிந்து கொள்ளுங்கள்', 'බාලදක්ෂ පොරොන්දුවේ තේරුම දැනගන්න',                                3),
(1, 1, 'Know the meaning of the Scout Law', 'சாரணர் சட்டத்தின் பொருளை அறிந்து கொள்ளுங்கள்', 'බාලදක්ෂ නීතියේ තේරුම දැනගන්න',                                    4),
(1, 1, 'Use the Scout Promise and Law in day-to-day life', 'சாரணர் வாக்குறுதி மற்றும் சட்டத்தை அன்றாட வாழ்க்கையில் பயன்படுத்தவும்', 'එදිනෙදා ජීවිතයේදී බාලදක්ෂ පොරොන්දුව සහ නීතිය භාවිතා කරන්න',                     5),
(1, 1, 'Know what to do when taking the Scout Promise', 'சாரணர் வாக்குறுதியை எடுக்கும்போது என்ன செய்ய வேண்டும் என்பதை அறிந்து கொள்ளுங்கள்', 'බාලදක්ෂ පොරොන්දුව ලබා ගැනීමේදී කළ යුතු දේ දැන ගන්න',                        6),
(1, 1, 'Understand that the Scout Promise is the basis of Scouting', 'Understand that the Scout Promise is the basis of Scouting (TA)', 'Understand that the Scout Promise is the basis of Scouting (SI)',           7);

-- -- Sub-tasks: Req 2 — National Anthem
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 2, 'Sing the National Anthem alone', 'தேசிய கீதத்தை மட்டும் பாடுங்கள்', 'ජාතික ගීය තනියම ගායනා කරන්න',                                       1),
(1, 2, 'Know what should be done when singing the National Anthem', 'தேசிய கீதம் பாடும்போது என்ன செய்ய வேண்டும் என்பதை தெரிந்து கொள்ளுங்கள்', 'ජාතික ගීය ගායනා කිරීමේදී කළ යුතු දේ දැනගන්න',            2),
(1, 2, 'Know the Composer and the history of the National Anthem', 'இசையமைப்பாளர் மற்றும் தேசிய கீதத்தின் வரலாற்றை அறிந்து கொள்ளுங்கள்', 'ජාතික ගීයේ නිර්මාපකයා සහ ඉතිහාසය දැන ගන්න',             3),
(1, 2, 'Know the meaning of the National Anthem', 'Know the meaning of the National Anthem (TA)', 'Know the meaning of the National Anthem (SI)',                              4);

-- -- Sub-tasks: Req 3 — Scout Sign and Saluting
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 3, 'Know the meaning of the Scout sign, salute, and left-hand shake', 'சாரணர் அடையாளம், வணக்கம் மற்றும் இடது கை குலுக்கல் ஆகியவற்றின் அர்த்தத்தை அறிந்து கொள்ளுங்கள்', 'බාලදක්ෂ ලකුණ, ආචාරය සහ වම් අත සෙලවීමේ තේරුම දැන ගන්න',      1),
(1, 3, 'Make the Scout sign used for the salute with the hand', 'வணக்கத்திற்கு பயன்படுத்தப்படும் சாரணர் அடையாளத்தை கையால் உருவாக்கவும்', 'ආචාරය සඳහා භාවිතා කරන බාලදක්ෂ ලකුණ අතින් සාදන්න',                2),
(1, 3, 'Know when to use the sign and salute', 'அடையாளத்தையும் வணக்கத்தையும் எப்போது பயன்படுத்த வேண்டும் என்பதை அறிந்து கொள்ளுங்கள்', 'ලකුණ සහ ආචාරය භාවිතා කළ යුත්තේ කවදාදැයි දැන ගන්න',                                 3),
(1, 3, 'Know when to salute', 'Know when to salute (TA)', 'Know when to salute (SI)',                                                  4);

-- -- Sub-tasks: Req 4 — Founder
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 4, 'Know the important life events of Lord Baden Powell', 'லார்ட் பேடன் பவலின் முக்கியமான வாழ்க்கை நிகழ்வுகளை அறிந்து கொள்ளுங்கள்', 'බේඩන් පවෙල් සාමිවරයාගේ ජීවිතයේ වැදගත් සිදුවීම් දැනගන්න',                  1),
(1, 4, 'Know BP''s birth, childhood, and early life', 'Know BP''s birth, childhood, and early life (TA)', 'Know BP''s birth, childhood, and early life (SI)',                          2),
(1, 4, 'Know life prior to scouting, origin of scouting, milestones', 'சாரணர்களுக்கு முன் வாழ்க்கை, சாரணர்களின் தோற்றம், மைல்கற்கள் ஆகியவற்றை அறிந்து கொள்ளுங்கள்', 'බාලදක්ෂයට පෙර ජීවිතය, බාලදක්ෂයේ ආරම්භය, සන්ධිස්ථාන දැන ගන්න',          3),
(1, 4, 'Know the Founder of Sri Lanka Scouting and the year started', 'Know the Founder of Sri Lanka Scouting and the year started (TA)', 'Know the Founder of Sri Lanka Scouting and the year started (SI)',          4);

-- -- Sub-tasks: Req 5 — Whistle and Hand Signals
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 5, 'Whistle: Silence / Attention / Await my next signal', 'விசில்: அமைதி / கவனம் / எனது அடுத்த சமிக்ஞைக்காக காத்திருங்கள்', 'විස්ල්: නිශ්ශබ්දතාව / අවධානය / මගේ ඊළඟ සංඥාව බලා සිටින්න',                  1),
(1, 5, 'Whistle: Rally Call (Assemble)', 'விசில்: பேரணி அழைப்பு (அசெம்பிள்)', 'විස්ල්: රැලි ඇමතුම (එකලස් කරන්න)',                                        2),
(1, 5, 'Whistle: Disperse / Spread out', 'விசில்: சிதறடிக்கவும் / பரப்பவும்', 'විස්ල්: විසුරුවා හැරීම / විහිදුවන්න',                                        3),
(1, 5, 'Whistle: Danger', 'விசில்: ஆபத்து', 'විස්ල්: අන්තරාය',                                                       4),
(1, 5, 'Whistle: Calling Patrol Leaders', 'விசில்: ரோந்து தலைவர்களை அழைக்கிறது', 'විස්ල්: මුර සංචාර නායකයින් ඇමතීම',                                       5),
(1, 5, 'Hand signals: Horse Shoe formation', 'கை சமிக்ஞைகள்: குதிரை ஷூ உருவாக்கம்', 'අත් සංඥා: අශ්ව සපත්තු සෑදීම',                                    6),
(1, 5, 'Hand signals: Parallel Lines', 'கை சமிக்ஞைகள்: இணை கோடுகள்', 'හස්ත සංඥා: සමාන්තර රේඛා',                                          7),
(1, 5, 'Hand signals: Closed Columns', 'கை சமிக்ஞைகள்: மூடிய நெடுவரிசைகள்', 'හස්ත සංඥා: සංවෘත තීරු',                                          8),
(1, 5, 'Hand signals: Open Columns', 'கை சமிக்ஞைகள்: திறந்த நெடுவரிசைகள்', 'අත් සංඥා: විවෘත තීරු',                                            9),
(1, 5, 'Hand signals: Open Square / Open Box', 'கை சமிக்ஞைகள்: திறந்த சதுரம் / திறந்த பெட்டி', 'අත් සංඥා: විවෘත චතුරස්රය / විවෘත පෙට්ටිය',                                  10),
(1, 5, 'Hand signals: Circle formation', 'கை சமிக்ஞைகள்: வட்ட உருவாக்கம்', 'හස්ත සංඥා: රවුම් සෑදීම',                                        11),
(1, 5, 'Hand signals: Straight line shoulder to shoulder by patrols', 'Hand signals: Straight line shoulder to shoulder by patrols (TA)', 'Hand signals: Straight line shoulder to shoulder by patrols (SI)',           12);

-- -- Sub-tasks: Req 6 — Knots and Whipping 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 6, 'Reef Knot — know how to tie and explain its use', 'ரீஃப் முடிச்சு - எப்படி கட்டுவது மற்றும் அதன் பயன்பாட்டை விளக்குவது எப்படி என்று தெரியும்', 'Reef Knot - ගැටගැසීමට සහ එහි භාවිතය පැහැදිලි කිරීමට දැන ගන්න',                      1),
(1, 6, 'Sheet Bend — know how to tie and explain its use', 'தாள் வளைவு - எவ்வாறு கட்டுவது மற்றும் அதன் பயன்பாட்டை விளக்குவது எப்படி என்று தெரியும்', 'ෂීට් වංගුව - ගැටගැසීමට සහ එහි භාවිතය පැහැදිලි කරන ආකාරය දැන ගන්න',                     2),
(1, 6, 'Clove Hitch — know how to tie and explain its use', 'கிராம்பு ஹிட்ச் - எப்படி கட்டுவது மற்றும் அதன் பயன்பாட்டை விளக்குவது எப்படி என்று தெரியும்', 'කරාබු නැටි - ගැටගැසීමට සහ එහි භාවිතය පැහැදිලි කිරීමට දන්නවා',                    3),
(1, 6, 'Sheep Shank — know how to tie and explain its use', 'செம்மறி சங்கு - எவ்வாறு கட்டுவது மற்றும் அதன் பயன்பாட்டை விளக்குவது எப்படி என்று தெரியும்', 'බැටළු ෂැන්ක් - ගැටගැසීමට සහ එහි භාවිතය පැහැදිලි කිරීමට දන්නවා',                    4),
(1, 6, 'Bowline — know how to tie and explain its use', 'Bowline — எப்படி கட்டுவது மற்றும் அதன் பயன்பாட்டை விளக்குவது எப்படி என்று தெரியும்', 'Bowline - ගැට ගසන ආකාරය සහ එහි භාවිතය පැහැදිලි කරන්න',                        5),
(1, 6, 'Round Turn and Two Half Hitches — know how to tie and explain', 'ரவுண்ட் டர்ன் மற்றும் டூ ஹாஃப் ஹிட்ச்கள் - எப்படி கட்டுவது மற்றும் விளக்குவது என்று தெரியும்', 'වට හැරීම සහ අර්ධ පහර දෙකක් - ගැටගැසීමට සහ පැහැදිලි කිරීමට දැන ගන්න',        6),
(1, 6, 'Simple Whipping the end of a rope', 'Simple Whipping the end of a rope (TA)', 'Simple Whipping the end of a rope (SI)',                                    7);

-- -- Sub-tasks: Req 7 — Smartness and Good Order 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 7, 'Attention / Alert position', 'கவனம் / எச்சரிக்கை நிலை', 'අවධානය / අනතුරු ඇඟවීමේ ස්ථානය',                                           1),
(1, 7, 'At Ease position', 'எளிதான நிலையில்', 'පහසු ස්ථානයේ',                                                     2),
(1, 7, 'Right Turn', 'வலது திருப்பம்', 'දකුණු හැරීම',                                                           3),
(1, 7, 'Left Turn', 'இடது திருப்பம்', 'වම් හැරීම',                                                            4),
(1, 7, 'About Turn', 'திருப்பம் பற்றி', 'හැරීම ගැන',                                                           5),
(1, 7, 'Salute', 'வணக்கம்', 'ආචාර කරන්න',                                                               6),
(1, 7, 'Disperse', 'Disperse (TA)', 'Disperse (SI)',                                                             7);

-- -- Sub-tasks: Req 8 — Log Book 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 8, 'Start maintaining a personal daily log book', 'தனிப்பட்ட தினசரி பதிவு புத்தகத்தை பராமரிக்கத் தொடங்குங்கள்', 'පුද්ගලික දෛනික ලොග් පොතක් පවත්වාගෙන යාම ආරම්භ කරන්න',                          1),
(1, 8, 'Understand that the Log Book should be the story of Scout life', 'Understand that the Log Book should be the story of Scout life (TA)', 'Understand that the Log Book should be the story of Scout life (SI)',       2);

-- -- Sub-tasks: Req 9 — Simple Health Habits 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 9, 'Know simple rules of health', 'எளிய சுகாதார விதிகளை அறிந்து கொள்ளுங்கள்', 'සෞඛ්යය පිළිබඳ සරල නීති දැන ගන්න',                                          1),
(1, 9, 'Practically apply health habits in daily life', 'Practically apply health habits in daily life (TA)', 'Practically apply health habits in daily life (SI)',                        2);

-- -- Sub-tasks: Req 10 — Safe from Harm 7
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 10, 'Know own and parents address and telephone numbers', 'சொந்த மற்றும் பெற்றோரின் முகவரி மற்றும் தொலைபேசி எண்களை அறிந்து கொள்ளுங்கள்', 'තමන්ගේ සහ දෙමාපියන්ගේ ලිපිනය සහ දුරකථන අංක දැනගන්න',                   1),
(1, 10, 'Walk alone in a permanent route under parental guidance', 'பெற்றோரின் வழிகாட்டுதலின் கீழ் நிரந்தரமான பாதையில் தனியாக நடக்கவும்', 'දෙමාපියන්ගේ මඟපෙන්වීම යටතේ ස්ථිර මාර්ගයක තනිවම ගමන් කරන්න',              2),
(1, 10, 'Recognize different types of harm and know how to protect from them', 'Recognize different types of harm and know how to protect from them (TA)', 'Recognize different types of harm and know how to protect from them (SI)',  3);

-- -- Sub-tasks: Req 11 — Thrift
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 11, 'Know what thrift is', 'சிக்கனம் என்றால் என்ன என்று தெரியும்', 'සකසුරුවම යනු කුමක්දැයි දැන ගන්න',                                                 1),
(1, 11, 'Open or maintain a savings account', 'Open or maintain a savings account (TA)', 'Open or maintain a savings account (SI)',                                  2);

-- -- Sub-tasks: Req 12 — Good Habits 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 12, 'Do a good deed every day', 'Do a good deed every day (TA)', 'Do a good deed every day (SI)',                                            1);

-- -- Sub-tasks: Req 13 — First Aid 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 13, 'Know the purpose of giving First Aid', 'முதலுதவி வழங்குவதன் நோக்கத்தை அறிந்து கொள்ளுங்கள்', 'ප්‍රථමාධාර ලබාදීමේ අරමුණ දැනගන්න',                                1),
(1, 13, 'Know how to clean and dress a simple wound', 'Know how to clean and dress a simple wound (TA)', 'Know how to clean and dress a simple wound (SI)',                          2);

-- -- Sub-tasks: Req 14 — Wood Craft Signs
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(1, 14, 'Know and identify Wood Craft signs', 'மர கைவினை அடையாளங்களை அறிந்து அடையாளம் காணவும்', 'දැව අත්කම් සලකුණු දැන හඳුනා ගන්න',                                  1),
(1, 14, 'Complete a 500m treasure hunt using Wood Craft signs with obstacles', 'Complete a 500m treasure hunt using Wood Craft signs with obstacles (TA)', 'Complete a 500m treasure hunt using Wood Craft signs with obstacles (SI)', 2);

-- -- =============================================================
-- -- BADGE 2 — SCOUT AWARD
-- -- =============================================================

INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(101, 2, NULL, 'Scout Movement in Sri Lanka', 'இலங்கையில் சாரணர் இயக்கம்', 'ශ්‍රී ලංකාවේ බාලදක්ෂ ව්‍යාපාරය',                                  1),
(102, 2, NULL, 'National Flag and National Symbols', 'தேசியக் கொடி மற்றும் தேசிய சின்னங்கள்', 'ජාතික කොඩිය සහ ජාතික සංකේත',                           2),
(103, 2, NULL, 'Simple Health Habits 2', 'Simple Health Habits 2 (TA)', 'Simple Health Habits 2 (SI)',                                       3),
(104, 2, NULL, 'Correct Posture and Habits', 'Correct Posture and Habits (TA)', 'Correct Posture and Habits (SI)',                                   4),
(105, 2, NULL, 'Social Health 1', 'Social Health 1 (TA)', 'Social Health 1 (SI)',                                              5),
(106, 2, NULL, 'Preparation for Flag Break / Hoisting', 'Preparation for Flag Break / Hoisting (TA)', 'Preparation for Flag Break / Hoisting (SI)',                        6),
(107, 2, NULL, 'Knowledge of the Area Around 1 (½ km)', 'Knowledge of the Area Around 1 (½ km) (TA)', 'Knowledge of the Area Around 1 (½ km) (SI)',                        7),
(108, 2, NULL, 'Outdoor Activity (two activities)', 'Outdoor Activity (two activities) (TA)', 'Outdoor Activity (two activities) (SI)',                            8),
(109, 2, NULL, 'Environment Protection for Sustainability', 'Environment Protection for Sustainability (TA)', 'Environment Protection for Sustainability (SI)',                    9),
(110, 2, NULL, 'Safe from Harm 8', 'Safe from Harm 8 (TA)', 'Safe from Harm 8 (SI)',                                             10),
(111, 2, NULL, 'Knots and Lashing 2', 'Knots and Lashing 2 (TA)', 'Knots and Lashing 2 (SI)',                                          11),
(112, 2, NULL, 'Pioneering Work 1', 'Pioneering Work 1 (TA)', 'Pioneering Work 1 (SI)',                                            12),
(113, 2, NULL, 'Compass and Mapping 1', 'Compass and Mapping 1 (TA)', 'Compass and Mapping 1 (SI)',                                        13),
(114, 2, NULL, 'B.P. Exercises', 'B.P. Exercises (TA)', 'B.P. Exercises (SI)',                                               14),
(115, 2, NULL, 'Sense Training', 'Sense Training (TA)', 'Sense Training (SI)',                                               15),
(116, 2, NULL, 'Fifteen Common Trees', 'Fifteen Common Trees (TA)', 'Fifteen Common Trees (SI)',                                         16),
(117, 2, NULL, 'Smartness and Good Order 2', 'Smartness and Good Order 2 (TA)', 'Smartness and Good Order 2 (SI)',                                   17),
(118, 2, NULL, 'First Aid 2', 'First Aid 2 (TA)', 'First Aid 2 (SI)',                                                  18),
(119, 2, NULL, 'IT Literacy 1', 'IT Literacy 1 (TA)', 'IT Literacy 1 (SI)',                                                19),
(120, 2, NULL, 'Link Language Skills 1', 'Link Language Skills 1 (TA)', 'Link Language Skills 1 (SI)',                                       20),
(121, 2, NULL, 'Good Habits 2', 'Good Habits 2 (TA)', 'Good Habits 2 (SI)',                                                21),
(122, 2, NULL, 'Two Nights Camping', 'Two Nights Camping (TA)', 'Two Nights Camping (SI)',                                           22),
(123, 2, NULL, 'One Day Hike of 12km', 'One Day Hike of 12km (TA)', 'One Day Hike of 12km (SI)',                                         23),
(124, 2, NULL, 'Requirements for Sea Scouts and Air Scouts', 'Requirements for Sea Scouts and Air Scouts (TA)', 'Requirements for Sea Scouts and Air Scouts (SI)',                   24);

-- -- Sub-tasks: Req 101 — Scout Movement in Sri Lanka
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 101, 'Know in brief the history of the Scout Movement in Sri Lanka', 'Know in brief the history of the Scout Movement in Sri Lanka (TA)', 'Know in brief the history of the Scout Movement in Sri Lanka (SI)',        1);

-- -- Sub-tasks: Req 102 — National Flag and Symbols
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 102, 'Know the structure, basic meaning, and symbols of the National Flag', 'Know the structure, basic meaning, and symbols of the National Flag (TA)', 'Know the structure, basic meaning, and symbols of the National Flag (SI)', 1),
(2, 102, 'Know about the National Sport', 'Know about the National Sport (TA)', 'Know about the National Sport (SI)',                                       2),
(2, 102, 'Know the National Flower', 'Know the National Flower (TA)', 'Know the National Flower (SI)',                                            3),
(2, 102, 'Know the National Tree', 'Know the National Tree (TA)', 'Know the National Tree (SI)',                                              4),
(2, 102, 'Know the National Bird', 'Know the National Bird (TA)', 'Know the National Bird (SI)',                                              5),
(2, 102, 'Know the Government Crest', 'Know the Government Crest (TA)', 'Know the Government Crest (SI)',                                           6);

-- -- Sub-tasks: Req 103 — Simple Health Habits 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 103, 'Know the importance of applying health guidelines during an epidemic/pandemic', 'Know the importance of applying health guidelines during an epidemic/pandemic (TA)', 'Know the importance of applying health guidelines during an epidemic/pandemic (SI)', 1);

-- -- Sub-tasks: Req 104 — Correct Posture and Habits
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 104, 'Understand correct methods of Standing', 'Understand correct methods of Standing (TA)', 'Understand correct methods of Standing (SI)',                              1),
(2, 104, 'Understand correct methods of Walking', 'Understand correct methods of Walking (TA)', 'Understand correct methods of Walking (SI)',                               2),
(2, 104, 'Understand correct methods of Sitting', 'Understand correct methods of Sitting (TA)', 'Understand correct methods of Sitting (SI)',                               3),
(2, 104, 'Understand correct methods of Carrying a weight', 'Understand correct methods of Carrying a weight (TA)', 'Understand correct methods of Carrying a weight (SI)',                     4),
(2, 104, 'Understand correct methods of Sleeping', 'Understand correct methods of Sleeping (TA)', 'Understand correct methods of Sleeping (SI)',                              5),
(2, 104, 'Know General Smartness norms', 'Know General Smartness norms (TA)', 'Know General Smartness norms (SI)',                                        6),
(2, 104, 'Getting permission before entering a room', 'Getting permission before entering a room (TA)', 'Getting permission before entering a room (SI)',                           7),
(2, 104, 'Thanking others correctly', 'Thanking others correctly (TA)', 'Thanking others correctly (SI)',                                           8),
(2, 104, 'Apologizing correctly', 'Apologizing correctly (TA)', 'Apologizing correctly (SI)',                                               9),
(2, 104, 'Not being proud (humility)', 'Not being proud (humility) (TA)', 'Not being proud (humility) (SI)',                                          10);

-- -- Sub-tasks: Req 105 — Social Health 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 105, 'Understand bad effects of smoking', 'Understand bad effects of smoking (TA)', 'Understand bad effects of smoking (SI)',                                   1),
(2, 105, 'Understand bad effects of consumption of alcohol', 'Understand bad effects of consumption of alcohol (TA)', 'Understand bad effects of consumption of alcohol (SI)',                    2),
(2, 105, 'Understand bad effects of substance abuse (drug use)', 'Understand bad effects of substance abuse (drug use) (TA)', 'Understand bad effects of substance abuse (drug use) (SI)',                3),
(2, 105, 'Understand bad effects of chewing betel', 'Understand bad effects of chewing betel (TA)', 'Understand bad effects of chewing betel (SI)',                             4),
(2, 105, 'Make a poster OR speech of 5 minutes OR essay of 200 words OR poem of 4 verses on prevention of one of the above', 'Make a poster OR speech of 5 minutes OR essay of 200 words OR poem of 4 verses on prevention of one of the above (TA)', 'Make a poster OR speech of 5 minutes OR essay of 200 words OR poem of 4 verses on prevention of one of the above (SI)', 5);

-- -- Sub-tasks: Req 106 — Flag Break
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 106, 'Be able to prepare a flag break', 'Be able to prepare a flag break (TA)', 'Be able to prepare a flag break (SI)',                                     1),
(2, 106, 'Be able to prepare a flag hoisting ceremony', 'Be able to prepare a flag hoisting ceremony (TA)', 'Be able to prepare a flag hoisting ceremony (SI)',                         2);

-- -- Sub-tasks: Req 107 — Know the Area 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 107, 'Know the area within a radius of ½ km from the Scout''s home', 'Know the area within a radius of ½ km from the Scout''s home (TA)', 'Know the area within a radius of ½ km from the Scout''s home (SI)',       1),
(2, 107, 'Direct a stranger to important places indicating distances and directions', 'Direct a stranger to important places indicating distances and directions (TA)', 'Direct a stranger to important places indicating distances and directions (SI)', 2);

-- -- Sub-tasks: Req 108 — Outdoor Activity
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 108, 'Actively take part in two of: Nature ramble, Bird watching, Exploring archaeological/historical places, One day hike with Patrol, or Any similar activity', 'Actively take part in two of: Nature ramble, Bird watching, Exploring archaeological/historical places, One day hike with Patrol, or Any similar activity (TA)', 'Actively take part in two of: Nature ramble, Bird watching, Exploring archaeological/historical places, One day hike with Patrol, or Any similar activity (SI)', 1);

-- -- Sub-tasks: Req 109 — Environment Protection
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 109, 'Understand bad effects of chemical fertilizers, pesticides, and weedicides', 'Understand bad effects of chemical fertilizers, pesticides, and weedicides (TA)', 'Understand bad effects of chemical fertilizers, pesticides, and weedicides (SI)', 1),
(2, 109, 'Understand benefits of using organic fertilizer', 'Understand benefits of using organic fertilizer (TA)', 'Understand benefits of using organic fertilizer (SI)',                     2),
(2, 109, 'Collect information and make a verbal report on organic fertilizer', 'Collect information and make a verbal report on organic fertilizer (TA)', 'Collect information and make a verbal report on organic fertilizer (SI)',  3),
(2, 109, 'Understand the basics of making a compost pit', 'Understand the basics of making a compost pit (TA)', 'Understand the basics of making a compost pit (SI)',                       4),
(2, 109, 'Plant a tree, maintain and protect it', 'Plant a tree, maintain and protect it (TA)', 'Plant a tree, maintain and protect it (SI)',                               5);

-- -- Sub-tasks: Req 110 — Safe from Harm 8
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 110, 'Help a younger scout contact his/her parents', 'Help a younger scout contact his/her parents (TA)', 'Help a younger scout contact his/her parents (SI)',                        1),
(2, 110, 'Know the Emergency Ambulance and Emergency Police numbers', 'Know the Emergency Ambulance and Emergency Police numbers (TA)', 'Know the Emergency Ambulance and Emergency Police numbers (SI)',           2),
(2, 110, 'Know the different areas of Safety', 'Know the different areas of Safety (TA)', 'Know the different areas of Safety (SI)',                                  3),
(2, 110, 'Know methods of reporting abuse or harassment to the Patrol', 'Know methods of reporting abuse or harassment to the Patrol (TA)', 'Know methods of reporting abuse or harassment to the Patrol (SI)',         4),
(2, 110, 'Know what to do if you get lost', 'Know what to do if you get lost (TA)', 'Know what to do if you get lost (SI)',                                     5);

-- -- Sub-tasks: Req 111 — Knots and Lashing 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 111, 'Fisherman''s Knot — tie and explain practical use', 'Fisherman''s Knot — tie and explain practical use (TA)', 'Fisherman''s Knot — tie and explain practical use (SI)',                  1),
(2, 111, 'Man Harness Knot — tie and explain practical use', 'Man Harness Knot — tie and explain practical use (TA)', 'Man Harness Knot — tie and explain practical use (SI)',                   2),
(2, 111, 'Timber Hitch — tie and explain practical use', 'Timber Hitch — tie and explain practical use (TA)', 'Timber Hitch — tie and explain practical use (SI)',                       3),
(2, 111, 'Tie Knot — tie and explain practical use', 'Tie Knot — tie and explain practical use (TA)', 'Tie Knot — tie and explain practical use (SI)',                           4),
(2, 111, 'Square Lashing — tie and explain practical use', 'Square Lashing — tie and explain practical use (TA)', 'Square Lashing — tie and explain practical use (SI)',                     5),
(2, 111, 'Diagonal Lashing — tie and explain practical use', 'Diagonal Lashing — tie and explain practical use (TA)', 'Diagonal Lashing — tie and explain practical use (SI)',                   6),
(2, 111, 'Sheer Lashing — tie and explain practical use', 'Sheer Lashing — tie and explain practical use (TA)', 'Sheer Lashing — tie and explain practical use (SI)',                      7);

-- -- Sub-tasks: Req 112 — Pioneering Work 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 112, 'Make a Trestle', 'Make a Trestle (TA)', 'Make a Trestle (SI)',                                                      1),
(2, 112, 'Make a Portable Flag Mast', 'Make a Portable Flag Mast (TA)', 'Make a Portable Flag Mast (SI)',                                           2),
(2, 112, 'Know about the parts of a rope', 'Know about the parts of a rope (TA)', 'Know about the parts of a rope (SI)',                                      3);

-- -- Sub-tasks: Req 113 — Compass and Mapping 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 113, 'Know how a magnetic compass works', 'Know how a magnetic compass works (TA)', 'Know how a magnetic compass works (SI)',                                   1),
(2, 113, 'Show the basic 16 directions on a compass', 'Show the basic 16 directions on a compass (TA)', 'Show the basic 16 directions on a compass (SI)',                           2),
(2, 113, 'Show the key elements of a map', 'Show the key elements of a map (TA)', 'Show the key elements of a map (SI)',                                      3),
(2, 113, 'Know the conventional signs of a map', 'Know the conventional signs of a map (TA)', 'Know the conventional signs of a map (SI)',                                4),
(2, 113, 'Know how to use GPS (Global Positioning System)', 'Know how to use GPS (Global Positioning System) (TA)', 'Know how to use GPS (Global Positioning System) (SI)',                     5);

-- -- Sub-tasks: Req 114 — BP Exercises
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 114, 'Maintain a healthy body as part of daily routine with the 6 exercises introduced by Lord Baden Powell', 'Maintain a healthy body as part of daily routine with the 6 exercises introduced by Lord Baden Powell (TA)', 'Maintain a healthy body as part of daily routine with the 6 exercises introduced by Lord Baden Powell (SI)', 1);

-- -- Sub-tasks: Req 115 — Sense Training
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 115, 'Kim''s Game — Vision', 'Kim''s Game — Vision (TA)', 'Kim''s Game — Vision (SI)',                                                1),
(2, 115, 'Smell, touch, taste, and hearing training', 'Smell, touch, taste, and hearing training (TA)', 'Smell, touch, taste, and hearing training (SI)',                           2);

-- -- Sub-tasks: Req 116 — Fifteen Common Trees
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 116, 'Identify 15 useful trees', 'Identify 15 useful trees (TA)', 'Identify 15 useful trees (SI)',                                            1),
(2, 116, 'Mention the location of these trees', 'Mention the location of these trees (TA)', 'Mention the location of these trees (SI)',                                 2),
(2, 116, 'Mention the botanical name of these trees', 'Mention the botanical name of these trees (TA)', 'Mention the botanical name of these trees (SI)',                           3);

-- -- Sub-tasks: Req 117 — Smartness and Good Order 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 117, 'March 50 metres correctly with the Patrol', 'March 50 metres correctly with the Patrol (TA)', 'March 50 metres correctly with the Patrol (SI)',                           1),
(2, 117, 'Squad drill including marking time', 'Squad drill including marking time (TA)', 'Squad drill including marking time (SI)',                                  2),
(2, 117, 'Drills with the staff', 'Drills with the staff (TA)', 'Drills with the staff (SI)',                                               3);

-- -- Sub-tasks: Req 118 — First Aid 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 118, 'Explain what D.R.S.A.B.C. stands for', 'Explain what D.R.S.A.B.C. stands for (TA)', 'Explain what D.R.S.A.B.C. stands for (SI)',                               1),
(2, 118, 'Put an unconscious person in the Recovery Position', 'Put an unconscious person in the Recovery Position (TA)', 'Put an unconscious person in the Recovery Position (SI)',                  2),
(2, 118, 'Explain how CPR (Cardiopulmonary Resuscitation) is given', 'Explain how CPR (Cardiopulmonary Resuscitation) is given (TA)', 'Explain how CPR (Cardiopulmonary Resuscitation) is given (SI)',            3),
(2, 118, 'Demonstrate three methods of carrying a casualty with help of another', 'Demonstrate three methods of carrying a casualty with help of another (TA)', 'Demonstrate three methods of carrying a casualty with help of another (SI)', 4),
(2, 118, 'Demonstrate the Fireman''s Lift', 'Demonstrate the Fireman''s Lift (TA)', 'Demonstrate the Fireman''s Lift (SI)',                                    5);

-- -- Sub-tasks: Req 119 — IT Literacy 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 119, 'Basic knowledge on key input/output devices of a computer', 'Basic knowledge on key input/output devices of a computer (TA)', 'Basic knowledge on key input/output devices of a computer (SI)',           1),
(2, 119, 'Knowledge about basic usage of a computer', 'Knowledge about basic usage of a computer (TA)', 'Knowledge about basic usage of a computer (SI)',                           2),
(2, 119, 'Knowledge about basic storage methods of information', 'Knowledge about basic storage methods of information (TA)', 'Knowledge about basic storage methods of information (SI)',                3);

-- -- Sub-tasks: Req 120 — Link Language Skills 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 120, 'Learn the alphabet of two languages', 'Learn the alphabet of two languages (TA)', 'Learn the alphabet of two languages (SI)',                                 1),
(2, 120, 'Learn at least 15 words used in day-to-day life in all three languages', 'Learn at least 15 words used in day-to-day life in all three languages (TA)', 'Learn at least 15 words used in day-to-day life in all three languages (SI)', 2);

-- -- Sub-tasks: Req 121 — Good Habits 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 121, 'Get involved in a small-scale Community Service project with Patrol (at least one hour)', 'Get involved in a small-scale Community Service project with Patrol (at least one hour) (TA)', 'Get involved in a small-scale Community Service project with Patrol (at least one hour) (SI)', 1),
(2, 121, 'Write at least 5 sentences about the service in the Log Book', 'Write at least 5 sentences about the service in the Log Book (TA)', 'Write at least 5 sentences about the service in the Log Book (SI)',        2);

-- -- Sub-tasks: Req 122 — Two Nights Camping
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 122, 'Have two nights camping experience (in tent)', 'Have two nights camping experience (in tent) (TA)', 'Have two nights camping experience (in tent) (SI)',                        1),
(2, 122, 'Make a fire using firewood and only two match sticks', 'Make a fire using firewood and only two match sticks (TA)', 'Make a fire using firewood and only two match sticks (SI)',                2),
(2, 122, 'Make tea for the Patrol using the campfire', 'Make tea for the Patrol using the campfire (TA)', 'Make tea for the Patrol using the campfire (SI)',                          3);

-- -- Sub-tasks: Req 123 — One Day Hike 12km
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 123, 'Complete a one day hike of 12km', 'Complete a one day hike of 12km (TA)', 'Complete a one day hike of 12km (SI)',                                     1);

-- -- Sub-tasks: Req 124 — Sea/Air Scouts
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(2, 124, 'Sea Scouts: Explain parts of a ship (Aft, Fore Castle, Port, Starboard)', 'Sea Scouts: Explain parts of a ship (Aft, Fore Castle, Port, Starboard) (TA)', 'Sea Scouts: Explain parts of a ship (Aft, Fore Castle, Port, Starboard) (SI)', 1),
(2, 124, 'Sea Scouts: Explain why the Phonetic Alphabet is used by Seamen', 'Sea Scouts: Explain why the Phonetic Alphabet is used by Seamen (TA)', 'Sea Scouts: Explain why the Phonetic Alphabet is used by Seamen (SI)',    2),
(2, 124, 'Air Scouts: Understand and explain Fuselage, Tail, Main plane, Port and Starboard', 'Air Scouts: Understand and explain Fuselage, Tail, Main plane, Port and Starboard (TA)', 'Air Scouts: Understand and explain Fuselage, Tail, Main plane, Port and Starboard (SI)', 3),
(2, 124, 'Air Scouts: Know the difference between Ground Speed and Air Speed', 'Air Scouts: Know the difference between Ground Speed and Air Speed (TA)', 'Air Scouts: Know the difference between Ground Speed and Air Speed (SI)', 4),
(2, 124, 'Air Scouts: Know how wind is used in take-off and landing', 'Air Scouts: Know how wind is used in take-off and landing (TA)', 'Air Scouts: Know how wind is used in take-off and landing (SI)',          5);

-- -- =============================================================
-- -- BADGE 3 — CHIEF COMMISSIONER'S AWARD
-- -- =============================================================

INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(201, 3, NULL, 'Thrift — Savings Account 2', 'Thrift — Savings Account 2 (TA)', 'Thrift — Savings Account 2 (SI)',                                   1),
(202, 3, NULL, 'Skills in Art and Hobbies 1', 'Skills in Art and Hobbies 1 (TA)', 'Skills in Art and Hobbies 1 (SI)',                                  2),
(203, 3, NULL, 'Knots and Whipping 3', 'Knots and Whipping 3 (TA)', 'Knots and Whipping 3 (SI)',                                         3),
(204, 3, NULL, 'Types of Fire Places and LP Gas Safety', 'Types of Fire Places and LP Gas Safety (TA)', 'Types of Fire Places and LP Gas Safety (SI)',                       4),
(205, 3, NULL, 'Pioneering Project 2', 'Pioneering Project 2 (TA)', 'Pioneering Project 2 (SI)',                                         5),
(206, 3, NULL, 'Tracks — Identification and Plaster Casts', 'Tracks — Identification and Plaster Casts (TA)', 'Tracks — Identification and Plaster Casts (SI)',                    6),
(207, 3, NULL, 'Compass and Mapping 2', 'Compass and Mapping 2 (TA)', 'Compass and Mapping 2 (SI)',                                        7),
(208, 3, NULL, 'Estimation of Heights, Lengths, and Weights', 'Estimation of Heights, Lengths, and Weights (TA)', 'Estimation of Heights, Lengths, and Weights (SI)',                  8),
(209, 3, NULL, 'Use of Different Tools', 'Use of Different Tools (TA)', 'Use of Different Tools (SI)',                                       9),
(210, 3, NULL, 'Ten Common Birds', 'Ten Common Birds (TA)', 'Ten Common Birds (SI)',                                             10),
(211, 3, NULL, 'Swimming 50m or Alternate Skill', 'Swimming 50m or Alternate Skill (TA)', 'Swimming 50m or Alternate Skill (SI)',                              11),
(212, 3, NULL, 'Smartness and Good Order 3', 'Smartness and Good Order 3 (TA)', 'Smartness and Good Order 3 (SI)',                                   12),
(213, 3, NULL, 'Social Health 2', 'Social Health 2 (TA)', 'Social Health 2 (SI)',                                              13),
(214, 3, NULL, 'Highway Code', 'Highway Code (TA)', 'Highway Code (SI)',                                                 14),
(215, 3, NULL, 'IT Literacy 2', 'IT Literacy 2 (TA)', 'IT Literacy 2 (SI)',                                                15),
(216, 3, NULL, 'Knowledge of the Area Around 2 (1 km sketch map)', 'Knowledge of the Area Around 2 (1 km sketch map) (TA)', 'Knowledge of the Area Around 2 (1 km sketch map) (SI)',             16),
(217, 3, NULL, 'Scout Vision and Mission', 'Scout Vision and Mission (TA)', 'Scout Vision and Mission (SI)',                                     17),
(218, 3, NULL, 'First Aid 3', 'First Aid 3 (TA)', 'First Aid 3 (SI)',                                                  18),
(219, 3, NULL, 'Safe from Harm 9', 'Safe from Harm 9 (TA)', 'Safe from Harm 9 (SI)',                                             19),
(220, 3, NULL, 'Environment Protection Activity — 10R Method', 'Environment Protection Activity — 10R Method (TA)', 'Environment Protection Activity — 10R Method (SI)',                 20),
(221, 3, NULL, 'Link Language Skills 2', 'Link Language Skills 2 (TA)', 'Link Language Skills 2 (SI)',                                       21),
(222, 3, NULL, 'Two Nights Week-end Camping', 'Two Nights Week-end Camping (TA)', 'Two Nights Week-end Camping (SI)',                                  22),
(223, 3, NULL, 'District Commissioner''s Hike (22km, one night)', 'District Commissioner''s Hike (22km, one night) (TA)', 'District Commissioner''s Hike (22km, one night) (SI)',              23),
(224, 3, NULL, 'Requirements for Sea Scouts and Air Scouts', 'Requirements for Sea Scouts and Air Scouts (TA)', 'Requirements for Sea Scouts and Air Scouts (SI)',                   24);

-- -- Sub-tasks: Req 201 — Thrift 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 201, 'Continue to maintain the savings account', 'Continue to maintain the savings account (TA)', 'Continue to maintain the savings account (SI)',                            1);

-- -- Sub-tasks: Req 202 — Art and Hobbies 1
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 202, 'Show ability in one of: Singing, Playing a musical instrument, Music Composing', 'Show ability in one of: Singing, Playing a musical instrument, Music Composing (TA)', 'Show ability in one of: Singing, Playing a musical instrument, Music Composing (SI)', 1),
(3, 202, 'OR show ability in: Dancing, Acting', 'OR show ability in: Dancing, Acting (TA)', 'OR show ability in: Dancing, Acting (SI)',                                2),
(3, 202, 'OR show ability in: Drawing, Painting, Sculpturing', 'OR show ability in: Drawing, Painting, Sculpturing (TA)', 'OR show ability in: Drawing, Painting, Sculpturing (SI)',                  3),
(3, 202, 'OR show ability in: Graphic Designing, Video Editing, Animations, PowerPoint Presentations', 'OR show ability in: Graphic Designing, Video Editing, Animations, PowerPoint Presentations (TA)', 'OR show ability in: Graphic Designing, Video Editing, Animations, PowerPoint Presentations (SI)', 4),
(3, 202, 'OR show ability in any other hobby', 'OR show ability in any other hobby (TA)', 'OR show ability in any other hobby (SI)',                                  5);

-- -- Sub-tasks: Req 203 — Knots and Whipping 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 203, 'Fireman''s Chair Knot — tie and explain practical use', 'Fireman''s Chair Knot — tie and explain practical use (TA)', 'Fireman''s Chair Knot — tie and explain practical use (SI)',              1),
(3, 203, 'Rolling Hitch — tie and explain practical use', 'Rolling Hitch — tie and explain practical use (TA)', 'Rolling Hitch — tie and explain practical use (SI)',                      2),
(3, 203, 'Double Sheet Bend — tie and explain practical use', 'Double Sheet Bend — tie and explain practical use (TA)', 'Double Sheet Bend — tie and explain practical use (SI)',                  3),
(3, 203, 'Bowline on a Bight — tie and explain practical use', 'Bowline on a Bight — tie and explain practical use (TA)', 'Bowline on a Bight — tie and explain practical use (SI)',                 4),
(3, 203, 'Highwayman''s Hitch — tie and explain practical use', 'Highwayman''s Hitch — tie and explain practical use (TA)', 'Highwayman''s Hitch — tie and explain practical use (SI)',               5),
(3, 203, 'Sail Maker''s Whipping — demonstrate', 'Sail Maker''s Whipping — demonstrate (TA)', 'Sail Maker''s Whipping — demonstrate (SI)',                               6);

-- -- Sub-tasks: Req 204 — Fire Places
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 204, 'Maintain and safely use LP Gas cookers', 'Maintain and safely use LP Gas cookers (TA)', 'Maintain and safely use LP Gas cookers (SI)',                              1),
(3, 204, 'Know dangers and safety precautions for LP gas', 'Know dangers and safety precautions for LP gas (TA)', 'Know dangers and safety precautions for LP gas (SI)',                      2),
(3, 204, 'Know the uses of Altar Fire', 'Know the uses of Altar Fire (TA)', 'Know the uses of Altar Fire (SI)',                                         3),
(3, 204, 'Know the uses of Star Fire', 'Know the uses of Star Fire (TA)', 'Know the uses of Star Fire (SI)',                                          4),
(3, 204, 'Know the uses of Tripod Fire', 'Know the uses of Tripod Fire (TA)', 'Know the uses of Tripod Fire (SI)',                                        5),
(3, 204, 'Know the uses of Crane Fire', 'Know the uses of Crane Fire (TA)', 'Know the uses of Crane Fire (SI)',                                         6),
(3, 204, 'Know the uses of Reflector Fire', 'Know the uses of Reflector Fire (TA)', 'Know the uses of Reflector Fire (SI)',                                     7),
(3, 204, 'Know the uses of Trench Fire', 'Know the uses of Trench Fire (TA)', 'Know the uses of Trench Fire (SI)',                                        8);

-- -- Sub-tasks: Req 205 — Pioneering Project 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 205, 'Know what is meant by a Pioneering project in Scouting', 'Know what is meant by a Pioneering project in Scouting (TA)', 'Know what is meant by a Pioneering project in Scouting (SI)',             1),
(3, 205, 'Know basic skills necessary for a Pioneering project', 'Know basic skills necessary for a Pioneering project (TA)', 'Know basic skills necessary for a Pioneering project (SI)',               2),
(3, 205, 'Know different types of ropes', 'Know different types of ropes (TA)', 'Know different types of ropes (SI)',                                       3),
(3, 205, 'Know how to care, protect, and store ropes', 'Know how to care, protect, and store ropes (TA)', 'Know how to care, protect, and store ropes (SI)',                          4),
(3, 205, 'Construct a Tripod structure', 'Construct a Tripod structure (TA)', 'Construct a Tripod structure (SI)',                                        5),
(3, 205, 'Construct a Trestle structure', 'Construct a Trestle structure (TA)', 'Construct a Trestle structure (SI)',                                       6),
(3, 205, 'Construct an A-Frame structure', 'Construct an A-Frame structure (TA)', 'Construct an A-Frame structure (SI)',                                      7),
(3, 205, 'Take part in building camp gateways and camp utility gadgets', 'Take part in building camp gateways and camp utility gadgets (TA)', 'Take part in building camp gateways and camp utility gadgets (SI)',        8);

-- -- Sub-tasks: Req 206 — Tracks
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 206, 'Identify parts of a human footprint, shoe print, animal and bird footprints', 'Identify parts of a human footprint, shoe print, animal and bird footprints (TA)', 'Identify parts of a human footprint, shoe print, animal and bird footprints (SI)', 1),
(3, 206, 'Observe footprints on different surfaces and explain what caused them', 'Observe footprints on different surfaces and explain what caused them (TA)', 'Observe footprints on different surfaces and explain what caused them (SI)', 2),
(3, 206, 'Make plaster casts of footprints using Plaster of Paris', 'Make plaster casts of footprints using Plaster of Paris (TA)', 'Make plaster casts of footprints using Plaster of Paris (SI)',             3),
(3, 206, 'Know tracking as given in Camp Fire Yarn No. 12', 'Know tracking as given in Camp Fire Yarn No. 12 (TA)', 'Know tracking as given in Camp Fire Yarn No. 12 (SI)',                     4);

-- -- Sub-tasks: Req 207 — Compass and Mapping 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 207, 'Set a map correctly', 'Set a map correctly (TA)', 'Set a map correctly (SI)',                                                  1),
(3, 207, 'Make a rough map to scale using a compass or GPS', 'Make a rough map to scale using a compass or GPS (TA)', 'Make a rough map to scale using a compass or GPS (SI)',                    2);

-- -- Sub-tasks: Req 208 — Estimation
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 208, 'Know the length of the Scout''s hand, fingers, and foot for measurements', 'Know the length of the Scout''s hand, fingers, and foot for measurements (TA)', 'Know the length of the Scout''s hand, fingers, and foot for measurements (SI)', 1),
(3, 208, 'Use the Shadow method to estimate a height', 'Use the Shadow method to estimate a height (TA)', 'Use the Shadow method to estimate a height (SI)',                           2),
(3, 208, 'Use the 10:1 method to estimate a height', 'Use the 10:1 method to estimate a height (TA)', 'Use the 10:1 method to estimate a height (SI)',                            3),
(3, 208, 'Use one other method to estimate a height', 'Use one other method to estimate a height (TA)', 'Use one other method to estimate a height (SI)',                           4),
(3, 208, 'Use Triangle method or Napoleon method to estimate a length', 'Use Triangle method or Napoleon method to estimate a length (TA)', 'Use Triangle method or Napoleon method to estimate a length (SI)',         5),
(3, 208, 'Estimate a weight', 'Estimate a weight (TA)', 'Estimate a weight (SI)',                                                   6);

-- -- Sub-tasks: Req 209 — Use of Different Tools
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 209, 'Safely use and maintain a Hand Axe', 'Safely use and maintain a Hand Axe (TA)', 'Safely use and maintain a Hand Axe (SI)',                                  1),
(3, 209, 'Safely use and maintain a Saw', 'Safely use and maintain a Saw (TA)', 'Safely use and maintain a Saw (SI)',                                       2),
(3, 209, 'Safely use and maintain a Knife', 'Safely use and maintain a Knife (TA)', 'Safely use and maintain a Knife (SI)',                                     3),
(3, 209, 'Safely use and maintain a Hammer', 'Safely use and maintain a Hammer (TA)', 'Safely use and maintain a Hammer (SI)',                                    4),
(3, 209, 'Safely use and maintain a Mallet', 'Safely use and maintain a Mallet (TA)', 'Safely use and maintain a Mallet (SI)',                                    5);

-- -- Sub-tasks: Req 210 — Ten Common Birds
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 210, 'Observe 10 types of birds', 'Observe 10 types of birds (TA)', 'Observe 10 types of birds (SI)',                                           1),
(3, 210, 'Collect data on colours, body sizes, and warbling sounds of 10 birds', 'Collect data on colours, body sizes, and warbling sounds of 10 birds (TA)', 'Collect data on colours, body sizes, and warbling sounds of 10 birds (SI)',2),
(3, 210, 'Record habitat, colour of eggs, shape of feet, and shape of beaks', 'Record habitat, colour of eggs, shape of feet, and shape of beaks (TA)', 'Record habitat, colour of eggs, shape of feet, and shape of beaks (SI)',   3);

-- -- Sub-tasks: Req 211 — Swimming / Alternate Skill
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 211, 'Swim 50 metres (compulsory for Sea Scouts)', 'Swim 50 metres (compulsory for Sea Scouts) (TA)', 'Swim 50 metres (compulsory for Sea Scouts) (SI)',                          1),
(3, 211, 'OR win one badge from Farmer, Explorer, or Education Group', 'OR win one badge from Farmer, Explorer, or Education Group (TA)', 'OR win one badge from Farmer, Explorer, or Education Group (SI)',          2),
(3, 211, 'OR win Sportsman / Senior Sportsman or Athlete / Senior Athlete badge', 'OR win Sportsman / Senior Sportsman or Athlete / Senior Athlete badge (TA)', 'OR win Sportsman / Senior Sportsman or Athlete / Senior Athlete badge (SI)', 3),
(3, 211, 'Air Scouts may do a badge from the Airman Group instead', 'Air Scouts may do a badge from the Airman Group instead (TA)', 'Air Scouts may do a badge from the Airman Group instead (SI)',             4);

-- -- Sub-tasks: Req 212 — Smartness and Good Order 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 212, 'March 100 metres correctly with the Patrol while saluting and eyes right', 'March 100 metres correctly with the Patrol while saluting and eyes right (TA)', 'March 100 metres correctly with the Patrol while saluting and eyes right (SI)', 1),
(3, 212, 'Participate in a squad giving a street line or guard of honour', 'Participate in a squad giving a street line or guard of honour (TA)', 'Participate in a squad giving a street line or guard of honour (SI)',       2);

-- -- Sub-tasks: Req 213 — Social Health 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 213, 'Plan and carry out a Patrol activity preventing Smoking', 'Plan and carry out a Patrol activity preventing Smoking (TA)', 'Plan and carry out a Patrol activity preventing Smoking (SI)',             1),
(3, 213, 'Plan and carry out a Patrol activity preventing Use of Alcohol', 'Plan and carry out a Patrol activity preventing Use of Alcohol (TA)', 'Plan and carry out a Patrol activity preventing Use of Alcohol (SI)',      2),
(3, 213, 'Plan and carry out a Patrol activity preventing Drug Abuse', 'Plan and carry out a Patrol activity preventing Drug Abuse (TA)', 'Plan and carry out a Patrol activity preventing Drug Abuse (SI)',          3);

-- -- Sub-tasks: Req 214 — Highway Code
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 214, 'Know the Highway Code as indicated in the rules of the Department of Motor Traffic', 'Know the Highway Code as indicated in the rules of the Department of Motor Traffic (TA)', 'Know the Highway Code as indicated in the rules of the Department of Motor Traffic (SI)', 1);

-- -- Sub-tasks: Req 215 — IT Literacy 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 215, 'Basic knowledge on word processing', 'Basic knowledge on word processing (TA)', 'Basic knowledge on word processing (SI)',                                  1),
(3, 215, 'Basic knowledge on spreadsheets', 'Basic knowledge on spreadsheets (TA)', 'Basic knowledge on spreadsheets (SI)',                                     2),
(3, 215, 'Know safety precautions when using the internet', 'Know safety precautions when using the internet (TA)', 'Know safety precautions when using the internet (SI)',                     3),
(3, 215, 'Know the etiquette when using the internet', 'Know the etiquette when using the internet (TA)', 'Know the etiquette when using the internet (SI)',                          4);

-- -- Sub-tasks: Req 216 — Knowledge of Area 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 216, 'Draw a rough sketch map of the area within 1km radius from the Scout''s home', 'Draw a rough sketch map of the area within 1km radius from the Scout''s home (TA)', 'Draw a rough sketch map of the area within 1km radius from the Scout''s home (SI)', 1);

-- -- Sub-tasks: Req 217 — Scout Vision and Mission
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 217, 'Write or explain the Vision/Purpose statement of the Sri Lanka Scout Association', 'Write or explain the Vision/Purpose statement of the Sri Lanka Scout Association (TA)', 'Write or explain the Vision/Purpose statement of the Sri Lanka Scout Association (SI)', 1),
(3, 217, 'Write or explain the Mission statement of the World Scout Organisation', 'Write or explain the Mission statement of the World Scout Organisation (TA)', 'Write or explain the Mission statement of the World Scout Organisation (SI)', 2);

-- -- Sub-tasks: Req 218 — First Aid 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 218, 'Give First Aid for Shock', 'Give First Aid for Shock (TA)', 'Give First Aid for Shock (SI)',                                            1),
(3, 218, 'Give First Aid for Fainting', 'Give First Aid for Fainting (TA)', 'Give First Aid for Fainting (SI)',                                         2),
(3, 218, 'Give First Aid for Bleeding from the nose', 'Give First Aid for Bleeding from the nose (TA)', 'Give First Aid for Bleeding from the nose (SI)',                           3),
(3, 218, 'Give First Aid for Stings and Bites', 'Give First Aid for Stings and Bites (TA)', 'Give First Aid for Stings and Bites (SI)',                                 4),
(3, 218, 'Give First Aid for Minor Cuts', 'Give First Aid for Minor Cuts (TA)', 'Give First Aid for Minor Cuts (SI)',                                       5),
(3, 218, 'Give First Aid for Burns', 'Give First Aid for Burns (TA)', 'Give First Aid for Burns (SI)',                                            6),
(3, 218, 'Give First Aid for Scalding', 'Give First Aid for Scalding (TA)', 'Give First Aid for Scalding (SI)',                                         7),
(3, 218, 'Give First Aid for Drowning', 'Give First Aid for Drowning (TA)', 'Give First Aid for Drowning (SI)',                                         8),
(3, 218, 'Give First Aid for Control of sudden Fire', 'Give First Aid for Control of sudden Fire (TA)', 'Give First Aid for Control of sudden Fire (SI)',                           9),
(3, 218, 'Give First Aid for Electric Shock', 'Give First Aid for Electric Shock (TA)', 'Give First Aid for Electric Shock (SI)',                                   10),
(3, 218, 'Know when and where AED (Automated External Defibrillator) is used', 'Know when and where AED (Automated External Defibrillator) is used (TA)', 'Know when and where AED (Automated External Defibrillator) is used (SI)',  11);

-- -- Sub-tasks: Req 219 — Safe from Harm 9
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 219, 'Help a lost child by calling his/her parents', 'Help a lost child by calling his/her parents (TA)', 'Help a lost child by calling his/her parents (SI)',                        1),
(3, 219, 'Know how to tell someone if you are in trouble', 'Know how to tell someone if you are in trouble (TA)', 'Know how to tell someone if you are in trouble (SI)',                      2),
(3, 219, 'Know the Emergency Ambulance, Police, and Fire Rescue numbers', 'Know the Emergency Ambulance, Police, and Fire Rescue numbers (TA)', 'Know the Emergency Ambulance, Police, and Fire Rescue numbers (SI)',       3),
(3, 219, 'Be aware of School Emergency Procedures', 'Be aware of School Emergency Procedures (TA)', 'Be aware of School Emergency Procedures (SI)',                             4),
(3, 219, 'Know how to handle emergency situations at home', 'Know how to handle emergency situations at home (TA)', 'Know how to handle emergency situations at home (SI)',                     5),
(3, 219, 'Know risky behaviour and how to prevent it in the Troop', 'Know risky behaviour and how to prevent it in the Troop (TA)', 'Know risky behaviour and how to prevent it in the Troop (SI)',             6);

-- -- Sub-tasks: Req 220 — 10R Environment
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 220, 'Refuse — know this method and apply it', 'Refuse — know this method and apply it (TA)', 'Refuse — know this method and apply it (SI)',                              1),
(3, 220, 'Reduce — know this method and apply it', 'Reduce — know this method and apply it (TA)', 'Reduce — know this method and apply it (SI)',                              2),
(3, 220, 'Reuse — know this method and apply it', 'Reuse — know this method and apply it (TA)', 'Reuse — know this method and apply it (SI)',                               3),
(3, 220, 'Repair — know this method and apply it', 'Repair — know this method and apply it (TA)', 'Repair — know this method and apply it (SI)',                              4),
(3, 220, 'Replace — know this method and apply it', 'Replace — know this method and apply it (TA)', 'Replace — know this method and apply it (SI)',                             5),
(3, 220, 'Recycle — know this method and apply it', 'Recycle — know this method and apply it (TA)', 'Recycle — know this method and apply it (SI)',                             6),
(3, 220, 'Rethink — know this method and apply it', 'Rethink — know this method and apply it (TA)', 'Rethink — know this method and apply it (SI)',                             7),
(3, 220, 'Remember — know this method and apply it', 'Remember — know this method and apply it (TA)', 'Remember — know this method and apply it (SI)',                            8),
(3, 220, 'Repeat — know this method and apply it', 'Repeat — know this method and apply it (TA)', 'Repeat — know this method and apply it (SI)',                              9),
(3, 220, 'Reject — know this method and apply it', 'Reject — know this method and apply it (TA)', 'Reject — know this method and apply it (SI)',                              10),
(3, 220, 'Collect data on 10R and be able to explain', 'Collect data on 10R and be able to explain (TA)', 'Collect data on 10R and be able to explain (SI)',                          11);

-- -- Sub-tasks: Req 221 — Link Language Skills 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 221, 'Construct 20 simple sentences using the other two languages (not Scout''s own language)', 'Construct 20 simple sentences using the other two languages (not Scout''s own language) (TA)', 'Construct 20 simple sentences using the other two languages (not Scout''s own language) (SI)', 1);

-- -- Sub-tasks: Req 222 — Two Nights Weekend Camping
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 222, 'Take part in a week-end camp with the Patrol or Troop of at least two nights', 'Take part in a week-end camp with the Patrol or Troop of at least two nights (TA)', 'Take part in a week-end camp with the Patrol or Troop of at least two nights (SI)', 1);

-- -- Sub-tasks: Req 223 — DC Hike
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 223, 'Complete DC''s Hike (one night and 22km) after completing requirements 1 to 22', 'Complete DC''s Hike (one night and 22km) after completing requirements 1 to 22 (TA)', 'Complete DC''s Hike (one night and 22km) after completing requirements 1 to 22 (SI)', 1),
(3, 223, 'Complete DC''s Hike before the age of 14 years and 6 months (Junior Scout)', 'Complete DC''s Hike before the age of 14 years and 6 months (Junior Scout) (TA)', 'Complete DC''s Hike before the age of 14 years and 6 months (Junior Scout) (SI)', 2);

-- -- Sub-tasks: Req 224 — Sea/Air Scouts (CCA)
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(3, 224, 'Sea Scouts: Demonstrate Running Bowline and Blackwell Hitch', 'Sea Scouts: Demonstrate Running Bowline and Blackwell Hitch (TA)', 'Sea Scouts: Demonstrate Running Bowline and Blackwell Hitch (SI)',         1),
(3, 224, 'Sea Scouts: Understand the Phonetic Alphabet', 'Sea Scouts: Understand the Phonetic Alphabet (TA)', 'Sea Scouts: Understand the Phonetic Alphabet (SI)',                        2),
(3, 224, 'Air Scouts: Understand and demonstrate the Phonetic Alphabet', 'Air Scouts: Understand and demonstrate the Phonetic Alphabet (TA)', 'Air Scouts: Understand and demonstrate the Phonetic Alphabet (SI)',        3);

-- -- =============================================================
-- -- BADGE 4 — PRIME MINISTER'S SCOUT AWARD
-- -- =============================================================

INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(301, 4, NULL, 'Scout Promise and Scout Law 2', 'Scout Promise and Scout Law 2 (TA)', 'Scout Promise and Scout Law 2 (SI)',                                 1),
(302, 4, NULL, 'Structure of the WOSM', 'Structure of the WOSM (TA)', 'Structure of the WOSM (SI)',                                        2),
(303, 4, NULL, 'Thrift — Savings Account 3', 'Thrift — Savings Account 3 (TA)', 'Thrift — Savings Account 3 (SI)',                                   3),
(304, 4, NULL, 'Public Consciousness and Protection of Public Property', 'Public Consciousness and Protection of Public Property (TA)', 'Public Consciousness and Protection of Public Property (SI)',        4),
(305, 4, NULL, 'Skills in Arts and Hobbies 2', 'Skills in Arts and Hobbies 2 (TA)', 'Skills in Arts and Hobbies 2 (SI)',                                 5),
(306, 4, NULL, 'Backwoodsman Cooking', 'Backwoodsman Cooking (TA)', 'Backwoodsman Cooking (SI)',                                         6),
(307, 4, NULL, 'Splicing (Rope Splicing)', 'Splicing (Rope Splicing) (TA)', 'Splicing (Rope Splicing) (SI)',                                     7),
(308, 4, NULL, 'Pioneering 3', 'Pioneering 3 (TA)', 'Pioneering 3 (SI)',                                                 8),
(309, 4, NULL, 'Tents and Other Equipment', 'Tents and Other Equipment (TA)', 'Tents and Other Equipment (SI)',                                    9),
(310, 4, NULL, 'Smartness and Good Order 4', 'Smartness and Good Order 4 (TA)', 'Smartness and Good Order 4 (SI)',                                   10),
(311, 4, NULL, 'Balanced Meal', 'Balanced Meal (TA)', 'Balanced Meal (SI)',                                                11),
(312, 4, NULL, 'Productivity Concept', 'Productivity Concept (TA)', 'Productivity Concept (SI)',                                         12),
(313, 4, NULL, 'IT Literacy 3', 'IT Literacy 3 (TA)', 'IT Literacy 3 (SI)',                                                13),
(314, 4, NULL, 'Link Language Skills 3', 'Link Language Skills 3 (TA)', 'Link Language Skills 3 (SI)',                                       14),
(315, 4, NULL, 'Compass and Mapping 3', 'Compass and Mapping 3 (TA)', 'Compass and Mapping 3 (SI)',                                        15),
(316, 4, NULL, 'Camp Equipment', 'Camp Equipment (TA)', 'Camp Equipment (SI)',                                               16),
(317, 4, NULL, 'Adventure Skills', 'Adventure Skills (TA)', 'Adventure Skills (SI)',                                             17),
(318, 4, NULL, 'Time Management', 'Time Management (TA)', 'Time Management (SI)',                                              18),
(319, 4, NULL, 'Safe from Harm 10', 'Safe from Harm 10 (TA)', 'Safe from Harm 10 (SI)',                                            19),
(320, 4, NULL, 'Four Nights Camping', 'Four Nights Camping (TA)', 'Four Nights Camping (SI)',                                          20),
(321, 4, NULL, 'Community Service Project (6 hours)', 'Community Service Project (6 hours) (TA)', 'Community Service Project (6 hours) (SI)',                          21),
(322, 4, NULL, 'Make the Bushman''s Thong', 'Make the Bushman''s Thong (TA)', 'Make the Bushman''s Thong (SI)',                                   22);

-- -- Sub-tasks: Req 301 — Scout Promise and Law 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 301, 'Have a better understanding of the Scout Law and the Scout Promise', 'Have a better understanding of the Scout Law and the Scout Promise (TA)', 'Have a better understanding of the Scout Law and the Scout Promise (SI)',  1),
(4, 301, 'Teach the Scout Promise and the Scout Law to a new recruit', 'Teach the Scout Promise and the Scout Law to a new recruit (TA)', 'Teach the Scout Promise and the Scout Law to a new recruit (SI)',          2);

-- -- Sub-tasks: Req 302 — WOSM Structure
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 302, 'Know the basic structure of the World Organisation of the Scout Movement (WOSM)', 'Know the basic structure of the World Organisation of the Scout Movement (WOSM) (TA)', 'Know the basic structure of the World Organisation of the Scout Movement (WOSM) (SI)', 1),
(4, 302, 'Know about the 6 Scout regions', 'Know about the 6 Scout regions (TA)', 'Know about the 6 Scout regions (SI)',                                      2),
(4, 302, 'Know about the Asia Pacific Region', 'Know about the Asia Pacific Region (TA)', 'Know about the Asia Pacific Region (SI)',                                  3),
(4, 302, 'Know about International Scouting', 'Know about International Scouting (TA)', 'Know about International Scouting (SI)',                                   4);

-- -- Sub-tasks: Req 303 — Thrift 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 303, 'Continue to maintain the savings account and increase regular savings', 'Continue to maintain the savings account and increase regular savings (TA)', 'Continue to maintain the savings account and increase regular savings (SI)', 1);

-- -- Sub-tasks: Req 304 — Public Property
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 304, 'Understand the bad effects of anti-social acts', 'Understand the bad effects of anti-social acts (TA)', 'Understand the bad effects of anti-social acts (SI)',                      1),
(4, 304, 'Collect data about this theme from known adults and mass media', 'Collect data about this theme from known adults and mass media (TA)', 'Collect data about this theme from known adults and mass media (SI)',      2),
(4, 304, 'Write an essay according to the Scout Law and Scout Promise with photographs', 'Write an essay according to the Scout Law and Scout Promise with photographs (TA)', 'Write an essay according to the Scout Law and Scout Promise with photographs (SI)', 3);

-- -- Sub-tasks: Req 305 — Arts and Hobbies 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 305, 'Show progress in Art or Hobbies from Chief Commissioner''s Award level', 'Show progress in Art or Hobbies from Chief Commissioner''s Award level (TA)', 'Show progress in Art or Hobbies from Chief Commissioner''s Award level (SI)', 1),
(4, 305, 'Take part in a Variety Entertainment, Art Exhibition, or Public Show', 'Take part in a Variety Entertainment, Art Exhibition, or Public Show (TA)', 'Take part in a Variety Entertainment, Art Exhibition, or Public Show (SI)', 2),
(4, 305, 'OR present the Scout''s skill in the selected field to the Troop', 'OR present the Scout''s skill in the selected field to the Troop (TA)', 'OR present the Scout''s skill in the selected field to the Troop (SI)',    3);

-- -- Sub-tasks: Req 306 — Backwoodsman Cooking
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 306, 'Do Backwoodsman Cooking with the Patrol (without utensils)', 'Do Backwoodsman Cooking with the Patrol (without utensils) (TA)', 'Do Backwoodsman Cooking with the Patrol (without utensils) (SI)',          1);

-- -- Sub-tasks: Req 307 — Splicing
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 307, 'Back Splicing', 'Back Splicing (TA)', 'Back Splicing (SI)',                                                       1),
(4, 307, 'Eye Splicing', 'Eye Splicing (TA)', 'Eye Splicing (SI)',                                                        2),
(4, 307, 'Short Splicing', 'Short Splicing (TA)', 'Short Splicing (SI)',                                                      3);

-- -- Sub-tasks: Req 308 — Pioneering 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 308, 'Straining of ropes', 'Straining of ropes (TA)', 'Straining of ropes (SI)',                                                  1),
(4, 308, 'Hold fasts', 'Hold fasts (TA)', 'Hold fasts (SI)',                                                          2),
(4, 308, 'Anchorages', 'Anchorages (TA)', 'Anchorages (SI)',                                                          3),
(4, 308, 'Handy Billy — use of pulleys with rope', 'Handy Billy — use of pulleys with rope (TA)', 'Handy Billy — use of pulleys with rope (SI)',                              4),
(4, 308, 'Pulley system', 'Pulley system (TA)', 'Pulley system (SI)',                                                       5),
(4, 308, 'Actively involved in pioneering projects with the Patrol', 'Actively involved in pioneering projects with the Patrol (TA)', 'Actively involved in pioneering projects with the Patrol (SI)',            6);

-- -- Sub-tasks: Req 309 — Tents and Equipment
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 309, 'Name the parts of a wall tent', 'Name the parts of a wall tent (TA)', 'Name the parts of a wall tent (SI)',                                       1),
(4, 309, 'Pitch a tent with the help of the Patrol', 'Pitch a tent with the help of the Patrol (TA)', 'Pitch a tent with the help of the Patrol (SI)',                            2),
(4, 309, 'Remove and clean a tent', 'Remove and clean a tent (TA)', 'Remove and clean a tent (SI)',                                             3),
(4, 309, 'Properly fold and pack a tent', 'Properly fold and pack a tent (TA)', 'Properly fold and pack a tent (SI)',                                       4);

-- -- Sub-tasks: Req 310 — Smartness 4
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 310, 'March 100 metres correctly', 'March 100 metres correctly (TA)', 'March 100 metres correctly (SI)',                                          1),
(4, 310, 'Mark time while marching', 'Mark time while marching (TA)', 'Mark time while marching (SI)',                                            2),
(4, 310, 'Halt', 'Halt (TA)', 'Halt (SI)',                                                                3),
(4, 310, 'Carry the staff or flag while marching', 'Carry the staff or flag while marching (TA)', 'Carry the staff or flag while marching (SI)',                              4),
(4, 310, 'Salute while marching', 'Salute while marching (TA)', 'Salute while marching (SI)',                                               5);

-- -- Sub-tasks: Req 311 — Balanced Meal
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 311, 'Collect data about preparing a balanced meal', 'Collect data about preparing a balanced meal (TA)', 'Collect data about preparing a balanced meal (SI)',                        1),
(4, 311, 'Prepare a balanced meal for a person of the Scout''s age', 'Prepare a balanced meal for a person of the Scout''s age (TA)', 'Prepare a balanced meal for a person of the Scout''s age (SI)',            2),
(4, 311, 'Know the dangers of eating junk/fast food', 'Know the dangers of eating junk/fast food (TA)', 'Know the dangers of eating junk/fast food (SI)',                           3);

-- -- Sub-tasks: Req 312 — Productivity Concepts
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 312, 'Quality Circle — know the concept', 'Quality Circle — know the concept (TA)', 'Quality Circle — know the concept (SI)',                                   1),
(4, 312, '5S methodology — know the concept', '5S methodology — know the concept (TA)', '5S methodology — know the concept (SI)',                                   2),
(4, 312, 'Suggestion Schemes (Group Kaizen) — know the concept', 'Suggestion Schemes (Group Kaizen) — know the concept (TA)', 'Suggestion Schemes (Group Kaizen) — know the concept (SI)',               3);

-- -- Sub-tasks: Req 313 — IT Literacy 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 313, 'Basic knowledge on PowerPoint presentations and animations', 'Basic knowledge on PowerPoint presentations and animations (TA)', 'Basic knowledge on PowerPoint presentations and animations (SI)',          1),
(4, 313, 'Create a personal e-mail address and use it', 'Create a personal e-mail address and use it (TA)', 'Create a personal e-mail address and use it (SI)',                         2),
(4, 313, 'Optional: Register at www.scout.org website', 'Optional: Register at www.scout.org website (TA)', 'Optional: Register at www.scout.org website (SI)',                         3);

-- -- Sub-tasks: Req 314 — Link Language Skills 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 314, 'Do a self-introduction in all three languages in at least 2 minutes', 'Do a self-introduction in all three languages in at least 2 minutes (TA)', 'Do a self-introduction in all three languages in at least 2 minutes (SI)',  1),
(4, 314, 'Ability to write Name, Address, Country, School name, and Hobbies in all three languages', 'Ability to write Name, Address, Country, School name, and Hobbies in all three languages (TA)', 'Ability to write Name, Address, Country, School name, and Hobbies in all three languages (SI)', 2);

-- -- Sub-tasks: Req 315 — Compass and Mapping 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 315, 'Get a Forward Bearing using the compass', 'Get a Forward Bearing using the compass (TA)', 'Get a Forward Bearing using the compass (SI)',                             1),
(4, 315, 'Triangulation — Resection and Intersection', 'Triangulation — Resection and Intersection (TA)', 'Triangulation — Resection and Intersection (SI)',                          2),
(4, 315, 'Identify the Scout''s position using a map and triangulation', 'Identify the Scout''s position using a map and triangulation (TA)', 'Identify the Scout''s position using a map and triangulation (SI)',        3),
(4, 315, 'Identify landmarks visible using the map', 'Identify landmarks visible using the map (TA)', 'Identify landmarks visible using the map (SI)',                            4),
(4, 315, 'Know how to plot a hike route using contour lines', 'Know how to plot a hike route using contour lines (TA)', 'Know how to plot a hike route using contour lines (SI)',                   5);

-- -- Sub-tasks: Req 316 — Camp Equipment
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 316, 'Properly use camping equipment such as tents', 'Properly use camping equipment such as tents (TA)', 'Properly use camping equipment such as tents (SI)',                        1),
(4, 316, 'Know how to repair, clean, and maintain camping equipment', 'Know how to repair, clean, and maintain camping equipment (TA)', 'Know how to repair, clean, and maintain camping equipment (SI)',           2);

-- -- Sub-tasks: Req 317 — Adventure Skills
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 317, 'Tarzan Jump', 'Tarzan Jump (TA)', 'Tarzan Jump (SI)',                                                         1),
(4, 317, 'Rope Climbing', 'Rope Climbing (TA)', 'Rope Climbing (SI)',                                                       2),
(4, 317, 'Tree Climbing', 'Tree Climbing (TA)', 'Tree Climbing (SI)',                                                       3),
(4, 317, 'Crossing a Commando Bridge', 'Crossing a Commando Bridge (TA)', 'Crossing a Commando Bridge (SI)',                                          4),
(4, 317, 'Crossing a Monkey Bridge', 'Crossing a Monkey Bridge (TA)', 'Crossing a Monkey Bridge (SI)',                                            5),
(4, 317, 'Crossing the tope (Athura)', 'Crossing the tope (Athura) (TA)', 'Crossing the tope (Athura) (SI)',                                          6),
(4, 317, 'Rock Climbing — three perfect grips', 'Rock Climbing — three perfect grips (TA)', 'Rock Climbing — three perfect grips (SI)',                                 7),
(4, 317, 'Know how to use the Bowline and Bowline on a Bight for adventure activities', 'Know how to use the Bowline and Bowline on a Bight for adventure activities (TA)', 'Know how to use the Bowline and Bowline on a Bight for adventure activities (SI)', 8),
(4, 317, 'Know how to prepare for an Adventure Hike, Expedition, and Safety Precautions', 'Know how to prepare for an Adventure Hike, Expedition, and Safety Precautions (TA)', 'Know how to prepare for an Adventure Hike, Expedition, and Safety Precautions (SI)', 9),
(4, 317, 'Complete at least four of the above adventure activities', 'Complete at least four of the above adventure activities (TA)', 'Complete at least four of the above adventure activities (SI)',            10);

-- -- Sub-tasks: Req 318 — Time Management
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 318, 'Understand basic Time Management concepts', 'Understand basic Time Management concepts (TA)', 'Understand basic Time Management concepts (SI)',                           1);

-- -- Sub-tasks: Req 319 — Safe from Harm 10
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 319, 'Know how to help lost children by calling their parents', 'Know how to help lost children by calling their parents (TA)', 'Know how to help lost children by calling their parents (SI)',             1),
(4, 319, 'Know what to do if parents are not contactable', 'Know what to do if parents are not contactable (TA)', 'Know what to do if parents are not contactable (SI)',                      2),
(4, 319, 'Know what to do if no one answers when you are in trouble', 'Know what to do if no one answers when you are in trouble (TA)', 'Know what to do if no one answers when you are in trouble (SI)',           3),
(4, 319, 'Know TP numbers: Emergency Ambulance, Police, Fire Rescue, and Child Helpline', 'Know TP numbers: Emergency Ambulance, Police, Fire Rescue, and Child Helpline (TA)', 'Know TP numbers: Emergency Ambulance, Police, Fire Rescue, and Child Helpline (SI)', 4),
(4, 319, 'Explain how to improve psychological health', 'Explain how to improve psychological health (TA)', 'Explain how to improve psychological health (SI)',                         5),
(4, 319, 'Explain three good safety strategies for situations in the syllabus', 'Explain three good safety strategies for situations in the syllabus (TA)', 'Explain three good safety strategies for situations in the syllabus (SI)', 6);

-- -- Sub-tasks: Req 320 — Four Nights Camping
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 320, 'Have four nights camping experience (at a stretch or staggered basis)', 'Have four nights camping experience (at a stretch or staggered basis) (TA)', 'Have four nights camping experience (at a stretch or staggered basis) (SI)', 1);

-- -- Sub-tasks: Req 321 — Community Service (6 hours)
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 321, 'Get involved in a Community Service Project organized by school or any organization for at least 6 hours', 'Get involved in a Community Service Project organized by school or any organization for at least 6 hours (TA)', 'Get involved in a Community Service Project organized by school or any organization for at least 6 hours (SI)', 1),
(4, 321, 'OR identify a student weak in studies and carry out an improvement programme', 'OR identify a student weak in studies and carry out an improvement programme (TA)', 'OR identify a student weak in studies and carry out an improvement programme (SI)',  2),
(4, 321, 'OR observe a Development Project', 'OR observe a Development Project (TA)', 'OR observe a Development Project (SI)',                                    3),
(4, 321, 'OR complete requirements for Scouts of the World Award under Better World Framework', 'OR complete requirements for Scouts of the World Award under Better World Framework (TA)', 'OR complete requirements for Scouts of the World Award under Better World Framework (SI)', 4);

-- -- Sub-tasks: Req 322 — Bushman's Thong
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(4, 322, 'Make the Bushman''s Thong in the presence of the ADC (Programme)', 'Make the Bushman''s Thong in the presence of the ADC (Programme) (TA)', 'Make the Bushman''s Thong in the presence of the ADC (Programme) (SI)',    1),
(4, 322, 'Complete this after all requirements of the Prime Minister''s Scout Award including Proficiency Badges', 'Complete this after all requirements of the Prime Minister''s Scout Award including Proficiency Badges (TA)', 'Complete this after all requirements of the Prime Minister''s Scout Award including Proficiency Badges (SI)', 2);

-- -- =============================================================
-- -- BADGE 5 — PRESIDENT'S SCOUT AWARD
-- -- =============================================================

INSERT INTO badge_requirements (id, badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(401, 5, NULL, 'Scout Promise and Scout Law 3', 'Scout Promise and Scout Law 3 (TA)', 'Scout Promise and Scout Law 3 (SI)',                                  1),
(402, 5, NULL, 'Log Book 2', 'Log Book 2 (TA)', 'Log Book 2 (SI)',                                                    2),
(403, 5, NULL, 'Skills in Art and Hobbies 3', 'Skills in Art and Hobbies 3 (TA)', 'Skills in Art and Hobbies 3 (SI)',                                   3),
(404, 5, NULL, 'Scout Craft — Training Others', 'Scout Craft — Training Others (TA)', 'Scout Craft — Training Others (SI)',                                 4),
(405, 5, NULL, 'Pioneering Project 4', 'Pioneering Project 4 (TA)', 'Pioneering Project 4 (SI)',                                          5),
(406, 5, NULL, 'Leadership in Emergencies and Natural Disasters', 'Leadership in Emergencies and Natural Disasters (TA)', 'Leadership in Emergencies and Natural Disasters (SI)',               6),
(407, 5, NULL, 'Health Habits — Training Others', 'Health Habits — Training Others (TA)', 'Health Habits — Training Others (SI)',                               7),
(408, 5, NULL, 'IT Literacy 4', 'IT Literacy 4 (TA)', 'IT Literacy 4 (SI)',                                                 8),
(409, 5, NULL, 'Link Language Skills 4', 'Link Language Skills 4 (TA)', 'Link Language Skills 4 (SI)',                                        9),
(410, 5, NULL, 'Safe from Harm 11', 'Safe from Harm 11 (TA)', 'Safe from Harm 11 (SI)',                                             10),
(411, 5, NULL, 'Organising a Hike with Scout Skills and Challenges', 'Organising a Hike with Scout Skills and Challenges (TA)', 'Organising a Hike with Scout Skills and Challenges (SI)',            11),
(412, 5, NULL, 'Community Service Project (72 man-hours)', 'Community Service Project (72 man-hours) (TA)', 'Community Service Project (72 man-hours) (SI)',                      12),
(413, 5, NULL, 'Four Nights Camping after Bushman''s Thong', 'Four Nights Camping after Bushman''s Thong (TA)', 'Four Nights Camping after Bushman''s Thong (SI)',                   13);

-- -- Sub-tasks: Req 401 — Scout Promise and Law 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 401, 'Present one of the Games/Challenges/Acts based on the Scout Promise or Scout Law', 'Present one of the Games/Challenges/Acts based on the Scout Promise or Scout Law (TA)', 'Present one of the Games/Challenges/Acts based on the Scout Promise or Scout Law (SI)', 1),
(5, 401, 'Make a speech to the Patrol based on two sections of the Scout Law', 'Make a speech to the Patrol based on two sections of the Scout Law (TA)', 'Make a speech to the Patrol based on two sections of the Scout Law (SI)',  2);

-- -- Sub-tasks: Req 402 — Log Book 2
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 402, 'Should have records of at least 2 years and 6 months preceding the President Scout interview', 'Should have records of at least 2 years and 6 months preceding the President Scout interview (TA)', 'Should have records of at least 2 years and 6 months preceding the President Scout interview (SI)', 1);

-- -- Sub-tasks: Req 403 — Art and Hobbies 3
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 403, 'Create an original artistic or literary work', 'Create an original artistic or literary work (TA)', 'Create an original artistic or literary work (SI)',                        1);

-- -- Sub-tasks: Req 404 — Scout Craft Training
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 404, 'Train a Scout or Patrol on three requirements for the Scout Award', 'Train a Scout or Patrol on three requirements for the Scout Award (TA)', 'Train a Scout or Patrol on three requirements for the Scout Award (SI)',   1),
(5, 404, 'Train a Scout or Patrol on three requirements for the Chief Commissioner''s Award', 'Train a Scout or Patrol on three requirements for the Chief Commissioner''s Award (TA)', 'Train a Scout or Patrol on three requirements for the Chief Commissioner''s Award (SI)', 2);

-- -- Sub-tasks: Req 405 — Pioneering 4
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 405, 'Take leadership in organising and conducting a pioneering project', 'Take leadership in organising and conducting a pioneering project (TA)', 'Take leadership in organising and conducting a pioneering project (SI)',   1);

-- -- Sub-tasks: Req 406 — Leadership in Emergencies
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 406, 'Provide leadership when an accident or natural disaster occurs', 'Provide leadership when an accident or natural disaster occurs (TA)', 'Provide leadership when an accident or natural disaster occurs (SI)',      1),
(5, 406, 'Render First Aid during the emergency leadership exercise', 'Render First Aid during the emergency leadership exercise (TA)', 'Render First Aid during the emergency leadership exercise (SI)',           2);

-- -- Sub-tasks: Req 407 — Health Habits Training
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 407, 'Train a Scout about health habits necessary for the Membership Badge', 'Train a Scout about health habits necessary for the Membership Badge (TA)', 'Train a Scout about health habits necessary for the Membership Badge (SI)', 1);

-- -- Sub-tasks: Req 408 — IT Literacy 4
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 408, 'Type 15 words used in day-to-day activities in a language other than Scout''s own language', 'Type 15 words used in day-to-day activities in a language other than Scout''s own language (TA)', 'Type 15 words used in day-to-day activities in a language other than Scout''s own language (SI)', 1),
(5, 408, 'Prepare a PowerPoint Presentation to be presented in 5 minutes following syllabus guidelines', 'Prepare a PowerPoint Presentation to be presented in 5 minutes following syllabus guidelines (TA)', 'Prepare a PowerPoint Presentation to be presented in 5 minutes following syllabus guidelines (SI)', 2);

-- -- Sub-tasks: Req 409 — Link Language Skills 4
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 409, 'Give a 3-minute speech on any topic in one language other than Scout''s own language', 'Give a 3-minute speech on any topic in one language other than Scout''s own language (TA)', 'Give a 3-minute speech on any topic in one language other than Scout''s own language (SI)', 1),
(5, 409, 'PowerPoint presentations can be used', 'PowerPoint presentations can be used (TA)', 'PowerPoint presentations can be used (SI)',                                2);

-- -- Sub-tasks: Req 410 — Safe from Harm 11
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 410, 'Know basic rules of assessing risk', 'Know basic rules of assessing risk (TA)', 'Know basic rules of assessing risk (SI)',                                  1),
(5, 410, 'Know how to help someone who is being bullied or harassed', 'Know how to help someone who is being bullied or harassed (TA)', 'Know how to help someone who is being bullied or harassed (SI)',           2),
(5, 410, 'Know safety in school building and for Scout activities', 'Know safety in school building and for Scout activities (TA)', 'Know safety in school building and for Scout activities (SI)',             3),
(5, 410, 'Know fire safety', 'Know fire safety (TA)', 'Know fire safety (SI)',                                                    4),
(5, 410, 'Know safety in Mountains, Rivers, or Jungles as relevant to home town', 'Know safety in Mountains, Rivers, or Jungles as relevant to home town (TA)', 'Know safety in Mountains, Rivers, or Jungles as relevant to home town (SI)', 5),
(5, 410, 'Know rules for healthy living', 'Know rules for healthy living (TA)', 'Know rules for healthy living (SI)',                                       6),
(5, 410, 'Know what Integrity is and how to develop it', 'Know what Integrity is and how to develop it (TA)', 'Know what Integrity is and how to develop it (SI)',                        7);

-- -- Sub-tasks: Req 411 — Organising a Hike
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 411, 'Organise a short hike of maximum 1km using Wood Craft signs', 'Organise a short hike of maximum 1km using Wood Craft signs (TA)', 'Organise a short hike of maximum 1km using Wood Craft signs (SI)',         1),
(5, 411, 'Include Scout Skills and Challenges in the hike', 'Include Scout Skills and Challenges in the hike (TA)', 'Include Scout Skills and Challenges in the hike (SI)',                     2);

-- -- Sub-tasks: Req 412 — Community Service Project 72 hrs
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 412, 'Organise a Community Service Project with at least 72 man-hours', 'Organise a Community Service Project with at least 72 man-hours (TA)', 'Organise a Community Service Project with at least 72 man-hours (SI)',     1);

-- -- Sub-tasks: Req 413 — Four Nights Camping (Post Bushman's Thong)
INSERT INTO badge_requirements (badge_id, parent_id, requirement_text, requirement_text_ta, requirement_text_si, order_number) VALUES
(5, 413, 'Complete four nights camping after completing the Bushman''s Thong requirements', 'Complete four nights camping after completing the Bushman''s Thong requirements (TA)', 'Complete four nights camping after completing the Bushman''s Thong requirements (SI)', 1),
(5, 413, 'Camping can be at a stretch or on a staggered basis', 'Camping can be at a stretch or on a staggered basis (TA)', 'Camping can be at a stretch or on a staggered basis (SI)',                  2);

-- -- =============================================================
-- -- UPDATE total_requirements COUNT
-- -- =============================================================
UPDATE badges SET total_requirements = (
    SELECT COUNT(*) FROM badge_requirements
    WHERE badge_id = badges.id AND parent_id IS NULL
);

-- -- =============================================================
-- -- PROFICIENCY BADGES — Junior Scouts
-- -- =============================================================

INSERT INTO proficiency_badges (code, name, name_ta, name_si, group_name, scout_level) VALUES
-- -- A. Public Service Group
('JA-1',  'Linguist', 'Linguist (TA)', 'Linguist (SI)',         'Public Service Group', 'junior'),
('JA-2',  'Missioner', 'Missioner (TA)', 'Missioner (SI)',        'Public Service Group', 'junior'),
('JA-3',  'Fire-Fighter', 'Fire-Fighter (TA)', 'Fire-Fighter (SI)',     'Public Service Group', 'junior'),
('JA-4',  'Signaller', 'Signaller (TA)', 'Signaller (SI)',        'Public Service Group', 'junior'),
('JA-5',  'Cyclist', 'Cyclist (TA)', 'Cyclist (SI)',          'Public Service Group', 'junior'),
('JA-6',  'Guide', 'Guide (TA)', 'Guide (SI)',            'Public Service Group', 'junior'),
('JA-7',  'First Aid', 'First Aid (TA)', 'First Aid (SI)',        'Public Service Group', 'junior'),
('JA-8',  'Life Saver', 'Life Saver (TA)', 'Life Saver (SI)',       'Public Service Group', 'junior'),
('JA-9',  'Coxswain', 'Coxswain (TA)', 'Coxswain (SI)',         'Public Service Group', 'junior'),
('JA-10', 'Jobman', 'Jobman (TA)', 'Jobman (SI)',           'Public Service Group', 'junior'),
-- -- B. Camp Craft Group
('JB-1',  'Camper', 'Camper (TA)', 'Camper (SI)',           'Camp Craft Group', 'junior'),
('JB-2',  'Cook', 'Cook (TA)', 'Cook (SI)',             'Camp Craft Group', 'junior'),
('JB-3',  'Woodcraftsman', 'Woodcraftsman (TA)', 'Woodcraftsman (SI)',    'Camp Craft Group', 'junior'),
('JB-4',  'Pioneer', 'Pioneer (TA)', 'Pioneer (SI)',          'Camp Craft Group', 'junior'),
('JB-5',  'Backwoodsman', 'Backwoodsman (TA)', 'Backwoodsman (SI)',     'Camp Craft Group', 'junior'),
-- -- C. Education Group
('JC-1',  'Reader', 'Reader (TA)', 'Reader (SI)',           'Education Group', 'junior'),
('JC-2',  'Speaker', 'Speaker (TA)', 'Speaker (SI)',          'Education Group', 'junior'),
('JC-3',  'Scholar', 'Scholar (TA)', 'Scholar (SI)',          'Education Group', 'junior'),
('JC-4',  'Scribe', 'Scribe (TA)', 'Scribe (SI)',           'Education Group', 'junior'),
-- -- D. Sports Group
('JD-1',  'Athlete', 'Athlete (TA)', 'Athlete (SI)',          'Sports Group', 'junior'),
('JD-2',  'Swimmer', 'Swimmer (TA)', 'Swimmer (SI)',          'Sports Group', 'junior'),
('JD-3',  'Sportsman', 'Sportsman (TA)', 'Sportsman (SI)',        'Sports Group', 'junior'),
('JD-4',  'Rider', 'Rider (TA)', 'Rider (SI)',            'Sports Group', 'junior'),
-- -- E. Social Group
('JE-1',  'Pen-Friend', 'Pen-Friend (TA)', 'Pen-Friend (SI)',       'Social Group', 'junior'),
('JE-2',  'Junior Organiser', 'Junior Organiser (TA)', 'Junior Organiser (SI)', 'Social Group', 'junior'),
-- -- F. Culture Group
('JF-1',  'Designer', 'Designer (TA)', 'Designer (SI)',         'Culture Group', 'junior'),
('JF-2',  'Music Maker', 'Music Maker (TA)', 'Music Maker (SI)',      'Culture Group', 'junior'),
('JF-3',  'Actor', 'Actor (TA)', 'Actor (SI)',            'Culture Group', 'junior'),
('JF-4',  'Modeller', 'Modeller (TA)', 'Modeller (SI)',         'Culture Group', 'junior'),
('JF-5',  'Dancer', 'Dancer (TA)', 'Dancer (SI)',           'Culture Group', 'junior'),
-- -- G. Farmer Group
('JG-1',  'Woodman', 'Woodman (TA)', 'Woodman (SI)',          'Farmer Group', 'junior'),
('JG-2',  'Gardener', 'Gardener (TA)', 'Gardener (SI)',         'Farmer Group', 'junior'),
('JG-3',  'Angler', 'Angler (TA)', 'Angler (SI)',           'Farmer Group', 'junior'),
('JG-4',  'Small-Holder', 'Small-Holder (TA)', 'Small-Holder (SI)',     'Farmer Group', 'junior'),
('JG-5',  'Herbalist', 'Herbalist (TA)', 'Herbalist (SI)',        'Farmer Group', 'junior'),
-- -- H. New Explorer Group
('JH-1',  'Observer', 'Observer (TA)', 'Observer (SI)',         'New Explorer Group', 'junior'),
('JH-2',  'Stalker', 'Stalker (TA)', 'Stalker (SI)',          'New Explorer Group', 'junior'),
('JH-3',  'Map Maker', 'Map Maker (TA)', 'Map Maker (SI)',        'New Explorer Group', 'junior'),
('JH-4',  'Starman', 'Starman (TA)', 'Starman (SI)',          'New Explorer Group', 'junior'),
('JH-5',  'Weatherman', 'Weatherman (TA)', 'Weatherman (SI)',       'New Explorer Group', 'junior'),
('JH-6',  'Explorer', 'Explorer (TA)', 'Explorer (SI)',         'New Explorer Group', 'junior'),
-- -- I. Seaman Group
('JI-1',  'Boatswain''s Mate', 'Boatswain''s Mate (TA)', 'Boatswain''s Mate (SI)','Seaman Group', 'junior'),
('JI-2',  'Oarsman', 'Oarsman (TA)', 'Oarsman (SI)',          'Seaman Group', 'junior'),
('JI-3',  'Canoeist', 'Canoeist (TA)', 'Canoeist (SI)',         'Seaman Group', 'junior'),
-- -- J. Airman Group
('JJ-1',  'Aircraft Modeller', 'Aircraft Modeller (TA)', 'Aircraft Modeller (SI)','Airman Group', 'junior'),
('JJ-2',  'Glider', 'Glider (TA)', 'Glider (SI)',           'Airman Group', 'junior'),
('JJ-3',  'Air Spotter', 'Air Spotter (TA)', 'Air Spotter (SI)',      'Airman Group', 'junior'),
('JJ-4',  'Air Apprentice', 'Air Apprentice (TA)', 'Air Apprentice (SI)',   'Airman Group', 'junior'),
-- -- K. Practical Science Group
('JK-1',  'Wireless Man', 'Wireless Man (TA)', 'Wireless Man (SI)',     'Practical Science Group', 'junior'),
('JK-2',  'Hand Worker', 'Hand Worker (TA)', 'Hand Worker (SI)',      'Practical Science Group', 'junior'),
('JK-3',  'Cameraman', 'Cameraman (TA)', 'Cameraman (SI)',        'Practical Science Group', 'junior'),
('JK-4',  'Energy Manager', 'Energy Manager (TA)', 'Energy Manager (SI)',   'Practical Science Group', 'junior'),
-- -- L. Hobbies Group
('JL-1',  'Stamp Collector', 'Stamp Collector (TA)', 'Stamp Collector (SI)',  'Hobbies Group', 'junior'),
('JL-2',  'Junior Collector', 'Junior Collector (TA)', 'Junior Collector (SI)', 'Hobbies Group', 'junior'),
('JL-3',  'Junior Saver', 'Junior Saver (TA)', 'Junior Saver (SI)',     'Hobbies Group', 'junior'),
-- -- M. Family Life Education Group
('JM-1',  'Junior Happy Home', 'Junior Happy Home (TA)', 'Junior Happy Home (SI)','Family Life Education Group', 'junior');

-- -- =============================================================
-- -- PROFICIENCY BADGES — Senior Scouts
-- -- =============================================================

INSERT INTO proficiency_badges (code, name, name_ta, name_si, group_name, scout_level) VALUES
-- -- A. Public Service Group
('SA-1',  'Interpreter', 'Interpreter (TA)', 'Interpreter (SI)',        'Public Service Group', 'senior'),
('SA-2',  'Public Health', 'Public Health (TA)', 'Public Health (SI)',      'Public Service Group', 'senior'),
('SA-3',  'Fireman', 'Fireman (TA)', 'Fireman (SI)',            'Public Service Group', 'senior'),
('SA-4',  'Leading Signaller', 'Leading Signaller (TA)', 'Leading Signaller (SI)',  'Public Service Group', 'senior'),
('SA-5',  'Dispatch Rider', 'Dispatch Rider (TA)', 'Dispatch Rider (SI)',     'Public Service Group', 'senior'),
('SA-6',  'Path Finder', 'Path Finder (TA)', 'Path Finder (SI)',        'Public Service Group', 'senior'),
('SA-7',  'Ambulance', 'Ambulance (TA)', 'Ambulance (SI)',          'Public Service Group', 'senior'),
('SA-8',  'Rescuer', 'Rescuer (TA)', 'Rescuer (SI)',            'Public Service Group', 'senior'),
('SA-9',  'Pilot', 'Pilot (TA)', 'Pilot (SI)',              'Public Service Group', 'senior'),
('SA-10', 'Handyman', 'Handyman (TA)', 'Handyman (SI)',           'Public Service Group', 'senior'),
('SA-11', 'Civics', 'Civics (TA)', 'Civics (SI)',             'Public Service Group', 'senior'),
('SA-12', 'Conservation', 'Conservation (TA)', 'Conservation (SI)',       'Public Service Group', 'senior'),
-- -- B. Camp Craft Group
('SB-1',  'Camp Warden', 'Camp Warden (TA)', 'Camp Warden (SI)',        'Camp Craft Group', 'senior'),
('SB-2',  'Master Cook', 'Master Cook (TA)', 'Master Cook (SI)',        'Camp Craft Group', 'senior'),
('SB-3',  'Naturalist', 'Naturalist (TA)', 'Naturalist (SI)',         'Camp Craft Group', 'senior'),
('SB-4',  'Senior Pioneer', 'Senior Pioneer (TA)', 'Senior Pioneer (SI)',     'Camp Craft Group', 'senior'),
('SB-5',  'Venturer', 'Venturer (TA)', 'Venturer (SI)',           'Camp Craft Group', 'senior'),
('SB-6',  'Quarter Master', 'Quarter Master (TA)', 'Quarter Master (SI)',     'Camp Craft Group', 'senior'),
-- -- C. Education Group
('SC-1',  'Bookman', 'Bookman (TA)', 'Bookman (SI)',            'Education Group', 'senior'),
('SC-2',  'Orator', 'Orator (TA)', 'Orator (SI)',             'Education Group', 'senior'),
('SC-3',  'Senior Scholar', 'Senior Scholar (TA)', 'Senior Scholar (SI)',     'Education Group', 'senior'),
('SC-4',  'Clerk', 'Clerk (TA)', 'Clerk (SI)',              'Education Group', 'senior'),
('SC-5',  'Typist', 'Typist (TA)', 'Typist (SI)',             'Education Group', 'senior'),
('SC-6',  'Journalist', 'Journalist (TA)', 'Journalist (SI)',         'Education Group', 'senior'),
-- -- D. Sports Group
('SD-1',  'Senior Athlete', 'Senior Athlete (TA)', 'Senior Athlete (SI)',     'Sports Group', 'senior'),
('SD-2',  'Master Swimmer', 'Master Swimmer (TA)', 'Master Swimmer (SI)',     'Sports Group', 'senior'),
('SD-3',  'Master Sportsman', 'Master Sportsman (TA)', 'Master Sportsman (SI)',   'Sports Group', 'senior'),
('SD-4',  'Horseman', 'Horseman (TA)', 'Horseman (SI)',           'Sports Group', 'senior'),
('SD-5',  'Archery', 'Archery (TA)', 'Archery (SI)',            'Sports Group', 'senior'),
-- -- E. Social Group
('SE-1',  'World Friendship', 'World Friendship (TA)', 'World Friendship (SI)',   'Social Group', 'senior'),
('SE-2',  'Organiser', 'Organiser (TA)', 'Organiser (SI)',          'Social Group', 'senior'),
-- -- F. Culture Group
('SF-1',  'Artist', 'Artist (TA)', 'Artist (SI)',             'Culture Group', 'senior'),
('SF-2',  'Musician', 'Musician (TA)', 'Musician (SI)',           'Culture Group', 'senior'),
('SF-3',  'Play Actor', 'Play Actor (TA)', 'Play Actor (SI)',         'Culture Group', 'senior'),
('SF-4',  'Sculptor', 'Sculptor (TA)', 'Sculptor (SI)',           'Culture Group', 'senior'),
('SF-5',  'Folk Dancer', 'Folk Dancer (TA)', 'Folk Dancer (SI)',        'Culture Group', 'senior'),
-- -- G. Farmer Group
('SG-1',  'Forester', 'Forester (TA)', 'Forester (SI)',           'Farmer Group', 'senior'),
('SG-2',  'Horticulturist', 'Horticulturist (TA)', 'Horticulturist (SI)',     'Farmer Group', 'senior'),
('SG-3',  'Fisherman', 'Fisherman (TA)', 'Fisherman (SI)',          'Farmer Group', 'senior'),
('SG-4',  'Poultryman', 'Poultryman (TA)', 'Poultryman (SI)',         'Farmer Group', 'senior'),
('SG-5',  'Dairyman', 'Dairyman (TA)', 'Dairyman (SI)',           'Farmer Group', 'senior'),
('SG-6',  'Paddy Cultivator', 'Paddy Cultivator (TA)', 'Paddy Cultivator (SI)',   'Farmer Group', 'senior'),
-- -- H. Explorer Group
('SH-1',  'Tracker', 'Tracker (TA)', 'Tracker (SI)',            'Explorer Group', 'senior'),
('SH-2',  'Hiker', 'Hiker (TA)', 'Hiker (SI)',              'Explorer Group', 'senior'),
('SH-3',  'Surveyor', 'Surveyor (TA)', 'Surveyor (SI)',           'Explorer Group', 'senior'),
('SH-4',  'Astronomer', 'Astronomer (TA)', 'Astronomer (SI)',         'Explorer Group', 'senior'),
('SH-5',  'Meteorologist', 'Meteorologist (TA)', 'Meteorologist (SI)',      'Explorer Group', 'senior'),
('SH-6',  'Senior Explorer', 'Senior Explorer (TA)', 'Senior Explorer (SI)',    'Explorer Group', 'senior'),
('SH-7',  'Archeologist', 'Archeologist (TA)', 'Archeologist (SI)',       'Explorer Group', 'senior'),
-- -- I. Seaman Group
('SI-1',  'Boatswain', 'Boatswain (TA)', 'Boatswain (SI)',          'Seaman Group', 'senior'),
('SI-2',  '6-Oar Helmsman', '6-Oar Helmsman (TA)', '6-Oar Helmsman (SI)',     'Seaman Group', 'senior'),
('SI-3',  'Master Canoeist', 'Master Canoeist (TA)', 'Master Canoeist (SI)',    'Seaman Group', 'senior'),
-- -- J. Airman Group
('SJ-1',  'Aircraft Constructor', 'Aircraft Constructor (TA)', 'Aircraft Constructor (SI)','Airman Group', 'senior'),
('SJ-2',  'Glider Pilot', 'Glider Pilot (TA)', 'Glider Pilot (SI)',       'Airman Group', 'senior'),
('SJ-3',  'Air Observer', 'Air Observer (TA)', 'Air Observer (SI)',       'Airman Group', 'senior'),
('SJ-4',  'Air Mechanic', 'Air Mechanic (TA)', 'Air Mechanic (SI)',       'Airman Group', 'senior'),
('SJ-5',  'Air Navigator', 'Air Navigator (TA)', 'Air Navigator (SI)',      'Airman Group', 'senior'),
-- -- K. Practical Science Group
('SK-1',  'Radio Mechanic', 'Radio Mechanic (TA)', 'Radio Mechanic (SI)',     'Practical Science Group', 'senior'),
('SK-2',  'Handicraftsman', 'Handicraftsman (TA)', 'Handicraftsman (SI)',     'Practical Science Group', 'senior'),
('SK-3',  'Photographer', 'Photographer (TA)', 'Photographer (SI)',       'Practical Science Group', 'senior'),
('SK-4',  'Electrician', 'Electrician (TA)', 'Electrician (SI)',        'Practical Science Group', 'senior'),
('SK-5',  'Motor Mechanic', 'Motor Mechanic (TA)', 'Motor Mechanic (SI)',     'Practical Science Group', 'senior'),
('SK-6',  'Energy Conservator', 'Energy Conservator (TA)', 'Energy Conservator (SI)', 'Practical Science Group', 'senior'),
-- -- L. Hobbies Group
('SL-1',  'Philatelist', 'Philatelist (TA)', 'Philatelist (SI)',        'Hobbies Group', 'senior'),
('SL-2',  'Outstanding Collector', 'Outstanding Collector (TA)', 'Outstanding Collector (SI)','Hobbies Group', 'senior'),
('SL-3',  'Senior Saver', 'Senior Saver (TA)', 'Senior Saver (SI)',       'Hobbies Group', 'senior'),
-- -- M. Family Life Education Group
('SM-1',  'Senior Happy Home', 'Senior Happy Home (TA)', 'Senior Happy Home (SI)',  'Family Life Education Group', 'senior');

-- -- =============================================================
-- -- INTERNATIONAL BADGES (both levels)
-- -- =============================================================
INSERT INTO proficiency_badges (code, name, name_ta, name_si, group_name, scout_level) VALUES
('BWF-1', 'Messengers of Peace (MoP)', 'Messengers of Peace (MoP) (TA)', 'Messengers of Peace (MoP) (SI)',         'International Badges', 'both'),
('BWF-2', 'Scouts of the World Award (SWA)', 'Scouts of the World Award (SWA) (TA)', 'Scouts of the World Award (SWA) (SI)',   'International Badges', 'both'),
('BWF-3', 'Patrimonito Scout Badge', 'Patrimonito Scout Badge (TA)', 'Patrimonito Scout Badge (SI)',           'International Badges', 'both'),
('BWF-4', 'Champions for Nature Challenge', 'Champions for Nature Challenge (TA)', 'Champions for Nature Challenge (SI)',    'International Badges', 'both'),
('BWF-5', 'Tide Turners Plastic Challenge', 'Tide Turners Plastic Challenge (TA)', 'Tide Turners Plastic Challenge (SI)',    'International Badges', 'both'),
('BWF-6', 'Scouts Go Solar Challenge', 'Scouts Go Solar Challenge (TA)', 'Scouts Go Solar Challenge (SI)',         'International Badges', 'both'),
('BWF-7', 'Dialogue for Peace', 'Dialogue for Peace (TA)', 'Dialogue for Peace (SI)',                'International Badges', 'both');

-- -- =============================================================
-- -- SEED USERS (demo only — passwords are bcrypt hashed in prod)
-- -- =============================================================
INSERT INTO troops (id, name, district) VALUES
(2, 'Colombo Central Scout Group', 'Colombo'),
(3, 'Kandy District Scout Group',  'Kandy')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, first_name, last_name, email, password_hash, role, status, troop_id) VALUES
(1, 'Demo', 'Scout',  'scout@smartscouts.sl',  '$2b$12$wrxwEyAeojb9FhUjsdFFruWkHTCC.au2g110/7blQzvfv8T.xr14i', 'scout',  'active', 1),
(2, 'Demo', 'Leader', 'leader@smartscouts.sl', '$2b$12$wrxwEyAeojb9FhUjsdFFruWkHTCC.au2g110/7blQzvfv8T.xr14i', 'leader', 'active', 1),
(3, 'Demo', 'Commissioner', 'admin@smartscouts.sl', '$2b$12$wrxwEyAeojb9FhUjsdFFruWkHTCC.au2g110/7blQzvfv8T.xr14i', 'commissioner', 'active', NULL);

INSERT INTO troop_members (troop_id, user_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active');

SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('troops_id_seq', (SELECT COALESCE(MAX(id), 1) FROM troops));
SELECT setval('troop_members_id_seq', (SELECT COALESCE(MAX(id), 1) FROM troop_members));
SELECT setval('pre_registered_leaders_id_seq', (SELECT COALESCE(MAX(id), 1) FROM pre_registered_leaders));
SELECT setval('patrols_id_seq', (SELECT COALESCE(MAX(id), 1) FROM patrols));
SELECT setval('patrol_members_id_seq', (SELECT COALESCE(MAX(id), 1) FROM patrol_members));
SELECT setval('badges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM badges));
SELECT setval('badge_requirements_id_seq', (SELECT COALESCE(MAX(id), 1) FROM badge_requirements));
SELECT setval('progress_id_seq', (SELECT COALESCE(MAX(id), 1) FROM progress));
SELECT setval('evidence_id_seq', (SELECT COALESCE(MAX(id), 1) FROM evidence));
SELECT setval('milestones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM milestones));
SELECT setval('badge_applications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM badge_applications));
SELECT setval('proficiency_badges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM proficiency_badges));
SELECT setval('proficiency_badge_requirements_id_seq', (SELECT COALESCE(MAX(id), 1) FROM proficiency_badge_requirements));
SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));
SELECT setval('documents_id_seq', (SELECT COALESCE(MAX(id), 1) FROM documents));
SELECT setval('document_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM document_categories));