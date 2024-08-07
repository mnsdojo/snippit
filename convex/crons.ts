import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
// Run daily at midnight UTC
crons.daily(
  "Clear Snippets Table",
  { hourUTC: 17, minuteUTC: 30 },
  internal.snippit.clearOldSnippets
);

export default crons;
