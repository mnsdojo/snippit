import { persist, createJSONStorage } from "zustand/middleware";

interface Code {
  code: string;
  title: string;
  isDark: boolean;
  language: string;
  fontSize: 18;
  fontStyle: "jetbrainsMono";
  padding: 64;
}
