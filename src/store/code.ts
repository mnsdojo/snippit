"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { codeSnippets } from "@/lib/options";

interface CodeSnippetState {
  code: string;
  title: string;
  isDark: boolean;
  language: string;
  isLanguageDetectionEnabled: boolean;
  fontSize: number;
  fontStyle: string;
  theme: string;
  padding: number;
}

const initialState: CodeSnippetState = {
  isLanguageDetectionEnabled: false,
  code: codeSnippets[0].code,
  title: "Title",
  isDark: true,
  language: codeSnippets[1].language,
  theme: "hyper",
  fontSize: 18,
  fontStyle: "jetBrainsMono",
  padding: 64,
};

type CodeSnippetActions = {
  updateCode: (code: string) => void;
  updateTitle: (title: string) => void;
  toggleLanguageDetection: () => void;
  toggleDarkMode: () => void;
  updateLanguage: (language: string) => void;
  updateTheme: (theme: string) => void;
  updateFontSize: (fontSize: number) => void;
  updateFontStyle: (fontStyle: "jetbrainsMono") => void;
  updatePadding: (padding: number) => void;
};

type CodeSnippetStore = CodeSnippetState & {
  actions: CodeSnippetActions;
};

export const useCodeSnippetStore = create(
  persist<CodeSnippetStore>(
    (set, get): CodeSnippetStore => ({
      ...initialState,
      actions: {
        toggleLanguageDetection: () =>
          set((state) => ({
            isLanguageDetectionEnabled: !state.isLanguageDetectionEnabled,
          })),
        updateCode: (code) => set({ code }),
        updateTitle: (title) => set({ title }),
        toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
        updateLanguage: (language) => set({ language }),
        updateTheme: (theme) => set({ theme }),
        updateFontSize: (fontSize) => set({ fontSize }),
        updateFontStyle: (fontStyle) => set({ fontStyle }),
        updatePadding: (padding) => set({ padding }),
      },
    }),
    {
      name: "code-snippet-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useCodeValues = () => useCodeSnippetStore((state) => state);
export const useCodeActions = () =>
  useCodeSnippetStore((state) => state.actions);
