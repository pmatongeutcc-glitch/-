import React from "react";
import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Coins,
  PenLine,
  Check,
  Sun,
  CloudSun,
  Moon,
} from "lucide-react";
import {
  getMonthMatrix,
  dateKey,
  parseKey,
  addDays,
  dayScore,
  THAI_MONTHS_FULL,
  THAI_DAYS,
  EN_MONTHS_FULL,
  EN_DAYS,
  MOODS,
  TIME_GROUPS,
} from "../data/constants";
import { DayLog, PositiveHabit, NegativeHabit } from "../types";

interface CalendarViewProps {
  logs: Record<string, DayLog>;
  historyCursor: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDateKey: string | null;
  onSelectDate: (key: string) => void;
  positiveHabits: PositiveHabit[];
  negativeHabits: NegativeHabit[];
  positivePointsMap: Record<string, number>;
  onTogglePositive: (key: string, habitId: string) => void;
  onToggleNegative: (key: string, habitId: string) => void;
  onSetSavings: (key: string, amount: number) => void;
  onSetMood: (key: string, moodId: string) => void;
  onSaveDiary: (key: string, text: string) => void;
  today: Date;
  t: {
    CARD: string;
    BG: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    GOOD_COLOR: string;
    GOOD_BG: string;
    GOOD_BORDER: string;
    BAD_COLOR: string;
    BAD_BG: string;
    BAD_BORDER: string;
    ACCENT: string;
    ACCENT_BG: string;
  };
  lang: "th" | "en";
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logs,
  historyCursor,
  onPrevMonth,
  onNextMonth,
  selectedDateKey,
  onSelectDate,
  positiveHabits,
  negativeHabits,
  positivePointsMap,
  onTogglePositive,
  onToggleNegative,
  onSetSavings,
  onSetMood,
  onSaveDiary,
  today,
  t,
  lang,
}) => {
  const weeks = getMonthMatrix(historyCursor);
  const month = historyCursor.getMonth();

  // Habit Insights
  const posCount: Record<string, number> = {};
  const negCount: Record<string, number> = {};
  Object.values(logs).forEach((day: DayLog) => {
    Object.entries(day.positives || {}).forEach(([id, val]) => {
      if (val) posCount[id] = (posCount[id] || 0) + 1;
    });
    Object.entries(day.negatives || {}).forEach(([id, val]) => {
      if (val) negCount[id] = (negCount[id] || 0) + 1;
    });
  });

  const bestId = Object.keys(posCount).sort((a, b) => posCount[b] - posCount[a])[0];
  const worstId = Object.keys(negCount).sort((a, b) => negCount[b] - negCount[a])[0];
  const bestHabit = positiveHabits.find((h) => h.id === bestId);
  const worstHabit = negativeHabits.find((h) => h.id === worstId);

  // 7-day history chart
  const chartData = [];
  let maxAbs = 60;
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const k = dateKey(d);
    const { net } = dayScore(logs[k], positivePointsMap, negativeHabits);
    chartData.push({
      dayLabel: lang === "th" ? THAI_DAYS[d.getDay()] : EN_DAYS[d.getDay()],
      net,
    });
    if (Math.abs(net) > maxAbs) maxAbs = Math.abs(net);
  }

  const selectedDayLog = selectedDateKey ? logs[selectedDateKey] || {
    positives: {},
    negatives: {},
    savings: 0,
    mood: null,
    diaryText: "",
    bonusPoints: 0,
    activePerks: [],
  } : null;

  const cardStyle = {
    background: t.CARD,
    border: `1px solid ${t.NEUTRAL_BORDER}`,
    borderRadius: 28,
    color: t.TEXT_MAIN,
  };

  const getTimeIcon = (key: string) => {
    if (key === "morning") return <Sun size={18} />;
    if (key === "day") return <CloudSun size={18} />;
    return <Moon size={18} />;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Habit Insights */}
      {(bestHabit || worstHabit) && (
        <div style={cardStyle} className="p-5 shadow-sm">
          <div className="text-base font-extrabold flex items-center gap-2 mb-3">
            <Sparkles size={18} style={{ color: t.GOOD_COLOR }} />
            <span>{lang === "th" ? "เจาะลึกสถิตินิสัย (Insights)" : "Habit Insights"}</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {bestHabit && (
              <div
                style={{
                  background: t.GOOD_BG,
                  borderColor: t.GOOD_BORDER,
                }}
                className="flex-1 min-w-[140px] p-3.5 rounded-2xl border"
              >
                <div className="text-[11px] font-black uppercase text-rose-500 mb-1">
                  {lang === "th" ? "🏅 นิสัยยอดเยี่ยม" : "🏅 Top Positive Habit"}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {bestHabit.label}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  {lang === "th" ? "ทำสำเร็จ" : "Completed"} {posCount[bestId]}{" "}
                  {lang === "th" ? "ครั้ง" : "times"}
                </div>
              </div>
            )}

            {worstHabit && (
              <div
                style={{
                  background: t.BAD_BG,
                  borderColor: t.BAD_BORDER,
                }}
                className="flex-1 min-w-[140px] p-3.5 rounded-2xl border"
              >
                <div className="text-[11px] font-black uppercase text-rose-500 mb-1">
                  {lang === "th" ? "⚠️ จุดที่ต้องระวัง" : "⚠️ Frequent Pitfall"}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {worstHabit.label}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  {lang === "th" ? "พลาดไป" : "Triggered"} {negCount[worstId]}{" "}
                  {lang === "th" ? "ครั้ง" : "times"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7-day Analytics Chart */}
      <div style={cardStyle} className="p-5 shadow-sm">
        <div className="text-base font-extrabold flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: t.ACCENT }} />
          <span>{lang === "th" ? "กราฟสถิติ 7 วันย้อนหลัง" : "7-Day Score Chart"}</span>
        </div>

        <div className="flex items-end h-36 gap-2 pb-6 relative pt-4">
          {/* Baseline */}
          <div
            style={{ background: t.NEUTRAL_BORDER }}
            className="absolute top-1/2 left-0 w-full h-[2px] z-0"
          />

          {chartData.map((data, i) => {
            const heightPct = Math.min(100, (Math.abs(data.net) / maxAbs) * 50);
            const isPos = data.net >= 0;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center z-10 h-full justify-between"
              >
                <div className="h-full flex flex-col justify-end w-full items-center relative">
                  {/* Positive Bar */}
                  <div className="h-1/2 w-full flex items-end justify-center">
                    {isPos && (
                      <div
                        style={{
                          height: `${heightPct}%`,
                          background: t.GOOD_COLOR,
                        }}
                        className="w-4/5 max-w-[20px] rounded-t-lg transition-all duration-500"
                        title={`+${data.net}`}
                      />
                    )}
                  </div>

                  {/* Negative Bar */}
                  <div className="h-1/2 w-full flex items-start justify-center">
                    {!isPos && (
                      <div
                        style={{
                          height: `${heightPct}%`,
                          background: t.BAD_COLOR,
                        }}
                        className="w-4/5 max-w-[20px] rounded-b-lg transition-all duration-500"
                        title={`${data.net}`}
                      />
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 mt-2">
                  {data.dayLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          style={cardStyle}
          className="btn-scale p-2.5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-lg font-extrabold" style={{ color: t.TEXT_MAIN }}>
          {lang === "th"
            ? `${THAI_MONTHS_FULL[month]} ${historyCursor.getFullYear() + 543}`
            : `${EN_MONTHS_FULL[month]} ${historyCursor.getFullYear()}`}
        </div>

        <button
          onClick={onNextMonth}
          style={cardStyle}
          className="btn-scale p-2.5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Month Days Grid */}
      <div style={cardStyle} className="p-4 shadow-sm">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {(lang === "th" ? THAI_DAYS : EN_DAYS).map((d) => (
            <div key={d} className="text-center text-xs font-bold text-slate-400">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weeks.flat().map((d, i) => {
            const inM = d.getMonth() === month;
            const k = dateKey(d);
            const day = logs[k];
            const fut = d > today;
            const isSelected = selectedDateKey === k;
            const { net } = dayScore(day, positivePointsMap, negativeHabits);

            let bg = t.BG;
            let border = "transparent";
            let txt = t.TEXT_MUTED;

            if (inM && day && !fut) {
              if (net > 0) {
                bg = t.GOOD_BG;
                border = t.GOOD_BORDER;
                txt = t.GOOD_COLOR;
              } else if (net < 0) {
                bg = t.BAD_BG;
                border = t.BAD_BORDER;
                txt = t.BAD_COLOR;
              } else {
                bg = t.NEUTRAL_BORDER;
              }
            }

            return (
              <button
                key={i}
                disabled={fut || !inM}
                onClick={() => onSelectDate(k)}
                className="btn-scale aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer"
                style={{
                  background: isSelected ? t.TEXT_MAIN : bg,
                  border: `2px solid ${isSelected ? t.TEXT_MAIN : border}`,
                  opacity: inM ? 1 : 0.25,
                }}
              >
                <span
                  className="text-xs font-extrabold"
                  style={{ color: isSelected ? t.BG : txt }}
                >
                  {d.getDate()}
                </span>
                {day && !fut && inM && (
                  <span
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{
                      background: isSelected
                        ? t.BG
                        : net >= 0
                        ? t.GOOD_COLOR
                        : t.BAD_COLOR,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail Editor */}
      {selectedDateKey && selectedDayLog && (
        <div
          style={{
            ...cardStyle,
            borderColor: t.ACCENT,
          }}
          className="p-5 border-2 shadow-md space-y-6"
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-400">
                {lang === "th" ? "รายละเอียดบันทึกประจำวัน" : "Daily Log Editor"}
              </div>
              <div className="text-base font-extrabold" style={{ color: t.ACCENT }}>
                {selectedDateKey}
              </div>
            </div>
            <button
              onClick={() => onSelectDate(selectedDateKey)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {lang === "th" ? "ปิด" : "Close"}
            </button>
          </div>

          {/* Positive Habits */}
          <div>
            <div className="flex items-center gap-2 font-extrabold text-sm mb-3" style={{ color: t.GOOD_COLOR }}>
              <Sparkles size={16} />
              <span>{lang === "th" ? "นิสัยเชิงบวกของวันนี้" : "Positive Habits"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {positiveHabits.map((h) => {
                const checked = !!selectedDayLog.positives[h.id];
                return (
                  <button
                    key={h.id}
                    onClick={() => onTogglePositive(selectedDateKey, h.id)}
                    style={{
                      background: checked ? t.GOOD_COLOR : t.BG,
                      borderColor: checked ? t.GOOD_COLOR : t.NEUTRAL_BORDER,
                      color: checked ? "#FFF" : t.TEXT_MAIN,
                    }}
                    className="btn-scale p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center border"
                        style={{
                          borderColor: checked ? "#FFF" : t.TEXT_MUTED,
                          background: checked ? "#FFF" : "transparent",
                        }}
                      >
                        {checked && <Check size={12} color={t.GOOD_COLOR} strokeWidth={3} />}
                      </div>
                      <span className="text-xs font-bold">{h.label}</span>
                    </div>
                    <span className="text-[11px] font-black">+{h.points}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Negative Habits */}
          <div>
            <div className="flex items-center gap-2 font-extrabold text-sm mb-3" style={{ color: t.BAD_COLOR }}>
              <ShieldAlert size={16} />
              <span>{lang === "th" ? "พฤติกรรมฉุดรั้ง" : "Friction Habits"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {negativeHabits.map((h) => {
                const checked = !!selectedDayLog.negatives[h.id];
                return (
                  <button
                    key={h.id}
                    onClick={() => onToggleNegative(selectedDateKey, h.id)}
                    style={{
                      background: checked ? t.BAD_COLOR : t.BG,
                      borderColor: checked ? t.BAD_COLOR : t.NEUTRAL_BORDER,
                      color: checked ? "#FFF" : t.TEXT_MAIN,
                    }}
                    className="btn-scale p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold">{h.label}</span>
                    <span className="text-[11px] font-black">-{h.points}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Savings and Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Savings */}
            <div style={{ background: t.BG }} className="p-3.5 rounded-2xl">
              <div className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: t.ACCENT }}>
                <Coins size={15} />
                <span>{lang === "th" ? "ออมเงินวันนี้ (100บ. = 1แต้ม)" : "Daily Savings (100฿ = 1pt)"}</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={selectedDayLog.savings || ""}
                onChange={(e) => onSetSavings(selectedDateKey, Number(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold outline-none text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Mood */}
            <div style={{ background: t.BG }} className="p-3.5 rounded-2xl">
              <div className="text-xs font-bold mb-2 text-slate-500">
                {lang === "th" ? "อารมณ์ความรู้สึก" : "Mood"}
              </div>
              <div className="flex justify-between items-center">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSetMood(selectedDateKey, m.id)}
                    title={m.label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-125 cursor-pointer"
                    style={{
                      background: selectedDayLog.mood === m.id ? t.ACCENT_BG : "transparent",
                      border: selectedDayLog.mood === m.id ? `2px solid ${t.ACCENT}` : "none",
                    }}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Diary */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
              <PenLine size={14} />
              <span>{lang === "th" ? "บันทึกประจำวัน" : "Daily Reflection / Notes"}</span>
            </div>
            <textarea
              rows={3}
              placeholder={lang === "th" ? "วันนี้มีเรื่องอะไรดีๆ เกิดขึ้นบ้าง..." : "Write your thoughts today..."}
              value={selectedDayLog.diaryText || ""}
              onChange={(e) => onSaveDiary(selectedDateKey, e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-100 shadow-sm transition-all font-medium"
            />
          </div>
        </div>
      )}
    </div>
  );
};
