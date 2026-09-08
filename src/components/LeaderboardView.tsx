import React from "react";
import { BADGES } from "../data/constants";
import { LeaderboardEntry } from "../types";
import { Icon3D } from "./Icon3D";
import { ThreeDTrophy, ThreeDMedal, ThreeDCoin } from "./ThreeDIcons";

interface LeaderboardViewProps {
  leaderboard: LeaderboardEntry[];
  claimedBadges: string[];
  userId: string;
  t: {
    CARD: string;
    BG: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    GOOD_COLOR: string;
    ACCENT: string;
    ACCENT_BG: string;
  };
  isDarkMode: boolean;
  lang: "th" | "en";
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  claimedBadges,
  userId,
  t,
  isDarkMode,
  lang,
}) => {
  const cardStyle = {
    background: t.CARD,
    border: `1px solid ${t.NEUTRAL_BORDER}`,
    borderRadius: 28,
    color: t.TEXT_MAIN,
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Badges Showcase */}
      <div
        style={{
          ...cardStyle,
          background: isDarkMode
            ? "#1E293B"
            : "linear-gradient(to right, #FFFFFF, #FEF3C7)",
        }}
        className="p-5 shadow-md bevel-cut-3d"
      >
        <div className="flex items-center gap-2 mb-4 text-amber-600 font-black text-sm">
          <ThreeDMedal rank={1} size={22} />
          <span style={{ color: t.TEXT_MAIN }}>
            {lang === "th" ? "ตู้โชว์เหรียญตราเกียรติยศ (Badges)" : "Achievement Badges"}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {BADGES.map((b) => {
            const isClaimed = claimedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                style={{
                  opacity: isClaimed ? 1 : 0.45,
                  filter: isClaimed ? "none" : "grayscale(80%)",
                }}
                className="flex-shrink-0 w-28 p-3 rounded-2xl bg-white/60 dark:bg-black/30 border-t border-white/80 border-b-2 border-black/15 shadow-sm text-center flex flex-col items-center justify-between"
              >
                <div className="mb-2 select-none">
                  <Icon3D
                    icon={b.icon}
                    size="md"
                    color={isClaimed ? "gold" : "slate"}
                    shape="circle"
                    glow={isClaimed}
                  />
                </div>
                <div className="text-xs font-black text-slate-800 dark:text-slate-100 truncate w-full">
                  {b.title}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 font-medium">
                  {b.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hall of Fame Hero */}
      <div className="text-center my-4">
        <div className="inline-flex p-3 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-t border-white/70 border-b-2 border-amber-500/30 shadow-md mb-2">
          <ThreeDTrophy size={50} />
        </div>
        <h2 className="text-2xl font-black tracking-tight" style={{ color: t.TEXT_MAIN }}>
          Hall of Fame
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-bold">
          {lang === "th"
            ? "จัดอันดับผู้นำความมุ่งมั่นและความสม่ำเสมอ"
            : "Global Discipline & Habit Leaders"}
        </p>
      </div>

      {/* Rankings List */}
      <div className="space-y-2.5">
        {leaderboard.map((user, idx) => {
          const isCurrentUser = user.id === userId;
          const isTopThree = idx < 3;

          return (
            <div
              key={user.id}
              style={{
                ...cardStyle,
                background: isCurrentUser ? t.ACCENT_BG : t.CARD,
                borderColor: isCurrentUser ? t.ACCENT : t.NEUTRAL_BORDER,
                borderTop: "1.5px solid rgba(255,255,255,0.7)",
                borderBottom: "2px solid rgba(0,0,0,0.1)",
                boxShadow: "0 4px 10px -2px rgba(0,0,0,0.05)",
              }}
              className="p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 flex justify-center items-center font-black">
                {isTopThree ? (
                  <ThreeDMedal rank={(idx + 1) as 1 | 2 | 3} size={32} />
                ) : (
                  <span className="text-sm font-black text-slate-400">#{idx + 1}</span>
                )}
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-md">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold truncate" style={{ color: t.TEXT_MAIN }}>
                    {user.username}
                  </span>
                  {isCurrentUser && (
                    <span
                      style={{ background: t.ACCENT }}
                      className="text-[9px] font-black text-white px-1.5 py-0.5 rounded-md"
                    >
                      {lang === "th" ? "คุณ" : "YOU"}
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  Lv.{user.level}
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold" style={{ color: t.GOOD_COLOR }}>
                  {user.totalAngel.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">pts</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
