import React, { useState } from "react";
import { Check, Shuffle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { DAILY_QUESTS_POOL } from "../data/constants";
import { DayLog } from "../types";
import { ThreeDTarget, ThreeDCoin } from "./ThreeDIcons";

interface DailyQuestsWidgetProps {
  day: DayLog;
  dailyQuests: { date: string; ids: string[]; claimed: string[] };
  onClaim: (questId: string, reward: number, label?: string, icon?: string) => void;
  onReroll?: () => void;
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
  };
  lang: "th" | "en";
}

export const DailyQuestsWidget: React.FC<DailyQuestsWidgetProps> = ({
  day,
  dailyQuests,
  onClaim,
  onReroll,
  isDarkMode,
  t,
  lang,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("daily_quests_expanded_v2");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleExpand = (expand?: boolean) => {
    setIsExpanded((prev) => {
      const next = expand !== undefined ? expand : !prev;
      try {
        localStorage.setItem("daily_quests_expanded_v2", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeQuests = dailyQuests.ids
    .map((id) => DAILY_QUESTS_POOL.find((q) => q.id === id))
    .filter(Boolean);

  if (activeQuests.length === 0) return null;

  const completedCount = activeQuests.filter(
    (q) => q && (q.check(day) || dailyQuests.claimed.includes(q.id))
  ).length;

  const claimableQuests = activeQuests.filter(
    (q) => q && q.check(day) && !dailyQuests.claimed.includes(q.id)
  );

  const progressPercent = Math.round((completedCount / activeQuests.length) * 100);

  // =========================================================================
  // 1. COLLAPSED VIEW (โหมดย่อเก็บ - Compact Card)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div
        style={{
          background: isDarkMode ? "#0F172A" : "#F0F9FF",
          border: `1.5px solid ${isDarkMode ? "rgba(6,182,212,0.3)" : t.ACCENT}`,
          borderRadius: 24,
          boxShadow: isDarkMode
            ? "0 6px 20px -8px rgba(0,0,0,0.4)"
            : "0 6px 18px -6px rgba(6,182,212,0.15)",
        }}
        className="p-3.5 sm:p-4 mb-5 relative overflow-hidden transition-all duration-300 hover:shadow-md group bevel-cut-3d"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          {/* Title and Progress */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => toggleExpand(true)}
          >
            <ThreeDTarget size={24} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                  {lang === "th" ? "เควสต์ประจำวัน" : "Daily Quests"}
                </span>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{
                    background: isDarkMode ? "rgba(6,182,212,0.15)" : "#E0F2FE",
                    color: t.ACCENT,
                    border: `1px solid ${t.ACCENT}40`,
                  }}
                >
                  {completedCount}/{activeQuests.length} {lang === "th" ? "สำเร็จ" : "Done"}
                </span>

                {claimableQuests.length > 0 && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                    <Sparkles size={11} />
                    <span>
                      {lang === "th"
                        ? `พร้อมรับ ${claimableQuests.length} รายการ!`
                        : `${claimableQuests.length} Ready to Claim!`}
                    </span>
                  </span>
                )}
              </div>

              {/* Quick Quest Icons Preview */}
              <div className="flex items-center gap-1.5 mt-1">
                {activeQuests.map((q) => {
                  if (!q) return null;
                  const isDone = q.check(day);
                  const isClaimed = dailyQuests.claimed.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      title={lang === "th" ? q.label : q.enLabel || q.label}
                      className={`px-1.5 py-0.5 rounded-md text-xs flex items-center gap-1 border ${
                        isClaimed
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                          : isDone
                          ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300 animate-pulse"
                          : "bg-slate-200/50 dark:bg-slate-800/60 border-slate-300/40 dark:border-slate-700/50 text-slate-400"
                      }`}
                    >
                      <span>{q.icon}</span>
                      {isClaimed ? (
                        <Check size={10} strokeWidth={3} />
                      ) : isDone ? (
                        <span className="text-[9px] font-black text-emerald-500">✓</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons: Quick Claim / Reroll / Expand */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* If ready to claim, quick claim button right in collapsed view */}
            {claimableQuests.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Claim first available
                  const first = claimableQuests[0];
                  if (first) {
                    onClaim(
                      first.id,
                      first.reward,
                      lang === "th" ? first.label : first.enLabel || first.label,
                      first.icon
                    );
                  }
                }}
                style={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
                }}
                className="btn-scale text-white font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-500/25 animate-pulse"
              >
                <Sparkles size={12} />
                <span>{lang === "th" ? "รับรางวัล ✨" : "Claim ✨"}</span>
              </button>
            )}

            {onReroll && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReroll();
                }}
                title={lang === "th" ? "สุ่มเปลี่ยนเควสต์ที่ยังไม่ได้รับ" : "Reroll unclaimed quests"}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Shuffle size={12} />
                <span className="text-[11px]">{lang === "th" ? "สุ่มใหม่" : "Reroll"}</span>
              </button>
            )}

            {/* Expand Trigger Button */}
            <button
              type="button"
              onClick={() => toggleExpand(true)}
              style={{ background: t.ACCENT }}
              className="px-3 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <span>{lang === "th" ? "ดูเควสต์" : "View Quests"}</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mini progress bar at the bottom */}
        <div
          onClick={() => toggleExpand(true)}
          className="mt-2.5 pt-2 border-t border-cyan-100 dark:border-slate-800/70 flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="flex-1 h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #06B6D4 0%, #10B981 100%)",
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
            {progressPercent}%
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW (โหมดเต็ม - Full Details)
  // =========================================================================
  return (
    <div
      style={{
        background: isDarkMode ? "#0F172A" : "#F0F9FF",
        border: `2px solid ${t.ACCENT}`,
        borderRadius: 28,
      }}
      className="p-5 mb-6 bevel-cut-3d relative overflow-hidden transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <ThreeDTarget size={26} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                {lang === "th" ? "เควสต์ประจำวัน" : "Daily Quests"}
              </span>
              <span
                className="text-[11px] font-black px-2 py-0.5 rounded-full"
                style={{
                  background: isDarkMode ? "rgba(6,182,212,0.15)" : "#E0F2FE",
                  color: t.ACCENT,
                  border: `1px solid ${t.ACCENT}40`,
                }}
              >
                {completedCount}/{activeQuests.length}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {lang === "th" ? "สุ่มเควสต์ใหม่ทุกวัน รับแต้มพิเศษ" : "Daily rotated quests for bonus points"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onReroll && (
            <button
              onClick={onReroll}
              title={lang === "th" ? "สุ่มเปลี่ยนเควสต์ที่ยังไม่ได้รับ" : "Reroll unclaimed quests"}
              className="btn-scale text-xs font-bold px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Shuffle size={13} />
              <span className="text-[11px]">{lang === "th" ? "สุ่มใหม่" : "Reroll"}</span>
            </button>
          )}

          {/* Collapse Button */}
          <button
            type="button"
            onClick={() => toggleExpand(false)}
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              color: t.TEXT_MAIN,
              border: `1px solid ${t.NEUTRAL_BORDER}`,
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all cursor-pointer shadow-xs"
            title={lang === "th" ? "ย่อเก็บเควสต์" : "Collapse Quests"}
          >
            <ChevronUp size={15} />
            <span>{lang === "th" ? "ย่อเก็บ" : "Collapse"}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {activeQuests.map((q) => {
          if (!q) return null;
          const isCompleted = q.check(day);
          const isClaimed = dailyQuests.claimed.includes(q.id);
          const questLabel = lang === "th" ? q.label : (q.enLabel || q.label);

          return (
            <div
              key={q.id}
              style={{
                background: isClaimed ? t.BG : t.CARD,
                borderTop: isClaimed ? undefined : "1.5px solid rgba(255,255,255,0.7)",
                borderBottom: isClaimed ? undefined : "2px solid rgba(0,0,0,0.1)",
                border: isClaimed ? `1px solid ${t.NEUTRAL_BORDER}` : undefined,
                boxShadow: isClaimed ? "none" : "0 4px 10px -2px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.7)",
                opacity: isClaimed ? 0.65 : 1,
              }}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {q.icon && (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                    style={{ background: isDarkMode ? "#1E293B" : "#F8FAFC" }}
                  >
                    {q.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-bold truncate-2 ${
                      isClaimed ? "line-through text-slate-400" : ""
                    }`}
                    style={{ color: isClaimed ? t.TEXT_MUTED : t.TEXT_MAIN }}
                  >
                    {questLabel}
                  </div>
                  <div className="text-xs font-black flex items-center gap-1 mt-0.5" style={{ color: t.ACCENT }}>
                    <ThreeDCoin size={14} />
                    <span>+{q.reward} pts</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {isClaimed ? (
                  <div
                    style={{ background: t.GOOD_BG, color: t.GOOD_COLOR }}
                    className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border border-emerald-300/40"
                  >
                    <Check size={14} strokeWidth={3} />
                    <span>{lang === "th" ? "รับแล้ว" : "Claimed"}</span>
                  </div>
                ) : isCompleted ? (
                  <button
                    onClick={() => onClaim(q.id, q.reward, questLabel, q.icon)}
                    style={{
                      background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
                      borderTop: "1.5px solid rgba(255,255,255,0.6)",
                      borderBottom: "2px solid rgba(14,116,144,0.8)",
                      boxShadow: "0 4px 12px rgba(6,182,212,0.35)",
                    }}
                    className="btn-scale text-white font-black px-4 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md animate-pulse"
                  >
                    {lang === "th" ? "รับรางวัล ✨" : "Claim ✨"}
                  </button>
                ) : (
                  <div
                    className="text-xs font-bold whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {lang === "th" ? "ยังไม่สำเร็จ" : "Incomplete"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom quick collapse trigger */}
      <div className="mt-3.5 pt-2.5 border-t border-cyan-100 dark:border-slate-800/80 flex justify-center">
        <button
          type="button"
          onClick={() => toggleExpand(false)}
          className="text-[11px] font-bold text-slate-400 hover:text-cyan-500 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronUp size={14} />
          <span>{lang === "th" ? "ย่อเก็บเควสต์ประจำวัน" : "Collapse Daily Quests"}</span>
        </button>
      </div>
    </div>
  );
};
