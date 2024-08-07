"use client";
import React, { RefObject, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CameraIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Save, Share } from "lucide-react";
import { toJpeg } from "html-to-image";
import { ModeToggle } from "./mode-toggle";
import { useCodeActions, useCodeValues } from "@/store/code";
import { fonts, languages } from "@/lib/options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import toast from "react-hot-toast";

const FontSelector = () => {
  const { fontStyle } = useCodeValues();
  const { updateFontStyle } = useCodeActions();
  return (
    <Select onValueChange={updateFontStyle}>
      <SelectTrigger className="border-none px-2 w-[150px] text-center flex justify-center gap-3">
        <SelectValue placeholder={fonts[fontStyle].name || "Font"} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(fonts).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const LanguageSelector = () => {
  const { language } = useCodeValues();
  const { updateLanguage } = useCodeActions();
  return (
    <Select onValueChange={updateLanguage}>
      <SelectTrigger className="border-none px-2 w-[150px] text-center flex justify-center gap-3">
        <SelectValue placeholder={language || "Language"} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

function MenuBar({ reff }: { reff: RefObject<HTMLDivElement> }) {
  const createSnippet = useMutation(api.snippit.createSnippet);
  const { language, code, fontStyle, title, fontSize } = useCodeValues();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [snippetUrl, setSnippetUrl] = useState("");

  const handleExport = async () => {
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
      toast.error("Failed to export image. Please try again.");
    }
  };

  const handleSave = async () => {
    const trimmedTitle = title?.trim() || "";
    const trimmedCode = code?.trim() || "";

    if (trimmedTitle === "") {
      toast.error("Please provide a title for your snippet.");
      return;
    }

    if (trimmedCode === "") {
      toast.error("Please add some code to your snippet.");
      return;
    }

    if (!language) {
      toast.error("Please select a language for your snippet.");
      return;
    }

    try {
      const result = await createSnippet({
        title: trimmedTitle,
        code: trimmedCode,
        language,
        createdAt: new Date().toISOString(),
        fontStyle,
        fontSize: fontSize.toString(),
        exposure: "public",
      });

      if (result && result.slug) {
        const url = `${window.location.origin}/snippet/${result.slug}`;
        setSnippetUrl(url);
        setShowShareDialog(true);
        toast.success("Snippet saved successfully!");
      } else {
        toast.error("Failed to save snippet. Please try again.");
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        toast.error(
          "A similar snippet already exists. Please modify your snippet."
        );
      } else {
        toast.error("An error occurred while saving the snippet.");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Code Snippet",
          text: "Check out this code snippet!",
          url: snippetUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(snippetUrl).then(
        () => toast.success("Link copied to clipboard!"),
        (err) => console.error("Could not copy text: ", err)
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] md:max-w-[600px] z-10">
        <div className="shadow-2xl p-2.5 rounded-xl border-2 flex-wrap border-gray-800 dark:bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontSelector />
            <LanguageSelector />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleExport}>
              <CameraIcon />
            </Button>
            <ModeToggle />
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button size="icon" variant="outline">
              <GitHubLogoIcon />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Snippet</DialogTitle>
            <DialogDescription>
              Your snippet has been saved. You can now share it using this link:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <input
              value={snippetUrl}
              readOnly
              className="flex-grow p-2 border rounded"
            />
            <Button variant="outline" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MenuBar;
