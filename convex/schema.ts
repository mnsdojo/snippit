import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
  snippets: defineTable({
    title: v.string(),
    code: v.string(),
    slug: v.string(),
    viewCount: v.number(),
    language: v.string(),
    createdAt: v.string(),
    fontStyle: v.string(),
    fontSize: v.string(),
    exposure: v.union(
      v.literal("public"),
      v.literal("private"),
      v.literal("restricted")
    ),
  }),
});
