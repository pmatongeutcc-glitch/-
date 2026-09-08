/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Sun,
  CloudSun,
  Moon,
  ShoppingBag,
  CalendarDays,
  Trophy,
  Settings,
  Sparkles,
  ShieldAlert,
  Coins,
  PenLine,
  Check,
  Zap,
  Mic,
  Bell,
  CheckCircle,
} from "lucide-react";

import {
  DAILY_QUOTES,
  DAILY_QUOTES_EN,
  DEFAULT_POSITIVE_HABITS,
  DEFAULT_NEGATIVE_HABITS,
  DEFAULT_SHOP_ITEMS,
  DAILY_QUESTS_POOL,
  BOSS_LIST,
  BOSS_WEAKNESS_LIST,
  getRandomBossWeakness,
  MOCK_LEADERBOARD,
  TIME_GROUPS,
  MOODS,
  THEMES,
  THAI_MONTHS_FULL,
  THAI_DAYS_FULL,
  EN_MONTHS_FULL,
  EN_DAYS_FULL,
  dateKey,
  parseKey,
  addDays,
  todayDate,
  dayScore,
  getLevelInfo,
  genId,
  REWARD_FX_PALETTES,
} from "./data/constants";

import {
  DayLog,
  PositiveHabit,
  NegativeHabit,
  ShopItem,
  LeaderboardEntry,
  BossWeaknessInfo,
  ThemeKey,
  LanguageKey,
  SoundSetKey,
  RewardFxConfig,
} from "./types";

import { playSound, fireConfetti } from "./utils/audio";
import {
  loadLocalData,
  saveLocalData,
  exportBackupJSON,
  requestNotificationPermission,
  sendPushNotification,
} from "./utils/storage";

import {
  auth,
  loginWithGoogle,
  logoutUser,
  saveUserDataToCloud,
  loadUserDataFromCloud,
} from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { TopStatsWidget } from "./components/TopStatsWidget";
import { HabitTimelineWidget } from "./components/HabitTimelineWidget";
import { DailyQuestsWidget } from "./components/DailyQuestsWidget";
import { BossBattleWidget } from "./components/BossBattleWidget";
import { VoiceCommandModal } from "./components/VoiceCommandModal";
import { ShopView } from "./components/ShopView";
import { CalendarView } from "./components/CalendarView";
import { LeaderboardView } from "./components/LeaderboardView";
import { SettingsView } from "./components/SettingsView";
import { ThreeDCoin } from "./components/ThreeDIcons";
import {
  ScreenEffectsOverlay,
  ScreenEffectType,
  ScreenEffectData,
} from "./components/ScreenEffectsOverlay";

export default function App() {
  // Core Application State
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [spentPoints, setSpentPoints] = useState(0);
  const [freezeItems, setFreezeItems] = useState(0);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [claimedBadges, setClaimedBadges] = useState<string[]>([]);
  const [gachaCount, setGachaCount] = useState(0);
  const [dailyQuests, setDailyQuests] = useState<{
    date: string;
    ids: string[];
    claimed: string[];
  }>({ date: "", ids: [], claimed: [] });

  const [activeTab, setActiveTab] = useState<"today" | "shop" | "history" | "leaderboard" | "settings">("today");
  const [historyCursor, setHistoryCursor] = useState(todayDate());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const [positiveHabits, setPositiveHabits] = useState<PositiveHabit[]>(DEFAULT_POSITIVE_HABITS);
  const [negativeHabits, setNegativeHabits] = useState<NegativeHabit[]>(DEFAULT_NEGATIVE_HABITS);
  const [shopItems, setShopItems] = useState<ShopItem[]>(DEFAULT_SHOP_ITEMS);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appTheme, setAppTheme] = useState<ThemeKey>("ocean");
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [soundSet, setSoundSet] = useState<SoundSetKey>("retro");
  const [lang, setLang] = useState<LanguageKey>("th");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(true);
  const [rewardFxConfig, setRewardFxConfig] = useState<RewardFxConfig>({
    enabled: true,
    intensity: "medium",
    colorTheme: "rainbow",
  });

  const activeRewardPalette = useMemo(() => {
    return (
      REWARD_FX_PALETTES.find((p) => p.id === rewardFxConfig.colorTheme) ||
      REWARD_FX_PALETTES[0]
    );
  }, [rewardFxConfig.colorTheme]);

  // Screen Shake & Light Burst FX State
  const [screenShake, setScreenShake] = useState<"none" | "boss" | "quest" | "crit">("none");
  const [screenEffect, setScreenEffect] = useState<ScreenEffectType>("none");
  const [screenEffectData, setScreenEffectData] = useState<ScreenEffectData | null>(null);

  const prevLevelRef = useRef<number | null>(null);

  // User Profile
  const [username, setUsername] = useState("นักเดินทาง");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  // Firebase Auth & Cloud Sync State
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isInitialLoadFromCloud = useRef(false);
  const syncTimeoutRef = useRef<any>(null);

  // RPG Boss State
  const [bossHp, setBossHp] = useState(1000);
  const [bossMaxHp, setBossMaxHp] = useState(1000);
  const [bossLevel, setBossLevel] = useState(1);
  const [bossXp, setBossXp] = useState(0);
  const [lastBossXpGained, setLastBossXpGained] = useState(0);
  const [bossWeaknessId, setBossWeaknessId] = useState<string>("read");
  const [showBossList, setShowBossList] = useState(false);

  // Active Boss Weakness Info
  const currentBossWeakness: BossWeaknessInfo = useMemo(() => {
    const found = BOSS_WEAKNESS_LIST.find((w) => w.habitId === bossWeaknessId);
    return found || BOSS_WEAKNESS_LIST[0];
  }, [bossWeaknessId]);

  // Voice Command Modal
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Feedback & Dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    msg: string;
    onConfirm: () => void;
    type: "primary" | "danger";
  } | null>(null);
  const [critPopup, setCritPopup] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Draft inputs for smooth typing
  const [savingsDraft, setSavingsDraft] = useState<Record<string, string>>({});
  const [diaryDraft, setDiaryDraft] = useState<Record<string, string>>({});

  const today = useMemo(() => todayDate(), []);
  const todayKey = useMemo(() => dateKey(today), [today]);

  const todayQuote = useMemo(() => {
    const list = lang === "th" ? DAILY_QUOTES : DAILY_QUOTES_EN;
    return list[today.getDate() % list.length];
  }, [today, lang]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const requestConfirm = (
    title: string,
    msg: string,
    onConfirm: () => void,
    type: "primary" | "danger" = "primary"
  ) => {
    setConfirmDialog({ title, msg, onConfirm, type });
  };

  const closeConfirm = () => setConfirmDialog(null);

  // Load Initial LocalStorage Data
  useEffect(() => {
    const saved = loadLocalData();
    if (saved) {
      if (saved.logs) setLogs(saved.logs);
      if (saved.spentPoints !== undefined) setSpentPoints(saved.spentPoints);
      if (saved.freezeItems !== undefined) setFreezeItems(saved.freezeItems);
      if (saved.inventory) setInventory(saved.inventory);
      if (saved.claimedBadges) setClaimedBadges(saved.claimedBadges);
      if (saved.gachaCount !== undefined) setGachaCount(saved.gachaCount);
      if (saved.dailyQuests) setDailyQuests(saved.dailyQuests);
      if (saved.bossHp !== undefined) setBossHp(saved.bossHp);
      if (saved.bossMaxHp !== undefined) setBossMaxHp(saved.bossMaxHp);
      if (saved.bossLevel !== undefined) setBossLevel(saved.bossLevel);
      if (saved.bossXp !== undefined) setBossXp(saved.bossXp);
      if (saved.bossWeaknessId) {
        setBossWeaknessId(saved.bossWeaknessId);
      } else {
        const initWeakness = getRandomBossWeakness();
        setBossWeaknessId(initWeakness.habitId);
      }
      if (saved.username) setUsername(saved.username);
      if (saved.profilePic) setProfilePic(saved.profilePic);
      if (saved.positiveHabits) {
        const defaultPosMap = new Map(DEFAULT_POSITIVE_HABITS.map((h) => [h.id, h.points]));
        const mergedPos = saved.positiveHabits.map((h) => {
          if (defaultPosMap.has(h.id)) {
            return { ...h, points: defaultPosMap.get(h.id)! };
          }
          return h;
        });
        setPositiveHabits(mergedPos);
      }
      if (saved.negativeHabits) {
        const defaultNegMap = new Map(DEFAULT_NEGATIVE_HABITS.map((h) => [h.id, h.points]));
        const mergedNeg = saved.negativeHabits.map((h) => {
          if (defaultNegMap.has(h.id)) {
            return { ...h, points: defaultNegMap.get(h.id)! };
          }
          return h;
        });
        setNegativeHabits(mergedNeg);
      }
      if (saved.shopItems) {
        const defaultShopMap = new Map(DEFAULT_SHOP_ITEMS.map((i) => [i.id, i]));
        const existingIds = new Set<string>();
        const updatedItems = saved.shopItems.map((item) => {
          existingIds.add(item.id);
          const def = defaultShopMap.get(item.id);
          if (def) {
            return {
              ...item,
              price: def.price,
              category: def.category,
              title: def.title,
              desc: def.desc,
              icon: def.icon,
            };
          }
          return item;
        });
        const newDefaults = DEFAULT_SHOP_ITEMS.filter((i) => !existingIds.has(i.id));
        setShopItems([...updatedItems, ...newDefaults]);
      }
      if (saved.isDarkMode !== undefined) setIsDarkMode(saved.isDarkMode);
      if (saved.appTheme) setAppTheme(saved.appTheme as ThemeKey);
      if (saved.sfxEnabled !== undefined) setSfxEnabled(saved.sfxEnabled);
      if (saved.soundSet) setSoundSet(saved.soundSet);
      if (saved.language) setLang(saved.language);
      if (saved.notificationsEnabled !== undefined) setNotificationsEnabled(saved.notificationsEnabled);
      if (saved.screenShakeEnabled !== undefined) setScreenShakeEnabled(saved.screenShakeEnabled);
      if (saved.rewardFxConfig) setRewardFxConfig(saved.rewardFxConfig);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Helper to apply loaded state (from local or cloud)
  const applyUserData = useCallback((p: any) => {
    if (!p) return;
    if (p.logs) setLogs(p.logs);
    if (p.spentPoints !== undefined) setSpentPoints(p.spentPoints);
    if (p.freezeItems !== undefined) setFreezeItems(p.freezeItems);
    if (p.inventory) setInventory(p.inventory);
    if (p.claimedBadges) setClaimedBadges(p.claimedBadges);
    if (p.gachaCount !== undefined) setGachaCount(p.gachaCount);
    if (p.dailyQuests) setDailyQuests(p.dailyQuests);
    if (p.bossHp !== undefined) setBossHp(p.bossHp);
    if (p.bossMaxHp !== undefined) setBossMaxHp(p.bossMaxHp);
    if (p.bossLevel !== undefined) setBossLevel(p.bossLevel);
    if (p.bossXp !== undefined) setBossXp(p.bossXp);
    if (p.bossWeaknessId) setBossWeaknessId(p.bossWeaknessId);
    if (p.username) setUsername(p.username);
    if (p.profilePic) setProfilePic(p.profilePic);
    if (p.positiveHabits) setPositiveHabits(p.positiveHabits);
    if (p.negativeHabits) setNegativeHabits(p.negativeHabits);
    if (p.shopItems) setShopItems(p.shopItems);
    if (p.isDarkMode !== undefined) setIsDarkMode(p.isDarkMode);
    if (p.appTheme) setAppTheme(p.appTheme);
    if (p.sfxEnabled !== undefined) setSfxEnabled(p.sfxEnabled);
    if (p.soundSet) setSoundSet(p.soundSet);
    if (p.language) setLang(p.language);
    if (p.screenShakeEnabled !== undefined) setScreenShakeEnabled(p.screenShakeEnabled);
    if (p.rewardFxConfig) setRewardFxConfig(p.rewardFxConfig);
  }, []);

  // Firebase Auth Listener & Cloud Data Fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsSyncing(true);
        try {
          const cloudDataStr = await loadUserDataFromCloud(currentUser.uid);
          if (cloudDataStr) {
            const parsed = JSON.parse(cloudDataStr);
            isInitialLoadFromCloud.current = true;
            applyUserData(parsed);
            setLastSyncedAt(new Date());
            showToast(lang === "th" ? `☁️ ซิงค์ข้อมูลกับบัญชี ${currentUser.displayName || "Google"} สำเร็จ!` : `☁️ Synced with Google Account!`);
          } else {
            // First time login for this Google user, upload current local state to cloud
            const currentState = {
              logs,
              spentPoints,
              freezeItems,
              inventory,
              claimedBadges,
              gachaCount,
              dailyQuests,
              bossHp,
              bossMaxHp,
              bossLevel,
              bossXp,
              bossWeaknessId,
              username: currentUser.displayName || username,
              profilePic: currentUser.photoURL || profilePic,
              positiveHabits,
              negativeHabits,
              shopItems,
              isDarkMode,
              appTheme,
              sfxEnabled,
              soundSet,
              language: lang,
              notificationsEnabled,
              screenShakeEnabled,
              rewardFxConfig,
            };
            if (currentUser.displayName) setUsername(currentUser.displayName);
            if (currentUser.photoURL) setProfilePic(currentUser.photoURL);
            await saveUserDataToCloud(currentUser.uid, JSON.stringify(currentState));
            setLastSyncedAt(new Date());
            showToast(lang === "th" ? "☁️ บันทึกข้อมูลเริ่มต้นไปยัง Google Cloud เรียบร้อย!" : "☁️ Initial data saved to Google Cloud!");
          }
        } catch (err) {
          console.error("Error loading cloud data on auth:", err);
        } finally {
          setIsSyncing(false);
          setTimeout(() => {
            isInitialLoadFromCloud.current = false;
          }, 1500);
        }
      }
    });

    return () => unsubscribe();
  }, [applyUserData, lang]);

  // Sync state to local storage & cloud
  useEffect(() => {
    const stateSnapshot = {
      logs,
      spentPoints,
      freezeItems,
      inventory,
      claimedBadges,
      gachaCount,
      dailyQuests,
      bossHp,
      bossMaxHp,
      bossLevel,
      bossXp,
      bossWeaknessId,
      username,
      profilePic,
      positiveHabits,
      negativeHabits,
      shopItems,
      isDarkMode,
      appTheme,
      sfxEnabled,
      soundSet,
      language: lang,
      notificationsEnabled,
      screenShakeEnabled,
      rewardFxConfig,
    };

    saveLocalData(stateSnapshot);

    // Auto-sync to Firebase Cloud if logged in and not right after initial cloud download
    if (user && !isInitialLoadFromCloud.current) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          const success = await saveUserDataToCloud(user.uid, JSON.stringify(stateSnapshot));
          if (success) {
            setLastSyncedAt(new Date());
          }
        } catch (err) {
          console.error("Cloud auto-sync error:", err);
        } finally {
          setIsSyncing(false);
        }
      }, 1200);
    }
  }, [
    logs,
    spentPoints,
    freezeItems,
    inventory,
    claimedBadges,
    gachaCount,
    dailyQuests,
    bossHp,
    bossMaxHp,
    bossLevel,
    bossXp,
    bossWeaknessId,
    username,
    profilePic,
    positiveHabits,
    negativeHabits,
    shopItems,
    isDarkMode,
    appTheme,
    sfxEnabled,
    soundSet,
    lang,
    notificationsEnabled,
    screenShakeEnabled,
    rewardFxConfig,
  ]);

  // Trigger Game Visual Effects (Screen Shake + Radial Aura Flash)
  const triggerGameEffect = useCallback(
    (type: ScreenEffectType, data?: ScreenEffectData) => {
      if (screenShakeEnabled && type !== "none" && type !== "habit") {
        setScreenShake(type as "boss" | "quest" | "crit");
        setTimeout(() => {
          setScreenShake("none");
        }, type === "boss" ? 700 : type === "quest" ? 500 : 350);
      }
      setScreenEffect(type);
      setScreenEffectData(data || null);
    },
    [screenShakeEnabled]
  );

  // Pick random daily quests helper
  const getRandomDailyQuests = useCallback((count: number, excludeIds: string[] = []): string[] => {
    const available = DAILY_QUESTS_POOL.filter((q) => !excludeIds.includes(q.id));
    const pool = available.length >= count ? available : DAILY_QUESTS_POOL;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((q) => q.id);
  }, []);

  // Rotate Daily Quests on New Date or populate from updated pool
  useEffect(() => {
    const validExistingIds = (dailyQuests.ids || []).filter((id) =>
      DAILY_QUESTS_POOL.some((q) => q.id === id)
    );

    if (dailyQuests.date !== todayKey || validExistingIds.length < 3) {
      if (dailyQuests.date === todayKey && validExistingIds.length > 0) {
        const keptClaimed = (dailyQuests.claimed || []).filter((id) =>
          validExistingIds.includes(id)
        );
        const countNeeded = Math.max(0, 3 - validExistingIds.length);
        const fresh = countNeeded > 0 ? getRandomDailyQuests(countNeeded, validExistingIds) : [];
        setDailyQuests({
          date: todayKey,
          ids: [...validExistingIds, ...fresh].slice(0, 3),
          claimed: keptClaimed,
        });
      } else {
        const freshIds = getRandomDailyQuests(3);
        setDailyQuests({
          date: todayKey,
          ids: freshIds,
          claimed: [],
        });
      }
    }
  }, [todayKey, dailyQuests.date, dailyQuests.ids, dailyQuests.claimed, getRandomDailyQuests]);

  const handleRerollQuests = useCallback(() => {
    playSound("click", sfxEnabled, soundSet);
    const claimed = dailyQuests.claimed || [];
    const unclaimed = (dailyQuests.ids || []).filter((id) => !claimed.includes(id));
    if (unclaimed.length === 0) {
      showToast(
        lang === "th"
          ? "🎉 คุณทำเควสต์ของวันนี้ครบหมดแล้ว!"
          : "🎉 All quests completed for today!"
      );
      return;
    }
    const freshIds = getRandomDailyQuests(unclaimed.length, [...claimed, ...unclaimed]);
    setDailyQuests((prev) => ({
      ...prev,
      ids: [...claimed, ...freshIds],
    }));
    showToast(
      lang === "th"
        ? "🎲 สุ่มเควสต์ประจำวันใหม่เรียบร้อย!"
        : "🎲 Daily quests rerolled!"
    );
  }, [dailyQuests, lang, sfxEnabled, soundSet, showToast, getRandomDailyQuests]);

  // Active Theme Colors
  const t = useMemo(() => {
    const themeObj = THEMES[appTheme] || THEMES.ocean;
    return isDarkMode
      ? {
          BG: "#0B1120",
          CARD: "#162032",
          TEXT_MAIN: "#F8FAFC",
          TEXT_MUTED: "#94A3B8",
          NEUTRAL_BORDER: "#253347",
          GOOD_COLOR: "#FF7A59",
          GOOD_BG: "#3E1E17",
          GOOD_BORDER: "#6E2D1F",
          BAD_COLOR: "#FF4757",
          BAD_BG: "#3F161E",
          BAD_BORDER: "#6C1B26",
          ACCENT: themeObj.ACCENT,
          ACCENT_BG: themeObj.DARK_ACCENT_BG,
        }
      : {
          BG: "#F8FAFC",
          CARD: "#FFFFFF",
          TEXT_MAIN: "#0F172A",
          TEXT_MUTED: "#64748B",
          NEUTRAL_BORDER: "#F1F5F9",
          GOOD_COLOR: "#FF7A59",
          GOOD_BG: "#FFF0EC",
          GOOD_BORDER: "#FFD8CC",
          BAD_COLOR: "#FF4757",
          BAD_BG: "#FFF0F2",
          BAD_BORDER: "#FFD4D8",
          ACCENT: themeObj.ACCENT,
          ACCENT_BG: themeObj.ACCENT_BG,
        };
  }, [isDarkMode, appTheme]);

  const cardStyle = useMemo(
    () => ({
      background: t.CARD,
      border: `1px solid ${t.NEUTRAL_BORDER}`,
      boxShadow: isDarkMode
        ? "0 10px 25px -5px rgba(0,0,0,0.5)"
        : "0 10px 25px -5px rgba(0,0,0,0.05)",
      borderRadius: 28,
      color: t.TEXT_MAIN,
    }),
    [t, isDarkMode]
  );

  const getDay = useCallback(
    (key: string): DayLog => {
      return (
        logs[key] || {
          positives: {},
          negatives: {},
          completedTimes: {},
          savings: 0,
          mood: null,
          diaryText: "",
          bonusPoints: 0,
          activePerks: [],
        }
      );
    },
    [logs]
  );

  const positivePointsMap = useMemo(
    () => Object.fromEntries(positiveHabits.map((h) => [h.id, h.points])),
    [positiveHabits]
  );

  // Global Aggregate Stats
  const stats = useMemo(() => {
    const keys = Object.keys(logs).sort();
    let totalAngel = 0;
    let totalDevil = 0;
    let totalNet = 0;

    for (const k of keys) {
      const day = logs[k];
      const habitPts = Object.entries(day.positives || {}).reduce(
        (sum, [id, checked]) =>
          sum + (checked && positivePointsMap[id] !== undefined ? positivePointsMap[id] : 0),
        0
      );
      const savingsPts = Math.floor((day.savings || 0) / 10);
      const angel = habitPts + savingsPts + (day.bonusPoints || 0);
      const devil = negativeHabits.reduce(
        (sum, h) => sum + (day.negatives?.[h.id] ? h.points : 0),
        0
      );
      totalAngel += angel;
      totalDevil += devil;
      totalNet += angel - devil;
    }

    // Streak calculation with Streak Freeze support
    const todayLog = logs[todayKey];
    const todayPts =
      Object.entries(todayLog?.positives || {}).reduce(
        (sum, [id, checked]) =>
          sum + (checked && positivePointsMap[id] ? positivePointsMap[id] : 0),
        0
      ) + Math.floor((todayLog?.savings || 0) / 10);

    let currentStreak = 0;
    let tempFreezes = freezeItems;
    // If today hasn't had any habits checked yet, evaluate streak carrying over from yesterday
    let cursor = todayPts > 0 ? today : addDays(today, -1);

    while (true) {
      const day = logs[dateKey(cursor)];
      const pts =
        Object.entries(day?.positives || {}).reduce(
          (sum, [id, checked]) =>
            sum + (checked && positivePointsMap[id] ? positivePointsMap[id] : 0),
          0
        ) + Math.floor((day?.savings || 0) / 10);

      if (!day || pts <= 0) {
        if (tempFreezes > 0) {
          tempFreezes--;
          currentStreak++;
          cursor = addDays(cursor, -1);
          continue;
        }
        break;
      }
      currentStreak++;
      cursor = addDays(cursor, -1);
    }

    return {
      totalAngel,
      totalDevil,
      netTotal: totalNet,
      wallet: Math.max(0, totalNet - spentPoints),
      currentStreak,
    };
  }, [logs, todayKey, today, positivePointsMap, negativeHabits, spentPoints, freezeItems]);

  // Synchronize User in Leaderboard & Check Level Up
  useEffect(() => {
    const lvl = getLevelInfo(stats.totalAngel, lang);
    if (prevLevelRef.current !== null && lvl.level > prevLevelRef.current) {
      playSound("levelup", sfxEnabled, soundSet);
      fireConfetti();
      showToast(
        lang === "th"
          ? `🎉 ยินดีด้วย! คุณเลเวลอัปเป็น Lv.${lvl.level} "${lvl.title}"!`
          : `🎉 Congratulations! Leveled up to Lv.${lvl.level} "${lvl.title}"!`
      );
    }
    prevLevelRef.current = lvl.level;

    setLeaderboard((prev) => {
      const userIdx = prev.findIndex((p) => p.id === "current_user");
      const userEntry: LeaderboardEntry = {
        id: "current_user",
        username,
        profilePic,
        totalAngel: stats.totalAngel,
        level: lvl.level,
      };

      let nextList = [...prev];
      if (userIdx >= 0) {
        nextList[userIdx] = userEntry;
      } else {
        nextList.push(userEntry);
      }
      return nextList.sort((a, b) => b.totalAngel - a.totalAngel);
    });
  }, [stats.totalAngel, username, profilePic, lang, sfxEnabled, soundSet, showToast]);

  // Check Badge Achievements
  useEffect(() => {
    import("./data/constants").then(({ BADGES }) => {
      BADGES.forEach((b) => {
        if (!claimedBadges.includes(b.id) && b.check(stats, bossLevel, gachaCount)) {
          setClaimedBadges((prev) => [...prev, b.id]);
          playSound("levelup", sfxEnabled, soundSet);
          fireConfetti();
          showToast(
            lang === "th"
              ? `🏆 ปลดล็อกเหรียญตรา "${b.title}"! (+${b.reward} แต้ม)`
              : `🏆 Achievement Unlocked "${b.title}"! (+${b.reward} pts)`
          );
          setSpentPoints((prev) => Math.max(0, prev - b.reward));
        }
      });
    });
  }, [stats, bossLevel, gachaCount, claimedBadges, sfxEnabled, soundSet, showToast, lang]);

  // Habit Toggle Handlers
  // Helper to compute consecutive checked days for a habit leading up to a specific date
  const getHabitStreak = useCallback(
    (habitId: string, forDateKey: string) => {
      let streak = 1; // The current checked habit counts as day 1
      let cur = addDays(parseKey(forDateKey), -1);
      while (true) {
        const k = dateKey(cur);
        const day = logs[k];
        if (day?.positives?.[habitId]) {
          streak++;
          cur = addDays(cur, -1);
        } else {
          break;
        }
      }
      return streak;
    },
    [logs]
  );

  const togglePositive = useCallback(
    (key: string, habitId: string) => {
      const day = getDay(key);
      const isChecked = !!day.positives[habitId];
      let bonusGained = 0;
      let hitDmg = 0;

      if (!isChecked) {
        const basePts = positivePointsMap[habitId] || 20;
        hitDmg = basePts;
        const isWeakness = habitId === bossWeaknessId;
        const weaknessBonus = isWeakness ? currentBossWeakness.bonusPoints : 0;
        let isCrit = false;

        if (isWeakness) {
          bonusGained += weaknessBonus;
          hitDmg = Math.round(hitDmg * currentBossWeakness.damageMultiplier);
        }

        // 15% chance for Critical Hit!
        if (Math.random() < 0.15) {
          isCrit = true;
          bonusGained += basePts;
          hitDmg *= 2;
        }

        // --- COMBO MULTIPLIER: Consecutive Days Checked Bonus Damage ---
        const habitStreak = getHabitStreak(habitId, key);
        const overallStreak = stats.currentStreak;
        // The effective streak for this attack is either the habit's consecutive streak or the user's active streak
        const effectiveStreak = Math.max(habitStreak, overallStreak > 0 ? overallStreak : 1);
        // Multiplier: 1.0x base + 10% per consecutive day (capped at 3.0x / +200% max bonus)
        const comboMultiplier = Number((1 + Math.min(2.0, effectiveStreak * 0.1)).toFixed(2));
        const comboBonusDmg = effectiveStreak > 1 ? Math.round(hitDmg * (comboMultiplier - 1)) : 0;

        if (comboBonusDmg > 0) {
          hitDmg += comboBonusDmg;
          bonusGained += comboBonusDmg;
        }

        if (isWeakness && isCrit) {
          playSound("boss_super_crit", sfxEnabled, soundSet);
          if (rewardFxConfig.enabled) {
            fireConfetti({
              intensity: rewardFxConfig.intensity === "low" ? "medium" : "high",
              colors: activeRewardPalette.colors,
            });
          }
          setCritPopup(
            lang === "th"
              ? `⚡🎯 ซูเปอร์คริติคอลจุดอ่อน! (+${hitDmg} ดาเมจ${comboBonusDmg > 0 ? ` | 🔥คอมโบ ${effectiveStreak}วัน +${comboBonusDmg}` : ""})`
              : `⚡🎯 Super Weakness Critical! (+${hitDmg} dmg${comboBonusDmg > 0 ? ` | 🔥${effectiveStreak}d Combo +${comboBonusDmg}` : ""})`
          );
          setTimeout(() => setCritPopup(null), 2500);
          triggerGameEffect("crit", {
            title: lang === "th" ? `⚡🎯 ซูเปอร์คริติคอลจุดอ่อน! (+${hitDmg} แต้ม)` : `⚡🎯 Super Weakness Critical! (+${hitDmg} pts)`,
          });
        } else if (isWeakness) {
          playSound("boss_weakness", sfxEnabled, soundSet);
          if (rewardFxConfig.enabled) {
            fireConfetti({
              intensity: rewardFxConfig.intensity,
              colors: activeRewardPalette.colors,
            });
          }
          setCritPopup(
            lang === "th"
              ? `🎯 โจมตีจุดอ่อนสำเร็จ! (+${hitDmg} ดาเมจ${comboBonusDmg > 0 ? ` | 🔥คอมโบ x${comboMultiplier}` : ""})`
              : `🎯 Boss Weakness Exploited! (+${hitDmg} dmg${comboBonusDmg > 0 ? ` | 🔥Combo x${comboMultiplier}` : ""})`
          );
          setTimeout(() => setCritPopup(null), 2500);
          showToast(
            lang === "th"
              ? `🎯 จุดอ่อนบอส! โบนัส +${weaknessBonus} แต้ม & ดาเมจ ${currentBossWeakness.damageMultiplier}x${comboBonusDmg > 0 ? ` (🔥คอมโบ +${comboBonusDmg})` : ""}!`
              : `🎯 Boss Weakness! +${weaknessBonus} bonus pts & ${currentBossWeakness.damageMultiplier}x dmg${comboBonusDmg > 0 ? ` (🔥Combo +${comboBonusDmg})` : ""}!`
          );
          triggerGameEffect("crit", {
            title: lang === "th" ? `🎯 โจมตีจุดอ่อนบอส! (+${hitDmg} แต้ม)` : `🎯 Boss Weakness Hit! (+${hitDmg} pts)`,
          });
        } else if (isCrit) {
          playSound("boss_crit", sfxEnabled, soundSet);
          if (rewardFxConfig.enabled) {
            fireConfetti({
              intensity: rewardFxConfig.intensity,
              colors: activeRewardPalette.colors,
            });
          }
          setCritPopup(
            lang === "th"
              ? `⚡ คริติคอลฮิต! (+${hitDmg} ดาเมจ${comboBonusDmg > 0 ? ` | 🔥คอมโบ ${effectiveStreak}วัน +${comboBonusDmg}` : ""})`
              : `⚡ Critical Hit! (+${hitDmg} dmg${comboBonusDmg > 0 ? ` | 🔥${effectiveStreak}d Combo +${comboBonusDmg}` : ""})`
          );
          setTimeout(() => setCritPopup(null), 2500);
          triggerGameEffect("crit", {
            title: lang === "th" ? `⚡ คริติคอลฮิต! (+${hitDmg} แต้ม)` : `⚡ Critical Hit! (+${hitDmg} pts)`,
          });
        } else {
          playSound("boss_hit", sfxEnabled, soundSet);
          if (rewardFxConfig.enabled) {
            fireConfetti({
              intensity: rewardFxConfig.intensity,
              colors: activeRewardPalette.colors,
            });
            triggerGameEffect("habit", {
              title: positiveHabits.find((h) => h.id === habitId)?.label || (lang === "th" ? "ทำนิสัยสำเร็จ!" : "Habit Complete!"),
              reward: basePts,
            });
          }
          showToast(
            lang === "th"
              ? `✨ โจมตีสำเร็จ! +${hitDmg} ดาเมจ${comboBonusDmg > 0 ? ` (🔥คอมโบ ${effectiveStreak} วัน +${comboBonusDmg})` : ""}`
              : `✨ Hit! +${hitDmg} dmg${comboBonusDmg > 0 ? ` (🔥${effectiveStreak}d Combo +${comboBonusDmg})` : ""}`
          );
        }

        // Damage Boss
        let nextHp = bossHp - hitDmg;
        let nextMax = bossMaxHp;
        let nextLvl = bossLevel;

        if (nextHp <= 0) {
          const defeatedBoss = BOSS_LIST[Math.min(bossLevel - 1, BOSS_LIST.length - 1)];
          const xpGained = 200 + (bossLevel - 1) * 50;
          setBossXp((prev) => prev + xpGained);
          setLastBossXpGained(xpGained);

          playSound("boss_defeat", sfxEnabled, soundSet);
          fireConfetti({
            intensity: "high",
            colors: activeRewardPalette.colors,
          });
          triggerGameEffect("boss", {
            bossName: defeatedBoss.name,
            bossLevel: bossLevel,
            icon: defeatedBoss.icon,
            reward: 500,
          });

          // Randomly rotate Boss Weakness when a new boss level is reached!
          const nextWeakness = getRandomBossWeakness(bossWeaknessId);
          setBossWeaknessId(nextWeakness.habitId);

          showToast(
            lang === "th"
              ? `🎉 ปราบมอนสเตอร์สำเร็จ! รับรางวัลโบนัส +500 แต้ม & +${xpGained} Boss EXP! บอสวิวัฒนาการสู่เลเวล ${bossLevel + 1}!`
              : `🎉 Boss Defeated! +500 bonus pts & +${xpGained} Boss EXP! Boss evolves to Lv.${bossLevel + 1}!`
          );
          setSpentPoints((prev) => Math.max(0, prev - 500));
          nextLvl += 1;
          nextMax = Math.round(bossMaxHp * 1.45);
          nextHp = nextMax;
        }

        setBossHp(nextHp);
        setBossMaxHp(nextMax);
        setBossLevel(nextLvl);
      }

      const nextCompletedTimes = { ...(day.completedTimes || {}) };
      if (!isChecked) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
        nextCompletedTimes[habitId] = timeStr;
      } else {
        delete nextCompletedTimes[habitId];
      }

      setLogs((prev) => ({
        ...prev,
        [key]: {
          ...day,
          positives: { ...day.positives, [habitId]: !isChecked },
          completedTimes: nextCompletedTimes,
          bonusPoints: Math.max(0, (day.bonusPoints || 0) + (isChecked ? 0 : bonusGained)),
        },
      }));
    },
    [getDay, sfxEnabled, soundSet, positivePointsMap, lang, bossHp, bossMaxHp, bossLevel, bossWeaknessId, currentBossWeakness, showToast, triggerGameEffect, getHabitStreak, stats.currentStreak, rewardFxConfig, activeRewardPalette, positiveHabits]
  );

  const updateHabitCompletedTime = useCallback(
    (habitId: string, newTime: string) => {
      const day = getDay(todayKey);
      setLogs((prev) => ({
        ...prev,
        [todayKey]: {
          ...day,
          completedTimes: {
            ...(day.completedTimes || {}),
            [habitId]: newTime,
          },
        },
      }));
      showToast(
        lang === "th"
          ? `🕒 ปรับเวลาทำกิจวัตรเป็น ${newTime} น.`
          : `🕒 Updated habit routine time to ${newTime}`
      );
    },
    [getDay, todayKey, lang, showToast]
  );

  const toggleNegative = useCallback(
    (key: string, habitId: string) => {
      const day = getDay(key);
      const isChecked = !!day.negatives?.[habitId];

      if (!isChecked) {
        playSound("bad", sfxEnabled, soundSet);
        showToast(
          lang === "th"
            ? `⚠️ อ๊ะ! พฤติกรรมฉุดรั้งทำให้บอสฟื้นพลัง`
            : `⚠️ Friction habit healed the boss!`
        );
        const heal = negativeHabits.find((h) => h.id === habitId)?.points || 50;
        setBossHp((prev) => Math.min(bossMaxHp, prev + heal));
      }

      setLogs((prev) => ({
        ...prev,
        [key]: {
          ...day,
          negatives: { ...day.negatives, [habitId]: !isChecked },
        },
      }));
    },
    [getDay, sfxEnabled, soundSet, lang, negativeHabits, bossMaxHp, showToast]
  );

  // Shop & Inventory Handlers
  const handleBuyItem = (item: ShopItem) => {
    if (stats.wallet < item.price) return;
    setSpentPoints((prev) => prev + item.price);
    playSound("habit", sfxEnabled, soundSet);

    if (item.type === "gacha") {
      playSound("gacha", sfxEnabled, soundSet);
      const pool = shopItems.filter((i) => i.type !== "gacha");
      const result =
        pool.length > 0
          ? pool[Math.floor(Math.random() * pool.length)]
          : DEFAULT_SHOP_ITEMS[1];
      showToast(
        lang === "th"
          ? `🎁 ยินดีด้วย! คุณสุ่มกาชาได้ "${result.title}"`
          : `🎁 Gacha Roll Success: "${result.title}"`
      );
      fireConfetti();
      setInventory((prev) => ({
        ...prev,
        [result.id]: (prev[result.id] || 0) + 1,
      }));
      setGachaCount((prev) => prev + 1);
    } else if (item.type === "freeze") {
      setFreezeItems((prev) => prev + 1);
      showToast(
        lang === "th" ? `❄️ ซื้อแช่แข็งสตรีคสำเร็จ!` : `❄️ Streak Freeze acquired!`
      );
      fireConfetti();
    } else {
      setInventory((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }));
      showToast(
        lang === "th" ? `🎉 แลกรางวัลสำเร็จ!` : `🎉 Reward Redeemed Successfully!`
      );
      fireConfetti();
    }
  };

  const handleConsumeItem = (itemId: string) => {
    const cur = inventory[itemId] || 0;
    if (cur <= 0) return;
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) return;

    requestConfirm(
      lang === "th" ? "ยืนยันการใช้สิทธิ์" : "Confirm Item Usage",
      lang === "th"
        ? `คุณต้องการใช้สิทธิ์ "${item.title}" ในวันนี้ใช่หรือไม่?`
        : `Do you want to activate "${item.title}" today?`,
      () => {
        setInventory((prev) => {
          const next = { ...prev, [itemId]: cur - 1 };
          if (next[itemId] <= 0) delete next[itemId];
          return next;
        });
        const day = getDay(todayKey);
        setLogs((prev) => ({
          ...prev,
          [todayKey]: {
            ...day,
            activePerks: [...(day.activePerks || []), itemId],
          },
        }));
        playSound("habit", sfxEnabled, soundSet);
        fireConfetti();
        showToast(
          lang === "th"
            ? `🌟 ใช้สิทธิ์ "${item.title}" เรียบร้อยแล้ว!`
            : `🌟 Used "${item.title}" successfully!`
        );
      }
    );
  };

  // Voice Command Dispatcher
  const handleVoiceCommand = (commandText: string) => {
    const lower = commandText.toLowerCase().trim();

    // Match check-in / habit
    const matchedHabit = positiveHabits.find(
      (h) =>
        lower.includes(h.label.toLowerCase()) ||
        (h.id === "read" && (lower.includes("อ่าน") || lower.includes("read"))) ||
        (h.id === "exercise" && (lower.includes("ออกกำลัง") || lower.includes("ฟิต"))) ||
        (h.id === "water" && (lower.includes("ดื่มน้ำ") || lower.includes("water"))) ||
        (h.id === "meditate" && (lower.includes("สมาธิ") || lower.includes("meditate")))
    );

    if (matchedHabit) {
      togglePositive(todayKey, matchedHabit.id);
      showToast(
        lang === "th"
          ? `🎙️ สั่งงานด้วยเสียง: เช็คอิน "${matchedHabit.label}" สำเร็จ!`
          : `🎙️ Voice: Checked in "${matchedHabit.label}"!`
      );
      return;
    }

    // Match daily quest reroll command
    if (
      lower.includes("เควสต์") ||
      lower.includes("quest")
    ) {
      handleRerollQuests();
      return;
    }

    // Match gacha command
    if (lower.includes("สุ่ม") || lower.includes("กาชา") || lower.includes("gacha")) {
      const gachaItem = shopItems.find((i) => i.type === "gacha");
      if (gachaItem && stats.wallet >= gachaItem.price) {
        handleBuyItem(gachaItem);
      } else {
        showToast(
          lang === "th"
            ? "🎙️ สั่งงานด้วยเสียง: แต้มไม่พอสำหรับสุ่มกาชา (ต้องใช้ 150 แต้ม)"
            : "🎙️ Voice: Insufficient points for Gacha (150 pts required)"
        );
      }
      return;
    }

    // Match dark mode
    if (lower.includes("มืด") || lower.includes("สว่าง") || lower.includes("dark")) {
      setIsDarkMode((prev) => !prev);
      showToast(
        lang === "th" ? "🎙️ สั่งงานด้วยเสียง: เปลี่ยนโหมดการแสดงผล" : "🎙️ Voice: Toggled display mode"
      );
      return;
    }

    showToast(
      lang === "th"
        ? `🎙️ ได้ยินคำสั่ง: "${commandText}" (ไม่ตรงกับนิสัยที่มี)`
        : `🎙️ Heard: "${commandText}"`
    );
  };

  // Profile Picture Upload
  const handleProfilePicUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setProfilePic(dataUrl);
        showToast(lang === "th" ? "📸 อัปเดตรูปโปรไฟล์สำเร็จ!" : "📸 Profile picture updated!");
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Notification Toggle
  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        sendPushNotification(
          lang === "th" ? "เปิดการแจ้งเตือนสำเร็จ" : "Notifications Activated",
          lang === "th"
            ? "Equilibrium จะคอยแจ้งเตือนตารางงานและสถิติต่างๆ ให้คุณ"
            : "Equilibrium will keep you notified of goals and deadlines."
        );
        showToast(lang === "th" ? "🔔 เปิดการแจ้งเตือนสำเร็จ" : "🔔 Notifications Enabled");
      } else {
        showToast(
          lang === "th"
            ? "⚠️ กรุณาอนุญาตการแจ้งเตือนในเบราว์เซอร์"
            : "⚠️ Please grant notification permission in browser"
        );
      }
    } else {
      setNotificationsEnabled(false);
      showToast(lang === "th" ? "🔕 ปิดการแจ้งเตือนแล้ว" : "🔕 Notifications Disabled");
    }
  };

  // Export App Standalone HTML
  const handleDownloadAppHtml = () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EquilibriumHabitTracker_Offline.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(
      lang === "th"
        ? "💻 ดาวน์โหลดเว็บแอปออฟไลน์ (.html) เรียบร้อย!"
        : "💻 Downloaded standalone offline app (.html)!"
    );
  };

  // Bottom Navigation Tabs definition
  const TABS = useMemo(
    () => [
      {
        id: "today" as const,
        label: lang === "th" ? "วันนี้" : "Today",
        icon: <Sun size={20} />,
      },
      {
        id: "shop" as const,
        label: lang === "th" ? "รางวัล" : "Shop",
        icon: <ShoppingBag size={20} />,
      },
      {
        id: "history" as const,
        label: lang === "th" ? "ปฏิทิน" : "Calendar",
        icon: <CalendarDays size={20} />,
      },
      {
        id: "leaderboard" as const,
        label: lang === "th" ? "จัดอันดับ" : "Rankings",
        icon: <Trophy size={20} />,
      },
      {
        id: "settings" as const,
        label: lang === "th" ? "ตั้งค่า" : "Settings",
        icon: <Settings size={20} />,
      },
    ],
    [lang]
  );

  const currentBoss = BOSS_LIST[Math.min(bossLevel - 1, BOSS_LIST.length - 1)];

  const shakeClassName =
    screenShake === "boss"
      ? "screen-shake-boss"
      : screenShake === "quest"
      ? "screen-shake-quest"
      : screenShake === "crit"
      ? "screen-shake-crit"
      : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.BG,
        color: t.TEXT_MAIN,
      }}
      className="transition-colors duration-300 relative px-4 pt-5 pb-28 font-['Kanit',sans-serif] overflow-x-hidden"
    >
      <div className={`max-w-md mx-auto relative ${shakeClassName}`}>
        {/* Critical Hit Toast Popup */}
        {critPopup && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white font-black px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm modal-pop">
            <Zap size={20} />
            <span>{critPopup}</span>
          </div>
        )}

        {/* Regular Toast Notification */}
        {toastMsg && (
          <div
            style={{
              background: t.TEXT_MAIN,
              color: isDarkMode ? "#0F172A" : "#FFFFFF",
            }}
            className="toast-popup fixed top-5 left-1/2 -translate-x-1/2 z-50 font-bold px-5 py-3 rounded-full shadow-2xl text-xs flex items-center gap-2 max-w-[90vw] text-center"
          >
            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Confirm Modal Dialog */}
        {confirmDialog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeConfirm}
          >
            <div
              style={cardStyle}
              className="modal-pop w-full max-w-sm p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-extrabold mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{confirmDialog.msg}</p>
              <div className="flex gap-3">
                <button
                  onClick={closeConfirm}
                  style={{ background: t.NEUTRAL_BORDER }}
                  className="btn-scale flex-1 py-3 rounded-2xl font-bold text-xs cursor-pointer"
                >
                  {lang === "th" ? "ยกเลิก" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    closeConfirm();
                  }}
                  style={{
                    background:
                      confirmDialog.type === "danger" ? t.BAD_COLOR : t.ACCENT,
                  }}
                  className="btn-scale flex-1 py-3 rounded-2xl font-extrabold text-xs text-white cursor-pointer shadow-md"
                >
                  {lang === "th" ? "ยืนยัน" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boss Encyclopedia Modal */}
        {showBossList && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBossList(false)}
          >
            <div
              style={cardStyle}
              className="modal-pop w-full max-w-sm p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold">
                  {lang === "th" ? "สารานุกรมมอนสเตอร์ 📖" : "Monster Encyclopedia 📖"}
                </h3>
                <button
                  onClick={() => setShowBossList(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  {lang === "th" ? "ปิด" : "Close"}
                </button>
              </div>

              <div className="space-y-2.5">
                {BOSS_LIST.map((boss, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: bossLevel === idx + 1 ? t.BAD_BG : t.BG,
                      border:
                        bossLevel === idx + 1 ? `2px solid ${t.BAD_BORDER}` : "none",
                    }}
                    className="flex items-center gap-3.5 p-3 rounded-2xl"
                  >
                    <div className="text-3xl select-none">{boss.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold">
                          Lv.{idx + 1} {boss.name}
                        </span>
                        {bossLevel === idx + 1 && (
                          <span
                            style={{ background: t.BAD_COLOR }}
                            className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-md"
                          >
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {boss.desc}
                      </div>
                      {bossLevel === idx + 1 && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
                          <span>🎯 {lang === "th" ? "จุดอ่อนปัจจุบัน:" : "Active Weakness:"}</span>
                          <span className="bg-amber-500/20 px-1.5 py-0.5 rounded-md text-amber-700 dark:text-amber-300">
                            {currentBossWeakness.icon} {lang === "th" ? currentBossWeakness.nameTh : currentBossWeakness.nameEn} (+{currentBossWeakness.bonusPoints} pts)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: TODAY VIEW */}
        {activeTab === "today" && (
          <>
            {/* Daily Quote Banner */}
            <div
              style={{
                background: t.ACCENT_BG,
                borderRadius: 24,
              }}
              className="p-4 mb-5 flex items-center gap-3 border border-cyan-200/50 dark:border-cyan-900/40"
            >
              <span className="text-2xl select-none">💡</span>
              <div
                style={{ color: t.ACCENT }}
                className="text-xs font-bold leading-relaxed flex-1"
              >
                {todayQuote}
              </div>
            </div>

            {/* Header Greeting & Voice Trigger */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  {lang === "th"
                    ? `วัน${THAI_DAYS_FULL[today.getDay()]}ที่ ${today.getDate()} ${
                        THAI_MONTHS_FULL[today.getMonth()]
                      }`
                    : `${EN_DAYS_FULL[today.getDay()]}, ${today.getDate()} ${
                        EN_MONTHS_FULL[today.getMonth()]
                      }`}
                </div>
                <div className="text-2xl font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                  {lang === "th" ? `สวัสดี ${username}! 👋` : `Hello, ${username}! 👋`}
                </div>
              </div>

              {/* Quick Actions: Google User & Voice Assistant */}
              <div className="flex items-center gap-2">
                {user ? (
                  <div
                    onClick={() => setActiveTab("settings")}
                    title={user.displayName || user.email || "Google Account"}
                    className="btn-scale flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500 bg-slate-200 shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-[11px] font-black leading-tight truncate max-w-[90px] text-slate-800 dark:text-slate-100">
                        {user.displayName?.split(" ")[0] || "User"}
                      </div>
                      <div className="text-[9px] font-semibold text-emerald-500">
                        {isSyncing ? "Syncing..." : "Cloud on"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await loginWithGoogle();
                      } catch (e) {
                        showToast(lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed");
                      }
                    }}
                    className="btn-scale p-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer flex items-center gap-1.5 text-xs font-extrabold hover:border-cyan-500 transition-all"
                    title="Sign in with Google"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="hidden sm:inline">{lang === "th" ? "ล็อกอิน Google" : "Sign in"}</span>
                  </button>
                )}

                {/* Quick Voice Assistant Button */}
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  style={{
                    background: t.ACCENT,
                  }}
                  className="btn-scale p-3 rounded-2xl text-white shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5 text-xs font-extrabold"
                  title="Voice Assistant"
                >
                  <Mic size={16} />
                  <span className="hidden sm:inline">{lang === "th" ? "สั่งด้วยเสียง" : "Voice"}</span>
                </button>
              </div>
            </div>

            {/* Top Stats Widget (Level, Wallet, Streak) */}
            <TopStatsWidget
              user={user}
              onLogin={async () => {
                try {
                  await loginWithGoogle();
                } catch (e) {
                  showToast(lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed");
                }
              }}
              isSyncing={isSyncing}
              totalAngel={stats.totalAngel}
              wallet={stats.wallet}
              currentStreak={stats.currentStreak}
              isOnline={isOnline}
              t={t}
              lang={lang}
            />

            {/* Horizontal Daily Routine Timeline View */}
            <HabitTimelineWidget
              day={getDay(todayKey)}
              positiveHabits={positiveHabits}
              onToggleHabit={(habitId) => togglePositive(todayKey, habitId)}
              onUpdateCompletedTime={updateHabitCompletedTime}
              isDarkMode={isDarkMode}
              t={t}
              lang={lang}
              dailyQuests={dailyQuests}
            />

            {/* Daily Quests Widget */}
            <DailyQuestsWidget
              day={getDay(todayKey)}
              dailyQuests={dailyQuests}
              onClaim={(questId, reward, label, icon) => {
                playSound("habit", sfxEnabled, soundSet);
                if (rewardFxConfig.enabled) {
                  fireConfetti({
                    intensity: rewardFxConfig.intensity,
                    colors: activeRewardPalette.colors,
                  });
                }
                triggerGameEffect("quest", {
                  title: label,
                  reward,
                  icon,
                });
                showToast(
                  lang === "th"
                    ? `🎉 รับรางวัลเควสต์ +${reward} แต้ม!`
                    : `🎉 Claimed quest reward +${reward} pts!`
                );
                setDailyQuests((prev) => ({
                  ...prev,
                  claimed: [...prev.claimed, questId],
                }));
                setSpentPoints((prev) => Math.max(0, prev - reward));
              }}
              onReroll={handleRerollQuests}
              isDarkMode={isDarkMode}
              t={t}
              lang={lang}
            />

            {/* Active Inventory Perks Banner */}
            {getDay(todayKey).activePerks?.length > 0 && (
              <div
                style={{
                  background: isDarkMode ? "#0F172A" : "#F0FDF4",
                  border: `2px dashed ${t.ACCENT}`,
                  borderRadius: 24,
                }}
                className="p-4 mb-6"
              >
                <div
                  className="text-xs font-extrabold mb-3 flex items-center gap-1.5"
                  style={{ color: t.ACCENT }}
                >
                  <Sparkles size={16} />
                  <span>
                    {lang === "th" ? "สิทธิ์พิเศษที่กำลังใช้งานวันนี้:" : "Active Perks Today:"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {getDay(todayKey).activePerks.map((id, index) => {
                    const item = shopItems.find((i) => i.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={index}
                        style={{ background: t.CARD }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RPG Boss Battle Widget */}
            <BossBattleWidget
              bossHp={bossHp}
              bossMaxHp={bossMaxHp}
              bossLevel={bossLevel}
              bossXp={bossXp}
              lastXpGained={lastBossXpGained}
              bossWeakness={currentBossWeakness}
              comboStreak={stats.currentStreak}
              sfxEnabled={sfxEnabled}
              soundSet={soundSet}
              onOpenBossList={() => setShowBossList(true)}
              isDarkMode={isDarkMode}
              t={t}
              lang={lang}
            />

            {/* Habits Checklists (Morning, Day, Evening) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div
                  style={{ background: t.GOOD_BG, color: t.GOOD_COLOR }}
                  className="p-2 rounded-2xl"
                >
                  <Sparkles size={18} />
                </div>
                <span className="text-lg font-black" style={{ color: t.TEXT_MAIN }}>
                  {lang === "th" ? "สร้างความสำเร็จ (นิสัยเชิงบวก)" : "Positive Habits"}
                </span>
              </div>

              {TIME_GROUPS.map((grp) => {
                const items = positiveHabits.filter((h) => h.time === grp.key);
                if (items.length === 0) return null;

                const getGroupIcon = () => {
                  if (grp.key === "morning") return <Sun size={17} />;
                  if (grp.key === "day") return <CloudSun size={17} />;
                  return <Moon size={17} />;
                };

                return (
                  <div key={grp.key}>
                    <div
                      className="flex items-center gap-2 text-xs font-bold mb-2.5"
                      style={{ color: grp.color }}
                    >
                      {getGroupIcon()}
                      <span>{lang === "th" ? grp.label : grp.enLabel}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {items.map((h) => {
                        const checked = !!getDay(todayKey).positives[h.id];
                        const isWeakness = h.id === bossWeaknessId;

                        return (
                          <button
                            key={h.id}
                            onClick={() => togglePositive(todayKey, h.id)}
                            style={{
                              background: checked
                                ? t.GOOD_COLOR
                                : isWeakness
                                ? isDarkMode
                                  ? "linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(30, 41, 59, 0.85) 100%)"
                                  : "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)"
                                : t.CARD,
                              border: `2px solid ${
                                checked
                                  ? t.GOOD_COLOR
                                  : isWeakness
                                  ? "#F59E0B"
                                  : t.NEUTRAL_BORDER
                              }`,
                              color: checked ? "#FFF" : t.TEXT_MAIN,
                            }}
                            className={`btn-scale p-3.5 rounded-2xl text-left flex items-center justify-between cursor-pointer shadow-sm transition-all relative overflow-hidden ${
                              isWeakness && !checked ? "ring-2 ring-amber-400/25" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                style={{
                                  borderColor: checked
                                    ? "#FFF"
                                    : isWeakness
                                    ? "#F59E0B"
                                    : t.TEXT_MUTED,
                                  background: checked ? "#FFF" : "transparent",
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                              >
                                {checked && (
                                  <Check
                                    size={12}
                                    color={t.GOOD_COLOR}
                                    strokeWidth={4}
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold truncate">{h.label}</span>
                                  {isWeakness && (
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                        checked
                                          ? "bg-white/25 text-white"
                                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/30"
                                      }`}
                                    >
                                      🎯 {lang === "th" ? "จุดอ่อนบอส" : "Weakness"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0 ml-2">
                              <span
                                style={{
                                  color: checked
                                    ? "#FFF"
                                    : isWeakness
                                    ? "#D97706"
                                    : t.GOOD_COLOR,
                                }}
                                className="text-xs font-black"
                              >
                                +{h.points}
                                {isWeakness && !checked && (
                                  <span className="text-[10px] text-amber-500 ml-1 font-extrabold">
                                    (+{currentBossWeakness.bonusPoints})
                                  </span>
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Friction / Negative Habits */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    style={{ background: t.BAD_BG, color: t.BAD_COLOR }}
                    className="p-2 rounded-2xl"
                  >
                    <ShieldAlert size={18} />
                  </div>
                  <span className="text-lg font-black" style={{ color: t.TEXT_MAIN }}>
                    {lang === "th" ? "พฤติกรรมฉุดรั้ง (หักแต้ม)" : "Friction Habits (Penalties)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {negativeHabits.map((h) => {
                    const checked = !!getDay(todayKey).negatives[h.id];

                    return (
                      <button
                        key={h.id}
                        onClick={() => toggleNegative(todayKey, h.id)}
                        style={{
                          background: checked ? t.BAD_COLOR : t.CARD,
                          border: `2px solid ${
                            checked ? t.BAD_COLOR : t.NEUTRAL_BORDER
                          }`,
                          color: checked ? "#FFF" : t.TEXT_MAIN,
                        }}
                        className="btn-scale p-3.5 rounded-2xl text-left flex items-center justify-between cursor-pointer shadow-sm transition-all"
                      >
                        <span className="text-xs font-bold">{h.label}</span>
                        <span
                          style={{ color: checked ? "#FFF" : t.BAD_COLOR }}
                          className="text-xs font-black"
                        >
                          -{h.points}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Savings & Mood Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Savings Tracker */}
                <div style={cardStyle} className="p-4 shadow-sm">
                  <div
                    className="flex items-center gap-1.5 text-xs font-bold mb-2.5"
                    style={{ color: t.ACCENT }}
                  >
                    <ThreeDCoin size={18} />
                    <span>
                      {lang === "th"
                        ? "ออมเงินวันนี้ (100บ. = 1 แต้ม)"
                        : "Daily Savings (100฿ = 1 pt)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={
                        savingsDraft[todayKey] !== undefined
                          ? savingsDraft[todayKey]
                          : getDay(todayKey).savings || ""
                      }
                      onChange={(e) =>
                        setSavingsDraft((prev) => ({
                          ...prev,
                          [todayKey]: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        const amt = Math.max(0, Number(savingsDraft[todayKey]) || 0);
                        setLogs((prev) => ({
                          ...prev,
                          [todayKey]: {
                            ...getDay(todayKey),
                            savings: amt,
                          },
                        }));
                      }}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold outline-none text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <span className="text-xs font-bold text-slate-400">
                      {lang === "th" ? "บาท" : "THB"}
                    </span>
                  </div>
                </div>

                {/* Mood Tracker */}
                <div style={cardStyle} className="p-4 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 mb-2.5">
                    {lang === "th" ? "อารมณ์ความรู้สึกวันนี้" : "Today's Mood"}
                  </div>
                  <div className="flex justify-between items-center">
                    {MOODS.map((m) => {
                      const isCurrent = getDay(todayKey).mood === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setLogs((prev) => ({
                              ...prev,
                              [todayKey]: {
                                ...getDay(todayKey),
                                mood: isCurrent ? null : m.id,
                              },
                            }));
                          }}
                          title={lang === "th" ? m.label : m.enLabel}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer hover:scale-110"
                          style={{
                            background: isCurrent ? t.ACCENT_BG : "transparent",
                            border: isCurrent ? `2px solid ${t.ACCENT}` : "none",
                          }}
                        >
                          {m.icon}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Daily Diary / Reflection Textarea */}
              <div style={cardStyle} className="p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-purple-500 font-extrabold text-xs">
                  <PenLine size={16} />
                  <span style={{ color: t.TEXT_MAIN }}>
                    {lang === "th"
                      ? "บันทึกประจำวันและข้อคิด (Diary)"
                      : "Daily Reflection & Notes"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={
                    lang === "th"
                      ? "วันนี้มีเรื่องดีๆ อะไรเกิดขึ้นบ้าง สิ่งที่ได้เรียนรู้..."
                      : "Reflect on what went well today..."
                  }
                  value={
                    diaryDraft[todayKey] !== undefined
                      ? diaryDraft[todayKey]
                      : getDay(todayKey).diaryText || ""
                  }
                  onChange={(e) =>
                    setDiaryDraft((prev) => ({
                      ...prev,
                      [todayKey]: e.target.value,
                    }))
                  }
                  onBlur={() => {
                    const raw = diaryDraft[todayKey] ?? getDay(todayKey).diaryText;
                    setLogs((prev) => ({
                      ...prev,
                      [todayKey]: {
                        ...getDay(todayKey),
                        diaryText: raw,
                      },
                    }));
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium text-slate-800 dark:text-slate-100 shadow-sm"
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SHOP VIEW */}
        {activeTab === "shop" && (
          <ShopView
            wallet={stats.wallet}
            shopItems={shopItems}
            inventory={inventory}
            freezeItems={freezeItems}
            onBuyItem={handleBuyItem}
            onConsumeItem={handleConsumeItem}
            t={t}
            lang={lang}
          />
        )}

        {/* TAB 3: CALENDAR VIEW */}
        {activeTab === "history" && (
          <CalendarView
            logs={logs}
            historyCursor={historyCursor}
            onPrevMonth={() =>
              setHistoryCursor(
                new Date(
                  historyCursor.getFullYear(),
                  historyCursor.getMonth() - 1,
                  1
                )
              )
            }
            onNextMonth={() =>
              setHistoryCursor(
                new Date(
                  historyCursor.getFullYear(),
                  historyCursor.getMonth() + 1,
                  1
                )
              )
            }
            selectedDateKey={selectedDateKey}
            onSelectDate={(key) =>
              setSelectedDateKey(selectedDateKey === key ? null : key)
            }
            positiveHabits={positiveHabits}
            negativeHabits={negativeHabits}
            positivePointsMap={positivePointsMap}
            onTogglePositive={togglePositive}
            onToggleNegative={toggleNegative}
            onSetSavings={(key, amt) => {
              setLogs((prev) => ({
                ...prev,
                [key]: {
                  ...getDay(key),
                  savings: amt,
                },
              }));
            }}
            onSetMood={(key, moodId) => {
              setLogs((prev) => ({
                ...prev,
                [key]: {
                  ...getDay(key),
                  mood: getDay(key).mood === moodId ? null : moodId,
                },
              }));
            }}
            onSaveDiary={(key, text) => {
              setLogs((prev) => ({
                ...prev,
                [key]: {
                  ...getDay(key),
                  diaryText: text,
                },
              }));
            }}
            today={today}
            t={t}
            lang={lang}
          />
        )}

        {/* TAB 4: LEADERBOARD VIEW */}
        {activeTab === "leaderboard" && (
          <LeaderboardView
            leaderboard={leaderboard}
            claimedBadges={claimedBadges}
            userId="current_user"
            t={t}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}

        {/* TAB 5: SETTINGS VIEW */}
        {activeTab === "settings" && (
          <SettingsView
            user={user}
            onLogin={async () => {
              try {
                await loginWithGoogle();
              } catch (e) {
                showToast(lang === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed");
              }
            }}
            onLogout={async () => {
              try {
                await logoutUser();
                showToast(lang === "th" ? "ออกจากระบบแล้ว" : "Signed out");
              } catch (e) {
                showToast(lang === "th" ? "ออกจากระบบไม่สำเร็จ" : "Sign out failed");
              }
            }}
            isSyncing={isSyncing}
            lastSyncedAt={lastSyncedAt}
            username={username}
            onSaveUsername={(name) => {
              setUsername(name);
              showToast(lang === "th" ? "บันทึกชื่อสำเร็จ!" : "Username saved!");
            }}
            profilePic={profilePic}
            onUploadProfilePic={handleProfilePicUpload}
            appTheme={appTheme}
            onSetTheme={setAppTheme}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
            sfxEnabled={sfxEnabled}
            onToggleSfx={() => {
              setSfxEnabled((prev) => !prev);
              playSound("click", !sfxEnabled, soundSet);
            }}
            soundSet={soundSet}
            onSetSoundSet={setSoundSet}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={handleToggleNotifications}
            screenShakeEnabled={screenShakeEnabled}
            onToggleScreenShake={() => {
              setScreenShakeEnabled((prev) => !prev);
              playSound("click", sfxEnabled, soundSet);
            }}
            rewardFxConfig={rewardFxConfig}
            onUpdateRewardFxConfig={(cfg) =>
              setRewardFxConfig((prev) => ({ ...prev, ...cfg }))
            }
            onTestRewardFx={() => {
              playSound("habit", sfxEnabled, soundSet);
              fireConfetti({
                intensity: rewardFxConfig.intensity,
                colors: activeRewardPalette.colors,
              });
              triggerGameEffect("habit", {
                title: lang === "th" ? "✨ ทดสอบ Reward FX!" : "✨ Reward FX Test!",
                reward: 20,
              });
            }}
            onTestEffect={(type) => {
              if (type === "boss") {
                playSound("boss_defeat", sfxEnabled, soundSet);
                fireConfetti({
                  intensity: "high",
                  colors: activeRewardPalette.colors,
                });
                triggerGameEffect("boss", {
                  bossName: currentBoss.name,
                  bossLevel: bossLevel,
                  icon: currentBoss.icon,
                  reward: 500,
                });
              } else {
                playSound("habit", sfxEnabled, soundSet);
                if (rewardFxConfig.enabled) {
                  fireConfetti({
                    intensity: rewardFxConfig.intensity,
                    colors: activeRewardPalette.colors,
                  });
                }
                triggerGameEffect("quest", {
                  title: lang === "th" ? "ทดสอบเอฟเฟกต์แสงเควสต์สำเร็จ!" : "Quest Complete FX Test!",
                  reward: 100,
                });
              }
            }}
            lang={lang}
            onSetLanguage={setLang}
            onExportBackup={() =>
              exportBackupJSON({
                logs,
                spentPoints,
                freezeItems,
                inventory,
                claimedBadges,
                gachaCount,
                dailyQuests,
                positiveHabits,
                negativeHabits,
                shopItems,
                bossHp,
                bossMaxHp,
                bossLevel,
                bossXp,
                bossWeaknessId,
                isDarkMode,
                appTheme,
                sfxEnabled,
                soundSet,
                username,
                profilePic,
                language: lang,
                screenShakeEnabled,
                rewardFxConfig,
              })
            }
            onImportBackup={(file) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const p = JSON.parse(event.target?.result as string);
                  if (p.logs) setLogs(p.logs);
                  if (p.spentPoints !== undefined) setSpentPoints(p.spentPoints);
                  if (p.freezeItems !== undefined) setFreezeItems(p.freezeItems);
                  if (p.inventory) setInventory(p.inventory);
                  if (p.claimedBadges) setClaimedBadges(p.claimedBadges);
                  if (p.gachaCount !== undefined) setGachaCount(p.gachaCount);
                  if (p.dailyQuests) setDailyQuests(p.dailyQuests);
                  if (p.positiveHabits) setPositiveHabits(p.positiveHabits);
                  if (p.negativeHabits) setNegativeHabits(p.negativeHabits);
                  if (p.shopItems) setShopItems(p.shopItems);
                  if (p.bossHp !== undefined) setBossHp(p.bossHp);
                  if (p.bossMaxHp !== undefined) setBossMaxHp(p.bossMaxHp);
                  if (p.bossLevel !== undefined) setBossLevel(p.bossLevel);
                  if (p.bossXp !== undefined) setBossXp(p.bossXp);
                  if (p.bossWeaknessId) setBossWeaknessId(p.bossWeaknessId);
                  if (p.isDarkMode !== undefined) setIsDarkMode(p.isDarkMode);
                  if (p.appTheme) setAppTheme(p.appTheme);
                  if (p.sfxEnabled !== undefined) setSfxEnabled(p.sfxEnabled);
                  if (p.soundSet) setSoundSet(p.soundSet);
                  if (p.username) setUsername(p.username);
                  if (p.profilePic) setProfilePic(p.profilePic);
                  if (p.language) setLang(p.language);
                  if (p.screenShakeEnabled !== undefined) setScreenShakeEnabled(p.screenShakeEnabled);
                  if (p.rewardFxConfig) setRewardFxConfig(p.rewardFxConfig);
                  showToast(lang === "th" ? "📥 กู้คืนข้อมูลสำเร็จ!" : "📥 Data restored!");
                  fireConfetti();
                } catch {
                  showToast(lang === "th" ? "❌ ไฟล์ไม่ถูกต้อง" : "❌ Invalid file format");
                }
              };
              reader.readAsText(file);
            }}
            onDownloadHtml={handleDownloadAppHtml}
            positiveHabits={positiveHabits}
            onUpdatePositiveHabits={setPositiveHabits}
            negativeHabits={negativeHabits}
            onUpdateNegativeHabits={setNegativeHabits}
            shopItems={shopItems}
            onUpdateShopItems={setShopItems}
            onRequestConfirm={requestConfirm}
            t={t}
          />
        )}

        {/* Voice Command Modal */}
        <VoiceCommandModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          onCommand={handleVoiceCommand}
          t={t}
          lang={lang}
        />

        {/* Screen Effects & Flash Overlay */}
        <ScreenEffectsOverlay
          effect={screenEffect}
          data={screenEffectData}
          onDismiss={() => {
            setScreenEffect("none");
            setScreenEffectData(null);
          }}
          lang={lang}
          isDarkMode={isDarkMode}
          primaryColor={activeRewardPalette.primary}
          intensity={rewardFxConfig.intensity}
        />

        {/* Fixed Bottom Navigation Bar */}
        <div
          style={{
            background: t.CARD,
            borderColor: t.NEUTRAL_BORDER,
          }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center p-1.5 rounded-full shadow-2xl border w-[calc(100%-32px)] max-w-md"
        >
          {TABS.map((tabItem) => {
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => {
                  playSound("click", sfxEnabled, soundSet);
                  setActiveTab(tabItem.id);
                }}
                style={{
                  background: isActive ? t.ACCENT_BG : "transparent",
                  color: isActive ? t.ACCENT : t.TEXT_MUTED,
                }}
                className="btn-scale flex-1 flex flex-col items-center justify-center py-2.5 rounded-full cursor-pointer transition-all"
              >
                <div className="mb-0.5">{tabItem.icon}</div>
                <span className="text-[10px] font-extrabold tracking-tight">
                  {tabItem.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
