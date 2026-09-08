// Storage and notification utilities

import { SoundSetKey, RewardFxConfig } from '../types';

export const STORAGE_KEY = 'equilibrium_habit_tracker_v2';

export interface StorageData {
  logs: Record<string, any>;
  spentPoints: number;
  freezeItems: number;
  inventory: Record<string, number>;
  claimedBadges: string[];
  gachaCount: number;
  dailyQuests: { date: string; ids: string[]; claimed: string[] };
  positiveHabits: any[];
  negativeHabits: any[];
  shopItems: any[];
  bossHp: number;
  bossMaxHp: number;
  bossLevel: number;
  bossXp?: number;
  bossWeaknessId?: string;
  isDarkMode: boolean;
  appTheme: string;
  sfxEnabled: boolean;
  soundSet?: SoundSetKey;
  username: string;
  profilePic: string | null;
  language: 'th' | 'en';
  notificationsEnabled: boolean;
  screenShakeEnabled?: boolean;
  rewardFxConfig?: RewardFxConfig;
}

export function loadLocalData(): Partial<StorageData> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load local data", e);
  }
  return null;
}

export function saveLocalData(data: Partial<StorageData>) {
  try {
    const current = loadLocalData() || {};
    const merged = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error("Failed to save local data", e);
  }
}

export function exportBackupJSON(data: any) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `equilibrium_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export function sendPushNotification(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }
  try {
    new Notification(title, {
      body,
      icon: "https://api.iconify.design/lucide:check-circle.svg?color=%2306b6d4",
    });
  } catch (e) {
    console.warn("Could not trigger notification", e);
  }
}
