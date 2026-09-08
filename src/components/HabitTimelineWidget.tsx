import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sun,
  CloudSun,
  Moon,
  CheckCircle2,
  Edit3,
  Layers,
  X,
  Flame,
  Target,
  ArrowRight,
} from "lucide-react";
import { PositiveHabit, DayLog } from "../types";
import { DAILY_QUESTS_POOL } from "../data/constants";

export interface HabitTimelineWidgetProps {
  day: DayLog;
  positiveHabits: PositiveHabit[];
  onToggleHabit: (habitId: string) => void;
  onUpdateCompletedTime: (habitId: string, newTime: string) => void;
  isDarkMode: boolean;
  t: {
    CARD: string;
    BG: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    GOOD_COLOR: string;
    GOOD_BG: string;
    ACCENT: string;
    ACCENT_BG?: string;
  };
  lang: "th" | "en";
  dailyQuests?: { date: string; ids: string[]; claimed: string[] };
}

// Icon mappings for default and common habits
const HABIT_ICONS: Record<string, string> = {
  water: "💧",
  exercise: "🏃",
  read: "📖",
  meditate: "🧘",
  todolist: "📝",
  work: "💻",
  cleanEating: "🥗",
  cook: "🍳",
  language: "🗣️",
  podcast: "🎧",
  walk: "🚶",
  tidyRoom: "🧹",
  laundry: "🧺",
  organize: "🎒",
  expense: "💰",
  diary: "📔",
  sleepEarly: "🌙",
};

const HABIT_EN_LABELS: Record<string, string> = {
  read: "Read Books",
  exercise: "Morning Workout",
  water: "Drink 1-2 Glasses of Water",
  meditate: "Meditate 5-10 Mins",
  todolist: "Plan Daily To-do List",
  work: "Deep Focus Work",
  cleanEating: "Healthy Clean Eating",
  cook: "Cook Homemade Meal",
  language: "Language Practice",
  podcast: "Listen to Self-growth Podcast",
  walk: "Walk 8,000 Steps",
  tidyRoom: "Tidy Up Room / Desk",
  laundry: "Do Laundry",
  organize: "Prepare for Tomorrow",
  expense: "Record Daily Expenses",
  diary: "Write Daily Reflection",
  sleepEarly: "Sleep Before Midnight",
};

// Default planned time for habits if not completed yet
const DEFAULT_PLANNED_TIMES: Record<string, string> = {
  water: "07:00",
  exercise: "07:30",
  meditate: "08:00",
  read: "08:30",
  todolist: "09:00",
  work: "10:30",
  cleanEating: "12:30",
  cook: "13:00",
  walk: "15:00",
  language: "16:30",
  podcast: "17:30",
  tidyRoom: "19:00",
  laundry: "19:30",
  organize: "20:30",
  expense: "21:00",
  diary: "21:30",
  sleepEarly: "22:30",
};

function getTimeCategory(timeStr: string): "morning" | "day" | "evening" {
  const [h] = timeStr.split(":").map(Number);
  if (isNaN(h)) return "morning";
  if (h < 12) return "morning";
  if (h < 18) return "day";
  return "evening";
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = (timeStr || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const HabitTimelineWidget: React.FC<HabitTimelineWidgetProps> = ({
  day,
  positiveHabits,
  onToggleHabit,
  onUpdateCompletedTime,
  isDarkMode,
  t,
  lang,
  dailyQuests,
}) => {
  // Collapsed by default ("จะเห็นแค่นี้"), expanding shows the 3 missions ("กด เข้าไปถึงจะเห็นภาระกิจ3อย่าง")
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("habit_timeline_expanded_v2");
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [selectedMission, setSelectedMission] = useState<
    "all" | "morning" | "day" | "evening" | "quests"
  >("all");

  const [viewMode, setViewMode] = useState<"completed" | "full">("completed");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (expand?: boolean) => {
    setIsExpanded((prev) => {
      const next = expand !== undefined ? expand : !prev;
      try {
        localStorage.setItem("habit_timeline_expanded_v2", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keep track of current real time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const str = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      setCurrentTimeStr(str);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const completedMap = day.positives || {};
  const recordedTimes = day.completedTimes || {};

  // Build list of timeline habit items
  const timelineItems = useMemo(() => {
    return positiveHabits.map((habit) => {
      const isCompleted = !!completedMap[habit.id];
      let time = recordedTimes[habit.id];

      if (!time) {
        if (isCompleted) {
          time =
            habit.time === "morning"
              ? "08:15"
              : habit.time === "day"
              ? "13:30"
              : "20:30";
        } else {
          time =
            DEFAULT_PLANNED_TIMES[habit.id] ||
            (habit.time === "morning"
              ? "08:00"
              : habit.time === "day"
              ? "13:00"
              : "20:00");
        }
      }

      const minutes = parseTimeToMinutes(time);
      const category = getTimeCategory(time);
      const icon =
        HABIT_ICONS[habit.id] ||
        (habit.time === "morning" ? "🌅" : habit.time === "day" ? "☀️" : "🌙");
      const label =
        lang === "en" && HABIT_EN_LABELS[habit.id]
          ? HABIT_EN_LABELS[habit.id]
          : habit.label;

      return {
        habit,
        isCompleted,
        time,
        minutes,
        category,
        icon,
        label,
      };
    });
  }, [positiveHabits, completedMap, recordedTimes, lang]);

  // The 3 Mission Categories (เช้า / กลางวัน / เย็น)
  const morningHabits = useMemo(
    () => timelineItems.filter((i) => i.habit.time === "morning"),
    [timelineItems]
  );
  const dayHabits = useMemo(
    () => timelineItems.filter((i) => i.habit.time === "day"),
    [timelineItems]
  );
  const eveningHabits = useMemo(
    () => timelineItems.filter((i) => i.habit.time === "evening"),
    [timelineItems]
  );

  const morningDone = morningHabits.filter((i) => i.isCompleted).length;
  const dayDone = dayHabits.filter((i) => i.isCompleted).length;
  const eveningDone = eveningHabits.filter((i) => i.isCompleted).length;

  const completedCount = timelineItems.filter((i) => i.isCompleted).length;
  const totalCount = timelineItems.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Quests summary if available
  const questItems = useMemo(() => {
    if (!dailyQuests || !dailyQuests.ids) return [];
    return dailyQuests.ids
      .map((id) => DAILY_QUESTS_POOL.find((q) => q.id === id))
      .filter(Boolean);
  }, [dailyQuests]);

  const questsDoneCount = useMemo(() => {
    if (!dailyQuests) return 0;
    return questItems.filter(
      (q) => q && (q.check(day) || dailyQuests.claimed.includes(q.id))
    ).length;
  }, [questItems, day, dailyQuests]);

  // Filter items according to active mission tab & view mode
  const displayedItems = useMemo(() => {
    let items = timelineItems;
    if (selectedMission === "morning") {
      items = morningHabits;
    } else if (selectedMission === "day") {
      items = dayHabits;
    } else if (selectedMission === "evening") {
      items = eveningHabits;
    }

    if (viewMode === "completed") {
      return items.filter((item) => item.isCompleted);
    }
    return [...items].sort((a, b) => a.minutes - b.minutes);
  }, [timelineItems, selectedMission, morningHabits, dayHabits, eveningHabits, viewMode]);

  const completedList = useMemo(() => {
    return timelineItems
      .filter((i) => i.isCompleted)
      .sort((a, b) => a.minutes - b.minutes);
  }, [timelineItems]);

  const earliestTime = completedList[0]?.time;
  const latestTime = completedList[completedList.length - 1]?.time;

  let routineRhythmLabel = "";
  if (completedCount === 0) {
    routineRhythmLabel = lang === "th" ? "ยังไม่ได้เริ่มกิจวัตร" : "Routine Not Started";
  } else if (morningDone >= dayDone && morningDone >= eveningDone && morningDone >= 2) {
    routineRhythmLabel = lang === "th" ? "เน้นช่วงเช้า (Morning 🌅)" : "Morning Loaded 🌅";
  } else if (eveningDone > morningDone && eveningDone > dayDone) {
    routineRhythmLabel = lang === "th" ? "เน้นช่วงค่ำ (Night 🌙)" : "Night Focused 🌙";
  } else if (dayDone >= morningDone && dayDone >= eveningDone && dayDone >= 2) {
    routineRhythmLabel = lang === "th" ? "เน้นกลางวัน (Midday ☀️)" : "Midday Power ☀️";
  } else {
    routineRhythmLabel = lang === "th" ? "สมดุลตลอดวัน (Balanced ⚖️)" : "Balanced Flow ⚖️";
  }

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleOpenEditTime = (habitId: string, currentTime: string) => {
    setEditingHabitId(habitId);
    setCustomTimeInput(currentTime);
  };

  const handleSaveCustomTime = () => {
    if (editingHabitId && customTimeInput) {
      onUpdateCompletedTime(editingHabitId, customTimeInput);
      setEditingHabitId(null);
    }
  };

  const currentMinutes = currentTimeStr ? parseTimeToMinutes(currentTimeStr) : 720;
  const dayMinutesPercent = Math.min(100, Math.max(0, (currentMinutes / 1440) * 100));

  // =========================================================================
  // 1. COLLAPSED VIEW ("จะเห็นแค่นี้" - COMPACT PREVIEW BANNER)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div
        style={{
          background: t.CARD,
          border: `1.5px solid ${
            isDarkMode ? "rgba(255,255,255,0.08)" : t.NEUTRAL_BORDER
          }`,
          borderRadius: 24,
          boxShadow: isDarkMode
            ? "0 6px 20px -8px rgba(0,0,0,0.4)"
            : "0 6px 18px -6px rgba(0,0,0,0.04)",
        }}
        className="p-3.5 sm:p-4 mb-5 relative overflow-hidden transition-all duration-300 hover:shadow-md group"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

        {/* Header Row: Title, Clock & Expand Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          {/* Title & Real-time pin */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => toggleExpand(true)}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                boxShadow: "0 2px 8px rgba(6, 182, 212, 0.3)",
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform"
            >
              <Clock size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="text-sm font-black tracking-tight flex items-center gap-1.5"
                  style={{ color: t.TEXT_MAIN }}
                >
                  <span>
                    {lang === "th" ? "ไทม์ไลน์กิจวัตรประจำวัน" : "Daily Routine Timeline"}
                  </span>
                </h3>
                <span
                  style={{
                    background: isDarkMode
                      ? "rgba(6, 182, 212, 0.15)"
                      : "rgba(6, 182, 212, 0.1)",
                    color: t.ACCENT,
                    border: `1px solid ${
                      isDarkMode ? "rgba(6, 182, 212, 0.3)" : "rgba(6, 182, 212, 0.2)"
                    }`,
                  }}
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  <span>{currentTimeStr || "--:--"}</span>
                  <span className="opacity-75">{lang === "th" ? "ขณะนี้" : "Now"}</span>
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {lang === "th"
                  ? "แตะเพื่อเปิดดูภารกิจ 3 ช่วงเวลา (เช้า • กลางวัน • เย็น)"
                  : "Tap to view 3 routine missions (Morning • Day • Evening)"}
              </p>
            </div>
          </div>

          {/* 3 Mission Summary Badges + Expand Button */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
            {/* Mission 1: Morning */}
            <button
              type="button"
              onClick={() => {
                setSelectedMission("morning");
                toggleExpand(true);
              }}
              className="px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
              title={lang === "th" ? "กดเพื่อดูภารกิจเช้า" : "Click for Morning Mission"}
            >
              <span>🌅 {lang === "th" ? "เช้า" : "Morn"}</span>
              <span className="font-mono font-black">
                {morningDone}/{morningHabits.length}
              </span>
            </button>

            {/* Mission 2: Midday */}
            <button
              type="button"
              onClick={() => {
                setSelectedMission("day");
                toggleExpand(true);
              }}
              className="px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 active:scale-95 transition-all cursor-pointer"
              title={lang === "th" ? "กดเพื่อดูภารกิจกลางวัน" : "Click for Midday Mission"}
            >
              <span>☀️ {lang === "th" ? "กลางวัน" : "Day"}</span>
              <span className="font-mono font-black">
                {dayDone}/{dayHabits.length}
              </span>
            </button>

            {/* Mission 3: Evening */}
            <button
              type="button"
              onClick={() => {
                setSelectedMission("evening");
                toggleExpand(true);
              }}
              className="px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 active:scale-95 transition-all cursor-pointer"
              title={lang === "th" ? "กดเพื่อดูภารกิจเย็น" : "Click for Evening Mission"}
            >
              <span>🌙 {lang === "th" ? "เย็น" : "Eve"}</span>
              <span className="font-mono font-black">
                {eveningDone}/{eveningHabits.length}
              </span>
            </button>

            {/* Open / Expand Button ("กด เข้าไปถึงจะเห็นภาระกิจ3อย่าง") */}
            <button
              type="button"
              onClick={() => toggleExpand(true)}
              style={{ background: t.ACCENT }}
              className="px-3 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-sm shadow-cyan-500/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{lang === "th" ? "ดูภารกิจ 3 อย่าง" : "3 Missions"}</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Compact Bottom Progress Strip */}
        <div
          onClick={() => toggleExpand(true)}
          className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/70 flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background:
                  "linear-gradient(90deg, #F59E0B 0%, #06B6D4 50%, #8B5CF6 100%)",
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 flex-shrink-0">
            <span>
              {completedCount}/{totalCount} {lang === "th" ? "สำเร็จ" : "Done"} (
              {progressPercent}%)
            </span>
            <span className="text-cyan-500 text-xs">▾</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW ("กด เข้าไปถึงจะเห็นภาระกิจ3อย่าง")
  // =========================================================================
  return (
    <div
      style={{
        background: t.CARD,
        border: `1.5px solid ${
          isDarkMode ? "rgba(255,255,255,0.08)" : t.NEUTRAL_BORDER
        }`,
        borderRadius: 28,
        boxShadow: isDarkMode
          ? "0 10px 30px -10px rgba(0,0,0,0.5)"
          : "0 10px 25px -5px rgba(0,0,0,0.04)",
      }}
      className="p-4 sm:p-5 mb-6 relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle background ambient blur */}
      <div className="absolute top-0 right-0 w-64 h-36 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Bar with Collapse Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            style={{
              background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
              boxShadow: "0 3px 10px rgba(6, 182, 212, 0.35)",
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
          >
            <Clock size={20} className="animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-base font-black tracking-tight"
                style={{ color: t.TEXT_MAIN }}
              >
                {lang === "th" ? "ไทม์ไลน์กิจวัตรประจำวัน" : "Daily Routine Timeline"}
              </h3>
              <span
                style={{
                  background: isDarkMode
                    ? "rgba(6, 182, 212, 0.15)"
                    : "rgba(6, 182, 212, 0.1)",
                  color: t.ACCENT,
                  border: `1px solid ${
                    isDarkMode ? "rgba(6, 182, 212, 0.3)" : "rgba(6, 182, 212, 0.25)"
                  }`,
                }}
                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span>{currentTimeStr || "--:--"}</span>
                <span className="opacity-75">{lang === "th" ? "ขณะนี้" : "Now"}</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {lang === "th"
                ? "ภารกิจ 3 ช่วงเวลา: เช้า • กลางวัน • เย็น จัดระเบียบชีวิตให้ต่อเนื่อง"
                : "3 Routine Missions: Morning • Day • Evening schedule overview"}
            </p>
          </div>
        </div>

        {/* View Mode & Collapse Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode Switcher: Done vs All */}
          <div
            style={{
              background: isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${t.NEUTRAL_BORDER}`,
            }}
            className="flex p-0.5 rounded-xl text-xs font-bold"
          >
            <button
              type="button"
              onClick={() => setViewMode("completed")}
              style={{
                background:
                  viewMode === "completed"
                    ? isDarkMode
                      ? "#1E293B"
                      : "#FFF"
                    : "transparent",
                color: viewMode === "completed" ? t.TEXT_MAIN : t.TEXT_MUTED,
                boxShadow:
                  viewMode === "completed" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
              className="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>
                {lang === "th"
                  ? `ทำแล้ว (${completedCount})`
                  : `Done (${completedCount})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("full")}
              style={{
                background:
                  viewMode === "full"
                    ? isDarkMode
                      ? "#1E293B"
                      : "#FFF"
                    : "transparent",
                color: viewMode === "full" ? t.TEXT_MAIN : t.TEXT_MUTED,
                boxShadow:
                  viewMode === "full" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
              className="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Layers size={13} className="text-cyan-500" />
              <span>{lang === "th" ? "ทั้งวัน" : "All Day"}</span>
            </button>
          </div>

          {/* Collapse Button to fold back to "เห็นแค่นี้" */}
          <button
            type="button"
            onClick={() => toggleExpand(false)}
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
              color: t.TEXT_MAIN,
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all cursor-pointer"
            title={lang === "th" ? "ย่อเก็บไทม์ไลน์" : "Collapse Timeline"}
          >
            <ChevronUp size={15} />
            <span>{lang === "th" ? "ย่อเก็บ" : "Collapse"}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3 MISSIONS NAVIGATION TABS ("ภารกิจ 3 อย่าง") */}
      {/* ===================================================================== */}
      <div className="mb-4">
        <div
          style={{
            background: isDarkMode ? "rgba(0,0,0,0.25)" : "#F1F5F9",
            borderRadius: 20,
            padding: 4,
          }}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        >
          {/* Tab 0: All Missions */}
          <button
            type="button"
            onClick={() => setSelectedMission("all")}
            style={{
              background:
                selectedMission === "all"
                  ? isDarkMode
                    ? "#1E293B"
                    : "#FFF"
                  : "transparent",
              color: selectedMission === "all" ? t.TEXT_MAIN : t.TEXT_MUTED,
              boxShadow:
                selectedMission === "all" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
          >
            <Sparkles size={13} className="text-cyan-500" />
            <span>{lang === "th" ? "✨ ทั้ง 3 ภารกิจ" : "✨ All 3 Missions"}</span>
            <span className="text-[11px] opacity-70">
              ({completedCount}/{totalCount})
            </span>
          </button>

          {/* Tab 1: Morning Mission */}
          <button
            type="button"
            onClick={() => setSelectedMission("morning")}
            style={{
              background:
                selectedMission === "morning"
                  ? isDarkMode
                    ? "#1E293B"
                    : "#FFF"
                  : "transparent",
              color:
                selectedMission === "morning"
                  ? "#F59E0B"
                  : isDarkMode
                  ? "#94A3B8"
                  : "#64748B",
              boxShadow:
                selectedMission === "morning" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
          >
            <Sun size={13} className="text-amber-500" />
            <span>{lang === "th" ? "🌅 ภารกิจเช้า" : "🌅 Morning"}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                morningDone === morningHabits.length && morningHabits.length > 0
                  ? "bg-emerald-500/20 text-emerald-500 font-extrabold"
                  : "opacity-75"
              }`}
            >
              {morningDone}/{morningHabits.length}
            </span>
          </button>

          {/* Tab 2: Midday Mission */}
          <button
            type="button"
            onClick={() => setSelectedMission("day")}
            style={{
              background:
                selectedMission === "day"
                  ? isDarkMode
                    ? "#1E293B"
                    : "#FFF"
                  : "transparent",
              color:
                selectedMission === "day"
                  ? "#06B6D4"
                  : isDarkMode
                  ? "#94A3B8"
                  : "#64748B",
              boxShadow:
                selectedMission === "day" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
          >
            <CloudSun size={13} className="text-sky-500" />
            <span>{lang === "th" ? "☀️ ภารกิจกลางวัน" : "☀️ Midday"}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                dayDone === dayHabits.length && dayHabits.length > 0
                  ? "bg-emerald-500/20 text-emerald-500 font-extrabold"
                  : "opacity-75"
              }`}
            >
              {dayDone}/{dayHabits.length}
            </span>
          </button>

          {/* Tab 3: Evening Mission */}
          <button
            type="button"
            onClick={() => setSelectedMission("evening")}
            style={{
              background:
                selectedMission === "evening"
                  ? isDarkMode
                    ? "#1E293B"
                    : "#FFF"
                  : "transparent",
              color:
                selectedMission === "evening"
                  ? "#8B5CF6"
                  : isDarkMode
                  ? "#94A3B8"
                  : "#64748B",
              boxShadow:
                selectedMission === "evening" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
          >
            <Moon size={13} className="text-purple-500" />
            <span>{lang === "th" ? "🌙 ภารกิจเย็น" : "🌙 Evening"}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                eveningDone === eveningHabits.length && eveningHabits.length > 0
                  ? "bg-emerald-500/20 text-emerald-500 font-extrabold"
                  : "opacity-75"
              }`}
            >
              {eveningDone}/{eveningHabits.length}
            </span>
          </button>

          {/* Optional Tab 4: 3 Daily Quests */}
          {dailyQuests && questItems.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedMission("quests")}
              style={{
                background:
                  selectedMission === "quests"
                    ? isDarkMode
                      ? "#1E293B"
                      : "#FFF"
                    : "transparent",
                color:
                  selectedMission === "quests"
                    ? "#EC4899"
                    : isDarkMode
                    ? "#94A3B8"
                    : "#64748B",
                boxShadow:
                  selectedMission === "quests"
                    ? "0 2px 6px rgba(0,0,0,0.08)"
                    : "none",
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
            >
              <Target size={13} className="text-pink-500" />
              <span>{lang === "th" ? "🎯 3 เควสต์ประจำวัน" : "🎯 3 Quests"}</span>
              <span className="text-[10px] opacity-75">
                ({questsDoneCount}/{questItems.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3 MISSION CARDS OVERVIEW (Shown when "All 3 Missions" tab is active) */}
      {/* ===================================================================== */}
      {selectedMission === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Mission 1: Morning Card */}
          <div
            onClick={() => setSelectedMission("morning")}
            style={{
              background: isDarkMode ? "rgba(245, 158, 11, 0.08)" : "#FFFBEB",
              border: `1.5px solid ${
                isDarkMode ? "rgba(245, 158, 11, 0.25)" : "#FDE68A"
              }`,
              borderRadius: 20,
            }}
            className="p-3.5 cursor-pointer hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌅</span>
                <div>
                  <h4 className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {lang === "th" ? "ภารกิจช่วงเช้า" : "Morning Mission"}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">06:00 - 12:00</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-lg">
                {morningDone}/{morningHabits.length}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-amber-500/20 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{
                  width: `${
                    morningHabits.length > 0
                      ? Math.round((morningDone / morningHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>
                {morningDone === morningHabits.length && morningHabits.length > 0
                  ? lang === "th"
                    ? "✨ สำเร็จครบแล้ว!"
                    : "✨ All Completed!"
                  : lang === "th"
                  ? `เหลืออีก ${morningHabits.length - morningDone} อย่าง`
                  : `${morningHabits.length - morningDone} remaining`}
              </span>
              <span className="text-amber-500 text-xs font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === "th" ? "ดูรายการ" : "View"}</span>
                <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* Mission 2: Midday Card */}
          <div
            onClick={() => setSelectedMission("day")}
            style={{
              background: isDarkMode ? "rgba(6, 182, 212, 0.08)" : "#F0FDFA",
              border: `1.5px solid ${
                isDarkMode ? "rgba(6, 182, 212, 0.25)" : "#A5F3FC"
              }`,
              borderRadius: 20,
            }}
            className="p-3.5 cursor-pointer hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">☀️</span>
                <div>
                  <h4 className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                    {lang === "th" ? "ภารกิจช่วงกลางวัน" : "Midday Mission"}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">12:00 - 18:00</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-lg">
                {dayDone}/{dayHabits.length}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-cyan-500/20 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                style={{
                  width: `${
                    dayHabits.length > 0
                      ? Math.round((dayDone / dayHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>
                {dayDone === dayHabits.length && dayHabits.length > 0
                  ? lang === "th"
                    ? "✨ สำเร็จครบแล้ว!"
                    : "✨ All Completed!"
                  : lang === "th"
                  ? `เหลืออีก ${dayHabits.length - dayDone} อย่าง`
                  : `${dayHabits.length - dayDone} remaining`}
              </span>
              <span className="text-cyan-500 text-xs font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === "th" ? "ดูรายการ" : "View"}</span>
                <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* Mission 3: Evening Card */}
          <div
            onClick={() => setSelectedMission("evening")}
            style={{
              background: isDarkMode ? "rgba(139, 92, 246, 0.08)" : "#FAF5FF",
              border: `1.5px solid ${
                isDarkMode ? "rgba(139, 92, 246, 0.25)" : "#E9D5FF"
              }`,
              borderRadius: 20,
            }}
            className="p-3.5 cursor-pointer hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌙</span>
                <div>
                  <h4 className="text-xs font-black text-purple-600 dark:text-purple-400">
                    {lang === "th" ? "ภารกิจช่วงเย็น/ค่ำ" : "Evening Mission"}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">18:00 - 24:00</span>
                </div>
              </div>
              <span className="text-xs font-black font-mono text-purple-600 dark:text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-lg">
                {eveningDone}/{eveningHabits.length}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-purple-500/20 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-300"
                style={{
                  width: `${
                    eveningHabits.length > 0
                      ? Math.round((eveningDone / eveningHabits.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>
                {eveningDone === eveningHabits.length && eveningHabits.length > 0
                  ? lang === "th"
                    ? "✨ สำเร็จครบแล้ว!"
                    : "✨ All Completed!"
                  : lang === "th"
                  ? `เหลืออีก ${eveningHabits.length - eveningDone} อย่าง`
                  : `${eveningHabits.length - eveningDone} remaining`}
              </span>
              <span className="text-purple-500 text-xs font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === "th" ? "ดูรายการ" : "View"}</span>
                <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MISSION FOCUSED HEADER BANNER (When a specific mission is selected) */}
      {/* ===================================================================== */}
      {selectedMission !== "all" && selectedMission !== "quests" && (
        <div
          style={{
            background:
              selectedMission === "morning"
                ? isDarkMode
                  ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)"
                  : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)"
                : selectedMission === "day"
                ? isDarkMode
                  ? "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)"
                  : "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)"
                : isDarkMode
                ? "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(30, 41, 59, 0.7) 100%)"
                : "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
            border: `1.5px solid ${
              selectedMission === "morning"
                ? isDarkMode
                  ? "rgba(245, 158, 11, 0.3)"
                  : "#FDE68A"
                : selectedMission === "day"
                ? isDarkMode
                  ? "rgba(6, 182, 212, 0.3)"
                  : "#A5F3FC"
                : isDarkMode
                ? "rgba(139, 92, 246, 0.3)"
                : "#E9D5FF"
            }`,
            borderRadius: 20,
          }}
          className="p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {selectedMission === "morning"
                ? "🌅"
                : selectedMission === "day"
                ? "☀️"
                : "🌙"}
            </span>
            <div>
              <h4
                className="text-sm font-black"
                style={{
                  color:
                    selectedMission === "morning"
                      ? "#F59E0B"
                      : selectedMission === "day"
                      ? "#06B6D4"
                      : "#8B5CF6",
                }}
              >
                {selectedMission === "morning"
                  ? lang === "th"
                    ? "ภารกิจช่วงเช้า (Morning Routine Mission)"
                    : "Morning Routine Mission"
                  : selectedMission === "day"
                  ? lang === "th"
                    ? "ภารกิจช่วงกลางวัน (Midday Routine Mission)"
                    : "Midday Routine Mission"
                  : lang === "th"
                  ? "ภารกิจช่วงเย็น/ค่ำ (Evening Routine Mission)"
                  : "Evening Routine Mission"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {selectedMission === "morning"
                  ? lang === "th"
                    ? "ช่วงเวลาแนะนำ: 06:00 - 12:00 น. เริ่มต้นวันอย่างมีพลัง"
                    : "Recommended: 06:00 - 12:00. Start strong."
                  : selectedMission === "day"
                  ? lang === "th"
                    ? "ช่วงเวลาแนะนำ: 12:00 - 18:00 น. โฟกัสงานหลักและการเรียนรู้"
                    : "Recommended: 12:00 - 18:00. Focus on deep work."
                  : lang === "th"
                  ? "ช่วงเวลาแนะนำ: 18:00 - 24:00 น. พักผ่อน ทบทวนวัน และเข้านอน"
                  : "Recommended: 18:00 - 24:00. Wind down & reflect."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              style={{ background: t.GOOD_BG, color: t.GOOD_COLOR }}
              className="text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5"
            >
              <CheckCircle2 size={13} />
              <span>
                {selectedMission === "morning"
                  ? `${morningDone}/${morningHabits.length}`
                  : selectedMission === "day"
                  ? `${dayDone}/${dayHabits.length}`
                  : `${eveningDone}/${eveningHabits.length}`}{" "}
                {lang === "th" ? "สำเร็จ" : "Done"}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedMission("all")}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 transition-all cursor-pointer"
            >
              {lang === "th" ? "← ดูทั้ง 3 ภารกิจ" : "← All 3"}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3 DAILY QUESTS TAB CONTENT (If selected) */}
      {/* ===================================================================== */}
      {selectedMission === "quests" && (
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {questItems.map((q, idx) => {
              if (!q) return null;
              const isClaimed = dailyQuests?.claimed.includes(q.id);
              const isEligible = q.check(day);
              return (
                <div
                  key={q.id}
                  style={{
                    background: isClaimed
                      ? isDarkMode
                        ? "rgba(16, 185, 129, 0.1)"
                        : "#F0FDF4"
                      : isDarkMode
                      ? "#1E293B"
                      : "#FFFFFF",
                    border: `1.5px solid ${
                      isClaimed
                        ? isDarkMode
                          ? "rgba(16, 185, 129, 0.3)"
                          : "#86EFAC"
                        : t.NEUTRAL_BORDER
                    }`,
                    borderRadius: 20,
                  }}
                  className="p-3.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{q.icon}</span>
                      <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        +{q.reward} pts
                      </span>
                    </div>
                    <h5
                      className="text-xs font-black mb-1"
                      style={{ color: t.TEXT_MAIN }}
                    >
                      {lang === "th" ? q.label : q.enLabel}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      {lang === "th" ? q.desc : q.enDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">
                      {lang === "th" ? `เควสต์ที่ ${idx + 1}/3` : `Quest ${idx + 1}/3`}
                    </span>
                    <span
                      className={`text-[11px] font-black ${
                        isClaimed
                          ? "text-emerald-500"
                          : isEligible
                          ? "text-cyan-500"
                          : "text-slate-400"
                      }`}
                    >
                      {isClaimed
                        ? lang === "th"
                          ? "✓ รับแล้ว"
                          : "✓ Claimed"
                        : isEligible
                        ? lang === "th"
                          ? "พร้อมรับรางวัล!"
                          : "Ready!"
                        : lang === "th"
                        ? "กำลังทำ..."
                        : "In progress"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Routine Insights Strip */}
      {selectedMission === "all" && (
        <div
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.6) 100%)"
              : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
            border: `1px solid ${
              isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(226, 232, 240, 0.8)"
            }`,
            borderRadius: 20,
          }}
          className="p-3 mb-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-bold"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                background: t.GOOD_BG,
                color: t.GOOD_COLOR,
              }}
              className="px-2.5 py-1 rounded-xl flex items-center gap-1.5"
            >
              <Sparkles size={12} />
              <span>
                {completedCount}/{totalCount}{" "}
                {lang === "th" ? "นิสัยสำเร็จ" : "Completed"} ({progressPercent}%)
              </span>
            </span>

            <span
              style={{
                background: isDarkMode
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
              }}
              className="px-2.5 py-1 rounded-xl flex items-center gap-1"
            >
              <span>{routineRhythmLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold flex-wrap">
            {earliestTime && (
              <span className="flex items-center gap-1">
                <span>🌅 {lang === "th" ? "เริ่มแรก:" : "First:"}</span>
                <strong className="text-slate-600 dark:text-slate-200">
                  {earliestTime}
                </strong>
              </span>
            )}
            {latestTime && (
              <span className="flex items-center gap-1">
                <span>🌙 {lang === "th" ? "ล่าสุด:" : "Latest:"}</span>
                <strong className="text-slate-600 dark:text-slate-200">
                  {latestTime}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 24-Hour Daytime Visual Rail Progress Scrubber (When all missions or habit view) */}
      {selectedMission !== "quests" && (
        <div className="mb-4 px-1">
          <div className="flex justify-between text-[10px] font-extrabold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Sun size={11} className="text-amber-500" />
              <span>06:00</span>
            </span>
            <span className="flex items-center gap-1">
              <CloudSun size={11} className="text-amber-600" />
              <span>12:00</span>
            </span>
            <span className="flex items-center gap-1">
              <Sun size={11} className="text-orange-500" />
              <span>18:00</span>
            </span>
            <span className="flex items-center gap-1">
              <Moon size={11} className="text-indigo-400" />
              <span>23:00</span>
            </span>
          </div>

          {/* Rail track with completed dots and current-time marker */}
          <div
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0",
            }}
            className="h-2 rounded-full relative overflow-visible shadow-inner"
          >
            {/* Day periods colored zones */}
            <div className="absolute inset-0 flex rounded-full overflow-hidden opacity-50">
              <div
                className="h-full w-1/4 bg-amber-400/20"
                title="Morning (00:00 - 06:00)"
              />
              <div
                className="h-full w-1/4 bg-sky-400/20"
                title="Midday (06:00 - 12:00)"
              />
              <div
                className="h-full w-1/4 bg-indigo-400/20"
                title="Afternoon (12:00 - 18:00)"
              />
              <div
                className="h-full w-1/4 bg-purple-400/20"
                title="Night (18:00 - 24:00)"
              />
            </div>

            {/* Completed habit marker dots on the rail */}
            {completedList.map((item) => {
              const pct = Math.min(100, Math.max(0, (item.minutes / 1440) * 100));
              return (
                <div
                  key={item.habit.id}
                  style={{ left: `${pct}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-md z-10 group cursor-pointer transition-transform hover:scale-125"
                  title={`${item.label} (${item.time})`}
                />
              );
            })}

            {/* Real-time "NOW" indicator pin on the rail */}
            <div
              style={{ left: `${dayMinutesPercent}%` }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-cyan-400/40 animate-pulse shadow-md" />
            </div>
          </div>
        </div>
      )}

      {/* Main Horizontal Timeline Content Track */}
      {selectedMission !== "quests" && (
        <>
          {displayedItems.length === 0 ? (
            // Empty State
            <div
              style={{
                background: isDarkMode ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                border: `1.5px dashed ${
                  isDarkMode ? "rgba(255,255,255,0.12)" : "#CBD5E1"
                }`,
                borderRadius: 22,
              }}
              className="p-5 text-center"
            >
              <div className="text-3xl mb-2">
                {selectedMission === "morning"
                  ? "🌅"
                  : selectedMission === "day"
                  ? "☀️"
                  : selectedMission === "evening"
                  ? "🌙"
                  : "⏳"}
              </div>
              <h4 className="text-sm font-black mb-1" style={{ color: t.TEXT_MAIN }}>
                {viewMode === "completed"
                  ? lang === "th"
                    ? "ยังไม่มีกิจวัตรที่ทำสำเร็จในส่วนนี้"
                    : "No habits completed in this section yet"
                  : lang === "th"
                  ? "ไม่มีกิจวัตรในหมวดนี้"
                  : "No habits in this category"}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                {lang === "th"
                  ? "คลิกสลับดู 'ทั้งวัน' เพื่อดูแผนงาน หรือติ๊กทำกิจวัตรในเช็คลิสต์ด้านล่าง"
                  : "Switch to 'All Day' to preview schedule, or complete habits below."}
              </p>
              <button
                type="button"
                onClick={() => setViewMode("full")}
                style={{ background: t.ACCENT }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Layers size={14} />
                <span>
                  {lang === "th" ? "ดูแผนกิจวัตรทั้งหมด" : "View Full Schedule"}
                </span>
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Horizontal scroll track controls */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-slate-400">
                  {lang === "th"
                    ? `รายการกิจวัตร (${displayedItems.length} รายการ):`
                    : `Habits (${displayedItems.length}):`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    style={{
                      background: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                      color: t.TEXT_MAIN,
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                    title="Scroll Left"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    style={{
                      background: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                      color: t.TEXT_MAIN,
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                    title="Scroll Right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Timeline continuous horizontal scroll container */}
              <div
                ref={scrollContainerRef}
                className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scroll-smooth select-none"
                style={{ scrollbarWidth: "thin" }}
              >
                {displayedItems.map((item) => {
                  const isMorning = item.category === "morning";
                  const isDay = item.category === "day";

                  const categoryBadgeColor = isMorning
                    ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : isDay
                    ? "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                    : "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20";

                  const categoryLabel =
                    lang === "th"
                      ? isMorning
                        ? "เช้า"
                        : isDay
                        ? "กลางวัน"
                        : "เย็น/ค่ำ"
                      : isMorning
                      ? "Morning"
                      : isDay
                      ? "Day"
                      : "Evening";

                  return (
                    <div
                      key={item.habit.id}
                      style={{
                        background: item.isCompleted
                          ? isDarkMode
                            ? "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)"
                            : "#FFFFFF"
                          : isDarkMode
                          ? "rgba(30, 41, 59, 0.4)"
                          : "#F8FAFC",
                        border: item.isCompleted
                          ? `2px solid ${
                              isDarkMode ? "rgba(16, 185, 129, 0.4)" : "#A7F3D0"
                            }`
                          : `1.5px dashed ${
                              isDarkMode ? "rgba(255,255,255,0.1)" : "#CBD5E1"
                            }`,
                        borderRadius: 22,
                        boxShadow: item.isCompleted
                          ? isDarkMode
                            ? "0 4px 15px rgba(0,0,0,0.3)"
                            : "0 4px 12px rgba(16, 185, 129, 0.08)"
                          : "none",
                        minWidth: "220px",
                        maxWidth: "240px",
                      }}
                      className={`flex-shrink-0 p-3.5 flex flex-col justify-between relative transition-all group ${
                        !item.isCompleted
                          ? "opacity-75 hover:opacity-100"
                          : "hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Top: Time Badge & Category */}
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2.5">
                          <span
                            style={{
                              background: item.isCompleted
                                ? "linear-gradient(135deg, #10B981, #059669)"
                                : isDarkMode
                                ? "#334155"
                                : "#E2E8F0",
                              color: item.isCompleted ? "#FFF" : t.TEXT_MUTED,
                              boxShadow: item.isCompleted
                                ? "0 2px 6px rgba(16, 185, 129, 0.35)"
                                : "none",
                            }}
                            className="text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer"
                            onClick={() =>
                              handleOpenEditTime(item.habit.id, item.time)
                            }
                            title={
                              lang === "th"
                                ? "คลิกเพื่อแก้ไขเวลา"
                                : "Click to edit time"
                            }
                          >
                            <Clock size={11} />
                            <span>{item.time}</span>
                            <Edit3
                              size={10}
                              className="opacity-70 group-hover:opacity-100"
                            />
                          </span>

                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${categoryBadgeColor} flex items-center gap-1`}
                          >
                            {isMorning ? (
                              <Sun size={10} />
                            ) : isDay ? (
                              <CloudSun size={10} />
                            ) : (
                              <Moon size={10} />
                            )}
                            <span>{categoryLabel}</span>
                          </span>
                        </div>

                        {/* Middle: Icon & Habit Name */}
                        <div className="flex items-start gap-2.5 my-1">
                          <span className="text-2xl filter drop-shadow-sm flex-shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <div
                              className="text-xs font-black line-clamp-2 leading-tight"
                              style={{ color: t.TEXT_MAIN }}
                            >
                              {item.label}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                              <span className="text-emerald-500 font-extrabold">
                                +{item.habit.points} pts
                              </span>
                              {item.habit.priority === "high" && (
                                <span className="text-rose-500 font-extrabold flex items-center gap-0.5">
                                  <Flame size={10} />{" "}
                                  {lang === "th" ? "สำคัญ" : "High"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action: Complete / Toggle / Status */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.isCompleted
                            ? lang === "th"
                              ? "✓ ทำสำเร็จแล้ว"
                              : "✓ Completed"
                            : lang === "th"
                            ? "○ ตามแผนกิจวัตร"
                            : "○ Scheduled"}
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleHabit(item.habit.id)}
                          style={{
                            background: item.isCompleted
                              ? t.GOOD_COLOR
                              : isDarkMode
                              ? "#334155"
                              : "#F1F5F9",
                            color: item.isCompleted ? "#FFF" : t.TEXT_MAIN,
                          }}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                        >
                          {item.isCompleted ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>{lang === "th" ? "สำเร็จ" : "Done"}</span>
                            </>
                          ) : (
                            <>
                              <span>{lang === "th" ? "ติ๊กทำ" : "Mark"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Bottom Collapse Button */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <button
          type="button"
          onClick={() => toggleExpand(false)}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1.5 px-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <ChevronUp size={14} />
          <span>
            {lang === "th"
              ? "ย่อเก็บไทม์ไลน์กิจวัตร (แสดงแบบย่อ)"
              : "Collapse Timeline (Show Compact View)"}
          </span>
        </button>
      </div>

      {/* Inline Modal: Edit Completion Time */}
      {editingHabitId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setEditingHabitId(null)}
        >
          <div
            style={{
              background: t.CARD,
              border: `2px solid ${t.ACCENT}`,
              borderRadius: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              maxWidth: 360,
              width: "100%",
            }}
            className="p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={18} style={{ color: t.ACCENT }} />
                <h4 className="text-sm font-black" style={{ color: t.TEXT_MAIN }}>
                  {lang === "th" ? "ปรับเวลาที่ทำกิจวัตร" : "Adjust Completion Time"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingHabitId(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {lang === "th"
                ? "ระบุเวลาจริงที่คุณทำสำเร็จเพื่อให้ไทม์ไลน์สะท้อนกิจวัตรที่แท้จริงของคุณ"
                : "Set the actual time you completed this habit to reflect your real schedule."}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                {lang === "th" ? "เวลา (ชั่วโมง:นาที)" : "Time (HH:mm)"}
              </label>
              <input
                type="time"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                style={{
                  background: isDarkMode ? "#1E293B" : "#F8FAFC",
                  border: `1.5px solid ${t.NEUTRAL_BORDER}`,
                  color: t.TEXT_MAIN,
                }}
                className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm font-black outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-4">
              <span className="block text-[11px] font-bold text-slate-400 mb-1.5">
                {lang === "th" ? "เลือกด่วน:" : "Quick Presets:"}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {currentTimeStr && (
                  <button
                    type="button"
                    onClick={() => setCustomTimeInput(currentTimeStr)}
                    className="px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:bg-cyan-500/25 transition-all"
                  >
                    {lang === "th" ? "ขณะนี้" : "Now"} ({currentTimeStr})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCustomTimeInput("07:30")}
                  className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all"
                >
                  07:30 🌅
                </button>
                <button
                  type="button"
                  onClick={() => setCustomTimeInput("12:30")}
                  className="px-2 py-1 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 text-xs font-bold hover:bg-sky-500/25 transition-all"
                >
                  12:30 ☀️
                </button>
                <button
                  type="button"
                  onClick={() => setCustomTimeInput("20:00")}
                  className="px-2 py-1 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-500/25 transition-all"
                >
                  20:00 🌙
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingHabitId(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {lang === "th" ? "ยกเลิก" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSaveCustomTime}
                style={{ background: t.ACCENT }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-cyan-500/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                {lang === "th" ? "บันทึกเวลา" : "Save Time"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
