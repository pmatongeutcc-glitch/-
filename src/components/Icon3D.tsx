import React from "react";

export type Icon3DColor =
  | "gold"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "amethyst"
  | "cyan"
  | "sunset"
  | "slate"
  | "dark";

export type Icon3DShape = "squircle" | "circle" | "shield" | "pill";
export type Icon3DSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface Icon3DProps {
  children?: React.ReactNode;
  icon?: React.ReactNode | string;
  color?: Icon3DColor;
  shape?: Icon3DShape;
  size?: Icon3DSize;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}

const COLOR_PRESETS: Record<
  Icon3DColor,
  {
    bg: string;
    borderTop: string;
    borderBottom: string;
    ring: string;
    shadow: string;
    text: string;
    glowColor: string;
  }
> = {
  gold: {
    bg: "linear-gradient(135deg, #FFFBEB 0%, #FBBF24 45%, #D97706 85%, #B45309 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(120, 53, 15, 0.7)",
    ring: "rgba(254, 240, 138, 0.5)",
    shadow: "0 8px 18px -4px rgba(217, 119, 6, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(120,53,15,0.4)",
    text: "#78350F",
    glowColor: "rgba(245, 158, 11, 0.4)",
  },
  emerald: {
    bg: "linear-gradient(135deg, #ECFDF5 0%, #34D399 45%, #059669 85%, #047857 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(6, 78, 59, 0.7)",
    ring: "rgba(167, 243, 208, 0.5)",
    shadow: "0 8px 18px -4px rgba(5, 150, 105, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(6,78,59,0.4)",
    text: "#064E3B",
    glowColor: "rgba(16, 185, 129, 0.4)",
  },
  ruby: {
    bg: "linear-gradient(135deg, #FFF1F2 0%, #FB7185 45%, #E11D48 85%, #9F1239 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(136, 19, 55, 0.7)",
    ring: "rgba(254, 205, 211, 0.5)",
    shadow: "0 8px 18px -4px rgba(225, 29, 72, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(136,19,55,0.4)",
    text: "#881337",
    glowColor: "rgba(244, 63, 94, 0.4)",
  },
  sapphire: {
    bg: "linear-gradient(135deg, #EFF6FF 0%, #60A5FA 45%, #2563EB 85%, #1D4ED8 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(30, 58, 138, 0.7)",
    ring: "rgba(191, 219, 254, 0.5)",
    shadow: "0 8px 18px -4px rgba(37, 99, 235, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(30,58,138,0.4)",
    text: "#1E3A8A",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  amethyst: {
    bg: "linear-gradient(135deg, #FAF5FF 0%, #C084FC 45%, #9333EA 85%, #6B21A8 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(88, 28, 135, 0.7)",
    ring: "rgba(233, 213, 255, 0.5)",
    shadow: "0 8px 18px -4px rgba(147, 51, 234, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(88,28,135,0.4)",
    text: "#581C87",
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  cyan: {
    bg: "linear-gradient(135deg, #ECFEFF 0%, #22D3EE 45%, #0891B2 85%, #0E7490 100%)",
    borderTop: "rgba(255, 255, 255, 0.9)",
    borderBottom: "rgba(21, 94, 117, 0.75)",
    ring: "rgba(165, 243, 252, 0.5)",
    shadow: "0 8px 18px -4px rgba(8, 145, 178, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(21,94,117,0.4)",
    text: "#164E63",
    glowColor: "rgba(6, 182, 212, 0.4)",
  },
  sunset: {
    bg: "linear-gradient(135deg, #FFF7ED 0%, #FB923C 45%, #EA580C 85%, #9A3412 100%)",
    borderTop: "rgba(255, 255, 255, 0.85)",
    borderBottom: "rgba(124, 45, 18, 0.7)",
    ring: "rgba(254, 215, 170, 0.5)",
    shadow: "0 8px 18px -4px rgba(234, 88, 12, 0.45), 0 2px 5px rgba(0,0,0,0.12), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(124,45,18,0.4)",
    text: "#7C2D12",
    glowColor: "rgba(249, 115, 22, 0.4)",
  },
  slate: {
    bg: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 85%, #64748B 100%)",
    borderTop: "rgba(255, 255, 255, 0.95)",
    borderBottom: "rgba(51, 65, 85, 0.6)",
    ring: "rgba(226, 232, 240, 0.6)",
    shadow: "0 6px 14px -3px rgba(100, 116, 139, 0.3), 0 2px 4px rgba(0,0,0,0.08), inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(51,65,85,0.3)",
    text: "#1E293B",
    glowColor: "rgba(148, 163, 184, 0.3)",
  },
  dark: {
    bg: "linear-gradient(135deg, #334155 0%, #1E293B 55%, #0F172A 100%)",
    borderTop: "rgba(255, 255, 255, 0.35)",
    borderBottom: "rgba(2, 6, 23, 0.8)",
    ring: "rgba(71, 85, 105, 0.4)",
    shadow: "0 8px 20px -4px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -3px 5px rgba(0,0,0,0.6)",
    text: "#F8FAFC",
    glowColor: "rgba(99, 102, 241, 0.25)",
  },
};

const SIZE_MAP: Record<Icon3DSize, { box: string; iconSize: number; text: string }> = {
  xs: { box: "w-7 h-7 min-w-[28px]", iconSize: 14, text: "text-sm" },
  sm: { box: "w-9 h-9 min-w-[36px]", iconSize: 18, text: "text-base" },
  md: { box: "w-11 h-11 min-w-[44px]", iconSize: 22, text: "text-xl" },
  lg: { box: "w-14 h-14 min-w-[56px]", iconSize: 28, text: "text-2xl" },
  xl: { box: "w-16 h-16 min-w-[64px]", iconSize: 34, text: "text-3xl" },
  "2xl": { box: "w-20 h-20 min-w-[80px]", iconSize: 42, text: "text-4xl" },
};

const SHAPE_MAP: Record<Icon3DShape, string> = {
  squircle: "rounded-[18px]",
  circle: "rounded-full",
  shield: "rounded-b-[24px] rounded-t-[14px]",
  pill: "rounded-full px-3",
};

export const Icon3D: React.FC<Icon3DProps> = ({
  children,
  icon,
  color = "sapphire",
  shape = "squircle",
  size = "md",
  className = "",
  style,
  glow = false,
  active = false,
  onClick,
  title,
}) => {
  const c = COLOR_PRESETS[color] || COLOR_PRESETS.sapphire;
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const shp = SHAPE_MAP[shape] || SHAPE_MAP.squircle;

  const content = icon !== undefined ? icon : children;
  const isEmoji = typeof content === "string" && content.length <= 4;

  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        background: c.bg,
        borderTop: `1.5px solid ${c.borderTop}`,
        borderBottom: `2.5px solid ${c.borderBottom}`,
        boxShadow: active
          ? `${c.shadow}, 0 0 16px 2px ${c.glowColor}`
          : glow
          ? `${c.shadow}, 0 0 12px ${c.glowColor}`
          : c.shadow,
        transform: active ? "scale(1.04) translateY(-1px)" : undefined,
        ...style,
      }}
      className={`relative inline-flex items-center justify-center select-none transition-all duration-200 ${s.box} ${shp} ${
        onClick ? "cursor-pointer active:scale-95 active:translate-y-0.5" : ""
      } ${className}`}
    >
      {/* 3D Chamfer Edge Ring (ตัดขอบ 3D) */}
      <div
        style={{ borderColor: c.ring }}
        className={`absolute inset-0 border pointer-events-none ${shp} opacity-60`}
      />

      {/* Gloss reflection highlight arc */}
      <div
        className={`absolute inset-x-1 top-0.5 h-[40%] bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none ${
          shape === "circle" ? "rounded-t-full" : "rounded-t-[14px]"
        }`}
      />

      {/* Center Icon/Symbol with drop shadow for 3D depth */}
      <div
        style={{
          color: c.text,
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
        }}
        className={`relative z-10 flex items-center justify-center font-bold ${
          isEmoji ? `${s.text} leading-none` : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
};
