"use client";
import Editor from "@/components/editor";
import MenuBar from "@/components/menubar";
import { fonts, themes } from "@/lib/options";
import { useCodeValues } from "@/store/code";
import { useRef } from "react";
function Page() {
  const { fontStyle, theme } = useCodeValues();
  const editorRef = useRef<HTMLDivElement>(null);
  return (
    <main className="flex flex-col relative h-[100vh] justify-center items-center">
      <link rel="stylesheet" href={themes[theme].theme} />
      <link
        rel="stylesheet"
        href={fonts[fontStyle]?.src}
        crossOrigin="anonymous"
      />
      <div ref={editorRef} className="z-0">
        <Editor />
      </div>
      <div className="absolute top-[80%] z-10">
        <MenuBar reff={editorRef} />
      </div>
    </main>
  );
}

export default Page;
