const SETTINGS_KEY = 'settings';

interface Settings {
  mode: 'light' | 'dark';
  // add more preferences here as needed
}

const defaultSettings: Settings = {
  mode: 'light',
};

export interface LocalStorageUtil {
  set(key: string, value: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  getSettings(): Settings;
  setSettings(settings: Partial<Settings>): void;
  clearSettings(): void;
  getMode(): Settings['mode'];
  setMode(mode: Settings['mode']): void;
}

export const localStorageUtil: LocalStorageUtil = {
  set(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  get(key: string): string | null {
    return localStorage.getItem(key);
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  getSettings(): Settings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  setSettings(settings: Partial<Settings>) {
    const current = localStorageUtil.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  },

  clearSettings() {
    localStorage.removeItem(SETTINGS_KEY);
  },

  getMode(): Settings['mode'] {
    return localStorageUtil.getSettings().mode;
  },

  setMode(mode: Settings['mode']) {
    localStorageUtil.setSettings({ mode });
  },
};
