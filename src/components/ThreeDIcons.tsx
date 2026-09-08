import React from "react";

interface SvgIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 3D Golden Coin with relief bevels, milled rim, embossed center star, and specular highlights
 */
export const ThreeDCoin: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_6px_rgba(217,119,6,0.35)] ${className}`}
    style={style}
  >
    <defs>
      {/* Outer coin body gradient */}
      <linearGradient id="coinGoldBase" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      {/* Inner relief well gradient */}
      <linearGradient id="coinInnerWell" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="85%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FDE047" />
      </linearGradient>

      {/* Specular rim highlight */}
      <linearGradient id="coinRimHighlight" x1="8" y1="6" x2="32" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#FEF08A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </linearGradient>

      {/* Star gradient */}
      <linearGradient id="coinStar" x1="18" y1="16" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    {/* Bottom 3D depth lip */}
    <circle cx="24" cy="25.5" r="19" fill="#78350F" />
    <circle cx="24" cy="25" r="19" fill="#92400E" />

    {/* Main coin disc */}
    <circle cx="24" cy="23.5" r="19" fill="url(#coinGoldBase)" stroke="#B45309" strokeWidth="1.2" />

    {/* Milled coin rim / outer bevel cut */}
    <circle cx="24" cy="23.5" r="16.5" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeOpacity="0.8" />
    <circle cx="24" cy="23.5" r="15" fill="url(#coinInnerWell)" stroke="#78350F" strokeWidth="0.8" />

    {/* Specular sheen on rim */}
    <path
      d="M10 21C11.5 13.5 18 8 26 8C30.5 8 34.5 9.8 37 13"
      stroke="url(#coinRimHighlight)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Center 3D embossed Star */}
    <path
      d="M24 14.5L26.3 20L32 20.4L27.6 24.1L29 29.8L24 26.7L19 29.8L20.4 24.1L16 20.4L21.7 20L24 14.5Z"
      fill="url(#coinStar)"
      stroke="#78350F"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Center glint sparkle */}
    <circle cx="24" cy="23.5" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 3D Layered Flame with ruby mantle, blazing amber belly, and white-hot heart
 */
export const ThreeDFire: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(239,68,68,0.45)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="fireOuter" x1="10" y1="6" x2="38" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="35%" stopColor="#EF4444" />
        <stop offset="70%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>

      <linearGradient id="fireMid" x1="16" y1="12" x2="32" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="40%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>

      <linearGradient id="fireCore" x1="20" y1="20" x2="28" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>

    {/* 3D shadow foundation */}
    <path
      d="M24 4C24 4 10 18 10 30C10 38 16 44 24 44C32 44 38 38 38 30C38 18 24 4 24 4Z"
      fill="#450A0A"
      transform="translate(0, 2)"
      opacity="0.4"
    />

    {/* Outer flame body */}
    <path
      d="M24 4C24 4 11 18 11 29.5C11 37 16.8 43 24 43C31.2 43 37 37 37 29.5C37 19.5 28.5 13 28.5 13C28.5 13 32 20 29 23C27 25 24 22 24 22C24 22 24.5 14 24 4Z"
      fill="url(#fireOuter)"
      stroke="#B91C1C"
      strokeWidth="0.8"
    />

    {/* Specular edge cut */}
    <path
      d="M13 28C13 20 20 11 24 6"
      stroke="#FECACA"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Mid flame tongue */}
    <path
      d="M24 16C24 16 16 23 16 31C16 35.5 19.5 39 24 39C28.5 39 32 35.5 32 31C32 25 27 21 27 21C27 21 28.5 25 26.5 27C25 28.5 24 27 24 27C24 27 24.5 21 24 16Z"
      fill="url(#fireMid)"
    />

    {/* Inner incandescent core */}
    <path
      d="M24 24C24 24 19.5 28.5 19.5 33C19.5 35.8 21.5 37.5 24 37.5C26.5 37.5 28.5 35.8 28.5 33C28.5 29.5 25.5 27 25.5 27C25.5 27 26 29 25 30C24.3 30.7 24 30 24 30C24 30 24.2 26.5 24 24Z"
      fill="url(#fireCore)"
    />
  </svg>
);

/**
 * 3D Golden Trophy Cup with jewel highlights, beveled chalice, and marble pedestal
 */
export const ThreeDTrophy: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(217,119,6,0.35)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="trophyCup" x1="12" y1="6" x2="36" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>

      <linearGradient id="trophyBase" x1="14" y1="36" x2="34" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>

      <linearGradient id="trophyGem" x1="22" y1="12" x2="26" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* Handles Left & Right (3D bevels) */}
    <path
      d="M14 10C8 10 7 19 13 23C15 24.5 17 25 17 25"
      stroke="#D97706"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M14 10C8 10 7 19 13 23C15 24.5 17 25 17 25"
      stroke="#FEF08A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    <path
      d="M34 10C40 10 41 19 35 23C33 24.5 31 25 31 25"
      stroke="#B45309"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M34 10C40 10 41 19 35 23C33 24.5 31 25 31 25"
      stroke="#FDE047"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Main Cup Chalice */}
    <path
      d="M13 7H35C35 7 34 23 24 25C14 23 13 7 13 7Z"
      fill="url(#trophyCup)"
      stroke="#78350F"
      strokeWidth="1"
    />

    {/* Cup Rim Bevel */}
    <ellipse cx="24" cy="7" rx="11" ry="3.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
    <ellipse cx="24" cy="7" rx="9" ry="2.2" fill="#F59E0B" />

    {/* Center Gem on cup */}
    <polygon points="24,12 27,15.5 24,19 21,15.5" fill="url(#trophyGem)" stroke="#0E7490" strokeWidth="0.6" />
    <circle cx="23.5" cy="14.5" r="0.8" fill="#FFFFFF" />

    {/* Stem & Knop */}
    <path d="M22 25H26V32H22V25Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
    <ellipse cx="24" cy="28.5" rx="3.5" ry="1.5" fill="#FEF08A" />

    {/* Pedestal Base */}
    <path
      d="M16 35H32L34 43H14L16 35Z"
      fill="url(#trophyBase)"
      stroke="#334155"
      strokeWidth="1"
    />
    <rect x="18" y="37.5" width="12" height="3.5" rx="1" fill="#FEF08A" stroke="#B45309" strokeWidth="0.6" />

    {/* Golden highlight streak */}
    <path
      d="M16 11C16.5 17 19 22 23 24"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

/**
 * 3D Battle Shield with beveled chamfer rim and embossed knight crest
 */
export const ThreeDShield: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="shieldPlate" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="35%" stopColor="#2563EB" />
        <stop offset="85%" stopColor="#1E40AF" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>

      <linearGradient id="shieldRim" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>

      <linearGradient id="shieldInsignia" x1="20" y1="14" x2="28" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    {/* 3D Depth back */}
    <path
      d="M24 6L38 11V23C38 32.5 32 39.5 24 43.5C16 39.5 10 32.5 10 23V11L24 6Z"
      fill="#172554"
      transform="translate(0, 2)"
    />

    {/* Main Shield Body */}
    <path
      d="M24 5L38 10V22C38 31.5 32 38.5 24 42.5C16 38.5 10 31.5 10 22V10L24 5Z"
      fill="url(#shieldPlate)"
      stroke="url(#shieldRim)"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Inner Beveled Recess */}
    <path
      d="M24 9L34 13V21.5C34 29 29.5 35 24 38C18.5 35 14 29 14 21.5V13L24 9Z"
      fill="#1E3A8A"
      opacity="0.4"
      stroke="#93C5FD"
      strokeWidth="1"
    />

    {/* Specular Left Rim Highlight */}
    <path
      d="M12 11V21C12 28.5 17 35 24 40.5"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Center 3D Golden Cross / Emblem */}
    <path
      d="M22 13H26V19H32V23H26V32H22V23H16V19H22V13Z"
      fill="url(#shieldInsignia)"
      stroke="#B45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 3D Bullseye Archery Target with concentric beveled rings and center ruby
 */
export const ThreeDTarget: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(239,68,68,0.3)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="targetRed" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="targetWhite" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="80%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>

    {/* 3D Depth */}
    <circle cx="24" cy="25.5" r="19" fill="#7F1D1D" />

    {/* Outer Ring */}
    <circle cx="24" cy="24" r="19" fill="url(#targetRed)" stroke="#B91C1C" strokeWidth="1" />
    <circle cx="24" cy="24" r="18" stroke="#FECACA" strokeWidth="1" opacity="0.6" fill="none" />

    {/* White Ring */}
    <circle cx="24" cy="24" r="13.5" fill="url(#targetWhite)" stroke="#94A3B8" strokeWidth="0.8" />

    {/* Inner Red Ring */}
    <circle cx="24" cy="24" r="8" fill="url(#targetRed)" stroke="#991B1B" strokeWidth="0.8" />

    {/* Bullseye Gold Pip */}
    <circle cx="24" cy="24" r="3.2" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
    <circle cx="23" cy="23" r="1" fill="#FFFFFF" />

    {/* Top-left gloss sheen */}
    <path
      d="M10 21C11.5 14.5 17 9.5 24 9.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

/**
 * 3D Royal Crown with ruby, sapphire, and emerald gems
 */
export const ThreeDCrown: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(245,158,11,0.4)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="crownGold" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>

    {/* Crown Base Shadow */}
    <path
      d="M8 32H40L38 37H10L8 32Z"
      fill="#78350F"
      transform="translate(0, 1.5)"
    />

    {/* Crown Body with 5 Spikes */}
    <path
      d="M8 32L11 16L19 24L24 10L29 24L37 16L40 32H8Z"
      fill="url(#crownGold)"
      stroke="#78350F"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Base Band with Bevel */}
    <rect x="8" y="31" width="32" height="6.5" rx="2" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
    <line x1="9" y1="32.5" x2="39" y2="32.5" stroke="#FEF08A" strokeWidth="1.2" />

    {/* Gems on Base Band */}
    <circle cx="14" cy="34" r="1.8" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />
    <circle cx="24" cy="34" r="2.2" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="0.5" />
    <circle cx="34" cy="34" r="1.8" fill="#10B981" stroke="#064E3B" strokeWidth="0.5" />

    {/* Pearls on Spikes */}
    <circle cx="11" cy="16" r="2.2" fill="#FEF08A" stroke="#B45309" strokeWidth="0.6" />
    <circle cx="24" cy="10" r="3" fill="#FFFBEB" stroke="#B45309" strokeWidth="0.8" />
    <circle cx="37" cy="16" r="2.2" fill="#FEF08A" stroke="#B45309" strokeWidth="0.6" />

    {/* Specular Highlights */}
    <circle cx="23" cy="9" r="1" fill="#FFFFFF" />
    <path d="M12 20L18 26" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
  </svg>
);

/**
 * 3D Electric Lightning Bolt with glowing neon facets
 */
export const ThreeDZap: React.FC<SvgIconProps> = ({ size = 28, className = "", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(234,179,8,0.45)] ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="zapLight" x1="14" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <linearGradient id="zapDark" x1="16" y1="8" x2="32" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <polygon
      points="27,4 12,25 23,25 18,44 36,21 25,21"
      fill="#713F12"
      transform="translate(1, 2)"
    />

    {/* Main Bolt */}
    <polygon
      points="27,4 12,25 23,25 18,44 36,21 25,21"
      fill="url(#zapLight)"
      stroke="#A16207"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* 3D Depth facet */}
    <polygon
      points="25,21 36,21 18,44 24,29"
      fill="url(#zapDark)"
      opacity="0.6"
    />

    {/* Specular edge */}
    <line x1="26" y1="6" x2="14" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 3D Podium Medal for Leaderboard (Gold / Silver / Bronze)
 */
export const ThreeDMedal: React.FC<SvgIconProps & { rank: 1 | 2 | 3 }> = ({
  rank,
  size = 32,
  className = "",
  style,
}) => {
  const isGold = rank === 1;
  const isSilver = rank === 2;

  const ribbonColor = isGold ? "#DC2626" : isSilver ? "#2563EB" : "#D97706";
  const medalBase = isGold
    ? ["#FFFBEB", "#FDE047", "#D97706", "#78350F"]
    : isSilver
    ? ["#F8FAFC", "#E2E8F0", "#94A3B8", "#475569"]
    : ["#FFEDD5", "#FB923C", "#C2410C", "#7C2D12"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] ${className}`}
      style={style}
    >
      <defs>
        <linearGradient id={`medalGrad_${rank}`} x1="12" y1="14" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={medalBase[0]} />
          <stop offset="30%" stopColor={medalBase[1]} />
          <stop offset="70%" stopColor={medalBase[2]} />
          <stop offset="100%" stopColor={medalBase[3]} />
        </linearGradient>
      </defs>

      {/* Ribbons */}
      <polygon points="17,4 24,20 19,22 11,6" fill={ribbonColor} />
      <polygon points="31,4 24,20 29,22 37,6" fill={ribbonColor} opacity="0.85" />

      {/* Medal Body */}
      <circle cx="24" cy="30" r="14" fill="#334155" transform="translate(0, 1.5)" opacity="0.4" />
      <circle cx="24" cy="29" r="14" fill={`url(#medalGrad_${rank})`} stroke="#475569" strokeWidth="0.8" />
      <circle cx="24" cy="29" r="11" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.7" />

      {/* Rank text */}
      <text
        x="24"
        y="35"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="0.6"
        style={{ fontFamily: "'Kanit', sans-serif" }}
      >
        {rank}
      </text>

      {/* Top glint */}
      <path
        d="M14 26C15 20 19 16 25 16"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};
