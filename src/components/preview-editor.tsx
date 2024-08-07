import React from "react";
import CodeEditor from "react-simple-code-editor";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { fonts } from "@/lib/options";
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiRust,
  SiGo,
  SiRuby,
  SiPhp,
  SiCsharp,
  SiSwift,
  SiKotlin,
  SiTypescript,
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

interface PreviewEditorProps {
  title: string;
  code: string;
  language: string;
  fontStyle: string;
}

const languageIcons: { [key: string]: React.ElementType } = {
  javascript: SiJavascript,
  python: SiPython,
  cpp: SiCplusplus,
  rust: SiRust,
  go: SiGo,
  ruby: SiRuby,
  php: SiPhp,
  csharp: SiCsharp,
  swift: SiSwift,
  kotlin: SiKotlin,
  typescript: SiTypescript,
};

export default function PreviewEditor({
  code,
  fontStyle,
  language,
  title,
}: PreviewEditorProps) {
  const normalizedLanguage = language.toLowerCase();
  const LanguageIcon = languageIcons[normalizedLanguage] || FaCode;

  const highlightCode = (code: string) => {
    try {
      return hljs.highlight(code, {
        language: normalizedLanguage,
      }).value;
    } catch (error) {
      console.warn(
        `Language '${normalizedLanguage}' not supported, falling back to plain text`
      );
      return hljs.highlightAuto(code).value;
    }
  };

  return (
    <div className="shadow-2xl rounded-xl min-w-[400px] border-gray-800 dark:border-white/20 border-2 relative">
      <header className="grid grid-cols-6 gap-3 items-center py-3 px-4">
        <div className="flex gap-1.5">
          <div className="rounded-full h-3 w-3 bg-red-500"></div>
          <div className="rounded-full h-3 w-3 bg-yellow-500"></div>
          <div className="rounded-full h-3 w-3 bg-green-500"></div>
        </div>
        <div className="col-span-4 flex justify-center items-center">
          <input
            defaultValue={title}
            type="text"
            placeholder="Title"
            readOnly
            className="bg-transparent text-zinc-900 dark:text-white/70 text-center focus:ring-0 focus:outline-none"
          />
        </div>
      </header>
      <div className="absolute top-3 right-4">
        <LanguageIcon className="w-5 h-5 text-zinc-600 dark:text-white/50" />
      </div>
      <div className="px-4 pb-4">
        <CodeEditor
          onValueChange={() => {}}
          value={code}
          style={{
            fontFamily: fonts[fontStyle].name,
            fontSize: 14,
          }}
          textareaClassName="bg-transparent text-white/70 focus:outline-none"
          preClassName="bg-transparent"
          highlight={highlightCode}
        />
      </div>
    </div>
  );
}
