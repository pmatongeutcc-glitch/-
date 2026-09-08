export type TimeGroupKey = "morning" | "day" | "evening";

export interface PositiveHabit {
  id: string;
  label: string;
  time: TimeGroupKey;
  points: number;
  priority?: "high" | "medium" | "low";
}

export interface NegativeHabit {
  id: string;
  label: string;
  points: number;
  priority?: "high" | "medium" | "low";
}

export interface ShopItem {
  id: string;
  title: string;
  price: number;
  icon: string;
  type: "reward" | "gacha" | "freeze";
  desc: string;
  howTo?: string;
  category?: "food" | "fun" | "milestone" | "special";
}

export interface DayLog {
  positives: Record<string, boolean>;
  negatives: Record<string, boolean>;
  completedTimes?: Record<string, string>;
  savings: number;
  mood: string | null;
  diaryText: string;
  bonusPoints: number;
  activePerks: string[];
}

export interface Quest {
  id: string;
  label: string;
  enLabel?: string;
  icon?: string;
  reward: number;
  check: (day: DayLog) => boolean;
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  reward: number;
  check: (stats: { currentStreak: number; wallet: number }, bossLevel: number, gachaCount: number) => boolean;
}

export interface Boss {
  name: string;
  icon: string;
  desc: string;
}

export interface BossWeaknessInfo {
  habitId: string;
  nameTh: string;
  nameEn: string;
  icon: string;
  bonusPoints: number;
  damageMultiplier: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  profilePic: string | null;
  totalAngel: number;
  level: number;
  lastActive?: string;
}

export type ThemeKey = "ocean" | "sakura" | "matcha" | "cyberpunk";

export interface ThemeColors {
  name: string;
  ACCENT: string;
  ACCENT_BG: string;
  DARK_ACCENT_BG: string;
}

export type LanguageKey = "th" | "en";

export type SoundSetKey = "retro" | "fantasy" | "zen" | "cyberpunk";

export type SoundType =
  | "good"
  | "bad"
  | "habit"
  | "boss_hit"
  | "boss_crit"
  | "boss_weakness"
  | "boss_super_crit"
  | "boss_defeat"
  | "levelup"
  | "gacha"
  | "timer"
  | "click";

export type RewardFxIntensity = "low" | "medium" | "high";
export type RewardFxColorTheme = "rainbow" | "gold" | "cyber" | "emerald" | "sakura" | "sunset";

export interface RewardFxConfig {
  enabled: boolean;
  intensity: RewardFxIntensity;
  colorTheme: RewardFxColorTheme;
}
