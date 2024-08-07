"use client";
import React, { RefObject, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CameraIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Save, Share } from "lucide-react";
import { toJpeg, toPng, toSvg } from "html-to-image";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
    <div>
      <Select
        onValueChange={(e) => {
          updateFontStyle(e);
        }}
      >
        <SelectTrigger className="border-none px-2 w-[200px] text-center flex justify-center gap-3 text-lg">
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
        <SelectTrigger className="border-none px-2 w-[200px] text-center flex justify-center gap-3 text-lg">
          <SelectValue placeholder={language || "Select language"} />
        </SelectTrigger>
        <SelectContent>
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
  const router = useRouter();
  const createSnippet = useMutation(api.snippit.createSnippet);
  const { language, code, fontStyle } = useCodeValues();
  const [title, setTitle] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [snippetUrl, setSnippetUrl] = useState("");

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

  const handleSave = async () => {
    try {
      const result = await createSnippet({
        title,
        code,
        language,
        createdAt: new Date().toISOString(),
        fontStyle,
        fontSize: "16px", // You might want to make this dynamic
        exposure: "public", // You might want to add an option for this
      });

      if (result && result.slug) {
        const url = `${window.location.origin}/snippet/${result.slug}`;
        setSnippetUrl(url);
        setShowShareDialog(true);
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: "Check out this code snippet!",
          url: snippetUrl,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(snippetUrl).then(
        () => {
          toast.success("Link copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[90%] md:max-w-[600px] z-10">
        <div className="shadow-2xl p-2.5 rounded-xl border-2 flex-wrap border-gray-800 dark:bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-4 p-2">
            <FontSelector />
            <LanguageSelector />
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Snippet Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-[150px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <CameraIcon />
                  <span className="sr-only">Export image</span>
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
          <Input value={snippetUrl} readOnly />
          <Button onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MenuBar;
