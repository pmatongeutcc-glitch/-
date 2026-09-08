import React from "react";
import { Wifi } from "lucide-react";
import { getLevelInfo } from "../data/constants";
import { ThreeDCoin, ThreeDFire, ThreeDCrown } from "./ThreeDIcons";

interface TopStatsWidgetProps {
  user?: any;
  onLogin?: () => void;
  isSyncing?: boolean;
  totalAngel: number;
  wallet: number;
  currentStreak: number;
  isOnline: boolean;
  t: {
    CARD: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    GOOD_COLOR: string;
    GOOD_BG: string;
    ACCENT: string;
    ACCENT_BG: string;
  };
  lang: "th" | "en";
}

export const TopStatsWidget: React.FC<TopStatsWidgetProps> = ({
  user,
  onLogin,
  isSyncing,
  totalAngel,
  wallet,
  currentStreak,
  isOnline,
  t,
  lang,
}) => {
  const levelInfo = getLevelInfo(totalAngel, lang);

  const cardStyle = {
    background: t.CARD,
    border: `1px solid ${t.NEUTRAL_BORDER}`,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
    borderRadius: 28,
    color: t.TEXT_MAIN,
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Online/Cloud & User Status Indicator */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-500">
        <div className="flex items-center gap-2 font-medium">
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-cyan-500 animate-spin" : "bg-emerald-500 animate-pulse"}`} />
              <span style={{ color: t.TEXT_MUTED }}>
                {isSyncing
                  ? (lang === "th" ? "กำลังบันทึกขึ้นคลาวด์..." : "Syncing to Cloud...")
                  : (lang === "th" ? `ซิงค์คลาวด์ (${user.displayName || user.email})` : `Synced (${user.displayName || "Google"})`)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span style={{ color: t.TEXT_MUTED }}>
                {lang === "th" ? "บันทึกในเครื่อง (ยังไม่ได้ต่อ Google)" : "Local only"}
              </span>
              {onLogin && (
                <button
                  onClick={onLogin}
                  className="ml-1 text-[11px] font-black text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{lang === "th" ? "🔗 ล็อกอิน Google" : "🔗 Sign in"}</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 font-semibold" style={{ color: t.ACCENT }}>
          <Wifi size={13} />
          <span>{isOnline ? (lang === "th" ? "ออนไลน์" : "Online") : (lang === "th" ? "ออฟไลน์" : "Offline")}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Level Ring Card */}
        <div
          style={cardStyle}
          className="flex-1 p-5 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <svg width="80" height="80" className="-rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={t.NEUTRAL_BORDER}
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={t.GOOD_COLOR}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - levelInfo.progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ThreeDCrown size={20} className="mb-0.5 animate-pulse" />
              <span className="text-2xl font-black leading-none tracking-tight" style={{ color: t.TEXT_MAIN }}>
                {levelInfo.level}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400">LVL</span>
            </div>
          </div>
          <div className="text-sm font-black text-center tracking-wide" style={{ color: t.TEXT_MAIN }}>
            {levelInfo.title}
          </div>
          <div className="text-[11px] font-bold mt-1" style={{ color: t.TEXT_MUTED }}>
            {levelInfo.currentExp} / {levelInfo.requiredExp} EXP
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Wallet Points */}
          <div
            style={{
              ...cardStyle,
              background: t.ACCENT_BG,
              borderTop: "1.5px solid rgba(255,255,255,0.7)",
              borderBottom: "2px solid rgba(0,0,0,0.12)",
              boxShadow: "0 6px 14px -3px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)",
            }}
            className="flex-1 px-4 py-3 flex items-center justify-between transition-all hover:scale-[1.02]"
          >
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: t.ACCENT }}>
                {lang === "th" ? "แต้มสะสม" : "Wallet Points"}
              </div>
              <div className="text-2xl font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                {wallet.toLocaleString()}
              </div>
            </div>
            <div className="p-1.5 rounded-2xl bg-white/60 dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_8px_rgba(0,0,0,0.08)] border-t border-white/80 border-b border-black/15">
              <ThreeDCoin size={36} className="transition-transform hover:rotate-12 duration-300" />
            </div>
          </div>

          {/* Current Streak */}
          <div
            style={{
              ...cardStyle,
              background: t.GOOD_BG,
              borderTop: "1.5px solid rgba(255,255,255,0.7)",
              borderBottom: "2px solid rgba(0,0,0,0.12)",
              boxShadow: "0 6px 14px -3px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)",
            }}
            className="flex-1 px-4 py-3 flex items-center justify-between transition-all hover:scale-[1.02]"
          >
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: t.GOOD_COLOR }}>
                {lang === "th" ? "ทำต่อเนื่อง" : "Streak"}
              </div>
              <div className="text-2xl font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
                {currentStreak} {lang === "th" ? "วัน" : "days"}
              </div>
            </div>
            <div className="p-1.5 rounded-2xl bg-white/60 dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_8px_rgba(0,0,0,0.08)] border-t border-white/80 border-b border-black/15">
              <ThreeDFire size={36} className="transition-transform hover:scale-110 duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
