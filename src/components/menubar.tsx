import { CameraIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { fonts, languages } from "@/lib/options";
import React, { RefObject, useEffect } from "react";
import { ModeToggle } from "./mode-toggle";
import flourite from "flourite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCodeActions, useCodeValues } from "@/store/code";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { toJpeg, toPng, toSvg } from "html-to-image";
import toast from "react-hot-toast";
const FontSelector = () => {
  const { fontStyle } = useCodeValues();
  const { updateFontStyle } = useCodeActions();
  return (
    <div>
      <Select
        onValueChange={(e) => {
          updateFontStyle(e);
        }}
      >
        <SelectTrigger className=" border-none px-2 w-[200px] text-center flex justify-center gap-3 text-lg ">
          <SelectValue placeholder={fonts[fontStyle].name || "Select Font"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fonts).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const LanguageSelector = () => {
  const { language, code } = useCodeValues();
  const { updateLanguage } = useCodeActions();
  // useEffect(() => {
  //   async function autoDetectLanguage() {
  //     const detectedLanguage = flourite(code);
  //     updateLanguage(detectedLanguage.language);
  //     try {
  //     } catch (error) {
  //       toast.error("Something went wront detection");
  //     }
  //   }
  //   autoDetectLanguage();
  // }, [code, updateLanguage]);
  return (
    <div>
      <Select onValueChange={(e) => updateLanguage(e)}>
        <SelectTrigger className=" border-none px-2 w-[200px] text-center flex justify-center gap-3 text-lg ">
          <SelectValue placeholder={language || "Select language"} />
        </SelectTrigger>
        <SelectContent className="">
          {Object.entries(languages).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

function MenuBar({ reff }: { reff: RefObject<HTMLDivElement> }) {
  const handleJpeg = async () => {
    const node = reff.current;
    if (!node) return;
    try {
      const url = await toJpeg(node);
      const link = document.createElement("a");
      link.href = url;
      link.download = "snippet.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePng = async () => {
    const node = reff.current;
    if (!node) return;
    try {
      const url = await toPng(node);
      const link = document.createElement("a");
      link.href = url;
      link.download = "snippet.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSvg = async () => {
    const node = reff.current;
    if (!node) return;
    try {
      const url = await toSvg(node);
      const link = document.createElement("a");
      link.href = url;
      link.download = "snippet.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] md:max-w-[600px] z-10">
      <div className="shadow-2xl p-2.5 rounded-xl border-2 flex-wrap border-gray-800 dark:bg-[#111] flex items-center justify-between">
        <div className="flex items-center gap-4 p-2">
          <FontSelector />
          <LanguageSelector />
        </div>

        <div className="flex items-center gap-4 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <CameraIcon />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleJpeg}>
                Save as Jpeg
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePng}>
                Save as Png
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSvg}>
                Save as Svg
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <Button size="icon" variant="outline">
            <GitHubLogoIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
