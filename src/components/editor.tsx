"use client";
import React from "react";
import CodeEditor from "react-simple-code-editor";

import { useState } from "react";
import hljs from "highlight.js";
import { useCodeValues } from "@/store/code";
import { fonts } from "@/lib/options";
import { cn } from "@/lib/utils";
function Editor() {
  const { fontStyle, fontSize, language } = useCodeValues();
  const [code, setCode] = useState("");
  return (
    <div className="shadow-2xl rounded-xl min-w-[400px] border-gray-800 dark:border-white/20 border-2">
      <header className="grid grid-cols-6 gap-3 items-center py-3 px-4">
        <div className="flex gap-1 5">
          <div className="rounded-full h-3 w-3 bg-red-500 text-sm "></div>
          <div className="rounded-full h-3 w-3 bg-yellow-500 text-sm"></div>
          <div className="rounded-full h-3 w-3 bg-green-500"></div>
        </div>
        <div className="col-span-4 flex justify-center">
          <input
            type="text"
            placeholder="Title"
            className="bg-transparent text-zinc-900 dark:text-white/70  text-center focus:ring-0 focus:outline-none"
          />
        </div>
      </header>
      <div className="px-4 pb-4">
        <CodeEditor
          value={code}
          onValueChange={(code) => {
            setCode(code);
          }}
          style={{
            fontFamily: fonts[fontStyle].name,
            fontSize: fontSize,
          }}
          textareaClassName="bg-transparent text-white/70  focus:outline-none"
          preClassName="bg-transparent"
          highlight={(code) =>
            hljs.highlight(code, {
              language: language,
            }).value
          }
        />
      </div>
    </div>
  );
}

export default Editor;
