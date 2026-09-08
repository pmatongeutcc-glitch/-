import React, { useEffect } from "react";
import { ThreeDTarget, ThreeDCoin, ThreeDZap } from "./ThreeDIcons";
import { Sparkles, Trophy, CheckCircle2 } from "lucide-react";
import { RewardFxIntensity } from "../types";

export type ScreenEffectType = "none" | "boss" | "quest" | "crit" | "habit";

export interface ScreenEffectData {
  title?: string;
  subtitle?: string;
  reward?: number;
  icon?: string;
  bossName?: string;
  bossLevel?: number;
}

interface ScreenEffectsOverlayProps {
  effect: ScreenEffectType;
  data?: ScreenEffectData | null;
  onDismiss: () => void;
  lang: "th" | "en";
  isDarkMode: boolean;
  primaryColor?: string;
  intensity?: RewardFxIntensity;
}

export const ScreenEffectsOverlay: React.FC<ScreenEffectsOverlayProps> = ({
  effect,
  data,
  onDismiss,
  lang,
  isDarkMode,
  primaryColor = "#06B6D4",
  intensity = "medium",
}) => {
  useEffect(() => {
    if (effect === "none") return;

    // Trigger physical haptic vibration if supported (mobile browsers)
    try {
      if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
        if (effect === "boss") {
          navigator.vibrate([60, 50, 80, 50, 100]);
        } else if (effect === "quest") {
          navigator.vibrate([40, 40, 50]);
        } else if (effect === "crit") {
          navigator.vibrate([30, 30, 40]);
        } else if (effect === "habit") {
          if (intensity === "high") {
            navigator.vibrate([35, 30, 45]);
          } else if (intensity === "medium") {
            navigator.vibrate([25, 25]);
          } else {
            navigator.vibrate(15);
          }
        }
      }
    } catch {
      // Ignore vibration errors
    }

    // Auto-dismiss timers
    const timerDuration =
      effect === "boss"
        ? 2800
        : effect === "quest"
        ? 2200
        : effect === "habit"
        ? (intensity === "high" ? 850 : intensity === "low" ? 500 : 650)
        : 800;

    const timer = setTimeout(() => {
      onDismiss();
    }, timerDuration);

    return () => clearTimeout(timer);
  }, [effect, onDismiss, intensity]);

  if (effect === "none") return null;

  const isHabitEffect = effect === "habit";

  return (
    <div
      onClick={isHabitEffect ? undefined : onDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none ${
        isHabitEffect ? "pointer-events-none" : "pointer-events-auto cursor-pointer"
      }`}
      style={{
        background:
          effect === "boss"
            ? "radial-gradient(circle at center, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)"
            : effect === "quest"
            ? "radial-gradient(circle at center, rgba(6, 182, 212, 0.22) 0%, rgba(15, 23, 42, 0.6) 100%)"
            : effect === "habit"
            ? `radial-gradient(circle at center, ${primaryColor}18 0%, transparent ${
                intensity === "high" ? "80%" : "65%"
              })`
            : "radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 80%)",
        backdropFilter:
          effect === "boss"
            ? "blur(3px)"
            : effect === "quest"
            ? "blur(1.5px)"
            : isHabitEffect
            ? "none"
            : "blur(1px)",
      }}
    >
      {/* Dynamic Screen Edge Glow Vignette */}
      <div
        className="absolute inset-0 pointer-events-none anim-flash-vignette"
        style={{
          boxShadow:
            effect === "boss"
              ? "inset 0 0 100px 30px rgba(239, 68, 68, 0.65), inset 0 0 40px 10px rgba(245, 158, 11, 0.8)"
              : effect === "quest"
              ? "inset 0 0 90px 25px rgba(6, 182, 212, 0.6), inset 0 0 40px 10px rgba(16, 185, 129, 0.5)"
              : effect === "habit"
              ? `inset 0 0 ${
                  intensity === "high" ? "90px 30px" : intensity === "low" ? "40px 12px" : "65px 20px"
                } ${primaryColor}${intensity === "high" ? "88" : intensity === "low" ? "44" : "66"}`
              : "inset 0 0 60px 15px rgba(245, 158, 11, 0.5)",
        }}
      />

      {/* Expanding Shockwave Rings */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full border-4 anim-shockwave pointer-events-none"
        style={{
          borderColor:
            effect === "boss"
              ? "rgba(239, 68, 68, 0.9)"
              : effect === "quest"
              ? "rgba(6, 182, 212, 0.9)"
              : effect === "habit"
              ? primaryColor
              : "rgba(245, 158, 11, 0.8)",
          boxShadow:
            effect === "boss"
              ? "0 0 40px rgba(239, 68, 68, 0.8), inset 0 0 30px rgba(245, 158, 11, 0.6)"
              : effect === "habit"
              ? `0 0 35px ${primaryColor}99, inset 0 0 25px ${primaryColor}66`
              : "0 0 40px rgba(6, 182, 212, 0.8), inset 0 0 30px rgba(16, 185, 129, 0.5)",
        }}
      />

      <div
        className="absolute w-[600px] h-[600px] rounded-full border-2 anim-shockwave pointer-events-none"
        style={{
          animationDelay: "0.15s",
          borderColor:
            effect === "boss"
              ? "rgba(245, 158, 11, 0.7)"
              : effect === "habit"
              ? `${primaryColor}66`
              : "rgba(59, 130, 246, 0.7)",
        }}
      />

      {/* Rotating Background Radiant Light Rays for Boss Defeat */}
      {effect === "boss" && (
        <div
          className="absolute w-[700px] h-[700px] pointer-events-none opacity-20 anim-light-rays"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #EF4444 0deg, transparent 40deg, #F59E0B 90deg, transparent 130deg, #EF4444 180deg, transparent 220deg, #F59E0B 270deg, transparent 310deg, #EF4444 360deg)",
          }}
        />
      )}

      {/* Floating Center Achievement / Victory Banner */}
      {effect === "boss" && (
        <div
          className="relative anim-victory-badge p-6 sm:p-8 rounded-3xl text-center max-w-sm mx-4 bevel-cut-3d shadow-2xl"
          style={{
            background: isDarkMode
              ? "linear-gradient(145deg, #1E1B4B 0%, #311018 100%)"
              : "linear-gradient(145deg, #FFF1F2 0%, #FFFFFF 100%)",
            border: "2.5px solid #EF4444",
            boxShadow:
              "0 20px 50px -10px rgba(239, 68, 68, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full blur-md opacity-75 animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-300">
                {data?.icon || "⚔️"}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-md">
            <Trophy size={14} />
            <span>{lang === "th" ? "บอสถูกกำราบแล้ว!" : "BOSS DEFEATED!"}</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            {data?.bossName || (lang === "th" ? "มอนสเตอร์ประจำด่าน" : "Boss")}
          </h2>

          <p className="text-xs font-bold text-rose-500 dark:text-rose-400 mb-4">
            {lang === "th"
              ? `ปลดล็อกระดับถัดไป Lv.${(data?.bossLevel || 1) + 1} 🚀`
              : `Unlocked next challenge Lv.${(data?.bossLevel || 1) + 1} 🚀`}
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-sm font-black shadow-inner">
            <ThreeDCoin size={20} />
            <span>+{data?.reward || 500} {lang === "th" ? "แต้มโบนัส!" : "Bonus Pts!"}</span>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold mt-3">
            {lang === "th" ? "แตะที่ใดก็ได้เพื่อดำเนินการต่อ" : "Tap anywhere to continue"}
          </div>
        </div>
      )}

      {effect === "quest" && (
        <div
          className="relative anim-victory-badge p-6 sm:p-7 rounded-3xl text-center max-w-sm mx-4 bevel-cut-3d shadow-2xl"
          style={{
            background: isDarkMode
              ? "linear-gradient(145deg, #0F172A 0%, #082F49 100%)"
              : "linear-gradient(145deg, #ECFEFF 0%, #FFFFFF 100%)",
            border: "2.5px solid #06B6D4",
            boxShadow:
              "0 20px 50px -10px rgba(6, 182, 212, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full blur-md opacity-70 animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg border-2 border-cyan-200">
                {data?.icon || <ThreeDTarget size={36} />}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
            <Sparkles size={13} />
            <span>{lang === "th" ? "ภารกิจสำเร็จ!" : "QUEST COMPLETE!"}</span>
          </div>

          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-2 line-clamp-2">
            {data?.title || (lang === "th" ? "เควสต์ประจำวัน" : "Daily Quest")}
          </h3>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-600 dark:text-cyan-300 text-sm font-black shadow-inner">
            <ThreeDCoin size={18} />
            <span>+{data?.reward || 100} {lang === "th" ? "แต้ม" : "Pts"}</span>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold mt-3">
            {lang === "th" ? "แตะเพื่อปิด" : "Tap to dismiss"}
          </div>
        </div>
      )}

      {effect === "crit" && (
        <div className="anim-victory-badge flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base shadow-2xl border-2 border-amber-200">
          <ThreeDZap size={24} />
          <span>{data?.title || (lang === "th" ? "คริติคอลสไตรค์! ⚡" : "CRITICAL STRIKE! ⚡")}</span>
        </div>
      )}

      {/* Habit Completion Reward FX Banner */}
      {isHabitEffect && (
        <div
          className="anim-victory-badge pointer-events-none flex items-center gap-2.5 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-2xl border"
          style={{
            background: isDarkMode ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.94)",
            borderColor: primaryColor,
            boxShadow: `0 12px 35px -5px ${primaryColor}55`,
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ background: primaryColor }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black" style={{ color: primaryColor }}>
                {data?.title || (lang === "th" ? "ทำนิสัยสำเร็จ!" : "Habit Complete!")}
              </span>
              <Sparkles size={13} style={{ color: primaryColor }} />
            </div>
            {data?.reward !== undefined && (
              <span className="text-[10px] font-bold text-slate-400">
                +{data.reward} {lang === "th" ? "แต้ม" : "Pts"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
