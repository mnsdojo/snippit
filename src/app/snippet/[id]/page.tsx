"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import PreviewEditor from "@/components/preview-editor";
import { Button } from "@/components/ui/button";
import { Copy, Share, Eye, Calendar, Code2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

function Page({ params }: { params: { id: string } }) {
  const snippet = useQuery(api.snippit.getSnippet, { slug: params.id });
  if (!snippet) return <div>Loading...</div>;
  const { title, language, code, fontStyle, fontSize, viewCount, createdAt } =
    snippet;

  const formattedDate = format(new Date(createdAt), "MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="flex flex-col min-h-dvh relative justify-center items-center">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden shadow-xl">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              {formattedDate}
            </div>
          </div>
        </div>
        <PreviewEditor
          code={code.trim()}
          language={language}
          fontStyle={fontStyle}
          title={title}
        />
      </div>
      <TooltipProvider>
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 backdrop-blur-md rounded-lg shadow-lg flex justify-center gap-4 p-4 transition-all duration-300 ease-in-out">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy snippet</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share snippet</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                <span className="ml-1">{viewCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View count</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}

export default Page;
