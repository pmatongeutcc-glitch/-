import React, { useState } from "react";
import {
  Settings,
  Upload,
  Palette,
  SunMedium,
  MoonStar,
  Volume2,
  VolumeX,
  Download,
  Code,
  Bell,
  Sparkles,
  ShieldAlert,
  ShoppingBag,
  Plus,
  Trash2,
  GripVertical,
  Languages,
  Music,
  Play,
  Check,
  Swords,
  Trophy,
  Zap,
  PartyPopper,
  ChevronDown,
} from "lucide-react";
import { THEMES, TIME_GROUPS, SOUND_SETS, REWARD_FX_PALETTES, genId } from "../data/constants";
import {
  PositiveHabit,
  NegativeHabit,
  ShopItem,
  ThemeKey,
  LanguageKey,
  SoundSetKey,
  SoundType,
  RewardFxConfig,
  RewardFxIntensity,
  RewardFxColorTheme,
} from "../types";
import { playSound } from "../utils/audio";

interface SettingsViewProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  username: string;
  onSaveUsername: (name: string) => void;
  profilePic: string | null;
  onUploadProfilePic: (file: File) => void;
  appTheme: ThemeKey;
  onSetTheme: (theme: ThemeKey) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
  soundSet: SoundSetKey;
  onSetSoundSet: (set: SoundSetKey) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  screenShakeEnabled?: boolean;
  onToggleScreenShake?: () => void;
  onTestEffect?: (type: "boss" | "quest") => void;
  rewardFxConfig: RewardFxConfig;
  onUpdateRewardFxConfig: (config: Partial<RewardFxConfig>) => void;
  onTestRewardFx?: () => void;
  lang: LanguageKey;
  onSetLanguage: (lang: LanguageKey) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onDownloadHtml: () => void;
  positiveHabits: PositiveHabit[];
  onUpdatePositiveHabits: (habits: PositiveHabit[]) => void;
  negativeHabits: NegativeHabit[];
  onUpdateNegativeHabits: (habits: NegativeHabit[]) => void;
  shopItems: ShopItem[];
  onUpdateShopItems: (items: ShopItem[]) => void;
  onRequestConfirm: (title: string, msg: string, onConfirm: () => void, type?: "danger" | "primary") => void;
  t: {
    CARD: string;
    BG: string;
    TEXT_MAIN: string;
    TEXT_MUTED: string;
    NEUTRAL_BORDER: string;
    GOOD_COLOR: string;
    BAD_COLOR: string;
    ACCENT: string;
    ACCENT_BG: string;
  };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onLogin,
  onLogout,
  isSyncing,
  lastSyncedAt,
  username,
  onSaveUsername,
  profilePic,
  onUploadProfilePic,
  appTheme,
  onSetTheme,
  isDarkMode,
  onToggleDarkMode,
  sfxEnabled,
  onToggleSfx,
  soundSet,
  onSetSoundSet,
  notificationsEnabled,
  onToggleNotifications,
  screenShakeEnabled = true,
  onToggleScreenShake,
  onTestEffect,
  rewardFxConfig,
  onUpdateRewardFxConfig,
  onTestRewardFx,
  lang,
  onSetLanguage,
  onExportBackup,
  onImportBackup,
  onDownloadHtml,
  positiveHabits,
  onUpdatePositiveHabits,
  negativeHabits,
  onUpdateNegativeHabits,
  shopItems,
  onUpdateShopItems,
  onRequestConfirm,
  t,
}) => {
  const [usernameDraft, setUsernameDraft] = useState(username);
  const [activePreviewSound, setActivePreviewSound] = useState<string | null>(null);
  const [newPos, setNewPos] = useState({ label: "", points: 20, time: "morning" as const, priority: "medium" as const });
  const [newNeg, setNewNeg] = useState({ label: "", points: 50, priority: "medium" as const });
  const [newShop, setNewShop] = useState({ title: "", price: 100, icon: "🎁", desc: "" });

  const [draggedPosIdx, setDraggedPosIdx] = useState<number | null>(null);
  const [draggedNegIdx, setDraggedNegIdx] = useState<number | null>(null);

  // Collapsible sections state (all collapsed by default as requested)
  const [isSoundThemeOpen, setIsSoundThemeOpen] = useState(false);
  const [isPositiveHabitsOpen, setIsPositiveHabitsOpen] = useState(false);
  const [isNegativeHabitsOpen, setIsNegativeHabitsOpen] = useState(false);
  const [isShopItemsOpen, setIsShopItemsOpen] = useState(false);

  const handleTestSound = (type: SoundType, key: SoundSetKey) => {
    setActivePreviewSound(`${key}-${type}`);
    playSound(type, true, key);
    setTimeout(() => {
      setActivePreviewSound((prev) => (prev === `${key}-${type}` ? null : prev));
    }, 650);
  };

  const cardStyle = {
    background: t.CARD,
    border: `1px solid ${t.NEUTRAL_BORDER}`,
    borderRadius: 28,
    color: t.TEXT_MAIN,
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Cloud Account & Google Login Card */}
      <div
        style={{
          ...cardStyle,
          background: user
            ? `linear-gradient(135deg, ${t.CARD}, ${t.ACCENT_BG})`
            : cardStyle.background,
          borderColor: user ? t.ACCENT : t.NEUTRAL_BORDER,
        }}
        className="p-6 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-extrabold text-base" style={{ color: t.ACCENT }}>
            <span className="text-xl">☁️</span>
            <span>{lang === "th" ? "บัญชีคลาวด์ & Google Login" : "Cloud Account & Google Login"}</span>
          </div>
          {user && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === "th" ? "ซิงค์คลาวด์อัตโนมัติ" : "Auto-Syncing"}</span>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500 shadow-sm bg-slate-200 flex items-center justify-center shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Google User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <div className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{user.displayName || username}</span>
                  <span className="text-[10px] bg-cyan-500 text-white px-2 py-0.2 rounded-full">Google</span>
                </div>
                <div className="text-xs font-semibold text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  {user.email}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isSyncing
                    ? (lang === "th" ? "กำลังบันทึกไปยังคลาวด์..." : "Syncing to cloud...")
                    : lastSyncedAt
                    ? `${lang === "th" ? "ซิงค์ล่าสุด" : "Last synced"}: ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : (lang === "th" ? "ข้อมูลเชื่อมต่อคลาวด์แล้ว" : "Cloud connected")}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="btn-scale px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-black cursor-pointer hover:bg-rose-100 transition-all self-stretch sm:self-auto text-center"
            >
              {lang === "th" ? "ออกจากระบบ (Sign Out)" : "Sign Out"}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-1">
                {lang === "th" ? "เชื่อมต่อกับบัญชี Google เพื่อไม่ให้ข้อมูลหาย" : "Connect Google Account so data is never lost"}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                {lang === "th"
                  ? "ข้อมูลนิสัย บอส ร้านค้า และสถิติทั้งหมดจะถูกซิงค์อัตโนมัติ เข้า-ออก หรือเปิดอุปกรณ์อื่นก็ไม่หาย!"
                  : "Habits, boss battle, shop rewards, and streaks auto-sync to Firebase Cloud seamlessly."}
              </div>
            </div>

            <button
              onClick={onLogin}
              className="btn-scale px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 font-black text-xs shadow-md flex items-center justify-center gap-2.5 cursor-pointer hover:border-cyan-500 hover:shadow-cyan-500/10 transition-all shrink-0 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{lang === "th" ? "เข้าสู่ระบบด้วย Google" : "Sign in with Google"}</span>
            </button>
          </div>
        )}
      </div>

      {/* General Settings */}
      <div style={cardStyle} className="p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5 font-extrabold text-base" style={{ color: t.ACCENT }}>
          <Settings size={20} />
          <span>{lang === "th" ? "ตั้งค่าระบบและโปรไฟล์" : "System & Profile Settings"}</span>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-18 h-18 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600 shadow-sm">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            <label
              style={{ background: t.ACCENT }}
              className="btn-scale absolute -bottom-1 -right-1 p-2 rounded-full text-white cursor-pointer shadow-md"
              title="Upload photo"
            >
              <Upload size={13} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUploadProfilePic(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <div className="text-xs font-bold text-slate-400 mb-1">
              {lang === "th" ? "ชื่อที่แสดงในระบบ" : "Display Username"}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              {usernameDraft !== username && (
                <button
                  onClick={() => onSaveUsername(usernameDraft)}
                  style={{ background: t.ACCENT }}
                  className="btn-scale text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  {lang === "th" ? "บันทึก" : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Languages size={15} />
            <span>{lang === "th" ? "ภาษา (Language)" : "Language"}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSetLanguage("th")}
              className="btn-scale flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
              style={{
                background: lang === "th" ? t.ACCENT_BG : t.BG,
                border: `2px solid ${lang === "th" ? t.ACCENT : t.NEUTRAL_BORDER}`,
                color: lang === "th" ? t.ACCENT : t.TEXT_MAIN,
              }}
            >
              🇹🇭 ภาษาไทย
            </button>
            <button
              onClick={() => onSetLanguage("en")}
              className="btn-scale flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
              style={{
                background: lang === "en" ? t.ACCENT_BG : t.BG,
                border: `2px solid ${lang === "en" ? t.ACCENT : t.NEUTRAL_BORDER}`,
                color: lang === "en" ? t.ACCENT : t.TEXT_MAIN,
              }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Themes Selector */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Palette size={15} />
            <span>{lang === "th" ? "เลือกธีมสีแอพ (Color Theme)" : "App Color Theme"}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(THEMES) as [ThemeKey, typeof THEMES.ocean][]).map(([key, themeObj]) => (
              <button
                key={key}
                onClick={() => onSetTheme(key)}
                className="btn-scale p-2.5 rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all"
                style={{
                  background: appTheme === key ? themeObj.ACCENT_BG : t.BG,
                  border: `2px solid ${appTheme === key ? themeObj.ACCENT : t.NEUTRAL_BORDER}`,
                  color: appTheme === key ? themeObj.ACCENT : t.TEXT_MAIN,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full shadow-inner"
                  style={{ background: themeObj.ACCENT }}
                />
                <span className="text-[10px] font-bold">{themeObj.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Toggles (Dark Mode, Audio, Notification, Screen Shake & Flash FX, Reward FX) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
          <button
            onClick={onToggleDarkMode}
            className="btn-scale p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            style={{
              background: t.BG,
              borderColor: t.NEUTRAL_BORDER,
              color: t.TEXT_MAIN,
            }}
          >
            {isDarkMode ? <SunMedium size={16} color="#F59E0B" /> : <MoonStar size={16} color="#6366F1" />}
            <span>{isDarkMode ? (lang === "th" ? "โหมดสว่าง" : "Light") : (lang === "th" ? "โหมดมืด" : "Dark")}</span>
          </button>

          <button
            onClick={onToggleSfx}
            className="btn-scale p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            style={{
              background: t.BG,
              borderColor: t.NEUTRAL_BORDER,
              color: t.TEXT_MAIN,
            }}
          >
            {sfxEnabled ? <Volume2 size={16} style={{ color: t.GOOD_COLOR }} /> : <VolumeX size={16} />}
            <span>{sfxEnabled ? (lang === "th" ? "เสียง: เปิด" : "Sound: ON") : (lang === "th" ? "เสียง: ปิด" : "Sound: OFF")}</span>
          </button>

          <button
            onClick={onToggleNotifications}
            className="btn-scale p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            style={{
              background: t.BG,
              borderColor: t.NEUTRAL_BORDER,
              color: t.TEXT_MAIN,
            }}
          >
            <Bell size={16} style={{ color: notificationsEnabled ? t.ACCENT : undefined }} />
            <span>{notificationsEnabled ? (lang === "th" ? "แจ้งเตือน: เปิด" : "Notify: ON") : (lang === "th" ? "แจ้งเตือน: ปิด" : "Notify: OFF")}</span>
          </button>

          <button
            onClick={onToggleScreenShake}
            className="btn-scale p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            style={{
              background: screenShakeEnabled ? t.ACCENT_BG : t.BG,
              borderColor: screenShakeEnabled ? t.ACCENT : t.NEUTRAL_BORDER,
              color: screenShakeEnabled ? t.ACCENT : t.TEXT_MAIN,
            }}
            title={lang === "th" ? "สั่นและเอฟเฟกต์แสงหน้าจอเมื่อชนะบอสหรือสำเร็จเควสต์" : "Screen shake & flash on victory/quests"}
          >
            <Sparkles size={16} style={{ color: screenShakeEnabled ? t.ACCENT : undefined }} />
            <span>{screenShakeEnabled ? (lang === "th" ? "สั่น/แสง: เปิด" : "FX: ON") : (lang === "th" ? "สั่น/แสง: ปิด" : "FX: OFF")}</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateRewardFxConfig({ enabled: !rewardFxConfig.enabled })}
            className="btn-scale p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            style={{
              background: rewardFxConfig.enabled ? t.ACCENT_BG : t.BG,
              borderColor: rewardFxConfig.enabled ? t.ACCENT : t.NEUTRAL_BORDER,
              color: rewardFxConfig.enabled ? t.ACCENT : t.TEXT_MAIN,
            }}
            title={lang === "th" ? "สลับเปิด/ปิด Reward FX เมื่อทำนิสัยสำเร็จ" : "Toggle Reward FX on habit completion"}
          >
            <PartyPopper size={16} style={{ color: rewardFxConfig.enabled ? t.ACCENT : undefined }} />
            <span>{rewardFxConfig.enabled ? (lang === "th" ? "รางวัล: เปิด" : "Reward: ON") : (lang === "th" ? "รางวัล: ปิด" : "Reward: OFF")}</span>
          </button>
        </div>

        {/* Quick Screen FX Test Buttons */}
        {onTestEffect && screenShakeEnabled && (
          <div className="mb-6 flex items-center justify-between p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-[11px] font-bold text-slate-400">
              {lang === "th" ? "🎮 ทดสอบเอฟเฟกต์สั่น & แสงหน้าจอ:" : "🎮 Preview Screen Shake & Flash FX:"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTestEffect("quest")}
                className="btn-scale text-[10px] font-black px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/25 cursor-pointer transition-all"
              >
                {lang === "th" ? "🎯 แสงเควสต์" : "🎯 Quest FX"}
              </button>
              <button
                type="button"
                onClick={() => onTestEffect("boss")}
                className="btn-scale text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-400/40 hover:bg-rose-500/25 cursor-pointer transition-all"
              >
                {lang === "th" ? "⚔️ ชนะบอส" : "⚔️ Boss Defeat"}
              </button>
            </div>
          </div>
        )}

        {/* Reward FX Customizer (Confetti & Screen Effects) */}
        <div className="mb-6 p-4 rounded-2xl border" style={{ background: t.BG, borderColor: t.NEUTRAL_BORDER }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-extrabold flex items-center gap-1.5" style={{ color: t.TEXT_MAIN }}>
              <PartyPopper size={16} style={{ color: t.ACCENT }} />
              <span>{lang === "th" ? "เอฟเฟกต์รางวัลและคอนเฟตติ (Reward FX)" : "Reward FX & Confetti Celebration"}</span>
            </div>
            {/* Quick Toggle Switch */}
            <button
              type="button"
              onClick={() => onUpdateRewardFxConfig({ enabled: !rewardFxConfig.enabled })}
              className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                rewardFxConfig.enabled
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "bg-slate-500/10 border-slate-400/30 text-slate-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${rewardFxConfig.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {rewardFxConfig.enabled ? (lang === "th" ? "เปิดใช้งาน" : "Enabled") : (lang === "th" ? "ปิดใช้งาน" : "Disabled")}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mb-3.5 leading-relaxed">
            {lang === "th"
              ? "ปรับแต่งความเข้มข้น ปริมาณอนุภาค และโทนสีของคอนเฟตติ (Confetti) และเอฟเฟกต์แสงหน้าจอเมื่อเช็กทำนิสัยสำเร็จ 🎯"
              : "Customize the intensity, particle count, and color palette of confetti & screen flash triggered upon completing habits 🎯"}
          </p>

          {/* Intensity Selector */}
          <div className="mb-4">
            <div className="text-[11px] font-bold mb-1.5" style={{ color: t.TEXT_MAIN }}>
              {lang === "th" ? "ความเข้มข้นของเอฟเฟกต์ (FX Intensity):" : "Effect Intensity:"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: "low" as const,
                  labelTh: "เบาบาง (Subtle)",
                  labelEn: "Subtle",
                  descTh: "24 ชิ้น • ลอยนุ่มนวล",
                  descEn: "24 pts • Gentle",
                  icon: "🍃",
                },
                {
                  id: "medium" as const,
                  labelTh: "มาตรฐาน (Balanced)",
                  labelEn: "Balanced",
                  descTh: "55 ชิ้น • สมดุลพอดี",
                  descEn: "55 pts • Standard",
                  icon: "🎯",
                },
                {
                  id: "high" as const,
                  labelTh: "อลังการ (Epic)",
                  labelEn: "Epic Burst",
                  descTh: "110 ชิ้น • ระเบิดพลุเต็มจอ",
                  descEn: "110 pts • Full burst",
                  icon: "💥",
                },
              ].map((opt) => {
                const isSelected = rewardFxConfig.intensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateRewardFxConfig({ intensity: opt.id })}
                    className={`btn-scale p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "shadow-sm"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      background: isSelected ? t.ACCENT_BG : t.CARD,
                      borderColor: isSelected ? t.ACCENT : t.NEUTRAL_BORDER,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{opt.icon}</span>
                      {isSelected && <Check size={14} style={{ color: t.ACCENT }} />}
                    </div>
                    <div className="text-xs font-bold leading-tight" style={{ color: isSelected ? t.ACCENT : t.TEXT_MAIN }}>
                      {lang === "th" ? opt.labelTh : opt.labelEn}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === "th" ? opt.descTh : opt.descEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="mb-4">
            <div className="text-[11px] font-bold mb-1.5" style={{ color: t.TEXT_MAIN }}>
              {lang === "th" ? "โทนสีคอนเฟตติและแสงออร่า (Color Theme):" : "Confetti & Aura Color Theme:"}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REWARD_FX_PALETTES.map((pal) => {
                const isSelected = rewardFxConfig.colorTheme === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => onUpdateRewardFxConfig({ colorTheme: pal.id })}
                    className={`btn-scale p-2.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                      isSelected ? "shadow-sm" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      background: isSelected ? t.ACCENT_BG : t.CARD,
                      borderColor: isSelected ? pal.primary : t.NEUTRAL_BORDER,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{pal.icon}</span>
                        <span className="text-[11px] font-bold truncate max-w-[90px]" style={{ color: t.TEXT_MAIN }}>
                          {lang === "th" ? pal.nameTh.split(" ")[0] : pal.nameEn}
                        </span>
                      </div>
                      {isSelected && <Check size={14} style={{ color: pal.primary }} />}
                    </div>
                    {/* Swatch color dots */}
                    <div className="flex items-center gap-1">
                      {pal.colors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Test Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold">
              {lang === "th" ? "ทดลองชมความเข้มข้นและโทนสีที่คุณเลือก:" : "Preview your selected intensity & colors:"}
            </span>
            <button
              type="button"
              onClick={onTestRewardFx}
              disabled={!rewardFxConfig.enabled}
              className={`btn-scale text-xs font-black px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                rewardFxConfig.enabled
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-md hover:opacity-90"
                  : "opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent"
              }`}
            >
              <Sparkles size={14} />
              <span>{lang === "th" ? "🎉 ทดสอบ Reward FX" : "🎉 Test Reward FX"}</span>
            </button>
          </div>
        </div>


        {/* Sound Sets & Audio Themes (Collapsible Accordion) */}
        <div className="mb-6 rounded-2xl border overflow-hidden transition-all" style={{ background: t.BG, borderColor: t.NEUTRAL_BORDER }}>
          <button
            type="button"
            onClick={() => setIsSoundThemeOpen(!isSoundThemeOpen)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${t.ACCENT}20`, color: t.ACCENT }}
              >
                <Music size={18} />
              </div>
              <div>
                <div className="text-xs font-extrabold flex items-center gap-2" style={{ color: t.TEXT_MAIN }}>
                  <span>{lang === "th" ? "ชุดเสียงเอฟเฟกต์ (Sound Effects Themes)" : "Sound Sets & Audio Themes"}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${t.ACCENT}15`, color: t.ACCENT }}
                  >
                    {SOUND_SETS.find((s) => s.id === soundSet)?.icon} {lang === "th" ? SOUND_SETS.find((s) => s.id === soundSet)?.nameTh.split(" ")[0] : SOUND_SETS.find((s) => s.id === soundSet)?.nameEn}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {lang === "th" ? "คลิกเพื่อเลือกธีมเสียงและทดลองฟังเสียงแต่ละแบบ" : "Click to view sound options and preview audio effects"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!sfxEnabled && (
                <span className="hidden sm:inline text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {lang === "th" ? "เสียงปิดอยู่" : "Audio muted"}
                </span>
              )}
              <div
                className={`p-1 rounded-lg text-slate-400 transition-transform duration-200 ${
                  isSoundThemeOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {isSoundThemeOpen && (
            <div className="p-4 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-[11px] text-slate-400 mb-3.5 leading-relaxed">
                {lang === "th"
                  ? "เลือกชุดโทนเสียงสังเคราะห์สำหรับ: ทำนิสัยสำเร็จ 🎯, เลเวลอัป 👑, และการต่อสู้กับบอส ⚔️"
                  : "Choose sound profiles for habit completion 🎯, leveling up 👑, and boss battles ⚔️"}
              </p>

              {/* Sound Set Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {SOUND_SETS.map((set) => {
                  const isSelected = soundSet === set.id;
                  return (
                    <div
                      key={set.id}
                      onClick={() => {
                        onSetSoundSet(set.id);
                        handleTestSound("habit", set.id);
                      }}
                      className="btn-scale p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden"
                      style={{
                        background: isSelected ? t.ACCENT_BG : t.CARD,
                        borderColor: isSelected ? t.ACCENT : t.NEUTRAL_BORDER,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl select-none">{set.icon}</span>
                            <div>
                              <div
                                className="text-xs font-extrabold"
                                style={{ color: isSelected ? t.ACCENT : t.TEXT_MAIN }}
                              >
                                {lang === "th" ? set.nameTh : set.nameEn}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {set.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                                    style={{
                                      background: isSelected ? `${t.ACCENT}25` : t.NEUTRAL_BORDER,
                                      color: isSelected ? t.ACCENT : t.TEXT_MUTED,
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isSelected ? (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                              style={{ background: t.ACCENT }}
                            >
                              <Check size={12} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 leading-normal mt-1.5 line-clamp-2">
                          {lang === "th" ? set.descTh : set.descEn}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold">
                        <span style={{ color: isSelected ? t.ACCENT : t.TEXT_MUTED }}>
                          {isSelected
                            ? (lang === "th" ? "✓ ใช้งานชุดนี้อยู่" : "✓ Active Sound Set")
                            : (lang === "th" ? "คลิกเพื่อเลือก" : "Click to select")}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetSoundSet(set.id);
                            handleTestSound("habit", set.id);
                          }}
                          className="px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-extrabold cursor-pointer transition-transform hover:scale-105"
                          style={{
                            background: isSelected ? t.ACCENT : t.CARD,
                            color: isSelected ? "#fff" : t.ACCENT,
                            border: `1px solid ${t.ACCENT}`,
                          }}
                        >
                          <Play size={9} className="fill-current" />
                          <span>{lang === "th" ? "ฟังตัวอย่าง" : "Preview"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Sound Samples Player for Selected Sound Set */}
              <div
                className="p-3.5 rounded-xl border"
                style={{
                  background: t.CARD,
                  borderColor: t.NEUTRAL_BORDER,
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-extrabold flex items-center gap-1.5" style={{ color: t.ACCENT }}>
                    <Play size={13} className="fill-current" />
                    {lang === "th"
                      ? `ทดลองฟังเสียงในเซ็ต: ${SOUND_SETS.find((s) => s.id === soundSet)?.nameTh.split(" ")[0]}`
                      : `Preview Sounds: ${SOUND_SETS.find((s) => s.id === soundSet)?.nameEn}`}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {lang === "th" ? "กดเพื่อทดสอบเสียงแต่ละสถานการณ์" : "Click each action to audition"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { type: "habit" as const, labelTh: "นิสัยสำเร็จ", labelEn: "Habit Done", icon: "✨" },
                    { type: "boss_hit" as const, labelTh: "โจมตีธรรมดา", labelEn: "Normal Hit", icon: "⚔️" },
                    { type: "boss_crit" as const, labelTh: "คริติคอล!", labelEn: "Critical Hit", icon: "⚡" },
                    { type: "boss_weakness" as const, labelTh: "จุดอ่อนบอส!", labelEn: "Weakness Hit", icon: "🎯" },
                    { type: "levelup" as const, labelTh: "เลเวลอัป", labelEn: "Level Up", icon: "👑" },
                    { type: "boss_defeat" as const, labelTh: "ปราบบอส", labelEn: "Boss Defeat", icon: "🏆" },
                  ].map((sample) => {
                    const isPlaying = activePreviewSound === `${soundSet}-${sample.type}`;
                    return (
                      <button
                        key={sample.type}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestSound(sample.type, soundSet);
                        }}
                        className="btn-scale py-2.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer transition-all"
                        style={{
                          background: isPlaying ? t.ACCENT_BG : t.BG,
                          borderColor: isPlaying ? t.ACCENT : t.NEUTRAL_BORDER,
                          color: isPlaying ? t.ACCENT : t.TEXT_MAIN,
                          boxShadow: isPlaying ? `0 0 12px ${t.ACCENT}40` : "none",
                          transform: isPlaying ? "scale(0.97)" : "scale(1)",
                        }}
                      >
                        <span>{sample.icon}</span>
                        <span className="truncate">{lang === "th" ? sample.labelTh : sample.labelEn}</span>
                        <Play size={10} className={isPlaying ? "fill-current text-rose-500" : "opacity-50"} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Backup, Restore & Download HTML */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={onExportBackup}
              className="btn-scale flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              style={{
                background: t.BG,
                borderColor: t.NEUTRAL_BORDER,
                color: t.TEXT_MAIN,
              }}
            >
              <Download size={15} />
              <span>{lang === "th" ? "ดาวน์โหลดสำรอง (Backup)" : "Export Backup (JSON)"}</span>
            </button>

            <label
              className="btn-scale flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              style={{
                background: t.BG,
                borderColor: t.NEUTRAL_BORDER,
                color: t.TEXT_MAIN,
              }}
            >
              <Upload size={15} />
              <span>{lang === "th" ? "กู้คืนข้อมูล (Restore)" : "Import Backup (JSON)"}</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files?.[0] && onImportBackup(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={onDownloadHtml}
            className="btn-scale w-full py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold cursor-pointer"
            style={{
              background: t.ACCENT_BG,
              borderColor: t.ACCENT,
              color: t.ACCENT,
            }}
          >
            <Code size={15} />
            <span>{lang === "th" ? "ดาวน์โหลดเว็บแอปแบบออฟไลน์ (.html) ไปใช้ที่เครื่อง" : "Download Offline Web App (.html)"}</span>
          </button>
        </div>
      </div>

      {/* 2. Custom Positive Habits (Drag & Drop) - Collapsible */}
      <div style={cardStyle} className="p-5 sm:p-6 shadow-sm transition-all">
        <button
          type="button"
          onClick={() => setIsPositiveHabitsOpen(!isPositiveHabitsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: `${t.GOOD_COLOR}20`, color: t.GOOD_COLOR }}
            >
              <Sparkles size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-extrabold text-sm" style={{ color: t.GOOD_COLOR }}>
                <span>{lang === "th" ? "จัดการรายการนิสัยเชิงบวก (ลากเพื่อจัดลำดับ)" : "Manage Positive Habits (Drag to Reorder)"}</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {positiveHabits.length} {lang === "th" ? "รายการ" : "items"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {lang === "th" ? "คลิกเพื่อดูรายการ ลากจัดลำดับ เพิ่มหรือลบนิสัยเชิงบวก" : "Click to view, drag to reorder, add or remove habits"}
              </div>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 ${
              isPositiveHabitsOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={18} />
          </div>
        </button>

        {isPositiveHabitsOpen && (
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-col gap-2 mb-4">
              {positiveHabits.map((h, index) => (
                <div
                  key={h.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedPosIdx(index);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedPosIdx === null || draggedPosIdx === index) return;
                    const newItems = [...positiveHabits];
                    const item = newItems.splice(draggedPosIdx, 1)[0];
                    newItems.splice(index, 0, item);
                    onUpdatePositiveHabits(newItems);
                    setDraggedPosIdx(null);
                  }}
                  style={{
                    background: draggedPosIdx === index ? t.NEUTRAL_BORDER : t.BG,
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-grab transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-slate-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {h.label}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {TIME_GROUPS.find((g) => g.key === h.time)?.label} • +{h.points} pts
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onRequestConfirm(
                        lang === "th" ? "ลบนิสัย" : "Delete Habit",
                        lang === "th" ? `คุณต้องการลบ "${h.label}" ใช่หรือไม่?` : `Are you sure you want to delete "${h.label}"?`,
                        () => onUpdatePositiveHabits(positiveHabits.filter((x) => x.id !== h.id)),
                        "danger"
                      )
                    }
                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Positive Habit Form */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder={lang === "th" ? "ชื่อนิสัยใหม่..." : "New habit name..."}
                value={newPos.label}
                onChange={(e) => setNewPos({ ...newPos, label: e.target.value })}
                className="flex-1 min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500"
              />
              <input
                type="number"
                placeholder="แต้ม"
                value={newPos.points}
                onChange={(e) => setNewPos({ ...newPos, points: Number(e.target.value) || 20 })}
                className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold outline-none text-center text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500"
              />
              <select
                value={newPos.time}
                onChange={(e) => setNewPos({ ...newPos, time: e.target.value as any })}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold outline-none cursor-pointer text-slate-800 dark:text-slate-100 shadow-sm focus:border-cyan-500"
              >
                <option value="morning">{lang === "th" ? "เช้า" : "Morning"}</option>
                <option value="day">{lang === "th" ? "กลางวัน" : "Day"}</option>
                <option value="evening">{lang === "th" ? "เย็น" : "Evening"}</option>
              </select>
              <button
                onClick={() => {
                  if (newPos.label.trim()) {
                    onUpdatePositiveHabits([...positiveHabits, { ...newPos, id: genId() }]);
                    setNewPos({ label: "", points: 20, time: "morning", priority: "medium" });
                  }
                }}
                style={{ background: t.GOOD_COLOR }}
                className="btn-scale px-3 py-2 rounded-xl text-white font-bold cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Custom Negative Habits (Drag & Drop) - Collapsible */}
      <div style={cardStyle} className="p-5 sm:p-6 shadow-sm transition-all">
        <button
          type="button"
          onClick={() => setIsNegativeHabitsOpen(!isNegativeHabitsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: `${t.BAD_COLOR}20`, color: t.BAD_COLOR }}
            >
              <ShieldAlert size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-extrabold text-sm" style={{ color: t.BAD_COLOR }}>
                <span>{lang === "th" ? "จัดการพฤติกรรมฉุดรั้ง (ลากเพื่อจัดลำดับ)" : "Manage Friction Habits (Drag to Reorder)"}</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {negativeHabits.length} {lang === "th" ? "รายการ" : "items"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {lang === "th" ? "คลิกเพื่อดูรายการ ลากจัดลำดับ เพิ่มหรือลบพฤติกรรมฉุดรั้ง" : "Click to view, drag to reorder, add or remove friction habits"}
              </div>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 ${
              isNegativeHabitsOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={18} />
          </div>
        </button>

        {isNegativeHabitsOpen && (
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-col gap-2 mb-4">
              {negativeHabits.map((h, index) => (
                <div
                  key={h.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedNegIdx(index);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedNegIdx === null || draggedNegIdx === index) return;
                    const newItems = [...negativeHabits];
                    const item = newItems.splice(draggedNegIdx, 1)[0];
                    newItems.splice(index, 0, item);
                    onUpdateNegativeHabits(newItems);
                    setDraggedNegIdx(null);
                  }}
                  style={{
                    background: draggedNegIdx === index ? t.NEUTRAL_BORDER : t.BG,
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-grab transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-slate-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {h.label}
                      </div>
                      <div className="text-[10px] font-bold text-rose-500">-{h.points} pts</div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onRequestConfirm(
                        lang === "th" ? "ลบพฤติกรรม" : "Delete Habit",
                        lang === "th" ? `คุณต้องการลบ "${h.label}" ใช่หรือไม่?` : `Are you sure you want to delete "${h.label}"?`,
                        () => onUpdateNegativeHabits(negativeHabits.filter((x) => x.id !== h.id)),
                        "danger"
                      )
                    }
                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Negative Habit Form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === "th" ? "พฤติกรรมแย่ๆ..." : "Bad habit name..."}
                value={newNeg.label}
                onChange={(e) => setNewNeg({ ...newNeg, label: e.target.value })}
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-800 dark:text-slate-100 shadow-sm focus:border-rose-500"
              />
              <input
                type="number"
                placeholder="โดนหัก"
                value={newNeg.points}
                onChange={(e) => setNewNeg({ ...newNeg, points: Number(e.target.value) || 50 })}
                className="w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold outline-none text-center text-slate-800 dark:text-slate-100 shadow-sm focus:border-rose-500"
              />
              <button
                onClick={() => {
                  if (newNeg.label.trim()) {
                    onUpdateNegativeHabits([...negativeHabits, { ...newNeg, id: genId() }]);
                    setNewNeg({ label: "", points: 50, priority: "medium" });
                  }
                }}
                style={{ background: t.BAD_COLOR }}
                className="btn-scale px-3 py-2 rounded-xl text-white font-bold cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Custom Shop Items - Collapsible */}
      <div style={cardStyle} className="p-5 sm:p-6 shadow-sm transition-all">
        <button
          type="button"
          onClick={() => setIsShopItemsOpen(!isShopItemsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: `${t.ACCENT}20`, color: t.ACCENT }}
            >
              <ShoppingBag size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-extrabold text-sm" style={{ color: t.ACCENT }}>
                <span>{lang === "th" ? "สร้างของรางวัลและสินค้าในร้านค้า" : "Create Custom Shop Rewards"}</span>
                <span
                  className="text-[11px] font-black px-2 py-0.5 rounded-full border"
                  style={{
                    background: `${t.ACCENT}15`,
                    color: t.ACCENT,
                    borderColor: `${t.ACCENT}30`,
                  }}
                >
                  {shopItems.length} {lang === "th" ? "ชิ้น" : "items"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {lang === "th" ? "คลิกเพื่อดูสินค้าในร้านค้า สร้างของรางวัล และกำหนดราคาแต้ม" : "Click to view custom rewards, shop items and pricing"}
              </div>
            </div>
          </div>
          <div
            className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 ${
              isShopItemsOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={18} />
          </div>
        </button>

        {isShopItemsOpen && (
          <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto pr-1">
              {shopItems.map((item) => (
                <div
                  key={item.id}
                  style={{ background: t.BG }}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-2xl"
                >
                  <span className="text-xl select-none">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-extrabold text-rose-500">
                      {item.price.toLocaleString()} pts
                    </div>
                  </div>
                  {item.type !== "freeze" && item.type !== "gacha" && (
                    <button
                      onClick={() =>
                        onRequestConfirm(
                          lang === "th" ? "ลบของรางวัล" : "Delete Reward",
                          lang === "th" ? `คุณต้องการลบ "${item.title}" ใช่หรือไม่?` : `Are you sure you want to delete "${item.title}"?`,
                          () => onUpdateShopItems(shopItems.filter((x) => x.id !== item.id)),
                          "danger"
                        )
                      }
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Shop Item Form */}
            <div style={{ background: t.BG }} className="p-3 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={newShop.icon}
                  onChange={(e) => setNewShop({ ...newShop, icon: e.target.value })}
                  maxLength={2}
                  className="w-14 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder={lang === "th" ? "ชื่อรางวัล..." : "Reward title..."}
                  value={newShop.title}
                  onChange={(e) => setNewShop({ ...newShop, title: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={lang === "th" ? "ราคา (แต้ม)" : "Price (pts)"}
                  value={newShop.price}
                  onChange={(e) => setNewShop({ ...newShop, price: Number(e.target.value) || 100 })}
                  className="w-28 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
                <button
                  onClick={() => {
                    if (newShop.title.trim()) {
                      onUpdateShopItems([
                        ...shopItems,
                        {
                          ...newShop,
                          type: "reward",
                          id: genId(),
                          desc: newShop.desc || "ให้รางวัลตัวเอง",
                        },
                      ]);
                      setNewShop({ title: "", price: 100, icon: "🎁", desc: "" });
                    }
                  }}
                  style={{ background: t.ACCENT }}
                  className="btn-scale flex-1 py-2 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>{lang === "th" ? "เพิ่มรางวัลใหม่" : "Add Reward"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
