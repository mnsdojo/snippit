import { CameraIcon } from "@radix-ui/react-icons";
import React from "react";

const FontSelector = () => {
  return <div></div>;
};

const LanguageSelector = () => {
  return <div></div>;
};

function MenuBar() {
  return (
    <div>
      <div className="shadow-2xl rounded-xl min-w-[400px] border-2 border-gray-800 dark:bg[#111]">
        <div className="grid grid-cols-3 gap-3 p-2">
          <FontSelector />
          <LanguageSelector />
          <CameraIcon className="cursor-pointer hover:text-gray-300 shadow-lg" />

        </div>
      </div>
    </div>
  );
}

export default MenuBar;
