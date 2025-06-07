const SETTINGS_KEY = 'settings';

interface Settings {
  mode: 'light' | 'dark';
  menuCollapsed: boolean;
}

const defaultSettings: Settings = {
  mode: 'light',
  menuCollapsed: false,
};

export interface LocalStorageUtil {
  set<T = any>(key: string, value: T): void;
  get<T = any>(key: string): T | null;
  remove(key: string): void;
  getSettings(): Settings;
  setSettings(settings: Partial<Settings>): void;
  clearSettings(): void;
  getMode(): Settings['mode'];
  setMode(mode: Settings['mode']): void;
}

export const localStorageUtil: LocalStorageUtil = {
  set<T>(key: string, value: T): void {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  },

  get<T = any>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  getSettings(): Settings {
    return localStorageUtil.get(SETTINGS_KEY) ?? defaultSettings;
  },

  setSettings(settings: Partial<Settings>): void {
    const current = localStorageUtil.getSettings();
    const updated = { ...current, ...settings };
    localStorageUtil.set(SETTINGS_KEY, updated);
  },

  clearSettings(): void {
    localStorageUtil.remove(SETTINGS_KEY); // fixed this
  },

  getMode(): Settings['mode'] {
    return localStorageUtil.getSettings().mode;
  },

  setMode(mode: Settings['mode']): void {
    localStorageUtil.setSettings({ mode });
  },
};
