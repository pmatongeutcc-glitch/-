import { PositiveHabit, NegativeHabit, ShopItem, Quest, Badge, Boss, BossWeaknessInfo, LeaderboardEntry, ThemeKey, ThemeColors, SoundSetKey, RewardFxColorTheme } from "../types";

export const DAILY_QUOTES = [
  "ความพยายามเพียงเล็กน้อยในทุกๆ วัน คือกุญแจสู่ความสำเร็จ 🔑",
  "อย่ารอให้พร้อมที่สุด เพราะความพร้อมไม่มีจริง เริ่มเลย! 🚀",
  "คนที่ล้มเหลวคือคนที่ไม่เคยลงมือทำอะไรเลย 💪",
  "วินัยคือสะพานเชื่อมระหว่างเป้าหมายกับความสำเร็จ 🌉",
  "โฟกัสกับสิ่งที่คุณควบคุมได้ แล้วปล่อยวางสิ่งที่เหลือ 🍃",
  "วันนี้คือโอกาสใหม่ที่จะทำตัวให้ดีกว่าเมื่อวาน 🌅",
  "ความสำเร็จที่ยิ่งใหญ่ เกิดจากการสะสมชัยชนะเล็กๆ ในแต่ละวัน 🏆",
  "จงสร้างนิสัยที่ดี แล้วนิสัยที่ดีจะสร้างคุณ ✨"
];

export const DAILY_QUOTES_EN = [
  "Small daily improvements over time lead to stunning results. 🔑",
  "Don't wait until everything is just right. Start now! 🚀",
  "The only person who fails is the one who never begins. 💪",
  "Discipline is the bridge between goals and accomplishment. 🌉",
  "Focus on what you can control, and let go of what you cannot. 🍃",
  "Today is another chance to get better than yesterday. 🌅",
  "Great achievements are built on small daily victories. 🏆",
  "First we form habits, then habits form us. ✨"
];

export const DEFAULT_POSITIVE_HABITS: PositiveHabit[] = [
  { id: "read", label: "อ่านหนังสือ", time: "morning", points: 40, priority: "medium" },
  { id: "exercise", label: "ออกกำลังกาย", time: "morning", points: 50, priority: "high" },
  { id: "water", label: "ดื่มน้ำ 1-2 แก้ว", time: "morning", points: 30, priority: "high" },
  { id: "meditate", label: "นั่งสมาธิ 5-10 นาที", time: "morning", points: 35, priority: "medium" },
  { id: "todolist", label: "เขียน To-do list", time: "morning", points: 30, priority: "high" },
  { id: "work", label: "ทำงาน / โฟกัสงานหลัก", time: "day", points: 50, priority: "high" },
  { id: "cleanEating", label: "กินอาหารคลีน / มีประโยชน์", time: "day", points: 35, priority: "medium" },
  { id: "cook", label: "ทำอาหารกินเอง", time: "day", points: 30, priority: "low" },
  { id: "language", label: "เรียนภาษาอังกฤษ / ญี่ปุ่น", time: "day", points: 40, priority: "medium" },
  { id: "podcast", label: "ฟัง Podcast พัฒนาตัวเอง", time: "day", points: 25, priority: "low" },
  { id: "walk", label: "เดินครบ 8,000 ก้าว", time: "day", points: 50, priority: "high" },
  { id: "tidyRoom", label: "เก็บห้อง / จัดโต๊ะทำงาน", time: "evening", points: 35, priority: "medium" },
  { id: "laundry", label: "ซักผ้า / ตากผ้า", time: "evening", points: 25, priority: "low" },
  { id: "organize", label: "จัดกระเป๋าเตรียมพรุ่งนี้", time: "evening", points: 25, priority: "low" },
  { id: "expense", label: "จดบันทึกรายรับรายจ่าย", time: "evening", points: 35, priority: "high" },
  { id: "diary", label: "เขียนไดอารี่ทบทวนวัน", time: "evening", points: 35, priority: "medium" },
  { id: "sleepEarly", label: "เข้านอนก่อนเที่ยงคืน", time: "evening", points: 45, priority: "high" },
];

export const DEFAULT_NEGATIVE_HABITS: NegativeHabit[] = [
  { id: "buffet", label: "หมูกระทะ / บุฟเฟต์มื้อดึก", points: 120, priority: "high" },
  { id: "dessert", label: "ของหวาน / ชานมไข่มุก", points: 60, priority: "medium" },
  { id: "lateSleep", label: "นอนดึกเกินเวลา / โต้รุ่ง", points: 70, priority: "high" },
  { id: "impulseBuy", label: "ซื้อของฟุ่มเฟือยตามอารมณ์", points: 100, priority: "medium" },
  { id: "doomScroll", label: "ไถโซเชียลไร้สาระเกิน 1 ชม.", points: 50, priority: "high" },
];

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  // พิเศษ & กาชา
  { id: "gacha", title: "กล่องสุ่มกาชา", price: 120, icon: "🎁", type: "gacha", category: "special", desc: "สุ่มลุ้นรับรางวัลเล็ก-ใหญ่ หรือไอเทมแรร์สุดคุ้ม!" },
  { id: "freeze", title: "แช่แข็งสตรีค (Streak Freeze)", price: 500, icon: "❄️", type: "freeze", category: "special", desc: "รักษาสถิติความต่อเนื่องในวันที่ลืมบันทึก" },

  // ของกิน & เครื่องดื่ม (Food & Drinks)
  { id: "snack", title: "ขนมขบเคี้ยว 1 ห่อ", price: 90, icon: "🍫", type: "reward", category: "food", desc: "ให้รางวัลตัวเองด้วยขนมอร่อยๆ 1 ชิ้น" },
  { id: "bakery", title: "ขนมปัง / เบเกอรี่หอมกรุ่น", price: 110, icon: "🥐", type: "reward", category: "food", desc: "แวะซื้อขนมปังหรือโดนัทร้านโปรดจากเตา" },
  { id: "bubbletea", title: "ชานมไข่มุกแก้วโปรด", price: 130, icon: "🧋", type: "reward", category: "food", desc: "ชานมไข่มุกหวานน้อยเย็นชื่นใจ แบบสบายใจไร้กังวล" },
  { id: "icecream", title: "ไอศกรีม 1 ถ้วย", price: 130, icon: "🍦", type: "reward", category: "food", desc: "ของหวานเย็นๆ ชื่นใจ ดับร้อนเติมพลัง" },
  { id: "coffee", title: "กาแฟพรีเมียม / ชาแก้วโปรด", price: 140, icon: "☕", type: "reward", category: "food", desc: "ซื้อเครื่องดื่มแก้วพิเศษในคาเฟ่ 1 แก้ว" },
  { id: "delivery", title: "สั่งอาหารเดลิเวอรี่ตามใจ", price: 450, icon: "🛵", type: "reward", category: "food", desc: "กินของอร่อยส่งตรงถึงบ้าน ไม่ต้องทำเอง" },
  { id: "pizza", title: "สั่งพิซซ่าถาดโปรดชีสเยิ้ม", price: 600, icon: "🍕", type: "reward", category: "food", desc: "ฉลองมื้อพิเศษด้วยพิซซ่าหน้าโปรดถาดใหญ่" },
  { id: "shabu", title: "กินชาบู / หมูกระทะ", price: 750, icon: "🍲", type: "reward", category: "food", desc: "มื้อจัดหนัก ให้รางวัลความพยายามตลอดสัปดาห์" },
  { id: "omakase", title: "มื้อหรู Omakase / ดินเนอร์พิเศษ", price: 2600, icon: "🍣", type: "reward", category: "food", desc: "ให้รางวัลตัวเองด้วยมื้ออาหารสุดพรีเมียม" },

  // บันเทิง & พักผ่อน (Fun & Relax)
  { id: "music", title: "ฟังเพลงโปรดชิลๆ 1 ชม.", price: 100, icon: "🎧", type: "reward", category: "fun", desc: "ปล่อยใจไปกับเสียงเพลงโปรดโดยไม่คิดเรื่องงาน" },
  { id: "nap", title: "งีบกลางวัน 30 นาที", price: 150, icon: "😴", type: "reward", category: "fun", desc: "พักผ่อนสายตาชาร์จพลังสมองยามบ่ายอย่างเต็มอิ่ม" },
  { id: "series", title: "ดูซีรีส์ / อนิเมะ 1 ตอน", price: 180, icon: "📺", type: "reward", category: "fun", desc: "ดื่มด่ำกับตอนใหม่โดยไม่รู้สึกผิด" },
  { id: "game", title: "เล่นเกม 1 ชั่วโมง", price: 200, icon: "🎮", type: "reward", category: "fun", desc: "ลุยด่านในเกมโปรดคลายเครียดเต็มที่" },
  { id: "youtube", title: "ดูคลิปเพลินๆ 1-2 ชม.", price: 220, icon: "📱", type: "reward", category: "fun", desc: "พักสมองไปกับการไถคลิป YouTube หรือ TikTok" },
  { id: "stationery", title: "เครื่องเขียน / สมุดโน้ตใหม่", price: 350, icon: "✏️", type: "reward", category: "fun", desc: "ซื้ออุปกรณ์เครื่องเขียนสวยๆ เติมไฟในการทำงาน" },
  { id: "movie", title: "ตั๋วดูหนังในโรงภาพยนตร์", price: 500, icon: "🎬", type: "reward", category: "fun", desc: "จองตั๋วชมภาพยนตร์เรื่องที่อยากดูในโรงหนัง" },
  { id: "massage", title: "นวดผ่อนคลาย / แช่น้ำอุ่นสปา", price: 650, icon: "💆", type: "reward", category: "fun", desc: "ผ่อนคลายกล้ามเนื้อที่เหนื่อยล้าจากการทำงานหนัก" },
  { id: "boardgame", title: "ปาร์ตี้บอร์ดเกมกับเพื่อน", price: 700, icon: "🎲", type: "reward", category: "fun", desc: "แฮงก์เอาต์และหัวเราะร่วมกับแก๊งเพื่อนสนิท" },
  { id: "cafe_chill", title: "นั่งชิลคาเฟ่สวยๆ 1 วัน", price: 800, icon: "🌿", type: "reward", category: "fun", desc: "พกหนังสือไปนั่งจิบกาแฟในบรรยากาศร่มรื่น" },

  // รางวัลเป้าหมายใหญ่ (Milestones & Gear)
  { id: "book", title: "ซื้อหนังสือเล่มใหม่", price: 850, icon: "📚", type: "reward", category: "milestone", desc: "ซื้อหนังสือที่อยากอ่านมานานเพื่อพัฒนาตัวเอง" },
  { id: "clothes", title: "ซื้อเสื้อผ้าใหม่ให้รางวัลตัวเอง", price: 1200, icon: "👗", type: "reward", category: "milestone", desc: "อัปเดตตู้เสื้อผ้าด้วยชุดใหม่สวยๆ" },
  { id: "shoes", title: "ซื้อรองเท้าคู่ใหม่", price: 1500, icon: "👟", type: "reward", category: "milestone", desc: "สนีกเกอร์หรือรองเท้าวิ่งคู่ใหม่เพื่อก้าวต่อไป" },
  { id: "newgame", title: "ซื้อเกมใหม่บน Steam/Console", price: 1600, icon: "🕹️", type: "reward", category: "milestone", desc: "จัดเกมฟอร์มยักษ์ที่เล็งไว้มาเล่นให้หนำใจ" },
  { id: "dayoff", title: "วันหยุดพักผ่อน 1 วันเต็ม", price: 2000, icon: "🏝️", type: "reward", category: "milestone", desc: "พักผ่อนชาร์จแบตให้ตัวเอง 1 วันเต็มๆ โดยไม่ต้องทำอะไรเลย" },
  { id: "concert", title: "ตั๋วคอนเสิร์ต / เทศกาลดนตรี", price: 3000, icon: "🎟️", type: "reward", category: "milestone", desc: "ไปสัมผัสพลังบวกในคอนเสิร์ตศิลปินคนโปรด" },
  { id: "gadget", title: "ซื้อ Gadget / หูฟังไอทีใหม่", price: 3500, icon: "🎧", type: "reward", category: "milestone", desc: "ของเล่นเทคโนโลยีชิ้นใหม่ที่เล็งไว้" },
  { id: "trip", title: "ทริปเที่ยว / Staycation", price: 4500, icon: "🏖️", type: "reward", category: "milestone", desc: "รางวัลใหญ่! ออกไปเที่ยวพักผ่อนชาร์จพลังชีวิต" },
  { id: "wishlist_gift", title: "ของขวัญชิ้นใหญ่ใน Wishlist", price: 4800, icon: "✨", type: "reward", category: "milestone", desc: "ของขวัญชิ้นสำคัญที่สุดที่คุณมุ่งมั่นเพื่อมันมาตลอด!" },
];

export const DAILY_QUESTS_POOL: Quest[] = [
  // สุขภาพ & ร่างกาย (Health & Fitness)
  {
    id: 'q_pos_water',
    label: 'ดื่มน้ำเพื่อสุขภาพ 1-2 แก้วในตอนเช้า',
    enLabel: 'Drink 1-2 glasses of water in the morning',
    icon: '💧',
    reward: 60,
    check: (day) => Boolean(day.positives?.water),
  },
  {
    id: 'q_pos_exercise',
    label: 'ออกกำลังกายเพื่อความฟิตและสุขภาพ',
    enLabel: 'Exercise for health and fitness',
    icon: '🏃',
    reward: 100,
    check: (day) => Boolean(day.positives?.exercise),
  },
  {
    id: 'q_pos_walk',
    label: 'เดินครบ 8,000 ก้าว หรือขยับร่างกายอย่างกระฉับกระเฉง',
    enLabel: 'Walk 8,000 steps or stay active',
    icon: '👟',
    reward: 120,
    check: (day) => Boolean(day.positives?.walk),
  },
  {
    id: 'q_pos_clean_food',
    label: 'เลือกทานอาหารคลีน / ทำอาหารทานเอง',
    enLabel: 'Eat clean food or cook a healthy meal',
    icon: '🥗',
    reward: 90,
    check: (day) => Boolean(day.positives?.cleanEating || day.positives?.cook),
  },
  {
    id: 'q_health_combo',
    label: 'คู่หูสุขภาพ: ดื่มน้ำ + (ออกกำลังกาย หรือ เดิน 8,000 ก้าว)',
    enLabel: 'Health Duo: Drink water + (Exercise or Walk)',
    icon: '💪',
    reward: 150,
    check: (day) => Boolean(day.positives?.water && (day.positives?.exercise || day.positives?.walk)),
  },

  // โฟกัส & พัฒนาตนเอง (Focus & Growth)
  {
    id: 'q_pos_work',
    label: 'โฟกัสเต็มที่: เคลียร์งานหลักสำเร็จอย่างมีสมาธิ',
    enLabel: 'Deep focus: Complete primary work tasks',
    icon: '💻',
    reward: 100,
    check: (day) => Boolean(day.positives?.work),
  },
  {
    id: 'q_pos_todolist',
    label: 'วางแผนชีวิต: เขียน To-do list สิ่งที่จะทำในวันนี้',
    enLabel: 'Plan ahead: Write your daily To-do list',
    icon: '📋',
    reward: 70,
    check: (day) => Boolean(day.positives?.todolist),
  },
  {
    id: 'q_pos_read',
    label: 'เปิดโลกความคิด: อ่านหนังสือพัฒนาตนเอง',
    enLabel: 'Self-development: Read a book or article',
    icon: '📖',
    reward: 90,
    check: (day) => Boolean(day.positives?.read),
  },
  {
    id: 'q_pos_learn',
    label: 'ฝึกทักษะใหม่: เรียนภาษา หรือ ฟัง Podcast สร้างแรงบันดาลใจ',
    enLabel: 'Learn something new: Language or Podcast',
    icon: '🎧',
    reward: 100,
    check: (day) => Boolean(day.positives?.language || day.positives?.podcast),
  },
  {
    id: 'q_prod_combo',
    label: 'สุดยอดผลงาน: เขียน To-do list + โฟกัสงานหลักสำเร็จ',
    enLabel: 'Productivity Combo: To-do list + Main work focus',
    icon: '⚡',
    reward: 140,
    check: (day) => Boolean(day.positives?.todolist && day.positives?.work),
  },

  // จิตใจ & ความสุข (Mind & Mental Wellness)
  {
    id: 'q_pos_meditate',
    label: 'พักสงบจิตใจ: นั่งสมาธิหรือฝึกหายใจ 5-10 นาที',
    enLabel: 'Mindfulness: Meditate or breathe for 5-10 mins',
    icon: '🧘',
    reward: 80,
    check: (day) => Boolean(day.positives?.meditate),
  },
  {
    id: 'q_log_mood',
    label: 'เช็คอินอารมณ์: สำรวจและบันทึกความรู้สึกของตัวเองวันนี้',
    enLabel: 'Mood Check-in: Record your daily feeling',
    icon: '😊',
    reward: 60,
    check: (day) => Boolean(day.mood),
  },
  {
    id: 'q_mood_great',
    label: 'วันแห่งรอยยิ้ม: บันทึกอารมณ์ในระดับ "ดี" หรือ "ดีมาก"',
    enLabel: 'Positive Vibe: Log a "Good" or "Great" mood',
    icon: '🌟',
    reward: 80,
    check: (day) => day.mood === 'great' || day.mood === 'good',
  },
  {
    id: 'q_diary_short',
    label: 'เขียนบันทึกประจำวัน: บันทึกเรื่องราวหรือข้อคิด (15+ ตัวอักษร)',
    enLabel: 'Daily Diary: Write reflections (15+ characters)',
    icon: '✍️',
    reward: 70,
    check: (day) => (day.diaryText?.trim().length || 0) >= 15,
  },
  {
    id: 'q_diary_deep',
    label: 'ทบทวนวันอย่างลึกซึ้ง: เขียนไดอารี่และข้อคิด (40+ ตัวอักษร)',
    enLabel: 'Deep Reflection: Detailed diary (40+ characters)',
    icon: '📜',
    reward: 120,
    check: (day) => (day.diaryText?.trim().length || 0) >= 40,
  },

  // การเงิน & การออม (Finance & Savings)
  {
    id: 'q_save_starter',
    label: 'หยอดกระปุกเริ่มต้น: ออมเงินวันนี้ตั้งแต่ 50 บาทขึ้นไป',
    enLabel: 'Starter Saver: Save 50 THB or more today',
    icon: '🪙',
    reward: 60,
    check: (day) => (day.savings || 0) >= 50,
  },
  {
    id: 'q_save_100',
    label: 'สร้างวินัยการเงิน: ออมเงินให้ครบ 100 บาท',
    enLabel: 'Discipline Saver: Save 100 THB or more',
    icon: '💰',
    reward: 90,
    check: (day) => (day.savings || 0) >= 100,
  },
  {
    id: 'q_save_200',
    label: 'เก็บออมขั้นกลาง: ออมเงินวันนี้ 200 บาทขึ้นไป',
    enLabel: 'Mid Saver: Save 200 THB or more',
    icon: '💵',
    reward: 120,
    check: (day) => (day.savings || 0) >= 200,
  },
  {
    id: 'q_save_300',
    label: 'เป้าหมายคนมุ่งมั่น: ออมเงินสะสมในวันตั้งแต่ 300 บาท',
    enLabel: 'Target Saver: Save 300 THB or more',
    icon: '💎',
    reward: 150,
    check: (day) => (day.savings || 0) >= 300,
  },
  {
    id: 'q_pos_expense',
    label: 'ทำบัญชีชีวิต: บันทึกรายรับ-รายจ่ายของวันนี้',
    enLabel: 'Track Expenses: Record daily expenses',
    icon: '📒',
    reward: 80,
    check: (day) => Boolean(day.positives?.expense),
  },
  {
    id: 'q_finance_master',
    label: 'การเงินฉลาด: ออมเงิน 100บ. + บันทึกรายรับรายจ่าย',
    enLabel: 'Smart Finance: Save 100+ THB + Log expenses',
    icon: '📊',
    reward: 150,
    check: (day) => (day.savings || 0) >= 100 && Boolean(day.positives?.expense),
  },

  // การใช้ชีวิต & วินัยรอบด้าน (Living & Holistic Discipline)
  {
    id: 'q_pos_tidy',
    label: 'เคลียร์สิ่งแวดล้อม: เก็บห้อง จัดโต๊ะทำงาน หรือ ซักผ้า',
    enLabel: 'Clean Space: Tidy room, desk, or do laundry',
    icon: '🧹',
    reward: 90,
    check: (day) => Boolean(day.positives?.tidyRoom || day.positives?.laundry || day.positives?.organize),
  },
  {
    id: 'q_pos_sleep_early',
    label: 'พักผ่อนเต็มอิ่ม: เข้านอนตรงเวลา / ก่อนเที่ยงคืน',
    enLabel: 'Sleep on time: Go to bed before midnight',
    icon: '🌙',
    reward: 100,
    check: (day) => Boolean(day.positives?.sleepEarly),
  },
  {
    id: 'q_morning_routine',
    label: 'อรุณสวัสดิ์ทรงพลัง: ทำนิสัยช่วงเช้าให้ครบ 2 อย่าง',
    enLabel: 'Morning Routine: Complete 2 morning habits',
    icon: '🌅',
    reward: 110,
    check: (day) => ['read', 'exercise', 'water', 'meditate', 'todolist'].filter((k) => day.positives?.[k]).length >= 2,
  },
  {
    id: 'q_evening_routine',
    label: 'รูทีนปิดวัน: ทำนิสัยช่วงเย็น/ก่อนนอนให้ครบ 2 อย่าง',
    enLabel: 'Evening Routine: Complete 2 evening habits',
    icon: '🌆',
    reward: 110,
    check: (day) => ['tidyRoom', 'laundry', 'organize', 'expense', 'diary', 'sleepEarly'].filter((k) => day.positives?.[k]).length >= 2,
  },
  {
    id: 'q_no_neg',
    label: 'ยอดเยี่ยมไร้ที่ติ: ไม่ทำพฤติกรรมฉุดรั้งเลยในวันนี้',
    enLabel: 'Mind Shield: Zero negative habits today',
    icon: '🛡️',
    reward: 160,
    check: (day) => Object.values(day.negatives || {}).filter(Boolean).length === 0 && Object.values(day.positives || {}).filter(Boolean).length >= 3,
  },
  {
    id: 'q_pos_3',
    label: 'ก้าวแรกแห่งวินัย: พิชิตนิสัยเชิงบวกให้ได้ 3 อย่าง',
    enLabel: 'Discipline 101: Complete 3 positive habits',
    icon: '🎯',
    reward: 90,
    check: (day) => Object.values(day.positives || {}).filter(Boolean).length >= 3,
  },
  {
    id: 'q_pos5',
    label: 'วันแห่งความมุ่งมั่น: ทำนิสัยเชิงบวกให้ได้ 5 อย่าง',
    enLabel: 'High Performer: Complete 5 positive habits',
    icon: '🔥',
    reward: 140,
    check: (day) => Object.values(day.positives || {}).filter(Boolean).length >= 5,
  },
  {
    id: 'q_balance_master',
    label: 'สมดุลชีวิต Equilibrium: นิสัยบวก 3 อย่าง + ออมเงิน + เช็คอินอารมณ์',
    enLabel: 'Equilibrium Master: 3 habits + Savings + Mood',
    icon: '⚖️',
    reward: 170,
    check: (day) => Object.values(day.positives || {}).filter(Boolean).length >= 3 && (day.savings || 0) > 0 && Boolean(day.mood),
  },
];

export const BADGES: Badge[] = [
  { id: 'streak7', title: 'นักสู้ผู้ไม่ย่อท้อ', desc: 'ทำสตรีคติดต่อกัน 7 วัน', icon: '🔥', reward: 150, check: (s) => s.currentStreak >= 7 },
  { id: 'streak30', title: 'วินัยเหล็กกล้า', desc: 'ทำสตรีคติดต่อกัน 30 วัน', icon: '💎', reward: 500, check: (s) => s.currentStreak >= 30 },
  { id: 'rich', title: 'เศรษฐีหน้าใหม่', desc: 'มีแต้มสะสมเกิน 10,000 แต้ม', icon: '💰', reward: 1000, check: (s) => s.wallet >= 10000 },
  { id: 'boss10', title: 'นักล่ามอนสเตอร์', desc: 'ปราบบอสถึงเลเวล 10', icon: '⚔️', reward: 500, check: (_, boss) => boss >= 10 },
  { id: 'boss20', title: 'ผู้พิชิตมังกร', desc: 'ปราบบอสระดับตำนาน (Lv.20)', icon: '🐉', reward: 2000, check: (_, boss) => boss >= 20 },
  { id: 'gacha10', title: 'เซียนกาชา', desc: 'สุ่มกาชาครบ 10 ครั้ง', icon: '🎲', reward: 300, check: (_1, _2, gacha) => gacha >= 10 },
];

export const BOSS_LIST: Boss[] = [
  { name: "สไลม์ขี้เกียจ", icon: "👾", desc: "เกาะติดเตียง ไม่ยอมลุกไปทำอะไรทั้งวัน" },
  { name: "หนอนชาเขียวจอมอืด", icon: "🐛", desc: "คลานช้าๆ ดูดความกระตือรือร้นของคุณจนหมด" },
  { name: "สลอธผลัดวัน", icon: "🦥", desc: "สะกดจิตให้คุณพูดว่า 'เดี๋ยวค่อยทำพรุ่งนี้'" },
  { name: "แมวส้มจอมขัดขวาง", icon: "🐈", desc: "ร้องกวนและนอนทับคอมพิวเตอร์ตอนคุณจะตั้งใจทำงาน" },
  { name: "นกฮูกตาค้าง", icon: "🦉", desc: "ชวนดูซีรีส์จนสว่าง ทำลายตารางการนอนของคุณ" },
  { name: "ลิงซนสมาธิสั้น", icon: "🐒", desc: "ทำให้วอกแวกและหยิบมือถือมาดูทุกๆ 5 นาที" },
  { name: "หมูสามชั้นล่อลวง", icon: "🐖", desc: "เสกภาพของหวานและบุฟเฟต์มาทำลายตารางไดเอท" },
  { name: "ผีไถฟีด", icon: "👻", desc: "ดึงวิญญาณคุณหลุดเข้าไปในโซเชียลมีเดียนานหลายชั่วโมง" },
  { name: "ก็อบลินขี้บ่น", icon: "👺", desc: "คอยกระซิบข้างหูว่า 'วันนี้เหนื่อยแล้ว พักเถอะ'" },
  { name: "ยักษ์แดงจอมทำลาย", icon: "👹", desc: "กระทืบความตั้งใจที่จะออกกำลังกายของคุณจนแหลก" },
  { name: "แวมไพร์สูบเวลา", icon: "🧛", desc: "คอยดูดเวลาที่มีค่าของคุณไปกับเรื่องไร้สาระ" },
  { name: "ค้างคาวราตรี", icon: "🦇", desc: "ทำให้สมองแล่นตอนดึก แต่เบลอทำงานไม่รู้เรื่องตอนเช้า" },
  { name: "แมงมุมดูดทรัพย์", icon: "🕷️", desc: "ชักใยล่อหลอกให้คุณกด F ช้อปปิ้งของออนไลน์แบบไม่คิด" },
  { name: "แมงป่องพิษอารมณ์", icon: "🦂", desc: "ฉีดพิษความหงุดหงิด ทำให้พาลไม่อยากทำตามเป้าหมาย" },
  { name: "หมาป่าจอมอ้าง", icon: "🐺", desc: "หอนสร้างข้ออ้างร้อยแปดพันเก้าให้ความขี้เกียจดูสมเหตุสมผล" },
  { name: "คิงคองจอมพังทลาย", icon: "🦍", desc: "ทุบทำลาย Streak ที่สะสมมาอย่างยากลำบากให้พังทลาย" },
  { name: "โทรลล์จอมบูลลี่", icon: "🧌", desc: "ด้อยค่าความสำเร็จเล็กๆ ของคุณว่า 'ทำแค่นี้ไม่เห็นได้อะไร'" },
  { name: "ไดโนเสาร์หัวโบราณ", icon: "🦖", desc: "แช่แข็งสมอง ไม่ยอมให้คุณพัฒนาตัวเองหรือเรียนรู้สิ่งใหม่ๆ" },
  { name: "เอเลี่ยนล้างสมอง", icon: "👽", desc: "ลบเป้าหมายชีวิตออกจากหัว ทำให้คุณหลงทางและไร้ไฟ" },
  { name: "มังกรแห่งความสิ้นหวัง", icon: "🐉", desc: "พ่นไฟเผาผลาญความมุ่งมั่นทั้งหมดของคุณขั้นเด็ดขาด!" },
];

export const BOSS_WEAKNESS_LIST: BossWeaknessInfo[] = [
  { habitId: "read", nameTh: "การอ่านหนังสือ", nameEn: "Reading", icon: "📖", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "exercise", nameTh: "การออกกำลังกาย", nameEn: "Exercise", icon: "🏃", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "water", nameTh: "การดื่มน้ำ", nameEn: "Drinking Water", icon: "💧", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "meditate", nameTh: "การนั่งสมาธิ", nameEn: "Meditation", icon: "🧘", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "todolist", nameTh: "การเขียน To-do list", nameEn: "Writing To-Do List", icon: "📋", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "work", nameTh: "การโฟกัสงานหลัก", nameEn: "Deep Work", icon: "💻", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "cleanEating", nameTh: "การกินอาหารคลีน", nameEn: "Clean Eating", icon: "🥗", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "walk", nameTh: "การเดิน 8,000 ก้าว", nameEn: "Walking 8,000 Steps", icon: "👟", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "tidyRoom", nameTh: "การจัดเก็บห้อง", nameEn: "Tidying Room", icon: "🧹", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "expense", nameTh: "การจดบันทึกรายรับรายจ่าย", nameEn: "Tracking Expenses", icon: "📊", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "sleepEarly", nameTh: "การเข้านอนก่อนเที่ยงคืน", nameEn: "Sleeping Early", icon: "🌙", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "language", nameTh: "การเรียนภาษา", nameEn: "Language Learning", icon: "🌐", bonusPoints: 30, damageMultiplier: 2 },
  { habitId: "diary", nameTh: "การเขียนไดอารี่", nameEn: "Journaling", icon: "✍️", bonusPoints: 30, damageMultiplier: 2 },
];

export function getRandomBossWeakness(excludeHabitId?: string): BossWeaknessInfo {
  const filtered = excludeHabitId
    ? BOSS_WEAKNESS_LIST.filter((w) => w.habitId !== excludeHabitId)
    : BOSS_WEAKNESS_LIST;
  const pool = filtered.length > 0 ? filtered : BOSS_WEAKNESS_LIST;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "bot1", username: "เทพเจ้าวินัย", profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", totalAngel: 8400, level: 11 },
  { id: "bot2", username: "สาวน้อยพลังบวก", profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", totalAngel: 5200, level: 9 },
  { id: "bot3", username: "คุณสมาร์ท", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", totalAngel: 4100, level: 8 },
  { id: "bot4", username: "พี่หมีใจดี", profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", totalAngel: 3200, level: 7 },
  { id: "bot5", username: "สายชิลแต่อยากฟิต", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", totalAngel: 2500, level: 6 },
  { id: "bot6", username: "ลุงตื่นเช้า", profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", totalAngel: 1600, level: 5 },
  { id: "bot7", username: "มือใหม่หัดจด", profilePic: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", totalAngel: 850, level: 4 },
];

export const TIME_GROUPS = [
  { key: "morning" as const, label: "ช่วงเช้า", enLabel: "Morning", color: "#F59E0B" },
  { key: "day" as const, label: "ระหว่างวัน", enLabel: "Afternoon", color: "#06B6D4" },
  { key: "evening" as const, label: "ช่วงเย็น/ก่อนนอน", enLabel: "Evening", color: "#8B5CF6" },
];

export const MOODS = [
  { id: "great", icon: "🤩", label: "ดีมาก", enLabel: "Great" },
  { id: "good", icon: "😊", label: "ดี", enLabel: "Good" },
  { id: "okay", icon: "😐", label: "เฉยๆ", enLabel: "Okay" },
  { id: "bad", icon: "😔", label: "แย่", enLabel: "Bad" },
  { id: "terrible", icon: "😫", label: "แย่มาก", enLabel: "Terrible" },
];

export const THAI_MONTHS_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
export const THAI_DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
export const THAI_DAYS_FULL = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

export const EN_MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const EN_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const EN_DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const THEMES: Record<ThemeKey, ThemeColors> = {
  ocean: { name: 'Ocean', ACCENT: '#06B6D4', ACCENT_BG: '#ECFEFF', DARK_ACCENT_BG: '#164E63' },
  sakura: { name: 'Sakura', ACCENT: '#EC4899', ACCENT_BG: '#FDF2F8', DARK_ACCENT_BG: '#831843' },
  matcha: { name: 'Matcha', ACCENT: '#10B981', ACCENT_BG: '#ECFDF5', DARK_ACCENT_BG: '#064E3B' },
  cyberpunk: { name: 'Cyberpunk', ACCENT: '#D946EF', ACCENT_BG: '#FAF5FF', DARK_ACCENT_BG: '#4A044E' },
};

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseKey(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function genId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getMonthMatrix(cursor: Date): Date[][] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const sunOffset = firstOfMonth.getDay();
  const gridStart = addDays(firstOfMonth, -sunOffset);
  const weeks: Date[][] = [];
  let cur = gridStart;
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(cur);
      cur = addDays(cur, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export function dayScore(
  day: { positives?: Record<string, boolean>; negatives?: Record<string, boolean>; savings?: number; bonusPoints?: number } | undefined,
  positivePointsMap: Record<string, number>,
  negativeHabits: NegativeHabit[]
) {
  if (!day) return { angel: 0, devil: 0, net: 0 };
  const habitPts = Object.entries(day.positives || {}).reduce(
    (sum, [id, checked]) => sum + (checked && positivePointsMap[id] !== undefined ? positivePointsMap[id] : 0),
    0
  );
  const savingsPts = Math.floor((day.savings || 0) / 10);
  const bonus = day.bonusPoints || 0;
  const angel = habitPts + savingsPts + bonus;
  const devil = negativeHabits.reduce((sum, h) => sum + (day.negatives?.[h.id] ? h.points : 0), 0);
  return { angel, devil, net: angel - devil };
}

export function getLevelInfo(totalAngelPoints: number, lang: "th" | "en" = "th") {
  const level = Math.floor(Math.sqrt(totalAngelPoints / 80)) + 1;
  const currentLevelBase = Math.pow(level - 1, 2) * 80;
  const nextLevelBase = Math.pow(level, 2) * 80;
  const expInLevel = totalAngelPoints - currentLevelBase;
  const expRequired = nextLevelBase - currentLevelBase;
  const progress = Math.min(100, Math.max(0, (expInLevel / expRequired) * 100));

  let title = lang === "th" ? "ผู้เริ่มต้น" : "Beginner";
  if (level >= 3) title = lang === "th" ? "นักปั้นนิสัย" : "Habit Shaper";
  if (level >= 6) title = lang === "th" ? "ผู้มุ่งมั่น" : "Dedicated";
  if (level >= 10) title = lang === "th" ? "อัศวินวินัย" : "Discipline Knight";
  if (level >= 15) title = lang === "th" ? "ผู้พิทักษ์" : "Guardian";
  if (level >= 25) title = lang === "th" ? "ปรมาจารย์" : "Grandmaster";
  if (level >= 40) title = lang === "th" ? "เทพเจ้าสมดุล" : "Equilibrium Deity";

  return { level, title, progress, currentExp: expInLevel, requiredExp: expRequired };
}

export interface SoundSetDefinition {
  id: SoundSetKey;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  icon: string;
  accentColor: string;
  tags: string[];
}

export const SOUND_SETS: SoundSetDefinition[] = [
  {
    id: "retro",
    nameTh: "เรโทร อาร์เคด (8-Bit Arcade)",
    nameEn: "Retro 8-Bit Arcade",
    descTh: "เสียงสังเคราะห์ชิปจูนคลาสสิก ยุคแฟมิคอม/เกมตู้ สนุกสนาน คมชัด กระตุ้นความจำยุค 80-90s",
    descEn: "Nostalgic 8-bit chiptune blips, coin collect jumps, crunchy hits, and arcade fanfares",
    icon: "👾",
    accentColor: "#F59E0B",
    tags: ["Chiptune", "8-Bit", "Nostalgic"],
  },
  {
    id: "fantasy",
    nameTh: "แฟนตาซี ผจญภัย (Fantasy RPG)",
    nameEn: "Fantasy Adventure RPG",
    descTh: "เสียงกระดิ่งเวทมนตร์ ดาบกระทบเกราะ คริติคอลสายฟ้า และแตรแห่งชัยชนะอันเกรียงไกร",
    descEn: "Magical fairy chimes, steel sword strikes, thunder crits, and triumphant royal brass",
    icon: "⚔️",
    accentColor: "#8B5CF6",
    tags: ["Orchestral", "Magic", "Epic"],
  },
  {
    id: "zen",
    nameTh: "เซนและคริสตัล (Zen & Crystal Chimes)",
    nameEn: "Zen & Crystal Chimes",
    descTh: "ขันร้องทิเบต คลื่นเสียงบริสุทธิ์ ระฆังแก้วกังวาน และกระบอกไม้ไผ่ ให้ความสงบและมีสมาธิ",
    descEn: "Tibetan singing bowls, pure crystal chimes, hollow bamboo, and peaceful temple gongs",
    icon: "🧘",
    accentColor: "#10B981",
    tags: ["Peaceful", "Crystal", "Mindful"],
  },
  {
    id: "cyberpunk",
    nameTh: "ไซเบอร์พังก์ ล้ำยุค (Cyberpunk Synth)",
    nameEn: "Cyberpunk & Sci-Fi",
    descTh: "พัลส์เลเซอร์ดิจิทัล ปืนพลาสม่า คลื่นซินธ์เวฟ และเสียงโอเวอร์ไดรฟ์สุดล้ำ",
    descEn: "Futuristic digital lasers, plasma zaps, FM overdrive, and punchy synthwave fanfares",
    icon: "⚡",
    accentColor: "#06B6D4",
    tags: ["Futuristic", "Synthwave", "Hi-Tech"],
  },
];

export interface RewardFxPaletteDefinition {
  id: RewardFxColorTheme;
  nameTh: string;
  nameEn: string;
  icon: string;
  primary: string;
  colors: string[];
}

export const REWARD_FX_PALETTES: RewardFxPaletteDefinition[] = [
  {
    id: "rainbow",
    nameTh: "เรนโบว์สดใส (Rainbow Festival)",
    nameEn: "Rainbow Festival",
    icon: "🌈",
    primary: "#06B6D4",
    colors: ["#FF7A59", "#06B6D4", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#3B82F6"],
  },
  {
    id: "gold",
    nameTh: "ทองคำแชมเปี้ยน (Golden Glory)",
    nameEn: "Golden Glory",
    icon: "✨",
    primary: "#F59E0B",
    colors: ["#F59E0B", "#FBBF24", "#FCD34D", "#D97706", "#FEF08A", "#FFFFFF", "#F97316"],
  },
  {
    id: "cyber",
    nameTh: "ไซเบอร์ นีออน (Cyber Neon)",
    nameEn: "Cyber Neon",
    icon: "⚡",
    primary: "#06B6D4",
    colors: ["#06B6D4", "#EC4899", "#8B5CF6", "#3B82F6", "#F43F5E", "#67E8F9", "#A855F7"],
  },
  {
    id: "emerald",
    nameTh: "มรกต & มินต์ (Emerald Mint)",
    nameEn: "Emerald Mint",
    icon: "🍃",
    primary: "#10B981",
    colors: ["#10B981", "#34D399", "#059669", "#6EE7B7", "#047857", "#A7F3D0", "#14B8A6"],
  },
  {
    id: "sakura",
    nameTh: "ซากุระ พิงก์ (Sakura Pink)",
    nameEn: "Sakura Pink",
    icon: "🌸",
    primary: "#F43F5E",
    colors: ["#F43F5E", "#FB7185", "#FDA4AF", "#EC4899", "#F472B6", "#FFE4E6", "#BE185D"],
  },
  {
    id: "sunset",
    nameTh: "ซันเซ็ต เบลซ (Sunset Blaze)",
    nameEn: "Sunset Blaze",
    icon: "🔥",
    primary: "#F97316",
    colors: ["#F97316", "#FB923C", "#EF4444", "#F59E0B", "#DC2626", "#FDE047", "#EA580C"],
  },
];
