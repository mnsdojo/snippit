import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";
import { v } from "convex/values";

const snippetArgs = {
  title: v.string(),
  code: v.string(),
  language: v.string(),
  createdAt: v.string(),
  fontStyle: v.string(),
  fontSize: v.string(),
  exposure: v.union(
    v.literal("public"),
    v.literal("private"),
    v.literal("restricted")
  ),
};

export const createSnippet = mutation({
  args: snippetArgs,
  handler: async (ctx, args) => {
    const { exposure, ...rest } = args;
    const data = {
      ...rest,
      viewCount: 0,
      slug: nanoid(10),
      exposure,
      createdAt: new Date().toISOString(),
    };
    const id = await ctx.db.insert("snippets", data);
    return { id, slug: data.slug };
  },
});

export const getSnippet = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const snippet = await ctx.db
      .query("snippets")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!snippet) {
      throw new Error("Snippet not found");
    }

    // Increment view count

    return snippet;
  },
});

export const updateSnippet = mutation({
  args: {
    id: v.id("snippets"),
    ...snippetArgs,
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
    return { success: true };
  },
});

export const deleteSnippet = mutation({
  args: { id: v.id("snippets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const listSnippets = query({
  args: {
    exposure: v.optional(
      v.union(
        v.literal("public"),
        v.literal("private"),
        v.literal("restricted")
      )
    ),
  },
  handler: async (ctx, args) => {
    let snippetsQuery = ctx.db.query("snippets").order("desc");

    if (args.exposure) {
      snippetsQuery = snippetsQuery.filter((q) =>
        q.eq(q.field("exposure"), args.exposure)
      );
    }

    return await snippetsQuery.collect();
  },
});
