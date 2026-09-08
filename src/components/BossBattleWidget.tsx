import React, { useState, useEffect, useRef } from "react";
import { Target, Flame, Sparkles, Award, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { BOSS_LIST } from "../data/constants";
import { BossWeaknessInfo, SoundSetKey } from "../types";
import { Icon3D } from "./Icon3D";
import { ThreeDZap } from "./ThreeDIcons";
import { playSound } from "../utils/audio";

export interface BossHunterInfo {
  rank: number;
  rankTitle: string;
  currentXpInRank: number;
  xpRequired: number;
  progress: number;
  totalXp: number;
}

export function getBossHunterInfo(totalXp: number, lang: "th" | "en" = "th"): BossHunterInfo {
  let remaining = Math.max(0, totalXp);
  let rank = 1;
  let req = 250;

  while (remaining >= req) {
    remaining -= req;
    rank++;
    req = 250 + (rank - 1) * 100;
  }

  const currentXpInRank = remaining;
  const xpRequired = req;
  const progress = Math.min(100, Math.max(0, (currentXpInRank / xpRequired) * 100));

  const titlesTh = [
    "",
    "นักล่ามือใหม่",
    "นักล่าผู้กล้า",
    "ผู้พิชิตอสูร",
    "ยอดฝีมือปราบมาร",
    "จอมราชันย์นักล่า",
    "ตำนานผู้สยบบอส",
    "เทพเจ้าไร้พ่าย",
  ];
  const titlesEn = [
    "",
    "Novice Hunter",
    "Brave Hunter",
    "Beast Slayer",
    "Elite Vanquisher",
    "Master Hunter",
    "Mythic Champion",
    "Immortal Slayer",
  ];

  const rankTitle =
    lang === "th"
      ? titlesTh[Math.min(rank, titlesTh.length - 1)]
      : titlesEn[Math.min(rank, titlesEn.length - 1)];

  return {
    rank,
    rankTitle,
    currentXpInRank,
    xpRequired,
    progress,
    totalXp,
  };
}

interface BossBattleWidgetProps {
  bossHp: number;
  bossMaxHp: number;
  bossLevel: number;
  bossXp?: number;
  lastXpGained?: number;
  bossWeakness?: BossWeaknessInfo | null;
  comboStreak?: number;
  comboMultiplier?: number;
  sfxEnabled?: boolean;
  soundSet?: SoundSetKey;
  onOpenBossList: () => void;
  isDarkMode: boolean;
  t: {
    CARD: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    BAD_COLOR: string;
    BAD_BORDER: string;
  };
  lang: "th" | "en";
}

export const BossBattleWidget: React.FC<BossBattleWidgetProps> = ({
  bossHp,
  bossMaxHp,
  bossLevel,
  bossXp = 0,
  lastXpGained,
  bossWeakness,
  comboStreak = 0,
  comboMultiplier,
  sfxEnabled = true,
  soundSet = "retro" as SoundSetKey,
  onOpenBossList,
  isDarkMode,
  t,
  lang,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100));
  const currentBoss = BOSS_LIST[Math.min(bossLevel - 1, BOSS_LIST.length - 1)];
  const isRageMode = hpPercent < 20 && bossHp > 0;

  const prevHpRef = useRef(bossHp);
  const prevLevelRef = useRef(bossLevel);
  const [isDamaged, setIsDamaged] = useState(false);
  const [recentXpGain, setRecentXpGain] = useState<number | null>(null);

  // Boss Level Up & Evolution Animation State
  const [evolutionState, setEvolutionState] = useState<{
    active: boolean;
    oldBoss: (typeof BOSS_LIST)[0];
    newBoss: (typeof BOSS_LIST)[0];
    oldLevel: number;
    newLevel: number;
    xpGained: number;
  } | null>(null);

  // Calculate Boss Hunter Experience Progress
  const hunterInfo = getBossHunterInfo(bossXp, lang);

  // Combo Multiplier & Streak Intensity Calculation
  const streak = Math.max(0, comboStreak);
  const activeMultiplier =
    comboMultiplier !== undefined
      ? comboMultiplier
      : streak > 0
      ? Number((1 + Math.min(2.0, streak * 0.1)).toFixed(2))
      : 1.0;
  const bonusPercent = Math.round((activeMultiplier - 1) * 100);

  // Scalable Intensity Tiers (0: Ready, 1: Spark, 2: Blazing, 3: Supernova, 4: Godlike)
  let tier: 0 | 1 | 2 | 3 | 4 = 0;
  if (streak >= 14) {
    tier = 4;
  } else if (streak >= 7) {
    tier = 3;
  } else if (streak >= 3) {
    tier = 2;
  } else if (streak >= 1) {
    tier = 1;
  } else {
    tier = 0;
  }

  useEffect(() => {
    if (bossHp < prevHpRef.current) {
      setIsDamaged(true);
      const timer = setTimeout(() => setIsDamaged(false), 450);
      prevHpRef.current = bossHp;
      return () => clearTimeout(timer);
    }
    prevHpRef.current = bossHp;
  }, [bossHp]);

  // Trigger Boss Level Up & Evolution animation when bossLevel increases
  useEffect(() => {
    if (bossLevel > prevLevelRef.current) {
      const oldIdx = Math.max(0, Math.min(prevLevelRef.current - 1, BOSS_LIST.length - 1));
      const newIdx = Math.min(bossLevel - 1, BOSS_LIST.length - 1);
      const oldBoss = BOSS_LIST[oldIdx];
      const newBoss = BOSS_LIST[newIdx];
      const gained = lastXpGained || 200 + (prevLevelRef.current - 1) * 50;

      setEvolutionState({
        active: true,
        oldBoss,
        newBoss,
        oldLevel: prevLevelRef.current,
        newLevel: bossLevel,
        xpGained: gained,
      });

      setRecentXpGain(gained);
      const xpTimer = setTimeout(() => setRecentXpGain(null), 4000);

      if (sfxEnabled) {
        playSound("levelup", sfxEnabled, soundSet);
      }

      const timer = setTimeout(() => {
        setEvolutionState(null);
      }, 4200);

      prevLevelRef.current = bossLevel;
      return () => {
        clearTimeout(timer);
        clearTimeout(xpTimer);
      };
    }
    prevLevelRef.current = bossLevel;
  }, [bossLevel, lastXpGained, sfxEnabled, soundSet]);

  // Flash XP gain indicator when lastXpGained is provided
  useEffect(() => {
    if (lastXpGained && lastXpGained > 0) {
      setRecentXpGain(lastXpGained);
      const timer = setTimeout(() => setRecentXpGain(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [lastXpGained]);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("boss_battle_expanded_v2");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleExpand = (expand?: boolean) => {
    setIsExpanded((prev) => {
      const next = expand !== undefined ? expand : !prev;
      try {
        localStorage.setItem("boss_battle_expanded_v2", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // =========================================================================
  // 1. COLLAPSED VIEW (โหมดย่อเก็บบอส - Compact Boss Card)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div
        style={{
          background: isDarkMode
            ? isRageMode
              ? "linear-gradient(135deg, #370F15 0%, #20070B 100%)"
              : "#2D1216"
            : isRageMode
            ? "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FFF0F2 100%)",
          border: isRageMode ? "2px solid #EF4444" : `1.5px solid ${t.BAD_BORDER}`,
          borderRadius: 24,
          boxShadow: isDarkMode
            ? "0 6px 20px -8px rgba(0,0,0,0.5)"
            : "0 6px 18px -6px rgba(225,29,72,0.12)",
        }}
        className={`p-3.5 sm:p-4 mb-5 relative overflow-hidden transition-all duration-300 hover:shadow-md bevel-cut-3d group ${
          isDamaged ? "boss-damaged" : ""
        } ${isRageMode ? "boss-rage-mode" : ""}`}
      >
        {/* Rage Mode Ambient Red Pulsing Lighting */}
        {isRageMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[22px]">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/15 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-600/15 rounded-full blur-2xl animate-pulse" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          {/* Boss Mini Profile */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => toggleExpand(true)}
          >
            <div
              className={`relative flex-shrink-0 ${
                isRageMode ? "boss-breathing-rapid" : "boss-breathing-normal"
              }`}
            >
              <Icon3D
                icon={currentBoss.icon}
                color={isRageMode ? "ruby" : "ruby"}
                size="md"
                shape="squircle"
                glow
              />
              {isRageMode && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-white shadow-sm" />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                  {currentBoss.name}
                </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #EF4444, #991B1B)",
                  }}
                  className="text-[10px] font-black text-white px-2 py-0.2 rounded-full"
                >
                  Lv.{bossLevel}
                </span>

                {isRageMode && (
                  <span className="text-[9px] font-black text-white bg-red-600 px-1.5 py-0.2 rounded-full animate-pulse">
                    🔥 RAGE
                  </span>
                )}
              </div>

              {/* Mini Tags: Weakness, Combo & Hunter Rank */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[10px] font-bold">
                {bossWeakness && (
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 flex items-center gap-1">
                    <span>🎯</span>
                    <span className="truncate max-w-[100px]">
                      {lang === "th" ? bossWeakness.nameTh : bossWeakness.nameEn}
                    </span>
                    <span className="text-rose-500 font-extrabold">{bossWeakness.damageMultiplier}x</span>
                  </span>
                )}

                <span className="px-1.5 py-0.2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 flex items-center gap-0.5">
                  <Flame size={10} className="text-amber-500" />
                  <span>{activeMultiplier.toFixed(1)}x DMG</span>
                </span>

                <span className="px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 flex items-center gap-0.5">
                  <Award size={10} className="text-purple-500" />
                  <span>{lang === "th" ? `R.${hunterInfo.rank}` : `R.${hunterInfo.rank}`}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right actions: HP & Expand Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="text-right mr-1">
              <div className="text-sm font-black tracking-tight" style={{ color: t.BAD_COLOR }}>
                {bossHp}
                <span className="text-[10px] text-slate-400 font-bold"> / {bossMaxHp}</span>
              </div>
              <div className="text-[9px] font-extrabold text-slate-400">
                {Math.round(hpPercent)}% HP
              </div>
            </div>

            {/* Encyclopedia Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBossList();
              }}
              title={lang === "th" ? "สารานุกรมมอนสเตอร์" : "Monster Encyclopedia"}
              className="text-xs font-bold px-2 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            >
              <BookOpen size={13} />
              <span className="text-[11px] hidden sm:inline">{lang === "th" ? "สารานุกรม" : "Book"}</span>
            </button>

            {/* Expand Battle Button */}
            <button
              type="button"
              onClick={() => toggleExpand(true)}
              style={{
                background: "linear-gradient(135deg, #EF4444, #BE123C)",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-sm shadow-rose-500/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{lang === "th" ? "ดูการต่อสู้" : "Battle"}</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Compact HP Bar Strip */}
        <div
          onClick={() => toggleExpand(true)}
          className="mt-3 pt-2 border-t border-rose-100 dark:border-slate-800/70 flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="flex-1 h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/90 overflow-hidden relative shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isRageMode ? "animate-pulse" : ""
              }`}
              style={{
                width: `${hpPercent}%`,
                background: "linear-gradient(90deg, #F43F5E 0%, #E11D48 60%, #9F1239 100%)",
              }}
            />
          </div>
          <span className="text-[10px] font-black text-rose-500 flex-shrink-0">
            Lv.{bossLevel}
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW (โหมดเต็ม - Full Boss Battle Dashboard)
  // =========================================================================
  return (
    <div
      onClick={onOpenBossList}
      style={{
        background: isDarkMode
          ? isRageMode
            ? "linear-gradient(135deg, #370F15 0%, #20070B 100%)"
            : "#2D1216"
          : isRageMode
          ? "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)"
          : "linear-gradient(135deg, #FFFFFF 0%, #FFF0F2 100%)",
        border: isRageMode ? "2px solid #EF4444" : `2px solid ${t.BAD_BORDER}`,
        borderRadius: 28,
      }}
      className={`btn-scale p-5 mb-6 cursor-pointer relative overflow-hidden transition-all hover:shadow-xl shadow-rose-500/15 bevel-cut-3d ${
        isDamaged ? "boss-damaged" : ""
      } ${isRageMode ? "boss-rage-mode" : ""}`}
    >
      {/* Rage Mode Ambient Red Pulsing Lighting */}
      {isRageMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[26px]">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-600/15 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-rose-600/15 rounded-full blur-2xl animate-pulse" />
        </div>
      )}

      {/* Evolution Celebration Banner Overlay */}
      {evolutionState?.active && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEvolutionState(null);
          }}
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(30, 27, 75, 0.98) 0%, rgba(88, 28, 135, 0.95) 50%, rgba(159, 18, 57, 0.98) 100%)"
              : "linear-gradient(135deg, #FFFBEB 0%, #FEF2F2 50%, #F5F3FF 100%)",
            border: "2px solid #F59E0B",
            boxShadow: "0 10px 30px -5px rgba(245, 158, 11, 0.5), 0 0 20px rgba(225, 29, 72, 0.35)",
            borderRadius: 22,
          }}
          className="boss-evolution-banner mb-3.5 p-3.5 relative overflow-hidden cursor-pointer z-20"
        >
          {/* Ambient lighting inside banner */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-400/25 rounded-full blur-xl pointer-events-none animate-pulse" />
          <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-rose-500/25 rounded-full blur-xl pointer-events-none animate-pulse" />

          {/* Banner Header Tag */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md">
              <Sparkles size={12} className="animate-spin" />
              {lang === "th" ? "⚡ บอสอัปเลเวล & วิวัฒนาการร่างใหม่!" : "⚡ BOSS LEVEL UP & EVOLVED!"}
            </span>
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
              {lang === "th" ? "แตะเพื่อปิด ✕" : "Tap to close ✕"}
            </span>
          </div>

          {/* Evolution Morph Graphic */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-500/30 relative z-10">
            {/* Old Boss */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl filter drop-shadow-sm flex-shrink-0">{evolutionState.oldBoss.icon}</span>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400">
                  Lv.{evolutionState.oldLevel}
                </div>
                <div className="text-xs font-black truncate line-through opacity-70" style={{ color: t.TEXT_MAIN }}>
                  {evolutionState.oldBoss.name}
                </div>
              </div>
            </div>

            {/* Energy arrow */}
            <div className="flex flex-col items-center flex-shrink-0 px-1">
              <span className="text-xs text-amber-500 animate-pulse font-black">➔ ⚡ ➔</span>
              <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 tracking-wider">EVOLVED</span>
            </div>

            {/* New Boss */}
            <div className="flex items-center gap-2 min-w-0 text-right justify-end">
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold text-amber-500 dark:text-amber-400">
                  Lv.{evolutionState.newLevel} (NEW!)
                </div>
                <div className="text-xs font-black truncate text-amber-600 dark:text-amber-300">
                  {evolutionState.newBoss.name}
                </div>
              </div>
              <span className="text-2xl filter drop-shadow-md flex-shrink-0 animate-bounce">
                {evolutionState.newBoss.icon}
              </span>
            </div>
          </div>

          {/* Evolution Rewards & Stat Boost */}
          <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] font-black relative z-10 flex-wrap">
            <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <span>❤️</span>
              <span>{lang === "th" ? "HP บอส +45% (แข็งแกร่งขึ้น!)" : "Boss HP +45% (Stronger!)"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Award size={11} className="text-purple-500" />
              <span>+{evolutionState.xpGained} Boss EXP Earned!</span>
            </span>
          </div>
        </div>
      )}

      {/* Top Header: Boss Avatar, Name, Level, Scalable Combo Badge & HP */}
      <div className="flex justify-between items-center mb-3.5 relative z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`relative flex-shrink-0 transition-all ${
              evolutionState?.active
                ? "boss-evolution-avatar-morph z-20"
                : isRageMode
                ? "boss-breathing-rapid"
                : "boss-breathing-normal"
            }`}
          >
            {/* Evolution shockwaves and aura rings */}
            {evolutionState?.active && (
              <>
                <div className="absolute -inset-2 rounded-2xl border-2 border-amber-400 boss-evolution-ring-1 pointer-events-none" />
                <div className="absolute -inset-2 rounded-2xl border-2 border-rose-500 boss-evolution-ring-2 pointer-events-none" />
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 rounded-full blur-md opacity-80 boss-evolution-aura pointer-events-none" />
              </>
            )}

            <Icon3D
              icon={currentBoss.icon}
              color={evolutionState?.active ? "amber" : "ruby"}
              size="lg"
              shape="squircle"
              glow
            />
            {isRageMode && (
              <span
                className="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none"
                title={lang === "th" ? "บอสเข้าสู่โหมดคลั่ง!" : "Boss Rage Mode!"}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-white shadow-md"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                {currentBoss.name}
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #EF4444, #991B1B)",
                  boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)",
                  borderTop: "1px solid rgba(255,255,255,0.5)",
                }}
                className={`text-[10px] font-black text-white px-2.5 py-0.5 rounded-full transition-transform ${
                  evolutionState?.active ? "scale-110 ring-2 ring-amber-400 animate-bounce" : ""
                }`}
              >
                Lv.{bossLevel}
              </span>

              {/* Evolution Preview / Replay Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIdx = Math.max(0, Math.min(bossLevel - 1, BOSS_LIST.length - 1));
                  const nextIdx = Math.min(bossLevel, BOSS_LIST.length - 1);
                  const gained = 200 + (bossLevel - 1) * 50;
                  setEvolutionState({
                    active: true,
                    oldBoss: BOSS_LIST[currentIdx],
                    newBoss: BOSS_LIST[nextIdx],
                    oldLevel: bossLevel,
                    newLevel: bossLevel + 1,
                    xpGained: gained,
                  });
                  setRecentXpGain(gained);
                  setTimeout(() => setRecentXpGain(null), 3800);
                  if (sfxEnabled) {
                    playSound("levelup", sfxEnabled, soundSet);
                  }
                  setTimeout(() => setEvolutionState(null), 4200);
                }}
                title={lang === "th" ? "ดูแอนิเมชันวิวัฒนาการร่างใหม่" : "Preview Boss Level Up & Evolution"}
                className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1 cursor-pointer select-none"
              >
                <Sparkles size={9} className="text-amber-500" />
                <span>{lang === "th" ? "วิวัฒนาการ" : "Evolution"}</span>
              </button>

              {/* Scalable Intensity Combo Counter Badge */}
              {tier === 4 ? (
                // Tier 4: Godlike / Mythic (14+ Days)
                <span
                  style={{
                    background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 45%, #7C3AED 100%)",
                    boxShadow: "0 0 14px rgba(245, 158, 11, 0.8), 0 0 24px rgba(225, 29, 72, 0.5)",
                    border: "1.5px solid rgba(253, 224, 71, 0.9)",
                  }}
                  className="combo-badge-tier4 text-[10px] font-black text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-default select-none shadow-sm"
                  title={
                    lang === "th"
                      ? `คอมโบระดับพระเจ้า! ${streak} วันต่อเนื่อง (+${bonusPercent}% ดาเมจ)`
                      : `Godlike Combo! ${streak} Days (+${bonusPercent}% DMG)`
                  }
                >
                  <span className="text-xs">👑</span>
                  <span>{streak}x COMBO</span>
                  <span className="text-[9px] bg-white/25 px-1 rounded font-black text-amber-100">
                    +{bonusPercent}%
                  </span>
                </span>
              ) : tier === 3 ? (
                // Tier 3: Supernova / Overdrive (7-13 Days)
                <span
                  style={{
                    background: "linear-gradient(135deg, #EF4444 0%, #A855F7 100%)",
                    boxShadow: "0 0 12px rgba(239, 68, 68, 0.65), 0 0 16px rgba(168, 85, 247, 0.45)",
                    border: "1.5px solid rgba(255, 255, 255, 0.6)",
                  }}
                  className="combo-badge-tier3 text-[10px] font-black text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-default select-none"
                  title={
                    lang === "th"
                      ? `อัลตร้าคอมโบ! ${streak} วันต่อเนื่อง (+${bonusPercent}% ดาเมจ)`
                      : `Ultra Combo! ${streak} Days (+${bonusPercent}% DMG)`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>💥 {streak}x COMBO</span>
                  <span className="text-[9px] bg-white/25 px-1 rounded font-black text-purple-100">
                    +{bonusPercent}%
                  </span>
                </span>
              ) : tier === 2 ? (
                // Tier 2: Blazing Flame (3-6 Days)
                <span
                  style={{
                    background: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
                    boxShadow: "0 2px 10px rgba(249, 115, 22, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  }}
                  className="combo-badge-tier2 text-[10px] font-black text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-default select-none"
                  title={
                    lang === "th"
                      ? `คอมโบติดไฟ! ${streak} วันต่อเนื่อง (+${bonusPercent}% ดาเมจ)`
                      : `Blazing Combo! ${streak} Days (+${bonusPercent}% DMG)`
                  }
                >
                  <Flame size={11} className="text-amber-200 fill-amber-300" />
                  <span>{streak}x COMBO</span>
                  <span className="text-[9px] bg-white/20 px-1 rounded font-bold text-amber-100">
                    +{bonusPercent}%
                  </span>
                </span>
              ) : tier === 1 ? (
                // Tier 1: Spark / Bronze (1-2 Days)
                <span
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)"
                      : "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                    border: "1px solid rgba(245, 158, 11, 0.5)",
                    color: isDarkMode ? "#FCD34D" : "#B45309",
                  }}
                  className="combo-badge-tier1 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 cursor-default select-none shadow-xs"
                  title={
                    lang === "th"
                      ? `คอมโบเริ่มต้น: ${streak} วันต่อเนื่อง (+${bonusPercent}% ดาเมจ)`
                      : `Spark Combo: ${streak} Days (+${bonusPercent}% DMG)`
                  }
                >
                  <span>⚡ {streak}x COMBO</span>
                  <span className="text-[9px] opacity-90 font-bold">+{bonusPercent}%</span>
                </span>
              ) : (
                // Tier 0: Combo Ready (0 Days)
                <span
                  style={{
                    background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border: `1px solid ${t.NEUTRAL_BORDER}`,
                    color: t.TEXT_MUTED,
                  }}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-default select-none"
                  title={
                    lang === "th"
                      ? "เช็คอินนิสัยเพื่อเริ่มสะสมคอมโบตัวคูณโบนัสดาเมจ!"
                      : "Check habits to activate Combo Multiplier bonus DMG!"
                  }
                >
                  <span>⚡ {lang === "th" ? "คอมโบ x1.0" : "Combo x1.0"}</span>
                </span>
              )}

              {isRageMode && (
                <span className="text-[9px] font-black text-white bg-gradient-to-r from-red-600 to-rose-600 border border-red-400/50 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  🔥 {lang === "th" ? "โหมดคลั่ง (<20%)" : "RAGE MODE (<20%)"}
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-500 line-clamp-1 max-w-[200px] mt-0.5">
              {currentBoss.desc}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="text-right">
            <div className="text-xl font-black leading-none tracking-tight" style={{ color: t.BAD_COLOR }}>
              {bossHp}
            </div>
            <div className="text-[10px] font-extrabold text-slate-400">/ {bossMaxHp} HP</div>
          </div>

          {/* Collapse Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(false);
            }}
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              color: t.TEXT_MAIN,
              border: `1px solid ${t.NEUTRAL_BORDER}`,
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all cursor-pointer shadow-xs"
            title={lang === "th" ? "ย่อเก็บบอส" : "Collapse Boss"}
          >
            <ChevronUp size={15} />
            <span>{lang === "th" ? "ย่อเก็บ" : "Collapse"}</span>
          </button>
        </div>
      </div>

      {/* Combo Multiplier Tracker Banner */}
      <div
        style={{
          background: isDarkMode
            ? tier === 0
              ? "rgba(255, 255, 255, 0.03)"
              : tier === 1
              ? "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)"
              : tier === 2
              ? "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.12) 100%)"
              : tier === 3
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(168, 85, 247, 0.15) 100%)"
              : "linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(225, 29, 72, 0.18) 50%, rgba(124, 58, 237, 0.2) 100%)"
            : tier === 0
            ? "rgba(0, 0, 0, 0.02)"
            : tier === 1
            ? "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)"
            : tier === 2
            ? "linear-gradient(135deg, #FFF7ED 0%, #FFE4E6 100%)"
            : tier === 3
            ? "linear-gradient(135deg, #FFF1F2 0%, #F5F3FF 100%)"
            : "linear-gradient(135deg, #FEF3C7 0%, #FFE4E6 50%, #F3E8FF 100%)",
          border: isDarkMode
            ? tier === 0
              ? `1px solid ${t.NEUTRAL_BORDER}`
              : tier === 1
              ? "1.5px solid rgba(245, 158, 11, 0.35)"
              : tier === 2
              ? "1.5px solid rgba(249, 115, 22, 0.45)"
              : tier === 3
              ? "1.5px solid rgba(239, 68, 68, 0.55)"
              : "2px solid rgba(251, 191, 36, 0.75)"
            : tier === 0
            ? `1px solid ${t.NEUTRAL_BORDER}`
            : tier === 1
            ? "1.5px solid #FCD34D"
            : tier === 2
            ? "1.5px solid #FDBA74"
            : tier === 3
            ? "1.5px solid #FDA4AF"
            : "2px solid #FDE047",
          borderRadius: 18,
        }}
        className="mb-3 px-3 py-2 flex items-center justify-between gap-2 shadow-xs relative overflow-hidden transition-all"
      >
        {/* Ambient lighting accent for higher tiers */}
        {tier >= 2 && (
          <div
            className={`absolute -right-4 -bottom-4 w-14 h-14 rounded-full blur-xl pointer-events-none ${
              tier === 2 ? "bg-orange-500/20" : tier === 3 ? "bg-rose-500/25" : "bg-amber-400/30"
            }`}
          />
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            style={{
              background:
                tier === 0
                  ? "rgba(148, 163, 184, 0.15)"
                  : tier === 1
                  ? "rgba(245, 158, 11, 0.2)"
                  : tier === 2
                  ? "rgba(249, 115, 22, 0.25)"
                  : tier === 3
                  ? "rgba(239, 68, 68, 0.25)"
                  : "linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(225, 29, 72, 0.35))",
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 shadow-inner"
          >
            {tier === 4 ? "👑" : tier === 3 ? "💥" : tier === 2 ? "🔥" : tier === 1 ? "⚡" : "✨"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                style={{
                  color:
                    tier === 0
                      ? "#64748B"
                      : tier === 1
                      ? "#D97706"
                      : tier === 2
                      ? "#EA580C"
                      : tier === 3
                      ? "#E11D48"
                      : "#B45309",
                }}
              >
                <Flame size={11} className={tier >= 2 ? "animate-pulse text-amber-500" : "text-amber-500"} />
                {lang === "th" ? "คอมโบคูณดาเมจต่อเนื่อง" : "Combo Multiplier"}
              </span>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  background:
                    tier === 0
                      ? "rgba(148,163,184,0.15)"
                      : tier === 1
                      ? "rgba(245,158,11,0.2)"
                      : tier === 2
                      ? "rgba(249,115,22,0.2)"
                      : tier === 3
                      ? "rgba(239,68,68,0.2)"
                      : "rgba(245,158,11,0.3)",
                  color:
                    tier === 0
                      ? "#64748B"
                      : tier === 1
                      ? "#B45309"
                      : tier === 2
                      ? "#C2410C"
                      : tier === 3
                      ? "#BE123C"
                      : "#92400E",
                }}
              >
                {streak > 0
                  ? lang === "th"
                    ? `${streak} วันต่อเนื่อง`
                    : `${streak} Day Streak`
                  : lang === "th"
                  ? "เริ่มสะสมวันนี้"
                  : "Start Today"}
              </span>
            </div>
            <div className="text-xs font-black truncate mt-0.5" style={{ color: t.TEXT_MAIN }}>
              {streak > 0
                ? lang === "th"
                  ? `+${bonusPercent}% โบนัสดาเมจทุกนิสัยที่เช็คสำเร็จ`
                  : `+${bonusPercent}% bonus DMG on every habit checked`
                : lang === "th"
                ? "เช็คอินนิสัยทุกวันติดต่อกันเพื่อเพิ่มโบนัสดาเมจบอส"
                : "Check habits consecutively to increase boss bonus DMG"}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap shadow-xs ${
              tier >= 3 ? "text-white animate-pulse" : tier >= 2 ? "text-white" : "text-amber-700 dark:text-amber-300"
            }`}
            style={{
              background:
                tier >= 4
                  ? "linear-gradient(135deg, #F59E0B, #EF4444 50%, #7C3AED)"
                  : tier === 3
                  ? "linear-gradient(135deg, #EF4444, #9333EA)"
                  : tier === 2
                  ? "linear-gradient(135deg, #F97316, #EF4444)"
                  : tier === 1
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(148, 163, 184, 0.2)",
              border: tier >= 2 ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(245,158,11,0.3)",
            }}
          >
            ⚡ {activeMultiplier.toFixed(1)}x DMG
          </span>
        </div>
      </div>

      {/* Boss Weakness Indicator */}
      {bossWeakness && (
        <div
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(225, 29, 72, 0.14) 100%)"
              : "linear-gradient(135deg, #FFFBEB 0%, #FFF1F2 100%)",
            border: isDarkMode
              ? "1.5px solid rgba(245, 158, 11, 0.35)"
              : "1.5px solid #FCD34D",
            borderRadius: 18,
          }}
          className="mb-3 px-3 py-2 flex items-center justify-between gap-2 shadow-sm relative overflow-hidden transition-all"
        >
          {/* Subtle glow accent */}
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-amber-400/15 rounded-full blur-lg pointer-events-none" />

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 dark:text-amber-400 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
              {bossWeakness.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Target size={11} className="text-amber-500 flex-shrink-0" />
                  {lang === "th" ? "จุดอ่อนบอส" : "Boss Weakness"}
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                  +{bossWeakness.bonusPoints} {lang === "th" ? "แต้มโบนัส" : "Bonus Pts"}
                </span>
              </div>
              <div className="text-xs font-black truncate mt-0.5" style={{ color: t.TEXT_MAIN }}>
                {lang === "th" ? `แพ้ทาง: ${bossWeakness.nameTh}` : `Weak to ${bossWeakness.nameEn}`}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap shadow-xs">
              ⚡ {bossWeakness.damageMultiplier}x DMG
            </span>
          </div>
        </div>
      )}

      {/* HP Bar */}
      <div
        style={{ background: t.NEUTRAL_BORDER }}
        className="h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner"
      >
        <div
          style={{ width: `${hpPercent}%` }}
          className={`h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-700 rounded-full transition-all duration-500 ease-out shadow-[0_1px_3px_rgba(225,29,72,0.4)] ${
            isRageMode ? "animate-pulse" : ""
          }`}
        />
      </div>

      {/* Visual Boss Experience (Boss XP) Bar */}
      <div
        style={{
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.09) 0%, rgba(139, 92, 246, 0.07) 100%)"
            : "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)",
          border: isDarkMode
            ? "1.5px solid rgba(139, 92, 246, 0.35)"
            : "1.5px solid #DDD6FE",
          borderRadius: 20,
        }}
        className="mt-3.5 p-3 relative overflow-hidden shadow-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        {/* XP Bar Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                boxShadow: "0 2px 6px rgba(124, 58, 237, 0.35)",
              }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            >
              <Award size={13} className="text-white" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                {lang === "th" ? "EXP ล่าบอส" : "Boss Experience"}
              </span>

              {/* Hunter Rank Badge */}
              <span
                style={{
                  background:
                    hunterInfo.rank >= 5
                      ? "linear-gradient(135deg, #D97706, #DC2626)"
                      : hunterInfo.rank >= 3
                      ? "linear-gradient(135deg, #7C3AED, #6366F1)"
                      : "linear-gradient(135deg, #059669, #0284C7)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
                className="text-[9px] font-black text-white px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1"
              >
                <span>🎖️</span>
                <span>{lang === "th" ? `แรงค์ ${hunterInfo.rank}` : `Rank ${hunterInfo.rank}`}</span>
                <span className="opacity-90 font-bold">· {hunterInfo.rankTitle}</span>
              </span>
            </div>
          </div>

          {/* XP Numbers & Gain Notification */}
          <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
            {recentXpGain && (
              <span className="boss-xp-gain-bubble text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles size={9} />
                +{recentXpGain} EXP!
              </span>
            )}
            <span className="text-[11px] font-black text-purple-950 dark:text-purple-200">
              {hunterInfo.currentXpInRank}
              <span className="text-[10px] text-slate-400 font-bold"> / {hunterInfo.xpRequired} XP</span>
            </span>
            <span
              style={{
                background: "rgba(139, 92, 246, 0.15)",
                color: isDarkMode ? "#C4B5FD" : "#6D28D9",
              }}
              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
            >
              {Math.round(hunterInfo.progress)}%
            </span>
          </div>
        </div>

        {/* The XP Track and Fill Bar */}
        <div
          style={{ background: isDarkMode ? "rgba(0, 0, 0, 0.35)" : "#E2E8F0" }}
          className="h-2.5 rounded-full overflow-hidden p-0.5 relative shadow-inner"
        >
          <div
            style={{ width: `${hunterInfo.progress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-[0_1px_4px_rgba(99,102,241,0.5)]"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent w-full boss-xp-shimmer pointer-events-none" />
          </div>
        </div>

        {/* XP Details Subtext */}
        <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span>⭐</span>
            <span>
              {lang === "th"
                ? `ปราบบอสรับ +${200 + (bossLevel - 1) * 50} EXP`
                : `Defeat boss to gain +${200 + (bossLevel - 1) * 50} EXP`}
            </span>
          </span>
          <span>
            {lang === "th"
              ? `💀 สยบบอสไปแล้ว ${Math.max(0, bossLevel - 1)} ตัว (รวม ${bossXp} EXP)`
              : `💀 Defeated: ${Math.max(0, bossLevel - 1)} (Total: ${bossXp} EXP)`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2.5 text-[10px] font-extrabold text-slate-400 flex-wrap gap-2">
        <span className="flex items-center gap-1">
          <ThreeDZap size={14} />
          <span>{lang === "th" ? "นิสัยเชิงบวกทำดาเมจใส่บอส" : "Positive habits deal boss damage"}</span>
        </span>
        <div className="flex items-center gap-3">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onOpenBossList();
            }}
            className="text-rose-500 font-black hover:underline cursor-pointer"
          >
            {lang === "th" ? "ดูสารานุกรมมอนสเตอร์ 📖" : "View Encyclopedia 📖"}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(false);
            }}
            className="text-slate-400 hover:text-rose-500 font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <ChevronUp size={13} />
            <span>{lang === "th" ? "ย่อเก็บ" : "Collapse"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
