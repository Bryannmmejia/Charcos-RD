import { create } from 'zustand';

interface SettingsState {
  darkMode: boolean;
  rainingAlert: boolean;
  setDarkMode: (value: boolean) => void;
  setRainingAlert: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: true,
  rainingAlert: false,
  setDarkMode: (value) => set({ darkMode: value }),
  setRainingAlert: (value) => set({ rainingAlert: value })
}));
