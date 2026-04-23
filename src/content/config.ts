import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    type: z.string(),
    role: z.string().optional(),
    repo: z.string().url().optional(),
    link: z.string().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    type: z.string(),
    featured: z.boolean().default(false),
    doiOrLink: z.string().url().optional(),
    note: z.string().optional()
  })
});

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { projects, publications, notes };
