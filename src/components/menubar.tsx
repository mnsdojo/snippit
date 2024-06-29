import { CameraIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { fonts, languages } from "@/lib/options";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCodeActions, useCodeValues } from "@/store/code";
import { Button } from "./ui/button";

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
  const { language } = useCodeValues();
  const { updateLanguage } = useCodeActions();
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

function MenuBar() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] md:max-w-[600px] z-10">
      <div className="shadow-2xl p-2.5 rounded-xl border-2 flex-wrap border-gray-800 dark:bg-[#111] flex items-center justify-between">
        <div className="flex items-center gap-4 p-2">
          <FontSelector />
          <LanguageSelector />
        </div>
        <div className="flex items-center gap-4 ">
          <Button size="icon" variant="outline">
            <CameraIcon />
          </Button>
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
