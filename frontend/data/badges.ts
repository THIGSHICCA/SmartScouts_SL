export type RequirementStatus = 'incomplete' | 'pending_pl' | 'completed';

export interface SubTask {
  id: number;
  text: string;
  status: RequirementStatus;
  completedDate?: string;
}

export interface Requirement {
  id: number;
  text: string;
  status: RequirementStatus;
  completedDate?: string;
  subTasks?: SubTask[];
}

export interface BadgeCategory {
  title: string;
  requirements: Requirement[];
}

export type BadgeStatus = 'in_progress' | 'pending_leader' | 'completed';

export interface Badge {
  id: string;
  title: string;
  icon: string;
  color: 'green' | 'orange' | 'blue' | 'yellow' | 'purple';
  progress: number;
  isLocked: boolean;
  status: BadgeStatus;
  categories: BadgeCategory[];
}

export interface ProficiencyBadge {
  id: string;
  code: string;
  title: string;
  group: string;
  level: 'junior' | 'senior' | 'both';
  icon: string;
  description: string;
}

export const badgesData: Badge[] = [
  {
    id: 'membership',
    title: 'Scout Membership Badge',
    icon: '/images/badges/membership-badge.png',
    color: 'green',
    progress: 0,
    isLocked: false,
    status: 'in_progress',
    categories: [
      {
        title: 'Core Fundamentals',
        requirements: [
          {
            id: 1,
            text: 'Recite and understand the Scout Promise and Law',
            status: 'incomplete',
            subTasks: [
              { id: 1001, text: 'Recite the Scout Promise by memory', status: 'incomplete' },
              { id: 1002, text: 'Recite the Scout Law by memory', status: 'incomplete' },
              { id: 1003, text: 'Know the meaning of Scout Promise', status: 'incomplete' },
              { id: 1004, text: 'Know the meaning of Scout Law', status: 'incomplete' },
              { id: 1005, text: 'Understand the Scout Promise is the basis of Scouting', status: 'incomplete' },
            ]
          },
          {
            id: 2,
            text: 'Sing the National Anthem alone and know its history',
            status: 'incomplete',
            subTasks: [
              { id: 2001, text: 'Sing the National Anthem alone', status: 'incomplete' },
              { id: 2002, text: 'Know what should be done when singing the Anthem', status: 'incomplete' },
              { id: 2003, text: 'Know the Composer and History of the Anthem', status: 'incomplete' },
              { id: 2004, text: 'Know the meaning of the National Anthem', status: 'incomplete' },
            ]
          },
          {
            id: 3,
            text: 'Demonstrate Scout Sign, Salute, and Left-hand shake',
            status: 'incomplete',
            subTasks: [
              { id: 3001, text: 'Know the meaning of Scout sign, salute, and left-hand shake', status: 'incomplete' },
              { id: 3002, text: 'Make the Scout sign and salute correctly', status: 'incomplete' },
              { id: 3003, text: 'Know when to use the sign and salute', status: 'incomplete' },
            ]
          },
          {
            id: 4,
            text: 'Know the life history of the Founder, Lord Baden Powell',
            status: 'incomplete',
            subTasks: [
              { id: 4001, text: 'Birth and childhood of BP', status: 'incomplete' },
              { id: 4002, text: 'Life prior to scouting and origin of scouting', status: 'incomplete' },
              { id: 4003, text: 'Founder of Sri Lanka Scouting and starting year', status: 'incomplete' },
            ]
          },
          {
            id: 5,
            text: 'Understand and act upon Whistle and Hand signals',
            status: 'incomplete',
            subTasks: [
              { id: 5001, text: 'Whistle: Silence, Attention, Await next signal', status: 'incomplete' },
              { id: 5002, text: 'Hand: Horse shoe, Parallel, Closed/Open columns', status: 'incomplete' },
            ]
          },
          {
            id: 6,
            text: 'Tie and explain uses of Reef Knot, Sheet Bend, Clove Hitch, Sheep Shank, and Bowline',
            status: 'incomplete',
            subTasks: [
              { id: 6001, text: 'Tie the five basic knots correctly', status: 'incomplete' },
              { id: 6002, text: 'Explain the practical use of each knot', status: 'incomplete' },
              { id: 6003, text: 'Demonstrate a simple whipping', status: 'incomplete' },
            ]
          },
          {
            id: 7,
            text: 'Demonstrate Smartness and Good Order (Attention, At Ease, Turns)',
            status: 'incomplete',
            subTasks: [
              { id: 7001, text: 'Correct Attention and Stand-at-ease positions', status: 'incomplete' },
              { id: 7002, text: 'Left turn, Right turn, and About turn', status: 'incomplete' },
            ]
          },
          {
            id: 8,
            text: 'Start maintaining a personal Scout Log Book',
            status: 'incomplete',
            subTasks: [
              { id: 8001, text: 'Start a daily log of activities', status: 'incomplete' },
              { id: 8002, text: 'Understand the purpose of a Scout Log Book', status: 'incomplete' },
            ]
          },
          {
            id: 9,
            text: 'Demonstrate simple health habits and personal hygiene',
            status: 'incomplete',
            subTasks: [
              { id: 9001, text: 'Know simple rules of health', status: 'incomplete' },
              { id: 9002, text: 'Practically apply health habits', status: 'incomplete' },
            ]
          },
          {
            id: 10,
            text: 'Safe from Harm: Know parent contacts and emergency procedures',
            status: 'incomplete',
            subTasks: [
              { id: 10001, text: 'Know parents Address and Telephone numbers', status: 'incomplete' },
              { id: 10002, text: 'Recognize different types of harm', status: 'incomplete' },
              { id: 10003, text: 'Walk alone in a permanent route under supervision', status: 'incomplete' },
            ]
          },
          {
            id: 11,
            text: 'Open and maintain a personal Savings Account (Thrift)',
            status: 'incomplete',
            subTasks: [
              { id: 11001, text: 'Know what thrift is', status: 'incomplete' },
              { id: 11002, text: 'Maintain an active savings account', status: 'incomplete' },
            ]
          },
          { id: 12, text: 'Perform a "Good Deed" every day', status: 'incomplete' },
          {
            id: 13,
            text: 'First Aid: Clean and dress a simple wound',
            status: 'incomplete',
            subTasks: [
              { id: 13001, text: 'Know the purpose of giving First Aid', status: 'incomplete' },
              { id: 13002, text: 'Demonstrate how to clean and dress a wound', status: 'incomplete' },
            ]
          },
          {
            id: 14,
            text: 'Conduct a 500m Treasure Hunt using Wood Craft signs',
            status: 'incomplete',
            subTasks: [
              { id: 14001, text: 'Identify Wood Craft signs', status: 'incomplete' },
              { id: 14002, text: 'Complete a 500m treasure hunt trail', status: 'incomplete' },
            ]
          },
        ]
      }
    ]
  },
  {
    id: 'scout',
    title: 'Scout Award',
    icon: '/images/badges/scout-award.png',
    color: 'orange',
    progress: 0,
    isLocked: true,
    status: 'in_progress',
    categories: [
      {
        title: 'National & Outdoor',
        requirements: [
          { id: 101, text: 'Brief history of the Scout Movement in Sri Lanka', status: 'incomplete' },
          {
            id: 102,
            text: 'Structure and basic meaning of the National Flag and Symbols',
            status: 'incomplete',
            subTasks: [
              { id: 10201, text: 'Know the National Sport, Flower, Tree, and Bird', status: 'incomplete' },
              { id: 10202, text: 'Identify the Government Crest', status: 'incomplete' },
            ]
          },
          { id: 103, text: 'Importance of health guidelines during epidemic/pandemic', status: 'incomplete' },
          { id: 104, text: 'Correct Posture and Habits (Standing, Walking, Sitting, etc.)', status: 'incomplete' },
          { id: 105, text: 'Social Health 1: Bad effects of substance abuse', status: 'incomplete' },
          { id: 106, text: 'Preparation for Flag Break and Hoisting', status: 'incomplete' },
          { id: 107, text: 'Know the Area within 0.5km radius of home', status: 'incomplete' },
          { id: 108, text: 'Active participation in two Outdoor Activities', status: 'incomplete' },
          { id: 109, text: 'Environment Protection for Sustainability', status: 'incomplete' },
          { id: 110, text: 'Safe from Harm 8: Helping others and safety concerns', status: 'incomplete' },
          {
            id: 111,
            text: 'Knots and Lashing 2',
            status: 'incomplete',
            subTasks: [
              { id: 11101, text: "Tie Fisherman's, Man harness, and Timber hitch", status: 'incomplete' },
              { id: 11102, text: "Tie Square, Diagonal, and Sheer lashings", status: 'incomplete' },
            ]
          },
          { id: 112, text: 'Pioneering Work 1 (Trestle and Portable flag mast)', status: 'incomplete' },
          { id: 113, text: 'Compass and Mapping 1 (16 directions and Conventional signs)', status: 'incomplete' },
          { id: 114, text: 'B.P. Exercises daily routine', status: 'incomplete' },
          { id: 115, text: 'Sense Training (Kim\'s Game and other senses)', status: 'incomplete' },
          { id: 116, text: 'Identify 15 Common Useful Trees', status: 'incomplete' },
          { id: 117, text: 'Smartness and Good Order 2 (March 50m)', status: 'incomplete' },
          { id: 118, text: 'First Aid 2 (DRSABC and CPR basics)', status: 'incomplete' },
          { id: 119, text: 'IT Literacy 1 (Input/Output and Storage)', status: 'incomplete' },
          { id: 120, text: 'Link Language Skills 1 (Alphabets and 15 words)', status: 'incomplete' },
          { id: 121, text: 'Good Habits 2 (Community Service Project)', status: 'incomplete' },
          { id: 122, text: 'Two Nights Camping in a tent', status: 'incomplete' },
          { id: 123, text: 'One Day Hike of 12km', status: 'incomplete' },
          { id: 124, text: 'Requirements for Sea/Air Scouts', status: 'incomplete' },
        ]
      }
    ]
  },
  {
    id: 'chief',
    title: "Chief Commissioner's Award",
    icon: '/images/badges/chief-commissioner-award.png',
    color: 'blue',
    progress: 0,
    isLocked: true,
    status: 'in_progress',
    categories: [
      {
        title: 'Leadership & Advanced Skills',
        requirements: [
          { id: 201, text: 'Thrift: Continue Savings Account level 2', status: 'incomplete' },
          { id: 202, text: 'Skills in Art and Hobbies 1 (Singing, Painting, etc.)', status: 'incomplete' },
          { id: 203, text: 'Knots and Whipping 3 (Fireman\'s chair, Sail maker\'s, etc.)', status: 'incomplete' },
          { id: 204, text: 'Maintain and safely use LP gas and Fire Places', status: 'incomplete' },
          { id: 205, text: 'Pioneering Project 2 (Camp gateways and Utility gadgets)', status: 'incomplete' },
          { id: 206, text: 'Tracks: Identifying and making plaster casts', status: 'incomplete' },
          { id: 207, text: 'Compass and Mapping 2 (Sketch map to scale)', status: 'incomplete' },
          { id: 208, text: 'Estimation of Heights, Lengths, and Weights', status: 'incomplete' },
          { id: 209, text: 'Safe use of Hand axe, Saw, and Knife', status: 'incomplete' },
          { id: 210, text: 'Observe and collect data on 10 Common Birds', status: 'incomplete' },
          { id: 211, text: 'Swimming 50m or Alternate Proficiency Badge', status: 'incomplete' },
          { id: 212, text: 'Smartness and Good Order 3 (March 100m saluting)', status: 'incomplete' },
          { id: 213, text: 'Social Health 2: Plan Patrol prevention activity', status: 'incomplete' },
          { id: 214, text: 'Know the Highway Code and Traffic Rules', status: 'incomplete' },
          { id: 215, text: 'IT Literacy 2 (Word processing and Spreadsheet basics)', status: 'incomplete' },
          { id: 216, text: 'Sketch map of area within 1km radius of home', status: 'incomplete' },
          { id: 217, text: 'Explain SLSA Vision and WOSM Mission', status: 'incomplete' },
          { id: 218, text: 'First Aid 3 (AED and Emergency handling)', status: 'incomplete' },
          { id: 219, text: 'Safe from Harm 9: School and Home emergencies', status: 'incomplete' },
          { id: 220, text: 'Environment: 10R method of conservation', status: 'incomplete' },
          { id: 221, text: 'Link Language Skills 2 (20 simple sentences)', status: 'incomplete' },
          { id: 222, text: 'Week-end camp of at least two nights', status: 'incomplete' },
          { id: 223, text: 'District Commissioner\'s Hike (22km)', status: 'incomplete' },
          { id: 224, text: 'Specialized Sea/Air Scout requirements', status: 'incomplete' },
        ]
      }
    ]
  },
  {
    id: 'pm',
    title: "Prime Minister's Scout Award",
    icon: '/images/badges/prime-minister-award.png',
    color: 'yellow',
    progress: 0,
    isLocked: true,
    status: 'in_progress',
    categories: [
      {
        title: 'Adventure & Technique',
        requirements: [
          { id: 301, text: 'Scout Promise and Law 2: Teaching new recruits', status: 'incomplete' },
          { id: 302, text: 'Structure of WOSM and 6 Scout Regions', status: 'incomplete' },
          { id: 303, text: 'Thrift: Regular savings increase level 3', status: 'incomplete' },
          { id: 304, text: 'Essay on Protection of Public Property', status: 'incomplete' },
          { id: 305, text: 'Present skills in Variety Entertainment/Exhibition', status: 'incomplete' },
          { id: 306, text: 'Perform Backwoodsman Cooking with the Patrol', status: 'incomplete' },
          { id: 307, text: 'Rope Splicing: Back, Eye, and Short splicing', status: 'incomplete' },
          { id: 308, text: 'Pioneering 3: Pulley systems and Anchorages', status: 'incomplete' },
          { id: 309, text: 'Pitch, Clean, and Pack a Wall Tent', status: 'incomplete' },
          { id: 310, text: 'Smartness 4: Marching with staff and salute', status: 'incomplete' },
          { id: 311, text: 'Prepare a Balanced Meal for a scout-aged person', status: 'incomplete' },
          { id: 312, text: 'Productivity Concepts (5S, Quality Circles, Kaizen)', status: 'incomplete' },
          { id: 313, text: 'IT Literacy 3 (Email and online registration)', status: 'incomplete' },
          { id: 314, text: 'Link Language 3: Self-introduction in 3 languages', status: 'incomplete' },
          { id: 315, text: 'Compass and Mapping 3 (Triangulation)', status: 'incomplete' },
          { id: 316, text: 'Repair and maintain Camp Equipment', status: 'incomplete' },
          { id: 317, text: 'Complete Adventure Skills (Tarzan Jump, Rope/Tree climb)', status: 'incomplete' },
          { id: 318, text: 'Basic Time Management concepts', status: 'incomplete' },
          { id: 319, text: 'Safe from Harm 10: Lost children and helpline', status: 'incomplete' },
          { id: 320, text: 'Four Nights Camping (stretch or staggered)', status: 'incomplete' },
          { id: 321, text: 'Six-hour Community Service Project', status: 'incomplete' },
          { id: 322, text: 'Make the Bushman\'s Thong with the ADC', status: 'incomplete' },
        ]
      }
    ]
  },
  {
    id: 'president',
    title: "President's Scout Award",
    icon: '/images/badges/president-award.png',
    color: 'purple',
    progress: 0,
    isLocked: true,
    status: 'in_progress',
    categories: [
      {
        title: 'Pinnacle of Leadership',
        requirements: [
          { id: 401, text: 'Present Games/Drama based on Promise and Law', status: 'incomplete' },
          { id: 402, text: 'Maintain Log Book for 2 years and 6 months', status: 'incomplete' },
          { id: 403, text: 'Create an original artistic or literary work', status: 'incomplete' },
          { id: 404, text: 'Train others for Scout and Chief Commissioner Award', status: 'incomplete' },
          { id: 405, text: 'Leadership in conducting a Pioneering Project', status: 'incomplete' },
          { id: 406, text: 'Leadership in Emergencies and Natural Disasters', status: 'incomplete' },
          { id: 407, text: 'Train a Scout about health habits for Membership Badge', status: 'incomplete' },
          { id: 408, text: 'IT Literacy 4 (PowerPoint and Link Language typing)', status: 'incomplete' },
          { id: 409, text: 'Link Language 4: 3-minute speech in another language', status: 'incomplete' },
          { id: 410, text: 'Safe from Harm 11: Risk assessment and integrity', status: 'incomplete' },
          { id: 411, text: 'Organizing a Hike including Skills and Challenges', status: 'incomplete' },
          { id: 412, text: 'Organize a Community Service Project (72 man-hours)', status: 'incomplete' },
          { id: 413, text: 'Four Nights Camping after Bushman\'s Thong', status: 'incomplete' },
        ]
      }
    ]
  }
];

export const proficiencyBadgesData: ProficiencyBadge[] = [
  // JUNIOR SCOUTS
  { id: 'ja-1', code: 'JA-1', title: 'Linguist', group: 'Public Service Group', level: 'junior', icon: '🗣️', description: 'Master link languages and communication.' },
  { id: 'ja-2', code: 'JA-2', title: 'Missioner', group: 'Public Service Group', level: 'junior', icon: '🙏', description: 'Service and religious milestones.' },
  { id: 'ja-3', code: 'JA-3', title: 'Fire-Fighter', group: 'Public Service Group', level: 'junior', icon: '🔥', description: 'Fire safety and prevention skills.' },
  { id: 'ja-4', code: 'JA-4', title: 'Signaller', group: 'Public Service Group', level: 'junior', icon: '🚩', description: 'Communication through signaling.' },
  { id: 'ja-5', code: 'JA-5', title: 'Cyclist', group: 'Public Service Group', level: 'junior', icon: '🚲', description: 'Bicycle maintenance and safety.' },
  { id: 'ja-6', code: 'JA-6', title: 'Guide', group: 'Public Service Group', level: 'junior', icon: '🗺️', description: 'Navigating and guiding others.' },
  { id: 'ja-7', code: 'JA-7', title: 'First Aid', group: 'Public Service Group', level: 'junior', icon: '🚑', description: 'Basic medical assistance.' },
  { id: 'ja-8', code: 'JA-8', title: 'Life Saver', group: 'Public Service Group', level: 'junior', icon: '🛟', description: 'Water safety and rescue.' },
  { id: 'ja-9', code: 'JA-9', title: 'Coxswain', group: 'Public Service Group', level: 'junior', icon: '⚓', description: 'Boating and water navigation.' },
  { id: 'ja-10', code: 'JA-10', title: 'Jobman', group: 'Public Service Group', level: 'junior', icon: '🛠️', description: 'Handyman and practical skills.' },

  { id: 'jb-1', code: 'JB-1', title: 'Camper', group: 'Camp Craft Group', level: 'junior', icon: '⛺', description: 'Camping and outdoor living.' },
  { id: 'jb-2', code: 'JB-2', title: 'Cook', group: 'Camp Craft Group', level: 'junior', icon: '👨‍🍳', description: 'Outdoor and camp cooking.' },
  { id: 'jb-3', code: 'JB-3', title: 'Woodcraftsman', group: 'Camp Craft Group', level: 'junior', icon: '🪓', description: 'Skills with wood and tools.' },
  { id: 'jb-4', code: 'JB-4', title: 'Pioneer', group: 'Camp Craft Group', level: 'junior', icon: '🏗️', description: 'Building structures with ropes.' },
  { id: 'jb-5', code: 'JB-5', title: 'Backwoodsman', group: 'Camp Craft Group', level: 'junior', icon: '🌲', description: 'Survival and nature skills.' },

  { id: 'jc-1', code: 'JC-1', title: 'Reader', group: 'Education Group', level: 'junior', icon: '📖', description: 'Literacy and reading skills.' },
  { id: 'jc-2', code: 'JC-2', title: 'Speaker', group: 'Education Group', level: 'junior', icon: '🎤', description: 'Public speaking and oratory.' },
  { id: 'jc-3', code: 'JC-3', title: 'Scholar', group: 'Education Group', level: 'junior', icon: '🎓', description: 'Academic achievement.' },
  { id: 'jc-4', code: 'JC-4', title: 'Scribe', group: 'Education Group', level: 'junior', icon: '✍️', description: 'Writing and documentation.' },

  { id: 'jd-1', code: 'JD-1', title: 'Athlete', group: 'Sports Group', level: 'junior', icon: '🏃', description: 'Physical fitness and track skills.' },
  { id: 'jd-2', code: 'JD-2', title: 'Swimmer', group: 'Sports Group', level: 'junior', icon: '🏊', description: 'Swimming proficiency.' },
  { id: 'jd-3', code: 'JD-3', title: 'Sportsman', group: 'Sports Group', level: 'junior', icon: '⚽', description: 'Team sports and fair play.' },
  { id: 'jd-4', code: 'JD-4', title: 'Rider', group: 'Sports Group', level: 'junior', icon: '🏇', description: 'Animal riding skills.' },

  { id: 'je-1', code: 'JE-1', title: 'Pen-Friend', group: 'Social Group', level: 'junior', icon: '✉️', description: 'International communication.' },
  { id: 'je-2', code: 'JE-2', title: 'Junior Organiser', group: 'Social Group', level: 'junior', icon: '📋', description: 'Leadership and organization.' },

  { id: 'jf-1', code: 'JF-1', title: 'Designer', group: 'Culture Group', level: 'junior', icon: '🎨', description: 'Creative design and art.' },
  { id: 'jf-2', code: 'JF-2', title: 'Music Maker', group: 'Culture Group', level: 'junior', icon: '🎵', description: 'Musical performance.' },
  { id: 'jf-3', code: 'JF-3', title: 'Actor', group: 'Culture Group', level: 'junior', icon: '🎭', description: 'Drama and performing arts.' },
  { id: 'jf-4', code: 'JF-4', title: 'Modeller', group: 'Culture Group', level: 'junior', icon: '🏺', description: 'Sculpting and modelling.' },
  { id: 'jf-5', code: 'JF-5', title: 'Dancer', group: 'Culture Group', level: 'junior', icon: '💃', description: 'Traditional and modern dance.' },

  { id: 'jg-1', code: 'JG-1', title: 'Woodman', group: 'Farmer Group', level: 'junior', icon: '🪵', description: 'Forestry and tree care.' },
  { id: 'jg-2', code: 'JG-2', title: 'Gardener', group: 'Farmer Group', level: 'junior', icon: '🪴', description: 'Planting and cultivation.' },
  { id: 'jg-3', code: 'JG-3', title: 'Angler', group: 'Farmer Group', level: 'junior', icon: '🎣', description: 'Fishing skills.' },
  { id: 'jg-4', code: 'JG-4', title: 'Small-Holder', group: 'Farmer Group', level: 'junior', icon: '🐓', description: 'Animal husbandry.' },
  { id: 'jg-5', code: 'JG-5', title: 'Herbalist', group: 'Farmer Group', level: 'junior', icon: '🌿', description: 'Traditional plant medicine.' },

  { id: 'jh-1', code: 'JH-1', title: 'Observer', group: 'New Explorer Group', level: 'junior', icon: '🔍', description: 'Observation and tracking.' },
  { id: 'jh-2', code: 'JH-2', title: 'Stalker', group: 'New Explorer Group', level: 'junior', icon: '👣', description: 'Stealth and tracking skills.' },
  { id: 'jh-3', code: 'JH-3', title: 'Map Maker', group: 'New Explorer Group', level: 'junior', icon: '🗺️', description: 'Cartography skills.' },
  { id: 'jh-4', code: 'JH-4', title: 'Starman', group: 'New Explorer Group', level: 'junior', icon: '⭐', description: 'Astronomy basics.' },
  { id: 'jh-5', code: 'JH-5', title: 'Weatherman', group: 'New Explorer Group', level: 'junior', icon: '☁️', description: 'Meteorology basics.' },
  { id: 'jh-6', code: 'JH-6', title: 'Explorer', group: 'New Explorer Group', level: 'junior', icon: '🧭', description: 'Advanced navigation.' },

  { id: 'ji-1', code: 'JI-1', title: "Boatswain's Mate", group: 'Seaman Group', level: 'junior', icon: '🛥️', description: 'Seamanship basics.' },
  { id: 'ji-2', code: 'JI-2', title: 'Oarsman', group: 'Seaman Group', level: 'junior', icon: '🚣', description: 'Rowing proficiency.' },
  { id: 'ji-3', code: 'JI-3', title: 'Canoeist', group: 'Seaman Group', level: 'junior', icon: '🛶', description: 'Canoeing skills.' },

  { id: 'jj-1', code: 'JJ-1', title: 'Aircraft Modeller', group: 'Airman Group', level: 'junior', icon: '✈️', description: 'Aviation modelling.' },
  { id: 'jj-2', code: 'JJ-2', title: 'Glider', group: 'Airman Group', level: 'junior', icon: '🪂', description: 'Gliding proficiency.' },
  { id: 'jj-3', code: 'JJ-3', title: 'Air Spotter', group: 'Airman Group', level: 'junior', icon: '🔭', description: 'Identifying aircraft.' },
  { id: 'jj-4', code: 'JJ-4', title: 'Air Apprentice', group: 'Airman Group', level: 'junior', icon: '👨‍🔧', description: 'Aviation mechanics.' },

  { id: 'jk-1', code: 'JK-1', title: 'Wireless Man', group: 'Practical Science Group', level: 'junior', icon: '📻', description: 'Radio communication.' },
  { id: 'jk-2', code: 'JK-2', title: 'Hand Worker', group: 'Practical Science Group', level: 'junior', icon: '🧤', description: 'Practical handiwork.' },
  { id: 'jk-3', code: 'JK-3', title: 'Cameraman', group: 'Practical Science Group', level: 'junior', icon: '📸', description: 'Photography skills.' },
  { id: 'jk-4', code: 'JK-4', title: 'Energy Manager', group: 'Practical Science Group', level: 'junior', icon: '⚡', description: 'Resource conservation.' },

  { id: 'jl-1', code: 'JL-1', title: 'Stamp Collector', group: 'Hobbies Group', level: 'junior', icon: '📮', description: 'Philately skills.' },
  { id: 'jl-2', code: 'JL-2', title: 'Junior Collector', group: 'Hobbies Group', level: 'junior', icon: '🪙', description: 'General collection hobby.' },
  { id: 'jl-3', code: 'JL-3', title: 'Junior Saver', group: 'Hobbies Group', level: 'junior', icon: '💰', description: 'Thrift and savings.' },

  { id: 'jm-1', code: 'JM-1', title: 'Junior Happy Home', group: 'Family Life Education Group', level: 'junior', icon: '🏠', description: 'Family and home care.' },

  // SENIOR SCOUTS
  { id: 'sa-1', code: 'SA-1', title: 'Interpreter', group: 'Public Service Group', level: 'senior', icon: '🌐', description: 'Advanced language translation.' },
  { id: 'sa-2', code: 'SA-2', title: 'Public Health', group: 'Public Service Group', level: 'senior', icon: '🩺', description: 'Community hygiene awareness.' },
  { id: 'sa-3', code: 'SA-3', title: 'Fireman', group: 'Public Service Group', level: 'senior', icon: '🚒', description: 'Advanced fire rescue.' },
  { id: 'sa-4', code: 'SA-4', title: 'Leading Signaller', group: 'Public Service Group', level: 'senior', icon: '📡', description: 'Expert communication.' },
  { id: 'sa-5', code: 'SA-5', title: 'Dispatch Rider', group: 'Public Service Group', level: 'senior', icon: '🏍️', description: 'Urgent delivery skills.' },
  { id: 'sa-6', code: 'SA-6', title: 'Path Finder', group: 'Public Service Group', level: 'senior', icon: '🗺️', description: 'Expert tracking.' },
  { id: 'sa-7', code: 'SA-7', title: 'Ambulance', group: 'Public Service Group', level: 'senior', icon: '🚑', description: 'First aid and paramedics.' },
  { id: 'sa-8', code: 'SA-8', title: 'Rescuer', group: 'Public Service Group', level: 'senior', icon: '🆘', description: 'Search and rescue ops.' },
  { id: 'sa-9', code: 'SA-9', title: 'Pilot', group: 'Public Service Group', level: 'senior', icon: '🧑‍✈️', description: 'Aviation leadership.' },
  { id: 'sa-10', code: 'SA-10', title: 'Handyman', group: 'Public Service Group', level: 'senior', icon: '🪛', description: 'Advanced repair skills.' },
  { id: 'sa-11', code: 'SA-11', title: 'Civics', group: 'Public Service Group', level: 'senior', icon: '🏛️', description: 'Citizenship and duty.' },
  { id: 'sa-12', code: 'SA-12', title: 'Conservation', group: 'Public Service Group', level: 'senior', icon: '♻️', description: 'Environmental protection.' },

  { id: 'sb-1', code: 'SB-1', title: 'Camp Warden', group: 'Camp Craft Group', level: 'senior', icon: '🏰', description: 'Campsite management.' },
  { id: 'sb-2', code: 'SB-2', title: 'Master Cook', group: 'Camp Craft Group', level: 'senior', icon: '🔪', description: 'Advanced culinary skills.' },
  { id: 'sb-3', code: 'SB-3', title: 'Naturalist', group: 'Camp Craft Group', level: 'senior', icon: '🦋', description: 'Expert nature study.' },
  { id: 'sb-4', code: 'SB-4', title: 'Senior Pioneer', group: 'Camp Craft Group', level: 'senior', icon: '🏗️', description: 'Major pioneering projects.' },
  { id: 'sb-5', code: 'SB-5', title: 'Venturer', group: 'Camp Craft Group', level: 'senior', icon: '⛰️', description: 'Expedition and adventure.' },
  { id: 'sb-6', code: 'SB-6', title: 'Quarter Master', group: 'Camp Craft Group', level: 'senior', icon: '🗝️', description: 'Logistics and supplies.' },

  { id: 'sc-1', code: 'SC-1', title: 'Bookman', group: 'Education Group', level: 'senior', icon: '📚', description: 'Library and literature.' },
  { id: 'sc-2', code: 'SC-2', title: 'Orator', group: 'Education Group', level: 'senior', icon: '🏛️', description: 'Advanced public speaking.' },
  { id: 'sc-3', code: 'SC-3', title: 'Senior Scholar', group: 'Education Group', level: 'senior', icon: '📜', description: 'Advanced academic goals.' },
  { id: 'sc-4', code: 'SC-4', title: 'Clerk', group: 'Education Group', level: 'senior', icon: '📎', description: 'Administrative skills.' },
  { id: 'sc-5', code: 'SC-5', title: 'Typist', group: 'Education Group', level: 'senior', icon: '⌨️', description: 'Typing and data entry.' },
  { id: 'sc-6', code: 'SC-6', title: 'Journalist', group: 'Education Group', level: 'senior', icon: '📰', description: 'Reporting and media.' },

  { id: 'sd-1', code: 'SD-1', title: 'Senior Athlete', group: 'Sports Group', level: 'senior', icon: '🏆', description: 'Competitive athletics.' },
  { id: 'sd-2', code: 'SD-2', title: 'Master Swimmer', group: 'Sports Group', level: 'senior', icon: '🏊‍♂️', description: 'Advanced swimming.' },
  { id: 'sd-3', code: 'SD-3', title: 'Master Sportsman', group: 'Sports Group', level: 'senior', icon: '🏅', description: 'Sporting leadership.' },
  { id: 'sd-4', code: 'SD-4', title: 'Horseman', group: 'Sports Group', level: 'senior', icon: '🏇', description: 'Expert horsemanship.' },
  { id: 'sd-5', code: 'SD-5', title: 'Archery', group: 'Sports Group', level: 'senior', icon: '🏹', description: 'Skill with bow and arrow.' },

  { id: 'se-1', code: 'SE-1', title: 'World Friendship', group: 'Social Group', level: 'senior', icon: '🤝', description: 'Global scouting bonds.' },
  { id: 'se-2', code: 'SE-2', title: 'Organiser', group: 'Social Group', level: 'senior', icon: '🗓️', description: 'Expert event management.' },

  { id: 'sf-1', code: 'SF-1', title: 'Artist', group: 'Culture Group', level: 'senior', icon: '🎨', description: 'Fine arts and creation.' },
  { id: 'sf-2', code: 'SF-2', title: 'Musician', group: 'Culture Group', level: 'senior', icon: '🎻', description: 'Advanced music skill.' },
  { id: 'sf-3', code: 'SF-3', title: 'Play Actor', group: 'Culture Group', level: 'senior', icon: '🎭', description: 'Stage and play direction.' },
  { id: 'sf-4', code: 'SF-4', title: 'Sculptor', group: 'Culture Group', level: 'senior', icon: '🗿', description: '3D art and sculpting.' },
  { id: 'sf-5', code: 'SF-5', title: 'Folk Dancer', group: 'Culture Group', level: 'senior', icon: '🩰', description: 'Cultural heritage dance.' },

  { id: 'sg-1', code: 'SG-1', title: 'Forester', group: 'Farmer Group', level: 'senior', icon: '🌲', description: 'Expert forest management.' },
  { id: 'sg-2', code: 'SG-2', title: 'Horticulturist', group: 'Farmer Group', level: 'senior', icon: '🌻', description: 'Scientific gardening.' },
  { id: 'sg-3', code: 'SG-3', title: 'Fisherman', group: 'Farmer Group', level: 'senior', icon: '🛶', description: 'Commercial fishing skills.' },
  { id: 'sg-4', code: 'SG-4', title: 'Poultryman', group: 'Farmer Group', level: 'senior', icon: '🥚', description: 'Poultry farm management.' },
  { id: 'sg-5', code: 'SG-5', title: 'Dairyman', group: 'Farmer Group', level: 'senior', icon: '🥛', description: 'Dairy farm expertise.' },
  { id: 'sg-6', code: 'SG-6', title: 'Paddy Cultivator', group: 'Farmer Group', level: 'senior', icon: '🌾', description: 'Rice farming mastery.' },

  { id: 'sh-1', code: 'SH-1', title: 'Tracker', group: 'Explorer Group', level: 'senior', icon: '👣', description: 'Master tracking skills.' },
  { id: 'sh-2', code: 'SH-2', title: 'Hiker', group: 'Explorer Group', level: 'senior', icon: '🥾', description: 'Advanced hiking skill.' },
  { id: 'sh-3', code: 'SH-3', title: 'Surveyor', group: 'Explorer Group', level: 'senior', icon: '📏', description: 'Land survey and mapping.' },
  { id: 'sh-4', code: 'SH-4', title: 'Astronomer', group: 'Explorer Group', level: 'senior', icon: '🔭', description: 'Advanced astronomy.' },
  { id: 'sh-5', code: 'SH-5', title: 'Meteorologist', group: 'Explorer Group', level: 'senior', icon: '🌡️', description: 'Advanced weather study.' },
  { id: 'sh-6', code: 'SH-6', title: 'Senior Explorer', group: 'Explorer Group', level: 'senior', icon: '🧭', description: 'Master expedition leader.' },
  { id: 'sh-7', code: 'SH-7', title: 'Archeologist', group: 'Explorer Group', level: 'senior', icon: '🏺', description: 'Historic site study.' },

  { id: 'si-1', code: 'SI-1', title: 'Boatswain', group: 'Seaman Group', level: 'senior', icon: '⚓', description: 'Advanced seamanship.' },
  { id: 'si-2', code: 'SI-2', title: '6-Oar Helmsman', group: 'Seaman Group', level: 'senior', icon: '🚣‍♂️', description: 'Expert rowing leader.' },
  { id: 'si-3', code: 'SI-3', title: 'Master Canoeist', group: 'Seaman Group', level: 'senior', icon: '🛶', description: 'Expert canoeing.' },

  { id: 'sj-1', code: 'SJ-1', title: 'Aircraft Constructor', group: 'Airman Group', level: 'senior', icon: '🏗️', description: 'Building aircraft models.' },
  { id: 'sj-2', code: 'SJ-2', title: 'Glider Pilot', group: 'Airman Group', level: 'senior', icon: '🛩️', description: 'Piloting gliders.' },
  { id: 'sj-3', code: 'SJ-3', title: 'Air Observer', group: 'Airman Group', level: 'senior', icon: '👁️‍🗨️', description: 'Professional air spotting.' },
  { id: 'sj-4', code: 'SJ-4', title: 'Air Mechanic', group: 'Airman Group', level: 'senior', icon: '🔧', description: 'Aircraft maintenance.' },
  { id: 'sj-5', code: 'SJ-5', title: 'Air Navigator', group: 'Airman Group', level: 'senior', icon: '🧭', description: 'Advanced air navigation.' },

  { id: 'sk-1', code: 'SK-1', title: 'Radio Mechanic', group: 'Practical Science Group', level: 'senior', icon: '📡', description: 'Radio tech and repair.' },
  { id: 'sk-2', code: 'SK-2', title: 'Handicraftsman', group: 'Practical Science Group', level: 'senior', icon: '🧶', description: 'Master of handicrafts.' },
  { id: 'sk-3', code: 'SK-3', title: 'Photographer', group: 'Practical Science Group', level: 'senior', icon: '🎞️', description: 'Professional photography.' },
  { id: 'sk-4', code: 'SK-4', title: 'Electrician', group: 'Practical Science Group', level: 'senior', icon: '🔌', description: 'Electrical installations.' },
  { id: 'sk-5', code: 'SK-5', title: 'Motor Mechanic', group: 'Practical Science Group', level: 'senior', icon: '🚜', description: 'Engine maintenance.' },
  { id: 'sk-6', code: 'SK-6', title: 'Energy Conservator', group: 'Practical Science Group', level: 'senior', icon: '♻️', description: 'Energy efficiency expert.' },

  { id: 'sl-1', code: 'SL-1', title: 'Philatelist', group: 'Hobbies Group', level: 'senior', icon: '🖼️', description: 'Expert stamp collection.' },
  { id: 'sl-2', code: 'SL-2', title: 'Outstanding Collector', group: 'Hobbies Group', level: 'senior', icon: '🪙', description: 'Rare collection master.' },
  { id: 'sl-3', code: 'SL-3', title: 'Senior Saver', group: 'Hobbies Group', level: 'senior', icon: '📈', description: 'Advanced financial thrift.' },

  { id: 'sm-1', code: 'SM-1', title: 'Senior Happy Home', group: 'Family Life Education Group', level: 'senior', icon: '👨‍👩‍👧‍👦', description: 'Advanced home management.' }
];
