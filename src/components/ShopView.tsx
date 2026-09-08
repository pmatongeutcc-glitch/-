import React, { useState, useMemo } from "react";
import { ShoppingBag, Sparkles, Search, Check, Tag, Gift, Utensils, Smile, Trophy, Star } from "lucide-react";
import { ShopItem } from "../types";
import { Icon3D } from "./Icon3D";
import { ThreeDCoin } from "./ThreeDIcons";

interface ShopViewProps {
  wallet: number;
  shopItems: ShopItem[];
  inventory: Record<string, number>;
  freezeItems: number;
  onBuyItem: (item: ShopItem) => void;
  onConsumeItem: (itemId: string) => void;
  t: {
    CARD: string;
    BG: string;
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

type ShopCategory = "all" | "food" | "fun" | "milestone" | "special";

export const ShopView: React.FC<ShopViewProps> = ({
  wallet,
  shopItems,
  inventory,
  freezeItems,
  onBuyItem,
  onConsumeItem,
  t,
  lang,
}) => {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [affordableOnly, setAffordableOnly] = useState(false);

  const cardStyle = {
    background: t.CARD,
    border: `1px solid ${t.NEUTRAL_BORDER}`,
    borderRadius: 28,
    color: t.TEXT_MAIN,
  };

  // Filter items based on category, search query, and affordability
  const filteredItems = useMemo(() => {
    return shopItems.filter((item) => {
      // Category filter
      if (selectedCategory === "special") {
        if (item.type !== "gacha" && item.type !== "freeze" && item.category !== "special") return false;
      } else if (selectedCategory !== "all") {
        if (item.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = (item.desc || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      // Affordability filter
      if (affordableOnly && wallet < item.price) {
        return false;
      }

      return true;
    });
  }, [shopItems, selectedCategory, searchQuery, affordableOnly, wallet]);

  const affordableCount = useMemo(() => {
    return shopItems.filter((item) => wallet >= item.price).length;
  }, [shopItems, wallet]);

  const categories: { id: ShopCategory; labelTh: string; labelEn: string; icon: any }[] = [
    { id: "all", labelTh: "ทั้งหมด", labelEn: "All", icon: Star },
    { id: "food", labelTh: "ของกิน & คาเฟ่", labelEn: "Food & Drinks", icon: Utensils },
    { id: "fun", labelTh: "พักผ่อน & บันเทิง", labelEn: "Relax & Fun", icon: Smile },
    { id: "milestone", labelTh: "เป้าหมายใหญ่", labelEn: "Milestones", icon: Trophy },
    { id: "special", labelTh: "ไอเทมพิเศษ", labelEn: "Special Items", icon: Sparkles },
  ];

  return (
    <div className="pb-24">
      {/* Wallet Balance Hero Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${t.GOOD_COLOR}, #FF9A80)`,
          borderRadius: 32,
        }}
        className="p-7 text-white mb-5 text-center shadow-xl shadow-rose-500/20 bevel-cut-3d relative overflow-hidden"
      >
        <div className="text-xs font-black opacity-95 mb-1 tracking-wider uppercase">
          {lang === "th" ? "แต้มสะสมที่ใช้ได้สำหรับแลกรางวัล" : "Available Reward Points"}
        </div>
        <div className="flex items-center justify-center gap-3 my-1">
          <ThreeDCoin size={40} />
          <span className="text-5xl font-black tracking-tight leading-none drop-shadow-md">
            {wallet.toLocaleString()}
          </span>
          <span className="text-sm font-black opacity-90 self-end mb-1">pts</span>
        </div>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
          <Sparkles size={14} className="text-amber-200 animate-pulse" />
          <span>
            {lang === "th"
              ? `แลกรางวัลได้ทันที ${affordableCount} รายการ`
              : `${affordableCount} items affordable right now`}
          </span>
        </div>
      </div>

      {/* Inventory / Bag Section */}
      {(Object.keys(inventory).length > 0 || freezeItems > 0) && (
        <div style={cardStyle} className="p-5 mb-5 shadow-md bevel-cut-3d">
          <div className="flex items-center gap-2 font-black text-sm mb-3.5">
            <ShoppingBag size={18} style={{ color: t.GOOD_COLOR }} />
            <span>
              {lang === "th"
                ? "กระเป๋าของรางวัลที่คุณเป็นเจ้าของ (กดเพื่อใช้สิทธิ์):"
                : "Your Reward Inventory (Tap to use):"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {freezeItems > 0 && (
              <div
                className="relative p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border-t border-white/60 border-b-2 border-cyan-800/30 flex items-center gap-2.5 shadow-sm"
                title="Streak Freeze"
              >
                <Icon3D icon="❄️" color="cyan" size="sm" shape="squircle" />
                <div className="text-xs font-black text-cyan-700 dark:text-cyan-300">
                  {lang === "th" ? "แช่แข็งสตรีค" : "Freeze"} x{freezeItems}
                </div>
              </div>
            )}

            {Object.entries(inventory).map(([id, qty]) => {
              const count = Number(qty) || 0;
              if (count <= 0) return null;
              const item = shopItems.find((i) => i.id === id);
              if (!item) return null;

              return (
                <button
                  key={id}
                  onClick={() => onConsumeItem(id)}
                  className="btn-scale relative p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-t border-white/60 border-b-2 border-slate-400/40 flex items-center gap-2.5 cursor-pointer text-left hover:border-rose-400 shadow-sm"
                >
                  <Icon3D icon={item.icon} color="sunset" size="sm" shape="squircle" />
                  <div>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 max-w-[120px] truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-black text-rose-500">
                      {lang === "th" ? "คงเหลือ" : "Owned"}: x{count} ({lang === "th" ? "กดใช้" : "Use"})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs & Filter Toolbar */}
      <div className="mb-4 space-y-3">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: isSelected ? t.GOOD_COLOR : t.CARD,
                  color: isSelected ? "#FFFFFF" : t.TEXT_MUTED,
                  borderColor: isSelected ? t.GOOD_COLOR : t.NEUTRAL_BORDER,
                }}
                className={`btn-scale flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black border transition-all whitespace-nowrap shadow-sm cursor-pointer ${
                  isSelected ? "shadow-rose-500/20" : "hover:border-rose-300"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-white" : "text-slate-400"} />
                <span>{lang === "th" ? cat.labelTh : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Affordability Bar */}
        <div className="flex items-center gap-2">
          <div
            style={{ background: t.CARD, borderColor: t.NEUTRAL_BORDER }}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm"
          >
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={lang === "th" ? "ค้นหาของรางวัล..." : "Search rewards..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-bold outline-none w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setAffordableOnly(!affordableOnly)}
            style={{
              background: affordableOnly ? t.GOOD_BG : t.CARD,
              borderColor: affordableOnly ? t.GOOD_COLOR : t.NEUTRAL_BORDER,
              color: affordableOnly ? t.GOOD_COLOR : t.TEXT_MUTED,
            }}
            className="btn-scale flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <span
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] font-black ${
                affordableOnly
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              {affordableOnly ? "✓" : ""}
            </span>
            <span className="hidden sm:inline">
              {lang === "th" ? "เฉพาะที่แต้มพอ" : "Affordable only"}
            </span>
            <span className="sm:hidden">{lang === "th" ? "แต้มพอ" : "Can Buy"}</span>
          </button>
        </div>
      </div>

      {/* Filter Stats Header */}
      <div className="flex justify-between items-center px-1 mb-3 text-xs font-extrabold text-slate-400">
        <span>
          {lang === "th"
            ? `พบของรางวัล ${filteredItems.length} รายการ`
            : `${filteredItems.length} rewards found`}
        </span>
        {affordableOnly && (
          <span className="text-rose-500 font-bold">
            {lang === "th" ? "กรองเฉพาะแต้มถึง ✨" : "Affordable filter active ✨"}
          </span>
        )}
      </div>

      {/* Shop Items Grid */}
      {filteredItems.length === 0 ? (
        <div
          style={cardStyle}
          className="p-8 text-center rounded-3xl shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-4xl">🔍</span>
          <span className="text-sm font-extrabold">
            {lang === "th" ? "ไม่พบของรางวัลที่ค้นหา" : "No rewards match your filter"}
          </span>
          <p className="text-xs text-slate-400 max-w-xs">
            {lang === "th"
              ? "ลองเปลี่ยนคำค้นหา หรือปิดตัวกรอง 'เฉพาะที่แต้มพอ'"
              : "Try adjusting your search query or unchecking 'Affordable only'"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const canBuy = wallet >= item.price;
            const isGacha = item.type === "gacha";
            const ownedQty = inventory[item.id] || 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  ...cardStyle,
                  border: isGacha
                    ? `2px solid ${t.GOOD_COLOR}`
                    : canBuy
                    ? `1.5px solid ${t.GOOD_COLOR}40`
                    : `1px solid ${t.NEUTRAL_BORDER}`,
                  borderTop: "1.5px solid rgba(255,255,255,0.7)",
                  borderBottom: "2px solid rgba(0,0,0,0.12)",
                  boxShadow: isGacha
                    ? "0 10px 25px -4px rgba(244,63,94,0.25), inset 0 1px 2px rgba(255,255,255,0.8)"
                    : canBuy
                    ? "0 6px 16px -4px rgba(244,63,94,0.15), inset 0 1px 1px rgba(255,255,255,0.8)"
                    : "0 4px 12px -4px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.8)",
                }}
                className="btn-scale p-3.5 text-center flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all relative overflow-hidden"
              >
                {/* Hot Gacha Badge or Owned Badge */}
                {isGacha ? (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #EF4444, #BE123C)",
                      boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                    }}
                    className="absolute top-2 right-2 text-[9px] font-black text-white px-2 py-0.5 rounded-full"
                  >
                    HOT 🔥
                  </div>
                ) : ownedQty > 0 ? (
                  <div
                    style={{
                      background: t.GOOD_COLOR,
                    }}
                    className="absolute top-2 right-2 text-[9px] font-black text-white px-2 py-0.5 rounded-full shadow-sm"
                  >
                    {lang === "th" ? `มี x${ownedQty}` : `x${ownedQty}`}
                  </div>
                ) : null}

                {/* 3D Icon */}
                <div className="my-2.5 flex justify-center">
                  <Icon3D
                    icon={item.icon}
                    size="xl"
                    color={
                      isGacha
                        ? "ruby"
                        : item.type === "freeze"
                        ? "cyan"
                        : item.price >= 2000
                        ? "gold"
                        : item.price >= 1000
                        ? "amethyst"
                        : item.price >= 400
                        ? "sunset"
                        : "sapphire"
                    }
                    shape="squircle"
                    glow={isGacha || item.price >= 2000}
                  />
                </div>

                {/* Title */}
                <div
                  className={`text-xs font-black mb-1 flex-1 line-clamp-2 tracking-tight ${
                    isGacha ? "text-rose-500" : ""
                  }`}
                >
                  {item.title}
                </div>

                {/* Description hint */}
                <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-2.5">
                  {item.desc}
                </div>

                {/* Price Pill Button */}
                <div
                  style={{
                    background: canBuy ? t.GOOD_BG : t.BG,
                    color: canBuy ? t.GOOD_COLOR : t.TEXT_MUTED,
                    borderTop: "1px solid rgba(255,255,255,0.6)",
                    borderBottom: "1.5px solid rgba(0,0,0,0.1)",
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-black py-2 px-3 rounded-2xl transition-all shadow-sm"
                >
                  <ThreeDCoin size={14} />
                  <span>{item.price.toLocaleString()}</span>
                  {canBuy && (
                    <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded-md ml-0.5">
                      {lang === "th" ? "แลกได้" : "Ready"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buy Confirmation Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: t.CARD,
              color: t.TEXT_MAIN,
              borderRadius: 32,
            }}
            className="modal-pop w-full max-w-sm p-6 shadow-2xl relative text-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-3 select-none drop-shadow-md">{selectedItem.icon}</div>
            <h3 className="text-xl font-extrabold mb-1">{selectedItem.title}</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">{selectedItem.desc}</p>

            {/* Price & Balance Calculation Card */}
            <div
              style={{ background: t.BG }}
              className="p-3.5 rounded-2xl mb-5 text-left border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-bold"
            >
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{lang === "th" ? "แต้มที่คุณมีปัจจุบัน" : "Your Current Balance"}:</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <ThreeDCoin size={14} />
                  {wallet.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{lang === "th" ? "ราคาของรางวัลนี้" : "Reward Cost"}:</span>
                <span className="font-extrabold text-rose-500 flex items-center gap-1">
                  - {selectedItem.price.toLocaleString()} pts
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center">
                <span>{lang === "th" ? "แต้มคงเหลือหลังแลก" : "Balance After Purchase"}:</span>
                <span
                  className={`font-black flex items-center gap-1 ${
                    wallet >= selectedItem.price ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  <ThreeDCoin size={14} />
                  {wallet >= selectedItem.price
                    ? `${(wallet - selectedItem.price).toLocaleString()} pts`
                    : lang === "th"
                    ? `ขาดอีก ${(selectedItem.price - wallet).toLocaleString()} แต้ม`
                    : `Need ${(selectedItem.price - wallet).toLocaleString()} more`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onBuyItem(selectedItem);
                setSelectedItem(null);
              }}
              disabled={wallet < selectedItem.price}
              style={{
                background: wallet >= selectedItem.price ? t.GOOD_COLOR : t.NEUTRAL_BORDER,
                color: wallet >= selectedItem.price ? "#FFF" : t.TEXT_MUTED,
              }}
              className={`btn-scale w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-all ${
                wallet >= selectedItem.price ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
            >
              {wallet >= selectedItem.price
                ? lang === "th"
                  ? `ยืนยันแลกรางวัล (${selectedItem.price.toLocaleString()} แต้ม)`
                  : `Redeem Reward (${selectedItem.price.toLocaleString()} pts)`
                : lang === "th"
                ? `แต้มไม่พอ (ขาดอีก ${(selectedItem.price - wallet).toLocaleString()} แต้ม)`
                : `Insufficient Points (Need ${(selectedItem.price - wallet).toLocaleString()} more)`}
            </button>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-3.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer block w-full text-center"
            >
              {lang === "th" ? "ยกเลิก" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
